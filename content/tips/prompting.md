---
title: "효율적인 프롬프트 작성법"
description: "Claude Code에게 더 정확한 결과를 얻는 방법"
order: 1
tags: ["프롬프트", "팁"]
---

## 핵심 원칙

### 1. 구체적으로 요청하기

**예시 케이스:**

<div class="example-case">

(X) "이거 고쳐줘"
→ Claude: 뭘 고치라는 건지 모호함. 엉뚱한 곳을 수정할 수 있음

(O) "메인 페이지에서 '환영합니다' 글씨가 안 보여.
     하얀 배경에 하얀 글씨라서 그런 것 같아. <span class="keyword-highlight">글씨를 검정으로 바꿔줘</span>"
→ <span class="keyword-highlight">어디가 문제인지, 왜 문제인지, 어떻게 고칠지</span> 명확

비유: 의사에게 "아파요" vs "오른쪽 무릎이 계단 내려갈 때 시린 느낌이에요"
     구체적일수록 정확한 처방이 나옴
</div>

### 2. 단계적으로 진행하기

**예시 케이스:**

<div class="example-case">

(X) "쇼핑몰 만들어줘. 로그인, 상품, 장바구니, 결제 전부"
→ 한꺼번에 너무 많이 요청하면 뒤쪽이 부실해짐

(O) <span class="keyword-highlight">단계별로 진행</span>:
    1차: "<span class="keyword-highlight">쇼핑몰을 만들 건데, 어떤 구조가 좋을지 제안해줘</span>"
    2차: "<span class="keyword-highlight">좋아, 그 구조로 메인 페이지부터 만들자</span>"
    3차: "<span class="keyword-highlight">다음으로 상품 목록 페이지를 만들어줘</span>"

비유: 이사할 때 "짐 다 옮겨줘"보다

     "먼저 큰 가구부터" → "다음 박스" → "마지막 소품"
     순서대로 하는 게 깔끔
</div>

### 3. 결과물 형태 말해주기

**예시 케이스:**

<div class="example-case">

(X) "로그인 기능 만들어줘"
→ 설명을 길게 할지, 바로 만들지 Claude가 판단해야 함

(O) "로그인 기능을 만들어줘. <span class="keyword-highlight">설명 없이 바로 코드만 작성해.</span>"
또는
(O) "로그인 기능을 어떻게 만들면 좋을지 설명해줘. <span class="keyword-highlight">아직 만들지는 마.</span>"

비유: 음식점에서 "파스타요" vs "파스타 포장이요" or "파스타 여기서 먹을게요"
     원하는 형태를 말해야 맞게 나옴
</div>

### 4. 범위 제한하기

**예시 케이스:**

<div class="example-case">

(X) "디자인을 개선해줘"
→ 어디를? 전체를? Claude가 관련 없는 곳까지 건드릴 수 있음

(O) "<span class="keyword-highlight">메인 페이지의 헤더 부분만 수정해줘. 다른 곳은 건드리지 마.</span>"

비유: 미용실에서 "예쁘게 해주세요" vs "앞머리만 1cm 잘라주세요"
     범위가 명확할수록 원하는 결과에 가까움
</div>

## 효과적인 프롬프트 공식

```
[어디서] + [무엇을] + [어떻게] + [제한사항]
```

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">메인 페이지에서</span>(어디서) <span class="keyword-highlight">제목 글씨를</span>(무엇을)
 <span class="keyword-highlight">파란색으로 바꿔줘</span>(어떻게). <span class="keyword-highlight">다른 건 수정하지 마</span>(제한)."

"<span class="keyword-highlight">상품 목록 화면에</span>(어디서) <span class="keyword-highlight">검색 기능을</span>(무엇을)
 <span class="keyword-highlight">추가해줘</span>(어떻게). <span class="keyword-highlight">기존 디자인 스타일에 맞춰서</span>(제한)."
</div>

## 검증 요청할 때 — "확인해줘" vs "문제를 찾아줘"

Claude에게 검증을 맡길 때 프롬프트 방식에 따라 품질이 크게 달라집니다.

**예시 케이스:**

<div class="example-case">

(X) "<span class="keyword-highlight">라이트 모드에서 문제 없는지 확인해줘</span>"
→ Claude: 대충 훑어보고 "문제없어 보입니다" (확인 편향)

(O) "<span class="keyword-highlight">라이트 모드에서 문제점을 찾아줘. 근거와 함께 보여줘.</span>"
→ Claude: 적극적으로 결함을 탐색하고, 증거를 제시

비유: "이 계약서 괜찮지?" → "네, 괜찮아 보여요"

     "이 계약서에서 불리한 조항을 찾아줘" → 꼼꼼히 뒤짐
</div>

### 핵심: "확인"이 아니라 "탐색"을 시키기

| 약한 요청 (확인 편향) | 강한 요청 (결함 탐색) |
|---------------------|---------------------|
| "괜찮아?" | "<span class="keyword-highlight">문제를 찾아줘</span>" |
| "확인해줘" | "<span class="keyword-highlight">증거와 함께 보여줘</span>" |
| "잘 되는지 봐줘" | "<span class="keyword-highlight">각 항목을 스크린샷으로 증명해줘</span>" |

**예시 케이스:**

<div class="example-case">

(X) "배포 전에 <span class="keyword-highlight">문제없는지 확인해줘</span>"
→ "전체적으로 잘 되어 있습니다" (실제로는 대충 봄)

(O) "배포 전에 <span class="keyword-highlight">누락된 부분을 찾아줘. 체크한 항목 목록을 보여줘.</span>"
→ 항목별로 실제 검증하고 결과를 리스트로 보고

(O) "이 코드에서 <span class="keyword-highlight">버그를 찾아줘. 각각 왜 문제인지 설명해.</span>"
→ 라인별로 뜯어보면서 실제 결함을 탐색

비유: 경비원에게 "별일 없지?" → "네, 없습니다"
     경비원에게 "침입 흔적을 찾아보세요. 보고서 작성해주세요." → 꼼꼼히 순찰
</div>

---

## 실패하는 프롬프트 vs 성공하는 프롬프트

| 실패 | 성공 | 이유 |
|------|------|------|
| "전부 리팩토링해줘" | "메인 페이지 파일만 정리해줘" | 범위 제한 |
| "알아서 해줘" | "A 방식으로 해줘" | 기준 명확 |
| "완벽하게 만들어줘" | "모바일에서도 잘 보이게 만들어줘" | 구체적 기준 |
| 한 번에 5개 요청 | 하나씩 순서대로 | 누락 방지 |

**예시 케이스:**

<div class="example-case">

(X) "이 프로젝트 코드 정리하고, 테스트 추가하고,
     속도 개선하고, 문서도 쓰고, 배포 설정도 해줘"
→ 5개 중 뒤쪽 2~3개는 빠지거나 대충 됨

(O) "<span class="keyword-highlight">먼저 메인 페이지 코드만 정리해줘.</span>"
    (완료 확인 후)

    "<span class="keyword-highlight">다음으로 테스트를 추가해줘.</span>"
→ 하나씩 확실하게 완료

비유: 식당에서 한꺼번에 5개 메뉴를 주문하면
     뒤쪽 메뉴가 늦거나 빠지는 것과 같음
</div>
