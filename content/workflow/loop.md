---
title: "/loop — 주기적 작업 자동화"
description: "Claude Code의 타이머 기능 - 일정 시간마다 Claude에게 작업을 자동으로 맡기는 방법"
order: 9
tags: ["자동화", "loop", "타이머", "배포", "모니터링"]
---

## /loop란?

**"이거 나 대신 주기적으로 확인해줘"** 라고 Claude에게 맡기는 기능입니다.

<div class="example-case">

비유: 알람 + 심부름꾼을 동시에 쓰는 것

  매 5분마다 -> <span class="keyword-highlight">배포 상태 확인하고 끝나면 알려줘</span>
  매 30분마다 -> <span class="keyword-highlight">PR 리뷰 상태 체크해줘</span>
  2시간 후에  -> <span class="keyword-highlight">테스트 결과 정리해줘</span>
</div>

## 기본 사용법

`/loop 5m   확인할 내용`
`/loop 1h   확인할 내용`
`/loop 30m  /review-pr 1234`

시간 단위:
- `s` = 초, `m` = 분, `h` = 시간, `d` = 일

시간을 안 쓰면 기본값 **10분마다** 실행됩니다.

## 실전 예시

### 배포 완료 확인

나: `/loop 5m 배포 상태 확인하고 완료되면 알려줘`
Claude: 알겠어요! 5분마다 확인할게요. (작업 ID: ab12cd34)

이제 다른 일 해도 됩니다. Claude가 5분마다 확인하고 끝나면 알려줍니다.

### PR 리뷰 주기적 체크

`/loop 30m /review-pr 1234`

PR #1234 리뷰 상태를 30분마다 자동으로 확인합니다.

### 일회성 알림 (자연어로도 가능)

"오후 3시에 릴리즈 <span class="keyword-highlight">브랜치</span> <span class="keyword-highlight">푸시</span> 생각나게 해줘"
"45분 후에 통합 테스트 결과 <span class="keyword-highlight">확인해줘</span>"

## 예약 작업 관리

"<span class="keyword-highlight">현재 예약된 작업 보여줘</span>"
"<span class="keyword-highlight">ab12cd34 작업 취소해줘</span>"

## 알아두면 좋은 것

| 항목 | 내용 |
|------|------|
| **유효 기간** | Claude Code 켜져 있는 동안만 |
| **자동 만료** | 3일 후 자동 삭제 |
| **동시 등록** | 최대 50개 |
| **누락 없음** | 바쁠 때 놓친 실행은 건너뜀 (재시도 없음) |

---

## /hooks vs /loop 비교

hooks는 이벤트 기반, /loop는 시간 기반입니다.

| | **/hooks** | **/loop** |
|--|--|--|
| **언제 작동?** | 특정 **이벤트** 발생 시 | 일정 **시간**마다 |
| **트리거 예시** | "파일 저장할 때마다" | "5분마다" |
| **지속성** | 영구 (settings.json 저장) | 임시 (세션 종료 시 사라짐) |
| **실행 대상** | 쉘 명령어 (bash 등) | Claude 프롬프트 |

### 언제 무엇을 쓸까?

"<span class="keyword-highlight">파일 수정할 때마다 lint 돌려줘</span>"   -> `/hooks`  (이벤트)
"<span class="keyword-highlight">1시간마다 PR 상태 확인해줘</span>"       -> `/loop`   (시간)
"<span class="keyword-highlight">세션 시작할 때마다 TODO 보여줘</span>"   -> `/hooks`  (이벤트)
"<span class="keyword-highlight">지금부터 30분마다 빌드 체크해줘</span>"  -> `/loop`   (시간)
"<span class="keyword-highlight">테스트 실패하면 나한테 알려줘</span>"    -> `/hooks`  (이벤트)
"<span class="keyword-highlight">오후 3시에 배포 생각나게 해줘</span>"    -> `/loop`   (시간)

> **한 줄 요약:** "~할 때마다" → `/hooks` / "~마다, ~후에" → `/loop`

### 실전 시나리오 비교

**시나리오: 배포 완료 확인**

`/loop` 사용 (이번 <span class="keyword-highlight">세션</span>만, 시간 기반)
나: `/loop 5m 배포 상태 확인하고 완료되면 알려줘`
Claude: 5분마다 확인할게요!

`/hooks`로는 어색함 -- "언제" 확인할지 이벤트가 없음

**시나리오: 코드 저장할 때마다 자동 정리**

`/hooks` 사용 (영구, 이벤트 기반)
나: `/hooks`
-> PostToolUse 선택 -> Edit/Write 선택
-> 명령어: `npx prettier --write` -> 저장!

`/loop`로는 불가능 -- "파일 저장할 때마다"를 감지 못함

**시나리오: 세션 시작할 때 자동 인사**

`/hooks` 사용 (영구, 이벤트 기반)
`settings.json`에 SessionStart 훅 설정
-> Claude Code 켤 때마다 항상 실행

`/loop`로는 불가능 -- <span class="keyword-highlight">세션</span> 시작 후에나 등록 가능

### 비유로 비교

`/hooks` = 집 배선 공사
  한 번 설치하면 영구적으로 작동
  (전등 스위치 켜면 항상 불 켜짐)

`/loop`  = 오늘만 쓸 알람
  지금 필요해서 설정했지만
  Claude Code 끄면 사라짐

> 출처: [Anthropic 공식 문서 - Scheduled Tasks](https://code.claude.com/docs/en/scheduled-tasks)
