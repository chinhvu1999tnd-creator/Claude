#!/usr/bin/env node
/**
 * generate.js — Landing Page Image Generator (API + Patch only)
 *
 * Prompt generation is handled by Claude via SKILL.md — not this script.
 *
 * Usage:
 *   # Generate one image with a prompt (Claude provides the prompt)
 *   node generate.js --prompt "..." --out assets/images --size 1536x1024 --filename hero.png
 *
 *   # Patch HTML after images are saved
 *   node generate.js --update-html path/to/index.html
 *
 *   # List all media-slots in an HTML file (for Claude to read context)
 *   node generate.js --list-slots path/to/index.html
 */

import fs   from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { getAuth, describeAuth } from './auth.js';

const { values: args } = parseArgs({
  options: {
    prompt:        { type: 'string' },
    out:           { type: 'string', default: 'assets/images' },
    size:          { type: 'string', default: '1536x1024' },
    filename:      { type: 'string' },
    'update-html': { type: 'string' },
    'list-slots':  { type: 'string' },
  },
  allowPositionals: true,
});

async function main() {
  // ── Mode: list slots (for Claude context) ────────────────────────────────
  if (args['list-slots']) {
    listSlots(args['list-slots']);
    return;
  }

  // ── Mode: patch HTML with saved images ───────────────────────────────────
  if (args['update-html']) {
    await patchHtmlWithImages(args['update-html']);
    return;
  }

  // ── Mode: generate one image from prompt ─────────────────────────────────
  if (args.prompt) {
    const auth = getAuth();
    if (!auth) {
      console.error('\n❌ No image provider found.');
      console.error('   Add one of these to .env:');
      console.error('     OPENAI_API_KEY=sk-proj-...');
      console.error('     FAL_KEY=...');
      console.error('   Or install Codex CLI (includes GPT Image 2 via subscription).\n');
      process.exit(1);
    }

    console.log(`\nProvider: ${describeAuth(auth)}`);

    const outDir = path.resolve(args.out);
    fs.mkdirSync(outDir, { recursive: true });
    const filename = args.filename || `image-${Date.now()}.png`;
    const dest     = path.join(outDir, filename);

    console.log(`Generating: ${filename}`);
    console.log(`Prompt: "${args.prompt.slice(0, 100)}..."`);

    const imageData = await generateImage(auth, args.prompt, args.size);
    fs.writeFileSync(dest, imageData);
    console.log(`✅ Saved: ${dest}`);
    return;
  }

  console.error('Usage:');
  console.error('  node generate.js --prompt "..." --out dir --size 1536x1024 --filename name.png');
  console.error('  node generate.js --update-html path/to/index.html');
  console.error('  node generate.js --list-slots path/to/index.html');
  process.exit(1);
}

// ── List slots (Claude reads this to understand what images are needed) ───────
function listSlots(htmlPath) {
  const slots = scanHtmlForSlots(htmlPath);
  const htmlDir = path.dirname(path.resolve(htmlPath));

  console.log(`\n${slots.length} media-slot(s) in ${path.basename(htmlPath)}\n`);

  slots.forEach((slot, i) => {
    const sectionNorm = slot.section.replace(/^s\d+-/, '');
    const filename    = `${slot.role.toLowerCase()}-${sectionNorm}-${i + 1}.png`;
    console.log(`[${i + 1}] role=${slot.role} section=${slot.section} ratio=${slot.ratio} label="${slot.label}"`);
    console.log(`    filename: ${filename}`);
    console.log(`    save to:  assets/images/${filename}`);
    if (slot.sectionHeadline) console.log(`    headline: ${slot.sectionHeadline}`);
    if (slot.sectionCopy)     console.log(`    copy:     ${slot.sectionCopy.slice(0, 120)}...`);
    console.log();
  });

  // Also write machine-readable context file next to HTML
  const contextPath = path.join(htmlDir, 'image-context.json');
  fs.writeFileSync(contextPath, JSON.stringify(
    slots.map((slot, i) => {
      const sectionNorm = slot.section.replace(/^s\d+-/, '');
      return {
        index:           i + 1,
        role:            slot.role,
        section:         slot.section,
        sectionNorm,
        ratio:           slot.ratio,
        label:           slot.label,
        filename:        `${slot.role.toLowerCase()}-${sectionNorm}-${i + 1}.png`,
        sectionHeadline: slot.sectionHeadline || '',
        sectionCopy:     slot.sectionCopy     || '',
      };
    }),
    null, 2
  ), 'utf8');

  console.log(`✅ Context written: ${contextPath}`);
}

// ── Patch HTML with saved images ──────────────────────────────────────────────
async function patchHtmlWithImages(htmlPath) {
  const htmlDir = path.dirname(path.resolve(htmlPath));
  const imgDir  = path.join(htmlDir, 'assets', 'images');

  if (!fs.existsSync(imgDir)) {
    console.error(`\n❌ Images folder not found: ${imgDir}`);
    console.error('   Save images there first.\n');
    process.exit(1);
  }

  const images  = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  const slots   = scanHtmlForSlots(htmlPath);
  let   html    = fs.readFileSync(htmlPath, 'utf8');
  let   offset  = 0;
  let   patched = 0;

  console.log(`\nScanning ${imgDir}...`);
  console.log(`Found ${images.length} image(s), ${slots.length} media-slot(s)\n`);

  for (let i = 0; i < slots.length; i++) {
    const slot        = slots[i];
    const sectionNorm = slot.section.replace(/^s\d+-/, '');
    const expected    = `${slot.role.toLowerCase()}-${sectionNorm.replace(/[^a-z0-9]/g, '-')}-${i + 1}`;
    const match       = images.find(f => f.toLowerCase().startsWith(expected.toLowerCase()));

    if (!match) {
      console.log(`  [${i + 1}] ${slot.role} — no image (expected: ${expected}.png)`);
      continue;
    }

    const rel    = path.relative(path.dirname(path.resolve(htmlPath)), path.join(imgDir, match));
    const imgTag = `<img src="${rel}" alt="${slot.label || slot.role}" style="width:100%;height:100%;object-fit:cover;display:block;">`;

    // Strategy 1: replace inner slot-placeholder div
    let newSlot = slot.originalMatch.replace(
      /<div[^>]*class="[^"]*slot-placeholder[^"]*"[^>]*>[\s\S]*?<\/div>/,
      imgTag
    );

    // Strategy 2: no slot-placeholder found — replace entire inner content of the media-slot div
    if (newSlot === slot.originalMatch) {
      const firstClose = slot.originalMatch.indexOf('>');
      const openTag    = slot.originalMatch.slice(0, firstClose + 1);
      newSlot = `${openTag}${imgTag}</div>`;
    }

    const idx = slot.index + offset;
    html   = html.slice(0, idx) + newSlot + html.slice(idx + slot.originalMatch.length);
    offset += newSlot.length - slot.originalMatch.length;
    patched++;
    console.log(`  [${i + 1}] ✅ ${slot.role} · ${slot.section} → ${match}`);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`\n✅ ${patched}/${slots.length} slots patched → ${htmlPath}`);
}

// ── Scan HTML for media-slot placeholders ────────────────────────────────────
function scanHtmlForSlots(htmlPath) {
  const html  = fs.readFileSync(htmlPath, 'utf8');
  const regex = /<div[^>]+data-role="(\w+)"[^>]*>([\s\S]*?)<\/div>/g;
  const slots = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const role  = match[1];
    const inner = match[2];

    const labelM      = inner.match(/\[([^\]]+)\]/);
    const label       = labelM?.[1] || '';
    const dataSection = match[0].match(/data-section="([\w-]+)"/)?.[1];
    const before      = html.slice(Math.max(0, match.index - 2000), match.index);
    const sectionM    = before.match(/id="([\w-]+)"/g);
    const section     = dataSection || sectionM?.pop()?.replace(/id="|"/g, '') || 'default';
    const ratioM      = match[0].match(/aspect-ratio:\s*([\d.]+)\s*[/]\s*([\d.]+)/);
    const ratio       = ratioM ? `${ratioM[1]}:${ratioM[2]}` : '16:9';

    // Extract nearby section context for Claude
    const nearby          = html.slice(Math.max(0, match.index - 3000), match.index);
    const headlineM       = nearby.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g);
    const sectionHeadline = headlineM?.pop()?.replace(/<[^>]+>/g, '').trim() || '';
    const paraM           = nearby.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
    const sectionCopy     = paraM?.slice(-2).map(p => p.replace(/<[^>]+>/g, '').trim()).join(' ') || '';

    slots.push({
      role, section, label, ratio,
      originalMatch: match[0], index: match.index,
      sectionHeadline, sectionCopy,
    });
  }

  return slots;
}

// ── Provider router ───────────────────────────────────────────────────────────
async function generateImage(auth, prompt, size) {
  switch (auth.provider) {
    case 'codex':  return callCodex(prompt, size);
    case 'openai': return callOpenAI(auth, prompt, size);
    case 'fal':    return callFalAI(auth, prompt, size);
    default: throw new Error(`Unknown provider: ${auth.provider}`);
  }
}

// ── OpenAI API ────────────────────────────────────────────────────────────────
async function callOpenAI(auth, prompt, size) {
  const res = await fetch(`${auth.baseURL}/images/generations`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
    body: JSON.stringify({
      model:           'gpt-image-2',
      prompt,
      size:            size || '1536x1024',
      n:               1,
      response_format: 'b64_json',
      quality:         'high',
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const b64  = data.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data in OpenAI response');
  return Buffer.from(b64, 'base64');
}

// ── fal.ai API ────────────────────────────────────────────────────────────────
async function callFalAI(auth, prompt, size) {
  // Map OpenAI size strings to fal.ai image_size
  const sizeMap = {
    '1536x1024': 'landscape_16_9',
    '1024x1024': 'square',
    '1024x1536': 'portrait_16_9',
    '768x1024':  'portrait_4_3',
    '1024x768':  'landscape_4_3',
  };
  const image_size = sizeMap[size] || 'landscape_16_9';

  const res = await fetch('https://fal.run/openai/gpt-image-2', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Key ${auth.token}`,
    },
    body: JSON.stringify({ prompt, image_size, num_images: 1, output_format: 'png' }),
  });
  if (!res.ok) throw new Error(`fal.ai API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const url  = data.images?.[0]?.url;
  if (!url) throw new Error('No image URL in fal.ai response');

  // Download the image from the returned URL
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Failed to download image from fal.ai: ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

// ── Codex CLI ($imagegen skill) ───────────────────────────────────────────────
async function callCodex(prompt, size) {
  const { execSync } = await import('child_process');
  const tmpFile = `/tmp/codex-image-${Date.now()}.png`;

  // Codex CLI: pass an image generation task via stdin
  const task = `Generate an image using the $imagegen skill with this exact prompt and save it as ${tmpFile}:\n\n${prompt}`;

  try {
    execSync(`echo ${JSON.stringify(task)} | codex --no-interactive`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120_000,
    });
    if (!fs.existsSync(tmpFile)) throw new Error('Codex did not produce output file');
    const buf = fs.readFileSync(tmpFile);
    fs.unlinkSync(tmpFile);
    return buf;
  } catch (err) {
    throw new Error(
      `Codex generation failed: ${err.message}\n` +
      `  Tip: Use OPENAI_API_KEY or FAL_KEY in .env for reliable scripted generation.`
    );
  }
}

main().catch(err => { console.error('\nFatal:', err.message); process.exit(1); });
