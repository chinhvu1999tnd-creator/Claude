/**
 * brevo.js — Brevo transport module (infrastructure only)
 *
 * Chỉ xử lý: API calls đến Brevo.
 * KHÔNG chứa email content, KHÔNG biết sequence copy sống ở đâu.
 *
 * Email content ownership:
 *   - Delivery email template  → skills/deliver/delivery-automation/templates/delivery-email.html
 *   - Post-purchase sequences  → skills/deliver/email-sequence/templates/sequences.md
 *   - Lead nurture sequence    → skills/funnel/leads-funnel/references/email-lead-nurture.md
 *   - Brevo Automation setup   → skills/integrations/brevo/sequence-setup-guide.md
 */

const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

// ── API clients ──────────────────────────────────────────────────────────────
function _txApi() {
  const api = new SibApiV3Sdk.TransactionalEmailsApi();
  api.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
  return api;
}

function _ctApi() {
  const api = new SibApiV3Sdk.ContactsApi();
  api.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
  return api;
}

function _listId(key) {
  const id = process.env[key];
  return id ? parseInt(id) : null;
}

// ── Internal: upsert contact vào list ───────────────────────────────────────
async function _upsertContact({ email, name, attributes, listId }) {
  if (!listId) return; // list chưa setup → skip silently
  const body = new SibApiV3Sdk.CreateContact();
  body.email         = email;
  body.attributes    = attributes;
  body.listIds       = [listId];
  body.updateEnabled = true;
  await _ctApi().createContact(body);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Gửi transactional email một lần (delivery email, không phải sequence).
 *
 * Caller chịu trách nhiệm load HTML template và truyền vào.
 * Template lives in: skills/deliver/delivery-automation/templates/delivery-email.html
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.name
 * @param {string} params.subject
 * @param {string} params.htmlContent  — HTML đã render với variables replaced
 */
async function sendEmail({ email, name, subject, htmlContent }) {
  if (!process.env.BREVO_API_KEY) return;

  const send = new SibApiV3Sdk.SendSmtpEmail();
  send.sender      = {
    name:  process.env.BREVO_SENDER_NAME  || 'AI Agent Kit',
    email: process.env.BREVO_SENDER_EMAIL,
  };
  send.to          = [{ email, name: name || '' }];
  send.subject     = subject;
  send.htmlContent = htmlContent;

  await _txApi().sendTransacEmail(send);
}

/**
 * Enroll lead sau opt-in → Brevo "Leads" list → trigger lead-nurture sequence.
 * Sequence copy: skills/funnel/leads-funnel/references/email-lead-nurture.md
 *
 * @param {{ email, name, source }} params
 */
async function enrollLead({ email, name = '', source = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email,
    name,
    attributes: {
      FIRSTNAME: name,
      SOURCE:    source,
    },
    listId: _listId('BREVO_LIST_ID_LEADS'),
  });
}

/**
 * Enroll customer sau payment → Brevo "Customers" list → trigger onboarding sequence.
 * Sequence copy: skills/deliver/email-sequence/templates/sequences.md
 *
 * Scenario A: gọi từ Customer Portal webhook-sepay (sau khi Resend đã gửi magic link)
 * Scenario B: gọi từ funnel webhook.js (kết hợp với sendEmail delivery)
 *
 * @param {{ email, name, product, purchaseDate, funnelSlug }} params
 */
async function enrollCustomer({ email, name = '', product = '', purchaseDate, funnelSlug = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email,
    name,
    attributes: {
      FIRSTNAME:     name,
      PRODUCT:       product,
      PURCHASE_DATE: purchaseDate || new Date().toISOString().split('T')[0],
      SOURCE:        funnelSlug,
    },
    listId: _listId('BREVO_LIST_ID_CUSTOMERS'),
  });
}

/**
 * Enroll abandoned order contact → Brevo "Abandoned Cart" list → trigger recovery sequence.
 * Gọi từ api/webhook.js sau khi order tạo nhưng payment còn pending sau 30 phút.
 *
 * @param {{ email, name, product, amount, orderId, checkoutLink }} params
 */
async function enrollAbandoned({ email, name = '', product = '', amount = '', orderId = '', checkoutLink = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email,
    name,
    attributes: {
      FIRSTNAME:     name,
      PRODUCT:       product,
      AMOUNT:        String(amount),
      ORDER_ID:      orderId,
      CHECKOUT_LINK: checkoutLink,
    },
    listId: _listId('BREVO_LIST_ID_ABANDONED'),
  });
}

/**
 * Cập nhật attribute của contact.
 * Dùng khi Customer Portal grant/revoke access, update status, v.v.
 *
 * @param {{ email, attributes }} params
 */
async function updateContact({ email, attributes }) {
  if (!process.env.BREVO_API_KEY) return;
  const body = new SibApiV3Sdk.UpdateContact();
  body.attributes = attributes;
  await _ctApi().updateContact(email, body);
}

module.exports = { sendEmail, enrollLead, enrollCustomer, enrollAbandoned, updateContact };
