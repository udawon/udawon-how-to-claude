---
title: "Harness 엔지니어링"
description: "AI 에이전트가 여러 세션에 걸쳐 일관되게 작업을 이어가는 구조적 프레임워크"
order: 2
tags: ["하네스", "아키텍처", "장기작업", "세션관리"]
---

## Harness란?

Claude Code는 대화가 끝나면 모든 기억을 잃습니다.
다음 세션에서는 이전에 뭘 했는지 전혀 모릅니다.

**Harness**는 이 문제를 해결하는 방법입니다.
"인수인계 문서"를 자동으로 남겨서, 다음 세션이 이어서 작업할 수 있게 합니다.

> 비유: 3교대 근무하는 공장에서
> 전 근무자가 "여기까지 했고, 다음은 이거 해야 함"이라고 메모를 남기는 것.
> 메모 없으면 매번 처음부터 다시 파악해야 함.

> 출처: [Anthropic 공식 블로그](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

## 왜 필요한가?

### 메모 없이 교대하면 생기는 문제

<span class="keyword-highlight">세션</span> 1: 로그인 화면 절반 완성
(<span class="keyword-highlight">세션</span> 종료 - 기억 소멸)
<span class="keyword-highlight">세션</span> 2: "이 프로젝트 뭐지? 뭘 하고 있었지?"
         -> 처음부터 다시 파악하느라 시간 낭비
         -> 로그인 화면을 다른 방식으로 다시 만들 수 있음

<div class="example-case">

비유: 인수인계 없이 담당자가 바뀌면

     "이거 누가 왜 이렇게 해놨지?" 하면서 시간 낭비
</div>

### 메모를 남기면 (Harness 적용)

<span class="keyword-highlight">세션</span> 1: 로그인 화면 절반 완성
         -> 진행 기록 파일에 "로그인 화면 50% 완료. 다음: 비밀번호 검증"
         -> 기능 목록에 "로그인 UI: 완료 / 비밀번호 검증: 미완료" 업데이트
(<span class="keyword-highlight">세션</span> 종료)
<span class="keyword-highlight">세션</span> 2: 진행 기록 읽기 -> "아, 비밀번호 검증부터 하면 되겠구나"
         -> 바로 이어서 작업

<div class="example-case">

비유: 교대 근무 시 인수인계 노트를 남기는 것
</div>

## 핵심 구조: 2개의 역할

### 1. 준비 담당 (Initializer) - 1회 실행

프로젝트 시작할 때 기반을 깔아주는 역할:
- 환경 세팅 스크립트 생성
- 진행 기록 파일 생성
- **기능 목록** 작성

**예시 케이스:**

<div class="example-case">

"이 프로젝트의 <span class="keyword-highlight">전체 기능을 목록으로 정리해줘</span>.
 각 기능마다 설명과 완료 여부를 포함해서."

-> Claude가 기능 목록 파일을 생성:
   1. 메인 페이지 레이아웃 - 완료
   2. 상품 목록 - 미완료
   3. 장바구니 - 미완료
   4. 결제 화면 - 미완료
   ...

비유: 이사할 때 "해야 할 일 체크리스트"를 먼저 만드는 것
- [ ] 가구 배치
- [ ] 인터넷 설치
- [ ] 주소 변경
</div>

> **왜 JSON으로 쓰나?** Claude는 마크다운 형식의 목록을 실수로 바꿀 수 있지만,
> JSON 형식은 함부로 건드리지 않음. 구조화된 데이터가 더 안전.

### 2. 작업 담당 (Coding Agent) - 반복 실행

매 세션마다 실행되며, **딱 1개 기능만** 구현:

```
1. 진행 기록 파일 읽기
2. 기능 목록에서 미완료 항목 1개 선택
3. 구현
4. 저장 + 진행 기록 업데이트
```

**예시 케이스:**

<div class="example-case">

매 <span class="keyword-highlight">세션</span> 시작할 때:
"<span class="keyword-highlight">진행 기록 파일과 기능 목록을 읽고</span>,
 미완료 기능 중 <span class="keyword-highlight">다음으로 할 1개만 구현해줘</span>.
 완료 후 <span class="keyword-highlight">진행 기록과 기능 목록을 업데이트해</span>."

-> Claude가 알아서:
   1. "아, 상품 목록이 다음이구나"
   2. 상품 목록 구현
   3. 기록 업데이트: "상품 목록 완료. 다음: 장바구니"

비유: 출근하면 인수인계 노트를 보고,
     오늘 할 일 1개를 처리하고,
     퇴근 전에 다음 사람을 위한 노트를 남기는 것
</div>

## 한 번에 다 하면 안 되는 이유

(X) "<span class="keyword-highlight">쇼핑몰 전체를 만들어줘</span>"
-> 10개 기능 중 5개째에서 기억 용량 초과
   나머지 5개는 미완성, 기록도 없음
   다음 <span class="keyword-highlight">세션</span>에서 복구에 시간 낭비

<div class="example-case">

비유: 마라톤을 전력 질주로 시작하면 중간에 쓰러지는 것
</div>

(O) "<span class="keyword-highlight">기능 목록을 확인하고, '장바구니' 기능 1개만 구현해줘</span>"
-> 1개를 확실히 완성하고, 기록을 남기고, 다음으로 넘김

<div class="example-case">

비유: 마라톤을 페이스 조절하면서 구간별로 완주하는 것
</div>

## 3겹 기록 시스템

| 기록 | 역할 | 비유 |
|------|------|------|
| **저장 이력** | 뭘 바꿨는지 기술적 기록 | 공사 일지 |
| **진행 기록 파일** | 오늘 뭘 했는지 요약 | 인수인계 노트 |
| **기능 목록** | 전체 진행률 | 체크리스트 |

**예시 케이스:**

<div class="example-case">

매 <span class="keyword-highlight">세션</span> 종료 시:
"작업을 마무리하기 전에:
 1. 현재 상태로 <span class="keyword-highlight">저장해</span>
 2. 진행 기록에 오늘 한 일 <span class="keyword-highlight">적어</span>
 3. 기능 목록 상태 <span class="keyword-highlight">업데이트해</span>"

비유: 퇴근 전 루틴
     1. 작업 파일 저장
     2. 인수인계 노트 작성
     3. 할 일 목록에 체크
</div>

## 실전 적용법

### CLAUDE.md에 Harness 규칙 적용

아래 내용을 CLAUDE.md 파일에 적어두면
Claude Code가 매 <span class="keyword-highlight">세션</span> 시작 시 자동으로 읽고 따릅니다.

CLAUDE.md 수정 방법:
  방법1: Claude Code 대화창에서 "<span class="keyword-highlight">CLAUDE.md에 아래 내용을 추가해줘</span>" 라고 요청
  방법2: 직접 `프로젝트폴더/.claude/CLAUDE.md` 파일을 메모장으로 열어서 수정

```markdown
## 프로젝트 상태
- 현재 진행 중: 장바구니 기능
- 완료: 프로젝트 세팅, 메인 페이지, 상품 목록
- 미완료: 결제, 마이페이지

## 매 세션 시작 시 규칙
1. 이 파일을 읽고 현재 상태 파악
2. 최근 저장 이력 확인
3. 미완료 항목 중 1개만 선택하여 작업
4. 완료 후 이 파일의 상태를 업데이트
```

**예시 케이스:**

<div class="example-case">

[매 <span class="keyword-highlight">세션</span> 시작할 때 - Claude Code 대화창에서]

"<span class="keyword-highlight">CLAUDE.md와 기능 목록을 읽고 현재 상태를 알려줘</span>.
 <span class="keyword-highlight">다음으로 할 작업을 제안해줘</span>."

-> Claude: "상품 목록까지 완료되었고, 다음은 장바구니입니다.
          장바구니 기능을 구현할까요?"

비유: 출근해서 인수인계 노트를 보고

     "오늘은 이거 하면 되겠다" 파악하는 것
</div>

## 핵심 원칙 요약

| 원칙 | 설명 | 비유 |
|------|------|------|
| **한 번에 하나만** | 세션당 1개 기능만 | 하루 1개 업무 |
| **기록을 파일로** | 기억은 사라져도 파일은 남음 | 인수인계 노트 |
| **매 세션 깨끗한 저장** | 다음 사람이 바로 이어갈 수 있게 | 퇴근 전 정리 |
| **시작 시 확인부터** | 작업 전에 현재 상태 파악 | 출근 시 노트 확인 |
