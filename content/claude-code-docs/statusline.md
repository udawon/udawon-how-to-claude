---
title: "상태 표시줄 가이드: 화면 하단에 나만의 정보 패널 만들기"
source: "https://code.claude.com/docs/en/statusline"
order: 15
tags: ["설정", "UI"]
---

# 상태 표시줄 가이드: 화면 하단에 나만의 정보 패널 만들기

상태 표시줄(Status Line)은 Claude Code 화면 하단에 표시되는 커스터마이즈 가능한 정보 바입니다. 마치 자동차 계기판처럼, 현재 상태를 한눈에 볼 수 있게 해줍니다. 어떤 모델을 쓰는지, 대화가 얼마나 차 있는지, 비용이 얼마나 됐는지, 지금 어느 git 브랜치에 있는지 등을 실시간으로 확인할 수 있습니다.

---

## 상태 표시줄이 필요한 이유

| 상황 | 상태 표시줄이 도움 |
|------|----------------|
| 컨텍스트 한계가 가까워지고 있는지 모를 때 | 컨텍스트 사용률 표시 |
| 이 세션에 비용이 얼마나 들었는지 궁금할 때 | 총 비용 표시 |
| 여러 세션을 동시에 열고 있을 때 | 세션 구분 정보 표시 |
| 지금 어느 브랜치에 있는지 항상 보고 싶을 때 | git 브랜치 표시 |

---

## 빠른 시작: 자동으로 설정하기

Claude Code 안에서 원하는 내용을 말하면 됩니다:

```
/statusline 모델 이름과 컨텍스트 사용률을 진행 막대로 보여줘
/statusline git 브랜치와 현재 폴더를 보여줘
/statusline 세션 비용과 총 실행 시간을 보여줘
```

Claude Code가 자동으로 스크립트 파일을 만들고 설정까지 완료해줍니다.

---

## 수동으로 설정하기

### 1단계: 스크립트 파일 만들기

`~/.claude/statusline.sh` 파일을 만들고 아래 내용 입력:

```bash
#!/bin/bash
# Claude Code가 보내는 JSON 데이터를 읽습니다
input=$(cat)

# 필요한 정보를 추출합니다
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

# 화면에 출력합니다
echo "[$MODEL] 📁 ${DIR##*/} | ${PCT}% 사용"
```

### 2단계: 실행 권한 설정 (macOS/Linux)

```bash
chmod +x ~/.claude/statusline.sh
```

### 3단계: 설정 파일에 등록

`~/.claude/settings.json`에 추가:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

---

## 사용 가능한 데이터 목록

상태 표시줄 스크립트는 Claude Code로부터 JSON 데이터를 받습니다. 사용할 수 있는 항목들:

| 데이터 | JSON 경로 | 설명 |
|--------|----------|------|
| 모델 이름 | `model.display_name` | 현재 사용 중인 모델 |
| 현재 폴더 | `workspace.current_dir` | 작업 중인 디렉토리 |
| 프로젝트 폴더 | `workspace.project_dir` | Claude를 시작한 폴더 |
| 총 비용 | `cost.total_cost_usd` | 세션 총 USD 비용 |
| 총 실행 시간 | `cost.total_duration_ms` | 세션 시작부터 경과 시간 (ms) |
| 추가된 줄 수 | `cost.total_lines_added` | 작성된 코드 줄 수 |
| 삭제된 줄 수 | `cost.total_lines_removed` | 삭제된 코드 줄 수 |
| 컨텍스트 사용률 | `context_window.used_percentage` | 전체 대비 사용 비율 (%) |
| 컨텍스트 남은 량 | `context_window.remaining_percentage` | 남은 비율 (%) |
| 컨텍스트 크기 | `context_window.context_window_size` | 최대 토큰 수 |
| 세션 ID | `session_id` | 고유 세션 식별자 |
| Claude 버전 | `version` | Claude Code 버전 |
| 출력 스타일 | `output_style.name` | 현재 출력 스타일 |
| Vim 모드 | `vim.mode` | NORMAL 또는 INSERT |
| Git 브랜치 | (별도 명령어 필요) | 현재 git 브랜치 |

---

## 실용적인 예시 스크립트

### 컨텍스트 진행 막대 + 비용 표시

```bash
#!/bin/bash
input=$(cat)
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# 진행 막대 만들기
BAR_WIDTH=20
FILLED=$((PCT * BAR_WIDTH / 100))
EMPTY=$((BAR_WIDTH - FILLED))
BAR=$(printf '%0.s█' $(seq 1 $FILLED))$(printf '%0.s░' $(seq 1 $EMPTY))

printf "컨텍스트: [%s] %d%%  |  비용: $%.4f\n" "$BAR" "$PCT" "$COST"
```

### Git 브랜치 + 모델 표시

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
BRANCH=$(git branch --show-current 2>/dev/null || echo "git 없음")

echo "[$MODEL] 🌿 $BRANCH"
```

### 여러 줄 표시

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
BRANCH=$(git branch --show-current 2>/dev/null || echo "-")
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# 첫 번째 줄: 모델과 브랜치
echo "[$MODEL] 🌿 $BRANCH"
# 두 번째 줄: 컨텍스트와 비용
printf "컨텍스트: %d%%  |  비용: $%.4f\n" "$PCT" "$COST"
```

---

## 상태 표시줄 업데이트 시점

- Claude 응답이 새로 도착할 때
- 권한 모드가 바뀔 때
- Vim 모드가 전환될 때

> **참고:** 상태 표시줄 실행은 API 토큰을 소비하지 않습니다. 자동완성 메뉴, 도움말, 권한 확인 중에는 일시적으로 숨겨집니다.

---

## 상태 표시줄 제거하기

```
/statusline 상태 표시줄 삭제해줘
```

또는 `~/.claude/settings.json`에서 `statusLine` 항목을 직접 삭제합니다.

---

## 예시 케이스

**상황 1: 긴 프로젝트에서 컨텍스트 한계 걱정**

> 대규모 프로젝트를 진행하는 아키텍트 조아키 씨는 대화가 길어지면 Claude가 앞 내용을 잊을까봐 걱정합니다. 상태 표시줄에 컨텍스트 사용률을 퍼센트와 진행 막대로 표시해뒀습니다. 80%가 넘으면 새 세션을 시작하는 습관을 만들었습니다.

**상황 2: 비용 추적이 필요한 팀**

> 스타트업 CTO 최CTO 씨는 팀원들이 Claude Code를 얼마나 쓰는지 모니터링하고 싶습니다. 각 팀원의 상태 표시줄에 세션별 비용을 표시하도록 설정했습니다. 팀원들이 비용을 의식하면서 효율적으로 사용하게 됐습니다.

**상황 3: 여러 기능 브랜치를 오가는 개발자**

> 여러 기능을 동시에 개발하는 풀스택 개발자 박풀스택 씨는 지금 어느 브랜치에서 작업 중인지 헷갈릴 때가 많습니다. 상태 표시줄에 현재 git 브랜치와 모델 이름을 표시해서 항상 한눈에 확인할 수 있게 했습니다.

**상황 4: 여러 터미널 세션 구분하기**

> 동시에 여러 프로젝트를 진행하는 컨설턴트 이컨설턴트 씨는 여러 터미널 창을 열어둡니다. 상태 표시줄에 현재 폴더명과 세션 ID 일부를 표시해서 각 창이 어느 프로젝트 세션인지 바로 알 수 있게 했습니다.
