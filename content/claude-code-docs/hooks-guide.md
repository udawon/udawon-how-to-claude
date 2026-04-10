---
title: "훅 가이드 - 워크플로우 자동화하기"
source: "https://code.claude.com/docs/en/hooks-guide"
order: 19
tags: ["커스터마이징", "훅", "Hooks guide"]
---

# 훅 가이드: 워크플로우 자동화하기

> 훅은 Claude Code의 특정 시점에 자동으로 실행되는 쉘 명령어입니다. 코드 포맷, 알림 전송, 위험한 명령 차단 등을 자동화할 수 있습니다.

## 훅이란 무엇인가요?

훅은 마치 **자동 반응 장치**와 같습니다. "Claude가 파일을 편집하면 → Prettier로 자동 포맷팅", "Claude가 작업을 완료하면 → 데스크탑 알림 전송" 같은 규칙을 설정할 수 있습니다.

LLM이 판단하는 것이 아니라, 조건이 맞으면 **반드시** 실행됩니다. 이것이 스킬과의 가장 큰 차이점입니다.

---

## 첫 번째 훅 설정하기 (단계별 안내)

**예시**: Claude가 입력을 기다릴 때 데스크탑 알림 받기

### 1단계: 훅 메뉴 열기
Claude Code에서 `/hooks`를 입력하면 사용 가능한 훅 이벤트 목록이 나타납니다. `Notification`을 선택하세요.

### 2단계: 매처(Matcher) 설정
매처는 훅이 실행될 조건을 필터링합니다. 모든 알림에 반응하려면 `*`로 설정하세요.

### 3단계: 명령어 추가
`+ Add new hook…`을 선택하고 아래 명령어 중 해당 OS에 맞는 것을 입력하세요.

**macOS:**
```bash
osascript -e 'display notification "Claude Code가 입력을 기다립니다" with title "Claude Code"'
```

**Linux:**
```bash
notify-send 'Claude Code' 'Claude Code가 입력을 기다립니다'
```

**Windows (PowerShell):**
```powershell
powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Claude Code가 입력을 기다립니다', 'Claude Code')"
```

### 4단계: 저장 위치 선택
- **User settings** (`~/.claude/settings.json`): 내 모든 프로젝트에 적용
- **Project settings** (`.claude/settings.json`): 이 프로젝트에만 적용

### 5단계: 테스트
`Esc`로 CLI로 돌아가 Claude에게 작업을 시킨 후, 터미널을 닫아두면 알림이 옵니다.

---

## 훅으로 자동화할 수 있는 것들

### 1. 코드 편집 후 자동 포맷팅

Claude가 파일을 편집할 때마다 Prettier로 자동 포맷팅합니다.

`.claude/settings.json`에 추가:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

> **참고**: `jq`는 JSON 파서입니다. `brew install jq` (macOS) 또는 `apt-get install jq` (Linux)로 설치하세요.

### 2. 민감한 파일 수정 차단

`.env`, `package-lock.json`, `.git/` 같은 파일을 Claude가 건드리지 못하게 막습니다.

**1단계**: `.claude/hooks/protect-files.sh` 작성:
```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "차단됨: $FILE_PATH는 보호된 파일입니다" >&2
    exit 2
  fi
done

exit 0
```

**2단계**: 실행 권한 부여 (macOS/Linux):
```bash
chmod +x .claude/hooks/protect-files.sh
```

**3단계**: `.claude/settings.json`에 등록:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

### 3. 압축(Compact) 후 컨텍스트 재주입

대화가 길어지면 Claude가 이전 내용을 압축합니다. 이때 중요한 정보를 다시 알려줍니다.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: Bun을 사용하세요, npm 아닙니다. 커밋 전 bun test 실행. 현재 스프린트: 인증 리팩토링.'"
          }
        ]
      }
    ]
  }
}
```

### 4. 설정 파일 변경 감사(Audit) 로그

설정 파일이 변경될 때마다 로그를 남깁니다.

```json
{
  "hooks": {
    "ConfigChange": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -c '{timestamp: now | todate, source: .source, file: .file_path}' >> ~/claude-config-audit.log"
          }
        ]
      }
    ]
  }
}
```

---

## 훅 이벤트 종류

훅은 Claude Code 생명주기의 특정 시점에 발생하는 이벤트에 반응합니다.

| 이벤트 | 발생 시점 |
|--------|-----------|
| `SessionStart` | 세션 시작 또는 재개 시 |
| `UserPromptSubmit` | 프롬프트 제출 직후, Claude 처리 전 |
| `PreToolUse` | 도구 호출 실행 전 (차단 가능) |
| `PermissionRequest` | 권한 확인 대화상자가 나타날 때 |
| `PostToolUse` | 도구 호출 성공 후 |
| `PostToolUseFailure` | 도구 호출 실패 후 |
| `Notification` | Claude Code가 알림을 보낼 때 |
| `Stop` | Claude가 응답을 완료했을 때 |
| `PreCompact` | 컨텍스트 압축 전 |
| `SessionEnd` | 세션 종료 시 |
| `InstructionsLoaded` | CLAUDE.md 또는 rules 파일이 불려올 때 |
| `ConfigChange` | 세션 중 설정 파일이 변경될 때 |

---

## 훅 작동 원리

### 입력과 출력

훅이 실행되면 Claude Code는 이벤트 정보를 JSON 형태로 표준 입력(stdin)으로 전달합니다.

**예시 입력** (PreToolUse - Bash 도구 호출 시):
```json
{
  "session_id": "abc123",
  "cwd": "/Users/user/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

### 종료 코드로 결과 전달

| 종료 코드 | 의미 |
|-----------|------|
| `exit 0` | 작업을 허용합니다 |
| `exit 2` | 작업을 차단합니다 (stderr 메시지가 Claude에게 전달됨) |
| 기타 코드 | 작업은 허용, 에러는 로그에만 기록 |

### 구조화된 JSON 출력으로 더 세밀한 제어

단순 허용/차단 외에 더 세밀한 제어가 필요하면 `exit 0`과 함께 JSON을 stdout으로 출력합니다.

**PreToolUse에서 도구 차단하기**:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "성능을 위해 grep 대신 rg를 사용하세요"
  }
}
```

`permissionDecision` 옵션:
- `"allow"`: 권한 확인 없이 진행
- `"deny"`: 도구 호출 취소 (이유가 Claude에게 전달됨)
- `"ask"`: 사용자에게 권한 확인 표시

---

## 매처(Matcher) 패턴

매처는 훅이 언제 실행될지 필터링하는 정규식입니다.

| 이벤트 | 필터 기준 | 예시 |
|--------|-----------|------|
| `PreToolUse`, `PostToolUse` | 도구 이름 | `Bash`, `Edit\|Write` |
| `SessionStart` | 세션 시작 방식 | `startup`, `resume`, `compact` |
| `SessionEnd` | 세션 종료 이유 | `clear`, `logout` |
| `Notification` | 알림 유형 | `permission_prompt`, `idle_prompt` |
| `PreCompact` | 압축 트리거 | `manual`, `auto` |

---

## 고급 훅 타입

### 프롬프트 기반 훅 (Prompt-based Hooks)

규칙보다 판단이 필요한 경우, Claude 모델(기본: Haiku)에게 결정을 맡깁니다.

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "모든 작업이 완료되었는지 확인하세요. 완료되지 않았다면 {\"ok\": false, \"reason\": \"남은 작업 내용\"}으로 응답하세요."
          }
        ]
      }
    ]
  }
}
```

### 에이전트 기반 훅 (Agent-based Hooks)

파일을 읽거나 명령을 실행해야 검증할 수 있는 경우, 서브에이전트를 생성합니다.

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "모든 단위 테스트가 통과하는지 확인하세요. 테스트 스위트를 실행하고 결과를 확인하세요.",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### HTTP 훅 (HTTP Hooks)

외부 웹 서버나 클라우드 함수에 이벤트 데이터를 전송합니다.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "http://localhost:8080/hooks/tool-use",
            "headers": {
              "Authorization": "Bearer $MY_TOKEN"
            },
            "allowedEnvVars": ["MY_TOKEN"]
          }
        ]
      }
    ]
  }
}
```

---

## 훅 저장 위치

| 위치 | 범위 | 공유 가능 여부 |
|------|------|----------------|
| `~/.claude/settings.json` | 내 모든 프로젝트 | 아니오 |
| `.claude/settings.json` | 단일 프로젝트 | 예 (저장소에 커밋 가능) |
| `.claude/settings.local.json` | 단일 프로젝트 | 아니오 (gitignore됨) |
| 관리 정책 설정 | 조직 전체 | 예 (관리자 제어) |

---

## 예시 케이스

### 케이스 1: 다른 일 하면서 Claude 기다리기

**상황**: Claude에게 긴 작업을 맡기고 다른 일을 하다가, Claude가 완료하면 알림을 받고 싶습니다.

**해결책**: `Notification` 이벤트로 데스크탑 알림 설정

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude가 응답을 기다립니다\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### 케이스 2: 위험한 명령 자동 차단

**상황**: Claude가 실수로 데이터베이스를 삭제하거나 중요한 파일을 지우는 것을 방지하고 싶습니다.

**해결책**: `PreToolUse` 훅으로 위험한 명령 패턴 차단

```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

DANGEROUS_PATTERNS=("drop table" "rm -rf /" "DELETE FROM" "truncate")

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "위험한 명령이 차단되었습니다: $pattern 패턴 감지" >&2
    exit 2
  fi
done

exit 0
```

### 케이스 3: 코드 품질 자동 관리

**상황**: Claude가 파일을 수정할 때마다 ESLint + Prettier가 자동으로 실행되길 원합니다.

**해결책**: `PostToolUse` 훅으로 편집 후 자동 린팅

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs -I{} sh -c 'npx eslint --fix {} && npx prettier --write {}'"
          }
        ]
      }
    ]
  }
}
```

---

## 문제 해결

### 훅이 실행되지 않아요

1. `/hooks`에서 훅이 올바른 이벤트 아래 표시되는지 확인
2. 매처 패턴이 도구 이름과 정확히 일치하는지 확인 (대소문자 구분)
3. 올바른 이벤트 타입인지 확인 (`PreToolUse` vs `PostToolUse`)

### "command not found" 에러

절대 경로를 사용하거나 `$CLAUDE_PROJECT_DIR`을 활용하세요.

### JSON 파싱 에러

쉘 프로필(`~/.zshrc`)에 무조건 실행되는 `echo` 문이 있으면 JSON 앞에 추가 텍스트가 붙습니다. 다음과 같이 대화형 쉘에서만 실행되도록 수정하세요:

```bash
# ~/.zshrc에서
if [[ $- == *i* ]]; then
  echo "Shell ready"
fi
```

### Stop 훅이 무한 루프에 빠져요

`stop_hook_active`가 `true`이면 일찍 종료하는 코드를 추가하세요:

```bash
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # Claude가 멈출 수 있도록 허용
fi
# ... 나머지 훅 로직
```

### 디버깅 방법

`Ctrl+O`로 상세 모드를 켜면 훅 출력이 트랜스크립트에 표시됩니다. 또는 `claude --debug`로 전체 실행 세부 정보를 볼 수 있습니다.
