---
title: "슬래시 명령어"
description: "Claude Code에서 사용 가능한 주요 명령어들"
order: 2
tags: ["명령어", "기본"]
---

## 어디서 입력하나?

슬래시(/) 명령어는 모두 Claude Code 대화창에서 입력합니다.

**따라하기:**
1. 터미널(명령 프롬프트)을 연다
2. `claude` 를 입력하여 Claude Code를 실행
3. Claude Code 대화창이 나타남 (`>` 표시가 보임)
4. 여기서 `/model`, `/compact` 등 슬래시 명령어를 입력

주의: 일반 터미널에서 `/model`을 치면 안 됨!
반드시 Claude Code가 실행된 상태에서 입력해야 함

<div class="example-case">

비유: 카카오톡 채팅창에서 명령어를 치는 것
카카오톡을 먼저 열어야 메시지를 보낼 수 있듯이
Claude Code를 먼저 실행해야 명령어를 쓸 수 있음
</div>

## 핵심 명령어

| 명령어 | 설명 | 비유 |
|--------|------|------|
| `/help` | 도움말 | 사용 설명서 열기 |
| `/model` | 모델 전환 (Opus/Sonnet/Haiku) | 전문가 교체 |
| `/fast` | 빠른 모드 토글 | 같은 사람이 빠르게 일하기 |
| `/compact` | 대화 내용 압축 | 긴 회의록을 요약본으로 줄이기 |
| `/clear` | 대화 초기화 (별칭: `/reset`, `/new`) | 새 종이에 처음부터 다시 쓰기 |
| `/init` | CLAUDE.md 생성 | 새 직원에게 업무 매뉴얼 만들어주기 |
| `/memory` | CLAUDE.md 편집 및 자동 메모리 관리 | 업무 매뉴얼 수정하기 |
| `/context` | 컨텍스트 사용량 시각화 | 메모리 잔량 확인 |
| `/doctor` | 설치 상태 진단 | 건강 검진 |

## 전체 명령어 목록

위 핵심 명령어 외에도 다양한 명령어가 있습니다. `/`를 입력하면 사용 가능한 모든 명령어가 표시됩니다.

### 세션 관리

| 명령어 | 설명 |
|--------|------|
| `/resume` | 이전 대화 재개 (별칭: `/continue`) |
| `/rename` | 현재 세션 이름 변경 |
| `/fork` | 현재 대화를 이 시점에서 분기 |
| `/rewind` | 이전 체크포인트로 되돌리기 (별칭: `/checkpoint`) |
| `/export` | 현재 대화를 텍스트로 내보내기 |
| `/cost` | 토큰 사용 통계 보기 |
| `/exit` | CLI 종료 (별칭: `/quit`) |

### Git & 코드 작업

| 명령어 | 설명 |
|--------|------|
| `/diff` | 아직 저장(커밋)하지 않은 변경 내역 보기 |
| `/pr-comments` | GitHub에 올린 코드 리뷰 댓글 가져오기 |
| `/security-review` | 현재 코드의 보안 취약점 분석 |

### 설정 및 구성

| 명령어 | 설명 |
|--------|------|
| `/config` | 설정 인터페이스 열기 (별칭: `/settings`) |
| `/permissions` | 권한 보기/수정 (별칭: `/allowed-tools`) |
| `/hooks` | 훅(Hook) 설정 관리 |
| `/theme` | 색상 테마 변경 |
| `/vim` | Vim 편집 모드 켜기/끄기 |

### 도구 및 확장

| 명령어 | 설명 |
|--------|------|
| `/mcp` | MCP 서버 연결 관리 |
| `/skills` | 사용 가능한 스킬 목록 |
| `/agents` | 에이전트 설정 관리 |
| `/plugin` | 플러그인 관리 |

### 유틸리티

| 명령어 | 설명 |
|--------|------|
| `/btw` | 대화 기록에 남기지 않는 빠른 질문 |
| `/plan` | 계획 모드로 직접 진입 |
| `/copy` | 마지막 응답을 클립보드에 복사 |
| `/insights` | 세션 분석 리포트 생성 |
| `/login` / `/logout` | 계정 로그인/로그아웃 |
| `/loop` | 주기적 반복 작업 설정 ([상세 가이드](/workflow/loop)) |

### /model - 모델 전환

Opus, Sonnet, Haiku 등 여러 모델 사이를 전환합니다.
작업 난이도에 따라 적절한 모델을 선택하면 비용과 속도를 최적화할 수 있습니다.
모델 상세 정보는 [모델 선택 가이드](/basics/model-guide)를 참고하세요.

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">Tailwind CSS가 뭔지 설명해줘</span>"
→ `/model` 입력 → 목록에서 Sonnet 선택 → 질문
이유: 단순 개념 설명은 주니어도 잘 함. 빠르고 저렴.

"<span class="keyword-highlight">쇼핑몰의 결제 흐름을 설계하고 전체 구조를 잡아줘</span>"
→ `/model` 입력 → 목록에서 Opus 선택 → 질문
이유: 여러 화면에 걸친 복잡한 설계는 시니어가 필요.

비유: 택배 보내기만 할 때는 주니어 직원이면 충분하지만,
연간 사업 전략을 짤 때는 시니어가 필요한 것과 같음
</div>

**주의: `/model` 설정은 계정 전역에 적용됩니다**

Cursor를 여러 창 열어서 A, B, C, D 프로젝트를 동시에 진행하더라도
모델 설정은 프로젝트별로 분리되지 않습니다.

B 프로젝트에서 `/model` → Opus를 선택하면
→ A, C, D 프로젝트에도 동일하게 opus가 적용됨

이유: `/model` 설정은 `~/.claude/settings.json`에 저장되며
계정(사용자) 단위로 관리되기 때문

실용 팁:
- 고도화 작업이 끝나면 `/model` → Sonnet으로 다시 돌려놓는 습관을 들이기
- 모든 창에서 현재 어떤 모델인지 인지하고 작업하기

### /fast - 빠른 모드

같은 모델을 사용하되 출력 속도를 높입니다. 모델이 바뀌는 게 아닙니다.

**예시 케이스:**

<div class="example-case">

간단한 수정을 연속으로 할 때
→ `/fast` 켜고 작업 (빠르게 처리)

"<span class="keyword-highlight">제목 바꿔줘</span>" → "<span class="keyword-highlight">색상 바꿔줘</span>" → "<span class="keyword-highlight">여백 넓혀줘</span>"

복잡한 구조를 설계할 때
→ `/fast` 끄고 작업 (깊이 생각해야 함)

비유: 같은 직원에게 "빨리빨리 모드"를 켜는 것.
단순 작업엔 좋지만, 중요한 보고서 쓸 때는 꺼야 함
</div>

### /compact - 대화 내용 압축

대화가 길어져서 Claude가 이전 내용을 잊어버릴 때 사용합니다.

**예시 케이스:**

<div class="example-case">

1시간 동안 대화하다가 Claude가 처음에 합의한 내용을 잊어버릴 때:
→ 중요한 결정사항을 CLAUDE.md에 먼저 적어두기
→ `/compact` 입력
→ Claude가 이전 대화를 요약하고 이어서 작업

비유: 긴 회의 중에 "여기까지 정리하면..." 하고
요약한 뒤 이어서 진행하는 것.
단, 세부사항은 날아갈 수 있으니 중요한 건 메모 먼저!
</div>

### /clear - 대화 초기화

현재 대화를 완전히 지우고 새 대화를 시작합니다.
`/compact`가 "요약 후 이어가기"라면, `/clear`는 "백지에서 다시 시작"입니다.

**`/compact`와의 차이:**

| | `/compact` | `/clear` |
|---|-----------|----------|
| 이전 대화 | 요약해서 유지 | 완전히 삭제 |
| 언제 | 같은 작업을 이어갈 때 | 완전히 다른 작업을 시작할 때 |
| 비유 | 회의록 요약 후 이어가기 | 새 회의 시작 |

**예시 케이스:**

<div class="example-case">

상황: 로그인 기능 작업을 끝내고, 이제 완전히 다른 결제 기능을 시작하려 함
→ `/clear` 입력
→ 이전 대화 내용이 깨끗하게 사라짐
→ "결제 기능을 만들자"라고 새로 시작

비유: 칠판을 깨끗이 지우고 새 수업을 시작하는 것
</div>

<div class="example-case">

상황: Claude가 이상한 방향으로 꼬여서 수습이 안 될 때
→ `/clear` 입력
→ 처음부터 깔끔하게 다시 요청

비유: 엉킨 실을 풀려고 하기보다 새 실로 시작하는 것
</div>

### /init - 프로젝트 설정 파일 생성

프로젝트 폴더에 `CLAUDE.md` 파일을 만들어줍니다.
`CLAUDE.md`는 Claude에게 "이 프로젝트에서는 이렇게 일해줘"라고 알려주는 설정 파일입니다.

**예시 케이스:**

<div class="example-case">

상황: 새 프로젝트를 시작했는데 Claude가 영어로 커밋 메시지를 쓰고, 코드 스타일도 제각각임
→ `/init` 입력
→ Claude가 프로젝트 구조를 분석하고 CLAUDE.md 초안을 작성
→ "커밋 메시지는 한국어로", "Tailwind CSS 사용" 같은 규칙을 추가

비유: 새 직원이 왔을 때 "<span class="keyword-highlight">우리 회사는 이렇게 일해요</span>"
업무 매뉴얼을 만들어주는 것
</div>

<div class="example-case">

상황: 팀원이 만든 프로젝트를 이어받았는데 Claude가 기존 규칙을 모름
→ `/init` 입력
→ 기존 코드 패턴을 분석해서 규칙 초안 생성
→ 필요한 부분 수정 후 저장

비유: 전임자 인수인계서를 Claude에게 건네주는 것
</div>

### /memory - CLAUDE.md 편집

`/memory`를 입력하면 **어떤 CLAUDE.md를 편집할지 선택 화면**이 나타납니다.

```
? Select a memory file to edit
> Project CLAUDE.md       (.claude/CLAUDE.md)
  User CLAUDE.md          (~/.claude/CLAUDE.md)
  Project local CLAUDE.md (.claude/CLAUDE.local.md)
  Toggle auto memory      (currently: on)
```

**각 파일의 역할과 적용 범위:**

| 선택지 | 파일 위치 | 적용 범위 | git 포함 |
|--------|-----------|-----------|----------|
| **Project CLAUDE.md** | `프로젝트/.claude/CLAUDE.md` | 이 프로젝트에서만 | O (팀 공유) |
| **User CLAUDE.md** | `~/.claude/CLAUDE.md` | 내 모든 프로젝트 | X |
| **Project local** | `프로젝트/.claude/CLAUDE.local.md` | 이 프로젝트에서만 | X (개인용) |

Claude는 대화 시작 시 위 파일을 **모두 읽습니다**. 여러 곳에 규칙이 있으면 합쳐서 적용됩니다.

**예시 케이스:**

<div class="example-case">

**User CLAUDE.md** (모든 프로젝트에 적용하고 싶은 규칙)
→ `/memory` → User CLAUDE.md 선택
→ "<span class="keyword-highlight">기본 응답 언어: 한국어</span>" 추가
→ 어떤 프로젝트를 열든 항상 한국어로 답변

비유: 회사 전체 규정 — "모든 부서는 보고서를 한국어로 작성할 것"
</div>

<div class="example-case">

**Project CLAUDE.md** (이 프로젝트에서만 적용, 팀원과 공유)
→ `/memory` → Project CLAUDE.md 선택
→ "<span class="keyword-highlight">Tailwind CSS 사용, any 타입 금지</span>" 추가
→ 이 프로젝트에서만 적용. 다른 프로젝트엔 영향 없음
→ git에 포함되므로 팀원도 같은 규칙 적용받음

비유: 마케팅팀 전용 규칙 — "이 프로젝트는 이 디자인 시스템을 쓸 것"
</div>

<div class="example-case">

**Project local CLAUDE.md** (나만의 개인 설정, git 제외)
→ `/memory` → Project local CLAUDE.md 선택
→ "<span class="keyword-highlight">커밋 메시지는 한국어로, 모델 전환 시 안내해줘</span>" 추가
→ 나에게만 적용. 팀원에게는 보이지 않음

비유: 내 책상 위 포스트잇 — 팀 규칙은 아니지만 나만의 작업 습관
</div>

<div class="example-case">

**실전 조합 예시:**

User CLAUDE.md: "한국어 응답, 모델 자동 전환 안내"
Project CLAUDE.md: "Tailwind CSS, shadcn/ui, any 금지"
Project local: "커밋 메시지 한국어, 테스트 전 확인받기"

→ Claude는 세 파일을 모두 읽고 합쳐서 적용
→ 글로벌 규칙 + 프로젝트 규칙 + 개인 규칙이 동시에 작동

비유: 회사 규정 + 팀 규칙 + 내 메모가 모두 합쳐져서
내가 일하는 방식이 결정되는 것
</div>

### /context - 컨텍스트 사용량 확인

현재 대화가 Claude의 기억 용량을 얼마나 차지하고 있는지 시각적으로 보여줍니다.
컨텍스트가 가득 차면 이전 내용을 잊기 시작하므로, 적절한 시점에 `/compact`나 `/clear`를 할 수 있습니다.

**예시 케이스:**

<div class="example-case">

상황: 오래 대화했는데 Claude가 아까 말한 걸 자꾸 잊어버림
→ `/context` 입력
→ 색깔 격자로 사용량이 표시됨 (거의 꽉 차 있음!)
→ `/compact`로 압축하거나 `/clear`로 새로 시작

비유: 스마트폰 저장공간 확인
"<span class="keyword-highlight">128GB 중 120GB 사용 중</span>" → 정리가 필요한 시점
</div>

### /doctor - 설치 상태 진단

Claude Code가 제대로 설치되어 있는지, MCP 서버 연결은 정상인지 등을 검사합니다.
뭔가 이상하게 동작할 때 가장 먼저 시도해볼 명령어입니다.

**예시 케이스:**

<div class="example-case">

상황: MCP로 GitHub을 연결했는데 자꾸 "연결 실패" 오류가 남
→ `/doctor` 입력
→ Claude Code가 설치 상태, MCP 연결, 권한 등을 점검
→ "<span class="keyword-highlight">GitHub MCP 서버: 인증 토큰 만료됨</span>" 같은 진단 결과 표시
→ 안내에 따라 재인증하면 해결

비유: 컴퓨터가 이상할 때 "<span class="keyword-highlight">진단 프로그램</span>" 돌리는 것
자동으로 문제를 찾아서 알려줌
</div>

