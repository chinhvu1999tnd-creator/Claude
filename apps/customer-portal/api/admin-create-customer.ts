// api/admin-create-customer.ts — Vercel Serverless Function
// Tạo Khách hàng / Convert KHTN — chỉ server-side dùng service_role key

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))
  if (req.method === 'OPTIONS') return res.status(200).json({})
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // 1. Verify caller là admin/sales qua JWT
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Thiếu token xác thực' })
  const userToken = authHeader.slice(7)

  const userClient = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${userToken}` } } }
  )
  const { data: { user }, error: userErr } = await userClient.auth.getUser()
  if (userErr || !user) return res.status(401).json({ error: 'Token không hợp lệ' })

  const { data: caller } = await userClient.from('customers').select('role').eq('id', user.id).maybeSingle()
  if (!caller || !['admin', 'sales'].includes(caller.role)) {
    return res.status(403).json({ error: 'Chỉ admin/sales được thực hiện' })
  }

  // 2. Service role client
  const admin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const {
      email,
      display_name,
      role = 'student',
      email_mode = 'magic_link',   // 'magic_link' | 'password'
      password: customPassword,
      send_magic_link,
      enroll_course_id,
      enroll_cohort,
      enroll_start_date,
      grant_product_id,
      grant_product_ids,
      convert_lead_id,
      lead_id: lead_id_body,
      amount,
      order_note,
    } = req.body || {}

    const lead_id = convert_lead_id || lead_id_body
    const productIds: string[] = [
      ...(grant_product_ids || []),
      ...(grant_product_id ? [grant_product_id] : []),
    ].filter(Boolean)

    if (!email) return res.status(400).json({ error: 'Email bắt buộc' })
    if (email_mode === 'password' && !customPassword) {
      return res.status(400).json({ error: 'Mật khẩu bắt buộc khi chọn mode password' })
    }

    const emailLower = email.trim().toLowerCase()

    // 3. Đọc app name + Resend key từ app_settings
    const { data: settingsRows } = await admin.from('app_settings').select('key, value').in('key', ['title', 'resend_api_key'])
    const settingsMap: Record<string, any> = {}
    ;(settingsRows || []).forEach((r: any) => { settingsMap[r.key] = r.value })
    const appName: string = settingsMap['title']?.value || 'Portal'
    // Ưu tiên: env var > app_settings (env var set trên Vercel dashboard)
    const resendApiKey: string = process.env.RESEND_API_KEY || settingsMap['resend_api_key']?.value || ''

    // 4. Kiểm tra user đã tồn tại chưa
    const listRes = await admin.auth.admin.listUsers()
    const existingUsers = (listRes.data?.users || []) as Array<{ id: string; email?: string }>
    const existing = existingUsers.find(u => u.email === emailLower)

    let userId: string
    let created = false
    const finalPassword = email_mode === 'password' ? customPassword : (Math.random().toString(36).slice(-10) + 'Aa1!')

    if (existing) {
      userId = existing.id
      // Update password nếu admin đặt mới
      if (email_mode === 'password') {
        await admin.auth.admin.updateUserById(userId, { password: finalPassword })
      }
    } else {
      const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
        email: emailLower,
        password: finalPassword,
        email_confirm: true,
      })
      if (createErr || !newUser?.user) {
        return res.status(500).json({ error: createErr?.message || 'Không tạo được tài khoản' })
      }
      userId = newUser.user.id
      created = true
    }

    // 5. Upsert customer profile
    const paymentStatus = (amount && amount > 0) ? 'paid' : 'pending'
    await admin.from('customers').upsert({
      id: userId,
      email: emailLower,
      display_name: display_name || emailLower.split('@')[0],
      role,
      payment_status: paymentStatus,
    })

    // 6. Enroll vào course nếu có
    let enrollmentId: string | null = null
    if (enroll_course_id) {
      const { data: enr } = await admin.from('customer_courses').upsert({
        customer_id: userId,
        course_id: enroll_course_id,
        cohort: enroll_cohort || null,
        start_date: enroll_start_date || null,
        status: 'active',
        granted_by: user.id,
      }, { onConflict: 'customer_id,course_id' }).select('id').single()
      enrollmentId = enr?.id || null
    }

    // 7. Grant digital products nếu có
    if (productIds.length > 0) {
      await Promise.all(productIds.map(pid =>
        admin.from('customer_products').upsert({
          customer_id: userId,
          product_id: pid,
          granted_by: user.id,
        }, { onConflict: 'customer_id,product_id' })
      ))
    }

    // 8. Payment record nếu có amount
    if (amount && Number(amount) > 0) {
      await admin.from('payments').insert({
        student_id: userId,
        lead_id: lead_id || null,
        course_id: enroll_course_id || null,
        enrollment_id: enrollmentId,
        product_id: productIds[0] || null,
        amount: Number(amount),
        currency: 'VND',
        status: 'completed',
        gateway: 'manual',
        gateway_ref: `MANUAL-${Date.now()}`,
        order_note: order_note || null,
      })
    }

    // 9. Convert lead nếu có
    if (lead_id) {
      await admin.from('leads').update({
        converted_at: new Date().toISOString(),
        converted_to: userId,
      }).eq('id', lead_id)
      await admin.from('care_history').insert({
        lead_id,
        type: 'note',
        content: 'Chuyển đổi thành Khách hàng',
        created_by: user.id,
      })
    }

    // 10. Gửi email
    const origin = (req.headers.origin as string) || process.env.VERCEL_URL || 'http://localhost:5009'
    const portalUrl = origin.startsWith('http') ? origin : `https://${origin}`
    const customerName = display_name || emailLower.split('@')[0]

    if (email_mode === 'password' && resendApiKey) {
      // --- Gửi email có thương hiệu + credentials qua Resend ---
      const resend = new Resend(resendApiKey)
      await resend.emails.send({
        from: `${appName} <onboarding@resend.dev>`,
        to: emailLower,
        subject: `Thông tin đăng nhập ${appName}`,
        html: buildWelcomeEmail({ appName, name: customerName, email: emailLower, password: finalPassword, portalUrl }),
      })
    } else if ((email_mode === 'magic_link' || send_magic_link) && (created || send_magic_link)) {
      // --- Magic link qua Supabase ---
      await admin.auth.admin.generateLink({
        type: 'magiclink',
        email: emailLower,
        options: { redirectTo: portalUrl },
      })
    }

    return res.json({ success: true, userId, email: emailLower, created })
  } catch (err: any) {
    console.error('admin-create-customer error:', err)
    return res.status(500).json({ error: err.message || 'Lỗi không xác định' })
  }
}

function buildWelcomeEmail(p: {
  appName: string; name: string; email: string; password: string; portalUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;max-width:560px;width:100%">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #1a1a1a">
            <p style="margin:0;font-size:22px;font-weight:700;color:#fff">${p.appName}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px">
            <p style="margin:0 0 16px;font-size:16px;color:#e5e5e5">Xin chào <strong>${p.name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:14px;color:#a0a0a0;line-height:1.6">
              Tài khoản của bạn trên <strong style="color:#fff">${p.appName}</strong> đã được tạo. Dưới đây là thông tin đăng nhập:
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:8px;margin-bottom:28px">
              <tr>
                <td style="padding:20px 24px">
                  <p style="margin:0 0 12px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Email</p>
                  <p style="margin:0 0 20px;font-size:15px;color:#fff;font-family:monospace">${p.email}</p>
                  <p style="margin:0 0 12px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Mật khẩu</p>
                  <p style="margin:0;font-size:18px;color:#b6ff00;font-family:monospace;font-weight:700;letter-spacing:2px">${p.password}</p>
                </td>
              </tr>
            </table>

            <!-- CTA button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${p.portalUrl}" style="display:inline-block;padding:14px 36px;background:#b6ff00;color:#000;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px">
                    Truy cập ${p.appName} →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:24px 0 0;font-size:12px;color:#555;text-align:center">
              Bạn nên đổi mật khẩu sau lần đăng nhập đầu tiên.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #1a1a1a;text-align:center">
            <p style="margin:0;font-size:12px;color:#444">Được gửi từ ${p.appName}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
