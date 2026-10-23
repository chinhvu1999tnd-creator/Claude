#!/bin/bash
# deploy.sh — Deploy landing page lên Vercel với 1 lệnh
#
# Cách dùng:
#   bash deploy.sh              → deploy project hiện tại
#   bash deploy.sh --prod       → deploy thẳng lên production
#   bash deploy.sh --help       → xem hướng dẫn

set -e  # Dừng ngay nếu có lỗi

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warn()    { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error()   { echo -e "${RED}❌ $1${NC}"; }

# ─── Help ─────────────────────────────────────────────────────────────────────
if [[ "$1" == "--help" ]]; then
  echo ""
  echo "deploy.sh — Deploy funnel lên Vercel"
  echo ""
  echo "Cách dùng:"
  echo "  bash deploy.sh          # Preview deploy (có URL test)"
  echo "  bash deploy.sh --prod   # Production deploy (URL chính thức)"
  echo ""
  echo "Yêu cầu:"
  echo "  - Node.js đã cài (node --version)"
  echo "  - File index.html tồn tại trong thư mục hiện tại"
  echo "  - Tài khoản Vercel (vercel.com) — miễn phí"
  echo ""
  exit 0
fi

echo ""
echo "🚀 AI Agent Business Kit — Deploy Script"
echo "────────────────────────────────────────"

# ─── Kiểm tra Node.js ─────────────────────────────────────────────────────────
log_info "Kiểm tra Node.js..."
if ! command -v node &> /dev/null; then
  log_error "Node.js chưa được cài. Tải tại: https://nodejs.org"
  exit 1
fi
log_success "Node.js $(node --version)"

# ─── Kiểm tra file index.html ─────────────────────────────────────────────────
log_info "Kiểm tra file index.html..."
if [ ! -f "index.html" ]; then
  log_error "Không tìm thấy index.html trong thư mục hiện tại."
  echo "   Chạy trước: node generate-page.js"
  exit 1
fi
log_success "Tìm thấy index.html ($(wc -c < index.html | tr -d ' ') bytes)"

# ─── Cài Vercel CLI nếu chưa có ───────────────────────────────────────────────
log_info "Kiểm tra Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  log_warn "Vercel CLI chưa cài. Đang cài..."
  npm install -g vercel
  log_success "Vercel CLI đã cài xong"
else
  log_success "Vercel CLI $(vercel --version 2>/dev/null | head -1)"
fi

# ─── Deploy ───────────────────────────────────────────────────────────────────
echo ""
if [[ "$1" == "--prod" ]]; then
  log_info "Deploy lên PRODUCTION..."
  echo ""
  vercel --prod
  echo ""
  log_success "Deploy production hoàn tất!"
  echo ""
  echo "📋 Việc cần làm tiếp theo:"
  echo "   1. Copy URL production ở trên"
  echo "   2. Dán vào quảng cáo / bio / bài đăng"
  echo "   3. Chạy: node check-sepay.js để test thanh toán"
  echo "   4. Chạy: node setup-telegram.js nếu chưa setup bot"
else
  log_info "Deploy preview (để test)..."
  echo ""
  vercel
  echo ""
  log_success "Deploy preview hoàn tất!"
  echo ""
  echo "📋 Kiểm tra trang preview xong thì chạy:"
  echo "   bash deploy.sh --prod"
fi

echo ""
echo "────────────────────────────────────────"
echo "🎉 Hoàn tất!"
echo ""
