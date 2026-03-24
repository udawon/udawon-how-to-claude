---
date: "2026-03-24"
title: "Auto Dream — Claude Code가 잠자면서 기억을 정리하는 기능"
description: "Claude Code의 Auto Dream 기능으로 메모리를 자동 통합·정리하여 세션이 쌓여도 AI 성능이 떨어지지 않게 하는 방법"
order: 30
tags: ["신기능", "업데이트", "활용법", "youtube"]
source_url: "https://youtube.com/watch?v=OnQ4BGN8B-s"
---

## 이게 뭔가요?

Auto Dream(자동 꿈꾸기)은 Claude Code가 **쌓인 기억을 자동으로 정리하는 기능**입니다.

사람도 밤에 잠을 자면서 기억을 정리하잖아요? 낮 동안 겪은 일 중에서 중요한 건 장기 기억으로 저장하고, 쓸모없는 건 지우는 과정이 REM 수면 중에 일어납니다. 잠을 못 자면 기억력이 떨어지고, 헷갈리는 일이 많아지는 것처럼요.

Claude Code도 마찬가지입니다. 기존에는 세션(대화)이 쌓일수록 메모리(기억 노트)에 **쓸데없는 정보, 모순되는 내용**이 계속 추가되어서 오히려 AI 성능이 떨어졌습니다. Auto Dream은 이 문제를 해결합니다 — Claude Code가 **"잠을 자면서" 기억을 정리**하는 것이죠.

## 왜 알아야 하나요?

**알면 좋은 점:**
- **세션이 많아져도 Claude Code 성능이 유지됩니다** — 오래 사용할수록 기억이 지저분해지는 문제가 해결됨
- **직접 메모리를 정리할 필요가 없습니다** — Claude Code가 백그라운드에서 알아서 처리
- **작업 중에도 실행됩니다** — 꿈 정리가 진행되는 동안에도 Claude Code를 정상적으로 사용 가능
- **프로젝트 코드는 안전합니다** — 메모리 파일만 수정하고, 프로젝트 코드는 읽기 전용으로 동작

**모르면 불편한 점:**
- 기능을 모르면 수동으로 `.claude/` 폴더의 메모리 파일을 정리해야 함
- 메모리가 지저분해지면 Claude Code가 과거에 합의한 내용을 잊거나 모순된 행동을 함

## 배경: Auto Memory의 한계

Auto Dream을 이해하려면 먼저 Auto Memory(자동 기억)를 알아야 합니다.

약 2개월 전, Claude Code에 **Auto Memory** 기능이 추가되었습니다. Claude Code가 사용자의 수정이나 선호를 자동으로 메모해두는 기능입니다. `.claude/projects/` 폴더 안에 프로젝트별 `memory/` 폴더가 생기고, 여기에 메모가 저장됩니다.

**문제는 세션이 쌓이면서 발생했습니다:**

| 세션 수 | 메모리 상태 |
|---------|-----------|
| 1~5세션 | 깔끔하고 관련성 높음 |
| 10~15세션 | 노이즈(불필요한 정보)가 섞이기 시작 |
| 20세션 이상 | 모순된 내용, 오래된 정보가 쌓여서 오히려 AI 성능 저하 |

Auto Dream은 바로 이 문제를 해결하기 위해 만들어졌습니다.

## 어떻게 하나요?

### 방법 1: Auto Dream 활성화 확인

Claude Code에서 `/memory` 명령어를 입력하면 현재 상태를 확인할 수 있습니다.

```
/memory
```

화면에 **Auto-dream: on**이라고 표시되면 이미 활성화된 상태입니다. 여기서 켜고 끌 수 있고, 프로젝트의 메모리 폴더도 열어볼 수 있습니다.

<div class="example-case">
<strong>예시: /memory로 상태 확인</strong>

```
사용자: /memory

Claude Code:
  Auto-memory: on
  Auto-dream: on
  Memory folder: ~/.claude/projects/my-project/memory/
  Files: 4 memory files
```

Auto-dream이 on으로 표시되면 정상입니다. 별도로 설정할 것 없이 자동으로 동작합니다.

</div>

### 방법 2: /memory에서 Auto Dream 켜고 끄기

`/memory` 명령어의 메뉴에서 Auto Dream을 **토글(켜기/끄기)**할 수 있습니다.

```
/memory → Auto-dream 항목 선택 → on/off 전환
```

켜두면 조건이 충족될 때 백그라운드에서 자동으로 메모리 통합이 실행됩니다.

<div class="example-case">
<strong>예시: /memory에서 Auto Dream 토글하기</strong>

```
사용자: /memory

Claude Code:
  Auto-memory: on
  Auto-dream: on  ← 여기서 on/off 전환 가능
  Memory folder: ~/.claude/projects/my-project/memory/
```

on으로 설정해두면, 조건이 충족될 때 백그라운드에서 자동 실행됩니다. 실행 중에도 Claude Code를 정상적으로 사용할 수 있습니다.

</div>

> **참고:** 영상에서는 "dream"이라고 자연어로 입력하면 수동 실행된다고 설명하지만, 실제 테스트 결과 자연어 입력으로는 Auto Dream이 트리거되지 않았습니다. `/memory` 메뉴의 토글이 현재 유일한 설정 방법입니다.

## Auto Dream의 4단계 프로세스

Auto Dream은 내부적으로 4단계를 거칩니다:

| 단계 | 이름 | 하는 일 |
|------|------|--------|
| 1 | Orientation(파악) | 현재 메모리 폴더를 읽고, 어떤 기억이 있는지 파악 |
| 2 | Gathering Signal(신호 수집) | 과거 세션 기록(JSONL 파일)을 검색하여 새로운 정보, 사용자 피드백, 중요 결정 등을 찾음 |
| 3 | Consolidation(통합) | 새 정보를 기존 메모리에 합치고, 상대적 날짜("오늘", "어제")를 절대 날짜로 변환하고, 모순을 정리 |
| 4 | Pruning & Indexing(정리) | 오래되거나 불필요한 메모리를 삭제하고, MEMORY.md(목차 파일)를 업데이트 |

## 자동 실행 조건

영상 제작자에 따르면, Auto Dream은 아래 **두 가지 조건이 모두** 충족되면 자동으로 실행됩니다:

1. **마지막 통합 후 24시간 경과**
2. **5세션 이상 진행**

즉, 하루에 한 번 정도, 충분한 새 세션이 쌓였을 때 자동으로 실행됩니다. (정확한 트리거 조건은 공식 발표 시 변경될 수 있습니다.)

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 프로젝트 장기 운영 시 메모리 관리</strong>

**상황:** 박개발자가 3주 동안 프로젝트를 진행하며 50개 이상의 세션을 사용함.

**Auto Dream 없이 (이전):**
- 메모리에 "React 사용" + "Vue로 전환하기로 함" + "역시 React가 낫다" 같은 모순된 기억이 공존
- Claude Code가 "이 프로젝트는 Vue 기반이죠?"라고 엉뚱한 소리를 함
- 수동으로 메모리 파일을 열어서 정리해야 함

**Auto Dream 사용 후:**
- 매일 자동으로 메모리를 통합하여 "최종 결정: React 사용"만 남김
- 오래된 회의 기록이나 임시 결정은 자동 삭제
- Claude Code가 항상 최신 맥락을 정확히 기억

</div>

<div class="example-case">
<strong>실전 케이스: Dream 후 메모리 파일 확인</strong>

Dream 완료 후 메모리 폴더를 열어보면 깔끔하게 정리된 파일들이 있습니다:

```
~/.claude/projects/my-project/memory/
├── MEMORY.md          # 목차 파일 (다른 메모리 파일 참조)
├── user_role.md       # 사용자 역할/선호 관련 기억
├── recent_activity.md # 최근 프로젝트 활동 요약
└── project_config.md  # 프로젝트 설정 관련 기억 (변경 불필요한 것)
```

MEMORY.md는 다른 메모리 파일들의 **목차 역할**만 합니다. 실제 기억 내용은 개별 파일에 저장됩니다.

</div>

## 주의할 점

- **아직 공식 발표 전입니다** — 이 기능은 Claude Code에 이미 동작하고 있지만, Anthropic이 공식적으로 발표하지 않은 상태입니다. 향후 변경될 수 있습니다
- **수동 실행은 `/memory` 토글만 가능합니다** — 영상에서 소개된 "dream" 자연어 입력은 현재 작동하지 않습니다. `/memory`에서 on/off 전환이 유일한 방법입니다
- **프로젝트 코드는 건드리지 않습니다** — Dream 중에는 읽기 전용 모드로 동작하여 프로젝트 파일을 수정하지 않습니다. 메모리 파일만 수정합니다
- **동시 실행 방지** — 영상에 따르면, 같은 프로젝트에서 두 개의 Dream이 동시에 실행되지 않도록 보호됩니다
- **Dream 중에도 작업 가능** — 백그라운드에서 실행되므로 Claude Code를 정상적으로 사용할 수 있습니다

## 정리

- Auto Dream은 Claude Code가 **잠자면서 기억을 정리하는 기능** — 오래된·모순된·불필요한 메모리를 자동으로 정리합니다
- 24시간 + 5세션 조건이 충족되면 **자동 실행**되고, "dream"이라고 입력하면 수동 실행도 가능합니다
- 프로젝트 코드는 안전하게 보호되며, 작업 중에도 백그라운드에서 실행됩니다

---

> 📺 **참고 영상**: [Anthropic Just Dropped the Feature Nobody Knew They Needed](https://youtube.com/watch?v=OnQ4BGN8B-s) — Ray Amjad (7:30)
