---
title: "플러그인 레퍼런스 — 플러그인 시스템의 모든 기술 명세"
source: "https://code.claude.com/docs/en/plugins-reference"
order: 24
tags: ["플러그인", "레퍼런스"]
---

# 플러그인 레퍼런스

> 이 문서는 플러그인 시스템의 "설명서 뒷면"입니다. 모든 옵션과 세부 명세를 담고 있습니다.

---

## 플러그인 구성 요소 한눈에 보기

플러그인은 여러 종류의 구성 요소를 포함할 수 있습니다.

| 구성 요소 | 기본 위치 | 역할 |
|----------|---------|------|
| **스킬(Skills)** | `skills/` 또는 `commands/` | `/명령어` 단축키 추가 |
| **에이전트(Agents)** | `agents/` | 특정 작업 전문 AI 에이전트 |
| **훅(Hooks)** | `hooks/hooks.json` | 이벤트 자동 처리 |
| **MCP 서버** | `.mcp.json` | 외부 도구·서비스 연결 |
| **LSP 서버** | `.lsp.json` | 실시간 코드 지능 (오류 감지, 정의로 이동 등) |
| **설정** | `settings.json` | 플러그인 활성화 시 기본 설정 적용 |

---

## 구성 요소별 상세 설명

### 스킬(Skills)

스킬은 Claude Code에 `/명령어` 단축키를 추가합니다. 사용자가 직접 호출하거나 Claude가 상황에 맞게 자동 호출합니다.

**폴더 구조 예시**:

```
skills/
├── pdf-processor/
│   ├── SKILL.md          ← 핵심 파일
│   ├── reference.md      ← 선택사항: 참고 자료
│   └── scripts/          ← 선택사항: 스크립트 파일
└── code-reviewer/
    └── SKILL.md
```

---

### 에이전트(Agents)

특정 작업에 특화된 AI 전문가입니다. `/agents` 명령어로 목록을 볼 수 있고, Claude가 상황에 따라 자동으로 호출합니다.

**에이전트 파일 형식** (`agents/` 폴더 안 마크다운 파일):

```markdown
---
name: agent-name
description: 이 에이전트가 무엇을 전문으로 하는지, Claude가 언제 호출해야 하는지
---

에이전트의 역할, 전문 영역, 행동 방식을 설명하는 시스템 프롬프트.
```

---

### 훅(Hooks)

Claude Code 이벤트가 발생할 때 자동으로 실행되는 동작입니다. "특정 행동이 일어나면 자동으로 이것을 해라"는 규칙입니다.

**지원되는 이벤트 목록**:

| 이벤트 | 발생 시점 |
|--------|---------|
| `PreToolUse` | Claude가 도구를 사용하기 전 |
| `PostToolUse` | Claude가 도구를 성공적으로 사용한 후 |
| `PostToolUseFailure` | 도구 실행 실패 후 |
| `PermissionRequest` | 권한 확인 대화창이 표시될 때 |
| `UserPromptSubmit` | 사용자가 프롬프트를 제출할 때 |
| `Stop` | Claude가 작업을 멈추려 할 때 |
| `SessionStart` | 세션 시작 시 |
| `SessionEnd` | 세션 종료 시 |
| `TaskCompleted` | 작업이 완료로 표시될 때 |
| `PreCompact` | 대화 기록이 압축되기 전 |

**훅 설정 예시** (`hooks/hooks.json`):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

> `${CLAUDE_PLUGIN_ROOT}`는 플러그인이 설치된 폴더의 절대 경로입니다. 스크립트 경로에 반드시 이 변수를 사용하세요.

**훅 유형**:

| 유형 | 설명 |
|------|------|
| `command` | 셸 명령어 또는 스크립트 실행 |
| `prompt` | LLM으로 프롬프트 평가 |
| `agent` | 도구를 갖춘 에이전트 검증기 실행 |

---

### MCP 서버

외부 도구나 서비스를 Claude에 연결해주는 서버입니다. GitHub, Slack, 데이터베이스 등 다양한 서비스와 Claude를 연결할 수 있습니다.

**설정 예시** (`.mcp.json`):

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  }
}
```

---

### LSP 서버 (코드 지능)

코드를 작성할 때 실시간으로 오류를 알려주고, 함수 정의로 이동하거나 참조를 찾을 수 있게 해주는 서버입니다. VS Code의 코드 지능 기능과 같은 기술입니다.

**설정 파일 예시** (`.lsp.json`):

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

**필수 항목**:

| 항목 | 설명 |
|------|------|
| `command` | 실행할 LSP 바이너리 이름 (PATH에 있어야 함) |
| `extensionToLanguage` | 파일 확장자와 언어 이름 매핑 |

**선택 항목**:

| 항목 | 설명 |
|------|------|
| `args` | LSP 서버 실행 인수 |
| `env` | 환경 변수 설정 |
| `startupTimeout` | 서버 시작 최대 대기 시간(밀리초) |
| `restartOnCrash` | 충돌 시 자동 재시작 여부 |

> **주의**: LSP 서버 바이너리는 별도로 설치해야 합니다. 플러그인 설치 오류 탭에서 `Executable not found in $PATH` 오류가 보이면 해당 언어 서버를 먼저 설치하세요.

---

## 예시 케이스

> **상황**: 개발팀의 준혁씨는 Python 코드를 작성할 때 타입 오류를 Claude가 즉시 알아채길 원합니다. Pyright LSP 플러그인을 설치하면 Claude가 파일을 수정할 때마다 타입 오류, import 누락 등을 즉시 감지하고 같은 턴에 수정합니다.

---

## 플러그인 설치 범위(Scope)

플러그인을 설치할 때 어디에 설치할지 선택할 수 있습니다.

| 범위 | 설정 파일 위치 | 사용 상황 |
|------|-------------|---------|
| `user` | `~/.claude/settings.json` | 모든 프로젝트에서 개인적으로 사용 (기본값) |
| `project` | `.claude/settings.json` | 팀 전체와 버전 관리로 공유 |
| `local` | `.claude/settings.local.json` | 현재 프로젝트에서만 개인적으로 사용 (gitignore) |
| `managed` | 관리자 설정 파일 | 조직 관리자가 배포한 플러그인 (읽기 전용) |

---

## plugin.json 전체 스키마

```json
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "플러그인 설명",
  "author": {
    "name": "작성자 이름",
    "email": "email@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["키워드1", "키워드2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "lspServers": "./.lsp.json"
}
```

### 필수 항목

| 항목 | 유형 | 설명 | 예시 |
|------|------|------|------|
| `name` | 문자열 | 고유 식별자 (소문자, 하이픈 사용) | `"deployment-tools"` |

### 메타데이터 항목

| 항목 | 유형 | 설명 | 예시 |
|------|------|------|------|
| `version` | 문자열 | 시맨틱 버전 | `"2.1.0"` |
| `description` | 문자열 | 플러그인 목적 설명 | `"배포 자동화 도구"` |
| `author` | 객체 | 작성자 정보 | `{"name": "팀 이름"}` |
| `homepage` | 문자열 | 문서 URL | `"https://docs.example.com"` |
| `license` | 문자열 | 라이선스 식별자 | `"MIT"` |
| `keywords` | 배열 | 검색 태그 | `["배포", "ci-cd"]` |

---

## CLI 명령어 레퍼런스

터미널에서 플러그인을 관리하는 명령어들입니다.

### 설치

```bash
# 기본 설치 (user 범위)
claude plugin install formatter@my-marketplace

# 프로젝트 범위로 설치 (팀과 공유)
claude plugin install formatter@my-marketplace --scope project

# 로컬 범위로 설치 (개인용, gitignore)
claude plugin install formatter@my-marketplace --scope local
```

### 제거

```bash
claude plugin uninstall plugin-name
# 또는 별칭 사용
claude plugin remove plugin-name
claude plugin rm plugin-name
```

### 활성화 / 비활성화

```bash
# 비활성화 (제거하지 않음)
claude plugin disable plugin-name

# 다시 활성화
claude plugin enable plugin-name
```

### 업데이트

```bash
claude plugin update plugin-name
```

---

## 문제 해결 가이드

### 자주 발생하는 오류

| 증상 | 원인 | 해결 방법 |
|------|------|---------|
| 플러그인이 로드되지 않음 | `plugin.json` JSON 문법 오류 | `claude plugin validate` 로 검증 |
| 명령어가 보이지 않음 | 폴더 구조 오류 | `commands/`가 루트에 있는지 확인 |
| 훅이 실행되지 않음 | 스크립트 실행 권한 없음 | `chmod +x script.sh` 실행 |
| MCP 서버 실패 | `${CLAUDE_PLUGIN_ROOT}` 미사용 | 모든 플러그인 경로에 변수 사용 |
| LSP `Executable not found` | 언어 서버 미설치 | 해당 언어 서버 바이너리 설치 |

### 디렉토리 구조 실수

**잘못된 구조** (흔한 실수):
```
my-plugin/
└── .claude-plugin/
    ├── plugin.json
    ├── commands/    ← 여기 있으면 안 됩니다!
    └── hooks/       ← 여기 있으면 안 됩니다!
```

**올바른 구조**:
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json  ← 여기에는 이것만!
├── commands/        ← 루트에 있어야 합니다
└── hooks/           ← 루트에 있어야 합니다
```

---

## 버전 관리

시맨틱 버전 형식: `MAJOR.MINOR.PATCH`

| 변경 유형 | 어떤 숫자를 올릴까? | 예시 |
|---------|----------------|------|
| 하위 호환 불가 변경 | MAJOR | `1.0.0` → `2.0.0` |
| 새 기능 추가 (하위 호환) | MINOR | `1.0.0` → `1.1.0` |
| 버그 수정 | PATCH | `1.0.0` → `1.0.1` |

> **주의**: 코드를 변경했는데 버전을 올리지 않으면 기존 사용자들은 업데이트를 받지 못합니다. 코드를 배포하기 전에 반드시 버전을 올리세요.
