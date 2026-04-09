---
title: "반복 작업 자동화: 승인 없애기 & 단축 명령"
description: "매번 승인하거나 긴 문장을 입력하는 번거로움을 없애는 두 가지 설정"
order: 6
tags: ["설정", "자동화", "스킬", "권한", "Git"]
---

Claude Code를 쓰다 보면 같은 작업을 반복할 때 두 가지 번거로움이 생깁니다.

번거로움 1: 매번 긴 문장 입력
"깃 커밋 후 푸시해줘"
"코드 리뷰해줘"
"빌드하고 실행해줘"
→ 매번 타이핑

번거로움 2: 승인 클릭
Claude가 `git commit`을 실행하려 할 때
→ 허용하시겠습니까? \[Y/N\]
→ 매번 클릭

두 가지를 각각 해결하는 방법이 있습니다.

## 해결책 1 — 명령어 자동 승인 (승인 클릭 제거)

### 어떻게 동작하나요?

설정 전:
Claude: "`git commit` 실행할게요"
팝업: \[허용\] \[거부\]  ← 매번 클릭 필요

설정 후:
Claude: "`git commit` 실행할게요"
→ 바로 실행  ← 클릭 불필요

### 설정 방법

프로젝트 폴더의 `.claude/settings.local.json` 파일에 추가합니다.

```json
{
  "permissions": {
    "allow": [
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git push *)",
      "Bash(git status *)",
      "Bash(git log *)",
      "Bash(git diff *)"
    ]
  }
}
```

> **주의:** `settings.local.json`은 이 프로젝트에만 적용됩니다.
> 모든 프로젝트에 적용하려면 `~/.claude/settings.json`에 추가하세요.

### 패턴 문법

```
"Bash(git commit *)"
       ↑          ↑
   명령어 시작   뒤에 어떤 옵션이 오든 허용

"Bash(git commit -m *)"  <- -m 옵션이 있을 때만 허용 (더 엄격)
"Bash(npm run *)"        <- npm run 뭐든 허용
"Bash(rm *)"             <- rm 명령어 전체 허용 (주의해서 사용)
```

> **주의:** 명령어와 `*` 사이에 **공백**이 있어야 합니다.
> `Bash(git commit *)` (O) vs `Bash(git commit*)` (X)

---

## 해결책 2 — 커스텀 스킬 (타이핑 단축)

### 어떻게 동작하나요?

설정 전:
채팅창: "깃 커밋 후 푸시해줘" (12글자)

설정 후:
채팅창: `/push` (5글자)
→ Claude가 자동으로 변경사항 파악 → 커밋 메시지 작성 → commit + push

### 스킬 파일 만들기

`~/.claude/skills/` 폴더에 마크다운 파일을 만들면 `/파일명`으로 실행됩니다.

**파일 경로:** `~/.claude/skills/push.md`

```markdown
# /push — 커밋 & 푸시 자동화

사용자가 `/push`를 실행하면 아래 절차를 자동으로 수행한다.

## 실행 절차

1. `git status`로 변경 파일 확인
2. 변경 파일이 없으면 "커밋할 변경사항이 없습니다"라고 말하고 종료
3. `git diff --stat`으로 변경 내용 파악
4. 변경 내용을 바탕으로 한국어 커밋 메시지 자동 작성
5. 관련 파일만 `git add`로 스테이징 (.env, 시크릿 파일 제외)
6. `git commit` 실행
7. `git push` 실행

## 커밋 메시지 규칙

- 한국어로 작성
- 변경 내용 보고 의미 있는 메시지 자동 생성
- 접두사: 새 기능=`기능 추가`, 수정=`수정`, 문서=`문서 업데이트`
```

이 파일을 저장하면 `~/.claude/skills/push.md` → `/push` 명령으로 사용 가능합니다.

### 스킬 파일 구조

스킬 파일 = Claude에게 주는 지침서

파일 이름 → 슬래시 명령어
- `push.md`         → `/push`
- `code-review.md`  → `/code-review`
- `deploy.md`       → `/deploy`

파일 내용 → Claude가 실행할 절차

```
# 제목
언제 실행하는지 설명

## 절차
1. 이것을 해라
2. 저것을 해라
3. 결과를 이렇게 출력해라
```

### 스킬 저장 위치

- `~/.claude/skills/push.md` ← 모든 프로젝트에서 사용 가능
- `프로젝트/.claude/skills/push.md` ← 이 프로젝트에서만 사용 가능

---

## 두 가지를 함께 설정하면

설정 전:
1. 채팅창에 "깃 커밋 후 푸시해줘" 입력
2. `git status` 승인 클릭
3. `git add` 승인 클릭
4. `git commit` 승인 클릭
5. `git push` 승인 클릭

설정 후:
1. 채팅창에 `/push` 입력
끝. (승인 없이 바로 실행)

---

## 예시 케이스

### 케이스 1: Git 작업 자동화

<div class="example-case">

상황: 매일 문서를 수정하고 커밋+푸시를 반복

설정:
`settings.local.json` → git 명령어 자동 승인
`~/.claude/skills/push.md` → `/push` 스킬 생성

사용:
`/push`
→ Claude가 변경된 파일 확인
→ "문서 업데이트: tools.md 한국어 트리거 키워드 추가" 커밋 메시지 자동 생성
→ 승인 없이 commit + push 완료
</div>

### 케이스 2: 개발 서버 자동 실행

<div class="example-case">

상황: 매번 "개발 서버 실행해줘" 입력 + `npm run dev` 승인

`settings.local.json`에 추가:
`"Bash(npm run:*)"`

`~/.claude/skills/dev.md` 생성:

```markdown
# /dev
npm run dev를 실행한다.
이미 실행 중이면 포트 번호를 알려준다.
```

사용:
`/dev`
→ 승인 없이 바로 서버 실행
</div>

### 케이스 3: 코드 리뷰 + 자동 수정

<div class="example-case">

상황: 코드 작성 후 항상 같은 방식으로 리뷰 요청

`~/.claude/skills/review.md` 생성:

```markdown
# /review
현재 변경된 파일을 대상으로 코드 리뷰를 수행한다.
보안 → 성능 → 가독성 순서로 체크한다.
문제가 있으면 바로 수정 제안을 한다.
```

사용:
`/review`
→ 변경 파일 자동 감지 → 일관된 기준으로 리뷰 수행
</div>

---

## 주의사항

자동 승인은 편리하지만 신중하게 설정해야 합니다.

**안전한 허용:**
- `git add`, `git commit`, `git push`  ← 되돌릴 수 있음
- `npm install`, `npm run`           ← 부작용 적음
- `mkdir`, `ls`                      ← 읽기/생성만

**주의가 필요한 허용:**
- `rm:*`        ← 파일 삭제 (되돌리기 어려움)
- `git reset:*` ← 커밋 취소 (되돌리기 어려움)
- `curl:*`      ← 외부 요청 (범위가 넓음)

팁: 처음에는 필요한 것만 하나씩 추가하세요.
