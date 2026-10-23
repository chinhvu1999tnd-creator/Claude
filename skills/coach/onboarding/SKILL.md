---
name: coach-onboarding
description: Phỏng vấn business lần đầu — intake 8 câu cho BUSINESS.md + 5 câu cho THEME.md. Output: 2 file đã fill, sẵn sàng cho mọi Agent worker dùng.
---

# Coach Onboarding Skill

## Khi Nào Dùng

- User gõ `/start` lần đầu (BUSINESS.md còn `[Chưa điền...]`)
- User muốn reset BUSINESS info → `/coach onboarding`

---

## Nguyên Tắc

1. **Hỏi từng câu** — không spam 8 câu cùng lúc. User trả lời câu nào, em ghi câu đó vào BUSINESS.md, sang câu kế.
2. **Cho 3 ví dụ đa dạng** — khi user lúng túng, đưa ví dụ từ niche khác nhau (course / service / digital / physical / coaching) để họ pick gần nhất
3. **Không bịa** — user nói "chưa biết" → ghi `[chưa rõ — sẽ update sau /offer research]` thay vì đoán, KHÔNG hỏi lại nhiều lần
4. **Smart extract** — nếu user trả lời câu 2 dài, tự extract trường ở câu 4-5 luôn, không hỏi lại
5. **Tiết kiệm thời gian** — tổng intake không quá 10 phút. Nếu user trả lời 3 câu liên tiếp "không biết" → switch sang `/offer research` thay vì cố hỏi tiếp

---

## Flow chi tiết

### Phần 0 — Environment Check (~30 giây, BẮT BUỘC trước Phase A)

**Lý do**: Kit cần Node 18+, npm. Một số feature cần ffmpeg / supabase CLI / vercel CLI. Check trước để user không gặp lỗi giữa flow.

```
Coach: "Em check môi trường máy anh/chị trước khi bắt đầu (5 giây)..."

→ Run: node .claude/dep-check.mjs
→ Đọc output (state allOk, missingRequired, missingFeature)

CASE 1: All deps OK ✓
  Coach: "✓ Môi trường OK. Tiếp tục onboarding nhé..."
  → Skip sang Phase A

CASE 2: Missing REQUIRED (Node/npm)
  Coach: "🚨 Anh/chị thiếu deps BẮT BUỘC:
   - {Node 18+ chưa cài / version cũ}
   - {npm chưa cài}
   
   Em không thể tiếp tục cho đến khi anh/chị cài. Install command cho {OS}:
   
   {paste install command từ dep-check}
   
   Anh/chị paste vào terminal, sau khi xong gõ 'done' cho em verify lại."
  → BLOCK flow, wait user "done" → re-run dep-check
  → Pass → continue Phase A

CASE 3: Missing CRITICAL-for-onboarding deps (supabase CLI / vercel CLI)
  ⚠️ Supabase + Vercel CLI là BẮT BUỘC cho /coach setup-crm (chạy ngay trong onboarding).
  → KHÔNG cho skip. BLOCK đến khi cài xong.
  
  Coach: "🚨 Em cần Supabase CLI + Vercel CLI để setup Customer Portal (bước tiếp theo trong onboarding).
   Đây là BẮT BUỘC — em không thể tiếp tục mà thiếu.
   
   Install command cho {OS}:
   {supabase install command}
   {vercel install command}
   
   Anh/chị paste vào terminal, xong gõ 'done' cho em verify."
  → BLOCK, wait 'done' → re-run dep-check → pass → continue

CASE 4: Missing LATER-feature deps (ffmpeg)
  ⚠️ ffmpeg chỉ cần khi /content reels (sau onboarding) → WARN nhưng cho tiếp.
  
  Coach: "⚠️ Em thấy thiếu ffmpeg (cần cho /content reels — video ngắn).
   Onboarding không cần ffmpeg nên em tiếp tục. Khi nào anh/chị làm video, em sẽ nhắc cài lúc đó.
   
   (Nếu muốn cài sẵn luôn: {ffmpeg install command})"
  → Continue Phase A (ffmpeg defer được)
```

→ Sau Phase 0 (dep OK), save state vào `.claude/.dep-checked`.

### Phần 0b — Cài kit dependencies (npm install, ~2 phút, BẮT BUỘC 1 lần)

⭐ Kit cần `playwright` (render PDF/image card) + `js-yaml`. node_modules KHÔNG ship trong zip → phải cài lần đầu.

```
Check: node_modules/ tồn tại ở kit root chưa?
  → CÓ → skip (đã cài rồi)
  → CHƯA → Coach:
    "Em cài dependencies cho kit (~2 phút, lần đầu duy nhất)..."
    → npm install   (ở kit root)
    → npx playwright install chromium   (cho render PDF/card)
    → ✓ "Xong. Kit sẵn sàng tạo content + PDF lead magnet."
```

⚠️ KHÔNG skip — thiếu playwright thì `/lead-magnet`, `/content carousel`, `/content image` sẽ lỗi.

**Nguyên tắc dep gate (KHÔNG cho skip critical)**:
| Dep | Cần cho | Gate |
|-----|---------|------|
| Node 18+, npm | Cả kit | 🚨 BLOCK |
| supabase CLI | /coach setup-crm (onboarding) | 🚨 BLOCK |
| vercel CLI | /coach setup-crm + /funnel deploy | 🚨 BLOCK |
| ffmpeg | /content reels (sau onboarding) | ⚠️ WARN, defer OK |

### Phần A — BUSINESS.md (8 câu, ~6 phút)

Em hỏi từng câu, sau mỗi câu Edit `BUSINESS.md` ngay.

#### Câu 1: Bạn là ai?
```
"Em chào anh/chị. Em là Coach Agent. Em sẽ giúp anh/chị setup kit trong ~20 phút.
 Bắt đầu nhé — anh/chị tên gì, làm trong lĩnh vực nào, đang bán hoặc định bán gì ạ?"
```
→ Extract: tên, lĩnh vực, sản phẩm/dịch vụ sơ bộ

#### Câu 2: Sản phẩm chính
```
"Sản phẩm/dịch vụ chính anh/chị muốn bán là gì? Tên cụ thể + mô tả 1-2 câu.
 
 Ví dụ:
 - Course: 'Khoá học digital marketing cho mẹ bỉm sữa — 8 tuần, ra đơn 5tr/tháng'
 - Service: 'Tư vấn 1-1 chiến lược content cho coach — 90 phút/session'
 - Digital: 'Template Notion quản lý gia đình bận rộn — 25 dashboard'
 - Physical: 'Tinh dầu thảo mộc cho phụ nữ stress — combo 3 chai'
 - Coaching: 'Coaching 1-on-1 3 tháng cho founder mới khởi nghiệp'"
```
→ Extract: tên, mô tả, format (course/coaching/digital/physical/service)
→ **Smart extract**: nếu user mô tả dài (>50 chữ) → tự fill cả audience hint vào câu 4

#### Câu 3: Giá
```
"Giá bán dự kiến bao nhiêu ạ? 
 
 Ví dụ:
 - Mass market: 297k / 497k / 997k (charm pricing VN)
 - Mid-tier: 1.997k / 2.997k (tránh số 4)
 - Premium: 5tr / 9.997k / 15tr trọn gói
 - Installment: '2tr/tháng x 3 tháng' / '500k x 6 lần'
 
 Nếu chưa quyết, cho em khoảng — em /offer research giúp định giá sau."
```
→ Extract: số tiền + format (1 lần / installment)
→ **VN rule**: cảnh báo nếu user paste pricing có số 4 (vd: 4.997k) — văn hoá VN tránh

#### Câu 4: Khách hàng mục tiêu
```
"Khách hàng anh/chị nhắm tới là ai? Mô tả: tuổi, nghề, hoàn cảnh, pain point.
 
 Ví dụ VN:
 - 'Mẹ bỉm sữa 28-38, ở nhà chăm con, muốn có thu nhập 5-10tr/tháng từ online'
 - 'Founder solo 25-35, đang chạy 1-3 nhân sự, stuck ở doanh thu 50-100tr/tháng'
 - 'Sinh viên năm 3-4 muốn kiếm tiền online, ngân sách học < 1tr'
 - 'Doanh nhân nữ 35-50, kinh doanh offline, muốn mở rộng kênh online'
 - 'Coach/educator đã có 1k+ follow IG, muốn monetize'"
```
→ Extract: persona (tuổi + nghề + pain + budget)

#### Câu 5: Vấn đề + Mong muốn
```
"Vấn đề CỤ THỂ khách hàng đang gặp? Và họ muốn đạt gì sau khi mua?
 
 Format tốt: 'Họ đang [pain cụ thể] và muốn [outcome đo được trong X thời gian]'
 
 Ví dụ:
 - 'Đang đăng FB mỗi ngày mà không có đơn → muốn có 30 đơn/tháng trong 60 ngày'
 - 'Đang dạy 1-1 không scale được → muốn xây khoá học digital bán passive'
 - 'Đang bán mà không có sales page → muốn deploy 1 funnel xong trong 1 tuần'"
```
→ Extract: pain point + desired outcome + time frame

#### Câu 6: Lợi thế cạnh tranh
```
"Anh/chị khác đối thủ ở điểm gì? Có case study/testimonial/chứng chỉ gì đặc biệt?
 
 Nếu chưa biết:
 - Trải nghiệm cá nhân? ('Tôi đã từng X trong Y năm')
 - Method độc đáo? ('Tôi dùng framework Z mà ít người biết')
 - Result đã đạt được? ('Tôi đã có Z học viên / Z khách thực tế')
 - Background lạ? ('Tôi xuất phát từ ngành A, áp dụng vào B')"
```
→ Extract: USP + social proof (có thể trống — Offer Agent research sau)
→ **Fallback**: User "không biết" → ghi `[Cần /offer research để xác định USP]`

#### Câu 7: Khách hiện đang ở đâu
```
"Khách của anh/chị active ở đâu online? Anh/chị đã có channel nào sẵn không?
 
 Platform phổ biến VN:
 - Facebook (page/group) — ai cũng dùng, organic giảm
 - Zalo / Zalo OA — mass VN
 - TikTok — gen Z + millennials
 - Instagram — gen Z trẻ + creative
 - YouTube — long-form content
 - Google search — intent-based niche
 - Shopee/Lazada — physical product
 
 Anh/chị tick các platform khách hay ở + cho biết kênh đã có audience."
```
→ Extract: target channels + existing assets (followers, email list)

#### Câu 8: Mục tiêu doanh thu tháng này
```
"Mục tiêu doanh thu tháng này bao nhiêu? Em tính ngược ra số đơn cần đạt.
 
 Ví dụ:
 - Mục tiêu 10tr/tháng + giá 997k → ~10 đơn
 - Mục tiêu 50tr/tháng + giá 2tr → ~25 đơn
 - Mục tiêu 100tr/tháng + giá 5tr → ~20 đơn
 
 Nếu chưa có target → '10x giá' là realistic cho khởi nghiệp 1 tháng đầu"
```
→ Extract: revenue target → calc đơn cần đạt → ghi vào BUSINESS.md Section "Mục tiêu tháng này"
→ Coach hiển thị calc: "Mục tiêu X = ~Y đơn = Z khách inbox (assume conversion rate 30% lead → sale)"

**Sau Câu 8:**
```
"OK em đã ghi đầy đủ vào BUSINESS.md. Tiếp theo em hỏi nhanh 5 câu về brand (màu, font...) để Brand Agent biết style anh/chị muốn. ~3 phút thôi. OK ạ?"
```

---

### Phần B — Brand Setup (delegate Brand Agent, ~1-3 phút)

**Coach KHÔNG hỏi 5 câu text trực tiếp.** Thay vào đó, **delegate sang Brand Agent** với 3 input modes — UX nhanh + output chất lượng hơn:

```
Coach: "OK em đã có thông tin business. Tiếp theo setup brand.

Em chuyển sang Brand Agent — anh/chị có 1 trong 3 input nào sẵn không?

(A) URL website tham khảo
    VD: "thích style giống stripe.com" / "muốn nhìn giống notion.so"
    → Em fetch + parse trong 5 giây, FREE

(B) 1-5 ảnh moodboard (paste/upload)
    VD: screenshot Pinterest, tạp chí favorite, UI app đẹp, ảnh nhà cửa
    → Em vision parse trong 15 giây, FREE

(C) Hỏi text 3 câu nhanh (fallback)
    → Em hỏi: brand tham khảo / aesthetic / color mood

Anh/chị chọn? (A/B/C)"
```

User chọn → Coach **invoke Brand Agent** với input đã thu:

#### Nếu (A) URL
```
1. Verify URL accessible
2. Load agents/brand/agent.md → Mode 1 execution
3. Brand Agent fetch HTML, extract palette + fonts + logo hint
4. Brand Agent map → THEME.md + generate brand book preview
5. Return Coach với "brand done — anh/chị duyệt?"
```

#### Nếu (B) Images
```
1. User upload images vào chat
2. Load agents/brand/agent.md → Mode 2 execution
3. Brand Agent vision parse mỗi ảnh, synthesize cross-image
4. Brand Agent map → THEME.md + generate brand book preview
5. Return Coach
```

#### Nếu (C) Text Q&A
```
1. Load agents/brand/agent.md → Mode 3 execution
2. Brand Agent ask 3 câu:
   - "3 brand tham khảo anh/chị thích?"
   - "Aesthetic: editorial / minimalist / playful / bold / soft / premium?"
   - "Color mood: warm / cool / neutral / vibrant / earthy?"
3. Brand Agent map → THEME.md + generate brand book preview
4. Return Coach
```

### Phần B' — Confirm brand book (sau khi Brand Agent done)

Coach show:
```
"OK Brand Agent đã setup xong:
- THEME.md filled
- Brand book preview: output/brand/{date}/brand-book.html

Anh/chị xem preview rồi cho em biết:
(1) ✓ Duyệt — em tiếp tục Setup CRM
(2) Sửa: '{cái cần sửa}' — em chuyển feedback cho Brand Agent tinh chỉnh
(3) Làm lại với mode khác — em invoke Brand Agent lại với input khác

Anh/chị chọn?"
```

User duyệt → tiếp Phần C (Setup CRM Portal).
User sửa → loop back Brand Agent với feedback.

---

### Phần C — Confirm + Save

```
"OK em đã có đủ thông tin. Tóm tắt full:

📦 Sản phẩm
- Tên: [tên cụ thể]
- Giá: [VND] ([1 lần / installment])
- Format: [course / service / digital / physical / coaching]

👥 Khách hàng
- Persona: [tuổi + nghề + budget]
- Pain: [pain cụ thể]
- Outcome muốn đạt: [outcome đo được]

⚡ Lợi thế
- USP: [USP hoặc 'cần research thêm']
- Social proof: [có / chưa có]

📍 Kênh
- Target: [FB / TikTok / Zalo / ...]
- Existing audience: [follower count nếu có]

🎯 Mục tiêu tháng này
- Revenue: [X VND]
- Tính ra: ~Y đơn = ~Z khách inbox (conversion 30%)

🎨 Brand (từ Brand Agent)
- Aesthetic: [auto-detected từ URL/image hoặc user pick]
- Palette: [5 HEX colors từ Brand Agent]
- Typography: [font heading + body]
- Inspiration source: [URL / images / text answers]
- Brand book preview: [output/brand/{date}/brand-book.html]

Em đã save vào BUSINESS.md và THEME.md.

Giờ anh/chị muốn bắt đầu từ đâu?

🎨 (A) TẠO CONTENT TRƯỚC — khuyến nghị cho người mới
   → Đóng gói offer, tạo bài đăng, carousel, lead magnet, ad copy, kịch bản chốt
   → KHÔNG cần setup gì thêm, làm được NGAY hôm nay
   → Phù hợp nếu anh/chị muốn thấy giá trị nhanh + build content trước khi bán

💰 (B) SETUP BÁN HÀNG — khi đã sẵn sàng nhận đơn
   → Em setup Customer Portal (~15 phút, cần 3 token Supabase/Vercel/Resend)
   → Portal lo: nhận thanh toán SePay, giao hàng tự động, quản lý khách (CRM)
   → CHỈ cần khi anh/chị build funnel bán hàng + nhận tiền

Anh/chị chọn? (A để tạo content ngay / B để setup bán hàng)"
```

→ Nếu (A): Chuyển sang `skills/coach/plan-generator/SKILL.md` với mục tiêu content-first
   (Plan template "Content" hoặc "Đóng gói offer" — KHÔNG cần Portal)
→ Nếu (B): Chuyển sang `skills/setup/crm-portal/SKILL.md` → sau đó plan-generator

**Quan trọng — phân biệt rõ cho khách:**
- Content creation (Offer, Brand, Post, Reels, Lead Magnet, Ads, Sale DM) → **KHÔNG cần Portal**
- Chỉ cần Portal khi: build Sale/Leads/Booking Funnel (nhận thanh toán + giao hàng tự động)
- → Khách mới nên (A) tạo content trước, setup Portal sau khi sẵn sàng bán. KHÔNG ép Portal ngay.

### Phần D — End-of-onboarding suggest /kit-help

Sau khi user chọn A/B và Coach handover sang setup/plan, append vào response cuối:

```
"💡 Tip cho anh/chị:

- Gõ `/kit-help` bất kỳ lúc nào để xem TẤT CẢ commands + learning roadmap
- Gõ `/kit-help stuck` nếu không biết bước nào tiếp theo
- Gõ `/coach status` để xem progress hiện tại

Em sẽ luôn ở đó qua /coach khi anh/chị cần."
```

→ Tip này show 1 LẦN duy nhất sau onboarding done, không spam mỗi response.

---

## Output File

**Path**: `output/coach/onboarding-{YYYY-MM-DD}.md`

**Format**:
```markdown
# Onboarding — {Date}

## Business intake (8 câu)
1. **Bạn là ai**: [answer]
2. **Sản phẩm**: [answer]
...

## Brand intake (5 câu)
...

## Next step
[A: Setup Portal / B: Plan generator]

## Files updated
- BUSINESS.md → filled
- THEME.md → filled (or partial)
```

Đồng thời Edit trực tiếp `BUSINESS.md` và `THEME.md` ở root project.

---

## Edge Cases

**User trả lời "chưa biết" cho 1 câu:**
- Ghi `[chưa rõ — cần update sau /offer research]` vào BUSINESS.md
- Tiếp tục câu kế, không hỏi lại

**User trả lời "chưa biết" cho 3+ câu liên tiếp:**
- DỪNG intake, đề xuất: "Em thấy anh/chị chưa có nhiều thông tin về business. Em đề xuất chạy `/offer research [niche]` trước — Offer Agent research giúp 30-45 phút, sau đó quay lại fill BUSINESS.md sẽ dễ hơn. OK không?"
- Save state pause vào `output/coach/onboarding-paused.md`

**User cung cấp business plan dài (1000+ chữ):**
- Em đọc, smart extract 8 trường, hiển thị summary cho user CONFIRM trước khi ghi
- Không paste nguyên đoạn vào BUSINESS.md
- Highlight chỗ em đoán (vd: extract từ context) cho user verify

**User skip onboarding (gõ `/offer` ngay):**
- BUSINESS.md vẫn `[Chưa điền...]` → Offer Agent sẽ block tại hard gate
- Coach can thiệp: "Cần BUSINESS.md trước. Em làm onboarding nhanh trong 5 phút?"

**User đã onboarding từ trước, giờ chỉ muốn UPDATE 1 phần:**
- Trigger: `/coach update business` hoặc `/coach update theme`
- Coach hỏi: "Anh/chị muốn update phần nào? (1) Sản phẩm/giá, (2) Persona, (3) Mục tiêu doanh thu, (4) Brand, (5) Tất cả"
- Chỉ hỏi lại các câu trong phần đó, không re-do từ đầu

**User type pricing có số 4 (vd: '4.997k'):**
- Cảnh báo: "Em thấy giá có số 4 — văn hoá VN tránh số 4 (associative). Anh/chị có muốn đổi thành 3.997k hoặc 4.987k không?"
- User quyết — Coach không tự đổi

**User trả lời tiếng Anh (vd: 'I sell online courses'):**
- Coach respect language → ghi vào BUSINESS.md bằng tiếng Anh
- Note: các Agent output (Sales page, content, DM) vẫn theo `BUSINESS.md` field "output language"
- Hỏi user: "Anh/chị muốn output (sales page, email, content) ngôn ngữ gì — Anh, Việt, hay mix?"
