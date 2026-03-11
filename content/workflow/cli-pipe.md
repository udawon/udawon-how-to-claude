---
title: "CLI 파이프 & 자동화"
description: "터미널 파이프, 스크립트, CI/CD에서 Claude를 활용하는 방법"
order: 7
tags: ["워크플로우", "CLI", "자동화", "파이프", "CI/CD"]
---

## Claude를 명령어처럼 사용하기

Claude Code는 대화형 모드 외에 **명령어처럼 한 번만 실행**하는 방식도 지원합니다. 이를 이용해 터미널 파이프나 스크립트에서 Claude를 활용할 수 있습니다.

대화형 모드: `claude` (대화창 열림)
명령어 모드: `claude -p "프롬프트"` (실행 후 종료)

<div class="example-case">

비유:
대화형 = 직원을 고용해서 항상 옆에 두기
명령어 = 심부름 한 번만 시키기
</div>

---

## 기본 사용법: claude -p

```bash
# 기본 형태
claude -p "프롬프트 내용"

# 예시: 프로젝트 설명
claude -p "이 프로젝트가 뭘 하는 프로젝트인지 한 문장으로 설명해줘"

# 예시: 코드 분석
claude -p "보안 취약점이 있는 코드를 찾아줘"
```

---

## 파이프로 데이터 전달하기

다른 명령어의 결과를 Claude에게 직접 넘길 수 있습니다.

### 에러 로그 분석

```bash
# 에러 로그를 Claude에게 직접 전달
cat app.log | claude -p "에러 원인을 찾아서 한국어로 설명해줘"

# 빌드 에러 분석
npm run build 2>&1 | claude -p "이 빌드 에러의 근본 원인이 뭔지 알려줘"

# 실시간 로그 모니터링
tail -f server.log | claude -p "이상한 패턴이 보이면 즉시 알려줘"
```

**예시 케이스:**

<div class="example-case">

밤 11시, 서버에서 알 수 없는 에러 발생

기존 방법:
로그 파일 열기 -> 수백 줄 스크롤 -> 에러 패턴 찾기 -> 검색

Claude 활용:

```bash
cat error.log | claude -p "이 로그에서 반복되는 에러 패턴을 찾아서 원인과 해결책을 알려줘"
```

-> 즉시 핵심 분석 완료

비유: 긴 계약서를 변호사에게 줬더니

     "3페이지 7번 항목이 문제입니다" 바로 짚어주는 것
</div>

### 코드 리뷰 자동화

```bash
# 변경된 파일들만 리뷰
git diff main --name-only | claude -p "이 파일들에 보안 이슈가 있는지 검토해줘"

# 특정 커밋 리뷰
git show HEAD | claude -p "이 변경사항에 문제가 없는지 코드 리뷰해줘"

# PR 변경사항 리뷰
git diff origin/main...HEAD | claude -p "이 변경사항에서 잠재적 버그를 찾아줘"
```

---

## 출력 형식 제어

### 텍스트 출력 (기본)

```bash
claude -p "API 엔드포인트 목록 알려줘" --output-format text
```

### JSON 출력 (스크립트 활용)

```bash
# JSON으로 받아서 다른 명령어에 전달
claude -p "이 파일의 함수 목록을 JSON으로" --output-format json | jq '.functions[]'

# JSON 저장
claude -p "버그 분석 결과를 JSON으로" --output-format json > analysis.json
```

### 스트리밍 JSON (실시간 처리)

```bash
# 실시간으로 결과 받기
cat large-log.txt | claude -p "로그 파싱" --output-format stream-json
```

---

## package.json에 Claude 명령어 추가

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:ai": "claude -p '이 프로젝트의 코드 스타일과 타입 오류를 검토해줘. 파일명과 줄 번호 포함해서 알려줘'",
    "review": "git diff main | claude -p '이 변경사항에서 버그와 개선점을 알려줘'",
    "explain": "claude -p '이 프로젝트의 구조와 주요 기능을 신입 개발자에게 설명하듯이 알려줘'"
  }
}
```

사용:

```bash
npm run lint:ai     # AI 코드 리뷰
npm run review      # 변경사항 분석
npm run explain     # 프로젝트 설명
```

**예시 케이스:**

<div class="example-case">

팀에 새 멤버가 합류했을 때:
`npm run explain` -> Claude가 프로젝트 전체를 이해하기 쉽게 설명

PR 올리기 전:
`npm run review` -> 내가 놓친 부분을 Claude가 잡아줌
</div>

---

## 배치 작업: 여러 파일 병렬 처리

많은 파일을 한꺼번에 처리해야 할 때 활용합니다.

```bash
# 모든 TypeScript 파일에 타입 체크
for file in $(find . -name "*.ts" -not -path "*/node_modules/*"); do
  echo "=== $file ==="
  claude -p "이 파일의 타입 오류를 찾아줘" < "$file"
done

# 변경된 파일만 처리
git diff --name-only | while read file; do
  claude -p "$file 파일을 리팩토링해줘" \
    --allowedTools "Edit,Bash(git add $file)"
done
```

`--allowedTools` 옵션:
배치 작업 시 Claude가 사용할 수 있는 도구를 제한

```bash
--allowedTools "Edit"           # 파일 수정만 허용
--allowedTools "Bash(npm test)" # 특정 명령어만 허용
--allowedTools "Read,Grep"      # 읽기만 허용
```

<div class="example-case">

비유: 아르바이트생에게 "이 서류들만 처리해줘, 다른 건 건드리지 마"
</div>

---

## CI/CD 파이프라인 연동

### GitHub Actions 예시

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: AI Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main...HEAD | \
          claude -p "이 PR의 코드 변경사항을 리뷰해줘.
                     보안 문제, 성능 이슈, 코드 품질 순서로 알려줘.
                     각 이슈는 파일명:줄번호 형식으로." \
          --output-format text
```

---

## 실용적인 파이프 레시피

```bash
# 1. 번역 자동화
find . -name "en.json" | xargs cat | \
  claude -p "이 영어 JSON을 한국어로 번역해줘. JSON 형식 유지." > ko.json

# 2. 코드 문서화
cat src/utils.ts | \
  claude -p "이 파일의 각 함수에 JSDoc 주석을 추가해줘" > src/utils.documented.ts

# 3. 의존성 분석
cat package.json | \
  claude -p "사용하지 않거나 업데이트가 필요한 패키지를 찾아줘"

# 4. SQL 최적화
cat slow-queries.log | \
  claude -p "이 느린 쿼리들을 최적화하는 방법을 알려줘"

# 5. 에러 메시지 친절하게 변환
cat error-messages.ts | \
  claude -p "개발자용 에러 메시지를 사용자 친화적으로 바꿔줘"
```

---

## 주의사항

안전하게 사용하기:

1. `--dangerously-skip-permissions`
   모든 권한 확인을 건너뜀 -> 빠르지만 위험
   CI/CD 환경이나 격리된 환경에서만 사용

2. 배치 작업 전 테스트
   파일 2~3개로 먼저 테스트 후 전체 실행
   "3개 파일로 테스트 -> 결과 확인 -> 전체 실행"

3. 중요 파일 백업
   대규모 배치 작업 전 `git commit`으로 백업

<div class="example-case">

비유:
Claude = 능력 있는 인턴
처음엔 작은 일부터 시켜보고
믿을 수 있으면 더 큰 일을 맡기는 것
</div>
