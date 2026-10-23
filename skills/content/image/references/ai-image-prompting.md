# AI Image Prompting Guide

How to write effective prompts for AI image generation models (Gemini, Flux, Ideogram, GPT Image, Midjourney).

---

## Prompt Structure

A strong image prompt follows this formula:

**[Subject] + [Setting/context] + [Visual style] + [Lighting] + [Composition] + [Technical specs]**

### Example Prompts by Use Case

**Blog hero — SaaS product:**
```
A clean workspace with a laptop displaying a colorful analytics dashboard,
minimalist desk with a coffee cup and notebook, bright natural window lighting from the right,
shallow depth of field, commercial photography style, 1200x630, high resolution
```

**Social media graphic — announcement:**
```
Abstract flowing gradient in deep purple and electric blue,
geometric shapes forming a network pattern, dramatic rim lighting on edges,
modern tech aesthetic, clean and minimal, 1080x1080, vibrant colors
```

**Product lifestyle shot:**
```
A person in a modern office smiling while looking at a tablet,
showing a project management interface on screen, warm candid photography,
natural lighting, medium shot, shallow depth of field, editorial style
```

**Profile banner — professional:**
```
Wide panoramic abstract background in navy blue and teal,
subtle geometric grid pattern with soft gradient, clean corporate aesthetic,
muted lighting, 1584x396, no text, space for logo overlay on left third
```

---

## Style Keywords

### Photorealistic
- commercial photography
- shot on Canon EOS R5
- editorial style
- natural lighting
- shallow depth of field

### Clean/Corporate
- clean modern aesthetic
- minimal design
- professional corporate style
- bright and airy
- white background

### Illustrative
- flat vector illustration
- isometric 3D render
- hand-drawn sketch style
- watercolor illustration
- line art

### Abstract/Brand
- flowing gradient
- geometric pattern
- abstract data visualization
- particle effects
- holographic iridescent

### Tech/SaaS
- dark mode UI aesthetic
- neon accent lighting
- glassmorphism
- futuristic minimal
- developer-focused

---

## Lighting Keywords

| Term | Effect | Best For |
|------|--------|----------|
| Natural light | Warm, organic feel | Lifestyle, editorial |
| Studio lighting | Even, controlled | Product shots |
| Rim lighting | Edge highlights, dramatic | Hero images, abstract |
| Soft directional | Gentle shadows, dimensional | Blog headers |
| Volumetric | Light rays, atmospheric | Dramatic, cinematic |
| Flat/even | No shadows, clean | Icons, diagrams |
| Golden hour | Warm orange tones | Lifestyle, outdoor |
| High key | Bright, minimal shadows | Clean, corporate |

---

## Composition Keywords

| Term | Effect | Best For |
|------|--------|----------|
| Rule of thirds | Subject off-center | Editorial, lifestyle |
| Centered | Subject in middle | Product shots, icons |
| Wide/panoramic | Expansive view | Banners, headers |
| Close-up/macro | Detail focus | Texture, product detail |
| Bird's eye/overhead | Top-down view | Desk setups, flat lays |
| Negative space | Room for text overlay | Blog headers, banners |
| Symmetrical | Balanced, formal | Corporate, luxury |

---

## Model-Specific Tips

### Gemini Image (Google)
- Best all-around cho marketing images — chất lượng tốt, giá hợp lý
- Supports image editing — upload ảnh có sẵn và describe changes
- Decent text rendering — dùng được cho headlines ngắn
- Specify "high resolution" cho output tốt nhất
- Cùng API với text generation — dễ integrate

### Flux (Black Forest Labs)
- Multi-image reference là killer feature — upload product screenshots, brand assets làm style reference
- Best cho brand consistency across nhiều ảnh
- Flux Pro cho final assets, Flux Dev cho rapid iteration
- Prompts có thể ngắn hơn — references làm heavy lifting
- Style transfer qua reference images > style keywords trong prompt

### Ideogram
- **Best text rendering** của bất kỳ model nào
- Dùng khi cần headlines, taglines, brand names trong ảnh
- Style reference system (up to 3 images) cho brand consistency
- Keep text requests đơn giản — 3-5 words max để reliable
- Best cho social graphics và banners cần text baked in

### GPT Image (OpenAI — gpt-image-1)
- Integrated với ChatGPT — conversational image generation
- Good ở following detailed prompts
- Decent text rendering (behind Ideogram)
- API gives more control than ChatGPT interface
- **Kit này đang dùng GPT Image** qua `skills/funnel/image-generator/`

### Midjourney
- Highest aesthetic quality cho artistic/editorial images
- Không có official API — Discord-based hoặc web interface
- Không phù hợp cho agent automation — dùng cho manual creative exploration
- Best cho hero images khi pure visual quality là ưu tiên

---

## Common Prompt Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| "A professional image" | Không có visual detail | Describe subject, setting, style, lighting |
| Long paragraph of text trong ảnh | Models không render được paragraphs | 3-5 words max; add text in post-processing |
| "Make it look good" | Không actionable | Specify style: "commercial photography, bright" |
| Prompt > 200 words | Models mất focus | 40-80 words, specific over comprehensive |
| Không specify aspect ratio | Random output size | Luôn specify dimensions hoặc ratio |
| "Logo in bottom right" | Placement không reliable | Add logos trong post-processing |
| "Make it viral" | Không phải visual instruction | Describe aesthetic muốn |
| Yêu cầu UI screenshots | AI hallucinate interfaces | Chụp screenshots thật |

---

## Batch Generation Workflow

Khi cần nhiều ảnh cùng style (blog series, social campaign):

1. Generate 3-4 test images với style prompts khác nhau
2. Chọn style phù hợp brand nhất
3. Save exact prompt làm template
4. Dùng Flux multi-reference — upload winning image làm style reference
5. Batch generate variations cùng style, khác subjects
6. Post-process — thêm text overlays, logos, crop theo platform sizes

---

## Cost Optimization

- Iterate ở low quality trước — dùng Flux Dev hoặc Gemini Flash cho drafts
- Dùng references thay vì long prompts — Flux multi-reference consistent hơn, ít retry hơn
- Batch similar requests — gen toàn bộ blog headers trong một session cùng style
- Cache và reuse — abstract backgrounds, patterns có thể reuse nhiều lần
- Post-process thay vì re-generate — crop, overlay text, adjust color trong code
