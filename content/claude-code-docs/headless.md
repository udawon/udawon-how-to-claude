---
title: "프로그래밍 방식 실행 (Headless 모드) — 스크립트와 자동화에서 Claude 활용하기"
source: "https://code.claude.com/docs/en/headless"
order: 29
tags: ["에이전트", "자동화", "기업·개발자"]
---

# 프로그래밍 방식 실행 (Headless 모드)

> Headless 모드를 비유하자면, 일반적으로 직접 대화하는 Claude를 "자동화 파이프라인의 부품"으로 사용하는 것입니다. 사람이 보지 않아도 스스로 작동하는 Claude입니다.

---

## Headless 모드란?

Claude Code를 대화형(interactive) 모드가 아닌 자동화 방식으로 실행하는 것입니다. CI/CD 파이프라인, 셸 스크립트, Python·TypeScript 코드에서 Claude를 비대화형으로 호출할 수 있습니다.

핵심은 `-p` (또는 `--print`) 플래그입니다.

---

## 예시 케이스

> **상황 1**: DevOps 엔지니어 경훈씨는 GitHub Actions에서 PR이 올라올 때마다 자동으로 보안 취약점 리뷰를 실행하고 싶습니다. Claude에게 PR diff를 전달하고 결과를 JSON으로 받아 자동 코멘트를 달도록 설정합니다.

> **상황 2**: 스크립트 자동화를 좋아하는 민정씨는 매일 밤 11시에 코드베이스를 스캔해 성능 문제를 요약 보고서로 받고 싶습니다. cron 작업으로 `claude -p "성능 이슈를 분석하고 요약해줘"`를 실행하면 됩니다.

---

## 기본 사용법

```bash
claude -p "auth 모듈이 무엇을 하는지 설명해줘"
```

`-p` 플래그 하나만 추가하면 Claude가 응답을 출력하고 종료합니다. 모든 [CLI 옵션](https://code.claude.com/docs/en/cli-reference)이 `-p`와 함께 사용 가능합니다.

---

## 주요 사용 패턴

### 1. 구조화된 출력 받기 (JSON)

```bash
# 기본 JSON 출력 (결과 + 세션 ID + 메타데이터)
claude -p "이 프로젝트를 요약해줘" --output-format json

# 특정 스키마에 맞는 JSON 출력
claude -p "auth.py에서 주요 함수 이름을 추출해줘" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

**출력 형식 옵션**:

| 형식 | 설명 |
|------|------|
| `text` | 기본값. 일반 텍스트 출력 |
| `json` | 결과, 세션 ID, 메타데이터가 포함된 JSON |
| `stream-json` | 실시간 스트리밍용 줄바꿈 구분 JSON |

`jq`로 JSON에서 특정 필드 추출:

```bash
# 텍스트 결과만 추출
claude -p "이 프로젝트를 요약해줘" --output-format json | jq -r '.result'

# 구조화된 출력 추출
claude -p "함수 이름 추출해줘" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}' \
  | jq '.structured_output'
```

### 2. 실시간 스트리밍

토큰이 생성되는 즉시 받아볼 수 있습니다:

```bash
claude -p "재귀를 설명해줘" \
  --output-format stream-json \
  --verbose \
  --include-partial-messages
```

텍스트만 스트리밍해서 표시:

```bash
claude -p "시를 써줘" \
  --output-format stream-json \
  --verbose \
  --include-partial-messages | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

### 3. 도구 자동 승인

특정 도구를 승인 요청 없이 자동으로 사용하게 합니다:

```bash
claude -p "테스트 스위트를 실행하고 실패를 수정해줘" \
  --allowedTools "Bash,Read,Edit"
```

### 4. 커밋 자동 생성

스테이징된 변경사항을 검토하고 적절한 커밋 메시지로 커밋:

```bash
claude -p "스테이징된 변경사항을 보고 적절한 커밋을 생성해줘" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

> **도구 권한 문법**: `Bash(git diff *)` = `git diff`로 시작하는 모든 명령어 허용. 뒤의 공백이 중요합니다 (`Bash(git diff *)` vs `Bash(git diff*)`).

### 5. 시스템 프롬프트 커스터마이징

Claude의 기본 동작에 추가 지시를 더할 수 있습니다:

```bash
# PR diff를 받아 보안 리뷰
gh pr diff "$1" | claude -p \
  --append-system-prompt "당신은 보안 엔지니어입니다. 취약점을 검토하세요." \
  --output-format json
```

**시스템 프롬프트 옵션**:

| 플래그 | 동작 |
|-------|------|
| `--append-system-prompt` | 기본 동작 유지하며 지시 추가 |
| `--system-prompt` | 기본 시스템 프롬프트를 완전히 교체 |

### 6. 대화 이어가기

```bash
# 첫 번째 요청
claude -p "이 코드베이스의 성능 이슈를 검토해줘"

# 가장 최근 대화 이어가기
claude -p "이제 데이터베이스 쿼리에 집중해줘" --continue
claude -p "발견된 모든 이슈를 요약해줘" --continue
```

여러 대화를 동시에 관리할 때는 세션 ID 사용:

```bash
session_id=$(claude -p "리뷰 시작해줘" --output-format json | jq -r '.session_id')
claude -p "리뷰 계속해줘" --resume "$session_id"
```

---

## Agent SDK (Python/TypeScript)

더 복잡한 자동화가 필요하다면 Agent SDK를 사용합니다. 구조화된 출력, 도구 승인 콜백, 네이티브 메시지 객체 등을 지원합니다.

자세한 내용은 [Agent SDK 공식 문서](https://platform.claude.com/docs/en/agent-sdk/overview)를 참고하세요.

---

## 실용적인 자동화 예시

### CI/CD에서 코드 리뷰 자동화

```bash
#!/bin/bash
# GitHub Actions 등에서 PR 리뷰 자동화

PR_DIFF=$(gh pr diff "$PR_NUMBER")

REVIEW=$(echo "$PR_DIFF" | claude -p \
  --append-system-prompt "시니어 엔지니어로서 코드 리뷰를 해주세요. 보안, 성능, 가독성에 집중하세요." \
  --output-format json \
  | jq -r '.result')

# PR에 자동 코멘트 추가
gh pr comment "$PR_NUMBER" --body "$REVIEW"
```

### 일일 코드베이스 분석 (cron 작업)

```bash
#!/bin/bash
# 매일 밤 성능 이슈 분석

claude -p "최근 7일간 커밋된 파일의 성능 이슈를 분석하고 요약해줘" \
  --allowedTools "Read,Bash,Grep,Glob" \
  --output-format json \
  | jq -r '.result' > /tmp/daily-report.txt

# 이메일이나 슬랙으로 전송
cat /tmp/daily-report.txt | mail -s "일일 코드 분석 보고서" team@company.com
```

### 자동 테스트 수정

```bash
#!/bin/bash
# 실패한 테스트를 자동으로 수정 시도

claude -p "테스트를 실행하고 실패하는 테스트를 수정해줘.
변경사항은 최소화하고 기존 로직을 유지해." \
  --allowedTools "Bash,Read,Edit" \
  --output-format json
```

---

## 주요 CLI 옵션 정리

| 옵션 | 설명 | 예시 |
|------|------|------|
| `-p`, `--print` | 비대화형 모드로 실행 | `claude -p "질문"` |
| `--output-format` | 출력 형식 지정 | `--output-format json` |
| `--json-schema` | JSON 출력 스키마 정의 | `--json-schema '{"type":"object",...}'` |
| `--allowedTools` | 자동 승인할 도구 목록 | `--allowedTools "Bash,Read,Edit"` |
| `--append-system-prompt` | 시스템 프롬프트에 추가 | `--append-system-prompt "보안 검토자로..."` |
| `--system-prompt` | 시스템 프롬프트 완전 교체 | `--system-prompt "당신은..."` |
| `--continue` | 최근 대화 이어가기 | `--continue` |
| `--resume` | 특정 세션 이어가기 | `--resume SESSION_ID` |
| `--verbose` | 상세 출력 | `--verbose` |
| `--include-partial-messages` | 스트리밍 시 부분 메시지 포함 | `--include-partial-messages` |

---

## 대화형 명령어와의 차이

| 기능 | 대화형 모드 | Headless 모드 (`-p`) |
|------|-----------|-------------------|
| `/commit`, `/review` 등 스킬 | 사용 가능 | 사용 불가 |
| 대화 주고받기 | 가능 | 불가 (단방향 실행) |
| 자동화/스크립트 | 불편 | 적합 |
| CI/CD 통합 | 불편 | 적합 |
| 구조화된 JSON 출력 | 불가 | 가능 |

> `-p` 모드에서는 `/commit` 같은 사용자 정의 스킬이나 내장 명령어를 사용할 수 없습니다. 대신 원하는 작업을 자연어로 설명하세요. 예: "스테이징된 변경사항으로 적절한 커밋을 만들어줘"

---

## 다음 단계

- **Agent SDK 시작하기**: [Python/TypeScript SDK 빠른 시작](https://platform.claude.com/docs/en/agent-sdk/quickstart)
- **GitHub Actions 연동**: [GitHub Actions 가이드](https://code.claude.com/docs/en/github-actions)
- **GitLab CI/CD 연동**: [GitLab CI/CD 가이드](https://code.claude.com/docs/en/gitlab-ci-cd)
- **전체 CLI 옵션**: [CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference)
