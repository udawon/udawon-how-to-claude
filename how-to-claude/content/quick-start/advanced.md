---
title: "고급: 대규모 프로젝트 & 자동화"
description: "CI/CD, 테스트 전략, 커스텀 도구까지 — Claude를 팀 인프라의 일부로 활용하는 방법"
order: 4
tags: ["고급", "CI/CD", "테스트", "자동화", "MCP", "hooks", "에이전트팀"]
---

## 내 레벨 확인하기

| 레벨 | 나는 이런 사람 | 가이드 |
|------|--------------|--------|
| **👶 왕초보** | 코드를 전혀 모름. 아이디어만 있음 | [왕초보 가이드](/docs/quick-start/total-cycle) |
| **🌱 초보** | 기술 스택은 정했고 바로 시작하고 싶음 | [초보 가이드](/docs/quick-start/beginner-dev) |
| **🌿 중급** | 기존 프로젝트에 합류했거나 복잡한 기능을 다룸 | [중급 가이드](/docs/quick-start/intermediate) |
| **🌳 고급** (지금 보는 문서) | CI/CD, 테스트 전략, 대규모 프로젝트를 운영 | 이 문서 |

---

## 1. Headless 모드와 CI/CD 연동

Claude를 CI 파이프라인에서 자동으로 실행할 수 있습니다.

### PR 자동 리뷰

```bash
# GitHub Actions에서 PR 리뷰 자동화
claude -p "이 PR의 변경사항을 리뷰해줘. 보안, 성능, 코드 품질 관점에서." \
  --allowedTools "Read,Grep,Glob"
```

`-p` (print) 모드: 대화형이 아닌 한 번 실행하고 결과를 출력합니다.
`--allowedTools`: 사용할 수 있는 도구를 제한해 안전하게 실행합니다.

### 커밋 메시지 자동 생성

```bash
# git diff를 파이프로 전달
git diff --staged | claude -p "이 변경사항에 대한 한국어 커밋 메시지를 작성해줘. 제목은 50자 이내로."
```

### GitHub Actions 예시

```yaml
name: Claude PR Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude Code Review
        run: |
          claude -p "이 PR의 변경사항을 리뷰해줘" \
            --allowedTools "Read,Grep,Glob"
```

> 자세한 설정은 [공식 CI/CD 문서](/docs/claude-code-docs/ci-cd)를 참고하세요.

---

## 2. Hooks로 자동화

코드를 수정할 때마다 자동으로 실행되는 규칙을 설정할 수 있습니다.

### Pre-tool-use Hook (도구 실행 전)

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo '파일 수정 전 자동 백업 완료'"
          }
        ]
      }
    ]
  }
}
```

### Post-tool-use Hook (도구 실행 후)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

> 자세한 설정은 [Hooks 가이드](/docs/config/hooks)를 참고하세요.

---

## 3. 커스텀 슬래시 명령어

반복적인 작업을 슬래시 명령어로 만들 수 있습니다.

```markdown
<!-- .claude/commands/deploy-check.md -->
배포 전 체크리스트를 확인해줘:
1. 빌드 에러 없는지 (`npm run build`)
2. 타입 에러 없는지 (`npx tsc --noEmit`)
3. 환경 변수가 .env.example과 일치하는지
4. 커밋되지 않은 변경사항이 없는지
결과를 체크리스트 형태로 보여줘.
```

사용법: `/deploy-check`

### 팀 공유 명령어

`.claude/commands/` 폴더에 넣으면 팀원 모두가 사용할 수 있습니다.

```
.claude/commands/
├── deploy-check.md      # 배포 전 체크
├── code-review.md       # 코드 리뷰 기준
├── db-migration.md      # DB 마이그레이션 절차
└── hotfix.md            # 긴급 수정 절차
```

---

## 4. MCP 서버로 외부 도구 연결

Claude에 외부 서비스를 도구로 연결할 수 있습니다.

### 활용 사례

| MCP 서버 | 용도 |
|----------|------|
| **Supabase MCP** | Claude가 직접 DB 쿼리 실행 |
| **Playwright MCP** | Claude가 브라우저를 열어 UI 테스트 |
| **Sentry MCP** | 에러 로그를 Claude가 직접 분석 |
| **Slack MCP** | 빌드 결과를 Slack에 자동 전송 |

### 설정 방법

```bash
# Supabase MCP 추가
claude mcp add supabase --transport http https://api.supabase.com/mcp

# Playwright MCP (UI 테스트용)
claude mcp add playwright -- npx @anthropic-ai/mcp-playwright
```

> 자세한 설정은 [MCP 가이드](/docs/config/mcp)를 참고하세요.

---

## 5. Agent Teams (다중 에이전트)

대규모 작업에서 여러 Claude 에이전트가 협업합니다.

### 사용 시나리오

```
"에이전트 팀을 구성해서 이 리팩토링을 진행해줘:
 - 리더: 전체 리팩토링 계획 수립 및 조율
 - 개발자 1: API 레이어 리팩토링
 - 개발자 2: 프론트엔드 컴포넌트 리팩토링
 - QA: 리팩토링 후 기존 테스트 통과 확인"
```

### Worktree 병렬 개발과의 차이

| 기능 | Worktree 병렬 개발 | Agent Teams |
|------|-------------------|-------------|
| **실행 방식** | 터미널을 여러 개 열어 수동 관리 | Claude가 자동으로 에이전트 조율 |
| **사용 상황** | 독립적인 기능을 동시에 개발 | 관련된 작업을 역할 분담해 진행 |
| **난이도** | 초보도 가능 | 중급 이상 권장 |

> 자세한 설정은 [에이전트 팀 가이드](/docs/basics/agent-teams)를 참고하세요.

---

## 6. 성능 최적화 전략

### 컨텍스트 관리

대규모 프로젝트에서 컨텍스트를 효율적으로 관리하는 방법:

```
✅ 좋은 예:
"src/payment/ 폴더의 결제 처리 로직만 봐줘"

❌ 나쁜 예:
"프로젝트 전체를 봐줘" (컨텍스트 폭발)
```

### CLAUDE.md 고급 활용

```markdown
# CLAUDE.md

## 빌드 & 테스트
- `npm run build` — 빌드
- `npm run test` — 전체 테스트
- `npm run test:unit` — 유닛 테스트만
- `npm run lint` — 린트 검사

## 아키텍처 결정 기록
- 2024-01: 인증을 NextAuth에서 Supabase Auth로 전환 (SSR 호환성)
- 2024-03: 상태관리를 Redux에서 Zustand로 전환 (복잡도 감소)

## 위험 영역 (주의!)
- src/payment/ — PG사 연동 코드. 수정 시 반드시 테스트
- src/auth/ — 인증 미들웨어. 보안 검토 필수
- prisma/schema.prisma — DB 스키마 변경 시 마이그레이션 필요
```

---

## 고급에서 자주 쓰는 프롬프트

| 상황 | 프롬프트 |
|------|---------|
| 아키텍처 리뷰 | "ultrathink - 이 아키텍처의 확장성 문제를 분석해줘" |
| 보안 감사 | "OWASP Top 10 기준으로 이 API의 보안 취약점을 분석해줘" |
| 성능 분석 | "이 쿼리가 1만 건 데이터에서 어떻게 동작할지 분석해줘" |
| 마이그레이션 계획 | "이 DB 스키마를 변경하면 영향 받는 코드와 마이그레이션 계획을 만들어줘" |
| 장애 대응 | "이 에러 로그를 분석하고 근본 원인과 해결책을 제시해줘" |
