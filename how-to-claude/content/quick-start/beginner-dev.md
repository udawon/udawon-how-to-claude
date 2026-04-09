---
title: "초보: 기술 스택을 정한 개발자"
description: "Next.js + Supabase처럼 방향이 정해졌을 때 — 빠르게 프로젝트를 세팅하고 개발하는 흐름"
order: 2
tags: ["초보", "개발자", "기술스택", "프로젝트", "시작"]
---

## 내 레벨 확인하기

| 레벨 | 나는 이런 사람 | 가이드 |
|------|--------------|--------|
| **👶 왕초보** | 코드를 전혀 모름. 아이디어만 있음 | [왕초보 가이드](/docs/quick-start/total-cycle) |
| **🌱 초보** (지금 보는 문서) | 기술 스택은 정했고 바로 시작하고 싶음 | 이 문서 |
| **🌿 중급** | 기존 프로젝트에 합류했거나 복잡한 기능을 다룸 | [중급 가이드](/docs/quick-start/intermediate) |
| **🌳 고급** | CI/CD, 테스트 전략, 대규모 프로젝트를 운영 | [고급 가이드](/docs/quick-start/advanced) |

> "Next.js + Supabase로 카페 예약 사이트 만들 거야" 처럼 방향이 정해진 경우.

---

## 전체 흐름 미리보기

```
[터미널] create-next-app + claude
    ↓
[/init] CLAUDE.md 자동 생성 + 보완
    ↓
[Plan Mode] 빠른 설계
    ↓
[Worktree] 기능별 병렬 개발 (필요시)
    ↓
[ultrathink] 복잡한 부분 깊이 분석
    ↓
[커밋 + PR]
```

---

## 1단계: 프로젝트 초기화

```bash
mkdir cafe-booking && cd cafe-booking
npx create-next-app@latest . --typescript --tailwind --app
claude
```

이미 사용할 프레임워크를 알고 있으니, 직접 프로젝트를 생성한 후 Claude를 실행합니다.

---

## 2단계: /init으로 CLAUDE.md 자동 생성

```
/init
```

Claude가 프로젝트를 분석해서 CLAUDE.md 초안을 만들어줍니다. 여기에 추가로:

"<span class="keyword-highlight">CLAUDE.md에 이것도 추가해줘</span>:
 - Supabase를 DB로 사용
 - 한국어로 응답
 - 컴포넌트는 src/components/ 에 분리"

> **왕초보와의 차이:**
> 왕초보는 인터뷰를 통해 SPEC.md → CLAUDE.md 순서로 진행하지만,
> 초보 개발자는 이미 방향이 정해져 있으니 `/init`으로 빠르게 시작합니다.

---

## 3단계: Plan Mode로 빠르게 설계

<kbd>Shift</kbd>+<kbd>Tab</kbd>을 눌러 Plan Mode로 전환

"카페 예약 시스템 설계해줘.
 Supabase 테이블 구조, API 라우트, 컴포넌트 구조 포함.
 @SPEC.md 있으면 참고해."

마음에 들면 <kbd>Shift</kbd>+<kbd>Tab</kbd>을 눌러 기본 모드로 전환 후 구현.

> **Plan Mode에서 할 수 있는 것:**
> - Claude가 코드를 직접 수정하지 않고 계획만 세움
> - <kbd>Ctrl</kbd>+<kbd>G</kbd>로 외부 에디터에서 계획을 직접 수정 가능
> - 계획에 동의하면 기본 모드로 돌아가서 구현 시작

---

## 4단계: 기능별 Worktree로 병렬 개발

여러 기능을 동시에 개발해야 한다면:

```bash
# 터미널 1: 예약 UI 개발
claude --worktree feature-booking-ui

# 터미널 2: 관리자 페이지 개발
claude --worktree feature-admin-panel
```

두 작업이 완전히 분리된 환경에서 진행
서로 파일 충돌 없음

> **Worktree란?**
> Git의 기능으로, 한 저장소에서 여러 브랜치를 동시에 작업할 수 있는 독립된 폴더를 만들어줍니다.
> Claude가 자동으로 브랜치와 작업 폴더를 생성하고 관리합니다.

### Worktree 사용 시 주의사항

- 각 터미널에서 별도의 Claude 세션이 실행됨
- 작업이 끝나면 Claude가 Worktree를 유지할지 삭제할지 물어봄
- 기능이 완성되면 PR을 만들어 메인 브랜치에 병합

---

## 5단계: 복잡한 부분은 ultrathink

"<span class="keyword-highlight">ultrathink</span> - 동시에 같은 시간대에 예약이 들어오면
 어떻게 처리해야 하지? Supabase에서 트랜잭션 처리 방법과
 낙관적 락 vs 비관적 락 트레이드오프 분석해줘."

> **ultrathink는 언제 쓰나요?**
> 복잡한 아키텍처 결정, 버그 추적, 트레이드오프 분석 등
> Claude가 깊이 생각해야 하는 상황에서 사용합니다.
> 프롬프트에 "ultrathink"를 넣으면 Claude가 더 깊이 사고합니다.

---

## 6단계: 커밋 + PR

```
"이 기능 구현이 끝났으니 커밋해줘.
 커밋 메시지는 한국어로, PR도 만들어줘."
```

Claude가 자동으로:
- 변경 파일을 분석해서 의미있는 커밋 메시지 작성
- GitHub PR 생성 (제목 + 설명 포함)
- PR 리뷰 관련 프롬프트에서는 `claude --from-pr 123`으로 세션 재개 가능

---

## 초보 개발자를 위한 추가 팁

### CLAUDE.md를 점점 발전시키기

프로젝트를 진행하면서 패턴이 보이면 CLAUDE.md에 추가하세요:

```markdown
## 발견한 규칙들
- API 라우트는 항상 try-catch로 감싸기
- 컴포넌트 이름은 PascalCase
- 에러 메시지는 사용자 친화적으로 작성
```

### 세션 관리 전략

| 상황 | 액션 |
|------|------|
| 오늘 할 작업 시작 | `/rename 날짜-기능명` |
| 중간에 다른 일 해야 할 때 | 새 터미널에서 `claude` 실행 |
| 내일 이어서 할 때 | `claude --resume 세션이름` |
| PR 리뷰어 코멘트 대응 | `claude --from-pr PR번호` |

### 코드 리뷰 받기

Writer-Reviewer 패턴을 활용하세요:
1. 기능 구현 세션 (Writer) — 코드를 작성
2. 새 세션 (Reviewer) — 코드를 냉정하게 리뷰

```
"@src/ 폴더 전체를 리뷰해줘.
 보안 취약점, 성능 문제, 코드 스타일 위반을 찾아줘.
 처음 보는 코드라고 생각하고 냉정하게."
```
