/**
 * sepay-client.js — SePay Transactions API wrapper (revenue query)
 *
 * Dùng bởi: Analysis Agent (/analyze revenue --sepay), /revenue command
 *
 * API: https://my.sepay.vn/userapi/
 * Docs: https://docs.sepay.vn
 *
 * Cần: SEPAY_API_TOKEN trong .env (khác SEPAY_WEBHOOK_API_KEY)
 */

const SEPAY_API_BASE = 'https://my.sepay.vn/userapi'

/**
 * Fetch transactions list với filters.
 *
 * @param {object} opts - { token?, accountNumber?, dateMin?, dateMax?, sinceId?, limit? }
 * @returns {Promise<Array>} transactions: [{ id, amount_in, amount_out, transaction_date, accumulated, account_number }]
 */
export async function getTransactions(opts = {}) {
  const token = opts.token || process.env.SEPAY_API_TOKEN
  if (!token) {
    throw new SePayError('SEPAY_API_TOKEN missing trong .env. Lấy tại my.sepay.vn → API Token.')
  }

  const params = new URLSearchParams()
  if (opts.accountNumber) params.set('account_number', opts.accountNumber)
  if (opts.dateMin) params.set('transaction_date_min', opts.dateMin)  // yyyy-mm-dd
  if (opts.dateMax) params.set('transaction_date_max', opts.dateMax)
  if (opts.sinceId) params.set('since_id', String(opts.sinceId))
  params.set('limit', String(opts.limit || 5000))

  const url = `${SEPAY_API_BASE}/transactions/list?${params.toString()}`

  let response
  try {
    response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
  } catch (err) {
    throw new SePayError(`Network error: ${err.message}`)
  }

  if (!response.ok) {
    if (response.status === 401) throw new SePayError('SEPAY_API_TOKEN invalid hoặc hết hạn')
    throw new SePayError(`SePay API error: HTTP ${response.status}`)
  }

  const data = await response.json()
  // SePay trả { status, messages, transactions: [...] } hoặc { data: [...] } tuỳ version
  return data.transactions || data.data || []
}

/**
 * Tính tổng doanh thu (tiền vào) trong khoảng thời gian.
 *
 * @param {object} opts - { token?, accountNumber?, dateMin, dateMax }
 * @returns {Promise<{ totalIn, totalOut, net, count, transactions, balance }>}
 */
export async function getRevenue(opts = {}) {
  const txns = await getTransactions(opts)

  let totalIn = 0
  let totalOut = 0
  for (const t of txns) {
    totalIn += parseFloat(t.amount_in || 0)
    totalOut += parseFloat(t.amount_out || 0)
  }

  // Balance = accumulated của transaction mới nhất (đầu list, SePay sort desc)
  const balance = txns.length > 0 ? parseFloat(txns[0].accumulated || 0) : null

  return {
    totalIn,
    totalOut,
    net: totalIn - totalOut,
    count: txns.length,
    transactions: txns,
    balance,
  }
}

/**
 * Số dư tài khoản hiện tại (accumulated của giao dịch mới nhất).
 *
 * @returns {Promise<number|null>}
 */
export async function getBalance(opts = {}) {
  const txns = await getTransactions({ ...opts, limit: 1 })
  return txns.length > 0 ? parseFloat(txns[0].accumulated || 0) : null
}

/**
 * Giao dịch mới kể từ ID đã biết (cho "có đơn mới không?").
 *
 * @param {number} sinceId
 * @returns {Promise<Array>}
 */
export async function getNewSince(sinceId, opts = {}) {
  return getTransactions({ ...opts, sinceId })
}

// ─── Date helpers (VN timezone GMT+7) ──────────────────────────────────────
export function dateRange(period) {
  const now = new Date()
  const fmt = (d) => d.toISOString().slice(0, 10)  // yyyy-mm-dd

  switch (period) {
    case 'today': {
      const d = fmt(now)
      return { dateMin: d, dateMax: d }
    }
    case 'week': {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      return { dateMin: fmt(start), dateMax: fmt(now) }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { dateMin: fmt(start), dateMax: fmt(now) }
    }
    case 'last-month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { dateMin: fmt(start), dateMax: fmt(end) }
    }
    default:
      return {}
  }
}

// ─── Format VND ────────────────────────────────────────────────────────────
export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' VND'
}

// ─── Verify token ──────────────────────────────────────────────────────────
export async function verifyToken(token = process.env.SEPAY_API_TOKEN) {
  if (!token) throw new SePayError('SEPAY_API_TOKEN missing')
  // Thử fetch 1 transaction để verify token works
  await getTransactions({ token, limit: 1 })
  return true
}

export class SePayError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SePayError'
  }
}
