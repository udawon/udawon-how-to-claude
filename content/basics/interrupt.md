---
title: "작업 중 채팅 & 중단하기"
description: "Claude가 일하는 도중 말을 걸면 어떻게 되는지, 그리고 즉시 멈추는 방법"
order: 6
tags: ["기본", "Esc", "중단", "인터럽트", "작업흐름"]
---

## 작업 중에 채팅을 치면 어떻게 되나요?

Claude Code는 작업 중에도 메시지를 받습니다.
다만 **지금 하던 작업을 먼저 끝내고**, 그 다음에 메시지에 응답합니다.

<div class="example-case">

[Claude 작업 중...]
나: 아, 그리고 <span class="keyword-highlight">커밋 메시지는 한국어로 써줘</span>

[작업 완료]
Claude: 네, 한국어로 작성했습니다.
아까 하신 말씀도 반영했습니다.
</div>

메시지가 **무시되는 게 아닙니다.** 기억해 뒀다가 작업 후 처리합니다.

---

## 즉시 멈추고 싶을 때

작업 방향이 틀렸거나, 다른 지시를 먼저 하고 싶다면 중단하세요.

| 상태 | 누르는 키 | 동작 |
|------|-----------|------|
| Claude가 작업 중일 때 | <kbd>Esc</kbd> 또는 <kbd>Ctrl</kbd>+<kbd>C</kbd> | 작업 즉시 중단 |
| 내가 입력 중일 때 | <kbd>Esc</kbd> | 입력한 내용 취소 |

어느 쪽이든 컨텍스트(대화 내용)는 그대로 유지됩니다.
중단 후 새 메시지를 입력하면 바로 응답합니다.

---

## 상황별 정리

| 상황 | 방법 |
|------|------|
| 추가 지시를 나중에 반영해도 됨 | 그냥 채팅 입력 (작업 끝나고 처리) |
| 지금 당장 방향을 바꾸고 싶음 | <kbd>Esc</kbd> 또는 <kbd>Ctrl</kbd>+<kbd>C</kbd> → 새 지시 입력 |
| 작업 완전히 처음부터 다시 | <kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind |

---

## <kbd>Esc</kbd>를 두 번 누르면?

<kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind 메뉴

파일 변경사항까지 이전 상태로 되돌릴 수 있습니다.
Claude가 잘못된 방향으로 코드를 많이 바꿨을 때 유용합니다.

<div class="example-case">

비유: 드래프트 저장 없이 문서를 닫는 것

"저장하지 않고 닫으시겠습니까?" 대신
<kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind로 <span class="keyword-highlight">되돌리기</span>
</div>

---

## 실전 패턴

**패턴 1: 추가 요청은 그냥 입력**

<div class="example-case">

[Claude가 컴포넌트를 만드는 중]

나: 참고로 <span class="keyword-highlight">색상은 브랜드 오렌지(#FF6B35)야</span>

[완료 후 Claude가 오렌지 색상 자동 적용]
</div>

작업이 끝나기 전에 생각난 것들을 그냥 입력해도 됩니다.

---

**패턴 2: 방향이 틀렸으면 Esc**

<div class="example-case">

[Claude가 복잡한 애니메이션을 추가하기 시작함]

나: (<kbd>Esc</kbd>)
나: <span class="keyword-highlight">애니메이션 말고 기능만 먼저 만들어줘</span>
</div>

복잡해지는 걸 보자마자 끊고 방향을 바꾸면 됩니다.

---

**패턴 3: 실험하다 마음에 안 들면 Rewind**

<div class="example-case">

나: <span class="keyword-highlight">한번 그라데이션 배경 넣어봐</span>

[보니까 별로임]

<kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind → 이전 상태로 복구
</div>

체크포인트처럼 쓸 수 있습니다. 마음껏 시도하고, 마음에 안 들면 되돌리면 됩니다.
