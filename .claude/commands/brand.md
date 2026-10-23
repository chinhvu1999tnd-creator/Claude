# /brand — Tạo Brand Book & Design System

<args>$ARGUMENTS</args>

## Mục đích

Tạo bộ nhận diện thương hiệu đầy đủ gồm:
- `design-system.html` — trang reference scrollable 9 sections
- `brand-book-a4.html` + `brand-book-a4.pdf` — brand book A4 giao cho client

Output lưu tại: `output/design/{YYYY-MM-DD}/{brand-slug}/`

## Thực thi

1. Load `BUSINESS.md` để lấy tên thương hiệu
2. Load skill: `skills/design/brand-system/SKILL.md`
3. Thực thi workflow 6 bước trong SKILL.md

## Lưu ý

- Đọc `THEME.md` tự động trước khi hỏi bất kỳ điều gì
- Output path: `output/design/{YYYY-MM-DD}/{brand-slug}/`
- Không bịa thông tin — chỉ dùng data có trong `THEME.md` và `BUSINESS.md`
- Dùng Write tool để ghi file — không display HTML trong chat
- Nếu `THEME.md → Assets → Logo` còn `[Chưa điền...]` → gợi ý: "Chưa có logo — chạy `/logo` để tạo logo SVG trước, brand book sẽ đầy đủ hơn. Tiếp tục gen không?"
