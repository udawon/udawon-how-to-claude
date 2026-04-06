---
order: 1
title: "tmux 마스터클래스 — AI 에이전트 시대의 터미널 멀티플렉서"
description: "tmux의 기초부터 고급 설정, Claude Code + Codex + Gemini 멀티 에이전트 교차 검증 워크플로우까지 한 번에 배우는 한국어 마스터클래스"
source_url: https://youtube.com/watch?v=vlg8X0N8z08
channel: 개발동생
upload_date: 2026-03-21
duration: "41:20"
view_count: 31278
tags: ["활용법", "워크플로우", "설정", "youtube"]
---

# tmux 마스터클래스 — AI 에이전트 시대의 터미널 멀티플렉서

> **채널**: 개발동생 | **길이**: 41분 20초 | **조회수**: 31,278회 (2026-03-21 기준)

## 이게 뭔가요?

**tmux**(티-먹스)는 **터미널 멀티플렉서(Terminal Multiplexer)**입니다. 쉽게 말하면, 하나의 터미널 창 안에서 여러 작업을 동시에 띄워놓고 쓸 수 있게 해주는 도구입니다.

일상 비유로 설명하면 이렇습니다:

> **일반 터미널** = 책상 위에 종이 한 장만 올려놓는 것. 다른 일 하려면 기존 종이를 치워야 함.
>
> **tmux** = 책상에 칸막이를 세워서 여러 작업을 동시에 펼쳐놓는 것. 각 칸은 독립적으로 돌아가고, 자리를 비워도 작업은 그대로 유지됨.

AI 에이전트(Claude Code, Codex, Gemini 등)로 개발하는 시대에 특히 중요한 이유는 하나입니다: **터미널을 닫아도 AI 에이전트가 계속 실행됩니다.**

---

## 핵심 개념: 3계층 구조

tmux는 세 가지 단위로 작업을 관리합니다.

| 단위 | 설명 | 비유 |
|------|------|------|
| **세션(Session)** | 가장 큰 단위. 프로젝트 하나 = 세션 하나 | 책상 전체 |
| **윈도우(Window)** | 세션 안의 탭. 여러 개 만들 수 있음 | 책상 위의 큰 작업판 |
| **페인(Pane)** | 윈도우를 가로/세로로 쪼갠 조각 | 작업판을 나눈 칸막이 |

---

## 핵심 단축키

모든 tmux 단축키는 **프리픽스(Prefix)** 키 다음에 명령 키를 누릅니다.
기본 프리픽스: `Ctrl + B` (설정으로 `Ctrl + A` 등으로 변경 가능)

> **표기법**: `prefix` = `Ctrl+B` 먼저 누르고 손 떼기 → 그 다음 명령 키

### 세션 관리

| 단축키 | 동작 |
|--------|------|
| `tmux new -s 이름` | 새 세션 생성 (터미널에서) |
| `prefix + d` | 세션 분리(detach) — 터미널 닫아도 세션 유지 |
| `tmux attach -t 이름` | 세션 재연결(attach) |
| `tmux ls` | 실행 중인 세션 목록 확인 |
| `prefix + $` | 현재 세션 이름 변경 |

### 윈도우 관리

| 단축키 | 동작 |
|--------|------|
| `prefix + c` | 새 윈도우 생성 |
| `prefix + ,` | 현재 윈도우 이름 변경 |
| `prefix + n` | 다음 윈도우로 이동 |
| `prefix + p` | 이전 윈도우로 이동 |
| `prefix + 숫자` | 해당 번호 윈도우로 바로 이동 |
| `prefix + w` | 윈도우 목록 보기 |

### 페인(분할 화면) 관리

| 단축키 | 동작 |
|--------|------|
| `prefix + %` | 세로로 분할 (좌/우) |
| `prefix + "` | 가로로 분할 (위/아래) |
| `prefix + 방향키` | 페인 간 이동 |
| `prefix + z` | 현재 페인 전체화면(줌) 토글 |
| `prefix + x` | 현재 페인 닫기 |

---

## 설정 커스터마이징

tmux 설정 파일은 `~/.tmux.conf`에 저장합니다.

### 권장 기본 설정

```bash
# Prefix를 Ctrl+A로 변경 (더 편한 위치)
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# vi 스타일 키바인딩 활성화
setw -g mode-keys vi

# 히스토리 라인 수 늘리기
set -g history-limit 10000

# 마우스 지원 활성화
set -g mouse on
```

### Catppuccin 테마 적용

**Catppuccin**(캣푸치노)은 파스텔톤 배색의 인기 있는 테마입니다. tmux 공식 플러그인(`catppuccin/tmux`)으로 설치할 수 있으며, latte / frappe / macchiato / mocha 4가지 스타일을 지원합니다.

### 추천 함께 쓰는 도구

- **Ghostty**: GPU 가속 터미널 에뮬레이터. 2024년 12월 정식 출시(HashiCorp 창업자 제작). [ghostty.org](https://ghostty.org)
- **yazi**: Rust 기반 터미널 파일 탐색기. tmux와 공식 연동 지원(이미지 미리보기 포함).

---

## 개발환경 자동화 스크립트

tmux 스크립팅으로 프로젝트 시작 시 필요한 모든 창을 한 번에 열 수 있습니다.

```bash
#!/bin/bash
SESSION="myproject"

# 세션 없으면 새로 생성
tmux new-session -d -s $SESSION

# 윈도우 구성
tmux rename-window -t $SESSION:0 'editor'
tmux send-keys -t $SESSION:0 'nvim .' C-m

tmux new-window -t $SESSION:1 -n 'server'
tmux send-keys -t $SESSION:1 'npm run dev' C-m

tmux new-window -t $SESSION:2 -n 'agent'
tmux send-keys -t $SESSION:2 'claude' C-m

# 세션 연결
tmux attach-session -t $SESSION
```

이 스크립트를 실행하면 에디터, 개발 서버, Claude Code 에이전트가 각각 별도 윈도우에서 동시에 시작됩니다.

---

## AI 멀티 에이전트 교차 검증 워크플로우

영상의 핵심 데모입니다. tmux 페인 분할을 이용해 **Claude Code, Codex, Gemini를 동시에 실행**하고 서로의 결과를 교차 검증하는 방법을 시연합니다.

```
┌─────────────────┬────────────────┐
│                 │                │
│   Claude Code   │     Codex      │
│   (페인 1)      │   (페인 2)     │
│                 │                │
├─────────────────┴────────────────┤
│                                  │
│           Gemini                 │
│          (페인 3)                │
│                                  │
└──────────────────────────────────┘
```

**활용 흐름:**
1. tmux 윈도우를 3개 페인으로 분할
2. 각 페인에서 다른 AI 에이전트 실행
3. 같은 작업을 각 에이전트에게 할당
4. 결과를 비교·검증하여 가장 신뢰할 수 있는 답 선택

---

## 왜 AI 에이전트 시대에 tmux인가?

- **세션 유지**: 노트북 닫아도, SSH 연결이 끊겨도 AI 에이전트는 계속 실행
- **멀티 에이전트**: 여러 에이전트를 하나의 화면에서 동시 관리
- **컨텍스트 전환**: 에디터, 서버, 에이전트를 탭 전환으로 빠르게 이동
- **자동화**: 스크립트로 전체 개발환경을 1초 만에 복원

---

## 참고 자료

- [개발동생 tmux 설정 적용 가이드](https://fanding.kr/@devbrother/post/181606)
- [tmux 공식 위키](https://github.com/tmux/tmux/wiki)
- [tmux 치트시트](https://tmuxcheatsheet.com/)
- [Ghostty 터미널](https://ghostty.org/)
- [yazi 파일 탐색기](https://yazi-rs.github.io/)
