---
title: "모델 선택 가이드"
description: "Opus와 Sonnet, 작업에 맞는 모델을 고르는 기준"
order: 3
tags: ["기본", "모델", "Opus", "Sonnet"]
---

## 모델이란?

Claude Code에는 두 가지 모델이 있습니다.

| 모델 | 특성 | 비유 |
|------|------|------|
| **Opus** | 정확하고 깊이 있음, 느리고 비쌈 | 시니어 전문가 |
| **Sonnet** | 빠르고 저렴함, 단순 작업에 적합 | 주니어 직원 |

모델 전환은 `/model` 입력 → 목록에서 선택으로 합니다.

<div class="example-case">

비유: 같은 회사의 시니어와 주니어
택배 보내기만 할 때는 주니어면 충분하지만,
연간 사업 전략을 짤 때는 시니어가 필요
</div>

## Sonnet이 적합한 작업 (주니어 = 빠르고 저렴)
- 단순 질문, 개념 설명
- 간단한 수정 (글자 바꾸기, 색상 변경 등)
- 같은 패턴 반복하기
- 문서 작성

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">Tailwind CSS가 뭐야?</span>"
→ `/model` → Sonnet 선택 (단순 설명)

"<span class="keyword-highlight">제목 글씨를 파란색으로 바꿔줘</span>"
→ `/model` → Sonnet 선택 (간단한 수정)

"<span class="keyword-highlight">상품 목록 페이지를 회원 목록 페이지랑 같은 형태로 만들어줘</span>"
→ `/model` → Sonnet 선택 (기존 패턴 따라하기)

비유: 복사기 사용법을 묻거나, 서류 복사를 시킬 때
→ 주니어 직원이면 충분
</div>

## Opus가 적합한 작업 (시니어 = 정확하고 깊이 있음)
- 여러 파일에 걸친 큰 구조 설계
- 원인을 모르는 복잡한 문제 해결
- 새로운 기능의 방향 결정
- 코드 품질 검토

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">쇼핑몰의 결제 흐름을 처음부터 설계해줘</span>"
→ `/model` → Opus 선택 (전체 구조 설계)

"<span class="keyword-highlight">사이트가 갑자기 느려졌는데 원인을 모르겠어</span>"
→ `/model` → Opus 선택 (원인 불명확한 문제)

"<span class="keyword-highlight">이 프로젝트 코드가 잘 짜여진 건지 검토해줘</span>"
→ `/model` → Opus 선택 (품질 판단)

비유: 건물 설계도를 그리거나, 원인 모를 고장을 진단할 때
→ 시니어 전문가가 필요
</div>

## 빠른 판단 기준

| 이런 작업이면 | 선택 |
|--------------|------|
| 파일 1~2개 수정 | Sonnet |
| 질문, 설명, 리서치 | Sonnet |
| 정해진 패턴 반복 | Sonnet |
| 파일 3개 이상 걸친 설계 | Opus |
| 원인 불명 버그 | Opus |
| 코드 품질 검토 | Opus |
