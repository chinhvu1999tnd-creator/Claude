/**
 * providers/resend.js — Resend email provider
 *
 * Capabilities:
 *   ✅ sendEmail()         — transactional one-off (excellent deliverability)
 *   ⚠️  enrollLead()       — gửi Email 1 ngay, KHÔNG schedule follow-up sequence
 *   ⚠️  enrollCustomer()   — gửi Email 1 ngay, KHÔNG schedule follow-up sequence
 *   ⚠️  enrollAbandoned()  — gửi Email 1 ngay, KHÔNG schedule follow-up sequence
 *   ❌  updateContact()    — Resend không có contact management
 *
 * Resend không có built-in automation sequences.
 * Để dùng full drip sequence → chuyển sang EMAIL_PROVIDER=brevo
 *
 * Required env:
 *   RESEND_API_KEY, RESEND_SENDER_EMAIL, RESEND_SENDER_NAME
 *
 * Sequence templates (Email 1 của mỗi loại):
 *   Lead welcome      → skills/funnel/leads-funnel/references/email-lead-nurture.md (Email 1)
 *   Customer onboard  → skills/deliver/email-sequence/templates/sequences.md (Onboarding Email 1)
 *   Abandoned cart    → skills/funnel/abandoned-order/SKILL.md (Email 1)
 */

const { Resend } = require('resend');
require('dotenv').config();

function _client() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY chưa có trong .env');
  return new Resend(process.env.RESEND_API_KEY);
}

function _from() {
  const name  = process.env.RESEND_SENDER_NAME  || 'AI Agent Kit';
  const email = process.env.RESEND_SENDER_EMAIL;
  if (!email) throw new Error('RESEND_SENDER_EMAIL chưa có trong .env');
  return `${name} <${email}>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

async function sendEmail({ email, name, subject, htmlContent }) {
  if (!process.env.RESEND_API_KEY) return;
  await _client().emails.send({ from: _from(), to: [email], subject, html: htmlContent });
}

/**
 * Resend: không có sequence automation.
 * enrollLead chỉ gửi Email 1 (welcome + lead magnet delivery).
 * Caller phải load template từ skills/funnel/leads-funnel/references/email-lead-nurture.md
 * và truyền qua sendEmail() thay vì dùng hàm này.
 *
 * Nếu cần full 5-email nurture sequence → EMAIL_PROVIDER=brevo
 */
async function enrollLead({ email, name = '', source = '' }) {
  if (!process.env.RESEND_API_KEY) return;
  console.warn(
    '[email/resend] enrollLead: Resend không hỗ trợ sequence automation.\n' +
    '  → Chỉ gửi được Email 1. Dùng EMAIL_PROVIDER=brevo để có full 5-email sequence.\n' +
    '  → Hoặc dùng sendEmail() để tự gửi từng email theo lịch riêng.'
  );
  // No-op: sequence must be handled by caller with a scheduler (cron, n8n, etc.)
}

/**
 * Resend: không có sequence automation.
 * enrollCustomer chỉ phù hợp nếu caller tự schedule onboarding emails.
 * Nếu cần full 7-email onboarding sequence → EMAIL_PROVIDER=brevo
 */
async function enrollCustomer({ email, name = '', product = '', purchaseDate, funnelSlug = '' }) {
  if (!process.env.RESEND_API_KEY) return;
  console.warn(
    '[email/resend] enrollCustomer: Resend không hỗ trợ sequence automation.\n' +
    '  → Dùng EMAIL_PROVIDER=brevo để có full onboarding sequence tự động.'
  );
}

/**
 * Resend: không có sequence automation.
 * enrollAbandoned chỉ phù hợp nếu caller tự schedule recovery emails.
 */
async function enrollAbandoned({ email, name = '', product = '', amount = '', orderId = '', checkoutLink = '' }) {
  if (!process.env.RESEND_API_KEY) return;
  console.warn(
    '[email/resend] enrollAbandoned: Resend không hỗ trợ sequence automation.\n' +
    '  → Dùng EMAIL_PROVIDER=brevo để có full abandoned cart recovery sequence.'
  );
}

/**
 * Resend không có contact management.
 */
async function updateContact({ email, attributes }) {
  // No-op — Resend is stateless transactional, not a CRM
}

module.exports = { sendEmail, enrollLead, enrollCustomer, enrollAbandoned, updateContact };
