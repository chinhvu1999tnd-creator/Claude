---
name: email-sequence
description: "Post-purchase email sequences — onboarding (7 emails), activation, upsell, re-engagement, renewal. Content templates sống ở đây, transport qua integrations/email/email.js. Moved from deliver/ → email-marketing/."
version: 2.0.0
agent: email-marketing
tags: [email, sequences, onboarding, upsell, re-engagement, renewal]
---

# Email Sequence Skill

## Quy tắc xưng hô

**KHÔNG dùng "anh/chị" trong email copy.** Dùng **"bạn"** với người đọc, **"tôi"** khi sender tự xưng.

---

## When to Use
Activate after a customer purchases. Goal: onboard them successfully, ensure they get results, and create natural opportunities for upsells and referrals.

## Sequence Types

| Sequence | Trigger | Goal | Length |
|----------|---------|------|--------|
| Onboarding | Immediately after purchase | Activate and start strong | 5–7 emails, 7–10 days |
| Activation | Day 3–5 if no progress | Re-engage passive buyers | 3 emails, 5 days |
| Upsell | After quick win achieved | Offer complementary product | 3–5 emails, 7 days |
| Renewal | 30 days before expiry | Renew membership/coaching | 4 emails, 2 weeks |
| Re-engagement | 30+ days inactive | Bring back lost students | 3 emails, 1 week |
| Referral | After first success milestone | Ask for referrals/testimonials | 2 emails |

## Onboarding Sequence (7 emails)

### Email 1 — Immediate: Welcome + First Step
**Subject**: "Chào mừng [Tên]! Bắt đầu từ đây..."
- Confirm purchase and express genuine excitement
- The ONE first action they should take right now
- What to expect in the coming days
- How to get support (Zalo, group, email)

### Email 2 — Day 1: Orient + Quick Win
**Subject**: "Bài học đầu tiên quan trọng nhất là..."
- Point them to the single most important starting module
- Give them a small, achievable win in < 30 minutes
- "Sau khi làm xong, nhắn em kết quả nhé!"

### Email 3 — Day 2: Community + Accountability
**Subject**: "Anh/chị đã vào group chưa? Có người đang chờ..."
- Remind them to join the community (if applicable)
- Share a win from another student (social proof + inspiration)
- Set a 7-day mini-goal for them

### Email 4 — Day 4: Address the Inner Critic
**Subject**: "Bình thường nếu anh/chị cảm thấy..."
- Normalize the plateau/doubt that hits around day 3–5
- Story of someone who almost quit but pushed through
- Reframe: progress > perfection
- Check-in CTA: "Anh/chị đang ở đâu rồi?"

### Email 5 — Day 5: Deep Value
**Subject**: "Bí mật mà 90% học viên bỏ qua..."
- Share an insider tip not covered in the core content
- Makes them feel like a VIP, deepens engagement
- "Chỉ học viên chương trình mới được biết điều này..."

### Email 6 — Day 7: Celebrate + Push Forward
**Subject**: "Anh/chị đã hoàn thành tuần đầu tiên 🎉"
- Celebrate their commitment (they stayed 7 days — most don't)
- Recap what they've learned/done
- Preview what's coming in week 2
- Soft upsell mention (if applicable): "Nhiều học viên sau tuần đầu còn hỏi em về [next offer]..."

### Email 7 — Day 10: Testimonial Request
**Subject**: "Em có thể nhờ anh/chị một điều không?"
- Ask for a quick result share or testimonial
- Make it easy: "Chỉ cần 2-3 câu là được"
- Offer something in return (bonus content, personal review)

## Activation Sequence (for passive buyers)
*Trigger: No login/activity in first 3–5 days after purchase*

### Email 1 — Day 3 (if no activity)
**Subject**: "Anh/chị ổn không? Em lo một chút..."
- Gentle, caring tone — not accusatory
- Assume life got busy, not buyer's remorse
- Lower the barrier: "Chỉ cần 15 phút hôm nay là đủ"
- Direct link to first lesson

### Email 2 — Day 5
**Subject**: "Điều này xảy ra với 80% người mua khóa học..."
- Normalize procrastination (make them feel understood)
- Share the one mindset shift that activates passive buyers
- Concrete mini-task they can do in 10 minutes

### Email 3 — Day 7
**Subject**: "Lời đề nghị cuối của em..."
- Personal tone: "Em đã gửi 2 email nhưng chưa thấy anh/chị active..."
- Offer a 1-on-1 quick call (15 min) to help them get started
- Or ask: "Anh/chị gặp vấn đề gì? Reply cho em biết..."

## Upsell Sequence
*Trigger: Student achieved first milestone or completed module 1*

### Email 1 — Celebrate + Plant Seed
**Subject**: "[Kết quả họ đạt được] — tiếp theo là gì?"
- Celebrate their win genuinely
- Introduce the concept of what's possible next
- No pitch yet — just curiosity

### Email 2 — Case Study
**Subject**: "Anh/chị [tên] đã làm gì sau [first milestone]..."
- Story of student who went to next level
- Soft mention of the upsell product at the end

### Email 3 — Direct Offer
**Subject**: "Mời anh/chị tham gia [upsell product]"
- Present the complementary offer with clear reasoning
- "Vì anh/chị đã [achievement], em muốn mời vào [next program]"
- Special pricing for existing customers
- Deadline: 5–7 days

## Email Writing Best Practices

### Subject Lines (Vietnamese high performers)
- Question format: "Anh/chị đã làm điều này chưa?"
- Number: "3 điều em muốn anh/chị biết..."
- Personal: "Em có điều muốn nói với anh/chị..."
- Curiosity: "Bí mật mà em chưa kể bao giờ..."
- Direct: "Chỗ học của anh/chị sắp mở khóa"

### Email Body Structure
```
[Hook — first line must earn the next click]

[1–2 paragraphs of value or story]

[Clear single CTA]

[Signature — human, not corporate]
```

### Tone Guidelines
- Write as if to one person, not a list
- Use "anh/chị" consistently
- Short paragraphs (2–3 lines max)
- One CTA per email — not multiple links
- Plain text outperforms HTML for personal tone

## Tool Recommendations (Vietnam Context)

| Tool | Cost | Best For |
|------|------|----------|
| Mailchimp | Free–$13/mo | Beginners, simple sequences |
| ConvertKit | $9/mo+ | Creators, tag-based automation |
| GetResponse | $15/mo+ | Landing pages + email combo |
| Brevo (Sendinblue) | Free–$25/mo | High volume, good deliverability |
| ActiveCampaign | $29/mo+ | Advanced automation, CRM |
| n8n + SMTP | Self-hosted | Full control, no monthly fee |

## Output Template

```markdown
## Email Sequence: [Type] — [Product Name]

**Trigger:** [what starts this sequence]
**Length:** [X emails over Y days]
**Tool:** [email platform]
**Goal:** [primary outcome]

Email 1 — [Day/Timing]:
Subject: [subject line]
Goal: [what this email achieves]
Key Message: [1-sentence summary]
CTA: [specific action]

Email 2 — [Day]:
[repeat format...]

**Personalization Tags Used:**
- {{first_name}}
- {{product_name}}
- {{purchase_date}}

**Automation Logic:**
- Stop sequence if: [condition — e.g., purchased upsell]
- Branch if: [condition — e.g., opened email 3 vs didn't]

**Success Metrics:**
- Open Rate Target: [X%]
- Click Rate Target: [X%]
- Completion Rate: [X%]
```
