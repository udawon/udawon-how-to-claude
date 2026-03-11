---
title: "플러그인 만들기 — Claude Code를 나만의 도구로 확장하는 법"
source: "https://code.claude.com/docs/en/plugins"
order: 23
tags: ["플러그인", "기업·개발자"]
---

# 플러그인 만들기

> Claude Code를 비유하자면, 기본 스마트폰에 앱을 추가하는 것처럼 플러그인을 통해 Claude Code에 새로운 기능을 추가할 수 있습니다.

## 플러그인이란?

플러그인은 Claude Code에 새로운 명령어, 에이전트, 자동 동작(훅), 외부 도구 연결(MCP 서버) 등을 추가할 수 있는 "확장 패키지"입니다. 혼자 쓰는 설정을 넘어, 팀이나 커뮤니티와 함께 나눌 수 있도록 패키징한 것이라고 생각하면 됩니다.

---

## 독립 설정 vs 플러그인 — 어떤 것을 써야 할까?

| 방식 | 명령어 형식 | 추천 상황 |
|------|------------|----------|
| **독립 설정** (`.claude/` 폴더) | `/hello` | 개인 프로젝트, 혼자 쓰는 설정, 빠른 실험 |
| **플러그인** (`.claude-plugin/plugin.json` 포함 폴더) | `/plugin-name:hello` | 팀과 공유, 여러 프로젝트에서 재사용, 마켓플레이스 배포 |

> 처음에는 `.claude/` 폴더에서 독립 설정으로 빠르게 실험한 다음, 공유할 준비가 되면 플러그인으로 변환하세요.

---

## 예시 케이스

> **상황**: 디자이너 민지씨는 Claude Code를 매일 사용하는데, 매번 같은 지시("코드 리뷰해줘, 보안 문제 먼저 확인하고, 포맷은 우리 팀 규칙대로")를 반복 입력합니다. 이 과정이 귀찮아서 `/my-team:review` 한 번으로 해결하고 싶습니다.
>
> 해결책: 팀 규칙이 담긴 플러그인을 만들어 팀 전체가 `/my-team:review` 명령어를 공유하면 됩니다.

---

## 첫 번째 플러그인 만들기 (단계별 가이드)

### 준비사항
- Claude Code 설치 및 로그인 완료
- Claude Code 버전 1.0.33 이상 (`claude --version`으로 확인)

### 1단계: 플러그인 폴더 만들기

```bash
mkdir my-first-plugin
```

### 2단계: 플러그인 설명 파일(manifest) 만들기

플러그인의 "명함" 역할을 하는 파일입니다. 이름, 설명, 버전을 적습니다.

```bash
mkdir my-first-plugin/.claude-plugin
```

`my-first-plugin/.claude-plugin/plugin.json` 파일에 아래 내용을 작성합니다:

```json
{
  "name": "my-first-plugin",
  "description": "기초를 배우기 위한 인사 플러그인",
  "version": "1.0.0",
  "author": {
    "name": "홍길동"
  }
}
```

| 항목 | 역할 |
|------|------|
| `name` | 플러그인의 고유 이름. 명령어 앞에 붙는 접두사가 됩니다 (예: `/my-first-plugin:hello`) |
| `description` | 플러그인 관리 화면에 표시되는 설명 |
| `version` | 버전 관리용 (1.0.0, 1.0.1 등) |
| `author` | 작성자 정보 (선택사항) |

### 3단계: 스킬(명령어) 추가하기

스킬은 `skills/` 폴더 안에 만듭니다. 폴더 이름이 스킬 이름이 됩니다.

```bash
mkdir -p my-first-plugin/skills/hello
```

`my-first-plugin/skills/hello/SKILL.md` 파일에 아래 내용을 작성합니다:

```markdown
---
description: 사용자에게 친근한 인사를 건네기
disable-model-invocation: true
---

사용자에게 따뜻하게 인사하고 오늘 무엇을 도와드릴지 물어보세요.
```

### 4단계: 플러그인 테스트하기

```bash
claude --plugin-dir ./my-first-plugin
```

Claude Code가 시작되면 아래 명령어를 입력해보세요:

```
/my-first-plugin:hello
```

Claude가 인사로 응답하는 것을 확인할 수 있습니다.

### 5단계: 입력값 받기

`$ARGUMENTS`를 사용하면 명령어에 추가 텍스트를 전달할 수 있습니다.

`SKILL.md`를 아래와 같이 수정합니다:

```markdown
---
description: 사용자 이름을 받아 개인화된 인사를 건네기
---

# Hello 스킬

"$ARGUMENTS"라는 이름의 사용자에게 따뜻하게 인사하고 오늘 무엇을 도와드릴지 물어보세요. 격려하는 분위기로 인사해주세요.
```

변경사항을 적용하려면 `/reload-plugins`를 실행한 뒤 아래와 같이 사용합니다:

```
/my-first-plugin:hello 민지
```

---

## 플러그인 폴더 구조 한눈에 보기

```
my-plugin/
├── .claude-plugin/     ← 여기에는 plugin.json만!
│   └── plugin.json
├── commands/           ← 명령어 파일 (.md 파일들)
├── agents/             ← 커스텀 에이전트 정의
├── skills/             ← 스킬 (SKILL.md 파일들)
├── hooks/              ← 자동 실행 이벤트 핸들러
├── .mcp.json           ← 외부 도구 연결 설정
└── .lsp.json           ← 코드 지능 서버 설정
```

> **중요**: `commands/`, `agents/`, `skills/`, `hooks/` 폴더는 플러그인 루트에 있어야 합니다. `.claude-plugin/` 안에 넣으면 안 됩니다!

---

## 더 복잡한 플러그인 개발하기

### 스킬 추가

`skills/` 폴더에 스킬 폴더를 만들고 `SKILL.md`를 작성합니다:

```yaml
---
name: code-review
description: 코드의 모범 사례와 잠재적 문제를 검토합니다. 코드 검토, PR 확인, 코드 품질 분석 시 사용합니다.
---

코드 검토 시 다음 항목을 확인합니다:
1. 코드 구성 및 구조
2. 오류 처리
3. 보안 우려사항
4. 테스트 커버리지
```

### 기본 설정 포함하기

`settings.json` 파일을 플러그인 루트에 추가하면 플러그인 활성화 시 기본 설정이 적용됩니다:

```json
{
  "agent": "security-reviewer"
}
```

### 로컬에서 여러 플러그인 동시 테스트

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

---

## 공식 마켓플레이스에 플러그인 제출하기

플러그인을 완성했다면 아래 링크에서 제출할 수 있습니다:

- **Claude.ai**: [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit)
- **Console**: [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)

---

## 기존 설정을 플러그인으로 변환하기

이미 `.claude/` 폴더에 명령어나 훅이 있다면 플러그인으로 변환할 수 있습니다.

### 변환 전후 비교

| 독립 설정 (`.claude/`) | 플러그인 |
|----------------------|---------|
| 하나의 프로젝트에서만 사용 가능 | 마켓플레이스를 통해 공유 가능 |
| `.claude/commands/`에 파일 | `plugin-name/commands/`에 파일 |
| `settings.json`에 훅 설정 | `hooks/hooks.json`에 훅 설정 |
| 수동으로 복사해서 공유 | `/plugin install`로 설치 |

### 변환 단계

1. **플러그인 폴더 구조 생성**
   ```bash
   mkdir -p my-plugin/.claude-plugin
   ```

2. **`plugin.json` 작성**
   ```json
   {
     "name": "my-plugin",
     "description": "독립 설정에서 변환",
     "version": "1.0.0"
   }
   ```

3. **기존 파일 복사**
   ```bash
   cp -r .claude/commands my-plugin/
   cp -r .claude/agents my-plugin/
   cp -r .claude/skills my-plugin/
   ```

4. **테스트**
   ```bash
   claude --plugin-dir ./my-plugin
   ```

---

## 다음 단계

- **플러그인 설치**: [플러그인 마켓플레이스 탐색](./discover-plugins.md)
- **기술 사양**: [플러그인 레퍼런스](./plugins-reference.md)
- **배포하기**: [마켓플레이스 만들기](./plugin-marketplaces.md)
