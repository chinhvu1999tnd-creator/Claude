#!/usr/bin/env python3
"""
render-card.py — Render HTML card → PNG via Playwright

Lưu Chromium binary vào project (.playwright/) để tái sử dụng giữa các session.

Usage:
  PLAYWRIGHT_BROWSERS_PATH="/path/to/project/.playwright" \\
  python3 render-card.py --html /path/to/card.html --out /path/to/card.png

Default size: 680x680 (Facebook/Instagram square card)
"""

import argparse
import os
import sys
import subprocess
from pathlib import Path


# Project root = 4 levels up from this script
# (skills/content/post-image-card/scripts/render-card.py → project root)
PROJECT_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_BROWSERS_PATH = str(PROJECT_ROOT / ".playwright")


def ensure_browser(browsers_path: str) -> bool:
    """Kiểm tra và install Chromium nếu chưa có."""
    env = os.environ.copy()
    env["PLAYWRIGHT_BROWSERS_PATH"] = browsers_path

    bpath = Path(browsers_path)
    if bpath.exists():
        binaries = list(bpath.glob("**/headless_shell")) + list(bpath.glob("**/chrome"))
        if binaries:
            print(f"✓ Chromium found at {binaries[0]}")
            return True

    print(f"⏳ First time setup: installing Chromium (~100MB, ~2 min)")
    print(f"   Binary sẽ lưu tại: {browsers_path}")
    print(f"   Lần sau render chỉ mất 3-5 giây.\n")

    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "--quiet", "playwright"],
            timeout=120,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
        print(f"❌ Failed to install playwright package: {e}")
        return False

    try:
        result = subprocess.run(
            [sys.executable, "-m", "playwright", "install", "chromium"],
            env=env,
            capture_output=False,
            timeout=300,
        )
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("❌ Chromium install timeout. Try again manually:")
        print(f"   PLAYWRIGHT_BROWSERS_PATH={browsers_path} python3 -m playwright install chromium")
        return False


def render(html_path: str, out_path: str, browsers_path: str,
           width: int = 1080, height: int = 1080, scale: int = 2):
    """Render HTML → PNG at 2x retina quality.

    With width=1080, scale=2 → actual PNG is 2160x2160 px → sharp on all displays.
    """
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = browsers_path

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("❌ playwright package not installed. Run:")
        print("   pip install playwright && python3 -m playwright install chromium")
        sys.exit(1)

    html_abs = str(Path(html_path).resolve())
    out_abs  = str(Path(out_path).resolve())

    Path(out_abs).parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": width, "height": height},
            device_scale_factor=scale,
        )
        page = context.new_page()
        page.goto(f"file://{html_abs}")

        try:
            page.wait_for_load_state("networkidle", timeout=5000)
        except Exception:
            page.wait_for_timeout(2000)

        page.screenshot(
            path=out_abs,
            clip={"x": 0, "y": 0, "width": width, "height": height},
            full_page=False,
            omit_background=False,
        )
        browser.close()

    size_kb = Path(out_abs).stat().st_size // 1024
    actual_w = width * scale
    actual_h = height * scale
    print(f"✓ PNG saved: {out_abs}")
    print(f"  Display size: {width}×{height} · Actual pixels: {actual_w}×{actual_h} · {size_kb} KB")


def main():
    parser = argparse.ArgumentParser(description="Render HTML card to PNG")
    parser.add_argument("--html",   required=True, help="Path to HTML file")
    parser.add_argument("--out",    required=True, help="Output PNG path")
    parser.add_argument("--width",  type=int, default=1080, help="Display width (default: 1080)")
    parser.add_argument("--height", type=int, default=1080, help="Display height (default: 1080)")
    parser.add_argument("--scale",  type=int, default=2, help="Device scale factor for retina (default: 2 → 2x pixel density)")
    parser.add_argument(
        "--browsers-path",
        default=os.environ.get("PLAYWRIGHT_BROWSERS_PATH", DEFAULT_BROWSERS_PATH),
        help=f"Playwright browsers cache path (default: {DEFAULT_BROWSERS_PATH})",
    )
    args = parser.parse_args()

    if not ensure_browser(args.browsers_path):
        print("❌ Failed to install Chromium browser. Check internet connection.")
        sys.exit(1)

    render(args.html, args.out, args.browsers_path, args.width, args.height, args.scale)


if __name__ == "__main__":
    main()
