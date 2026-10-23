# Timing Strategy — 2 Modes

> Loaded by `prompts/html-generator.md`. Quy tắc: KHÔNG front-load entrance.
> Ported verbatim from prompts.ts PHẦN 4.7 (lines 724-787).

═══════════════════════════════════════════════════════════════════
PHẦN 4.7 — TIMING STRATEGY (KHÔNG front-load entrance)
═══════════════════════════════════════════════════════════════════

❗️ Vấn đề thường gặp: AI nén tất cả entrance vào 1s đầu → cảnh static
4-6s sau đó → user đợi audio nói nốt với màn hình tĩnh.

GIẢI PHÁP: TWEENS PHẢI TRẢI ĐỀU SUỐT THỜI LƯỢNG CẢNH.

Có 2 chế độ — prompt user-block sẽ chỉ rõ chế độ nào dùng:

═══ CHẾ ĐỘ A — KEYWORD-ANCHORED (khi có alignment) ═══

Khi prompt có khối "AUDIO CONTEXT" với word-level timings:
  → DÙNG TIMESTAMP CHÍNH XÁC từ alignment cho mỗi tween chính.
  → Element nào tương ứng với keyword nào? AI tự match dựa trên semantic.

Ví dụ alignment:
  0.20s → "Cú"
  0.50s → "sốc"
  1.10s → "Google"
  2.00s → "thổi bay"
  2.80s → "tỷ đô"
  3.60s → "vốn hoá"

→ tween mapping:
  tl.from(".bg-stars",     {opacity:0, duration:0.8}, 0);     // atmosphere t=0
  tl.from(".kicker-pill",  {y:-20, opacity:0},        0.20);  // "Cú"
  tl.from(".title-shock",  {scale:1.4, opacity:0},    0.50);  // "sốc" — slam timing
  tl.from(".google-logo",  {rotation:-15, opacity:0}, 1.10);  // "Google"
  tl.from(".chart-line",   {strokeDashoffset:0, duration:0.8}, 2.00); // "thổi bay" — chart drops
  tl.from(".big-billions", {scale:0.4, opacity:0},    2.80);  // "tỷ đô" — big reveal
  tl.from(".alarm-pill",   {x:30, opacity:0},         3.60);  // "vốn hoá"
  // Last entrance 3.60s, tổng audio 4.5s → 0.9s ambient pulse + hold cuối

═══ CHẾ ĐỘ B — SPREAD (khi chưa có alignment) ═══

Khi không có "AUDIO CONTEXT" hoặc chỉ có duration estimate:
  → Spread entrances proportionally across 0 → 70% duration
  → Stagger 0.4-0.8s giữa mỗi tween chính

Ví dụ duration 5s:
  tl.from(".bg-stars",  {opacity:0,  duration:1.0},     0);    // atmosphere
  tl.from(".kicker",    {y:-30, opacity:0},             0.5);  // 10%
  tl.from(".title",     {y:80, opacity:0,duration:0.7}, 1.5);  // 30%
  tl.from(".big-num",   {scale:0.5, opacity:0},         2.5);  // 50%
  tl.from(".pill",      {y:30, opacity:0},              3.2);  // 64%
  tl.from(".accent",    {scaleX:0, transformOrigin:"left"}, 3.5); // 70%
  // Last 3.5s, hold + ambient pulse from 3.5 → 5.0

═══ NGUYÊN TẮC CHUNG ═══

KHÔNG được:
  ❌ Nhét tất cả tweens vào 0 → 1.2s đầu
  ❌ Sau 1.2s là tĩnh hoàn toàn
  ❌ Dùng duration 5s nhưng tween cuối ở 0.95s
  ❌ Bỏ qua AUDIO CONTEXT nếu prompt có

PHẢI:
  ✓ Trải tween entrance khắp duration (60-85% tuỳ chế độ)
  ✓ Atmosphere/decorative t=0, content chính ở mid-late
  ✓ Khi có alignment → anchor vào timestamp keyword
  ✓ Last entrance ≤ 70-85% duration; sau đó ambient pulse / hold
