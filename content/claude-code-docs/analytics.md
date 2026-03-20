---
title: "팀 사용량 분석 — Claude Code 활용 현황 파악하기"
source: "https://code.claude.com/docs/en/analytics"
order: 51
tags: ["엔터프라이즈", "분석", "기업·개발자", "Analytics"]
---

# 팀 사용량 분석 — Claude Code 활용 현황 파악하기

분석 대시보드는 조직의 Claude Code 활용 현황을 한눈에 파악할 수 있는 "성적표"입니다. 개발자들이 얼마나 자주 Claude Code를 사용하는지, 어느 정도 코드를 작성하는 데 도움받고 있는지, 어떤 팀원이 가장 잘 활용하고 있는지를 데이터로 확인할 수 있습니다.

---

## 대시보드 접근 방법

| 플랜 | 대시보드 주소 | 포함 내용 |
|------|--------------|-----------|
| **Teams / Enterprise** | [claude.ai/analytics/claude-code](https://claude.ai/analytics/claude-code) | 사용 지표, GitHub 연동 기여 지표, 리더보드, 데이터 내보내기 |
| **API (콘솔)** | [platform.claude.com/claude-code](https://platform.claude.com/claude-code) | 사용 지표, 지출 추적, 팀 인사이트 |

---

## Teams / Enterprise 대시보드

관리자(Admin)와 소유자(Owner) 역할만 대시보드를 볼 수 있습니다.

### 주요 지표

| 지표 | 설명 |
|------|------|
| **수락된 코드 줄 수** | 사용자가 Claude Code의 제안을 수락한 총 코드 줄 수 |
| **제안 수락률** | Claude Code 코드 편집 제안 중 사용자가 수락한 비율 |
| **일별 활성 사용자** | 하루에 Claude Code를 사용한 사람 수 |
| **PR with CC** | Claude Code가 관여된 머지된 풀 리퀘스트 수 |
| **Claude Code 포함 코드 줄** | Claude Code의 도움으로 작성된 머지된 코드 줄 수 |

---

## GitHub 연동 기여 지표 활성화

기본 사용량 데이터는 모든 계정에서 바로 확인할 수 있습니다. "Claude Code가 실제로 커밋/PR에 얼마나 기여했는가"를 측정하려면 GitHub 연동이 필요합니다.

> **참고**: 기여 지표는 조직의 claude.ai 계정 내 사용자만 포함합니다. API나 서드파티 통합을 통한 사용은 포함되지 않습니다.

> **주의**: Zero Data Retention이 활성화된 조직은 기여 지표를 사용할 수 없습니다.

### 설정 단계

**1단계**: GitHub 관리자가 [github.com/apps/claude](https://github.com/apps/claude)에서 GitHub 앱을 조직에 설치합니다.

**2단계**: Claude 소유자가 [claude.ai/admin-settings/claude-code](https://claude.ai/admin-settings/claude-code)에서 Claude Code 분석 기능을 활성화합니다.

**3단계**: 같은 페이지에서 "GitHub analytics" 토글을 활성화합니다.

**4단계**: GitHub 인증 흐름을 완료하고 분석에 포함할 GitHub 조직을 선택합니다.

데이터는 활성화 후 24시간 내에 표시되기 시작하며, 매일 업데이트됩니다.

---

## 대시보드 지표 상세 설명

### 요약 지표 (대시보드 상단)

> 이 지표들은 보수적으로 계산되어 Claude Code의 실제 영향을 **과소평가**하는 경향이 있습니다.

| 지표 | 설명 |
|------|------|
| **PRs with CC** | Claude Code가 작성한 코드를 1줄 이상 포함한 머지된 PR 총 수 |
| **Lines of code with CC** | 머지된 PR 중 Claude Code가 작성한 코드 줄 수 (3글자 이상의 실질적 줄만 집계) |
| **PRs with Claude Code (%)** | 전체 머지된 PR 중 Claude Code 포함 비율 |
| **Suggestion accept rate** | Edit, Write, NotebookEdit 도구 사용 중 수락 비율 |
| **Lines of code accepted** | 세션에서 수락된 총 코드 줄 수 (삭제된 줄은 추적하지 않음) |

### 차트별 설명

#### 도입 현황 (Adoption)
시간에 따른 일별 사용 추이:
- **users**: 일별 활성 사용자 수
- **sessions**: 하루 동안의 Claude Code 세션 수

#### 사용자별 PR 수 (PRs per user)
시간에 따른 개인 개발자 활동:
- 일별 머지된 PR 수 ÷ 일별 활성 사용자 수
- Claude Code 도입 증가에 따른 개인 생산성 변화 추적에 유용

#### PR 분류 (Pull requests)
머지된 PR의 일별 분류:
- **PRs with CC**: Claude Code 코드가 포함된 PR
- **PRs without CC**: Claude Code 없이 작성된 PR
- "Lines of code" 뷰로 전환하면 코드 줄 수 기준으로도 볼 수 있습니다

#### 상위 기여자 (Leaderboard)
기여 규모별 상위 10명. "Pull requests" 또는 "Lines of code" 기준으로 토글 가능합니다. **Export all users** 버튼으로 전체 사용자 데이터를 CSV로 내려받을 수 있습니다.

---

## PR 귀속(Attribution) 방식

### 어떤 PR이 "Claude Code 포함"으로 태깅되나요?

PR이 머지될 때 시스템은 다음 과정으로 분석합니다:
1. PR 변경사항(diff)에서 추가된 줄을 추출합니다.
2. 해당 파일을 수정한 Claude Code 세션을 시간 범위 내에서 탐색합니다.
3. Claude Code 출력과 PR 코드를 다양한 방식으로 비교합니다.
4. AI 보조 줄과 전체 줄에 대한 지표를 계산합니다.

비교 전 코드 정규화: 앞뒤 공백 제거, 연속 공백 축소, 따옴표 표준화, 소문자 변환.

Claude Code가 도운 코드를 포함한 PR은 GitHub에서 `claude-code-assisted` 라벨로 태깅됩니다.

### 귀속 시간 범위
PR 머지 날짜로부터 **21일 전 ~ 2일 후** 세션이 귀속 매칭에 포함됩니다.

### 제외되는 파일
자동 생성 파일은 분석에서 자동 제외됩니다:
- 잠금 파일: `package-lock.json`, `yarn.lock`, `Cargo.lock` 등
- 생성된 코드: Protobuf 출력, 빌드 아티팩트, 압축 파일
- 빌드 디렉토리: `dist/`, `build/`, `node_modules/`, `target/`
- 테스트 픽스처: 스냅샷, 카세트, 목 데이터
- 1,000자 초과 줄 (압축/생성 코드 가능성이 높음)

### 추가 귀속 기준
- 개발자가 20% 이상 수정한 코드는 Claude Code 귀속에서 제외됩니다.
- 21일 범위 밖의 세션은 고려되지 않습니다.

---

## API 고객용 콘솔 대시보드

API로 Claude Code를 사용하는 경우 [platform.claude.com/claude-code](https://platform.claude.com/claude-code)에서 확인합니다. UsageView 권한이 있는 Developer, Billing, Admin, Owner, Primary Owner 역할이 접근할 수 있습니다.

> GitHub 연동 기여 지표는 API 고객에게 현재 제공되지 않습니다.

### 콘솔 대시보드 내용

- **수락된 코드 줄 수**: 사용자가 수락한 총 코드 줄 수
- **제안 수락률**: Edit, Write, NotebookEdit 도구 수락 비율
- **활동**: 일별 활성 사용자 및 세션 차트
- **지출**: 사용자 수와 함께 표시된 일별 API 비용 (달러)

### 팀 인사이트 표

| 열 | 설명 |
|----|------|
| **Members** | Claude Code 인증 사용자 (API 키 사용자는 키 ID로, OAuth는 이메일로 표시) |
| **Spend this month** | 이번 달 사용자별 API 비용 |
| **Lines this month** | 이번 달 사용자별 수락된 코드 줄 수 |

> 콘솔의 지출 수치는 분석용 추정값입니다. 실제 청구 금액은 청구 페이지에서 확인하세요.

---

## 분석 데이터 활용 방법

### ROI 증명

팀장이나 경영진에게 Claude Code 투자 효과를 보여주려면:
- 도입 전후 사용자별 PR 수 비교
- Claude Code 포함/미포함 PR 비율 추이
- DORA 지표, 스프린트 속도 등 기존 엔지니어링 KPI와 병행 분석

### 도입 현황 모니터링

도입 차트와 사용자 수를 추적해:
- 모범 사례를 공유할 수 있는 활발한 사용자 파악
- 조직 전체 도입 추이 확인
- 마찰이나 문제를 나타낼 수 있는 사용량 하락 감지

### 핵심 사용자 파악

리더보드로 Claude Code를 많이 활용하는 팀원을 찾아 다음을 부탁하세요:
- 팀에 프롬프트 작성 기법과 워크플로 공유
- 잘 되는 점에 대한 피드백 제공
- 신규 사용자 온보딩 지원

### 프로그래밍 방식 데이터 접근

GitHub에서 `claude-code-assisted` 라벨로 태깅된 PR을 검색해 자체 분석 도구와 연동할 수 있습니다.

---

## 예시 케이스

**상황**: 개발팀장이 분기마다 "AI 도구 투자가 효과 있나요?"라는 질문을 경영진으로부터 받습니다. 직감이 아닌 데이터로 답하고 싶습니다.

**해결책**:
1. GitHub 앱 연동을 설정해 기여 지표를 활성화합니다.
2. 도입 후 3개월간 "PRs per user" 차트를 캡처해 개인 생산성 변화를 추적합니다.
3. "Pull requests" 차트에서 Claude Code 포함 PR 비율이 월별로 증가하는 것을 확인합니다.
4. "Export all users"로 전체 데이터를 내려받아 경영진 보고서에 삽입합니다.

결과: "도입 6개월 후 개발자당 월 PR 수가 23% 증가, 전체 코드의 45%가 Claude Code 도움으로 작성됨"과 같은 구체적인 데이터로 ROI를 증명할 수 있습니다.

---

## 관련 자료

- [OpenTelemetry 모니터링 가이드](/en/monitoring-usage)
- [비용 효율적으로 관리하기](/en/costs)
- [권한 및 역할 설정](/en/permissions)
