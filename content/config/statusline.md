---
title: "Statusline — 하단 상태 표시줄 커스터마이징"
description: "Claude Code 하단에 표시되는 상태 표시줄을 자신만의 정보로 꾸미는 방법 — 비용, 컨텍스트, git 브랜치까지"
order: 5
tags: ["설정", "statusline", "커스터마이징", "컨텍스트", "비용"]
---

## Statusline이란?

Claude Code 화면 하단에 고정으로 표시되는 **상태 표시줄**입니다.

기본 상태:
```
claude-sonnet-4-6 ...... 2000K (46%)
```

이 영역을 원하는 정보로 자유롭게 바꿀 수 있습니다.

---

## 작동 원리

```
Claude Code → JSON 데이터 → 내 스크립트 → 출력 텍스트 → 하단에 표시
```

Claude Code가 매번 응답할 때마다 JSON 형태로 세션 정보를 내 스크립트에 전달합니다.
스크립트는 그 정보를 받아서 원하는 형태로 출력합니다.
출력된 텍스트가 하단에 그대로 표시됩니다.

---

## 사용 가능한 모든 데이터 필드

### 모델

| 필드 | 설명 | 실제 값 예시 |
|------|------|-------------|
| `model.id` | 모델 ID | `claude-sonnet-4-6` |
| `model.display_name` | 짧은 표시 이름 | `Sonnet` |

### 비용 & 시간

| 필드 | 설명 | 실제 값 예시 |
|------|------|-------------|
| `cost.total_cost_usd` | 이번 세션 누적 비용 (달러) | `0.02341` |
| `cost.total_duration_ms` | 세션 시작부터 경과 시간 (ms) | `183000` |
| `cost.total_api_duration_ms` | API 응답 대기 시간 (ms) | `4200` |
| `cost.total_lines_added` | 이번 세션에 추가된 코드 라인 | `156` |
| `cost.total_lines_removed` | 이번 세션에 삭제된 코드 라인 | `23` |

### 컨텍스트 윈도우

| 필드 | 설명 | 실제 값 예시 |
|------|------|-------------|
| `context_window.used_percentage` | 사용한 컨텍스트 비율 (%) | `46` |
| `context_window.remaining_percentage` | 남은 컨텍스트 비율 (%) | `54` |
| `context_window.context_window_size` | 최대 크기 (토큰) | `200000` |
| `context_window.total_input_tokens` | 세션 누적 입력 토큰 | `92000` |
| `context_window.total_output_tokens` | 세션 누적 출력 토큰 | `18000` |
| `exceeds_200k_tokens` | 200K 초과 여부 | `false` |

### 디렉토리

| 필드 | 설명 | 실제 값 예시 |
|------|------|-------------|
| `workspace.current_dir` | 현재 작업 디렉토리 전체 경로 | `/Users/udawon/my-project` |
| `workspace.project_dir` | Claude 실행 시 시작 디렉토리 | `/Users/udawon/my-project` |
| `cwd` | 현재 디렉토리 (단축형) | `/Users/udawon/my-project` |

### 세션 정보

| 필드 | 설명 | 실제 값 예시 |
|------|------|-------------|
| `version` | Claude Code 버전 | `1.0.80` |
| `session_id` | 세션 고유 ID | `abc123...` |
| `output_style.name` | 현재 출력 스타일 | `default` |

### 상황별 추가 필드

| 필드 | 설명 | 표시 조건 |
|------|------|-----------|
| `vim.mode` | `NORMAL` 또는 `INSERT` | vim 모드 활성화 시 |
| `agent.name` | 에이전트 이름 | `--agent` 플래그 사용 시 |
| `worktree.name` | worktree 이름 | `--worktree` 세션 시 |
| `worktree.branch` | worktree 브랜치 | `--worktree` 세션 시 |
| `worktree.original_branch` | 진입 전 원래 브랜치 | `--worktree` 세션 시 |

---

## 조합 예시 — "이걸 설정하면 이렇게 보인다"

### 예시 1: 모델 ID + 버전 + 비용

**설정할 필드:** `model.id` + `version` + `cost.total_cost_usd`

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.id')
VER=$(echo "$input" | jq -r '.version')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

echo "[$MODEL] v${VER} | 비용: \$${COST}"
```

**화면에 표시되는 결과:**
```
[claude-sonnet-4-6] v1.0.80 | 비용: $0.023
```

---

### 예시 2: 모델 표시명 + 폴더명 + 컨텍스트 %

**설정할 필드:** `model.display_name` + `workspace.current_dir` + `context_window.used_percentage`

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir | split("/") | last')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

echo "[$MODEL] 📁 $DIR | 컨텍스트 ${PCT}% 사용"
```

**화면에 표시되는 결과:**
```
[Sonnet] 📁 how-to-claude | 컨텍스트 46% 사용
```

---

### 예시 3: 코드 변경량 + 세션 경과 시간

**설정할 필드:** `cost.total_lines_added` + `cost.total_lines_removed` + `cost.total_duration_ms`

```bash
#!/bin/bash
input=$(cat)
ADDED=$(echo "$input" | jq -r '.cost.total_lines_added // 0')
REMOVED=$(echo "$input" | jq -r '.cost.total_lines_removed // 0')
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
DURATION_MIN=$(echo "$DURATION_MS / 60000" | bc)

echo "+${ADDED} / -${REMOVED} lines | 세션 ${DURATION_MIN}분 경과"
```

**화면에 표시되는 결과:**
```
+156 / -23 lines | 세션 12분 경과
```

---

### 예시 4: 컨텍스트 프로그레스 바 (시각적)

**설정할 필드:** `model.display_name` + `context_window.used_percentage` + `cost.total_cost_usd`

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# 10칸짜리 프로그레스 바
FILLED=$((PCT * 10 / 100))
EMPTY=$((10 - FILLED))
BAR=""
[ "$FILLED" -gt 0 ] && BAR=$(printf "%${FILLED}s" | tr ' ' '▓')
[ "$EMPTY" -gt 0 ] && BAR="${BAR}$(printf "%${EMPTY}s" | tr ' ' '░')"

echo "[$MODEL] ${BAR} ${PCT}% | \$${COST}"
```

**화면에 표시되는 결과:**
```
[Sonnet] ▓▓▓▓░░░░░░ 46% | $0.023
```

---

### 예시 5: 2줄 표시 (git 브랜치 포함)

echo를 두 번 쓰면 2줄로 표시됩니다.

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir | split("/") | last')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# git 브랜치는 시스템 명령으로 직접 가져옴
BRANCH=$(git -C "$(echo "$input" | jq -r '.workspace.current_dir')" branch --show-current 2>/dev/null || echo "no git")

echo "[$MODEL] 📁 $DIR | 🌿 $BRANCH"
echo "컨텍스트 ${PCT}% | 비용 \$${COST}"
```

**화면에 표시되는 결과:**
```
[Sonnet] 📁 how-to-claude | 🌿 master
컨텍스트 46% | 비용 $0.023
```

---

## 설정 방법

### 방법 1: 명령어로 자동 설정 (가장 쉬움)

Claude Code 채팅창에 입력:
```
/statusline 모델명과 컨텍스트 사용률을 프로그레스 바로 보여줘
```

Claude Code가 스크립트 파일 생성 + settings.json 수정을 자동으로 해줍니다.

---

### 방법 2: 직접 설정

**1단계:** `~/.claude/statusline.sh` 파일 생성 (위 예시 중 원하는 스크립트 복사)

**2단계:** 실행 권한 부여
```bash
chmod +x ~/.claude/statusline.sh
```

**3단계:** `~/.claude/settings.json` 에 추가
```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

**4단계:** 다음 응답부터 자동 적용됩니다.

---

## 알아두면 좋은 것들

**업데이트 시점**
- Claude가 응답을 완료할 때마다 갱신
- 권한 모드가 바뀔 때
- vim 모드가 전환될 때

**스크립트는 API 토큰을 소모하지 않습니다**
로컬에서 실행되는 쉘 스크립트이므로 비용이 발생하지 않습니다.

**표시되지 않는 순간**
자동완성 제안, 권한 요청 화면 등 특정 UI가 활성화된 동안은 일시적으로 숨겨집니다.

**사전 조건**
예시의 `jq` 명령어를 사용하려면 설치가 필요합니다:
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq
```

**비활성화하려면**
```
/statusline 삭제해줘
```
또는 `settings.json`에서 `statusLine` 항목을 직접 제거합니다.
