# Image Intake — Parse brand từ moodboard ảnh

> Khi user upload 1-5 ảnh inspiration — Brand Agent dùng Claude vision parse dominant colors + aesthetic mood + suggest font.

## When to use

User input:
- Upload 1-5 ảnh trực tiếp vào Claude Code chat
- Hoặc paste URL ảnh (Imgur, Pinterest pin, screenshot)
- Hoặc reference: "phong cách giống ảnh em chụp trong /Desktop/inspiration/"

Examples:
- Screenshot Pinterest board
- Ảnh chụp tạp chí favorite (Kinfolk, Cereal, Wallpaper*)
- UI screenshot apps user thích
- Ảnh nhà cửa / packaging brand thích
- 1 ảnh sản phẩm khách quan tâm (chụp từ Shopee, Lazada)

## Extraction Strategy

### 1. Per-image analysis (Claude vision)

Em đọc từng ảnh và extract:

#### a. Dominant Colors (3-5 per image)
- Identify color theo % pixel
- Loại bỏ pure white/black backgrounds nếu chiếm > 80%
- Output: HEX codes với label (vd: "warm beige #F5E6D3", "deep navy #1A2332")

#### b. Mood Signals
- **Warm**: cam, đỏ, vàng dominant → mood ấm áp
- **Cool**: xanh, tím, xanh lá → mood mát mẻ
- **Vibrant**: saturated colors → energetic, playful
- **Muted**: desaturated → calm, sophisticated
- **Dark**: dark mode aesthetic
- **Light/Airy**: nhiều khoảng trắng

#### c. Aesthetic Signals
- **Editorial**: serif fonts, generous spacing, photography-heavy (Kinfolk-like)
- **Minimalist**: lots of whitespace, sans-serif, monochromatic
- **Brutalist**: bold typography, raw, high contrast
- **Soft**: rounded, pastel, friendly (Cottagecore-like)
- **Playful**: bright colors, illustrations, animation cues
- **Premium**: gold accents, dark backgrounds, fine typography

### 2. Cross-image synthesis

Sau khi parse all images, combine:

```
Image 1: warm pastel, soft aesthetic, serif
Image 2: cream + beige + sage, editorial style
Image 3: muted pinks, hand-drawn elements

→ Synthesis:
  - Palette mood: WARM PASTEL (consistent across all)
  - Aesthetic: SOFT + slight EDITORIAL
  - Font suggest: Serif headline (Playfair / EB Garamond) + warm sans body (Inter / Be Vietnam Pro)
  - Brand voice: ấm áp, thân thiện, hand-crafted feel
```

→ Em prioritize **consistency cross-image** > 1 standout image. Nếu 4/5 ảnh warm + 1 ảnh dark, em vẫn pick warm.

### 3. Map to THEME.md

```markdown
## Bảng màu
Primary: #{từ dominant ảnh chính}
Secondary: #{dominant ảnh #2}
Accent: #{màu rare nhưng repeat trong nhiều ảnh — thường là CTA color}
Background: #{usually neutral từ ảnh}
Text: #{contrast với background}

## Typography
Heading: {serif/sans phù hợp aesthetic}
Body: {VN-friendly font giữ vibe}

## Aesthetic
{1 trong 6: editorial/minimalist/brutalist/soft/playful/premium}

## Mood Keywords (cho voice & copy)
{3-5 từ description}

## Inspiration sources
Ảnh 1: {brief description}
Ảnh 2: {brief description}
...
```

## Cost & Speed

| Item | Cost | Time |
|------|------|------|
| Vision parse 1 image | ~$0 (built-in Claude vision) | ~2-3s |
| 5 images analysis | $0 | ~10-15s |
| Map to THEME.md + render brand book | $0 | ~5s |
| **Total** | **FREE** | **~20-30s** |

→ Cực kỳ nhanh + miễn phí. UX "wow" cho user.

## Example Run

User: [uploads 4 ảnh: tạp chí Kinfolk cover + ảnh cốc cà phê pastel + ảnh studio làm việc minimalist + screenshot Cereal mag]

Brand Agent:
```
✓ Em phân tích 4 ảnh anh/chị gửi:

Image 1 (Kinfolk cover):
  - Colors: warm cream (#F5E6D3), muted sage (#7A8A6E), deep brown (#3A2E22)
  - Aesthetic: editorial + soft
  - Typography hint: serif headline + sans body

Image 2 (cốc cà phê pastel):
  - Colors: cream, dusty pink, warm beige
  - Mood: cozy, hand-crafted

Image 3 (studio minimalist):
  - Colors: light wood tone, white, accent green
  - Aesthetic: minimalist + natural

Image 4 (Cereal):
  - Confirms: editorial aesthetic, generous whitespace

🎨 SYNTHESIS:
  - Palette: WARM PASTEL EARTHY
    Primary: #F5E6D3 (cream)
    Secondary: #7A8A6E (sage)
    Accent: #C5605A (terracotta — cho CTA)
    Background: #FAFAF6 (off-white)
    Text: #2A2520 (warm dark brown)
  
  - Typography:
    Heading: 'Playfair Display' (serif, editorial)
    Body: 'Inter' (clean, VN-friendly)
  
  - Aesthetic: editorial + soft
  - Voice keywords: ấm áp, tinh tế, thủ công, gần gũi

→ Em đã fill THEME.md. Em render brand book preview để anh/chị xem nhé?"
```

## Limitations (transparent với user)

```
⚠️ Em parse được TƯƠNG ĐỐI dominant color, không 100% chính xác như Photoshop eyedropper.
Sau khi em fill THEME.md, anh/chị có thể:
- Confirm "đẹp rồi" → tiếp tục
- Tinh chỉnh: "đổi cream nhạt hơn" / "accent đậm hơn"
- Reset: "không thích, làm lại với mood {khác}"
```

## Errors & Fallback

| Lỗi | Fallback |
|-----|---------|
| User upload 1 ảnh duy nhất, không đại diện | Em note "1 ảnh chỉ tham khảo, brand có thể không nhất quán. Upload thêm 2-3 ảnh khác để em parse chính xác hơn." |
| Ảnh full text, không có visual | Hỏi user "Ảnh này text-only — anh/chị muốn em parse copywriting vibe (cho voice) hay cần ảnh visual khác?" |
| Ảnh chứa logo competitor | Cảnh báo: "Em thấy logo {brand X}. Em sẽ parse aesthetic, KHÔNG copy logo trực tiếp." |
| Ảnh xấu, low-res | Vẫn parse được color, nhưng warn quality |

## Combination với Mode 1 (URL)

User có thể kết hợp:
```
"Em thích style giống stripe.com (URL) + nhìn cozy như ảnh em vừa upload"

→ Brand Agent: 
  - URL parse Stripe palette (modern/clean)
  - Image parse cozy mood
  - Synthesize: clean Stripe-like structure + warm color palette from image
```

→ Best of both worlds.
