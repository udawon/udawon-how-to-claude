#!/usr/bin/env bash
# 공식문서 변경 감지 스크립트
# llms.txt에서 문서 목록을 가져와 로컬 파일과 비교

set -euo pipefail

LLMS_TXT_URL="https://code.claude.com/docs/llms.txt"
LOCAL_DOCS_DIR="content/claude-code-docs"

# llms.txt 다운로드
echo "llms.txt 다운로드 중..."
LLMS_CONTENT=$(curl -sfL "$LLMS_TXT_URL") || {
  echo "::error::llms.txt 다운로드 실패"
  exit 1
}

# llms.txt에서 문서 파일명 추출
# 형식 예: https://code.claude.com/docs/en/overview.md → overview.md
REMOTE_FILES=$(echo "$LLMS_CONTENT" \
  | grep -oP 'code\.claude\.com/docs/en/[^\s)]+\.md' \
  | sed 's|.*/||' \
  | sort -u)

# 로컬 파일명 목록
LOCAL_FILES=$(ls "$LOCAL_DOCS_DIR" | sort)

# 비교
ADDED=$(comm -23 <(echo "$REMOTE_FILES") <(echo "$LOCAL_FILES"))
REMOVED=$(comm -13 <(echo "$REMOTE_FILES") <(echo "$LOCAL_FILES"))

# 결과 출력
ADDED_COUNT=0
REMOVED_COUNT=0

if [ -n "$ADDED" ]; then
  ADDED_COUNT=$(echo "$ADDED" | wc -l | tr -d ' ')
  echo "📄 새로 추가된 문서 ($ADDED_COUNT개):"
  echo "$ADDED" | sed 's/^/  - /'
fi

if [ -n "$REMOVED" ]; then
  REMOVED_COUNT=$(echo "$REMOVED" | wc -l | tr -d ' ')
  echo "🗑️ 삭제된 문서 ($REMOVED_COUNT개):"
  echo "$REMOVED" | sed 's/^/  - /'
fi

if [ -z "$ADDED" ] && [ -z "$REMOVED" ]; then
  echo "✅ 변경 없음 (현재 $(echo "$LOCAL_FILES" | wc -l | tr -d ' ')개 문서)"
  echo "HAS_CHANGES=false" >> "${GITHUB_OUTPUT:-/dev/null}"
  exit 0
fi

# GitHub Actions 출력 변수 설정
OUTPUT_FILE="${GITHUB_OUTPUT:-/dev/null}"
echo "HAS_CHANGES=true" >> "$OUTPUT_FILE"
echo "ADDED_COUNT=$ADDED_COUNT" >> "$OUTPUT_FILE"
echo "REMOVED_COUNT=$REMOVED_COUNT" >> "$OUTPUT_FILE"

# 멀티라인 출력을 위한 delimiter 사용
{
  echo "ADDED<<EOF_ADDED"
  echo "$ADDED"
  echo "EOF_ADDED"
} >> "$OUTPUT_FILE"

{
  echo "REMOVED<<EOF_REMOVED"
  echo "$REMOVED"
  echo "EOF_REMOVED"
} >> "$OUTPUT_FILE"
