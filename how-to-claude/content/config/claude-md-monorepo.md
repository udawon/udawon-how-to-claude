---
date: "2026-03-28"
title: "모노레포에서 CLAUDE.md 쪼개기"
description: "서비스가 여러 개인 프로젝트에서 CLAUDE.md가 너무 커졌을 때, 폴더별로 나눠서 관리하는 방법"
order: 7
tags: ["설정", "CLAUDE.md", "활용법", "워크플로우"]
source_url: "https://dev.to/anvodev/how-i-organized-my-claudemd-in-a-monorepo-with-too-many-contexts-37k7"
---

## 이게 뭔가요?

CLAUDE.md(Claude Code가 세션 시작 시 자동으로 읽는 설정 파일)가 너무 길어지면, Claude가 앞부분 규칙만 읽고 뒷부분은 무시합니다. 특히 **모노레포(monorepo, 프론트엔드·백엔드·공통 라이브러리 등 여러 서비스를 하나의 폴더에 모아 관리하는 방식)**에서는 이 문제가 심각해집니다.

해결책은 하나의 거대한 설명서를 만드는 대신, **서비스 폴더마다 그 서비스에 맞는 설명서를 따로 두는 것**입니다.

> **비유:** 대형 마트에 "전체 직원 매뉴얼 한 권"을 주는 대신, 식품부 직원에게는 "식품부 매뉴얼", 의류부 직원에게는 "의류부 매뉴얼"을 주는 것과 같습니다. 각자 자기 일에 집중할 수 있고, 매뉴얼도 훨씬 얇아집니다.

## 왜 알아야 하나요?

프론트엔드 코드를 고칠 때 백엔드 규칙까지 Claude가 읽으면, 정작 중요한 규칙을 놓칠 수 있습니다. 또한 CLAUDE.md가 길수록 Claude의 응답 품질이 떨어집니다.

실제 사례: 한 개발자의 CLAUDE.md가 **47,000단어**까지 불어난 상황에서 Claude가 경고를 표시했습니다. 권장 크기는 10,000단어 미만입니다. 계층적 분리 후 메인 CLAUDE.md를 9,000단어로 줄였습니다(80% 감소).

모노레포가 없는 단일 프로젝트라면 이 방법이 필요 없습니다. 단일 프로젝트의 기본 CLAUDE.md 설정은 [CLAUDE.md 설정 문서](/config/claude-md)를 참고하세요.

## 어떻게 하나요?

### 방법 1: 폴더별 CLAUDE.md 파일 분리 (가장 효과적)

Claude Code는 현재 작업 중인 파일의 **상위 폴더를 따라 올라가며** CLAUDE.md를 자동으로 찾아 읽습니다. 이 특성을 활용하면 됩니다.

**폴더 구조 예시:**

```
내-프로젝트/
├── CLAUDE.md             ← 전체 프로젝트 공통 규칙 (9,000단어 이내)
├── frontend/
│   ├── CLAUDE.md         ← 프론트엔드 전용 규칙 (7,000~8,000단어)
│   └── src/...
├── backend/
│   ├── CLAUDE.md         ← 백엔드 전용 규칙 (7,000~8,000단어)
│   └── src/...
└── core/
    ├── CLAUDE.md         ← 공통 라이브러리 전용 규칙
    └── src/...
```

**동작 방식:**

- `frontend/src/Button.tsx`를 편집할 때 → `frontend/CLAUDE.md` + 루트 `CLAUDE.md` 자동 로드
- `backend/src/api.ts`를 편집할 때 → `backend/CLAUDE.md` + 루트 `CLAUDE.md` 자동 로드
- 두 CLAUDE.md가 충돌하면 **더 가까운 폴더(서비스별)가 우선**

<div class="example-case">
<strong>예시: 루트 CLAUDE.md vs 서비스별 CLAUDE.md 역할 분리</strong>

**루트 CLAUDE.md** (모든 서비스에 공통 적용):
```
## 공통 규칙
- 응답 언어: 한국어
- 커밋 메시지: 한국어
- 보안: API 키를 코드에 직접 쓰지 않는다
- 테스트 없이 배포하지 않는다
```

**frontend/CLAUDE.md** (프론트엔드 작업 시에만 적용):
```
## 프론트엔드 규칙
- UI 라이브러리: shadcn/ui + Tailwind CSS
- 모바일 우선 반응형 필수
- 컴포넌트는 500줄을 넘으면 분리한다
- TypeScript any 타입 사용 금지
```

**backend/CLAUDE.md** (백엔드 작업 시에만 적용):
```
## 백엔드 규칙
- DB 쿼리는 반드시 트랜잭션 처리
- API 응답 형식: { data, error, status }
- 로그는 구조화된 JSON 형식으로
```

→ 프론트엔드 작업 시 백엔드 DB 규칙을 읽느라 시간 낭비 없음
→ 각 CLAUDE.md가 10,000단어 이내로 유지됨

</div>

### 방법 2: @ 참조로 긴 섹션 분리

폴더 분리까지는 아니지만, 하나의 CLAUDE.md 안에서 내용을 다른 파일로 빼고 참조만 남기는 방법입니다.

```markdown
# CLAUDE.md

## 프로젝트 개요
@README.md

## API 설계 규칙
@docs/api-conventions.md

## 공통 규칙
- 언어: 한국어
- 보안: .env 파일에만 API 키 저장
```

<div class="example-case">
<strong>예시: 무거운 규칙 분리하기</strong>

기존: CLAUDE.md 안에 200줄짜리 코드 스타일 가이드가 그대로 포함됨
→ Claude가 앞쪽 내용만 읽고 뒤쪽 스타일 가이드 무시

개선:
```markdown
# CLAUDE.md (30줄 이내로 유지)
- 코드 스타일: @.claude/code-style.md
- 테스트 규칙: @.claude/testing.md
- 보안 체크리스트: @.claude/security.md
```

→ CLAUDE.md는 간결, 세부 규칙은 별도 파일
→ 모든 규칙이 안정적으로 적용됨

</div>

## 실전 예시

<div class="example-case">
<strong>실전 케이스: SaaS 제품 모노레포 구성</strong>

**상황:** 웹 앱(Next.js), API 서버(Node.js), 공통 타입 라이브러리를 하나의 저장소(repository, 코드를 저장하는 공간)에서 관리 중. CLAUDE.md가 계속 커지면서 Claude 응답이 불안정해짐.

**폴더 구조:**
```
my-saas/
├── CLAUDE.md                    ← 공통: 언어, 보안, 배포 규칙
├── apps/
│   └── web/
│       ├── CLAUDE.md            ← Next.js, Tailwind, 컴포넌트 규칙
│       └── src/
├── services/
│   └── api/
│       ├── CLAUDE.md            ← Express, DB 트랜잭션, API 규칙
│       └── src/
└── packages/
    └── types/
        ├── CLAUDE.md            ← 타입 정의, 버전 관리 규칙
        └── src/
```

**결과:**
- 루트 CLAUDE.md: 기존 35,000단어 → 8,000단어
- 각 서비스별 CLAUDE.md: 5,000~7,000단어
- Claude 응답 일관성 눈에 띄게 향상

</div>

<div class="example-case">
<strong>실전 케이스: 어떤 내용을 어디에 쓸까?</strong>

**루트 CLAUDE.md에 쓸 것:**
- 응답 언어 (한국어)
- 보안 규칙 (API 키 관리 방법)
- Git 커밋 메시지 형식
- 모델 전환 규칙

**서비스별 CLAUDE.md에 쓸 것:**
- 해당 서비스에서 사용하는 기술 스택
- 해당 서비스의 폴더 구조 설명
- 해당 서비스에만 적용되는 코딩 규칙
- 자주 실행하는 명령어 (예: `npm run dev`, `npm test`)

**쓰지 말아야 할 것 (어디에도):**
- 오래된 규칙 (더 이상 쓰지 않는 라이브러리 설명)
- "Claude가 없어도 어기지 않을" 당연한 규칙
- 한 번도 문제가 된 적 없는 규칙

</div>

## 주의할 점

- **깊은 폴더일수록 가까운 CLAUDE.md가 우선** — 루트 규칙과 서비스 규칙이 충돌하면 서비스 규칙이 이깁니다. 의도적으로 오버라이드(덮어쓰기)하는 것이 아니라면 루트에 둘 내용과 서비스별로 둘 내용을 명확히 구분하세요.
- **분리한다고 무조건 좋은 건 아님** — 서비스가 2개 이하이거나, 각 CLAUDE.md가 10,000단어를 넘지 않는다면 굳이 분리할 필요 없습니다.
- **루트 CLAUDE.md는 최대한 짧게** — 모든 서비스에서 로드되므로, 진짜 공통 규칙만 남기세요.
- **처음부터 완벽하게 짤 필요 없음** — 작업하다가 "이 규칙은 프론트엔드에만 해당되네"라는 생각이 들면 그때 분리해도 됩니다.

## 정리

- 모노레포(여러 서비스를 한 폴더에서 관리)에서 CLAUDE.md가 커지면 Claude 성능이 저하됩니다.
- 각 서비스 폴더 안에 별도 CLAUDE.md를 두면, 해당 서비스 편집 시에만 관련 규칙이 로드됩니다.
- 루트에는 공통 규칙만, 서비스별 폴더에는 해당 서비스 전용 규칙만 — 이 원칙 하나로 관리가 쉬워집니다.

## 출처

- [How I organized my CLAUDE.md in a monorepo with too many contexts](https://dev.to/anvodev/how-i-organized-my-claudemd-in-a-monorepo-with-too-many-contexts-37k7) — An Vo, dev.to
