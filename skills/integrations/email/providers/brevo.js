/**
 * providers/brevo.js — Brevo email provider
 *
 * Capabilities:
 *   ✅ sendEmail()         — transactional one-off
 *   ✅ enrollLead()        — sequence automation via Brevo Automations
 *   ✅ enrollCustomer()    — sequence automation via Brevo Automations
 *   ✅ enrollAbandoned()   — sequence automation via Brevo Automations
 *   ✅ updateContact()     — contact attribute management
 *
 * Required env:
 *   BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
 *   BREVO_LIST_ID_LEADS, BREVO_LIST_ID_CUSTOMERS, BREVO_LIST_ID_REENGAGEMENT, BREVO_LIST_ID_ABANDONED
 *
 * Content ownership (sequences live in owning skills, not here):
 *   Lead nurture     → skills/funnel/leads-funnel/references/email-lead-nurture.md
 *   Post-purchase    → skills/deliver/email-sequence/templates/sequences.md
 *   Abandoned cart   → skills/funnel/abandoned-order/SKILL.md
 *   Delivery email   → skills/deliver/delivery-automation/templates/delivery-email.html
 */

const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

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

async function _upsertContact({ email, name, attributes, listId }) {
  if (!listId) return;
  const body = new SibApiV3Sdk.CreateContact();
  body.email         = email;
  body.attributes    = attributes;
  body.listIds       = [listId];
  body.updateEnabled = true;
  await _ctApi().createContact(body);
}

// ── Public API ────────────────────────────────────────────────────────────────

async function sendEmail({ email, name, subject, htmlContent }) {
  if (!process.env.BREVO_API_KEY) return;
  const send = new SibApiV3Sdk.SendSmtpEmail();
  send.sender      = { name: process.env.BREVO_SENDER_NAME || 'AI Agent Kit', email: process.env.BREVO_SENDER_EMAIL };
  send.to          = [{ email, name: name || '' }];
  send.subject     = subject;
  send.htmlContent = htmlContent;
  await _txApi().sendTransacEmail(send);
}

async function enrollLead({ email, name = '', source = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email, name,
    attributes: { FIRSTNAME: name, SOURCE: source },
    listId: _listId('BREVO_LIST_ID_LEADS'),
  });
}

async function enrollCustomer({ email, name = '', product = '', purchaseDate, funnelSlug = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email, name,
    attributes: {
      FIRSTNAME:     name,
      PRODUCT:       product,
      PURCHASE_DATE: purchaseDate || new Date().toISOString().split('T')[0],
      SOURCE:        funnelSlug,
    },
    listId: _listId('BREVO_LIST_ID_CUSTOMERS'),
  });
}

async function enrollAbandoned({ email, name = '', product = '', amount = '', orderId = '', checkoutLink = '' }) {
  if (!process.env.BREVO_API_KEY) return;
  await _upsertContact({
    email, name,
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

async function updateContact({ email, attributes }) {
  if (!process.env.BREVO_API_KEY) return;
  const body = new SibApiV3Sdk.UpdateContact();
  body.attributes = attributes;
  await _ctApi().updateContact(email, body);
}

module.exports = { sendEmail, enrollLead, enrollCustomer, enrollAbandoned, updateContact };
