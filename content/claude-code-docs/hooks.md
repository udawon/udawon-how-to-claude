---
title: "훅 레퍼런스 - 이벤트·설정·입출력 형식 완전 가이드"
source: "https://code.claude.com/docs/en/hooks"
order: 20
tags: ["커스터마이징", "훅", "Hooks reference"]
---

# 훅 레퍼런스

> 훅 이벤트 스키마, 설정 옵션, JSON 입출력 형식, 종료 코드, 비동기 훅, HTTP 훅, 프롬프트 훅의 전체 레퍼런스입니다.

> **처음 훅을 설정하신다면** 이 문서보다 [훅 가이드](./hooks-guide.md)를 먼저 읽으세요.

훅(Hook)은 스마트홈의 자동화 규칙과 같습니다. "현관문이 열리면 조명을 켜라"처럼, "Claude가 파일을 수정하면 자동으로 코드를 정리해라"같은 규칙을 미리 설정해두는 기능입니다. 이 문서는 그 규칙을 만들 때 필요한 모든 세부 옵션을 정리한 레퍼런스입니다.

---

## 훅 생명주기

훅은 Claude Code 세션의 특정 시점에 발동됩니다. 이벤트가 발생하고 매처가 일치하면, Claude Code는 이벤트 관련 JSON 정보를 훅 핸들러에 전달합니다.

### 모든 훅 이벤트 목록

| 이벤트 | 발생 시점 |
|--------|-----------|
| `SessionStart` | 세션 시작 또는 재개 시 |
| `UserPromptSubmit` | 프롬프트 제출 후, Claude 처리 전 |
| `PreToolUse` | 도구 호출 실행 전 (차단 가능) |
| `PermissionRequest` | 권한 확인 대화상자 표시 시 |
| `PostToolUse` | 도구 호출 성공 후 |
| `PostToolUseFailure` | 도구 호출 실패 후 |
| `Notification` | Claude Code가 알림 전송 시 |
| `SubagentStart` | 서브에이전트 생성 시 |
| `SubagentStop` | 서브에이전트 완료 시 |
| `Stop` | Claude 응답 완료 시 |
| `TeammateIdle` | 에이전트 팀의 동료가 유휴 상태가 될 때 |
| `TaskCompleted` | 작업이 완료로 표시될 때 |
| `InstructionsLoaded` | CLAUDE.md 또는 `.claude/rules/*.md` 파일 불려올 때 |
| `ConfigChange` | 세션 중 설정 파일 변경 시 |
| `WorktreeCreate` | 워크트리 생성 시 (`--worktree` 또는 `isolation: "worktree"`) |
| `WorktreeRemove` | 워크트리 제거 시 (세션 종료 또는 서브에이전트 완료 시) |
| `PreCompact` | 컨텍스트 압축 전 |
| `SessionEnd` | 세션 종료 시 |

---

## 설정 구조

훅은 JSON 설정 파일에 3단계 중첩 구조로 정의합니다.

1. **훅 이벤트** 선택 (`PreToolUse`, `Stop` 등)
2. **매처 그룹** 설정 (언제 실행할지 필터링)
3. **훅 핸들러** 정의 (실행할 명령어, HTTP 엔드포인트, 또는 프롬프트)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/my-script.sh"
          }
        ]
      }
    ]
  }
}
```

### 훅 저장 위치

| 위치 | 범위 | 공유 가능 여부 |
|------|------|----------------|
| `~/.claude/settings.json` | 내 모든 프로젝트 | 아니오 |
| `.claude/settings.json` | 단일 프로젝트 | 예 (저장소에 커밋 가능) |
| `.claude/settings.local.json` | 단일 프로젝트 | 아니오 (gitignore됨) |
| 관리 정책 설정 | 조직 전체 | 예 (관리자 제어) |
| 플러그인 `hooks/hooks.json` | 플러그인 활성화 시 | 예 |
| 스킬 또는 에이전트 프론트매터 | 해당 컴포넌트 활성 중 | 예 |

---

## 매처 패턴

`matcher` 필드는 훅이 실행될 조건을 필터링하는 정규식 문자열입니다. `"*"`, `""`, 또는 `matcher` 생략 시 모든 발생에 반응합니다.

| 이벤트 | 필터 기준 | 예시 값 |
|--------|-----------|---------|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | 도구 이름 | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | 세션 시작 방식 | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | 세션 종료 이유 | `clear`, `logout`, `prompt_input_exit`, `other` |
| `Notification` | 알림 유형 | `permission_prompt`, `idle_prompt`, `auth_success` |
| `SubagentStart`, `SubagentStop` | 에이전트 타입 | `Bash`, `Explore`, `Plan`, 커스텀 이름 |
| `PreCompact` | 압축 트리거 | `manual`, `auto` |
| `ConfigChange` | 설정 소스 | `user_settings`, `project_settings`, `skills` |
| `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded` | 매처 미지원 | 항상 실행 |

---

## 훅 입출력 형식

### 공통 입력 필드

모든 이벤트에 포함되는 공통 필드:

```json
{
  "session_id": "abc123",
  "cwd": "/Users/user/myproject",
  "hook_event_name": "PreToolUse"
}
```

### 이벤트별 추가 입력 필드

#### PreToolUse / PostToolUse
```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

#### UserPromptSubmit
```json
{
  "prompt": "사용자가 입력한 프롬프트 텍스트"
}
```

#### SessionStart
```json
{
  "source": "startup"
}
```
`source` 값: `startup`, `resume`, `clear`, `compact`

#### Stop
```json
{
  "stop_hook_active": false
}
```

#### InstructionsLoaded
```json
{
  "file_path": "/path/to/CLAUDE.md",
  "load_reason": "session_start"
}
```

#### ConfigChange
```json
{
  "source": "project_settings",
  "file_path": "/path/to/.claude/settings.json"
}
```

---

## 종료 코드 및 출력 방식

### 종료 코드

| 종료 코드 | 의미 | 동작 |
|-----------|------|------|
| `0` | 성공/허용 | 작업 진행. stdout은 일부 이벤트에서 Claude 컨텍스트에 추가됨 |
| `2` | 차단 | 작업 차단. stderr 메시지가 Claude에게 피드백으로 전달됨 |
| 기타 | 오류 | 작업 진행, stderr는 로그에만 기록 (상세 모드 `Ctrl+O`로 확인) |

### 구조화된 JSON 출력

`exit 0`과 함께 JSON을 stdout으로 출력하면 더 세밀한 제어가 가능합니다.

> **주의**: JSON 출력과 `exit 2`를 함께 사용하지 마세요. `exit 2` 시에는 JSON이 무시됩니다.

---

## 이벤트별 의사결정 제어

### 이벤트별 결정 방식 요약

| 이벤트 | 결정 방식 | 필드 |
|--------|-----------|------|
| `PreToolUse` | `hookSpecificOutput.permissionDecision` | `allow`, `deny`, `ask` |
| `PostToolUse`, `Stop` | 최상위 `decision` | `block` |
| `PermissionRequest` | `hookSpecificOutput.decision.behavior` | `allow`, `deny` |
| `UserPromptSubmit` | `additionalContext` | 컨텍스트 텍스트 주입 |

### PreToolUse 결정 예시

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "성능을 위해 grep 대신 rg를 사용하세요"
  }
}
```

### Stop 차단 예시

```json
{
  "decision": "block",
  "reason": "아직 완료되지 않은 작업이 있습니다"
}
```

### UserPromptSubmit 컨텍스트 주입 예시

```json
{
  "additionalContext": "사용자는 현재 결제 모듈을 개발 중입니다. 보안 관련 주의사항을 항상 언급하세요."
}
```

---

## 훅 핸들러 필드

### command 타입 (기본)

```json
{
  "type": "command",
  "command": "path/to/script.sh",
  "timeout": 30
}
```

| 필드 | 설명 |
|------|------|
| `type` | `"command"` |
| `command` | 실행할 쉘 명령어 |
| `timeout` | 타임아웃 (초, 기본값: 600초) |

### http 타입

```json
{
  "type": "http",
  "url": "https://api.example.com/hooks",
  "headers": {
    "Authorization": "Bearer $MY_TOKEN"
  },
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 30
}
```

| 필드 | 설명 |
|------|------|
| `type` | `"http"` |
| `url` | POST 요청을 보낼 URL |
| `headers` | 요청 헤더 (환경변수 `$VAR` 지원) |
| `allowedEnvVars` | 헤더에서 확장할 환경변수 목록 |
| `timeout` | 타임아웃 (초, 기본값: 30초) |

HTTP 응답은 command 훅과 동일한 JSON 형식을 사용합니다. HTTP 상태 코드만으로는 작업을 차단할 수 없습니다.

> **주의**: HTTP 훅은 `/hooks` 인터랙티브 메뉴로는 추가할 수 없고, 설정 JSON을 직접 편집해야 합니다.

### prompt 타입 (프롬프트 기반 훅)

```json
{
  "type": "prompt",
  "prompt": "모든 작업이 완료되었는지 확인하세요. 완료되지 않았다면 {\"ok\": false, \"reason\": \"이유\"}로 응답하세요.",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

모델이 반환하는 형식:
```json
{ "ok": true }
// 또는
{ "ok": false, "reason": "완료되지 않은 이유" }
```

### agent 타입 (에이전트 기반 훅)

```json
{
  "type": "agent",
  "prompt": "모든 단위 테스트가 통과하는지 확인하세요.",
  "timeout": 120
}
```

에이전트 훅의 특징:
- 기본 타임아웃: 60초
- 최대 50번 도구 사용 가능
- 파일 읽기, 코드 검색, 명령 실행 등 가능
- prompt 훅과 동일한 `"ok"` / `"reason"` 응답 형식

---

## MCP 도구 훅

MCP 도구는 `mcp__<서버명>__<도구명>` 형식의 이름을 사용합니다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__github__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"GitHub 도구 호출됨: $(jq -r '.tool_name')\" >&2"
          }
        ]
      }
    ]
  }
}
```

MCP 도구 매처 예시:

| 매처 패턴 | 일치하는 도구 |
|-----------|--------------|
| `mcp__github__.*` | github 서버의 모든 도구 |
| `mcp__.*__write.*` | 모든 서버의 write로 시작하는 도구 |
| `mcp__filesystem__read_file` | filesystem 서버의 read_file 도구 정확히 일치 |

---

## 스킬 및 에이전트 내 훅

스킬과 에이전트의 프론트매터에서 훅을 정의할 수 있습니다.

```yaml
---
name: my-skill
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "echo 'File edited' >> /tmp/edit-log.txt"
---
```

이 훅은 스킬 또는 에이전트가 활성화된 동안에만 실행됩니다.

---

## 환경 변수 지속

`SessionStart` 훅에서 `CLAUDE_ENV_FILE`로 환경 변수를 세션 전체에 유지할 수 있습니다.

```bash
#!/bin/bash
echo "CURRENT_SPRINT=auth-refactor" >> "$CLAUDE_ENV_FILE"
echo "DB_ENV=staging" >> "$CLAUDE_ENV_FILE"
```

---

## 비동기 훅

`WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded` 이벤트는 비동기로 실행됩니다. 이 훅들은 Claude Code의 처리를 차단하지 않고 병렬로 실행됩니다. 따라서 이 훅의 결정 출력은 무시됩니다.

---

## 예시 케이스

<div class="example-case">
<strong>케이스 1: 특정 파일 패턴 보호 + 로깅</strong>

**상황**: `.env.*` 패턴의 파일은 절대로 수정하면 안 되고, 시도할 때마다 로그를 남기고 싶습니다.

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" =~ \.env ]]; then
  echo "$(date): 보호된 파일 수정 시도 차단: $FILE_PATH" >> ~/security-audit.log
  echo "환경 파일은 수정할 수 없습니다. 필요하다면 직접 편집하세요." >&2
  exit 2
fi

exit 0
```

</div>

<div class="example-case">
<strong>케이스 2: 프롬프트 자동 보강</strong>

**상황**: 모든 프롬프트에 현재 날짜와 브랜치 정보를 자동으로 추가하고 싶습니다.

```bash
#!/bin/bash
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
DATE=$(date +"%Y-%m-%d")

echo "{\"additionalContext\": \"현재 날짜: $DATE, Git 브랜치: $BRANCH\"}"
exit 0
```

이 훅을 `UserPromptSubmit` 이벤트에 등록하면 Claude가 항상 현재 날짜와 브랜치를 알게 됩니다.

</div>

<div class="example-case">
<strong>케이스 3: 세션 종료 시 정리 작업</strong>

**상황**: Claude Code 세션이 `/clear`로 초기화될 때 임시 파일을 자동으로 삭제하고 싶습니다.

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "rm -f /tmp/claude-scratch-*.txt && echo '임시 파일 정리 완료' >&2"
          }
        ]
      }
    ]
  }
}
```

</div>

---

## 보안 고려사항

- 훅은 쉘 명령어를 실행하므로, 외부에서 입력받은 데이터를 명령어에 직접 삽입하지 마세요 (쉘 인젝션 위험).
- 신뢰할 수 없는 소스의 훅 설정을 팀 저장소에 커밋하기 전 반드시 검토하세요.
- HTTP 훅의 `allowedEnvVars`에 필요한 환경변수만 명시적으로 등록하세요.
- `PreToolUse` 훅에서 차단하는 것이 `PostToolUse` 훅에서 되돌리려는 것보다 안전합니다 (이미 실행된 후에는 되돌릴 수 없음).
