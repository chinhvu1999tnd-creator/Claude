#!/usr/bin/env node
/**
 * test-webhook.js — Simulate a SePay webhook for local testing
 * Usage: node test-webhook.js --order DH-LK3M9P2A-K7X2 --amount 997000
 */

import { parseArgs } from 'util';
import { matchOrder } from './lib/matcher.js';
import { notifyConfirmed } from './lib/notify.js';

const { values: args } = parseArgs({
  options: {
    order:  { type: 'string', default: 'DH-TEST-0001' },
    amount: { type: 'string', default: '997000' },
    name:   { type: 'string', default: 'Nguyen Van Test' },
  }
});

// Simulate SePay webhook payload
const testPayload = {
  id: 'TEST-' + Date.now(),
  gateway: 'VCB',
  transactionDate: new Date().toISOString(),
  accountNumber: '1234567890',
  code: null,
  content: `Chuyen khoan ${args.order} thanh toan`,
  transferType: 'in',
  transferAmount: parseInt(args.amount),
  accumulated: parseInt(args.amount),
  referenceCode: 'REF-' + Date.now(),
  description: `Test payment for ${args.order}`,
  bankBrandName: 'Vietcombank',
  virtualAccount: null,
};

console.log('\nSimulating SePay webhook...');
console.log('Payload:', JSON.stringify(testPayload, null, 2));

try {
  const result = await matchOrder(testPayload);
  console.log('\nMatch result:', result);

  if (result.matched) {
    await notifyConfirmed(result.order, testPayload);
    console.log('\nNotification sent!');
  }
} catch (err) {
  console.error('\nError:', err.message);
}
