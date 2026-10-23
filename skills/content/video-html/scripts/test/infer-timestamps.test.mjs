// skills/content/video-html/scripts/test/infer-timestamps.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findAccentTiming, inferLayerTimings } from '../infer-timestamps.mjs'

test('findAccentTiming - plain ASCII target found', () => {
  const characters = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
  const startTimes = [0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50]
  const result = findAccentTiming('world', characters, startTimes)
  assert.equal(result, 300)
})

test('findAccentTiming - Vietnamese diacritics target found', () => {
  // ElevenLabs có thể tách "á" thành ["a", "´"] hoặc giữ nguyên "á"
  // Test case mô phỏng raw character array với dấu tách
  const characters = ['T', 'á', 'm', ' ', 'm', 'ư', 'ơ', 'i', ' ', 's', 'a', 'i', ' ', 'p', 'r', 'o', 'm', 'p', 't']
  const startTimes = [0.0, 0.08, 0.16, 0.20, 0.28, 0.36, 0.42, 0.48, 0.52, 0.60, 0.68, 0.74, 0.80, 0.88, 0.96, 1.04, 1.12, 1.20, 1.28]
  const result = findAccentTiming('sai prompt', characters, startTimes)
  assert.equal(result, 600)
})

test('findAccentTiming - target not found returns null', () => {
  const characters = ['h', 'i']
  const startTimes = [0.0, 0.1]
  const result = findAccentTiming('world', characters, startTimes)
  assert.equal(result, null)
})

test('findAccentTiming - case insensitive fallback', () => {
  const characters = ['H', 'e', 'l', 'l', 'o']
  const startTimes = [0.0, 0.05, 0.10, 0.15, 0.20]
  const result = findAccentTiming('hello', characters, startTimes)
  assert.equal(result, 0)
})

test('findAccentTiming - empty input', () => {
  const result = findAccentTiming('abc', [], [])
  assert.equal(result, null)
})

test('inferLayerTimings - mixed layers with alignment', () => {
  const scene = {
    i: 1,
    voiceover: 'Tám mươi phần trăm sai prompt',
    layers: [
      { type: 'background', variant: 'glow' },
      { type: 'label', content: 'QUAN SÁT' },
      { type: 'heading', content: 'Tám mươi phần trăm sai prompt', font_size: 128 },
      { type: 'accent', target_text: 'sai prompt' }
    ]
  }
  const alignment = {
    characters: ['T', 'á', 'm', ' ', 'm', 'ư', 'ơ', 'i', ' ', 'p', 'h', 'ầ', 'n', ' ', 't', 'r', 'ă', 'm', ' ', 's', 'a', 'i', ' ', 'p', 'r', 'o', 'm', 'p', 't'],
    character_start_times_seconds: [0.0, 0.08, 0.16, 0.20, 0.28, 0.36, 0.42, 0.48, 0.52, 0.58, 0.65, 0.72, 0.78, 0.82, 0.90, 0.98, 1.05, 1.12, 1.18, 1.26, 1.32, 1.38, 1.42, 1.50, 1.58, 1.66, 1.74, 1.82, 1.90]
  }
  const result = inferLayerTimings(scene, alignment)
  assert.equal(result.layers[0].appear_at_ms, 0)       // background = 0
  assert.equal(result.layers[1].appear_at_ms, 200)     // label = 200
  assert.equal(result.layers[2].appear_at_ms, 400)     // heading = 400
  assert.equal(result.layers[3].appear_at_ms, 1260)    // accent lookup
})

test('inferLayerTimings - no alignment uses fixed delays', () => {
  const scene = {
    i: 1,
    voiceover: 'test',
    layers: [
      { type: 'background' },
      { type: 'label', content: 'X' },
      { type: 'heading', content: 'Test heading', font_size: 128 },
      { type: 'sub', content: 'sub' },
      { type: 'accent', target_text: 'Test' }
    ]
  }
  const result = inferLayerTimings(scene, null)
  assert.equal(result.layers[0].appear_at_ms, 0)
  assert.equal(result.layers[1].appear_at_ms, 200)
  assert.equal(result.layers[2].appear_at_ms, 400)
  assert.equal(result.layers[3].appear_at_ms, 800)
  // Accent without alignment: stagger after heading
  assert.equal(result.layers[4].appear_at_ms, 1000)
})
