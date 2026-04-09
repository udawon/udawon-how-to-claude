---
title: "단축키 완전 가이드"
description: "Claude Code에서 사용 가능한 모든 단축키와 실전 활용법"
order: 4
tags: ["기본", "단축키", "키보드", "효율"]
---

## 핵심 단축키 한눈에 보기

| 단축키 | 기능 | 언제 쓰나 |
|--------|------|-----------|
| <kbd>Esc</kbd> | Claude 중단 (컨텍스트 유지) | 잘못된 방향으로 가고 있을 때 |
| <kbd>Esc</kbd> + <kbd>Esc</kbd> | Rewind 메뉴 열기 | 이전 상태로 돌아가고 싶을 때 |
| <kbd>Shift+Tab</kbd> | 모드 전환 순환 | 빠르게 모드를 바꿀 때 |
| <kbd>Ctrl+G</kbd> | 외부 편집기에서 입력 열기 | 긴 프롬프트나 플랜을 에디터에서 편집 |
| <kbd>Ctrl+O</kbd> | 상세 대화 기록 토글 | 도구 호출, 전체 출력 등 상세 로그 보기 |
| <kbd>Ctrl+B</kbd> | 현재 작업 백그라운드로 | 기다리지 않고 다른 작업 하고 싶을 때 |

### Mac / Windows 단축키가 다른 경우

| 기능 | Mac | Windows / Linux |
|------|-----|-----------------|
| Thinking 모드 토글 | <kbd>Cmd+T</kbd> | 기본 <kbd>Meta+T</kbd> → 아래 주의사항 참고 |
| 모델 선택기 열기 | <kbd>Cmd+P</kbd> | 기본 <kbd>Meta+P</kbd> → 아래 주의사항 참고 |
| 이미지 붙여넣기 | <kbd>Ctrl+V</kbd> | <kbd>Alt+V</kbd> |

> **Windows 사용자 주의:** `Meta` 키는 Windows에서 `Win` 키에 해당하지만, `Win+T`(작업 표시줄 전환)와 `Win+P`(디스플레이 설정)는 OS가 먼저 가로채기 때문에 **Claude Code에 전달되지 않습니다.** `/keybindings` 명령어로 직접 리바인딩해야 합니다.
>
> 추천 설정 예시:
> ```json
> {
>   "context": "Chat",
>   "bindings": {
>     "alt+t": "chat:thinkingToggle",
>     "alt+p": "chat:modelPicker"
>   }
> }
> ```

---

## Esc - 즉시 중단

Claude가 잘못된 방향으로 가고 있을 때 즉시 멈춥니다. 컨텍스트는 유지됩니다.

**예시 케이스:**

<div class="example-case">

나: "<span class="keyword-highlight">로그인 페이지 리디자인해줘</span>"
Claude: (로그인 페이지 전체를 갈아엎기 시작...)
나: (잠깐, 이건 너무 큰 변경인데...)
→ <kbd>Esc</kbd> 누름

나: "<span class="keyword-highlight">전체 리디자인 말고, 버튼 색깔만 바꿔줘</span>"
→ 이전 대화 내용은 그대로 유지된 채로 방향 수정

비유: 택시기사가 잘못된 길로 가고 있을 때

"잠깐, <span class="keyword-highlight">멈춰주세요</span>" 후 새 목적지 말하기
(택시 내리는 게 아님 - 컨텍스트 유지)
</div>

---

## Shift + Tab - 모드 전환

세 가지 모드를 순환합니다.

`[Normal]` → <kbd>Shift+Tab</kbd> → `[accept edits on]` → <kbd>Shift+Tab</kbd> → `[plan mode on]`

각 모드:
1. **Normal** (기본): 새로운 동작마다 허락을 구함
2. **Accept Edits**: 파일 편집(읽기·쓰기·수정)을 자동 허용
   - 화면 하단에 "⏵⏵ accept edits on" 표시
   - 터미널 명령어 실행 등은 여전히 물어봄
   - 빠르게 많은 파일을 수정할 때 유용
3. **Plan Mode**: 파일을 읽기만 하고 수정하지 않음
   - 화면 하단에 "⏸ plan mode on" 표시
   - 코드를 분석하고 계획을 세울 때 안전

**예시 케이스:**

<div class="example-case">

상황 1: 100개 파일에 걸친 <span class="keyword-highlight">변수명 일괄 변경</span>
→ Accept Edits 모드로 전환 후 실행
→ 파일 수정마다 일일이 "예" 누르는 시간 절약

상황 2: 새 기능 추가 전 기존 구조 파악
→ Plan Mode로 전환
→ "<span class="keyword-highlight">인증 관련 파일들이 어떻게 연결되는지 분석해줘</span>"
→ 실수로 파일이 수정될 걱정 없이 탐색

비유:
Accept Edits = "서류 수정은 알아서 해" (단, 돈 쓰는 건 물어봐)
Plan Mode = "일단 보고서만 읽어보고, 아무것도 건드리지 마"
</div>

---

## Ctrl + G - 외부 편집기에서 입력 편집

현재 입력 중인 프롬프트를 VS Code 등 외부 텍스트 에디터로 열어 편집합니다. 긴 프롬프트 작성, Plan Mode에서의 플랜 수정 등 다양한 상황에서 활용 가능합니다.

**사용 흐름:**

<div class="example-case">

1. 채팅 입력창에서 <kbd>Ctrl+G</kbd> 누름 → 에디터가 열림
2. 에디터에서 내용 작성 또는 수정
3. 저장하고 에디터를 닫으면 Claude 입력창에 내용 반영
</div>

**예시 케이스:**

<div class="example-case">

상황 1: Plan Mode에서 플랜 수정

Claude 플랜:
1. OAuth 라이브러리 설치
2. 구글 OAuth 설정
3. 페이스북 OAuth 설정 ← 이건 필요 없음
4. 테스트 작성

→ <kbd>Ctrl+G</kbd>로 열어서 "3. 페이스북 OAuth 설정" 삭제
→ 저장
→ Claude가 수정된 플랜대로 구현

상황 2: 복잡한 프롬프트 작성

→ 채팅창에 한 줄로 쓰기엔 요구사항이 많을 때
→ <kbd>Ctrl+G</kbd>로 에디터에서 여러 줄에 걸쳐 꼼꼼히 작성
→ 저장하면 그대로 전송

비유: 메모장에서 초안 작성한 뒤 메신저에 붙여넣기
</div>

---

## Ctrl + O - 상세 대화 기록 보기

Claude의 전체 동작 로그(도구 호출, 파일 읽기, 명령어 실행 등)를 상세하게 표시합니다.

활성화 시: 도구 호출 내용, 전체 출력, 중간 과정이 모두 표시됨
비활성화 시: 요약된 결과만 표시 (기본 상태)

**예시:**

<div class="example-case">

> "<span class="keyword-highlight">버그 원인이 뭔지 찾아줘</span>"

[<kbd>Ctrl+O</kbd> 활성화 상태]

`Read: src/auth/login.ts` (전체 파일 내용 표시)
`Grep: "user.name" in src/` (검색 결과 전체 표시)
`Bash: npm test` (테스트 출력 전체 표시)

**분석 결과:** user.name을 호출하기 전에 user가 존재하는지
확인하는 코드가 없어서 발생한 문제입니다.
</div>

**언제 유용한가:**
- Claude가 어떤 파일을 읽고 어떤 명령어를 실행했는지 확인할 때
- 도구 호출 결과가 생략 없이 전부 보고 싶을 때
- 디버깅 시 Claude가 어떤 경로로 문제를 추적하는지 따라갈 때

> **참고:** Thinking 모드(확장 사고)를 켜고 싶다면 <kbd>Cmd+T</kbd>(Mac)를 사용하세요. Windows에서는 `Win+T`가 OS에 의해 가로채이므로, `/keybindings`에서 별도 키(예: <kbd>Alt+T</kbd>)로 설정이 필요합니다. Ctrl+O와는 다른 기능입니다.

---

## Ctrl + B - 백그라운드로 전환

오래 걸리는 작업을 백그라운드로 보내고 다른 작업을 할 수 있습니다.

**예시 케이스:**

<div class="example-case">

나: "<span class="keyword-highlight">전체 테스트 실행하고 실패한 것 모두 고쳐줘</span>"
Claude: (작업 시작, 수분이 걸릴 예정)
→ <kbd>Ctrl+B</kbd> 누름
→ Claude가 백그라운드에서 계속 작업
→ 나는 다른 작업 진행

나중에 확인:
→ 작업 완료 알림이 오면 결과 확인

주의사항:
- 백그라운드 실행 중 Claude에게 질문하면 답변을 못 받을 수 있음
- 권한 요청이 필요하면 미리 승인해둬야 <span class="keyword-highlight">중단</span> 없이 진행

비유: 세탁기 돌려놓고 다른 집안일 하기
세탁이 끝나면 알람이 울림
</div>

---

## Esc + Esc (또는 /rewind) - 체크포인트로 되돌리기

> 자세한 내용은 [체크포인트 활용법](/docs/workflow/checkpoint-rewind) 참고

**빠른 사용법:**
1. <kbd>Esc</kbd>를 두 번 빠르게 누름
2. Rewind 메뉴가 열림
3. 선택:
   - <span class="keyword-highlight">코드 + 대화 모두 되돌리기</span>
   - <span class="keyword-highlight">대화만 되돌리기</span>
   - <span class="keyword-highlight">코드만 되돌리기</span>
   - 해당 시점부터 요약
   - 취소 (아무것도 안 함)

**예시 케이스:**

<div class="example-case">

나: "<span class="keyword-highlight">로그인 기능 리팩토링해줘</span>"
Claude: (리팩토링 완료)
나: (테스트해보니 뭔가 이상하다)
→ <kbd>Esc</kbd> + <kbd>Esc</kbd>
→ "코드 + 대화 모두 <span class="keyword-highlight">되돌리기</span>" 선택
→ 리팩토링 전 상태로 복구

비유: 게임에서 저장 포인트로 돌아가기
Claude가 모든 변경 전에 자동으로 저장해둠
</div>

---

## 단축키 조합 활용법

### 빠른 코드 탐색 → 플랜 작성 → 구현

1. <kbd>Shift+Tab</kbd> (Plan Mode 진입)
2. "<span class="keyword-highlight">인증 시스템 전체 구조 파악하고 개선 계획 세워줘</span>"
3. <kbd>Ctrl+G</kbd> (플랜 에디터에서 수정)
4. <kbd>Shift+Tab</kbd> (Normal Mode로 복귀)
5. "<span class="keyword-highlight">이 플랜대로 구현해줘</span>"

### 실험적 변경 → 결과 확인 → 필요시 되돌리기

1. "<span class="keyword-highlight">이 함수를 async/await 패턴으로 바꿔줘</span>" (시도)
2. 테스트 실패 확인
3. <kbd>Esc</kbd> + <kbd>Esc</kbd> (Rewind)
4. "<span class="keyword-highlight">async/await 대신 Promise 체이닝으로 바꿔줘</span>" (다른 방법 시도)
