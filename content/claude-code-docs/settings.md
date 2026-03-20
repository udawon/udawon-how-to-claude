---
title: "설정 가이드: Claude Code 내 마음대로 설정하기"
source: "https://code.claude.com/docs/en/settings"
order: 8
tags: ["설정", "Settings"]
---

# 설정 가이드: Claude Code 내 마음대로 설정하기

Claude Code의 설정은 마치 집의 규칙과 같습니다. 개인 방에만 적용되는 규칙, 집 전체에 적용되는 규칙, 동네 전체에 적용되는 규칙이 따로 있는 것처럼, Claude Code도 설정 범위가 나뉩니다.

---

## 설정 범위: 어디에 적용되는 설정인가요?

| 범위 | 비유 | 파일 위치 | 팀 공유 가능? |
|------|------|-----------|-------------|
| **Managed** (관리자) | 회사 전체 규칙 | IT 배포 | 예 (강제 적용) |
| **User** (개인) | 내 개인 방 규칙 | `~/.claude/settings.json` | 아니오 |
| **Project** (프로젝트) | 우리 팀 공유 규칙 | `.claude/settings.json` | 예 (git에 올림) |
| **Local** (로컬) | 내 작업용 임시 규칙 | `.claude/settings.local.json` | 아니오 (gitignore) |

### 우선순위: 어떤 설정이 이기나요?

충돌할 때는 이 순서로 이깁니다:
1. **Managed** (가장 강함, IT 관리자 설정)
2. 명령줄 인자
3. **Local** (내 로컬 설정)
4. **Project** (프로젝트 설정)
5. **User** (가장 약함, 개인 기본 설정)

---

## 설정 파일 형식

설정 파일은 JSON 형식입니다. 메모장이나 텍스트 편집기로 열어서 수정할 수 있습니다.

```json
{
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)"],
    "deny": ["Read(./.env)", "Read(./secrets/**)"]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1"
  }
}
```

---

## 주요 설정 옵션 모음

### 기본 설정

| 설정 키 | 설명 | 예시 값 |
|---------|------|--------|
| `model` | 사용할 AI 모델 | `"sonnet"`, `"opus"` |
| `language` | Claude 응답 언어 | `"korean"`, `"japanese"` |
| `cleanupPeriodDays` | 오래된 세션 자동 삭제 (기본: 30일) | `20` |
| `autoUpdatesChannel` | 업데이트 채널 | `"stable"`, `"latest"` |
| `outputStyle` | 출력 방식 스타일 | `"Explanatory"` |

### 권한 설정

Claude가 무엇을 할 수 있는지 제어합니다.

```json
{
  "permissions": {
    "allow": ["Bash(git diff *)", "Bash(npm run *)"],
    "deny": ["Read(./.env)", "WebFetch"],
    "defaultMode": "acceptEdits"
  }
}
```

| 설정 키 | 설명 |
|---------|------|
| `allow` | 허용할 작업 목록 (물어보지 않고 실행) |
| `ask` | 확인 후 실행할 작업 목록 |
| `deny` | 절대 허용 안 할 작업 목록 |
| `defaultMode` | 기본 권한 모드 |
| `additionalDirectories` | 접근 허용할 추가 폴더 목록 |

### 권한 모드 종류

| 모드 | 설명 | 언제 사용? |
|------|------|----------|
| `default` | 새 도구 사용 시 매번 물어봄 | 일반적인 작업 |
| `acceptEdits` | 파일 편집은 자동 허용 | 빠른 작업 시 |
| `plan` | 분석만, 파일 수정 불가 | 검토만 할 때 |
| `dontAsk` | 사전 허용된 것만 실행 | 자동화 작업 |
| `bypassPermissions` | 모든 권한 확인 건너뜀 | 격리된 환경에서만 |

---

## 민감한 파일 보호하기

비밀번호, API 키 등이 담긴 파일은 Claude가 읽지 못하도록 막을 수 있습니다.

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)"
    ]
  }
}
```

---

## 환경 변수 설정

모든 Claude 세션에 적용될 환경 변수를 설정할 수 있습니다.

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "DISABLE_AUTOUPDATER": "1"
  }
}
```

### 자주 쓰는 환경 변수

| 변수 | 설명 |
|------|------|
| `DISABLE_AUTOUPDATER` | 자동 업데이트 끄기 (`"1"`) |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | 빠른 모드 끄기 (`"1"`) |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 최대 출력 토큰 수 (최대 64,000) |
| `CLAUDE_CODE_EFFORT_LEVEL` | 노력 수준 (`"low"`, `"medium"`, `"high"`) |
| `DISABLE_COST_WARNINGS` | 비용 경고 끄기 (`"1"`) |
| `CLAUDE_CODE_SHELL` | 사용할 셸 지정 (`bash`, `zsh`) |

---

## 현재 적용된 설정 확인하기

Claude Code 안에서 `/status` 명령어를 실행하면 현재 어떤 설정이 적용되어 있는지 확인할 수 있습니다.

---

## 설정 파일 저장 위치 요약

| 파일 | 범위 | 경로 |
|------|------|------|
| 개인 설정 | User | `~/.claude/settings.json` |
| 프로젝트 설정 | Project | `.claude/settings.json` |
| 로컬 설정 | Local | `.claude/settings.local.json` |
| 개인 메모리 | User | `~/.claude/CLAUDE.md` |
| 프로젝트 메모리 | Project | `CLAUDE.md` 또는 `.claude/CLAUDE.md` |
| MCP 서버 (개인) | User | `~/.claude.json` |
| MCP 서버 (프로젝트) | Project | `.mcp.json` |

---

## 예시 케이스

**상황 1: 팀장이 팀 전체에 공통 설정 배포하기**

> 개발팀장 최팀장은 팀원 모두가 같은 규칙으로 Claude Code를 쓰길 원합니다. `.claude/settings.json`을 만들고 git에 커밋했습니다. 이제 팀원이 저장소를 클론하면 자동으로 이 설정이 적용됩니다. Claude가 `.env` 파일을 읽지 못하도록 deny 규칙도 추가했습니다.

**상황 2: 개인 선호 설정 만들기**

> 디자이너 윤지은 씨는 Claude가 항상 한국어로 대답해주길 원합니다. `~/.claude/settings.json`에 `"language": "korean"`을 추가했습니다. 이 설정은 어떤 프로젝트를 작업하든 항상 적용됩니다.

**상황 3: 프로젝트별로 다른 설정 사용하기**

> 백엔드 개발자 정백엔드 씨는 특정 프로젝트에서만 git push를 막고 싶습니다. 그 프로젝트 폴더에 `.claude/settings.local.json`을 만들고 `"deny": ["Bash(git push *)"]`를 추가했습니다. 이 파일은 gitignore에 등록되어 있어 다른 팀원에게 영향을 주지 않습니다.
