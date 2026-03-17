---
date: "2026-03-12"
title: "Claude Code 플러그인 TOP 10 — 생산성 10배 워크플로우"
description: "터미널 하나로 모든 작업을 처리하는 필수 플러그인 10선"
order: 4
tags: ["활용법", "워크플로우", "youtube"]
---

## 이게 뭔가요?

Claude Code 플러그인은 Claude Code에 **새로운 기능을 추가하는 확장 도구**입니다.

비유하자면:

> 스마트폰 = Claude Code
> 앱스토어 앱 = 플러그인
> 앱을 깔면 폰이 더 많은 걸 할 수 있듯이, 플러그인을 깔면 Claude Code가 더 많은 걸 할 수 있음

핵심 아이디어는 **"터미널 밖으로 나가지 말자"**입니다. 코드 에디터 열었다가, 브라우저 갔다가, AI 채팅창 갔다가... 이렇게 왔다갔다하면 업무 시간의 절반이 낭비됩니다. 플러그인을 잘 세팅하면 **터미널 하나가 만능 지휘 본부**가 됩니다.

## 왜 알아야 하나요?

- **맥락 전환 비용 제거**: 창을 바꿀 때마다 집중력이 깨지는 걸 방지
- **반복 작업 자동화**: 매일 하는 검색, 리뷰, 배포를 한 곳에서
- **MCP보다 가벼운 대안**: CLI 기반이라 설정이 간단하고 속도가 빠름

## 추천 플러그인 TOP 10

### 터미널 기반 (MCP 없이)

| 순위 | 플러그인 | 하는 일 | 쓰는 상황 |
|------|---------|---------|-----------|
| 1 | **Taskmaster AI** | 작업을 쪼개고 우선순위 관리 | 큰 프로젝트 시작할 때 |
| 2 | **Claude Code Memory** | 세션 간 기억 유지 | "어제 하던 거 이어서" |
| 3 | **Git Worktree** | 여러 브랜치 동시 작업 | 기능 개발하면서 버그 수정 |
| 4 | **Code Review** | PR 자동 리뷰 | 코드 올리기 전 점검 |
| 5 | **Search & Replace** | 프로젝트 전체 검색/변환 | 변수명 일괄 변경 |

### CLI 연동 (외부 도구)

| 순위 | 플러그인 | 하는 일 | 쓰는 상황 |
|------|---------|---------|-----------|
| 6 | **Google Workspace CLI** | Gmail, Docs, Calendar 제어 | 코딩 중 메일 확인 |
| 7 | **GitHub CLI** | PR, Issue 관리 | 터미널에서 PR 만들기 |
| 8 | **Docker CLI** | 컨테이너 관리 | 개발 환경 세팅 |
| 9 | **Vercel/Netlify CLI** | 배포 자동화 | 한 줄로 배포 |
| 10 | **CLI-Anything** | 아무 프로그램 CLI화 | Draw.io 등 자동 제어 |

## 어떻게 설치하나요?

### 플러그인 마켓플레이스에서 설치

```bash
# 마켓플레이스 검색
claude plugin search [플러그인명]

# 설치
claude plugin add [플러그인명]
claude plugin install [플러그인명]

# 설치 확인
/plugin
```

### 설치 후 반드시!

```bash
/reload plugins
# 또는 Claude Code 재시작
```

<div class="example-case">
<strong>💬 예시: Taskmaster로 프로젝트 쪼개기</strong>

```
프롬프트: "이 프로젝트를 Taskmaster로 분석해서 작업 목록 만들어줘.
우선순위 높은 것부터 보여주고, 예상 시간도 적어줘."
```

결과: 프로젝트가 자동으로 10~20개의 작업으로 쪼개지고, 각각 우선순위와 예상 시간이 붙어서 나옵니다.

</div>

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: "터미널 만능 지휘 본부" 세팅</strong>

**목표**: 코드 에디터, 브라우저, 슬랙을 왔다갔다하지 않고 터미널 하나로 모든 업무 처리

**세팅**:
1. Google Workspace CLI → 메일, 일정 관리
2. GitHub CLI → PR, 이슈 관리
3. Taskmaster → 작업 관리
4. Code Review → 코드 리뷰

**일과**:
```
아침: "오늘 일정이랑 PR 리뷰 대기 목록 보여줘"
오전: "이 기능 구현해줘" → 코딩
점심 전: "방금 작업 PR 올려줘, 코드 리뷰도 돌려줘"
오후: "남은 태스크 보여줘, 다음 우선순위 시작하자"
```

**결과**: 하루 종일 터미널 하나에서 모든 업무 완료. 창 전환 0회!

</div>

## 주의할 점

- **너무 많이 설치하지 말 것**: 플러그인이 많으면 Claude Code 시작이 느려질 수 있어요. 정말 쓰는 것만!
- **MCP vs CLI 중복 주의**: 같은 서비스에 MCP와 CLI 플러그인을 동시에 쓰면 충돌 가능
- **버전 호환**: Claude Code 업데이트 후 플러그인이 안 되면 `claude plugin update [이름]`

## 정리

- 플러그인 = Claude Code의 능력을 확장하는 앱
- 핵심 원칙: "터미널 밖으로 나가지 말자"
- TOP 5 필수: Taskmaster, Memory, Git Worktree, Code Review, Search & Replace

> 참고 영상: [Claude Code Plugin Top 10](https://www.youtube.com/watch?v=VIDEO_ID) — 지투지
