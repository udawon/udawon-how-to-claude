---
title: "CLI 참조 - Claude Code 명령줄 완전 가이드"
source: "https://code.claude.com/docs/en/cli-reference"
order: 59
tags: ["참조", "CLI", "CLI reference"]
---

# CLI 참조: Claude Code 명령줄 완전 가이드

이 문서는 Claude Code를 터미널(명령 프롬프트)에서 사용할 때 쓸 수 있는 모든 명령어와 옵션을 정리합니다.

CLI(키보드로 명령어를 입력하는 화면)는 리모컨과 같습니다. TV 리모컨으로 채널을 바꾸고 볼륨을 조절하듯, `claude` 명령어에 다양한 옵션을 붙여 Claude Code의 동작을 세밀하게 제어할 수 있습니다. 이 문서는 그 리모컨의 모든 버튼을 설명합니다.

---

## 기본 명령어

| 명령어 | 설명 | 예시 |
|---|---|---|
| `claude` | 대화형 세션 시작 | `claude` |
| `claude "질문"` | 초기 질문과 함께 세션 시작 | `claude "이 프로젝트를 설명해줘"` |
| `claude -p "질문"` | 응답 출력 후 바로 종료 (자동화용) | `claude -p "이 함수를 설명해줘"` |
| `cat 파일 \| claude -p "질문"` | 파일 내용을 Claude에게 전달 | `cat logs.txt \| claude -p "오류를 설명해줘"` |
| `claude -c` | 가장 최근 대화 이어하기 | `claude -c` |
| `claude -r "세션명" "질문"` | 특정 세션 재개 | `claude -r "인증작업" "PR 마무리해줘"` |
| `claude update` | 최신 버전으로 업데이트 | `claude update` |

### 인증 관련

| 명령어 | 설명 |
|---|---|
| `claude auth login` | Anthropic 계정 로그인 |
| `claude auth logout` | 로그아웃 |
| `claude auth status` | 현재 로그인 상태 확인 |

### 기타 관리

| 명령어 | 설명 |
|---|---|
| `claude agents` | 설정된 하위 에이전트 목록 보기 |
| `claude mcp` | MCP 서버 설정 |
| `claude remote-control` | 원격 제어 세션 시작 |

---

## CLI 옵션 (플래그) 전체 목록

### 자주 쓰는 옵션

| 옵션 | 설명 | 예시 |
|---|---|---|
| `--model` | 사용할 AI 모델 지정 | `claude --model claude-sonnet-4-6` |
| `--print`, `-p` | 응답 출력 후 종료 (자동화·스크립팅용) | `claude -p "질문"` |
| `--continue`, `-c` | 가장 최근 대화 이어하기 | `claude --continue` |
| `--resume`, `-r` | 특정 세션 이름 또는 ID로 재개 | `claude --resume 세션명` |
| `--verbose` | 상세 로그 출력 | `claude --verbose` |
| `--version`, `-v` | 버전 확인 | `claude -v` |

### 파일·디렉토리 관련

| 옵션 | 설명 |
|---|---|
| `--add-dir` | 추가 작업 디렉토리 지정 (여러 개 가능) |
| `--worktree`, `-w` | 격리된 git 워크트리에서 Claude 시작 |

### 시스템 프롬프트 커스터마이징

| 옵션 | 동작 | 사용 상황 |
|---|---|---|
| `--system-prompt` | 기본 프롬프트를 완전히 교체 | Claude의 역할을 완전히 바꾸고 싶을 때 |
| `--system-prompt-file` | 파일 내용으로 교체 | 팀 공용 설정 파일 사용 시 |
| `--append-system-prompt` | 기본 프롬프트에 추가 | 기본 기능은 유지하되 규칙 추가 시 |
| `--append-system-prompt-file` | 파일 내용을 기본 프롬프트에 추가 | 버전 관리된 추가 지침 사용 시 |

> 대부분의 경우 `--append-system-prompt`가 가장 안전합니다. 기본 Claude Code 기능을 유지하면서 규칙만 추가할 수 있습니다.

### 권한·보안 관련

| 옵션 | 설명 |
|---|---|
| `--allowedTools` | 승인 없이 실행 가능한 도구 지정 |
| `--disallowedTools` | 사용 불가 도구 지정 |
| `--tools` | 사용 가능한 내장 도구 제한 |
| `--permission-mode` | 권한 모드 설정 (plan 등) |
| `--dangerously-skip-permissions` | 모든 권한 확인 건너뜀 (주의!) |

### 출력 형식 (자동화용)

| 옵션 | 설명 |
|---|---|
| `--output-format text` | 일반 텍스트 출력 (기본값) |
| `--output-format json` | JSON 형식 출력 (스크립팅에 유용) |
| `--output-format stream-json` | 스트리밍 JSON 출력 |
| `--max-turns` | 에이전트 턴 수 제한 |
| `--max-budget-usd` | 최대 비용 제한 (달러) |

### 세션 관리

| 옵션 | 설명 |
|---|---|
| `--fork-session` | 재개 시 새 세션 ID 생성 |
| `--from-pr` | GitHub PR에 연결된 세션 재개 |
| `--session-id` | 특정 UUID로 세션 지정 |
| `--no-session-persistence` | 세션 저장 비활성화 |

### IDE·플러그인

| 옵션 | 설명 |
|---|---|
| `--ide` | IDE에 자동 연결 |
| `--chrome` | Chrome 브라우저 연동 활성화 |
| `--plugin-dir` | 이 세션에서만 사용할 플러그인 디렉토리 |

---

## 하위 에이전트(Agents) 플래그 형식

`--agents` 옵션으로 임시 하위 에이전트를 정의할 수 있습니다.

```bash
claude --agents '{
  "코드리뷰어": {
    "description": "코드 변경 후 자동으로 리뷰합니다",
    "prompt": "당신은 시니어 코드 리뷰어입니다. 코드 품질, 보안, 모범 사례에 집중하세요.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

### 에이전트 정의 옵션

| 필드 | 필수 | 설명 |
|---|---|---|
| `description` | 필수 | 언제 이 에이전트를 호출할지 설명 |
| `prompt` | 필수 | 에이전트의 시스템 프롬프트 |
| `tools` | 선택 | 사용 가능한 도구 목록 |
| `disallowedTools` | 선택 | 사용 금지 도구 목록 |
| `model` | 선택 | 모델 (sonnet, opus, haiku, inherit) |
| `skills` | 선택 | 미리 로드할 스킬 목록 |
| `mcpServers` | 선택 | MCP 서버 목록 |
| `maxTurns` | 선택 | 최대 턴 수 |

---

## 예시 케이스

### 상황 1: 로그 파일을 Claude에게 분석 요청

```bash
cat error.log | claude -p "이 오류들의 공통 원인을 분석해줘"
```

로그 파일을 Claude에게 넘겨 빠르게 분석할 수 있습니다.

### 상황 2: JSON 출력으로 자동화 파이프라인 구축

```bash
claude -p "package.json의 의존성을 분석해줘" --output-format json
```

CI/CD 파이프라인에서 Claude의 결과를 프로그래밍으로 처리할 때 유용합니다.

### 상황 3: 팀 전체에 같은 규칙 적용

```bash
claude --append-system-prompt "항상 TypeScript와 JSDoc 주석을 사용하세요"
```

또는 파일에 저장해서:

```bash
claude --append-system-prompt-file ./team-rules.txt
```

### 상황 4: 비용을 제한한 자동화 작업

```bash
claude -p --max-budget-usd 2.00 --max-turns 10 "코드 분석 후 보고서 작성"
```

최대 $2까지만 쓰고, 10번의 대화 안에 결과를 내도록 제한합니다.

### 상황 5: Python 전문가 모드로 전환

```bash
claude --system-prompt "당신은 Python 전문가입니다. 항상 타입 힌트와 docstring을 포함한 코드를 작성하세요."
```

---

## 유용한 단축키 (대화형 모드)

| 단축키 | 기능 |
|---|---|
| `Shift+Tab` | 계획 모드 전환 |
| `Escape` | 현재 작업 취소 |
| `Ctrl+C` | 강제 종료 |
