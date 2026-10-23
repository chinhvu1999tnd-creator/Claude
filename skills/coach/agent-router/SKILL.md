---
name: coach-agent-router
description: Map intent (text user input) → đúng Agent worker trong BASIC. Reference table cho Coach khi cần route command.
---

# Coach Agent Router Skill

## Khi Nào Dùng

- User input không rõ command nào (vd: "em ơi muốn bán khoá học") → Coach phải đoán
- Plan execute đến bước có agent name, cần map ra command + skills

---

## Intent → Agent Map (BASIC tier — 11 worker + Coach)

### Bảng quick reference

| Tín hiệu trong user input | Agent | Command | Skills load |
|---------------------------|-------|---------|-------------|
| "đóng gói", "research", "đối thủ", "niche", "thị trường", "validate" | **offer** | `/offer` | offer/market-research, offer/competitor-analysis, offer/offer-packaging, copywriting |
| "logo", "màu", "brand book", "identity", "font" | **brand** | `/brand` | design/brand-system, design/logo-creator |
| "bài đăng", "carousel", "post FB/IG", "quote card", "image card" | **post-content** | `/content post` hoặc `/content carousel` | content/post-image-card, content/social, content/image, copywriting, design/brand-system |
| "reels", "video ngắn", "tiktok", "shorts", "1-cảnh", "30 giây" | **simple-reels** | `/content reels` hoặc `/content video` | content/video-html, copywriting |
| "thu lead", "opt-in", "lead magnet", "free PDF", "email list", "checklist" | **leads-funnel** | `/funnel leads` | funnel/leads-funnel, funnel/landing-copy, funnel/page-designer, funnel/deploy, slide-html, email-marketing/lead-nurture |
| "bán", "sales page", "trang bán hàng", "ra đơn", "checkout", "mua ngay" | **sale-funnel** | `/funnel sales` | funnel/sales-page-funnel, funnel/landing-copy, funnel/page-designer, funnel/deploy, integrations/email, email-marketing/delivery-automation, deliver/payment-confirm, deliver/telegram-notification |
| "đặt lịch", "booking", "tư vấn 1-1", "discovery call", "calendar" | **booking-funnel** | `/funnel booking` | funnel/booking-call-funnel, funnel/landing-copy, funnel/page-designer, funnel/deploy, email-marketing/email-sequence |
| "affiliate", "cộng tác viên", "CRM connect", "tracking pixel" | **crm-affiliate** | `/coach crm` | funnel/crm, funnel/crm-connect, funnel/affiliate-integration, funnel/tracking |
| "ad copy", "quảng cáo FB/TikTok/Google", "creative brief", "headline ads" | **ads-content** | `/ads` | ads, copywriting, content/image |
| "DM", "inbox", "chốt khách", "objection", "follow-up", "Zalo chat" | **sale-dm** | `/sales` | sales/dm-scripts, sales/objection-handler, sales/closing-scripts, sales/follow-up-sequence, copywriting |
| "báo cáo", "doanh thu", "analytics", "social stats", "tối ưu CRO" | **analysis** | `/analyze` | analysis/social-analytics, analysis/revenue-report, analysis/optimization-advisor |

---

## Disambiguation Rules

Khi user input chứa NHIỀU tín hiệu:

### Ưu tiên 1: Intent đứng đầu câu
> "Anh muốn **bán** khoá học, kèm theo **landing page** + **email** sequence"
> → Intent chính: "bán" → `sale-funnel` (vì sale-funnel đã bundled landing + email)

### Ưu tiên 2: Object cụ thể
> "Em làm cho anh **video** để **bán** khoá yoga"
> → Cần cả: simple-reels + sale-funnel
> → Coach hỏi: "Anh muốn em làm theo thứ tự nào — bán trang trước rồi video, hay video trước rồi bán?"

### Ưu tiên 3: Stage trong customer journey
> "Anh muốn build phễu thu lead cho khoá X" 
> → Stage: top-of-funnel (lead, không phải sale) → `leads-funnel`

### Ưu tiên 4: Default fallback
> User input quá mơ hồ: "em làm gì giúp anh nào"
> → Coach: "Anh muốn em giúp với (A) Đóng gói sản phẩm, (B) Build phễu bán, (C) Tạo content, (D) Khác?"

---

## Multi-Agent Workflow (khi 1 input cần 2+ agent)

### Pattern A: Sequential — gọi từng cái
> "Bán khoá Y với content marketing" → Plan tự nhiên:
> 1. Offer (đóng gói) → 2. Brand → 3. Sale Funnel → 4. Post Content → 5. Sale DM

→ Tạo plan qua `plan-generator/`, không gọi 1 lần.

### Pattern B: Parallel — không khả thi trong Coach L2
Coach L2 KHÔNG parallel — phải sequential vì checkpoint.

### Pattern C: Composite — 1 Agent đã bundle skill khác
> "Bán + email nurture + giao hàng tự động"
> → Chỉ cần `sale-funnel` (đã bundle email + delivery)
> → KHÔNG cần gọi `email-marketing` riêng (skill nằm bundled trong sale-funnel)

---

## Agent KHÔNG có trong BASIC (refuse politely)

Khi user yêu cầu các Agent này → Coach trả lời:

| User request | Coach response |
|--------------|---------------|
| "webinar funnel", "đăng ký webinar" | "Webinar Funnel có trong gói PRO. Trong BASIC anh có thể dùng Booking Funnel cho 1-1 hoặc Leads Funnel cho mass enrollment. Em xem option nào phù hợp?" |
| "VSL", "video sales letter" | "VSL Page có trong gói PRO. BASIC anh dùng Sale Funnel kết hợp Simple Reels video embed được." |
| "launch campaign", "ra mắt khoá học" | "Launch Agent có trong gói PRO/ALL — orchestrate đa kênh. BASIC anh tự coordinate được: Sale Funnel + Post Content + Ads + Sale DM. Em giúp tạo plan launch BASIC-style không?" |
| "community", "Zalo Group", "FB Group" | "Community Agent có trong gói ALL. BASIC chưa có. Anh có thể tự setup group + dùng Post Content Agent generate post mỗi tuần." |
| "personal branding", "build influence" | "Personal Branding Agent có trong gói ALL. BASIC anh dùng Post Content + Simple Reels build authority cũng được." |
| "email blast", "newsletter", "abandoned cart" | "Email Marketing standalone có trong PRO/ALL. BASIC, email đã bundled trong Leads/Sale/Booking Funnel — không thiếu chức năng nurture/delivery." |
| "hợp đồng", "báo giá" (Admin Agent) | "Admin Agent có trong gói PRO. BASIC anh dùng Customer Portal có sẵn invoice/receipt cho khách." |

→ Coach không chỉ refuse — luôn suggest **alternative trong BASIC**.

---

## Routing logic example

User input: **"Em ơi anh muốn ra mắt khoá học pottery 2tr trong tuần này"**

Coach phân tích:
1. **Intent chính**: "ra mắt khoá học" + "tuần này" → có yếu tố launch
2. **Check tier**: Launch Agent là PRO → từ chối politely
3. **Alternative**: Đây thực ra là `sale-funnel` với time pressure → suggest plan template "Bán sản phẩm X"
4. **Output**: "Launch Agent (orchestrate đa kênh) có trong PRO. Trong BASIC, em đề xuất plan như sau (8 bước trong 1 tuần): [bảng plan từ template Sales Funnel]. Đủ để ra đơn đầu tiên. Anh duyệt em chạy chứ?"

→ Đó là cách Coach handle intent ngoài tier mà vẫn deliver value.
