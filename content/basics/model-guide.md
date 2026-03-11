---
title: "모델 선택 가이드"
description: "Opus와 Sonnet, 작업에 맞는 모델을 고르는 기준"
order: 3
tags: ["기본", "모델", "Opus", "Sonnet"]
---

## 모델이란?

Claude Code에는 여러 종류의 모델이 있습니다.

| 모델 별칭 | 특성 | 비유 |
|------|------|------|
| **Opus** | 정확하고 깊이 있음, 느리고 비쌈 | 시니어 전문가 |
| **Sonnet** | 빠르고 저렴함, 일상 작업에 적합 | 중간 직원 |
| **Haiku** | 가장 빠르고 저렴함, 단순 작업에 적합 | 주니어 직원 |

모델 전환은 `/model` 입력 → 목록에서 선택으로 합니다.

<div class="example-case">

비유: 같은 회사의 시니어, 중간, 주니어
택배 보내기만 할 때는 주니어(Haiku)면 충분하고,
일반 업무는 중간(Sonnet),
연간 사업 전략을 짤 때는 시니어(Opus)가 필요
</div>

### 특수 모델 모드

| 모드 | 설명 | 비유 |
|------|------|------|
| **opusplan** | 계획은 Opus, 실행은 Sonnet으로 자동 전환 | 시니어가 설계하고 중간이 시공 |
| **sonnet[1m]** | 대화 기억 용량이 훨씬 큰 Sonnet | 초대형 책상 — 더 많은 자료를 동시에 펼쳐놓기 |

### 노력 수준 (Effort Level)

같은 모델이라도 "얼마나 깊이 생각할지" 조절할 수 있습니다.

| 수준 | 설명 | 비유 |
|------|------|------|
| `low` | 빠르게, 적게 생각 | 바로 답 |
| `medium` | 균형 (기본값) | 적당히 고민 |
| `high` | 깊이 생각 | 꼼꼼히 검토 |

변경: `/model` 메뉴에서 화살표 키로 조절

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
| 단순 질문, 간단한 수정 | Haiku |
| 파일 1~2개 수정, 리서치 | Sonnet |
| 정해진 패턴 반복 | Sonnet |
| 파일 3개 이상 걸친 설계 | Opus |
| 원인 불명 버그 | Opus |
| 코드 품질 검토 | Opus |
| 계획 후 구현 작업 | opusplan |

### 구독별 기본 모델

| 구독 | 기본 모델 |
|------|----------|
| Max, Team Premium | Opus |
| Pro, Team Standard | Sonnet |
