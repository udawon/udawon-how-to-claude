"""
URL → 텍스트 추출
requests + BeautifulSoup4 사용
"""

import sys
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("필요 패키지 설치: pip install requests beautifulsoup4", file=sys.stderr)
    sys.exit(1)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

PAYWALL_SIGNALS = [
    "로그인이 필요", "구독이 필요", "login required",
    "subscribe to read", "premium content",
]


def scrape(url: str, max_chars: int = 6000) -> str:
    """URL에서 본문 텍스트 추출. 최대 max_chars 글자 반환."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"URL 접근 실패: {e}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # 불필요 태그 제거
    for tag in soup(["script", "style", "nav", "header", "footer",
                     "aside", "form", "iframe", "noscript"]):
        tag.decompose()

    # 본문 영역 우선순위
    content = None
    for selector in ["article", "main", ".content", ".article-body",
                     ".post-content", ".entry-content", "#content", "body"]:
        found = soup.select_one(selector)
        if found and len(found.get_text(strip=True)) > 200:
            content = found
            break

    if not content:
        content = soup

    text = content.get_text(separator="\n", strip=True)

    # 페이월 감지
    for signal in PAYWALL_SIGNALS:
        if signal.lower() in text.lower():
            raise RuntimeError(f"페이월/로그인 감지: '{signal}' 포함")

    # 길이 제한
    if len(text) > max_chars:
        text = text[:max_chars] + "...(이하 생략)"

    if len(text) < 100:
        raise RuntimeError("추출된 텍스트가 너무 짧습니다. 페이지 구조를 확인하세요.")

    return text


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python scraper.py <URL>")
        sys.exit(1)
    result = scrape(sys.argv[1])
    print(f"[{len(result)}자 추출]\n")
    print(result[:500], "...")
