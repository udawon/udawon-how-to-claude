---
title: "세션 관리 & 재개"
description: "이름 붙이기, 재개, PR 연결로 작업 흐름을 끊김 없이 이어가는 방법"
order: 5
tags: ["워크플로우", "세션", "재개", "이름", "병렬작업"]
---

## 왜 세션 관리가 중요한가?

Claude Code는 세션을 자동으로 저장합니다. 이를 활용하면 여러 날에 걸친 작업이나 여러 기능을 동시에 개발할 때 컨텍스트를 잃지 않을 수 있습니다.

```
세션 관리 없이:
월요일: "결제 기능 만들어줘" (작업 중단)
화요일: Claude를 다시 열면 → 처음부터 다시 설명해야 함
        "저번에 어디까지 했지... 결제 기능이었는데..."

세션 관리 활용:
월요일: "결제 기능 만들어줘" + /rename payment-feature
화요일: claude --resume payment-feature
        → 바로 이어서 작업 시작

비유: 책에 책갈피 꽂기
     책갈피가 없으면 매번 처음부터 찾아야 함
```

---

## 세션에 이름 붙이기: /rename

작업 중에 세션에 기억하기 쉬운 이름을 붙입니다.

```
사용법:
/rename [이름]

예시:
/rename auth-refactor
/rename payment-v2
/rename bugfix-login-issue
/rename admin-dashboard

언제 실행하면 좋은가:
- 세션을 시작하고 작업 방향이 잡혔을 때
- "이 작업이 오늘 안에 끝나지 않겠구나" 싶을 때
- 동시에 여러 작업을 병행할 때

예시 케이스:
나: "OAuth 구현을 시작할게. 구글, 카카오, 네이버 로그인"
Claude: (작업 시작)
나: /rename oauth-integration
-> 이제 나중에 claude --resume oauth-integration으로 바로 돌아올 수 있음
```

---

## 세션 재개하기

### 가장 최근 세션으로 돌아가기

```
bash 터미널에서:
claude --continue

언제 사용:
- "아, 어제 작업 이어서 해야 하는데" 할 때
- 방금 닫은 세션에 빨리 돌아갈 때
```

### 특정 세션 이름으로 재개

```
bash 터미널에서:
claude --resume oauth-integration
claude --resume payment-v2

언제 사용:
- 여러 기능을 병행 개발 중일 때
- 오래된 작업으로 돌아갈 때
```

### 세션 목록에서 선택

```
bash 터미널에서:
claude --resume
(이름 없이 실행하면 선택 화면이 나옴)

선택 화면 단축키:
↑/↓    : 세션 이동
P      : 해당 세션 미리보기
R      : 세션 이름 바꾸기
/      : 이름으로 검색
B      : 현재 git 브랜치의 세션만 보기
Enter  : 선택한 세션으로 재개
Esc    : 취소

예시 케이스:
여러 기능을 동시에 개발 중:
- payment-v2 (결제 기능)
- auth-refactor (인증 리팩토링)
- bugfix-cart (장바구니 버그)

claude --resume 실행 후 선택 화면에서
오늘 작업할 세션을 골라서 바로 시작
```

---

## PR과 세션 연결하기

PR을 생성하면 세션이 자동으로 그 PR에 연결됩니다.

```
일반 흐름:
나: "변경사항 커밋하고 PR 만들어줘"
Claude: PR #123 생성 완료

다음에 이 PR 작업을 이어서 할 때:
claude --from-pr 123
-> PR #123 관련 세션이 자동으로 재개됨

예시 케이스:
리뷰어가 PR에 코멘트를 달았을 때:
1. claude --from-pr 123
2. "리뷰어가 이런 코멘트를 달았어: [코멘트 내용]. 수정해줘"
-> PR 컨텍스트가 살아있어서 빠르게 수정 가능

비유: 메모에 "PR #123 관련 작업" 이라고 써두는 것
     나중에 그 메모를 보고 바로 이어서 작업
```

---

## Git Worktree로 진정한 병렬 작업

여러 기능을 완전히 독립적인 환경에서 동시에 개발합니다.

```
문제 상황:
같은 폴더에서 두 가지 작업을 번갈아 하면?
-> 파일이 섞임, 브랜치 충돌, 컨텍스트 오염

해결: Worktree
각 작업이 완전히 분리된 폴더와 브랜치를 가짐
```

### 기본 사용법

```bash
# 터미널에서:

# 기능 개발 작업 시작 (새 폴더 + 새 브랜치 자동 생성)
claude --worktree feature-auth

# 버그 수정 작업을 별도 환경에서 시작
claude --worktree bugfix-payment
```

```
예시 케이스:
오전에는 새 기능 개발:
claude --worktree feature-dark-mode
-> .claude/worktrees/feature-dark-mode/ 폴더에서 작업
-> 브랜치: worktree-feature-dark-mode

오후에는 긴급 버그 수정:
claude --worktree bugfix-checkout-error
-> .claude/worktrees/bugfix-checkout-error/ 폴더에서 작업
-> 브랜치: worktree-bugfix-checkout-error

두 작업이 완전히 분리되어 서로 영향 없음!

비유: 두 개의 작업실을 갖는 것
     방 A에서 회화 작업, 방 B에서 조각 작업
     서로의 재료나 도구가 섞이지 않음
```

### 마무리 시 정리

```
Worktree 세션을 닫을 때:
- 변경사항이 없으면: 폴더와 브랜치가 자동 삭제
- 변경사항이 있으면: "유지할까요? 삭제할까요?" 선택

주의: .gitignore에 추가 권장
.claude/worktrees/
```

---

## 세션 관리 실전 패턴

### 기능별 세션 분리

```
월요일:
claude (새 세션 시작)
"결제 기능 구현 시작"
/rename feature-payment

화요일:
claude (새 세션 시작)
"인증 리팩토링 시작"
/rename refactor-auth

수요일:
어제 결제 기능 이어서:
claude --resume feature-payment

목요일:
인증 리팩토링 이어서:
claude --resume refactor-auth
```

### 장기 프로젝트 관리

```
대형 기능 (2주짜리):
Week 1: claude --worktree big-feature-redesign
Week 2: claude --resume (계속 같은 세션 사용)

중간에 긴급 이슈가 생겨도:
claude --worktree hotfix-critical
-> 리디자인 작업과 완전히 분리
-> 핫픽스 완료 후 리디자인으로 돌아오기
```
