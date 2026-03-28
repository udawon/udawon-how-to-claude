---
date: "2026-03-27"
title: ".claude 폴더 완전 해부: 폴더 하나로 Claude Code를 10배 강력하게"
description: "대부분의 사람들이 한 번도 열어보지 않는 .claude 폴더의 모든 것 — 프로젝트/홈 디렉토리 차이, CLAUDE.md 라우터 전략, commands/rules/skills/agents/settings/hooks 구조와 실전 활용법"
order: 34
tags: ["설정", "연동", "활용법", "워크플로우", "youtube"]
source_url: "https://www.youtube.com/watch?v=oYIXe6aqh_U"
---

## 이게 뭔가요?

Claude Code 프로젝트마다 `.claude`라는 숨겨진 폴더가 있습니다. 대부분의 사람들은 한 번도 열어보지 않아요. 그런데 이 폴더 하나가 Claude가 **무엇을 기억하는지**, **무엇을 할 수 있는지**, **어떤 규칙을 따르는지**를 전부 결정합니다.

비유하면 이래요:

> **일반 직원** = 매번 새로 출근해서 "오늘 뭐 해요?"라고 묻는 아르바이트생.
> **.claude 폴더를 잘 세팅한 Claude** = 회사 매뉴얼, 내 업무 스타일, 자주 쓰는 단축키까지 다 외운 전문 어시스턴트.

## 왜 알아야 하나요?

이 폴더를 모르고 Claude Code를 쓰면:

- 매 세션마다 같은 맥락을 반복해서 설명해야 함
- 팀과 같은 설정을 공유할 방법이 없음
- Claude가 "왜 이렇게 행동하는지" 이유를 알 수 없음
- 자동화할 수 있는 반복 작업을 매번 수동으로 해야 함

`.claude` 폴더 구조를 이해하면 Claude Code가 내 설정에 맞게 동작하는 **나만의 AI 도구**가 됩니다.

## 두 가지 .claude 폴더

`.claude` 폴더는 두 군데에 있습니다.

| 위치 | 용도 | 특징 |
|------|------|------|
| **프로젝트 폴더 안** (`.claude/`) | 프로젝트 전용 규칙·명령·스킬·에이전트 | 팀과 공유 가능, GitHub에 올릴 수 있음 |
| **홈 디렉토리** (`~/.claude/`) | 개인 환경설정, 전 세션 메모리 | 개인 전용, 공유 비권장 |

**핵심 차이:**

- **프로젝트 `.claude`** = 이 프로젝트에서 일하는 방식. 팀 공유용. 민감 정보 없음.
- **`~/.claude`** = 내 개인 취향. 시간대, 개인 단축키, 세션 메모리 Markdown(.md) 파일들. 나만 보는 것.

```
# 현재 프로젝트 .claude 폴더 내용 확인
! ls .claude/

# 홈 디렉토리 .claude 폴더 내용 확인
! ls ~/.claude/
```

`!` (느낌표)를 입력하면 Claude Code가 bash(배시) 모드로 전환되어 터미널 명령을 바로 실행할 수 있습니다.

## .claude 폴더 내부 구조

```
📁 .claude/
├── CLAUDE.md              ← Claude가 매 세션 자동으로 읽는 핵심 파일
├── CLAUDE.local.md        ← 개인 오버라이드 (git에 올라가지 않음)
├── settings.json          ← 허용/차단 명령어, 권한 설정
├── settings.local.json    ← 개인 권한 오버라이드
├── commands/              ← 슬래시 명령어 정의
├── rules/                 ← 행동 규칙
├── skills/                ← 재사용 가능한 스킬
└── agents/                ← 전용 서브에이전트 정의
```

## CLAUDE.md — 라우터로 써야 한다

CLAUDE.md는 Claude Code가 **매 세션 자동으로 주입**하는 파일입니다. 가장 중요한 파일이지만, 잘못 쓰는 사람이 많아요.

**흔한 실수**: CLAUDE.md를 백과사전처럼 길게 쓰는 것.

**올바른 사용법**: **라우터(router)** 또는 **항공 관제탑**처럼 쓰기.

> "CLAUDE.md는 라우터여야 합니다. 백과사전이 아닙니다."

50줄 정도면 충분합니다. 담을 내용:

- 빌드 명령어 (자주 쓰는 것만)
- 아키텍처 선호 사항
- 주의사항 (과거에 실수한 것)
- 기억할 약속 (이하도 이상도 아닌 것)

**CLAUDE.local.md** — 개인 오버라이드용. 팀과 공유하는 저장소(repository)에는 올라가지 않도록 `.gitignore`에 수동으로 추가해야 합니다. (참고: `.claude/settings.local.json`은 Claude Code가 생성 시 자동으로 `.gitignore` 처리해줍니다.)

```bash
# CLAUDE.md 전체 내용 보기
! cat CLAUDE.md

# CLAUDE.md 길이(줄 수) 확인
! wc -l CLAUDE.md
```

## commands — 슬래시 명령어 만들기

`commands/` 폴더에 파일을 넣으면 터미널에서 `/파일이름`으로 실행할 수 있는 슬래시 명령어가 됩니다.

```
📁 commands/
└── process-meeting.md
```

`process-meeting.md` 내용 예시:
```
description: Fireflies에서 회의 트랜스크립트를 가져와 처리
argument_hint: latest

1. Fireflies API에서 최신 회의 트랜스크립트 가져오기
2. 액션 아이템 추출
3. 확신도 7 미만 항목에 플래그 달기
4. 요약본 생성
```

이렇게 하면 터미널에서 `/process-meeting latest`라고 입력하면 바로 실행됩니다.

## rules — 행동 규칙 파일

`rules/` 폴더는 Claude의 행동 방식을 정하는 규칙들을 담습니다.

예시 활용:
- 이메일 초안은 항상 글머리 기호(bullet)로 작성
- 액션 아이템은 담당자 + 마감일 포함
- 응답은 한국어로

CLAUDE.md가 넘쳐날 것 같으면 rules 파일로 분리해서 관리하면 됩니다.

## skills vs agents — 뭐가 다른가?

| 항목 | 스킬 (skills) | 에이전트 (agents) |
|------|-------------|-----------------|
| 특징 | 특정 도메인에서만 호출 가능 설정 가능 | 어디서든 호출, 단순 구조 |
| 모델 지정 | 불가 | 가능 (Sonnet, Haiku 등 명시) |
| 주 용도 | 복잡한 워크플로우 재사용 | 반복적으로 쓰는 전문 역할 정의 |

**에이전트 예시:**

```json
{
  "name": "meeting-analyst",
  "description": "회의 트랜스크립트를 분석하고 인사이트를 추출하는 전문 에이전트",
  "model": "claude-sonnet-4-6",
  "tools": ["read", "write"]
}
```

```json
{
  "name": "security-auditor",
  "description": "보안 취약점을 검사하는 전문 에이전트",
  "model": "claude-haiku-4-5",
  "tools": ["read", "bash"]
}
```

> **팁**: 트랜스크립트 분석처럼 "스마트하지만 파워가 많이 필요 없는 작업"은 Sonnet, 빠른 반복 검사는 Haiku로 지정하면 비용을 절감할 수 있습니다.

## settings.json — 권한 설정

Claude Code가 실행할 수 있는 명령어와 없는 명령어를 정의하는 파일입니다.

처음 Claude Code를 쓸 때 "이걸 허용할까요?"라는 질문에 "예"라고 누를 때마다, Claude가 **자동으로 settings.json에 기록**합니다. 좋은 학생처럼요.

```bash
# 현재 settings.json 내용 전체 보기
! cat .claude/settings.json
```

**세 가지 권한 레벨:**

| 레벨 | 의미 | 예시 |
|------|------|------|
| **항상 허용** | 물어보지 않고 바로 실행 | `git status`, `npm install` |
| **확인 필요** | 실행 전 승인 요청 | 파일 삭제, 외부 API 호출 |
| **항상 차단** | 절대 실행 안 함 | 프로덕션 DB 직접 수정 |

**settings.local.json**: 팀 공유 settings.json을 개인적으로 오버라이드하고 싶을 때 씁니다.

## hooks — 도구 실행 전후 자동 동작

Hooks(훅)는 Claude가 특정 도구를 실행하기 **전이나 후**에 자동으로 실행되는 명령어입니다. settings.json 안에 설정합니다.

```json
{
  "allowedTools": [...],
  "hooks": {
    "preToolUse": [
      {
        "matcher": "write",
        "command": "echo 'Writing to file...' && cat .env | grep -c KEY"
      }
    ]
  }
}
```

**주요 hook 타입:**

- `preToolUse` — 도구 실행 전 (예: .env 파일 보호)
- `postToolUse` — 도구 실행 후 (예: 테스트 자동 실행)

전체 hook 이벤트 목록을 확인하려면:

```
@Claude Code Agent Guide 사용 가능한 모든 hook 이벤트를 나열해줘
```

## 실전 워크플로우 예시: 회의 자동화 시스템

`.claude` 폴더의 모든 요소가 어떻게 연결되는지 보여주는 예시입니다.

```mermaid
flowchart TD
    A[회의 발생\nFireflies 녹화] --> B[/process-meeting latest\n슬래시 명령어 실행]
    B --> C[transcript-processor.md\n자막 로드]
    C --> D{액션 아이템\n발견?}
    D -->|Yes| E[action-tracker\n스킬 호출]
    E --> F[auto-followup\n스킬 호출]
    F --> G[Supabase\n저장]
    D -->|No| G

    style A fill:#2d3748,color:#fff
    style B fill:#4a5568,color:#fff
    style C fill:#4a5568,color:#fff
    style D fill:#553c9a,color:#fff
    style E fill:#2c5282,color:#fff
    style F fill:#2c5282,color:#fff
    style G fill:#276749,color:#fff
```

이 시스템에서:
- **CLAUDE.md** → 전체 흐름 라우팅
- **commands/** → `/process-meeting` 슬래시 명령어
- **rules/** → 이메일 형식, 액션 아이템 구조 규칙
- **skills/** → action-tracker, auto-followup 재사용 스킬
- **settings.json** → Fireflies API 호출 허용, DB 직접 수정 차단

## 자주 쓰는 bash 단축 명령어 모음

```bash
# 프로젝트 .claude 폴더 내용 보기
! ls .claude/

# 홈 디렉토리 .claude 폴더 내용 보기
! ls ~/.claude/

# CLAUDE.md 전체 내용 출력
! cat CLAUDE.md

# CLAUDE.md 줄 수 확인 (50줄 이내 권장)
! wc -l CLAUDE.md

# settings.json 전체 보기
! cat .claude/settings.json

# 에이전트 파일 여러 개 동시에 보기
! cat .claude/agents/meeting-analyst.json .claude/agents/security-auditor.json
```

> `!` 다음에 명령어를 입력하면 Claude Code 터미널에서 바로 bash 명령이 실행됩니다. 크레딧을 쓰지 않고 빠르게 확인할 수 있어요.

## 핵심 정리

| 파일/폴더 | 한 줄 요약 |
|----------|----------|
| `CLAUDE.md` | 매 세션 자동 주입되는 핵심 지침 (50줄 이내, 라우터 역할) |
| `CLAUDE.local.md` | 개인 오버라이드 (.gitignore로 git 제외 필요) |
| `settings.json` | 허용/차단 도구 목록 |
| `settings.local.json` | 개인 권한 오버라이드 |
| `commands/` | 슬래시 명령어 정의 |
| `rules/` | Claude 행동 규칙 |
| `skills/` | 재사용 가능한 워크플로우 |
| `agents/` | 모델 지정 가능한 전용 서브에이전트 |
| `hooks` | settings.json 안에서 도구 실행 전/후 자동 명령 |
