---
title: "Writer/Reviewer 이중 세션 패턴"
description: "코드를 짠 Claude와 다른 Claude가 리뷰하게 만드는 고품질 코드 작성법"
order: 8
tags: ["워크플로우", "리뷰", "병렬", "품질", "이중세션"]
---

## 왜 이중 세션이 필요한가?

같은 Claude가 짠 코드를 같은 Claude가 리뷰하면 편향이 생깁니다.

일반적인 상황:
[<span class="keyword-highlight">세션</span> A] "<span class="keyword-highlight">결제 로직 만들어줘</span>"
Claude: (구현 완료)
[<span class="keyword-highlight">세션</span> A] "<span class="keyword-highlight">이 코드 리뷰해줘</span>"
Claude: "잘 작성됐네요!" (자기가 짠 거라 관대해짐)

이중 <span class="keyword-highlight">세션</span>:
[<span class="keyword-highlight">세션</span> A] "<span class="keyword-highlight">결제 로직 만들어줘</span>"
[<span class="keyword-highlight">세션</span> B] "@src/payment/checkout.ts 이 코드 처음 보는 사람처럼
          <span class="keyword-highlight">냉정하게 리뷰해줘</span>. 엣지케이스, 레이스 컨디션, 보안 집중."

-> <span class="keyword-highlight">세션</span> B는 이 코드가 어떻게 만들어졌는지 모름
   훨씬 냉정하고 날카로운 리뷰가 나옴

<div class="example-case">

비유: 내가 쓴 보고서를 나 혼자 교정보는 것 vs 다른 사람이 교정보는 것
     직접 쓴 글은 눈이 익어서 오타도 안 보임
</div>

---

## 기본 패턴

### 세션 A: Writer (구현)

[새 터미널 또는 새 <span class="keyword-highlight">세션</span>]

"<span class="keyword-highlight">결제 API를 구현해줘</span>.
 - 카드, 카카오페이 지원
 - 실패 시 재시도 로직 포함
 - 멱등성 보장"

-> 구현 완료

### 세션 B: Reviewer (리뷰)

[별도 터미널 또는 새 <span class="keyword-highlight">세션</span>]

"@src/payment/ 폴더의 코드를 <span class="keyword-highlight">리뷰해줘</span>.
 방금 만들어진 코드라는 것 외에 아무 사전 정보 없이,
 처음 보는 코드라고 생각하고 리뷰해줘.

 다음 항목을 집중적으로 확인해줘:
 1. 레이스 컨디션 (동시에 여러 요청이 오면?)
 2. 엣지케이스 (결제 금액이 0원이면? 네트워크 끊기면?)
 3. 보안 (입력값 검증, 민감 정보 노출 여부)
 4. 에러 처리 (모든 실패 케이스가 처리되는가?)"

---

## 실전 활용 예시

### 예시 1: 기능 개발 + 보안 리뷰

[Writer <span class="keyword-highlight">세션</span>]
"<span class="keyword-highlight">로그인 기능 만들어줘</span>. JWT 토큰 방식으로."
(구현 완료)

[Reviewer <span class="keyword-highlight">세션</span> - 보안 관점]
"@src/auth/ 를 <span class="keyword-highlight">보안 전문가 관점에서 리뷰해줘</span>.

특히:
- 토큰 만료 처리
- Refresh 토큰 탈취 대비
- SQL Injection 가능성
- 브루트포스 공격 방어

각 문제를 발견하면 구체적인 수정 방법도 알려줘."

### 예시 2: 테스트 작성 역할 분리

[<span class="keyword-highlight">세션</span> A - Writer]
"<span class="keyword-highlight">상품 재고 관리 로직을 만들어줘</span>"
(구현)

[<span class="keyword-highlight">세션</span> B - Test Writer]
"@src/inventory/ 의 코드를 보고, 가장 취약할 것 같은
 부분의 <span class="keyword-highlight">테스트 케이스를 만들어줘</span>.

 잘못될 수 있는 시나리오 위주로:
 - 동시에 재고가 줄면?
 - 재고가 음수가 되면?
 - DB 연결이 끊기면?"

[<span class="keyword-highlight">세션</span> C - Implementation]
"[세션 B의 테스트] 를 모두 <span class="keyword-highlight">통과하는 코드로 수정해줘</span>"

### 예시 3: 코드 리뷰 자동화

```bash
# 터미널에서 변경사항을 별도 세션으로 리뷰
git diff HEAD~1 | claude -p "이 변경사항을 처음 보는 시니어 개발자처럼
리뷰해줘. 승인, 수정 요청, 즉시 수정 필요로 분류해줘."
```

---

## Worktree와 함께 사용하기

두 세션이 같은 파일을 동시에 수정하지 않도록 Worktree를 활용합니다.

```bash
# 구현 세션
claude --worktree feature-payment

# 리뷰 세션은 main 브랜치에서 (worktree 없이)
claude
```

리뷰 <span class="keyword-highlight">세션</span>에서:
"@.claude/worktrees/feature-payment/src/payment/ 이 코드 <span class="keyword-highlight">리뷰해줘</span>"

-> 구현 <span class="keyword-highlight">세션</span>은 자기 worktree에서 계속 작업
-> 리뷰 <span class="keyword-highlight">세션</span>은 해당 파일을 읽기만 함
-> 충돌 없음

---

## 어떤 경우에 쓰면 좋은가?

| 상황 | 이중 세션 효과 |
|------|--------------|
| 결제/보안 관련 코드 | 놓친 취약점 발견 |
| 복잡한 비즈니스 로직 | 엣지케이스 발굴 |
| 중요한 PR 제출 전 | 리뷰어 역할 대신 |
| 버그가 계속 발생하는 모듈 | 구조적 문제 발견 |

적합하지 않은 경우:
- 간단한 UI 수정
- 설정 파일 변경
- 주석 추가

적합한 경우:
- "이 코드가 진짜 맞나?" 불안할 때
- 보안이 중요한 기능
- 동시성 문제가 생길 수 있는 코드
- 팀 코드 리뷰 전 사전 점검

<div class="example-case">

비유:
글 쓰고 나서 하루 지난 후 다시 읽기
시간이 지나면 다른 눈으로 보임
Claude 이중 <span class="keyword-highlight">세션</span>도 같은 효과
</div>

---

## 빠른 리뷰 프롬프트 모음

**보안 리뷰**
<span class="keyword-highlight">"@[파일] 보안 취약점만 집중해서 찾아줘. OWASP Top 10 기준으로."</span>

**성능 리뷰**
<span class="keyword-highlight">"@[파일] 성능 문제가 될 수 있는 코드를 찾아줘. N+1 쿼리, 불필요한 루프, 메모리 누수 위주로."</span>

**엣지케이스 리뷰**
<span class="keyword-highlight">"@[파일] 정상 케이스 말고 실패할 수 있는 케이스를 모두 나열해줘."</span>

**가독성 리뷰**
<span class="keyword-highlight">"@[파일] 6개월 후의 나 또는 새 팀원이 이해하기 어려울 부분을 찾아줘."</span>

**종합 리뷰**
<span class="keyword-highlight">"@[파일] 시니어 개발자가 코드 리뷰를 한다고 생각하고, 즉시 수정 / 개선 권장 / 괜찮음으로 분류해서 리뷰해줘."</span>
