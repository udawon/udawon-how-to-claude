"""
URL → 텍스트 추출
로그인/페이월 감지 시 명확한 에러 반환
"""

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

BLOCKED_SIGNALS = [
    "로그인", "login", "sign in", "구독", "subscribe",
    "paywall", "유료", "회원가입", "접근 권한"
]


def scrape(url: str) -> str:
    """URL에서 본문 텍스트 추출. 실패 시 예외 발생."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise RuntimeError(f"HTTP 오류 ({e.response.status_code}): {url}")
    except requests.exceptions.ConnectionError:
        raise RuntimeError(f"연결 실패 - URL을 확인하세요: {url}")
    except requests.exceptions.Timeout:
        raise RuntimeError(f"타임아웃 - 사이트 응답이 없습니다: {url}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # 불필요한 태그 제거
    for tag in soup(["script", "style", "nav", "header", "footer",
                     "aside", "form", "button", "iframe"]):
        tag.decompose()

    # 본문 후보 선택 (article > main > body 순)
    body = (
        soup.find("article")
        or soup.find("main")
        or soup.find("div", class_=lambda c: c and "content" in c.lower())
        or soup.body
    )

    text = body.get_text(separator="\n", strip=True) if body else ""

    if len(text) < 100:
        raise RuntimeError("본문을 추출할 수 없습니다. 로그인이 필요하거나 JS 렌더링 페이지일 수 있습니다.")

    # 페이월/로그인 감지
    text_lower = text.lower()
    for signal in BLOCKED_SIGNALS:
        if signal in text_lower and len(text) < 500:
            raise RuntimeError(f"접근 제한 감지 ({signal}): 로그인 또는 구독이 필요한 페이지입니다.")

    # 최대 6000자 (Claude 컨텍스트 절약)
    return text[:6000]


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("사용법: python scraper.py <URL>")
        sys.exit(1)
    try:
        result = scrape(sys.argv[1])
        print(result[:500])
        print(f"\n... ({len(result)}자 추출)")
    except RuntimeError as e:
        print(f"오류: {e}")
        sys.exit(1)
