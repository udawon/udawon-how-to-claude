---
date: "2026-04-21"
title: "Claude Excel 애드인 완벽 가이드: 9가지 실전 예제"
description: "Excel 안에서 Claude로 데이터 정제·수식 디버깅·재무 모델·PDF 표 추출까지 — 설치부터 동적 재고 대시보드까지"
order: 57
tags: ["활용법", "연동", "비즈니스", "youtube"]
source_url: "https://youtube.com/watch?v=KS3H8ClXu_c"
---

## 이게 뭔가요?

Excel용 Claude 애드인(Add-in, Excel 같은 프로그램에 추가 기능을 붙이는 확장 도구)은 마이크로소프트 엑셀 안에서 Claude를 사이드 패널로 띄워 쓸 수 있게 해주는 **공식 Anthropic 애드인**입니다.

비유하자면 **엑셀 옆자리에 앉아 있는 조수**입니다. 데이터 범위를 드래그해서 선택하고, "이 표 중복 지워줘", "이 수식 틀렸어 고쳐줘", "3년 재무 모델 만들어줘" 같은 말만 하면 조수가 대신 손을 움직입니다. 피벗테이블(pivot table, 엑셀의 요약 집계 기능) 메뉴를 열지 않아도 됩니다.

> **기존 문서와 차이점**: 이 사이트의 [`m365-copilot-claude.md`](../docs/m365-copilot-claude)는 Microsoft 365 Copilot을 통해 간접적으로 Claude를 쓰는 방식이었습니다. 이번 애드인은 **Anthropic이 직접 배포하는 공식 애드인**으로, Microsoft 365 Copilot 라이선스 없이 Claude 계정만 있으면 됩니다.

## 왜 알아야 하나요?

엑셀에서 사람을 가장 피곤하게 만드는 작업은 대부분 "반복적인 정리 작업"입니다.

- 이름이 대문자 소문자 섞여 있고
- 이메일 오타가 있고
- 날짜 포맷이 제각각이고
- 수식 참조가 틀렸고
- PDF로 받은 표를 다시 타이핑해야 하고

Claude 애드인은 이걸 **드래그 + 프롬프트(AI에게 보내는 요청 메시지) 한 줄**로 끝냅니다. 영상 제작자는 이 과정을 9가지 실전 예제로 보여 주는데, 예제 하나하나가 평소에 1~2시간 걸리던 작업입니다.

## 어떻게 하나요?

### 1단계: Claude 애드인 설치

1. Excel 상단의 **홈(Home) 탭** → **우측 상단의 Add-ins** 버튼을 클릭합니다.
2. 검색창에 **"Claude by Anthropic"** 을 입력합니다.
3. 결과에서 Claude 애드인을 선택하고 추가합니다.
4. Claude 계정으로 로그인합니다.

설치가 끝나면 상단 메뉴에 **Claude 아이콘**이 생기고, 클릭하면 오른쪽에 채팅 패널이 열립니다.

### 2단계: 모델 선택 팁

채팅 패널 안에서 모델(Claude의 두뇌 버전)을 고를 수 있습니다. 영상에서 제시하는 기준은 단순합니다.

| 모델 | 언제 쓰나 |
|------|-----------|
| **Sonnet** | 간단한 작업 (데이터 청소, 수식 수정) — 사용량 적고 빠름 |
| **Opus 4.7** | 복잡한 작업 (연동된 동적 대시보드, 3년 재무 모델) — 무겁지만 정확 |

비유하자면 **일반 문서는 볼펜, 중요한 계약서는 만년필**을 쓰는 것과 같습니다. 영상에서는 간단한 예제는 Sonnet, 마지막 동적 재고 시스템은 Opus 4.7로 바꿔서 시연합니다.

### 3단계: 기본 사용 흐름

1. 작업할 표를 **마우스로 드래그해 범위 선택**
2. Claude 패널에 **프롬프트 입력**
3. 실행 중 **권한 팝업**이 뜨면 "이번만 허용(Allow once)" 선택
4. Claude가 시트를 직접 수정하는 모습을 지켜봄

권한 팝업은 데이터 손실 가능성이 있는 작업(예: 중복 제거)에서 반드시 뜹니다. 내가 원한 작업인지 한 번 더 확인하라는 안전장치입니다.

## 9가지 실전 예제

### 예제 1: 데이터 청소 (Clean-up)

<div class="example-case">
<strong>상황</strong>

- 이름이 모두 대문자인 셀, 모두 소문자인 셀이 섞여 있음
- 이메일에 `.` 빠짐, `..` 중복 같은 오타
- 날짜 포맷 제각각 (`2024-01-15`, `1/15/24`, `Jan 15 2024`)
- 급여 컬럼에 "$1,000" 와 숫자만 있는 값 혼재
- Sarah Williams 행이 중복으로 2번 등장

<strong>프롬프트</strong>

> "We want to clean this data set. We want to fix capitalization, remove duplicates, standardize dates, correct email formatting, and make the salaries correctly formatted."

<strong>결과</strong>

Claude는 먼저 **"발견한 이슈 표(Issues found)"** 를 보여주고, 중복 제거는 데이터 손실이 발생할 수 있으니 **권한 팝업("Allow once" 선택)** 으로 한 번 더 확인을 요청합니다. 허용하면 3개의 중복 행이 제거되고, 모든 컬럼이 표준 포맷으로 정돈됩니다.

</div>

### 예제 2: 수식 디버깅 (Formula Debugging)

<div class="example-case">
<strong>상황 — 의도적으로 망가진 커미션 표</strong>

- C3 셀: 퍼센트가 **텍스트로 저장**되어 있어 `B3 * C3` 수식이 작동 안 함
- E4 셀: `B4 * C3` 처럼 **잘못된 셀 참조** (원래는 B4와 C4를 곱해야 함)
- E5 셀: 하드코딩된 **0.5** (50%) — 5%가 들어가야 할 자리

<strong>프롬프트</strong>

> "Fix the formula errors. Ensure the tiered commission logic is correct. Replace hard-coded numbers with cell references and standardize the commission formulas. Explain each fix."

<strong>결과</strong>

Claude가 각 오류를 식별해 수정하고, 수정 사유까지 "Issues found / Fixes applied" 표로 함께 돌려줍니다. 하드코딩된 숫자는 셀 참조로 바뀌어, 이후 원본 값만 바꿔도 전체가 재계산됩니다.

</div>

### 예제 3: 반품 데이터 패턴 분석

반품(return) 데이터 표에 이름·카테고리·반품 사유·반품까지 걸린 일수가 담겨 있습니다. 프롬프트:

> "Analyze this data set. Tell me the most common return reasons, which categories have highest return rates, and any patterns you notice in how quickly customers return items."

Claude가 돌려주는 인사이트 예시:

- **가장 흔한 반품 사유**: 사이즈 안 맞음(wrong size), 고장(stopped working), 배송 파손(damaged on arrival) 순
- **카테고리별 반품률**: 가전(home appliances) 반품 비용이 전자기기의 거의 2배
- **반품 속도**: 전자기기 평균 6.7일, 가전 평균 15.3일
- **개선 제안**: "사이즈 안 맞음"은 100% 의류 카테고리 문제 → 체크아웃에 핏 가이드를 붙이면 해결 가능

피벗테이블 없이도 이 정도 분석이 프롬프트 한 줄로 나옵니다.

### 예제 4: 차트 자동 생성

반품 데이터를 선택한 뒤 프롬프트:

> "Create a bar chart showing the total refund amount by category and a line chart showing the average days to return for each category. Place it in a new sheet called 'visuals'."

Claude가 **요약 집계 표를 먼저 만들고** → **막대 차트(bar chart)와 선 차트(line chart)를 자동으로 그려** 새 시트에 배치합니다. 범례(legend)와 축(axis) 라벨까지 정돈됩니다.

### 예제 5: 합성 데이터 50행 생성

실제 데이터가 없어서 엑셀 연습을 못 하는 초보자를 위한 예제입니다.

> "Generate 50 rows of synthetic customer data with those columns: customer ID, name, country, age, etc. Make it realistic and varied."

Claude가 **Customer ID, Name, Country, Age** 등 컬럼을 가진 50행짜리 표를 만들고, 행마다 색을 살짝 달리한 **깔끔한 레이아웃**으로 정리해 줍니다. 엑셀 연습용 더미 데이터 만들 때 유용합니다.

### 예제 6: 3년 재무 모델

<div class="example-case">
<strong>프롬프트</strong>

> "Create a simple three-year financial model with these sections: revenue forecast, cost of goods sold, operating expenses, gross profit, net profit. Assume starting revenue is $120K, annual growth is 15%, cost of goods sold is 40% of revenue, operating expenses $30K per year. Build the model with formulas and formatted cleanly."

<strong>결과</strong>

Claude가 매출(Revenue) → 매출원가(COGS, Cost of Goods Sold) → 영업비용(OPEX) → 매출총이익(Gross Profit) → 순이익(Net Profit) 순서로 **셀 참조 기반 수식**을 걸어 전체 모델을 만들어 줍니다.

시작 매출을 120K에서 150K로 바꾸기만 해도 모든 연도가 자동 재계산됩니다. 수식이 올바르게 연결됐다는 증거입니다.

</div>

### 예제 7: 기존 모델에 수식 추가

예제 6의 모델에 이어서 요청합니다.

> "Create a formula that calculates year-over-year revenue growth as a percentage. Add a new row."

Claude가 새 행을 삽입하고 **연도별 매출 증가율(YoY %)** 수식을 넣습니다. 원본 매출값을 300,000으로 바꾸면 증가율도 함께 바뀌는 것까지 확인됩니다.

### 예제 8: PDF → Excel 표 추출

이 예제가 가장 실용적입니다. 영수증·인보이스·보고서가 PDF로 올 때 손으로 다시 타이핑하는 작업을 제거합니다.

1. 채팅창의 **`+` 아이콘** → **Add files or photos** 클릭
2. 엉망으로 정리된 "sales report" PDF 업로드
3. 프롬프트 입력:

> "Extract all structured data from this PDF and convert it into a clean Excel table. Fix broken lines, merge split fields, and create proper columns. If the PDF contains multiple tables, combine them into one consistent data set."

결과: **인보이스 번호, 날짜, 클라이언트, 제품, 수량, 단가, 합계** 컬럼을 가진 깔끔한 표가 엑셀에 생성됩니다. 합계 컬럼에는 SUM 수식까지 걸립니다.

### 예제 9: 동적 재고 + 매출 + 대시보드 (최종 보스)

<div class="example-case">
<strong>상황</strong>

이 예제는 영상에서도 Opus 4.7로 **모델을 바꾸고** 진행합니다. 세 개의 시트가 서로 연동된 작은 시스템을 만드는 작업입니다.

1. **Inventory 시트**: 품목, 카테고리, 공급사, 현재 재고, 최소 재고
2. **Sales Log 시트**: 판매 기록
3. **Dashboard 시트**: 재고 현황, 요약 지표(Summary metrics), 재발주 리스트(Restock list)

<strong>결과 검증</strong>

- Inventory에서 **Widget A의 재고를 15로 바꾸면** (최소 재고 20 이하) → Dashboard의 Restock list에 자동으로 Widget A가 올라오고 "마이너스" 경고가 뜸.
- Inventory 재고를 200으로 올리면 → 재고 가치(Sale value)가 $700으로 자동 변경.
- Sales Log에서 Widget A의 판매 수량을 50으로 바꾸면 → Dashboard의 이익(Profit)이 $800대에서 $900대로 자동 상승.

세 시트가 **수식으로 연결**되어 한 값만 바꿔도 전체가 흐르듯 바뀌는, 흔히 말하는 "동적 대시보드"입니다.

</div>

## 처음 시작할 때 주의할 점

- **권한 팝업은 반드시 읽고 허용**: 데이터 손실이 가능한 작업(중복 제거, 셀 덮어쓰기)에서는 반드시 팝업이 뜹니다. "이번만 허용(Allow once)" 선택 전에 한 번 더 확인하세요.
- **모델 선택이 비용 차이를 만듭니다**: 대부분의 작업은 Sonnet이면 충분합니다. Opus 4.7은 무겁고 사용량(quota)을 많이 잡아먹으므로, 연동된 동적 시스템처럼 복잡한 작업에만 쓰세요.
- **범위를 먼저 드래그**: Claude에게 "이 표를 고쳐줘" 라고 하려면 **먼저 표 범위를 선택**한 상태로 프롬프트를 보내야 합니다. 그렇지 않으면 Claude가 엉뚱한 영역을 건드릴 수 있습니다.
- **프롬프트는 구체적으로**: "정리해줘"보다 "대소문자 통일, 중복 제거, 날짜 YYYY-MM-DD 표준화"처럼 **결과 형식을 함께 지정**할 때 품질이 올라갑니다.
- **원본은 복사본으로 작업**: 특히 수식 디버깅처럼 덮어쓰기가 들어가는 작업은 원본 파일을 백업한 뒤 복사본에서 시도하세요.

## 9가지 예제 요약표

| # | 예제 | 난이도 | 모델 추천 |
|---|------|--------|-----------|
| 1 | 데이터 청소 (대소문자·중복·날짜·이메일) | 쉬움 | Sonnet |
| 2 | 수식 디버깅 (텍스트 저장 %, 잘못된 참조) | 쉬움 | Sonnet |
| 3 | 반품 데이터 패턴 분석 | 중간 | Sonnet |
| 4 | 막대·선 차트 자동 생성 | 쉬움 | Sonnet |
| 5 | 합성 데이터 50행 생성 | 쉬움 | Sonnet |
| 6 | 3년 재무 모델 | 중간 | Sonnet |
| 7 | 기존 모델에 YoY 성장률 수식 추가 | 쉬움 | Sonnet |
| 8 | PDF → Excel 표 추출 | 중간 | Sonnet |
| 9 | 동적 재고·매출·대시보드 3시트 연동 | 어려움 | **Opus 4.7** |

## 정리

- **공식 Anthropic 애드인**을 Excel Add-ins에서 "Claude by Anthropic"으로 검색해 설치 → 계정 로그인 → 사이드 패널에서 바로 사용.
- **범위 선택 → 프롬프트 입력 → 권한 허용**의 3단계가 모든 작업의 공통 흐름입니다. 대부분의 반복 업무가 이 흐름 안에서 끝납니다.
- 단순 작업은 Sonnet, **3시트 이상 연동되는 동적 시스템은 Opus 4.7** 로 모델을 올려 쓰세요. PDF → 표 추출과 동적 대시보드는 혼자 손으로 하면 몇 시간 걸릴 작업을 프롬프트 한 줄로 처리합니다.

---

참고 영상: [How to Use Claude Inside Excel (9 Examples – Step-by-Step) 2026](https://youtube.com/watch?v=KS3H8ClXu_c)
