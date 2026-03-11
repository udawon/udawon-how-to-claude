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
| `/model` | 모델 전환 (Opus/Sonnet) | 전문가 교체 (시니어/주니어) |
| `/fast` | 빠른 모드 토글 | 같은 사람이 빠르게 일하기 |
| `/compact` | 대화 내용 압축 | 긴 회의록을 요약본으로 줄이기 |
| `/clear` | 대화 초기화 (새 대화 시작) | 새 종이에 처음부터 다시 쓰기 |
| `/init` | 프로젝트 설정 파일(CLAUDE.md) 생성 | 새 직원에게 업무 매뉴얼 만들어주기 |
| `/memory` | CLAUDE.md 편집 및 자동 메모리 관리 | 업무 매뉴얼 수정하기 |
| `/context` | 컨텍스트 사용량 시각화 | 메모리 잔량 확인 |
| `/doctor` | 설치 상태 진단 | 건강 검진 |

### /model - 모델 전환

Opus(시니어)와 Sonnet(주니어) 사이를 전환합니다.
작업 난이도에 따라 적절한 모델을 선택하면 비용과 속도를 최적화할 수 있습니다.

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

`CLAUDE.md`를 직접 열어서 편집할 수 있습니다.
Claude에게 주는 지침을 추가, 수정, 삭제할 때 사용합니다.

**예시 케이스:**

<div class="example-case">

상황: Claude가 매번 영어로 주석을 달아서 한국어로 바꾸고 싶음
→ `/memory` 입력
→ 에디터에서 CLAUDE.md가 열림
→ "<span class="keyword-highlight">코드 주석은 반드시 한국어로 작성</span>" 규칙 추가
→ 저장하면 이후 모든 대화에 적용

비유: 업무 매뉴얼에 새 규칙을 추가하는 것
"앞으로 보고서는 한글로 쓸 것"
</div>

<div class="example-case">

상황: 프로젝트 기술 스택이 바뀌어서 설정을 업데이트하고 싶음
→ `/memory` 입력
→ 기존 "CSS: styled-components" → "<span class="keyword-highlight">CSS: Tailwind CSS</span>"로 수정
→ 저장 후 Claude가 새 규칙에 맞게 작업

비유: 회사 내규가 바뀌어서 매뉴얼을 수정하는 것
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

