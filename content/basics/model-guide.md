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

모델 전환은 `/model` 입력 → 목록에서 선택하거나, `/model 모델이름`을 직접 타이핑합니다.
기본 3개(Haiku, Sonnet, Opus)는 목록에 바로 나오고,
특수 모드(opusplan, sonnet[1m])는 직접 타이핑해야 합니다.

<div class="example-case">

비유: 같은 회사의 시니어, 중간, 주니어
택배 보내기만 할 때는 주니어(Haiku)면 충분하고,
일반 업무는 중간(Sonnet),
연간 사업 전략을 짤 때는 시니어(Opus)가 필요
</div>

### 특수 모델 모드

`/model` 선택 메뉴에 바로 나오지 않습니다. `/model 모드이름`을 직접 타이핑해야 합니다.

| 모드 | 선택 방법 | 설명 | 비유 |
|------|----------|------|------|
| **opusplan** | `/model opusplan` | Plan Mode에서 Opus, 일반 모드에서 Sonnet 자동 전환 | 시니어가 설계하고 중간이 시공 |
| **sonnet[1m]** | `/model sonnet[1m]` | 기억 용량이 5배 큰 Sonnet (베타) | 초대형 책상 — 더 많은 자료를 동시에 펼쳐놓기 |

#### opusplan이란?

`/model` 선택 메뉴에는 나오지 않습니다. **직접 타이핑**해서 선택하는 특수 모드입니다:
```
/model opusplan
```

opusplan을 선택하면, Claude Code의 **권한 모드**에 따라 모델이 자동으로 바뀝니다:
- **Plan Mode 상태**일 때 (<kbd>Shift+Tab</kbd> 두 번 → `⏸ plan mode on`) → **Opus** 사용
- **일반 실행 상태**일 때 → **Sonnet** 사용

즉 "계획 모드에서는 비싼 시니어가 검토하고, 실제 작업은 중간 직원이 한다"는 구조입니다.

**예시 케이스:**

<div class="example-case">

**사용 흐름:**

1단계: `/model opusplan` 입력 (특수 모드 활성화)
2단계: <kbd>Shift+Tab</kbd> 두 번 눌러 Plan Mode 진입 (`⏸ plan mode on`)
3단계: "<span class="keyword-highlight">쇼핑몰을 어떻게 만들면 좋을지 설계해줘</span>"
→ Plan Mode이므로 **Opus**가 구조를 설계

4단계: <kbd>Shift+Tab</kbd>으로 일반 모드로 복귀
5단계: "<span class="keyword-highlight">방금 설계한 대로 만들어줘</span>"
→ 일반 모드이므로 **Sonnet**이 코드 작성

**왜 쓰나?**
Opus로만 하면 설계도 코드 작성도 전부 비싼 모델을 씀.
opusplan은 "생각이 필요한 순간"만 Opus를 쓰고 나머지는 Sonnet으로 절약.

비유: 건축에서 시니어 건축가가 설계도를 그리고,
     실제 시공은 숙련된 현장 기사가 하는 것.
     설계도가 좋으면 시공은 경험 있는 기사로 충분.
</div>

#### sonnet[1m]이란?

마찬가지로 `/model` 선택 메뉴에 바로 나오지 않을 수 있습니다. 직접 타이핑합니다:
```
/model sonnet[1m]
```

일반 Sonnet보다 **한 번에 기억할 수 있는 양이 5배** 많은 모드입니다.

> 현재 베타 기능이며, 200K 토큰을 초과하면 추가 요금이 발생합니다.

<div class="example-case">

일반 Sonnet: 책상 위에 서류 200장까지 펼쳐놓을 수 있음
sonnet[1m]: 책상 위에 서류 1,000장까지 펼쳐놓을 수 있음

파일이 아주 많은 대형 프로젝트에서,
대화가 길어져도 이전 내용을 더 오래 기억합니다.
단, 200장을 넘기는 순간부터 추가 비용이 발생합니다.
</div>

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
| 설계 + 구현을 한 번에 시킬 때 (비용 절약) | opusplan |

### 구독별 기본 모델

| 구독 | 기본 모델 |
|------|----------|
| Max, Team Premium | Opus |
| Pro, Team Standard | Sonnet |
