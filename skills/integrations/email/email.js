/**
 * email.js — Provider-agnostic email transport
 *
 * Skills và webhooks chỉ gọi file này — không import provider trực tiếp.
 * Provider được chọn qua EMAIL_PROVIDER trong .env.
 *
 * Supported providers:
 *   brevo   — sequences + transactional (default, recommended)
 *   resend  — transactional only (không có sequence automation)
 *
 * Usage:
 *   const { enrollLead, enrollCustomer, enrollAbandoned, sendEmail } = require('./email');
 *
 * .env:
 *   EMAIL_PROVIDER=brevo   # hoặc resend
 */

require('dotenv').config();

const PROVIDER = (process.env.EMAIL_PROVIDER || 'brevo').toLowerCase().trim();

let impl;
try {
  impl = require(`./providers/${PROVIDER}`);
} catch (e) {
  throw new Error(
    `[email] Provider "${PROVIDER}" không tìm thấy.\n` +
    `  → Kiểm tra EMAIL_PROVIDER trong .env (brevo | resend)\n` +
    `  → Đảm bảo providers/${PROVIDER}.js tồn tại`
  );
}

/**
 * Gửi transactional email một lần.
 * Caller load HTML template và replace variables trước khi gọi.
 * Template: skills/email-marketing/delivery-automation/templates/delivery-email.html
 */
async function sendEmail(params) {
  return impl.sendEmail(params);
}

/**
 * Enroll lead sau opt-in → trigger lead nurture sequence.
 * Brevo: contact vào "Leads" list → Automation sequence 5 emails / 7 ngày
 * Resend: no-op sequence (chỉ gửi được Email 1 thủ công qua sendEmail)
 * Sequence copy: skills/email-marketing/lead-nurture/email-lead-nurture.md
 */
async function enrollLead(params) {
  return impl.enrollLead(params);
}

/**
 * Enroll customer sau payment → trigger onboarding sequence.
 * Brevo: contact vào "Customers" list → Automation sequence 7 emails / 10 ngày
 * Resend: no-op sequence (xem warning trong providers/resend.js)
 * Sequence copy: skills/email-marketing/email-sequence/templates/sequences.md
 */
async function enrollCustomer(params) {
  return impl.enrollCustomer(params);
}

/**
 * Enroll abandoned order → trigger recovery sequence.
 * Brevo: contact vào "Abandoned Cart" list → Automation 3 emails / 48h
 * Resend: no-op sequence (xem warning trong providers/resend.js)
 * Stop khi: contact mua hàng → remove from Abandoned Cart list
 * Sequence spec: skills/email-marketing/abandoned-cart/SKILL.md
 */
async function enrollAbandoned(params) {
  return impl.enrollAbandoned(params);
}

/**
 * Cập nhật attribute của contact.
 * Dùng khi Customer Portal grant/revoke access, update status, v.v.
 * Resend: no-op (không có contact management)
 */
async function updateContact(params) {
  return impl.updateContact(params);
}

module.exports = { sendEmail, enrollLead, enrollCustomer, enrollAbandoned, updateContact };
