#!/usr/bin/env node
/**
 * dep-check.mjs — Check môi trường có đủ dependencies không
 *
 * Run automatically lần đầu mở kit (qua welcome-hook.mjs)
 * Hoặc manually: node .claude/dep-check.mjs
 *
 * Export `runDepCheck()` để welcome-hook.mjs import.
 */

import { execSync, spawnSync } from 'child_process'
import { platform } from 'os'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, join, dirname } from 'path'

const OS = platform()  // 'darwin' | 'linux' | 'win32'
const IS_WIN = OS === 'win32'

// ─── Helpers ───────────────────────────────────────────────────────────────
function commandExists(cmd) {
  const which = IS_WIN ? 'where' : 'which'
  const result = spawnSync(which, [cmd], { encoding: 'utf-8', stdio: 'pipe' })
  return result.status === 0
}

function getVersion(cmd, versionArg = '--version') {
  try {
    return execSync(`${cmd} ${versionArg}`, { encoding: 'utf-8', stdio: 'pipe' }).trim().split('\n')[0]
  } catch {
    return null
  }
}

function installCommand(dep) {
  const cmds = {
    node: {
      darwin: 'brew install node@20',
      linux: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs',
      win32: 'choco install nodejs-lts  (hoặc download installer: https://nodejs.org)',
    },
    ffmpeg: {
      darwin: 'brew install ffmpeg',
      linux: 'sudo apt-get install -y ffmpeg',
      win32: 'choco install ffmpeg  (hoặc download: https://ffmpeg.org/download.html)',
    },
    supabase: {
      darwin: 'brew install supabase/tap/supabase',
      linux: 'curl -fsSL https://supabase.com/cli/install.sh | bash',
      win32: 'scoop install supabase  (hoặc: npm install -g supabase)',
    },
    vercel: {
      darwin: 'npm install -g vercel',
      linux: 'npm install -g vercel',
      win32: 'npm install -g vercel',
    },
    'kit node_modules': {
      darwin: 'npm install && npx playwright install chromium',
      linux: 'npm install && npx playwright install chromium',
      win32: 'npm install && npx playwright install chromium',
    },
    brew: {
      darwin: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      linux: 'N/A (Linux dùng apt-get / dnf)',
      win32: 'N/A (Windows dùng choco / scoop)',
    },
  }
  return cmds[dep]?.[OS] || `(Install ${dep} thủ công cho ${OS})`
}

// ─── Definition các checks ─────────────────────────────────────────────────
const REQUIRED_DEPS = [
  {
    name: 'node',
    description: 'Node.js 18+',
    why: 'Kit chạy script Node, hook, build tools',
    check: () => {
      const v = getVersion('node')
      if (!v) return { ok: false, reason: 'chưa cài' }
      const major = parseInt(v.replace(/^v/, '').split('.')[0])
      if (isNaN(major)) return { ok: false, reason: `version không parse được: ${v}` }
      if (major < 18) return { ok: false, reason: `version ${v} quá cũ — cần 18+` }
      return { ok: true, version: v }
    },
  },
  {
    name: 'npm',
    description: 'npm package manager',
    why: 'Install dependencies + run scripts',
    check: () => {
      const v = getVersion('npm')
      return v ? { ok: true, version: v } : { ok: false, reason: 'chưa cài' }
    },
  },
]

const FEATURE_DEPS = [
  {
    name: 'ffmpeg',
    description: 'FFmpeg (video processing)',
    why: 'Simple Reels Agent — render MP4 video',
    affects: '/content reels',
    check: () => commandExists('ffmpeg') ? { ok: true } : { ok: false, reason: 'chưa cài' },
  },
  {
    name: 'supabase',
    description: 'Supabase CLI',
    why: 'Coach Agent setup Portal — deploy database + edge functions',
    affects: '/coach setup-crm',
    // Capture version để Agent biết CLI version (cho CLI Resilience — flag có thể đổi theo version)
    check: () => {
      if (!commandExists('supabase')) return { ok: false, reason: 'chưa cài' }
      const v = getVersion('supabase')
      return { ok: true, version: v || 'unknown' }
    },
  },
  {
    name: 'vercel',
    description: 'Vercel CLI',
    why: 'Coach Agent setup Portal — deploy Customer Portal lên Vercel',
    affects: '/coach setup-crm + /funnel deploy',
    check: () => {
      if (!commandExists('vercel')) return { ok: false, reason: 'chưa cài' }
      const v = getVersion('vercel')
      return { ok: true, version: v || 'unknown' }
    },
  },
]

// Kit dependencies — node_modules ở root (playwright, js-yaml)
// node_modules KHÔNG ship trong zip → customer phải npm install lần đầu
const KIT_DEPS = {
  name: 'kit node_modules',
  description: 'Kit dependencies (playwright cho PDF/card render)',
  why: '/lead-magnet, /content carousel, /content image cần playwright',
  check: () => {
    // Kit root = 2 cấp trên .claude/dep-check.mjs
    const kitRoot = dirname(dirname(fileURLToPath(import.meta.url)))
    const hasNodeModules = existsSync(join(kitRoot, 'node_modules', 'playwright'))
    return hasNodeModules
      ? { ok: true }
      : { ok: false, reason: 'chưa npm install (chạy: npm install && npx playwright install chromium)' }
  },
}

// Optional helpers (informational, không block)
const HELPERS = [
  {
    name: 'brew',
    description: 'Homebrew (package manager macOS)',
    only: 'darwin',
    check: () => OS === 'darwin' ? (commandExists('brew') ? { ok: true } : { ok: false }) : null,
  },
]

// ─── Run all checks ────────────────────────────────────────────────────────
export function runDepCheck() {
  const missingRequired = []
  const missingFeature = []
  const installed = []

  for (const dep of REQUIRED_DEPS) {
    const result = dep.check()
    if (result.ok) {
      installed.push({ ...dep, ...result })
    } else {
      missingRequired.push({ ...dep, ...result })
    }
  }

  for (const dep of FEATURE_DEPS) {
    const result = dep.check()
    if (result.ok) {
      installed.push({ ...dep, ...result })
    } else {
      missingFeature.push({ ...dep, ...result })
    }
  }

  // Kit node_modules check (feature dep — cần cho render PDF/card)
  const kitDepResult = KIT_DEPS.check()
  if (kitDepResult.ok) {
    installed.push({ ...KIT_DEPS, ...kitDepResult })
  } else {
    missingFeature.push({ ...KIT_DEPS, ...kitDepResult, affects: '/lead-magnet, /content carousel/image' })
  }

  return {
    allOk: missingRequired.length === 0 && missingFeature.length === 0,
    missingRequired,
    missingFeature,
    installed,
    os: OS,
  }
}

// ─── Format report cho Claude ──────────────────────────────────────────────
export function formatReport(result) {
  if (result.allOk) {
    // Show CLI versions để Agent biết (cho CLI Resilience — adapt flag theo version)
    const versions = result.installed
      .filter(d => d.version && ['supabase', 'vercel', 'node'].includes(d.name))
      .map(d => `${d.name} ${d.version}`)
      .join(', ')
    return `[Dep Check] ✓ Tất cả deps đủ:
- Required: ${REQUIRED_DEPS.map(d => d.name).join(', ')}
- Feature: ${FEATURE_DEPS.map(d => d.name).join(', ')}
- OS: ${result.os}
- CLI versions: ${versions || 'n/a'}

INSTRUCTION: Không cần install. Tiếp tục welcome flow.
⚠️ CLI RESILIENCE: supabase/vercel CLI flag có thể đổi theo version. Khi chạy setup commands, nếu fail "unknown flag" → check '<cli> <subcmd> --help' + adapt (xem skills/setup/crm-portal/SKILL.md → CLI Resilience).`
  }

  let report = `[Dep Check] ⚠️ User máy thiếu dependencies (OS: ${result.os})\n\n`

  if (result.missingRequired.length > 0) {
    report += `🚨 BẮT BUỘC (kit không chạy được):\n`
    for (const m of result.missingRequired) {
      report += `\n• ${m.description}\n`
      report += `  Lý do: ${m.why}\n`
      report += `  Status: ${m.reason}\n`
      report += `  Install: ${installCommand(m.name)}\n`
    }
    report += `\n`
  }

  if (result.missingFeature.length > 0) {
    report += `⚠️ OPTIONAL (chỉ cần cho feature cụ thể, kit basic vẫn chạy):\n`
    for (const m of result.missingFeature) {
      report += `\n• ${m.description}\n`
      report += `  Cần cho: ${m.affects}\n`
      report += `  Install: ${installCommand(m.name)}\n`
    }
    report += `\n`
  }

  report += `INSTRUCTION cho AI:
Trong response đầu tiên, sau Welcome message, ADD section:

"📋 Em check máy anh/chị, thiếu một số deps:

${result.missingRequired.length > 0 ? '🚨 Bắt buộc cài (kit không chạy được):\n' + result.missingRequired.map(m => `   - ${m.description}`).join('\n') + '\n' : ''}${result.missingFeature.length > 0 ? '⚠️ Optional (cho feature cụ thể):\n' + result.missingFeature.map(m => `   - ${m.description} (cần cho: ${m.affects})`).join('\n') + '\n' : ''}
Anh/chị muốn:
(A) Em hướng dẫn cài từng cái — em show command cụ thể cho ${result.os}, anh/chị paste vào terminal
(B) Em chỉ cài cái nào BẮT BUỘC + cái cho /coach setup-crm (Supabase + Vercel) — skip ffmpeg nếu chưa cần Simple Reels
(C) Skip — anh/chị tự xử lý

Chọn?"

KHÔNG tự chạy install command — phải hỏi user trước. Khi user OK, show command từng cái, hỏi confirm trước khi user paste.`

  return report
}

// ─── CLI entry point ───────────────────────────────────────────────────────
// Khi user chạy: node .claude/dep-check.mjs
const isMainModule = (() => {
  try {
    return fileURLToPath(import.meta.url) === resolve(process.argv[1] || '')
  } catch {
    return false
  }
})()

if (isMainModule) {
  const result = runDepCheck()
  console.log(`<system-reminder>\n${formatReport(result)}\n</system-reminder>`)
  process.exit(result.allOk ? 0 : 1)
}
