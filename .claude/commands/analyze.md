---
description: Analysis Agent — báo cáo doanh thu, tối ưu conversion, chẩn đoán bottleneck
argument-hint: [ý định tự nhiên] VD: "báo cáo doanh thu tháng này" | "tại sao funnel không convert" | "tối ưu tỷ lệ chốt"
agent: analysis
---

<args>$ARGUMENTS</args>

## Intent Detection

| Tín hiệu | Task |
|----------|------|
| "doanh thu", "revenue", "báo cáo", "report", "tháng này", "quý", "kết quả", "tổng kết", "bán được", "thu nhập" | → **revenue** |
| "tối ưu", "optimize", "bottleneck", "cải thiện", "tại sao không", "conversion thấp", "tăng", "fix", "vấn đề" | → **optimize** |
| Không rõ | → Hỏi: "Anh/chị muốn (A) Xem báo cáo doanh thu, hay (B) Tìm bottleneck và tối ưu?" |

---

## Execution

**Trước tất cả:** Đọc `BUSINESS.md` — lấy sản phẩm, kênh, stage.

### revenue — Revenue Report
1. Load `agents/analysis/agent.md`
2. Load `skills/analysis/revenue-report/SKILL.md`
3. Hỏi user cung cấp số liệu: doanh thu, số đơn, leads, conversion rate (nếu có)
4. Extract period từ args (tháng / quý / tuần / so sánh)
5. Output: Revenue Report đầy đủ + trend + so sánh kỳ trước + 3 insight hành động

### optimize — Optimization Advisor
1. Load `agents/analysis/agent.md`
2. Load `skills/analysis/optimization-advisor/SKILL.md`
3. Extract "area" cần tối ưu từ args:
   - Funnel → conversion rate từng bước
   - Content → reach / engagement
   - Sales → tỷ lệ chốt / objection phổ biến
   - Delivery → completion rate / churn
4. Hỏi user cung cấp metrics hiện tại (nếu có)
5. Output: Bottleneck diagnosis + top 3 thay đổi có impact cao nhất + action plan 2 tuần

---

## Ví Dụ Hoạt Động

```
/analyze báo cáo doanh thu tháng 5
→ revenue | period = "tháng 5"

/analyze tại sao landing page của tôi không convert
→ optimize | area = funnel/landing page

/analyze tối ưu tỷ lệ chốt sale — hiện tại chỉ đạt 8%
→ optimize | area = sales | metric = "close rate 8%"

/analyze so sánh doanh thu Q1 và Q2
→ revenue | period = "Q1 vs Q2" | type = comparison

/analyze tôi muốn tìm bottleneck trong toàn bộ hệ thống
→ optimize | area = full-funnel
```

---

## Output

Sau khi tạo xong, **lưu vào file** tại:

```
output/analysis/[YYYY-MM-DD]-[task]-[period-slug].md

Ví dụ:
output/analysis/2026-05-09-revenue-report-may-2026.md
output/analysis/2026-05-09-optimize-leads-funnel-conversion.md
```

**Dùng Write tool để tạo file** — không chỉ hiện trong conversation.
