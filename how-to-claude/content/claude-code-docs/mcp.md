---
title: "MCP - Claude에게 외부 도구 연결하기"
source: "https://code.claude.com/docs/en/mcp"
order: 21
tags: ["커스터마이징", "MCP"]
---

# MCP: Claude에게 외부 도구 연결하기

> MCP(Model Context Protocol)는 Claude Code를 Slack, GitHub, 데이터베이스, Figma 같은 외부 서비스에 연결하는 표준 방식입니다.

## MCP란 무엇인가요?

MCP는 마치 **만능 플러그 어댑터**와 같습니다. Claude Code는 기본적으로 코드 파일만 읽고 쓸 수 있지만, MCP 서버를 연결하면 데이터베이스를 쿼리하고, Slack 메시지를 보내고, GitHub PR을 만드는 등 훨씬 더 많은 것을 할 수 있게 됩니다.

---

## MCP로 무엇을 할 수 있나요?

MCP 서버가 연결되면 Claude Code에게 이런 것들을 요청할 수 있습니다:

- "JIRA 이슈 ENG-4521에 설명된 기능을 구현하고 GitHub에 PR을 만들어 주세요."
- "Sentry와 Statsig에서 ENG-4521 기능의 사용 현황을 확인해 주세요."
- "PostgreSQL 데이터베이스에서 ENG-4521 기능을 사용한 사용자 10명의 이메일을 찾아주세요."
- "Slack에 올라온 새 Figma 디자인을 기반으로 이메일 템플릿을 업데이트해 주세요."

---

## MCP 서버 설치 방법

MCP 서버를 연결하는 방법은 세 가지입니다.

### 방법 1: 원격 HTTP 서버 연결

클라우드 기반 서비스를 연결하는 가장 권장되는 방법입니다.

```bash
# 기본 문법
claude mcp add --transport http <이름> <URL>

# 실제 예시: Notion 연결
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Bearer 토큰이 있는 예시
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### 방법 2: 원격 SSE 서버 연결

> **참고**: SSE 방식은 더 이상 권장되지 않습니다. 가능하면 HTTP 방식을 사용하세요.

```bash
# Asana 연결 예시
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

### 방법 3: 로컬 stdio 서버 연결

내 컴퓨터에서 직접 실행되는 서버로, 시스템에 직접 접근이 필요한 도구에 적합합니다.

```bash
# 기본 문법 (-- 뒤에 실행 명령어가 옵니다)
claude mcp add [옵션] <이름> -- <명령어> [인수...]

# Airtable 서버 예시
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

> **중요**: 모든 옵션(`--transport`, `--env`, `--scope`, `--header`)은 서버 이름 **앞**에 와야 합니다. `--`(더블 대시)는 서버 이름과 실행 명령어를 구분합니다.

---

## 서버 관리 명령어

```bash
# 연결된 모든 서버 목록
claude mcp list

# 특정 서버 상세 정보
claude mcp get github

# 서버 제거
claude mcp remove github

# Claude Code 내에서 서버 상태 확인
/mcp
```

---

## 인기 MCP 서버 예시

### GitHub 연결 (코드 리뷰·이슈 관리)

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

Claude Code 내에서 인증:
```
/mcp
```

사용 예시:
```
PR #456을 검토하고 개선 사항을 제안해 주세요
열려 있는 내 PR 목록을 보여주세요
방금 발견한 버그에 대한 이슈를 만들어 주세요
```

### Sentry 연결 (에러 모니터링)

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

사용 예시:
```
지난 24시간 동안 가장 많이 발생한 에러는 무엇인가요?
에러 ID abc123의 스택 트레이스를 보여주세요
어떤 배포에서 이 새 에러들이 발생하기 시작했나요?
```

### PostgreSQL 데이터베이스 연결

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"
```

사용 예시:
```
이번 달 총 매출은 얼마인가요?
orders 테이블의 스키마를 보여주세요
90일 이상 구매하지 않은 고객을 찾아주세요
```

---

## MCP 설치 범위(Scope) 이해하기

MCP 서버를 어느 범위로 설정할지 선택할 수 있습니다.

| 범위 | 명령 | 저장 위치 | 용도 |
|------|------|-----------|------|
| **Local** (기본) | `--scope local` | `~/.claude.json` (프로젝트별) | 이 프로젝트에서만 나만 사용 |
| **Project** | `--scope project` | `.mcp.json` (프로젝트 루트) | 팀 전체가 공유 (버전 관리) |
| **User** | `--scope user` | `~/.claude.json` (전역) | 모든 프로젝트에서 나만 사용 |

**범위 선택 가이드**:
- **Local**: 개인 개발 서버, 실험적 설정, 민감한 자격 증명
- **Project**: 팀 공유 서버, 프로젝트별 필수 도구
- **User**: 여러 프로젝트에서 자주 쓰는 개인 도구

### 팀 공유 (.mcp.json 파일)

프로젝트 범위 서버는 `.mcp.json` 파일에 저장되어 팀 전체가 공유할 수 있습니다.

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

보안을 위해 Claude Code는 `.mcp.json`의 프로젝트 범위 서버를 사용하기 전 승인을 요청합니다.

### 환경 변수 확장 (.mcp.json에서)

팀과 설정을 공유하면서 API 키 같은 민감 정보는 각자 다르게 유지할 수 있습니다.

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

---

## OAuth 인증

많은 클라우드 기반 MCP 서버는 OAuth 2.0 인증이 필요합니다.

### 기본 OAuth 인증

```bash
# 1. 서버 추가
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Claude Code 내에서 인증
/mcp
# 브라우저에서 로그인 과정 진행
```

인증 토큰은 자동으로 저장되고 갱신됩니다. 접근을 취소하려면 `/mcp` 메뉴에서 "Clear authentication"을 선택하세요.

### 고정 OAuth 콜백 포트 사용

일부 서버는 미리 등록된 리다이렉트 URI가 필요합니다.

```bash
claude mcp add --transport http \
  --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### 사전 설정된 OAuth 자격 증명 사용

"동적 클라이언트 등록을 지원하지 않습니다" 같은 오류가 나타나면:

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

---

## Claude Desktop에서 서버 가져오기

Claude Desktop에서 이미 설정한 서버가 있다면 Claude Code로 가져올 수 있습니다.

```bash
claude mcp add-from-claude-desktop
```

대화형 창에서 가져올 서버를 선택합니다. macOS와 WSL(Windows Subsystem for Linux)에서만 지원됩니다.

---

## JSON으로 서버 추가하기

JSON 설정으로 직접 서버를 추가할 수 있습니다.

```bash
# HTTP 서버 예시
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# stdio 서버 예시
claude mcp add-json local-tool '{"type":"stdio","command":"/path/to/tool","args":["--flag"],"env":{"KEY":"value"}}'
```

---

## MCP 출력 한도

MCP 도구가 많은 데이터를 반환할 때:

- 기본 경고 임계값: 10,000 토큰
- 기본 최대 한도: 25,000 토큰
- 한도 늘리기: `MAX_MCP_OUTPUT_TOKENS=50000 claude`

---

## MCP 도구 검색 (Tool Search)

MCP 서버가 많아서 도구 정의가 컨텍스트를 많이 차지할 때, Claude Code는 자동으로 도구 검색 모드를 활성화합니다.

| 설정 | 동작 |
|------|------|
| `auto` (기본) | 도구가 컨텍스트의 10% 초과 시 자동 활성화 |
| `auto:5` | 5% 임계값에서 활성화 |
| `true` | 항상 활성화 |
| `false` | 비활성화, 모든 도구를 처음부터 로드 |

```bash
# 5% 임계값 사용
ENABLE_TOOL_SEARCH=auto:5 claude

# 도구 검색 완전 비활성화
ENABLE_TOOL_SEARCH=false claude
```

---

## MCP 리소스 사용하기

MCP 서버는 `@` 멘션으로 참조할 수 있는 리소스를 제공할 수 있습니다.

```text
@github:issue://123을 분석하고 수정 방법을 제안해 주세요
@docs:file://api/authentication를 참고해서 인증 로직을 구현해 주세요
@postgres:schema://users와 @docs:file://database/user-model을 비교해 주세요
```

---

## Claude Code를 MCP 서버로 사용하기

Claude Code 자체를 다른 애플리케이션이 사용할 수 있는 MCP 서버로 실행할 수도 있습니다.

```bash
# stdio MCP 서버로 Claude Code 시작
claude mcp serve
```

Claude Desktop 설정 예시 (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

---

## 조직 관리: MCP 서버 중앙 제어

기업에서 MCP 서버를 중앙에서 관리하는 두 가지 방법이 있습니다.

### 방법 1: managed-mcp.json으로 독점 제어

관리자가 `managed-mcp.json`을 배포하면 사용자는 이 서버들만 사용할 수 있습니다.

저장 위치:
- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux/WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server"
    }
  }
}
```

### 방법 2: 허용/차단 목록으로 정책 기반 제어

사용자가 서버를 추가할 수 있지만, 허용된 것만 사용 가능합니다.

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverCommand": ["npx", "-y", "approved-package"] }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" },
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

| 정책 설정 | 동작 |
|-----------|------|
| `allowedMcpServers` 미설정 | 모든 서버 허용 |
| `allowedMcpServers: []` | 모든 서버 차단 |
| `allowedMcpServers: [...]` | 목록에 있는 서버만 허용 |
| `deniedMcpServers: [...]` | 목록의 서버 항상 차단 (allowedMcpServers보다 우선) |

---

## 예시 케이스

### 케이스 1: 풀스택 개발 워크플로우

**상황**: JIRA에서 이슈를 가져와 구현하고, GitHub에 PR을 올리고, Slack으로 팀에 알림을 보내는 전체 워크플로우를 Claude가 도와주길 원합니다.

**해결책**: JIRA, GitHub, Slack MCP 서버를 모두 연결합니다.

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp add --transport http slack https://mcp.slack.com/mcp
# JIRA는 회사별 URL 필요
```

Claude Code에게 요청:
```
JIRA-123 이슈를 구현하고, 테스트를 추가하고, GitHub에 PR을 올린 다음 #dev 채널에 알림을 보내주세요.
```

### 케이스 2: 데이터 분석 지원

**상황**: 비즈니스 데이터를 분석하고 싶지만 SQL을 모릅니다.

**해결책**: 데이터베이스 MCP 서버를 읽기 전용 계정으로 연결합니다.

```bash
claude mcp add --transport stdio analytics-db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly_user:pass@analytics.db.com:5432/analytics"
```

Claude Code에게 자연어로 질문:
```
지난 달 가장 많이 팔린 상품 10개를 알려주세요
신규 가입자 수가 가장 많은 요일은 언제인가요?
이탈률이 높은 사용자 세그먼트를 분석해 주세요
```

### 케이스 3: 디자인-코드 연동

**상황**: Figma 디자인이 업데이트되면 Claude가 바로 코드를 수정해 주길 원합니다.

**해결책**: Figma MCP 서버를 연결합니다.

```
Figma의 최신 버튼 컴포넌트 디자인을 참고해서 우리 React 버튼 컴포넌트를 업데이트해 주세요
```

Claude가 Figma에서 직접 디자인 스펙을 읽어 코드에 반영합니다.
