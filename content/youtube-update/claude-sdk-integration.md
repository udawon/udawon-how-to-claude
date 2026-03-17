---
date: "2026-03-12"
title: "Claude Code VS Code 세팅 완전 가이드 — 플러그인, 스킬, CLAUDE.md"
description: "실제 프로젝트에서 쓰는 VS Code Claude 확장 설정법과 /init 활용 타이밍"
order: 9
tags: ["활용법", "워크플로우", "youtube"]
---

## 이게 뭔가요?

Claude Code를 VS Code 확장으로 쓸 때, **제대로 세팅하면 생산성이 크게 달라집니다.** 플러그인 설치, 스킬 활용, CLAUDE.md 설정까지 — 실제 프로젝트를 15화 넘게 진행한 개발자의 세팅법을 정리했습니다.

> 비유: 새 노트북을 사면 바로 쓸 수도 있지만, **자주 쓰는 앱 설치하고 바탕화면 정리하면** 업무 속도가 완전히 달라지잖아요. Claude Code도 마찬가지예요.

## 왜 알아야 하나요?

- VS Code 확장에서 **플러그인을 어떻게 설치하는지** 모르는 사람이 많음
- `/init`을 **언제 실행해야 효과적인지** 아는 것만으로 CLAUDE.md 품질이 달라짐
- 슬래시 명령어 하나로 **코드 리뷰, PR 생성, 프론트엔드 디자인** 등 전문 기능 사용 가능

## 어떻게 하나요?

### 방법 1: 플러그인 마켓플레이스 설정

VS Code Claude 확장에서 플러그인을 설치하려면:

1. `/plugin` 입력
2. **Marketplace** 탭으로 이동 (처음에는 비어있음)
3. GitHub URL을 붙여넣기 (예: `anthropics/claude-code`)
4. 마켓플레이스가 추가되면 설치 가능한 플러그인 목록이 나타남
5. 원하는 플러그인 선택 → 설치

<div class="example-case">
<strong>💬 예시: 추천 플러그인들</strong>

```
/plugin → Marketplace → GitHub URL 추가 후:

- commit-commands: Git 커밋/푸시 자동화
- feature-dev: 기능 개발 전문 에이전트
- front-end-design: 프론트엔드 디자인 전문
- github: GitHub 연동
- supabase: Supabase 연동
```

설치 후 `/` 입력하면 사용 가능한 슬래시 명령어 목록이 나타납니다.
</div>

### 방법 2: /init 타이밍 전략

`/init`은 프로젝트를 분석해서 CLAUDE.md를 자동 생성하는 명령어입니다.

**핵심 팁: 프로젝트 시작 직후가 아니라, 코드가 어느 정도 쌓인 후에 실행하세요.**

<div class="example-case">
<strong>💬 예시: /init 실행 타이밍</strong>

**너무 이른 시점** (에피소드 1):
- 코드가 거의 없음 → CLAUDE.md가 빈약함
- "이 프로젝트가 뭘 하는지" 정보 부족

**적절한 시점** (에피소드 15):
- 코드가 충분히 쌓임 → 프로젝트 전체 맥락을 이해
- 기술 스택, 아키텍처, 의존성 관계를 정확하게 파악
- "뭘 원했는지 vs 지금 뭘 갖고 있는지"를 비교해서 더 유용한 CLAUDE.md 생성

```
VS Code Claude 확장에서:
/init 입력 → Claude가 프로젝트 분석 → CLAUDE.md + agent 파일 자동 생성
```
</div>

### 단, 스크립트가 독립적인 프로젝트는 예외

각 스크립트가 독립적이고 복잡한 상호의존성이 없는 프로젝트라면, CLAUDE.md 없이도 충분히 작업 가능합니다. React 같은 복잡한 아키텍처에서는 초반에 CLAUDE.md가 더 중요합니다.

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: 15화째 프로젝트에서 /init 실행</strong>

**상황**: 파이프라인 프로젝트를 15화에 걸쳐 개발. 이제 UI 등 크로스커팅(여러 부분에 걸치는) 작업 시작.

**과정**:
1. `/init` 실행 → Claude가 전체 코드를 분석
2. 프로젝트의 구조, 실행 방법, 아키텍처, "원래 의도 vs 현재 상태" 차이까지 파악
3. 자동 생성된 CLAUDE.md에 이 모든 맥락이 반영됨

**결과**: 새 채팅을 열어도 Claude가 프로젝트를 처음부터 이해하고 시작

</div>

## 주의할 점

- **플러그인 마켓플레이스 URL을 직접 넣어야 함**: 처음에 아무것도 안 보이는 게 정상. GitHub URL 추가가 필요
- **너무 이른 /init은 효과 없음**: 코드가 쌓인 후 실행이 핵심
- **슬래시 명령어 확인**: `/` 입력하면 설치된 모든 플러그인의 명령어 목록을 볼 수 있음

## 정리

- VS Code Claude 확장에서 `/plugin` → Marketplace → GitHub URL로 플러그인 설치
- `/init`은 코드가 충분히 쌓인 후 실행하면 훨씬 유용한 CLAUDE.md 생성
- 슬래시 명령어로 커밋, 기능 개발, 디자인 등 전문 기능 바로 사용 가능

> 참고 영상: [The Claude VS Code Setup I Actually Use (Plugins, Skills, and CLAUDE.md)](https://www.youtube.com/watch?v=tAQZm07R2mM) — Chris Webb
