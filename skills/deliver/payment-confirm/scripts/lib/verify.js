import crypto from 'crypto';

/**
 * Verify SePay webhook HMAC-SHA256 signature
 * Uses timing-safe comparison to prevent timing attacks
 */
export function verifySignature(rawBody, signature, secret) {
  if (!secret) {
    console.warn('SEPAY_WEBHOOK_SECRET not set — skipping verification (unsafe)');
    return true;
  }
  if (!signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature.replace(/^sha256=/, ''), 'hex')
    );
  } catch {
    return false;
  }
}
