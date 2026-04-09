"""
카드뉴스 자동화 에이전트 — 메인 진입점

사용법:
  python agent.py --url https://example.com/article
  python agent.py --text "직접 작성한 내용..."
  python agent.py --url https://... --out /원하는/출력/경로
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

# 프로젝트 루트 기준 경로
ROOT = Path(__file__).parent
TMP_DIR = ROOT.parent.parent / ".tmp" / "cardnews"

sys.path.insert(0, str(ROOT))
from scraper import scrape
from summarizer import summarize


def run(url: str = None, text: str = None, out_dir: str = None) -> list[str]:
    """
    메인 파이프라인. 성공 시 생성된 PNG 경로 목록 반환.
    """
    # ── 1. 콘텐츠 확보 ─────────────────────────────────
    print("1/3 콘텐츠 준비 중...")
    if url:
        print(f"   URL 스크래핑: {url}")
        content = scrape(url)
        print(f"   {len(content)}자 추출 완료")
    elif text:
        content = text
        print(f"   텍스트 입력: {len(content)}자")
    else:
        raise ValueError("url 또는 text 중 하나를 반드시 입력하세요.")

    # ── 2. Claude로 카드 구조 생성 ──────────────────────
    print("2/3 Claude가 카드 구조 생성 중...")
    card_data = summarize(content)
    print(f"   커버 + {len(card_data['contents'])}장 본문 + 요약 카드 준비")

    # ── 3. 이미지 렌더링 ────────────────────────────────
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = Path(out_dir) if out_dir else TMP_DIR / timestamp
    output_dir.mkdir(parents=True, exist_ok=True)

    # JSON을 임시 파일로 저장
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False, encoding="utf-8"
    ) as f:
        json.dump(card_data, f, ensure_ascii=False)
        json_path = f.name

    print(f"3/3 이미지 렌더링 중... → {output_dir}")

    render_script = ROOT / "render.mjs"
    result = subprocess.run(
        ["node", str(render_script), json_path, str(output_dir)],
        capture_output=True,
        text=True,
        cwd=str(ROOT),
    )

    os.unlink(json_path)

    if result.returncode != 0:
        raise RuntimeError(
            f"렌더링 실패:\n{result.stderr or result.stdout}"
        )

    # 성공 메시지에서 파일 목록 파싱
    for line in result.stdout.strip().split("\n"):
        if line.startswith("{"):
            out = json.loads(line)
            png_files = out.get("files", [])
            break
        print(f"   {line}")
    else:
        png_files = sorted(output_dir.glob("*.png"))

    print(f"\n완료! {len(png_files)}장 생성 → {output_dir}")
    return [str(p) for p in png_files]


def main():
    parser = argparse.ArgumentParser(description="카드뉴스 자동 생성")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="기사 URL")
    group.add_argument("--text", help="직접 입력 텍스트")
    parser.add_argument("--out", help="출력 폴더 (기본: .tmp/cardnews/타임스탬프)")

    args = parser.parse_args()

    try:
        files = run(url=args.url, text=args.text, out_dir=args.out)
        print("\n생성된 파일:")
        for f in files:
            print(f"  {f}")
    except RuntimeError as e:
        print(f"\n오류: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n중단됨.")
        sys.exit(0)


if __name__ == "__main__":
    main()
