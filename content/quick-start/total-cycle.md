---
title: "왕초보: 아이디어만 있을 때"
description: "코드를 전혀 몰라도 OK — Claude에게 인터뷰 받고 프로젝트를 완성하는 전체 흐름"
order: 1
tags: ["왕초보", "시작", "토탈사이클", "처음부터", "프로젝트", "비개발자"]
---

## 내 레벨 확인하기

| 레벨 | 나는 이런 사람 | 가이드 |
|------|--------------|--------|
| **👶 왕초보** (지금 보는 문서) | 코드를 전혀 모름. 아이디어만 있음 | 이 문서 |
| **🌱 초보** | 기술 스택은 정했고 바로 시작하고 싶음 | [초보 가이드](/docs/quick-start/beginner-dev) |
| **🌿 중급** | 기존 프로젝트에 합류했거나 복잡한 기능을 다룸 | [중급 가이드](/docs/quick-start/intermediate) |
| **🌳 고급** | CI/CD, 테스트 전략, 대규모 프로젝트를 운영 | [고급 가이드](/docs/quick-start/advanced) |

> 이 가이드는 **"동네 카페 예약 사이트"** 예시를 전체에 걸쳐 사용합니다.

---

## 전체 흐름 미리보기

```
[터미널] 폴더 생성 + claude 실행
    ↓
[Claude] 인터뷰 → SPEC.md 작성
    ↓
[새 세션] CLAUDE.md 생성
    ↓
[Plan Mode] 구조 설계 + Ctrl+G로 수정
    ↓
[Normal Mode] /rename으로 세션 이름 저장
    ↓
[구현] 하나씩 + 체크포인트 활용
    ↓
[새 세션] 냉정한 코드 리뷰
    ↓
[커밋] 마무리
```

---

## 1단계: 폴더 만들고 Claude 실행

```bash
# 터미널(명령 프롬프트)에서
mkdir cafe-booking
cd cafe-booking
claude
```

비유: 빈 공책을 펼쳐놓는 것
     아직 아무것도 없어도 됨. 시작이 반

---

## 2단계: Claude에게 인터뷰 받기 (핵심!)

바로 "만들어줘"라고 하지 마세요. 먼저 Claude가 당신을 인터뷰하게 만드세요.

```
"카페 예약 사이트를 만들고 싶어.
 AskUserQuestion 도구로 나를 인터뷰해줘.
 내가 미처 생각 못한 부분까지 파고들어줘.
 다 끝나면 SPEC.md에 정리해줘."
```

> **왜 인터뷰가 중요한가요?**
> `AskUserQuestion`은 Claude가 당신에게 직접 질문하는 도구입니다.
> "인터뷰해줘"라고 **명시적으로 요청**해야 사용됩니다.
> 그냥 "만들어줘"라고 하면 Claude가 알아서 추측하고 시작해버립니다.

**Claude가 물어볼 것들 (예시):**

<div class="example-case">

Claude: 예약을 받을 카페가 한 곳인가요, 여러 곳인가요?
나: 일단 제 카페 한 곳이요

Claude: 예약 취소/변경은 손님이 직접 할 수 있어야 하나요?
나: 아, 그것도 필요하겠네요

Claude: 예약 확인을 문자나 카카오톡으로 보내야 하나요?
나: 카카오톡 알림이면 좋겠어요

Claude: 테이블 수와 시간대별 예약 가능 인원은 어떻게 되나요?
나: 테이블 5개, 각 2시간 단위로요

<span class="keyword-highlight">인터뷰</span> 없이 바로 시작하면:
"카페 예약 사이트 만들어줘"
→ Claude가 만들고 나서 "아, 카카오톡 알림도 필요한데"
→ 중간에 방향이 바뀌어 시간 낭비

<span class="keyword-highlight">인터뷰</span> 후 시작하면:
모든 요구사항을 미리 정리 → 처음부터 제대로 구현
</div>

---

## 3단계: 환경 설정 (CLAUDE.md)

새 세션을 시작하고 프로젝트 규칙을 잡습니다.

(새 세션에서)
"@SPEC.md 를 읽고 이 프로젝트의 <span class="keyword-highlight">CLAUDE.md를 만들어줘</span>.
 Next.js + Tailwind CSS로 만들 거야."

Claude가 자동으로 만들어주는 것:
```markdown
# CLAUDE.md (자동 생성 예시)
## 프로젝트
카페 예약 사이트 (단일 카페, 테이블 5개, 2시간 단위)

## 기술 스택
- Next.js 14 App Router
- Tailwind CSS
- SQLite (간단한 DB)

## 규칙
- 한국어로 응답
- 모바일 우선 디자인
```

> **왜 새 세션에서 하나요?**
> 인터뷰 세션에서는 대화 내용이 많이 쌓여있어서 Claude의 집중력이 떨어집니다.
> 새 세션에서 SPEC.md만 참조하면 깔끔하게 시작할 수 있습니다.

---

## 4단계: 구조 설계 (Plan Mode)

코드를 짜기 전에 전체 구조를 합의합니다.

<kbd>Shift</kbd>+<kbd>Tab</kbd>을 눌러 권한 모드를 순환 (기본 → 자동수락 → Plan Mode) — Plan Mode가 될 때까지 반복

"SPEC.md를 기반으로 이 프로젝트의 전체 구조를 설계해줘.
 어떤 페이지가 필요하고, 어떤 순서로 만들면 좋을지."

Claude의 플랜 예시:
```
1. 메인 페이지 (예약 폼)
2. 예약 현황 페이지 (관리자용)
3. 예약 확인 페이지 (손님용)
4. 카카오톡 알림 연동
```

<kbd>Ctrl</kbd>+<kbd>G</kbd> 로 입력창을 외부 에디터에서 열 수 있음
플랜 내용을 직접 수정하고 싶을 때 유용

<kbd>Shift</kbd>+<kbd>Tab</kbd>을 눌러 기본 모드로 복귀 후 구현 시작.

---

## 5단계: 세션 이름 붙이기

```
/rename cafe-booking-main
```

이름을 붙여두면:
- 내일 이어서 작업할 때 → `claude --resume cafe-booking-main`
- 세션 목록에서 쉽게 찾을 수 있음

---

## 6단계: 하나씩 구현하기

한 번에 다 만들려 하지 마세요. 하나씩, 확인하면서 진행합니다.

"메인 페이지의 예약 폼부터 만들어줘.
 날짜, 시간, 인원, 이름, 연락처 입력 필드가 필요해."

**잘못된 방향이면 즉시 <kbd>Esc</kbd>:**

Claude가 너무 복잡하게 만들기 시작하면?
→ <kbd>Esc</kbd> 눌러서 중단
→ "더 단순하게, 디자인 신경 쓰지 말고 기능만 먼저"

**실험하고 싶으면 마음껏:**

체크포인트가 자동으로 저장되니까
"한 번 예약 완료 애니메이션 넣어봐" 시도해보고
마음에 안 들면 <kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind로 되돌리기

---

## 7단계: 검증하기

(새 세션 열기 - Reviewer 세션)

"@src/ 폴더 전체를 봐줘.
 처음 보는 코드라고 생각하고 <span class="keyword-highlight">냉정하게 리뷰해줘</span>.
 예약이 동시에 들어오면 어떻게 되는지,
 잘못된 날짜를 입력하면 어떻게 되는지 확인해줘."

같은 세션에서 리뷰하면 관대해짐
새 세션 = 새로운 눈 = 냉정한 리뷰

---

## 8단계: Git 커밋 & 마무리

"변경사항을 커밋해줘. 커밋 메시지는 한국어로."

Claude가 자동으로:
- 변경 파일 확인
- 의미있는 커밋 메시지 작성
- `git add` + `git commit` 실행

---

## 자주 쓰는 패턴 모음

### 막혔을 때

"어디서 에러가 나는지 모르겠어. 로그를 보여줄게: \[에러 복붙\]"
"<span class="keyword-highlight">ultrathink</span>로 이 버그 원인을 체계적으로 추적해줘"

### 방향을 바꾸고 싶을 때

<kbd>Esc</kbd> → 중단 (<span class="keyword-highlight">컨텍스트</span> 유지)
<kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind 메뉴 (이전 상태로 복구)
`/clear` → <span class="keyword-highlight">컨텍스트</span> 초기화 (완전히 새로 시작)

### 며칠에 걸친 작업

`/rename 의미있는이름`     (세션에 이름 붙이기)
`claude --resume 이름`     (다음날 이어서)

### 중요한 기능 전 안전망

"<span class="keyword-highlight">구현 전에 git commit 해줘</span>"   (체크포인트)
또는
<kbd>Esc</kbd> + <kbd>Esc</kbd> → Rewind 활용      (Claude 자동 체크포인트)
