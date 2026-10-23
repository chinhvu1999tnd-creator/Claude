# Logo Creator (SVG)

> Vẽ logo bằng SVG code thuần — không cần image API, output là native vector.

## Khi nào dùng

**Lệnh `/logo`** — user muốn tạo logo cho thương hiệu.

**Gợi ý tự động** — khi `/brand` thấy `THEME.md → Assets → Logo` còn trống.

---

## Workflow

### Bước 1 — Đọc context tự động

Load `THEME.md`:
- `--color-primary` → màu chính (dùng làm màu accent chính trong logo)
- `--color-cyan` → màu phụ
- `--color-purple` → màu thứ ba
- `--color-bg` → màu nền
- Heading Font → font cho text element trong SVG

Load `BUSINESS.md`:
- Tên thương hiệu → dùng cho lettermark, wordmark
- Ngành / lĩnh vực → gợi ý style phù hợp
- Brand voice → inform personality của logo

Không hỏi lại những gì đã có trong 2 file này.

---

### Bước 2 — Discovery (2 câu)

**Câu 1:**
> "Brand này cần logo trông như thế nào? Mô tả tự nhiên — VD: *chuyên nghiệp và công nghệ*, *vui vẻ và trẻ trung*, *sang trọng và tối giản*, *mạnh mẽ và bold*"

**Câu 2:**
> "Có element nào muốn thấy không? — VD: chữ cái tắt, hình học, biểu tượng cụ thể (robot, tia sáng, vòng tròn, mạng lưới...) hoặc để Claude quyết định"

Nếu user không chắc → gợi ý dựa trên ngành từ BUSINESS.md.

---

### Bước 3 — 3 Directions

Generate 3 hướng thiết kế khác nhau. Mỗi direction gồm:
- SVG 80×80 hiển thị **inline trong chat** (không save file)
- Tên style ngắn
- 1 dòng mô tả concept

Cách show SVG inline — dùng HTML block:

```
**Direction A — Lettermark Geometric**
*Chữ tắt thương hiệu với typography đặc biệt và accent neon*

<svg width="80" height="80" viewBox="0 0 80 80" ...>...</svg>
```

**Direction styles gợi ý** (chọn 3 phù hợp nhất với brand):
- **Lettermark** — chữ cái tắt với typography mạnh
- **Abstract Symbol** — hình học đại diện concept
- **Icon + Wordmark** — icon nhỏ kết hợp tên brand
- **Badge / Emblem** — logo trong khung hình học
- **Minimal Mark** — symbol đơn giản, tối giản cực đại
- **Network / Nodes** — phù hợp tech/AI brands
- **Wordmark Only** — tên brand với custom lettering

Hỏi sau khi show 3 directions:
> "Anh/chị thích hướng nào? Có thể chọn 1 hoặc kết hợp yếu tố từ nhiều hướng."

---

### Bước 4 — 3-4 Variations

Sau khi user chọn direction, gen 3-4 biến thể cùng style nhưng khác chi tiết:
- Khác proportion (compact vs airy)
- Khác weight (bold vs thin strokes)
- Khác accent (màu chính vs màu phụ làm highlight)
- Khác complexity (đơn giản hơn vs chi tiết hơn)

Tất cả show **inline** không save file. Sau đó hỏi:
> "Anh/chị muốn approve biến thể nào, hay cần chỉnh gì thêm?"

Iterate thoải mái cho đến khi user approve. Không giới hạn vòng.

---

### Bước 5 — Finalize + Integrate

Sau khi user approve:

**5a. Tính đường dẫn:**
- `NGAY` = ngày hôm nay `YYYY-MM-DD`
- `brand-slug` = tên thương hiệu lowercase, bỏ dấu, dấu cách → `-`

**5b. Tạo folder và ghi file:**
```bash
mkdir -p output/design/{NGAY}/{brand-slug}/logo
```
Dùng Write tool ghi `output/design/{NGAY}/{brand-slug}/logo/logo-final.svg`

SVG phải đầy đủ — standalone file với `xmlns`, `viewBox`, không cần CSS external.

**5c. Update THEME.md:**
Tìm section `## Assets` → sửa dòng Logo:
```
**Logo SVG Path:** output/design/{NGAY}/{brand-slug}/logo/logo-final.svg
```

**5d. Report kết quả:**
```
✓ Logo: output/design/{NGAY}/{brand-slug}/logo/logo-final.svg
✓ THEME.md cập nhật — Assets → Logo
```

Hỏi:
> "Regenerate brand book với logo mới không? (/brand — ~1 phút)"

---

## SVG Technical Standards

**ViewBox theo use case:**
- Icon vuông: `viewBox="0 0 80 80"`
- Horizontal lockup (icon + text): `viewBox="0 0 200 60"`
- Vertical lockup: `viewBox="0 0 100 120"`

**Màu sắc:** Dùng hex thật từ THEME.md (lấy lúc runtime). SVG standalone không support CSS variables.

**Typography trong SVG:** Dùng `font-family="Inter, sans-serif"` hoặc generic. Không import Google Fonts trong SVG.

**Scalability:** KHÔNG set `width`/`height` cố định trên `<svg>` — chỉ dùng `viewBox`. Consumer set kích thước.

---

## Rules

```
✅ Luôn đọc THEME.md + BUSINESS.md trước khi hỏi
✅ SVG phải scalable — viewBox, không fixed size
✅ Show SVG inline — không save trước khi user approve
✅ Sau approve → Write tool ghi file + update THEME.md
✅ Output: output/design/{YYYY-MM-DD}/{brand-slug}/logo/
✅ Iterate thoải mái — không giới hạn số vòng
❌ Không gen quá 4 variations/lần
❌ Không dùng image API (DALL-E, fal.ai) — SVG only
❌ Không import external font trong SVG file
```

## Tham chiếu

- `skills/design/logo-creator/references/svg-patterns.md` — SVG techniques & patterns
- `skills/design/brand-system/SKILL.md` — tích hợp sau khi có logo
