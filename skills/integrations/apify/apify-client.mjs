/**
 * apify-client.js — Reusable Apify API wrapper
 *
 * Dùng bởi: Analysis Agent, Offer Agent, Ads Agent, Sale DM Agent
 *
 * Pattern: import { runActor } from './apify-client.js'
 *          const data = await runActor('actor-id', { input })
 *
 * Docs: https://docs.apify.com/api/v2
 */

const APIFY_API_BASE = 'https://api.apify.com/v2'

/**
 * Run an Apify actor synchronously and return parsed results.
 *
 * @param {string} actorId - VD: 'apify/facebook-pages-scraper' hoặc 'clockworks/free-tiktok-scraper'
 * @param {object} input - Actor-specific input (xem actor docs trên Apify)
 * @param {object} options - { token?, timeoutSecs?, memoryMbytes? }
 * @returns {Promise<Array>} - Array of items scraped
 */
export async function runActor(actorId, input, options = {}) {
  const token = options.token || process.env.APIFY_TOKEN
  if (!token) {
    throw new ApifyError('APIFY_TOKEN missing in .env. Setup via /coach setup apify hoặc thêm thủ công.')
  }

  const actorPath = actorId.replace('/', '~')  // Apify URL format
  const url = `${APIFY_API_BASE}/acts/${actorPath}/run-sync-get-dataset-items?token=${token}`

  const requestOpts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }
  if (options.timeoutSecs) requestOpts.headers['timeout'] = options.timeoutSecs
  if (options.memoryMbytes) requestOpts.headers['memory'] = options.memoryMbytes

  const startTime = Date.now()
  console.log(`[Apify] Running ${actorId}...`)

  try {
    const response = await fetch(url, requestOpts)
    const elapsed = Math.round((Date.now() - startTime) / 1000)

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApifyError(`Actor ${actorId} failed (HTTP ${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log(`[Apify] ✓ ${actorId} returned ${data.length} items in ${elapsed}s`)
    return data
  } catch (err) {
    if (err instanceof ApifyError) throw err
    throw new ApifyError(`Actor ${actorId} network error: ${err.message}`)
  }
}

/**
 * Check user's Apify usage + remaining credit.
 *
 * @returns {Promise<{currentMonthUsageUsd, monthlyUsageLimitUsd, hasFreeTier}>}
 */
export async function getUsage(token = process.env.APIFY_TOKEN) {
  if (!token) throw new ApifyError('APIFY_TOKEN missing')

  const response = await fetch(`${APIFY_API_BASE}/users/me/usage/monthly?token=${token}`)
  if (!response.ok) throw new ApifyError(`Usage check failed: HTTP ${response.status}`)

  const { data } = await response.json()
  return {
    currentMonthUsageUsd: data.monthlyServiceUsage?.totalUsageUsd || 0,
    monthlyUsageLimitUsd: data.monthlyUsageLimitUsd || 5,  // free tier default
    hasFreeTier: data.plan === 'FREE',
  }
}

/**
 * Verify token is valid + return user info.
 *
 * @returns {Promise<{username, email, plan}>}
 */
export async function verifyToken(token = process.env.APIFY_TOKEN) {
  if (!token) throw new ApifyError('APIFY_TOKEN missing')

  const response = await fetch(`${APIFY_API_BASE}/users/me?token=${token}`)
  if (!response.ok) {
    if (response.status === 401) throw new ApifyError('APIFY_TOKEN invalid hoặc đã revoke')
    throw new ApifyError(`Token verify failed: HTTP ${response.status}`)
  }

  const { data } = await response.json()
  return { username: data.username, email: data.email, plan: data.plan }
}

/**
 * Cost estimator — Agent show cho user trước khi chạy actor.
 *
 * Note: Actual cost depends on actor + input size + run duration.
 * Đây là estimate dựa trên actor catalog phổ biến.
 */
export const ACTOR_COST_ESTIMATE = {
  'apify/facebook-pages-scraper':     { usd: 0.10, free: false, durationSecs: 60 },
  'apify/instagram-scraper':          { usd: 0.10, free: false, durationSecs: 60 },
  'clockworks/free-tiktok-scraper':   { usd: 0.00, free: true,  durationSecs: 90 },
  'streamers/youtube-scraper':        { usd: 0.05, free: false, durationSecs: 60 },
  'apify/google-search-results-scraper': { usd: 0.05, free: false, durationSecs: 30 },
  'epctex/shopee-scraper':            { usd: 0.05, free: false, durationSecs: 90 },
}

export function estimateCost(actorId) {
  return ACTOR_COST_ESTIMATE[actorId] || { usd: 0.10, free: false, durationSecs: 120 }
}

// ─── Custom error class ────────────────────────────────────────────────────
export class ApifyError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApifyError'
  }
}
