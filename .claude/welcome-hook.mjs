#!/usr/bin/env node
/**
 * welcome-hook.mjs — Session start orchestrator
 *
 * Chạy bởi: .claude/settings.json → hooks.SessionStart
 *
 * Làm 2 việc:
 * 1. Detect user state (fresh/partial/active-plan/returning) → instruction Claude show welcome
 * 2. Lần đầu mở kit → run dep-check → instruction Claude hỏi install deps thiếu
 *
 * Marker file `.claude/.dep-checked` tránh re-run dep-check mỗi session.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { runDepCheck, formatReport } from './dep-check.mjs'

// ─── 1. Detect USER STATE ──────────────────────────────────────────────────
let userState = 'returning'

try {
  if (existsSync('BUSINESS.md')) {
    const businessContent = readFileSync('BUSINESS.md', 'utf-8')
    if (businessContent.includes('[Chưa điền') || businessContent.includes('[Chưa rõ')) {
      userState = 'fresh'
    }
  } else {
    userState = 'fresh'
  }

  if (userState !== 'fresh') {
    let hasPortal = false
    if (existsSync('.env')) {
      const envContent = readFileSync('.env', 'utf-8')
      hasPortal = /^CUSTOMER_PORTAL_URL=https/m.test(envContent)
    }
    if (!hasPortal) {
      userState = 'partial'
    } else if (existsSync('output/coach/active-plan.md')) {
      userState = 'active-plan'
    }
  }
} catch (err) {
  userState = 'fresh'  // safe default
}

const USER_INSTRUCTIONS = {
  fresh: `Show new-user welcome (xem CLAUDE.md → "Welcome Flow" → Fresh user section):
  - Greeting friendly bằng tiếng Việt
  - 3 option: /start, /coach, ask question`,

  partial: `Show partial-setup welcome:
  - "Business đã onboard nhưng Portal chưa setup"
  - Suggest /coach setup-crm (~15 phút)`,

  'active-plan': `Show progress + suggest next:
  - Đọc output/coach/active-plan.md
  - Show: "Plan {tên} — Progress {N/M}"
  - Suggest /coach next`,

  returning: `Show returning user menu:
  - Welcome back greeting
  - Progress summary từ output/
  - Menu commands available`,
}

// ─── 2. Detect DEP STATE (chỉ lần đầu) ─────────────────────────────────────
const DEP_MARKER = '.claude/.dep-checked'
let depReport = null
let depAllOk = true

if (!existsSync(DEP_MARKER)) {
  try {
    const depResult = runDepCheck()
    depReport = formatReport(depResult)
    depAllOk = depResult.allOk

    // Save marker để skip lần sau (lưu kết quả để Coach có thể đọc)
    writeFileSync(DEP_MARKER, JSON.stringify({
      checkedAt: new Date().toISOString(),
      allOk: depResult.allOk,
      missingRequired: depResult.missingRequired.map(d => d.name),
      missingFeature: depResult.missingFeature.map(d => d.name),
      os: depResult.os,
    }, null, 2))
  } catch (err) {
    // Silent fail — không block welcome
    depReport = `[Dep Check] Skip (lỗi check: ${err.message})`
  }
}

// ─── 3. Combine output ─────────────────────────────────────────────────────
let output = `<system-reminder>
[AI Agent Business Kit BASIC v1.0.0 — Session Start]

═══════════════════════════════════════════════════════════
USER STATE: ${userState}
═══════════════════════════════════════════════════════════

INSTRUCTION cho AI — Welcome:
${USER_INSTRUCTIONS[userState]}

`

if (depReport) {
  output += `═══════════════════════════════════════════════════════════
DEPENDENCY CHECK (lần đầu mở kit)
═══════════════════════════════════════════════════════════

${depReport}

`

  // Combine 2 instructions cho Claude
  if (!depAllOk) {
    output += `═══════════════════════════════════════════════════════════
COMBINED INSTRUCTION
═══════════════════════════════════════════════════════════

Response đầu tiên của session, follow thứ tự:
1. Show welcome message (theo USER_STATE phía trên)
2. SAU welcome, add section "📋 Em check máy anh/chị, có một số deps cần cài"
3. List missing deps + install commands (theo DEP_CHECK report)
4. Hỏi user (A/B/C) muốn cài thế nào
5. Wait user choose, KHÔNG auto-run install

`
  }
}

output += `KHÔNG block first message của user — vẫn cho user gõ tự nhiên, em handle gracefully.
</system-reminder>`

console.log(output)
