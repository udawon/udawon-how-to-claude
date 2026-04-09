---
date: "2026-04-06"
title: "tmux 마스터클래스 — AI 에이전트 시대의 터미널 멀티플렉서"
description: "tmux의 기초부터 3계층 구조, 핵심 단축키, 설정 커스터마이징, 그리고 Claude Code + Codex + Gemini 멀티 에이전트 교차 검증 워크플로우까지 한 번에"
order: 40
tags: ["활용법", "워크플로우", "youtube"]
source_url: "https://youtube.com/watch?v=vlg8X0N8z08"
---

## 이게 뭔가요?

터미널 창을 여러 개 열어서 Claude Code, 개발 서버, 로그 확인을 동시에 하고 싶은데, 창을 닫으면 실행 중이던 작업이 날아가는 경험을 해본 적 있으신가요?

**tmux**(티먹스)는 이 문제를 해결하는 **터미널 멀티플렉서(Terminal Multiplexer)**입니다. 쉽게 말하면, 하나의 터미널 안에서 여러 작업 공간을 만들고 관리할 수 있는 관리 서버입니다. 카페에서 노트북을 덮어도 집에 돌아와 다시 열면 모든 작업이 그대로 있는 것처럼, tmux는 터미널을 닫아도 실행 중인 프로세스를 살려둡니다.

tmux는 2007년에 만들어진 19년 된 도구이지만, Claude Code나 Codex 같은 AI 에이전트를 여러 개 동시에 운용하는 시대가 되면서 다시 주목받고 있습니다. 특히 Claude Code의 에이전트 팀(여러 AI를 동시에 실행하는 기능) 기능이 등장하면서 tmux 입문자가 급격히 늘었습니다.

## 왜 알아야 하나요?

- **AI 에이전트 병렬 운용**: Claude Code, Codex CLI, Gemini CLI를 하나의 화면에서 동시에 실행하고 교차 검증할 수 있다
- **세션 유지**: 터미널을 닫아도 Claude Code가 계속 실행된다 (SSH 작업, 장시간 빌드에 특히 유용)
- **스크립팅**: 개발 환경 전체(개발 서버 + Claude Code 여러 개)를 명령어 한 줄로 자동으로 세팅할 수 있다

## tmux의 3계층 구조

tmux는 세 단계의 계층으로 구성됩니다. 아파트 구조를 떠올리면 이해하기 쉽습니다.

```
세션(Session)   ← 아파트 동 전체 (프로젝트 단위로 구분)
  └── 윈도우(Window)  ← 각 층 (기능별로 구분: 개발 서버, Claude Code 등)
        └── 페인(Pane)   ← 각 방 (하나의 윈도우를 분할한 화면)
```

tmux는 세션이 살아 있는 한 터미널을 닫아도 모든 윈도우와 페인이 유지됩니다.

## 어떻게 하나요?

### 방법 1: 기본 설치 및 시작

```bash
# macOS
brew install tmux

# Linux (Ubuntu/Debian)
sudo apt install tmux
```

```bash
# tmux 시작 (새 세션 생성)
tmux

# 기존 세션에 다시 연결
tmux attach   # 또는 tmux a
```

### 방법 2: 핵심 단축키 익히기

tmux의 모든 단축키는 **프리픽스(Prefix)** 키를 먼저 누른 뒤 명령어를 입력합니다. 기본 프리픽스는 `Ctrl+B`입니다.

<div class="example-case">
<strong>예시: 프리픽스 사용법</strong>

새 윈도우를 만들고 싶다면:
1. `Ctrl+B` 누르기 (프리픽스 입력)
2. `C` 누르기 (Create window 명령)

`Ctrl+B`를 누르는 게 불편하다면 `Ctrl+Space`로 변경을 추천합니다 (아래 설정 참고).

</div>

#### 윈도우 관련 단축키

| 동작 | Mac 단축키 | Windows 단축키 |
|------|-----------|---------------|
| 새 윈도우 생성 | `Ctrl+B` → `C` | `Ctrl+B` → `C` |
| 이전 윈도우 | `Ctrl+B` → `P` | `Ctrl+B` → `P` |
| 다음 윈도우 | `Ctrl+B` → `N` | `Ctrl+B` → `N` |
| 번호로 이동 (예: 2번) | `Ctrl+B` → `2` | `Ctrl+B` → `2` |
| 윈도우 목록 보기 | `Ctrl+B` → `W` | `Ctrl+B` → `W` |
| 윈도우 이름 변경 | `Ctrl+B` → `,` | `Ctrl+B` → `,` |

#### 페인 관련 단축키

| 동작 | Mac 단축키 | Windows 단축키 |
|------|-----------|---------------|
| 좌우로 분할 | `Ctrl+B` → `%` | `Ctrl+B` → `%` |
| 위아래로 분할 | `Ctrl+B` → `"` | `Ctrl+B` → `"` |
| 페인 간 이동 | `Ctrl+B` → 방향키 | `Ctrl+B` → 방향키 |
| 페인 최대화/복원 | `Ctrl+B` → `Z` | `Ctrl+B` → `Z` |

#### 세션 관련 단축키

| 동작 | Mac 단축키 | Windows 단축키 |
|------|-----------|---------------|
| 세션에서 나오기 (tmux는 유지) | `Ctrl+B` → `D` | `Ctrl+B` → `D` |
| 세션 목록 보기 | `Ctrl+B` → `S` | `Ctrl+B` → `S` |
| 세션 이름 변경 | `Ctrl+B` → `$` | `Ctrl+B` → `$` |

### 방법 3: 설정 파일로 커스터마이징

tmux 설정은 홈 디렉토리의 `~/.tmux.conf` 파일에 저장합니다.

```bash
# ~/.tmux.conf 예시

# 프리픽스를 Ctrl+Space로 추가 설정 (기존 Ctrl+B는 유지)
bind-key -n C-Space send-prefix

# 히스토리(화면에 표시되는 줄 수 기록) 한도를 50,000줄로 늘리기
# (기본값 2,000줄은 개발 서버 로그가 많으면 금방 사라짐)
set-option -g history-limit 50000

# 마우스로 페인 클릭, 크기 조절 가능하게 설정
set -g mouse on

# VI 키보드 방향키(hjkl)로 페인 이동
bind -n M-h select-pane -L
bind -n M-j select-pane -D
bind -n M-k select-pane -U
bind -n M-l select-pane -R
```

> **VI 방향키(vim key, 빔 키)**: 터미널에서 방향키 대신 H(왼), J(아래), K(위), L(오른)으로 이동하는 방식. SSH 서버 접속, Vim 편집기 사용 시 매우 유용하므로 익혀두면 좋습니다.

## 실전 예시

<div class="example-case">
<strong>실전 케이스 1: 개발 환경 자동 세팅 스크립트</strong>

매번 수동으로 터미널을 열고 Claude Code와 개발 서버를 각각 실행하는 게 번거롭다면, 아래처럼 셸 스크립트로 한 번에 세팅할 수 있습니다.

```bash
#!/bin/bash
# dev-start.sh

# 백엔드 세션 생성 + 개발 서버 자동 실행
tmux new-session -d -s backend -n "API 서버"
tmux send-keys -t backend "cd ~/my-project && npm run dev" Enter

# Claude Code 세션 생성 + 여러 페인에 Claude Code 실행
tmux new-session -d -s claude
tmux send-keys -t claude "claude" Enter
tmux split-window -h -t claude
tmux send-keys -t claude "claude" Enter

# 세션 전환
tmux attach -t claude
```

이 스크립트를 실행하면 백엔드 세션(개발 서버 실행)과 Claude Code 세션(페인 2개)이 자동으로 구성됩니다.

</div>

<div class="example-case">
<strong>실전 케이스 2: Claude Code + Codex + Gemini 교차 검증</strong>

Claude Code에서 `/cross-verify` 스킬(특정 목적을 위해 Claude Code에 추가하는 기능 모듈)을 만들면, 한 번의 명령으로 Claude Code(팀 리더), Codex CLI(OpenAI 에이전트), Gemini CLI(Google 에이전트) 3개가 tmux 페인에 동시에 실행되어 교차 검증을 진행합니다.

**동작 방식:**
1. Claude Code가 팀 리더로서 작업 요청 수신
2. Codex CLI와 Gemini CLI를 별도 tmux 페인에 자동으로 실행(스폰)
3. 각 에이전트가 독립적으로 분석 완료 후 팀 리더에게 결과 전달
4. Claude Code가 3개 에이전트의 결과를 종합해 최종 답변 생성

영상에서 시연된 요청 예시: "JavaScript의 Array.prototype 메서드와 for 루프의 성능 차이를 V8 엔진 최적화, 메모리 할당 벤치마크 관점에서 비교해 줘"

**왜 여러 에이전트를 쓰나요?** Claude Code를 한 세션에서 오래 사용하면 컨텍스트 윈도우(AI가 한 번에 기억할 수 있는 양)가 차면서 성능이 저하됩니다. 다른 모델과 교차 검증하면 각 AI의 강점을 결합하고 더 정확한 답을 얻을 수 있습니다.

</div>

## tmux와 함께 쓰면 좋은 도구

- **yazi**: 터미널 기반 파일 탐색기(파일 브라우저). tmux 안에서 바로 파일 목록 확인 가능
- **Ghostty**: GPU(그래픽 카드) 가속으로 빠르게 동작하는 터미널 에뮬레이터. tmux 사용 시 권장
- **Catppuccin 테마**: tmux 상태바를 예쁘게 꾸미는 무료 테마

## 주의할 점

- **처음 1~2주는 불편할 수 있습니다**: 단축키가 낯설어 오히려 느려지는 느낌이 들지만, 영상 제작자는 "눈 딱 감고 1주일만 써보라"고 권합니다
- **`Ctrl+B`가 불편하면 바로 변경**: 설정 파일에서 `Ctrl+Space`로 바꾸면 훨씬 편합니다
- **history-limit 필수 조정**: 기본 2,000줄은 개발 서버 로그에 금방 덮입니다. 최소 50,000줄 이상으로 설정하세요
- **마우스 설정도 켜두기**: `set -g mouse on` 한 줄이면 마우스로 페인 이동 및 크기 조절이 가능합니다

## 정리

- tmux는 터미널을 닫아도 세션(작업 환경)이 유지되고, 하나의 화면을 여러 개로 분할할 수 있는 터미널 멀티플렉서다
- 세션 → 윈도우 → 페인의 3계층 구조로 여러 프로젝트와 AI 에이전트를 동시에 관리할 수 있다
- tmux 스크립팅(자동화 명령)을 활용하면 Claude Code + 개발 서버 + 타 AI 에이전트를 명령 한 줄로 실행하는 멀티 에이전트 환경을 구성할 수 있다

---

> 참고 영상: [TMUX 마스터클래스 | 여러분 아직도 tmux 안쓰시면 꼭 봐주시길 바랍니다 ㅠㅠㅠ](https://youtube.com/watch?v=vlg8X0N8z08) — 개발동생 (2026-03-21)
