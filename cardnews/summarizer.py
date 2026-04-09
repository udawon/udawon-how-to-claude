"""
텍스트 → 카드뉴스 JSON 구조 생성
claude -p 사용 (구독 인증, API 키 불필요)
"""

import json
import subprocess
import sys

PROMPT_TEMPLATE = """당신은 약사 커뮤니티(약문약답) 콘텐츠 담당자입니다.
아래 원문을 읽고 카드뉴스 구조를 JSON으로 만들어주세요.

규칙:
- 원문에 있는 내용만 사용할 것. 추가 정보나 창작 금지.
- 약학/의학 정보는 정확하게, 오류 없이.
- 카드 4장 분량의 핵심 포인트를 뽑을 것.
- 말투: 친근하지만 전문적인 한국어 (예: "~하세요", "~입니다")
- 모든 텍스트는 한국어로.
- JSON만 출력, 설명 없음.

출력 형식:
{{
  "cover": {{
    "tag": "이모지 + 카테고리 (예: 💊 약물 안전 정보)",
    "title_lines": ["제목 첫째줄", "제목 둘째줄", "제목 셋째줄"],
    "highlight_line": 1,
    "subtitle": "부제목 (약사가 알려드리는... 형태)"
  }},
  "contents": [
    {{
      "badge_num": "1",
      "badge_label": "첫 번째 포인트",
      "title": "카드 제목 (20자 이내)",
      "title_hl": "강조할 단어 또는 구",
      "body": "본문 설명 (2~3문장, 원문 기반)",
      "tip": "약사 TIP (실용적인 조언, 1~2문장)"
    }},
    {{ "badge_num": "2", "badge_label": "두 번째 포인트", "title": "...", "title_hl": "...", "body": "...", "tip": "..." }},
    {{ "badge_num": "3", "badge_label": "세 번째 포인트", "title": "...", "title_hl": "...", "body": "...", "tip": "..." }},
    {{ "badge_num": "4", "badge_label": "네 번째 포인트", "title": "...", "title_hl": "...", "body": "...", "tip": "..." }}
  ],
  "summary": {{
    "title": "요약 제목 (예: OO을 위한 N가지 체크리스트)",
    "items": [
      {{"text": "체크항목 (10자 이내)", "sub": "보충 설명 (15자 이내)"}},
      {{"text": "...", "sub": "..."}},
      {{"text": "...", "sub": "..."}},
      {{"text": "...", "sub": "..."}}
    ],
    "cta": "마지막 CTA 문구 (약문약답으로 유도)"
  }}
}}

원문:
{text}"""


def summarize(text: str) -> dict:
    """텍스트를 카드뉴스 JSON 구조로 변환. claude -p 사용."""
    prompt = PROMPT_TEMPLATE.format(text=text)

    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True,
        timeout=120,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"claude -p 실패 (종료코드 {result.returncode}):\n"
            f"{result.stderr or '(오류 메시지 없음)'}"
        )

    raw = result.stdout.strip()

    # ```json ... ``` 블록 처리
    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            if part.startswith("json"):
                raw = part[4:].strip()
                break
            elif part.strip().startswith("{"):
                raw = part.strip()
                break

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Claude 응답이 JSON 형식이 아닙니다: {e}\n"
            f"응답 앞부분: {raw[:300]}"
        )


if __name__ == "__main__":
    test_text = """
    감기약을 복용할 때는 중복 성분을 확인해야 합니다.
    감기약에는 아세트아미노펜이 포함된 경우가 많아 타이레놀과 함께 복용하면 과다복용 위험이 있습니다.
    복용 간격은 4~6시간 이상 유지하고, 이부프로펜은 식후 복용해야 위장 장애를 줄일 수 있습니다.
    음주 중에는 절대 복용해서는 안 됩니다.
    """
    try:
        result = summarize(test_text)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except RuntimeError as e:
        print(f"오류: {e}", file=sys.stderr)
        sys.exit(1)
