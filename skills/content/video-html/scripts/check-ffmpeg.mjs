#!/usr/bin/env node
/**
 * check-ffmpeg.mjs — Verify ffmpeg available, auto-install via brew on macOS if missing.
 *
 * Exports: ensureFfmpeg() → boolean (throws on permanent failure)
 * CLI: node check-ffmpeg.mjs
 */
import { execSync } from 'child_process'
import { platform } from 'os'

export function ensureFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
    return true
  } catch {
    console.log('ffmpeg not found.')
    if (platform() !== 'darwin') {
      throw new Error('ffmpeg required. Install manually for your OS.')
    }
    try {
      execSync('which brew', { stdio: 'ignore' })
    } catch {
      throw new Error('Homebrew not found. Install brew first: https://brew.sh')
    }
    console.log('Installing ffmpeg via brew (may take 1-2 min)...')
    execSync('brew install ffmpeg', { stdio: 'inherit' })
    console.log('ffmpeg installed.')
    return true
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isMain) {
  ensureFfmpeg()
  const v = execSync('ffmpeg -version', { encoding: 'utf8' }).split('\n')[0]
  console.log(v)
}
