---
date: "2026-03-20"
title: "Hooks — Claude Code가 알아서 움직이게 만드는 자동화 기능"
description: "Claude Code의 Hooks 기능으로 파일 저장 시 자동 포맷팅, 위험한 명령 차단, 알림 받기 등을 설정하는 방법"
order: 1
tags: ["설정", "자동화", "활용법", "claude-docs"]
source_url: "https://code.claude.com/docs/en/hooks"
---

## 이게 뭔가요?

Hook(특정 시점에 자동 실행되는 기능)은 Claude Code가 **특정 행동을 할 때 자동으로 실행되는 명령어**입니다.

스마트홈을 생각해보세요. "현관문이 열리면 → 자동으로 조명 켜기", "밤 11시가 되면 → 자동으로 에어컨 끄기"처럼 **"이런 일이 일어나면 → 이렇게 해라"**를 미리 설정해두는 것과 같습니다.

Claude Code에서도 마찬가지입니다:
- **"Claude가 파일을 수정하면 → 자동으로 코드 정리"**
- **"Claude가 위험한 명령어를 실행하려 하면 → 차단"**
- **"Claude가 작업을 끝내면 → 알림 보내기"**

이런 것들을 한 번 설정해두면, 매번 수동으로 시키지 않아도 알아서 동작합니다.

## 왜 알아야 하나요?

**알면 좋은 점:**
- Claude Code가 파일을 수정할 때마다 **자동으로 코드 스타일을 맞춰줌** (사람이 일일이 확인할 필요 없음)
- 실수로 중요한 파일을 건드리는 것을 **자동으로 막아줌**
- Claude가 작업을 끝내면 **알림을 받을 수 있어서** 화면 앞에 앉아서 기다릴 필요 없음
- 팀 프로젝트에서 **모든 사람이 같은 규칙을 따르게** 강제할 수 있음

**모르면 불편한 점:**
- Claude가 코드를 수정할 때마다 직접 포맷팅을 실행해야 함
- 위험한 명령어를 실행해도 아무도 못 막음
- Claude가 작업이 끝났는지 터미널을 계속 쳐다봐야 함

## 어떻게 하나요?

### 방법 1: 알림 받기 (가장 쉬운 시작점)

Claude Code가 내 입력을 기다릴 때 알림을 보내주는 Hook입니다. 설정 파일에 아래 내용을 추가하면 됩니다.

**설정 파일 위치:**
- Mac/Linux: `~/.claude/settings.json` (홈 폴더 안의 `.claude` 폴더)
- Windows: `C:\Users\{사용자명}\.claude\settings.json`

**Mac 사용자:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code가 기다리고 있어요\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Windows 사용자:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -Command \"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Claude Code가 기다리고 있어요', 'Claude Code')\""
          }
        ]
      }
    ]
  }
}
```

설정 후 Claude Code에서 `/hooks`를 입력하면 등록된 Hook 목록을 확인할 수 있습니다.

<div class="example-case">
<strong>예시: 재택근무 중 멀티태스킹</strong>

마케팅팀 박대리는 Claude Code에게 보고서 데이터 정리를 시키고, 다른 업무를 하고 있습니다. Notification Hook을 설정해두면, Claude가 작업을 끝내거나 확인이 필요할 때 **바탕화면에 알림이 뜹니다**. 터미널을 계속 쳐다보지 않아도 됩니다.

</div>

### 방법 2: 파일 수정 후 자동 코드 정리

Claude가 파일을 수정(Edit)하거나 새로 만들(Write) 때마다 자동으로 Prettier(코드 정리 도구)를 실행합니다.

프로젝트 폴더 안의 `.claude/settings.json`에 추가:

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

여기서 `PostToolUse`는 "도구 사용 후"라는 뜻이고, `matcher`의 `"Edit|Write"`는 "Edit 또는 Write 도구를 사용했을 때만 실행해라"라는 필터입니다.

### 방법 3: 위험한 파일 수정 차단

`.env`(비밀번호 파일), `package-lock.json` 같은 중요한 파일을 Claude가 건드리지 못하게 막습니다.

`.claude/settings.json`에 추가:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

`PreToolUse`는 "도구 사용 전"이라는 뜻입니다. Claude가 파일을 수정하기 **전에** 먼저 검사해서, 위험한 파일이면 차단합니다.

<div class="example-case">
<strong>예시: 스타트업 개발팀 보안 규칙</strong>

김팀장은 `.env` 파일에 API(프로그램끼리 대화하는 통로) 키가 저장되어 있어서, Claude가 실수로 수정하면 서비스가 멈출 수 있습니다. PreToolUse Hook으로 `.env` 파일 수정을 차단해두면, Claude가 해당 파일을 수정하려 할 때 **자동으로 막히고** Claude에게 "이 파일은 수정할 수 없습니다"라는 피드백이 전달됩니다.

</div>

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 프리랜서 디자이너의 Claude Code 자동화 세팅</strong>

프리랜서 웹 디자이너 이수진씨는 Claude Code를 사용해 클라이언트 웹사이트를 만듭니다. 세 가지 Hook을 조합해서 사용합니다:

1. **Notification Hook** — Claude가 작업을 끝내면 Mac 알림으로 받아, Figma 작업을 하면서도 놓치지 않음
2. **PostToolUse Hook** — Claude가 CSS(웹 디자인 코드) 파일을 수정하면 자동으로 Prettier가 정리해줘서, 코드가 항상 깔끔함
3. **PreToolUse Hook** — 클라이언트 로고 파일과 브랜드 가이드라인 파일은 수정 차단

이렇게 한 번 설정해두면, 새 프로젝트를 시작할 때 `.claude/settings.json` 파일만 복사하면 같은 자동화가 바로 적용됩니다.

</div>

## Hook의 종류 한눈에 보기

Hook은 **"언제 실행되느냐"**에 따라 종류가 나뉩니다:

| 종류 | 언제 실행? | 대표 활용 |
|------|-----------|----------|
| **SessionStart** | 세션(작업)을 시작할 때 | 프로젝트 규칙 주입, 환경 설정 |
| **PreToolUse** | Claude가 도구를 쓰기 **전** | 위험한 명령 차단, 파일 보호 |
| **PostToolUse** | Claude가 도구를 쓴 **후** | 자동 포맷팅, 로그 기록 |
| **Notification** | Claude가 알림을 보낼 때 | 바탕화면 알림 |
| **Stop** | Claude가 응답을 끝냈을 때 | 작업 완료 확인, 추가 지시 |
| **PermissionRequest** | 권한 확인 창이 뜰 때 | 안전한 명령 자동 승인 |
| **ConfigChange** | 설정 파일이 바뀔 때 | 변경 기록, 무단 수정 차단 |

이 외에도 SubagentStart, SubagentStop, TeammateIdle, TaskCompleted, PreCompact, PostCompact 등 총 **21가지 이벤트**를 지원합니다.

## Hook의 4가지 타입

Hook이 **"어떻게 실행되느냐"**도 선택할 수 있습니다:

| 타입 | 설명 | 언제 사용? |
|------|------|-----------|
| **command** | 내 컴퓨터에서 명령어 실행 | 가장 기본. 파일 정리, 알림 등 |
| **http** | 외부 서버로 데이터 전송 | 팀 공유 로그, 외부 서비스 연동 |
| **prompt** | AI(프롬프트)에게 판단을 맡김 | "이 코드가 안전한가?" 같은 판단이 필요할 때 |
| **agent** | AI 에이전트(자율 실행 AI)가 검증 | 파일을 읽고 테스트를 돌려야 하는 복잡한 검증 |

## 설정 파일 위치와 범위

| 파일 위치 | 적용 범위 | 팀 공유 가능? |
|-----------|----------|-------------|
| `~/.claude/settings.json` | 내 모든 프로젝트 | 불가 (내 컴퓨터만) |
| `.claude/settings.json` | 해당 프로젝트만 | 가능 (Git 커밋 가능) |
| `.claude/settings.local.json` | 해당 프로젝트만 | 불가 (gitignore 대상) |

## 주의할 점

- **JSON(설정 파일 형식) 문법을 정확히 지켜야 합니다** — 쉼표 하나 빠져도 작동하지 않습니다. Claude에게 "이 Hook 설정 추가해줘"라고 말하면 대신 작성해줍니다.
- **Stop Hook은 무한 루프에 주의** — "작업이 끝나면 → 다시 작업해"라고 설정하면 끝없이 반복됩니다. `stop_hook_active` 값을 확인해서 이미 한 번 실행됐으면 멈추도록 해야 합니다.
- **Hook 스크립트의 출력은 JSON(데이터 교환 형식)만 가능** — 쉘 프로필(`.zshrc`, `.bashrc`)에 `echo` 문이 있으면 Hook의 JSON 출력에 섞여서 오류가 발생합니다.
- **PostToolUse Hook은 되돌리기 불가** — 도구가 이미 실행된 **후**에 동작하므로, 차단하려면 `PreToolUse`를 사용하세요.
- **`/hooks` 명령어로 항상 확인** — Hook이 제대로 등록됐는지 Claude Code 안에서 `/hooks`를 입력해 확인하세요.

## 정리

- Hook은 "이런 일이 생기면 → 이렇게 해라"를 미리 설정하는 **자동화 기능**입니다.
- 가장 쉬운 시작은 **Notification Hook**(알림)이고, 가장 유용한 것은 **PostToolUse**(자동 포맷팅)와 **PreToolUse**(위험 차단)입니다.
- 설정 파일(`settings.json`)에 한 번 적어두면 끝 — Claude에게 "Hook 설정해줘"라고 말해도 됩니다.

## 출처

- [Claude Code Hooks 공식 레퍼런스](https://code.claude.com/docs/en/hooks)
- [Claude Code Hooks 실전 가이드](https://code.claude.com/docs/en/hooks-guide)
