# Hệ Thống Thương Hiệu (Brand System)

> Tạo bộ nhận diện thương hiệu đầy đủ: design-system.html scrollable + brand-book-a4.html/pdf giao cho client.

## Khi nào dùng

**Lệnh `/brand`** — user chủ động khi muốn tạo brand book cho business.

**Tự động** — Claude gọi skill này khi bắt đầu build funnel/landing page: kiểm tra folder `output/design/` có subfolder nào chưa — nếu chưa có, nhắc user chạy `/brand` để gen design system trước.

---

## Workflow

### Bước 1 — Đọc THEME.md tự động

Load `THEME.md` và extract các giá trị sau:

| Token cần điền | Lấy từ THEME.md |
|----------------|----------------|
| `{{TEN_THUONG_HIEU}}` | BUSINESS.md → **Tên thương hiệu** (field "Tên thương hiệu:" hoặc "Tên doanh nghiệp:") |
| `{{TAGLINE}}` | Brand Style → Overall Feel (rút gọn thành 1 dòng) |
| `{{FONT_TIEU_DE_NAME}}` | Typography → Heading Font (tên font, không có weight) |
| `{{FONT_NOI_DUNG_NAME}}` | Typography → Body Font |
| `{{FONT_MONO_NAME}}` | Typography → nếu không có → để trống (dùng system mono) |
| `{{GOOGLE_FONTS_LINK}}` | Google Fonts Import → thẻ `<link>` đầy đủ |
| `{{MAU_CHINH}}` | CSS Variables → `--color-primary` |
| `{{MAU_PHU}}` | CSS Variables → `--color-cyan` (ưu tiên 1) → `--color-purple` (ưu tiên 2) |
| `{{MAU_THU_BA}}` | CSS Variables → `--color-purple` (nếu cyan là màu phụ) |
| `{{MAU_NEN}}` | CSS Variables → `--color-bg` |
| `{{MAU_SURFACE}}` | CSS Variables → `--color-surface` |
| `{{MAU_VIEN}}` | CSS Variables → `--color-light-gray` |
| `{{MAU_CHU}}` | CSS Variables → `--color-text-head` |
| `{{MAU_MO}}` | CSS Variables → `--color-text-muted` |
| `{{MAU_ALERT}}` | CSS Variables → `--color-alert` |
| `{{LOGO_SVG}}` | Assets → Logo URL (nếu là SVG URL → fetch inline; nếu không có → để trống) |
| `{{NGUYEN_TAC_1}}` đến `{{NGUYEN_TAC_4}}` | Brand Style → Brand Voice (diễn giải thành nguyên tắc) |
| `{{P1_TEN}}` đến `{{P6_TEN}}` | User cung cấp ở Bước 2 — tên sản phẩm/khóa học |
| `{{P1_MAU}}` đến `{{P6_MAU}}` | User cung cấp ở Bước 2 — màu hex đặc trưng |
| `{{P1_VAI_TRO}}` đến `{{P6_VAI_TRO}}` | User cung cấp ở Bước 2 — mô tả ngắn vai trò |

Sau khi đọc xong, **liệt kê rõ** những field còn thiếu hoặc chưa chắc chắn.

---

### Bước 2 — Hỏi những gì còn thiếu

Chỉ hỏi field chưa có. Nếu THEME.md đầy đủ → bỏ qua bước này hoàn toàn.

Thứ tự ưu tiên hỏi:
1. **Logo SVG** — paste SVG code hoặc bỏ qua (section wordmark vẫn gen được)
2. **Tagline** — 1 dòng ngắn, nếu THEME.md không có tagline rõ ràng
3. **Nguyên tắc thiết kế** — 4–6 quy tắc; nếu không có → drop section "Nguyên Tắc Thiết Kế"
4. **Sản phẩm / Khóa học** — tùy chọn: tên + màu đặc trưng (4–6 items); nếu không có → drop section này

**Không bịa bất kỳ thông tin nào.**

---

### Bước 3 — Xác nhận với user

Hiển thị bảng tóm tắt trước khi gen:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BRAND SYSTEM — XÁC NHẬN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tên:         [TEN_THUONG_HIEU]
Tagline:     [TAGLINE]
Màu chính:   [MAU_CHINH]
Màu phụ:     [MAU_PHU]
Màu thứ ba:  [MAU_THU_BA]
Font:        [FONT_TIEU_DE_NAME] / [FONT_NOI_DUNG_NAME]
Logo SVG:    Có ✓ / Chưa có ✗
Principles:  [số lượng] nguyên tắc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Hỏi: "Thông tin trên đúng không? Xác nhận để tôi bắt đầu gen."

Nếu user muốn chỉnh → cập nhật và hiển thị lại bảng. Chỉ gen khi có xác nhận rõ ràng.

---

### Bước 4 — Generate 2 HTML files

1. Tính `brand-slug` từ tên thương hiệu:
   - Lowercase toàn bộ
   - Bỏ dấu tiếng Việt (ă→a, ê→e, ô→o, ư→u, đ→d, v.v.)
   - Dấu cách → `-`
   - Ví dụ: "Học Viện AI" → `hoc-vien-ai`

2. Tính `NGAY` = ngày hôm nay theo định dạng `YYYY-MM-DD`

3. Tạo folder output:
   ```
   output/design/{NGAY}/{brand-slug}/
   ```

4. Đọc `skills/design/brand-system/templates/design-system.html`
   → Fill tất cả `{{TOKEN}}` → ghi vào `output/design/{NGAY}/{brand-slug}/design-system.html`

5. Đọc `skills/design/brand-system/templates/brand-book-a4.html`
   → Fill tất cả `{{TOKEN}}` → ghi vào `output/design/{NGAY}/{brand-slug}/brand-book-a4.html`

**Quy tắc fill token:**
- Section có token `{{NGUYEN_TAC_*}}` mà không có data → xóa toàn bộ section đó khỏi output
- Section sản phẩm `{{P*_*}}` không có data → xóa section đó khỏi output
- `{{LOGO_SVG}}` không có → thay bằng placeholder text tên thương hiệu viết tắt
- Không để lại bất kỳ `{{TOKEN}}` nào trong output

---

### Bước 5 — Render PDF

Detect Chrome/Chromium trước khi render:
- **macOS**: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`
- **Linux**: `chromium` hoặc `google-chrome`
- **Không tìm thấy**: thông báo và cung cấp lệnh để user tự chạy

Lệnh render (macOS):

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="output/design/{NGAY}/{brand-slug}/brand-book-a4.pdf" \
  "file://$PWD/output/design/{NGAY}/{brand-slug}/brand-book-a4.html"
```

Thay `{NGAY}` và `{brand-slug}` bằng giá trị thực.

Nếu Chrome không có hoặc lệnh thất bại:
- Thông báo cho user
- Cung cấp lệnh đầy đủ để user tự chạy
- Vẫn report 2 file HTML đã gen thành công

---

### Bước 6 — Deliver + Iterate

Report kết quả:

```
✓ Design system:  output/design/{NGAY}/{brand-slug}/design-system.html
✓ Brand book:     output/design/{NGAY}/{brand-slug}/brand-book-a4.html
✓ PDF:            output/design/{NGAY}/{brand-slug}/brand-book-a4.pdf
```

Sẵn sàng chỉnh sửa: màu sắc, font, layout, nội dung copy, wordmark style.

---

## Rules

```
❌ Không bịa màu, font, logo, tagline, principles
❌ Không redraw logo — dùng đúng SVG từ source hoặc text placeholder
❌ Không overflow A4 — tighten padding nếu content quá nhiều
❌ Không dùng framework, build tool, hay JS phức tạp
✅ Luôn self-contained — Google Fonts CDN, inline CSS/SVG, no build step
✅ Luôn render PDF — hoàn chỉnh artifact, không bàn giao raw HTML
✅ Luôn đọc THEME.md trước — pre-fill trước khi hỏi
✅ Luôn dùng Write tool để ghi file — không display content trong chat
✅ Drop section nếu không có source material
✅ Output path: output/design/{YYYY-MM-DD}/{brand-slug}/
```
