/**
 * auth.js — Multi-provider auth detection
 *
 * Priority:
 *   1. Codex CLI  — GPT Image 2 via subscription ($imagegen skill)
 *   2. OpenAI API — direct API key
 *   3. fal.ai     — OpenAI GPT Image 2 via fal.ai proxy
 *   4. null       → plan mode (Claude writes image-plan-prompt.md)
 */

import fs   from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function getAuth() {
  // 1. Codex CLI
  if (hasCodex()) {
    return { provider: 'codex' };
  }

  // 2. OpenAI API key
  const openaiKey = readKey('OPENAI_API_KEY');
  if (openaiKey) {
    return { provider: 'openai', token: openaiKey, baseURL: 'https://api.openai.com/v1' };
  }

  // 3. fal.ai key
  const falKey = readKey('FAL_KEY') || readKey('FAL_API_KEY');
  if (falKey) {
    return { provider: 'fal', token: falKey };
  }

  return null;
}

export function describeAuth(auth) {
  if (!auth) return 'No provider found → plan mode';
  if (auth.provider === 'codex')  return 'Codex CLI ($imagegen skill)';
  if (auth.provider === 'openai') return 'OpenAI API (gpt-image-2)';
  if (auth.provider === 'fal')    return 'fal.ai (openai/gpt-image-2)';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasCodex() {
  try {
    execSync('codex --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function readKey(name) {
  // env var takes priority
  if (process.env[name]) return process.env[name].trim();

  // fallback to .env file
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return null;
  const line = fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .find(l => l.startsWith(`${name}=`));
  return line?.split('=')[1]?.trim() || null;
}
