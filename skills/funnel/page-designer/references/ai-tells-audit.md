# AI Tells & Discipline Audit — VN Landing Page

> Reference này liệt kê những pattern **AI hay rơi vào** khi build landing/funnel tiếng Việt. Mỗi pattern ở đây là 1 "Tell" — dấu hiệu page do AI sinh ra, làm mất trust với cold traffic VN.
>
> Adapted từ `Leonxlnx/taste-skill` Section 9 (Forbidden Patterns), bỏ những rule không phù hợp VN context, thêm rule VN-specific.
>
> **Áp dụng:** Load cùng `page-designer/SKILL.md` ở Bước 4 (Self-Review). Mỗi mục dưới đây là 1 checkbox audit trước khi output HTML.

---

## A. Hard Ban — Không có ngoại lệ

### A1. Em-dash (`—`) toàn diện
Em-dash là **Tell số 1** của LLM tiếng Việt. Không native, không có trong văn nói VN, người đọc cảm nhận ngay là "máy viết".

**Banned ở:** Headlines, eyebrows, pills, body copy, quote, attribution, CTA text, alt text, button text, badge text, mọi vị trí user nhìn thấy.

**En-dash (`–`) cũng banned** khi dùng làm separator.

**Thay thế:**
- Headline: dùng dấu chấm hoặc dấu phẩy
- Body copy: tách 2 câu, hoặc dùng `,` `:` `(...)`, hoặc xuống dòng
- Quote attribution: dùng hyphen với spaces (` - `), hoặc xuống dòng cho tên
- Date range: `2018-2026` (hyphen), KHÔNG `2018–2026`
- Number range: `40-80tr` (hyphen)

**Chỉ permitted:** hyphen thường (`-`) cho compound words, ranges, math.

### A2. Em-dash trong copy generated từ landing-copy skill
Khi load `landing-copy/SKILL.md`, kiểm tra output trước khi paste vào HTML. Nếu copy có `—` ở bất kỳ đâu → rewrite trước khi build HTML. Không hợp lý hóa "dùng ít thôi", "trong body copy thì OK". Zero.

---

## B. Hero Discipline

### B1. Hero Stack Limit — max 4 text elements
Hero là **1 moment**, không phải checklist. Tối đa 4 elements:

1. Eyebrow (small uppercase label) **HOẶC** brand strip — chọn 0 hoặc 1, không cả hai
2. Headline (max 2 dòng desktop)
3. Subtext (max 20 từ VN, max 4 dòng)
4. CTAs (1 primary + tối đa 1 secondary)

**Banned trong hero:**
- Tagline nhỏ dưới CTAs ("Áp dụng cho tài khoản mới, có hiệu lực đến 31/12")
- Trust micro-strip ("Đã có 1247 học viên tham gia") trong cùng row với hero copy
- Pricing teaser ("Từ 297K — tiết kiệm 60%")
- Feature bullet list
- Social-proof avatar row
- Countdown timer (countdown nên là section riêng below hero)

→ Tất cả những element trên **chuyển xuống section riêng** ngay sau hero, không nhét vào hero.

### B2. "Used by / Trusted by" logo wall = section riêng
Logo wall **không bao giờ** nằm trong hero. Nó là 1 section riêng ngay dưới hero. Nếu đang nhét logos vào hero flex row → sai.

### B3. Hero fits initial viewport
- Headline ≤ 2 dòng desktop, ≤ 3 dòng mobile
- Subtext ≤ 20 từ AND ≤ 4 dòng
- Primary CTA visible without scroll
- Nếu copy quá dài → cắt copy hoặc giảm font scale. KHÔNG để overflow.

### B4. Font-scale planning
Plan font size **cùng với** hero asset size. Nếu hero có asset lớn + headline > 6 từ → không bắt đầu ở `text-7xl`. Default range: `text-4xl md:text-5xl lg:text-6xl`. Chỉ `text-6xl md:text-7xl` khi headline 3-5 từ.

Hero headline 4 dòng = **luôn là font-size error**, không bao giờ là copy-length error.

---

## C. Section Composition

### C1. Eyebrow Restraint — không phải section nào cũng có eyebrow
Pattern "small uppercase tracking caps phía trên H2" là AI tell khi áp dụng cho **mọi section**. Tạo nhịp templated khiến mọi section được "announce" giống hệt nhau.

**Rule:** Tối đa **một nửa** số sections có eyebrow. Alternate: section có eyebrow → section không → section có → ...

**Trigger fail:** Nếu thấy mình viết `text-[11px] uppercase tracking-[0.18em]` ở 6+ sections → vi phạm. Cắt bớt.

Hero được có eyebrow (hero là special). Còn lại alternate.

### C2. Section-Layout Repetition Ban
Một layout family chỉ xuất hiện **tối đa 1 lần** mỗi page. "Selected commissions" không được giống "What we do". Page có 8 sections phải dùng ít nhất 4 layout families khác nhau.

**Layout families:**
- 3-column-image-cards
- 2-column zig-zag
- Full-width quote
- Split text+image
- Bento grid
- Stat dividers row
- Vertical timeline
- Pricing compare 3-col
- Single centered card

Nếu thấy 3 section liên tiếp đều là "3-col cards" → vi phạm. Đổi 1 thành zig-zag hoặc bento.

### C3. Section Numbering Eyebrows ban
**Banned eyebrow patterns:**
- `01 / INDEX`
- `001 · Capabilities`
- `06 · How it works`
- `02 / 04`
- `Phase 01`
- `Stage 1`
- `Pass One`
- `Bước 1 · Bước 2 · Bước 3` (khi standalone, không có content riêng)

Eyebrow gọi tên topic bằng ngôn ngữ thường, không enumerate. "Cách hoạt động" thay vì "06 · Cách hoạt động".

**Override:** Khi step content thật sự rõ ràng (vd "Đăng ký → Học → Áp dụng"), dùng verb trực tiếp thay số: "ĐĂNG KÝ" / "HỌC" / "ÁP DỤNG" — không "Bước 1: Đăng ký".

### C4. Bento Cell Count Rule — N items → N cells
Bento grid có **chính xác** số cell bằng số content items.
- 3 items → 3 cells (1+2 split, hoặc 2+1, hoặc asymmetric trio)
- 5 items → 5 cells (2+3, 3+2, hero+4)
- 6 items → 6 cells

Cell rỗng giữa grid hoặc ở cuối grid = planning sai. Reshape grid, không paste blank tile.

### C5. Bento Background Diversity
Bento 6 ô white-on-white với chỉ text bên trong = boring AI default. Ít nhất 2-3 cells phải có visual variation: real image, brand-appropriate gradient (không AI-purple), pattern, tinted background, screenshot.

### C6. Page Theme Lock
1 page = 1 theme. Section không invert giữa chừng. Page dark mode → tất cả sections dark mode. Không có warm-cream section sandwich giữa dark sections (hay ngược lại).

**Exception:** Khi brief yêu cầu "Color Block Story" / "Theme Switch on Scroll" là deliberate composition (1 lần switch với transition mạnh, không phải random alternation). Tối đa 1 lần per page.

---

## D. Component Discipline

### D1. CTA Button Wrap Ban
Button text phải **fit 1 dòng ở desktop**. Label như "ĐĂNG KÝ NGAY KHÓA HỌC THIẾT KẾ" wrap 2-3 dòng = broken.

**Fix:**
- Cắt label: 3 từ max cho primary CTA, lý tưởng 1-2 từ — "ĐĂNG KÝ NGAY", "XEM CHI TIẾT", "BẮT ĐẦU"
- Hoặc widen button (không artificial `max-width` trên CTA)

### D2. Button Contrast Check (WCAG AA)
- Body text: contrast ratio ≥ 4.5:1
- Large text (18px+): contrast ratio ≥ 3:1

**Banned combos:**
- `bg-white` button + `text-white` label
- Transparent button trên page background không có border
- Ghost button trên ảnh nền không có backdrop/scrim/stroke
- Light placeholder trên near-white form
- Form labels grayer than 4.5:1 vs background

Audit MỌI CTA trước khi ship.

### D3. Form Contrast Check (WCAG AA)
Form inputs, placeholder text, focus rings, helper text, error text — tất cả pass WCAG AA contrast vs section background. White form trên white page section = broken.

### D4. Color Consistency Lock
Page chọn **1 accent color** → dùng nguyên page. Site warm-grey không có CTA blue ở section 7. Site rose-accent không có teal badge ở footer. Pick 1 accent, lock, audit mọi component.

### D5. Shape Consistency Lock
Page chọn **1 corner-radius scale**:
- All-sharp (radius 0)
- All-soft (radius 12-16px)
- All-pill (full radius cho interactive)

Mixed system OK chỉ khi có documented rule (vd "buttons full-pill, cards 16px, inputs 8px") và follow consistently. Round button trong square layout / square card trên pill-button page = broken.

### D6. Decorative Status Dots — chỉ khi có semantic state thật
Chấm xanh giả "live" trước mỗi nav item, mỗi badge, mỗi list row → AI tell. Banned.

**Permitted:** Khi dot represent real semantic state (live indicator của server, availability flag). Tối đa 1 dot per page section.

### D7. Generic Avatar / Egg Icon ban
Avatar SVG "egg" mặc định, Lucide user icon, generic placeholder figure → all banned trong production output.

**Use instead:** [PERSON] media-slot với placeholder rõ ràng + label "Ảnh học viên thật", hoặc real photo URL khi có.

### D8. Italic Descender Clearance
Khi dùng italic trong display headline mà từ chứa descender letter (`y g j p q`), `leading-[1]` hoặc `leading-none` sẽ clip descender. Dùng `leading-[1.1]` tối thiểu + `pb-1` hoặc `mb-1` reserve trên wrapping element.

Audit MỌI italic word trong display headline trước khi ship.

---

## E. Content & Copy Tells

### E1. Filler Verbs VN — Banned as default
Những verb này AI hay rơi vào, copy mất trust ngay:

- "Đột phá" / "Bứt phá"
- "Tối ưu hóa" / "Nâng tầm"
- "Khai phá tiềm năng"
- "Chinh phục"
- "Vươn xa" / "Vươn tới"
- "Lan tỏa giá trị"
- "Kiến tạo tương lai"
- "Cách mạng" / "Revolutionary"
- "Đỉnh cao" / "Vượt trội"

**Use instead:** Verb cụ thể, đo đếm được. "Tăng doanh thu 3 lần" thay "Đột phá doanh thu". "Học 30 phút/ngày" thay "Tối ưu thời gian học".

### E2. Generic Step Labels ban
**Banned:**
- "Bước 1 / Bước 2 / Bước 3" khi đứng standalone không có content riêng
- "Giai đoạn 01 / 02 / 03"
- "Stage 1 / 2 / 3"

**Use instead:** Verb-noun trực tiếp. "Đăng ký → Học → Áp dụng" thay "Bước 1: Đăng ký, Bước 2: Học, Bước 3: Áp dụng".

### E3. Fake-Perfect Numbers ban
- `99%`, `100%`, `50%`, `1234567`
- "100% học viên thành công"
- "Tăng doanh thu 1000%"

Use organic, messy numbers khi có thật:
- `47.2%` thay `50%`
- `1.247 học viên` thay `1000+ học viên`
- `+1 (312) 847-1928` thay `0901234567`

### E4. Fake-Precise Numbers without Source
Số cụ thể như `92%`, `4.1×`, `48k`, `5.8 mm`, `13.4 lb`:
- Có thật từ data/brief → OK
- Đánh label rõ "ví dụ", "mock" → OK
- AI bịa ra cho có vẻ chính xác → BANNED

Đừng giả engineering precision mà brand không claim.

### E5. Generic Names ban
- "Anh A · Học viên" (chưa có ảnh thật + tên thật)
- "Chị B · Khách hàng"
- "John Doe", "Sarah Chan", "Jane Doe"
- "Acme Corp", "Nexus", "Cloudly", "SmartFlow"

Use creative, realistic, VN-locale names: "Nguyễn Minh Tuấn", "Trần Thu Hà", "Lê Hoàng Anh". Brands invented phải sound real với industry context.

### E6. Poetic Section Labels ban
**Banned section header patterns:**
- "Từ trải nghiệm thực tế..."
- "Câu chuyện đằng sau..."
- "Field notes" / "From the field"
- "Quietly trusted by" / "Quietly in use at"
- "On our desks" / "Currently on the bench"

Use plain functional labels: "Cảm nhận học viên", "Đối tác", "Cách hoạt động", "Đang dùng tại".

### E7. Micro-meta sentences under eyebrows
Banned: Sentence kiểu *"Đây là những tính năng đang ship hôm nay, không phải roadmap. Danh sách sẽ giữ ngắn có chủ đích."* nằm dưới section heading. Clutter.

Eyebrow + Headline + Body là đủ. Bỏ micro-meta.

### E8. Locale / Weather / Time strips ban
"Lisbon 14:23 · 18°C", "TPHCM · 6:30 sáng · 28°C" — agency cliché. Banned 99% briefs.

**Permitted:** Khi brief là globally-distributed studio với timezone-relevant work, travel brand, real-world physical venue. Single contact-address ở footer thì OK; atmospheric locale strip không.

### E9. Scroll Cues ban
- "↓ Scroll" / "Scroll to explore" / "Cuộn xuống để xem"
- Animated mouse-wheel icon

Nếu user chưa scroll, họ đang nhìn hero. Họ biết scroll là gì. Bottom of viewport không cần label.

### E10. Fake Live Counters ban — VN-specific
- "Còn 4/10 suất" không có data source
- "12 người đang xem trang này" giả
- "Đã có 247 người đăng ký hôm nay" giả

**Permitted:** Khi có **real-time data source** thật (Sheet, DB, webhook đếm). VD: SePay đếm số đơn đã thanh toán trong cohort → display được. Số fake = banned.

### E11. Quote Length Cap
**Max 3 dòng** quote body. Không bao giờ 6 dòng. Quote dài hơn → cắt. Landing-page quote là snippet, không phải full review.

Attribution: tên + role + (optional) company. Không bao giờ chỉ tên ("- Sarah").

Quote marks: typographic quotes ( " " ) hoặc không có gì. Không dùng straight ASCII ( " ).

### E12. Version Labels in Hero ban
- `V0.6`, `v2.0`, `BETA`
- `INVITE-ONLY PREVIEW`, `EARLY ACCESS`
- `ALPHA`

Banned as default hero eyebrow. **Permitted** khi brief là explicit product launch / preview / early access campaign.

### E13. Version Footers ban
Footer strings như `v1.4.2`, `Build 0048`, `last sync 4s ago · main` là CLI/devtool fixtures, không phải landing page content. Banned trên marketing/landing/portfolio pages.

---

## F. Visual Tells

### F1. Pills/Labels Overlaid on Images ban
- `<span>` overlay trên ảnh với "Brand · 02", "PLATE · BRAND", "Field notes"

Either để ảnh tự nói, hoặc caption directly below (outside image).

### F2. Photo-credit Captions as Decoration ban
- "Field study no. 12 · Ines Caetano"
- "Plate 03 · House archive"
- "Frame XII · 35mm"

Photo credit chỉ permitted khi có **photographer thật** được credit cho ảnh thật (với permission). Khác = skip caption hoặc 1-line functional caption.

### F3. Decoration Text Strip at Hero Bottom ban
- `BRAND. MOTION. SPATIAL.`
- `TYPE / FORM / MOTION`
- `DESIGN · BUILD · SHIP`
- `ESTD. 2018 · TPHCM · BRAND. MOTION.`

Strip mono-caps ngang ở bottom của hero = agency portfolio cliché. Banned.

**Permitted:** Khi strip mang real navigable links (sticky bottom nav) hoặc real status info (cookie banner).

### F4. Floating Top-Right Sub-text in Section Heading ban
Pattern: section có headline lớn left-aligned; ở top-right corner của cùng section header có small explainer paragraph floating không clear alignment. Floater đó là Tell.

**Fix:** Đặt sub-text directly under headline, hoặc build clean 2-column header (left: headline, right: aligned body). Không tiny corner paragraph.

### F5. `border-t` + `border-b` Every Row Ban
Long list / spec table với 10 rows + hairline dưới mỗi row = lazy layout.

**Use instead** (xem `SKILL.md` Bước 3 → "Long lists need different UI"):
- 2-col card grid với spec name + value + 1-line why
- Scroll-snap horizontal pills
- Grouped chunks (10 specs → 3 logical clusters)
- Featured-vs-rest (3-4 hero specs + collapsed "Xem đầy đủ")

### F6. Scoring/Progress Bars with Filled Background Tracks ban
Cho comparison visuals: big filled `bg-zinc-200` tracks với partial fill on top = dashboard UI clutter trên landing page.

**Use instead:** Number + small icon, hoặc tiny inline bar WITHOUT background track.

### F7. Div-based Fake Screenshots ban — phân biệt với Media Slots
**Banned:** Hand-built product UI bằng `<div>` rectangles (fake task list, fake terminal, fake dashboard styled từ divs). #1 LLM design Tell.

**Permitted = Media Slot Placeholder:**
- `media-slot` với `data-role="PRODUCT"` + dashed border + label "Screenshot dashboard"
- Đây là **TODO placeholder cho ảnh thật**, không phải fake UI
- Khi user có screenshot → replace bằng `<img>`

**Phân biệt rõ:**
- Fake screenshot = `<div>` styled như dashboard với data giả → BANNED
- Media slot = empty placeholder với `data-role` + dashed border → BẮT BUỘC trên sales page (để text-only page không mất conversion)

### F8. Hand-rolled Decorative SVGs as Default
- Custom illustration vẽ tay bằng SVG paths
- Logos invented vẽ bằng tay
- Decorative marks complex

**Strongly discouraged** as default. Permitted chỉ khi:
- Brief explicit ask ("vẽ cho tôi SVG logo")
- 1 simple geometric mark (square, circle, wordmark)
- Confident về output quality

### F9. Inter as Default Font ban
Inter là LLM default font cho mọi project. Tạo cảm giác "AI generated" ngay.

**Use instead** (từ theme system):
- `dark-bold-neon` → Inter Tight (đã modify, OK)
- `bright-learn` → Plus Jakarta Sans
- `prestige-dark` → Cormorant Garamond
- `bold-persona` → Syne
- `warm-authority` → Lora

Khi tạo custom theme: chọn từ font pairings trong `frontend-design/SKILL.md` (Bricolage Grotesque, Cabinet Grotesque, Satoshi, Outfit, Geist) — KHÔNG default Inter.

**Override:** Inter OK khi brief là `clean-clinic` theme (medical/clinical), B2B formal, hoặc user explicit request.

### F10. AI-Purple / Neon Glow Random ban
"AI Purple / Blue glow" aesthetic là LLM default. Banned khi:
- Brand không có purple trong identity
- Random gradient không có purpose
- Generic neon glow trên mọi button

**Permitted:** Theme là `dark-bold-neon`, hoặc brand explicit ask purple/violet. Khi dùng → execute với intent: consistent palette, harmonised neutrals, restrained gradients.

---

## G. Vietnamese Sales Page — Specific Tells

### G1. Emoji Sticker Decoration overuse
🔥🎯💎✨💪 ở mỗi heading, mỗi bullet point, mỗi CTA → AI tell.

**Rule:** Tối đa 2 emoji per section khi cần. Đa số sections không cần emoji nào. Dùng SVG icon thay thế (xem `SKILL.md` Quality Standards Rule 1).

### G2. "Cam kết hoàn tiền 100%" without Terms
Generic guarantee statement không có terms cụ thể = không build trust.

**Fix:** Specify terms cụ thể:
- "Hoàn 100% trong 30 ngày nếu không hài lòng — không hỏi lý do"
- "Đảm bảo kết quả sau 60 ngày hoặc hoàn tiền + tặng thêm 10% phí dịch vụ"
- "Cam kết 1-1 trong 90 ngày: nếu không đạt mục tiêu, hoàn 100% + giữ tài liệu"

### G3. Testimonial without Real Photo on Cold Traffic
Cold traffic VN siêu skeptical với testimonial. Generic placeholder "Anh A · Học viên" giết credibility.

**Rule:** Sales page cho cold traffic → testimonial **bắt buộc** có:
- Ảnh mặt người thật (hoặc real-photo media-slot placeholder rõ ràng)
- Tên đầy đủ (Nguyễn Văn A, không "Anh A")
- Role/company cụ thể ("Giám đốc Marketing tại ABC Co.", không "Học viên")
- Result cụ thể có thể verify ("Tăng 47 học viên trong 30 ngày")

### G4. Urgency without Real Constraint
"CHỈ CÒN 4/10 SUẤT — ĐĂNG KÝ NGAY" không có real constraint backing = scammy feel.

**Permitted:** Có real cohort limit (vd "Mỗi tháng nhận 20 mentee 1-1"), có real time-bound (cohort start date), có real bonus expire (bonus chỉ cho 50 người đầu).

Không có real constraint → bỏ urgency, focus value.

### G5. Multi-color Heading Words
H1 với "[từ 1 trắng] [từ 2 tím] [từ 3 cam]" → AI tell phổ biến VN sales page.

**Permitted:** 1 từ accent (key word) trong cùng accent color của theme. Không 3 màu khác nhau trong cùng headline.

**OK:** "Build sales page **convert** trong 1 ngày" — từ "convert" accent
**Banned:** "Build **sales page** convert **trong 1 ngày**" — multi-color

### G6. Number-Heavy Hero Stats
Hero stat row với "1,247 học viên · 98% hài lòng · 4.9⭐ · 12 năm kinh nghiệm · 50+ chuyên gia" — quá nhiều numbers, không số nào stick.

**Rule:** Hero stat row max 3 numbers. Mỗi số phải verifiable. Số xuất sắc nhất hoặc nhất quán nhất.

---

## H. Audit Workflow

Trước khi output HTML, chạy qua từng group:

```
□ A. Em-dash zero check (tất cả file copy + HTML)
□ B. Hero discipline (max 4 elements, fits viewport, logo wall outside)
□ C. Section composition (eyebrow alternation, layout diversity, bento count, theme lock)
□ D. Component (CTA wrap, contrast WCAG, color/shape lock, dots removed)
□ E. Content (filler verbs, step labels, fake numbers, generic names, poetic labels)
□ F. Visual (overlay pills, photo credits, hero strip, fake screenshots)
□ G. VN-specific (emoji, guarantee terms, testimonial photos, real urgency)
```

Mỗi group có ❌ → fix trước, không output. Không cần báo user về audit — chỉ output bản đã fix.

---

## I. Override Authority

User explicit ask = override. Examples:
- "Tôi muốn dùng Inter" → OK (E2/F9 override)
- "Page launch của tôi cần BETA badge" → OK (E12 override)
- "Brand tôi tím rồi" → purple permitted (F10 override)
- "Testimonial tôi chỉ có tên không có ảnh" → use stylized placeholder rõ ràng, không egg icon (G3 partial override)

User không ask explicit → tất cả default ban hold.

---

## J. Source

Adapted từ:
- `Leonxlnx/taste-skill` — Section 9 (AI Tells), Section 4 (Engineering Directives), Section 14 (Pre-Flight)
- VN-specific additions: G group, em-dash rationale, filler verbs VN, testimonial requirement
- Aligned với existing kit memories: media-slot mandatory, content pronouns bạn/tôi

Không copy whole skill (taste-skill là React/Next stack, không phù hợp HTML+Tailwind CDN của kit này). Chỉ trích phần áp dụng được.
