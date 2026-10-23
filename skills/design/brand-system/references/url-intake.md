# URL Intake — Parse brand từ website tham khảo

> Khi user paste URL như "tôi thích style giống stripe.com" — Brand Agent fetch HTML, extract palette + fonts + logo hint.

## When to use

User input có URL → mode này active. Examples:
- "Tôi thích design giống https://shopify.com"
- "Brand muốn nhìn giống Notion"
- URL paste trực tiếp (stripe.com, vercel.com, ...)

## Extraction Strategy

### 1. Fetch HTML
Dùng WebFetch tool của Claude với URL user paste. Lấy về HTML raw.

### 2. Extract Colors (5-7 dominant)

Tìm trong HTML theo thứ tự ưu tiên:

#### a. Meta `theme-color` (most reliable)
```html
<meta name="theme-color" content="#0066ff">
```
→ Đây là color chính brand declare. Add vào palette as `primary`.

#### b. CSS custom properties trong `<style>` inline
```css
:root {
  --color-primary: #0066ff;
  --color-accent: #ff3366;
  --color-bg: #ffffff;
}
```
→ Match pattern `--color-*:` hoặc `--bg-*:`, `--text-*:`.

#### c. og:image color hint
```html
<meta property="og:image" content="https://example.com/og.png">
```
→ Suggest user "Logo brand có thể lấy từ {og:image}" — nếu cần, Brand Agent gợi ý fetch image rồi dùng vision parse dominant color.

#### d. Inline styles fallback
Search HTML cho `style="...color: #..."` patterns. Lấy 10 unique HEX phổ biến nhất → cluster thành palette.

### 3. Extract Fonts (2-3 families)

#### a. Google Fonts link (most common)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Plus+Jakarta+Sans:wght@500;700" rel="stylesheet">
```
→ Parse `family=` params. Đây là font brand đang dùng.

#### b. font-family trong inline `<style>`
```css
body { font-family: 'Inter', system-ui, sans-serif; }
h1 { font-family: 'Playfair Display', serif; }
```
→ Extract font names, distinguish body vs heading.

#### c. Fallback
Nếu không tìm được font, suggest VN-friendly default:
- Body: `Inter` (universal) hoặc `Be Vietnam Pro` (VN native)
- Heading: `Plus Jakarta Sans` (modern) hoặc `Playfair Display` (editorial)

### 4. Extract Logo Hint

#### a. Favicon
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico">
```
→ Logo color của brand thường match favicon. Em fetch favicon SVG nếu có (text-friendly).

#### b. og:image
Nếu og:image hợp lệ, em gợi ý user "Em có thể derive logo style từ ảnh này, hoặc anh/chị muốn /brand logo tạo mới?"

## Output mapping → THEME.md

Sau khi extract xong, fill THEME.md:

```markdown
## Bảng màu
- Primary: {từ theme-color hoặc dominant blue/brand color}
- Secondary: {dominant color #2}
- Accent: {dominant color #3 — thường vibrant cho CTA}
- Background: {usually white/#fff}
- Text: {usually #1a1a1a hoặc dark}

## Typography
- Headings: {font heading từ URL}
- Body: {font body từ URL}

## Aesthetic
- {auto-detect từ HTML structure + spacing}
  - Lots of whitespace + sans-serif → minimalist
  - Serif + center align → editorial
  - Heavy color + animation → playful
  - Big typography + brutalism cues → bold
  - Rounded corners + pastel → soft

## Inspiration source
- URL: {URL user paste}
- Captured at: {timestamp}
```

## Limitations (transparent với user)

Em thông báo user khi extract:
```
"Em đã parse {URL}:
✓ Tìm được palette 5 màu chính
✓ Font headings: {X}, body: {Y}
✓ Aesthetic: {minimalist/editorial/...}
⚠️ Logo: brand site dùng SVG complex — em recommend chạy /brand logo riêng để tạo logo SVG của anh/chị

Em đã fill THEME.md. Anh/chị duyệt brand-book preview chứ?"
```

## Errors & Fallback

| Lỗi | Fallback |
|-----|---------|
| URL 404 / không accessible | Hỏi user thử URL khác hoặc switch sang Mode 2/3 |
| HTML không có color info (JS-only site) | Suggest user paste **screenshot trang web** thay vì URL → switch Mode 2 (image) |
| Site dùng Tailwind CSS không có CSS vars | Lấy từ inline `class="bg-blue-500"` → map về HEX |
| User paste URL VN site (lazada, shopee) | Vẫn work, nhưng warn fonts có thể là default system, không match đẹp brand |

## Example Run

User: "I want brand giống https://linear.app"

Brand Agent:
```
✓ Fetched https://linear.app
✓ Found theme-color: #5E6AD2 (Linear purple)
✓ Found CSS vars: --color-primary: #5E6AD2, --color-bg: #0e0e10 (dark mode)
✓ Found fonts: 
  - Heading: Inter Display
  - Body: Inter
✓ Aesthetic detect: minimalist + dark mode

→ Em đã fill THEME.md với palette dark theme + Inter font.
   Anh/chị muốn xem brand-book preview, hoặc đổi sang light theme version không?"
```
