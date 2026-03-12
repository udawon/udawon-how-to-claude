---
title: "플러그인과 스킬 가이드"
description: "플러그인 설치/관리법, 마켓플레이스 사용법, 스킬과의 차이점"
order: 3
tags: ["설정", "플러그인", "스킬", "마켓플레이스", "확장"]
---

## 먼저 비유로 이해하기

**스킬(Skill)** = 레시피 카드 한 장
"김치찌개 만드는 법" 이라는 종이 한 장
→ Claude에게 "이 방법대로 해줘"라고 알려주는 지침서

**플러그인(Plugin)** = 요리 키트 (밀키트)
레시피 카드 + 양념 세트 + 특수 도구 + 조리법이 한 박스에 들어있음
→ Claude에게 새로운 능력 자체를 설치해주는 패키지

정리하면:
스킬 = 설명서 1장 (텍스트 지침)
플러그인 = 설명서 + 도구 + 자동화 규칙이 묶인 패키지

## 스킬(Skill)이란?

SKILL.md라는 파일에 적힌 "이렇게 해줘" 지침

예시:
"코드 리뷰할 때는 보안 → 성능 → 가독성 순서로 체크해줘"
"커밋 메시지는 한국어로, 이 형식으로 써줘"

특징:
- 텍스트 파일 하나 (SKILL.md)
- Claude가 읽고 따르는 지침
- CLAUDE.md의 확장판 같은 느낌
- 직접 만들기 쉬움

<div class="example-case">

비유: 신입사원에게 주는 업무 매뉴얼

"고객 전화 받을 때는 이렇게 인사하고,
이런 순서로 처리하세요"
→ 행동 방식을 알려주는 것
</div>

### 스킬의 Progressive Disclosure (점진적 공개)

스킬이 똑똑한 이유: **필요할 때만 내용을 읽습니다.**

세션이 시작되면 Claude는 각 스킬의 **이름과 설명만** 읽습니다. 스킬이 30개 있어도 컨텍스트 윈도우(대화 기억 공간)를 거의 차지하지 않습니다.

대화 중에 특정 스킬이 필요하다고 판단되면, **그때서야** 스킬의 본문 전체를 읽어들입니다.

<div class="example-case">

비유: 도서관 카탈로그

책 100권의 제목과 한 줄 소개만 기억하고 있다가,
"웹 스크래핑" 관련 대화가 나오면
→ 그때서야 "웹 스크래핑 매뉴얼" 책을 꺼내서 읽는 것

스킬이 아무리 많아도 성능에 영향이 없는 이유가 이겁니다.
</div>

### 스킬에 Python 스크립트 넣기

스킬은 텍스트 지침만 넣는 게 아닙니다. **Python 스크립트**도 함께 넣을 수 있습니다.

```
.claude/skills/
└── scrape/
    ├── SKILL.md        ← "이 스크립트로 웹사이트를 스크래핑해줘"
    └── scraper.py      ← 실제 스크래핑 코드
```

SKILL.md에서 "scraper.py를 실행해서 데이터를 가져와"라고 지시하면, Claude가 해당 스크립트를 실행합니다.

### 스킬 저장 위치: Root vs Project

| 위치 | 적용 범위 | 예시 |
|------|----------|------|
| `~/.claude/skills/` (Root) | **내 모든 프로젝트**에서 사용 | "내 말투로 글쓰기" 스킬 |
| `프로젝트/.claude/skills/` | **이 프로젝트에서만** 사용 | "이 프로젝트 배포하기" 스킬 |

<div class="example-case">

비유: 개인 도구 vs 부서 도구

Root 스킬 = 내가 어느 부서에 가든 항상 들고 다니는 개인 노트북
Project 스킬 = 특정 부서에 비치된 전용 장비
</div>

## 플러그인(Plugin)이란?

여러 기능이 한 번에 묶인 설치형 패키지

플러그인 안에 들어있을 수 있는 것들:
- 스킬 (SKILL.md) — 지침서
- <span class="keyword-highlight">MCP</span> 서버 — 외부 도구 연결
- <span class="keyword-highlight">Hooks</span> — 자동화 규칙
- 에이전트 — 전문 AI 비서
- LSP 서버 — 코드를 쓸 때 실수를 자동으로 감지해주는 도구

<div class="example-case">

비유: 스마트폰 앱 설치
카카오톡을 설치하면:
  메시지 기능 + 사진 전송 + 음성통화 + 송금
이 모든 게 한 번에 들어옴

플러그인도 마찬가지:
  설치 한 번이면 여러 기능이 한꺼번에 추가됨
</div>

## 핵심 차이 비교

| 구분 | 스킬 (Skill) | 플러그인 (Plugin) |
|------|-------------|-----------------|
| 정체 | 텍스트 지침 1개 | 기능 묶음 패키지 |
| 구성 | SKILL.md 파일 | 스킬+도구+자동화 |
| 설치 | 파일 만들기 | `/plugin` 으로 설치 |
| 능력 | '이렇게 해줘' | '이 도구를 써' |
| 만들기 | 쉬움 (글쓰기) | 보통 (구조 필요) |
| 외부 연결 | 불가능 | 가능 (API, 도구) |
| 네이밍 | `/hello` | `/플러그인명:hello` |
| 공유 | 파일 복사 | 마켓플레이스 배포 |

<div class="example-case">

비유:
스킬 = 요리 레시피 (종이에 적힌 방법)
→ "이 순서대로 만들어" 라고 알려줌
→ 재료와 도구는 이미 있어야 함

플러그인 = 밀키트 (레시피 + 재료 + 도구 세트)
→ 레시피도 있고, 특수 소스도 들어있고,
  전용 조리 도구까지 포함
→ 설치만 하면 바로 사용 가능
</div>

---

## `/plugin` — 플러그인 통합 관리 명령어

플러그인 관련 모든 작업은 `/plugin` 명령어로 합니다.
~~`/install`이나 `/plugins`가 아닙니다~~ — `/plugin` 하나로 통합되어 있습니다.

### `/plugin` UI 구성

`/plugin`을 입력하면 4개의 탭이 있는 인터페이스가 열립니다.

| 탭 | 역할 | 비유 |
|------|------|------|
| **Discover** | 설치 가능한 플러그인 탐색 | 앱스토어 둘러보기 |
| **Installed** | 설치된 플러그인 관리 | 내 앱 목록 |
| **Marketplaces** | 마켓플레이스 추가/제거 | 앱스토어 등록/해제 |
| **Errors** | 플러그인 오류 확인 | 오류 로그 |

<kbd>Tab</kbd> 키로 탭 이동, <kbd>Shift+Tab</kbd>으로 역방향 이동

---

## 마켓플레이스 (Marketplace)

### 마켓플레이스란?

마켓플레이스 = 앱스토어

플러그인을 모아놓은 카탈로그입니다.
**앱스토어를 먼저 등록해야 앱을 설치할 수 있듯이**,
마켓플레이스를 먼저 추가해야 플러그인을 설치할 수 있습니다.

### 공식 마켓플레이스 (자동 등록)

Anthropic 공식 마켓플레이스(`claude-plugins-official`)는 Claude Code 시작 시 **자동으로 등록**됩니다.
별도 추가 없이 바로 `/plugin` → Discover 탭에서 공식 플러그인을 볼 수 있습니다.

### 마켓플레이스 추가하기

공식 외 다른 마켓플레이스를 추가하려면:

```bash
/plugin marketplace add anthropics/claude-code
```

> **팁**: VS Code 확장에서는 `/plugin` → Marketplace 탭으로 이동한 후, GitHub URL을 직접 붙여넣으면 됩니다. 처음에는 비어있는데, URL을 넣으면 설치 가능한 플러그인 목록이 나타납니다.

소스 종류별 추가 방법:

| 소스 | 명령어 |
|------|--------|
| GitHub | `/plugin marketplace add owner/repo` |
| GitLab/기타 Git | `/plugin marketplace add https://gitlab.com/company/plugins.git` |
| 특정 브랜치/태그 | `/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0` |
| 로컬 경로 | `/plugin marketplace add ./my-marketplace` |
| 원격 URL | `/plugin marketplace add https://example.com/marketplace.json` |

<div class="example-case">

비유: 앱스토어 등록
기본으로 "Apple App Store"가 깔려 있고 (= 공식 마켓플레이스)
추가로 "회사 전용 앱스토어"를 등록할 수도 있는 것 (= 팀 마켓플레이스)
</div>

### 마켓플레이스 관리 명령어

```bash
/plugin marketplace list       # 등록된 마켓플레이스 목록
/plugin marketplace update 이름  # 플러그인 목록 새로고침
/plugin marketplace remove 이름  # 마켓플레이스 제거 (설치된 플러그인도 함께 삭제)
```

> 팁: `marketplace` 대신 `market`으로 줄여 쓸 수 있습니다.

---

## 플러그인 설치하기

### 방법 1: UI로 설치 (추천)

**예시 케이스:**

<div class="example-case">

나: (Claude Code 대화창에서)
→ `/plugin` 입력
→ <kbd>Tab</kbd> 키로 **Discover** 탭 이동
→ 원하는 플러그인 선택 후 <kbd>Enter</kbd>
→ 설치 범위 선택:
  - **User scope** — 내 모든 프로젝트에서 사용
  - **Project scope** — 이 프로젝트의 모든 협업자가 사용
  - **Local scope** — 이 프로젝트에서 나만 사용
→ 설치 완료!
</div>

### 방법 2: 명령어로 직접 설치

설치할 플러그인 이름을 알고 있다면:

```bash
/plugin install 플러그인명@마켓플레이스명
```

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">commit-commands 플러그인을 설치하고 싶어</span>"

→ `/plugin install commit-commands@claude-plugins-official`
→ 설치 완료
→ `/commit-commands:commit` 으로 바로 사용 가능

"<span class="keyword-highlight">데모 마켓플레이스에서 플러그인을 설치하고 싶어</span>"

→ 먼저 마켓플레이스 추가: `/plugin marketplace add anthropics/claude-code`
→ 그 다음 설치: `/plugin install commit-commands@anthropics-claude-code`
</div>

### 설치 범위 (Scope)

| 범위 | 적용 대상 | 저장 위치 | 비유 |
|------|----------|----------|------|
| **User** (기본) | 나의 모든 프로젝트 | `~/.claude/` | 내 폰에 앱 설치 |
| **Project** | 이 프로젝트 전체 협업자 | `.claude/settings.json` | 회사 공용 앱 설치 |
| **Local** | 이 프로젝트에서 나만 | 로컬 설정 | 내 폰에 특정 폴더 전용 앱 |
| **Managed** | 관리자가 설정 | 관리 정책 | 회사에서 필수 설치한 앱 |

명령어로 범위 지정:

```bash
claude plugin install formatter@your-org --scope project
```

---

## 플러그인 관리하기

### 설치된 플러그인 보기

```bash
/plugin          # → Installed 탭에서 확인
```

### 비활성화 / 활성화 / 제거

```bash
/plugin disable 플러그인명@마켓플레이스명   # 끄기 (삭제는 아님)
/plugin enable 플러그인명@마켓플레이스명    # 다시 켜기
/plugin uninstall 플러그인명@마켓플레이스명  # 완전 삭제
```

<div class="example-case">

비유: 스마트폰 앱 관리
`disable` = 앱을 꺼두기 (데이터는 유지)
`enable` = 앱을 다시 켜기
`uninstall` = 앱 삭제
</div>

### 변경사항 즉시 적용

플러그인 설치/활성화/비활성화 후 일부 변경사항은 즉시 적용되지만,
LSP 서버 등은 재시작이 필요합니다.

```bash
/reload-plugins    # 재시작 없이 플러그인 변경사항 적용
```

---

## 공식 플러그인 카탈로그

### 코드 지능 (LSP)

코드 편집 후 자동으로 오류를 감지하고, 정의로 이동, 참조 찾기 등을 지원합니다.
해당 언어의 Language Server가 시스템에 설치되어 있어야 합니다.

| 언어 | 플러그인 | 필요한 바이너리 |
|------|---------|----------------|
| TypeScript | `typescript-lsp` | `typescript-language-server` |
| Python | `pyright-lsp` | `pyright-langserver` |
| Rust | `rust-analyzer-lsp` | `rust-analyzer` |
| Go | `gopls-lsp` | `gopls` |
| C/C++ | `clangd-lsp` | `clangd` |
| Java | `jdtls-lsp` | `jdtls` |
| Swift | `swift-lsp` | `sourcekit-lsp` |
| PHP | `php-lsp` | `intelephense` |
| Kotlin | `kotlin-lsp` | `kotlin-language-server` |

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">TypeScript 프로젝트에서 코드 지능을 쓰고 싶어</span>"

→ `/plugin install typescript-lsp@claude-plugins-official`
→ 시스템에 `typescript-language-server`가 설치되어 있어야 함
→ 설치 후 Claude가 파일 수정 시 자동으로 타입 에러를 감지
→ <kbd>Ctrl+O</kbd> 로 진단 결과 확인 가능
</div>

### 외부 서비스 연동

MCP 서버가 포함된 플러그인으로, 외부 서비스와 바로 연결됩니다.

| 분류 | 플러그인 |
|------|---------|
| 소스 관리 | `github`, `gitlab` |
| 프로젝트 관리 | `atlassian` (Jira/Confluence), `asana`, `linear`, `notion` |
| 디자인 | `figma` |
| 인프라 | `vercel`, `firebase`, `supabase` |
| 커뮤니케이션 | `slack` |
| 모니터링 | `sentry` |

### 개발 워크플로우

| 플러그인 | 설명 |
|---------|------|
| `commit-commands` | Git 커밋, 푸시, PR 생성 워크플로우 |
| `pr-review-toolkit` | PR 리뷰 전문 에이전트 |
| `agent-sdk-dev` | Claude Agent SDK 개발 도구 |
| `plugin-dev` | 플러그인 개발 도구 |

### 출력 스타일

| 플러그인 | 설명 |
|---------|------|
| `explanatory-output-style` | 구현 선택에 대한 교육적 설명 |
| `learning-output-style` | 대화형 학습 모드 |

---

## 플러그인 만들기

### 스킬 vs 플러그인, 언제 뭘 만들까?

| 상황 | 추천 | 이유 |
|------|------|------|
| 개인 프로젝트용 규칙 | 스킬 (`.claude/skills/`) | 빠르고 간단 |
| 실험/프로토타입 | 스킬 | 먼저 검증 후 플러그인으로 전환 |
| 팀/커뮤니티에 공유 | 플러그인 | 마켓플레이스 배포 가능 |
| 여러 프로젝트에서 재사용 | 플러그인 | 한 번 설치로 어디서든 사용 |
| 외부 도구 연동 필요 | 플러그인 | MCP/LSP 포함 가능 |

> 팁: 스킬로 먼저 만들고, 잘 되면 플러그인으로 변환하는 게 가장 좋은 방법입니다.

### 플러그인 구조

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       ← 플러그인 정보 (이름, 버전, 설명)
├── skills/                ← 스킬 (자동 호출)
│   └── code-review/
│       └── SKILL.md
├── commands/              ← 슬래시 명령어
│   └── hello.md
├── agents/                ← 커스텀 에이전트
├── hooks/                 ← 이벤트 훅
│   └── hooks.json
├── .mcp.json              ← MCP 서버 설정
├── .lsp.json              ← LSP 서버 설정
└── settings.json          ← 기본 설정
```

> 주의: `commands/`, `agents/`, `skills/` 등은 플러그인 루트에 둡니다.
> `.claude-plugin/` 안에 넣지 마세요! `.claude-plugin/` 안에는 `plugin.json`만 들어갑니다.

### 빠르게 만들어보기

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">인사 플러그인을 만들어보고 싶어</span>"

→ 폴더 생성:

```bash
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/skills/hello
```

→ `my-plugin/.claude-plugin/plugin.json` 작성:

```json
{
  "name": "my-plugin",
  "description": "인사 플러그인",
  "version": "1.0.0"
}
```

→ `my-plugin/skills/hello/SKILL.md` 작성:

```markdown
---
description: 사용자에게 인사하기
---

사용자에게 친절하게 인사하고 어떻게 도울 수 있는지 물어보세요.
```

→ 테스트:

```bash
claude --plugin-dir ./my-plugin
```

→ Claude Code에서 `/my-plugin:hello` 입력하면 동작!
</div>

### 테스트와 디버깅

```bash
# 로컬 테스트 (설치 없이 바로 로드)
claude --plugin-dir ./my-plugin

# 여러 플러그인 동시 로드
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two

# 수정 후 재로드 (재시작 불필요)
/reload-plugins
```

### 기존 스킬을 플러그인으로 변환

이미 `.claude/` 디렉토리에 스킬이 있다면 플러그인으로 변환할 수 있습니다.

```bash
# 1. 플러그인 구조 생성
mkdir -p my-plugin/.claude-plugin

# 2. plugin.json 작성
# 3. 기존 파일 복사
cp -r .claude/commands my-plugin/
cp -r .claude/skills my-plugin/
cp -r .claude/agents my-plugin/

# 4. 테스트
claude --plugin-dir ./my-plugin
```

변환 후 원본 `.claude/` 파일은 삭제해도 됩니다 (플러그인이 우선 적용됨).

---

## 플러그인의 권한과 보안

플러그인은 **내 사용자 권한으로 코드를 실행**할 수 있는 신뢰도 높은 컴포넌트입니다.

주의사항:
- **신뢰할 수 있는 소스의 플러그인만 설치하세요**
- Anthropic은 공식 마켓플레이스 외의 플러그인 내용을 검증하지 않습니다
- 설치 전 플러그인의 홈페이지와 소스 코드를 확인하세요

<div class="example-case">

비유: 앱 설치 시 주의사항

"공식 앱스토어(공식 마켓플레이스)의 앱은 검수를 거쳤지만,
알 수 없는 출처의 APK 파일(서드파티 마켓플레이스)은
직접 안전성을 확인해야 하는 것"과 같습니다.
</div>

---

## 트러블슈팅

### `/plugin` 명령어가 안 먹힘

Claude Code 버전이 **1.0.33 이상**이어야 합니다.

```bash
claude --version    # 버전 확인
```

업데이트:

```bash
# Homebrew
brew upgrade claude-code

# npm
npm update -g @anthropic-ai/claude-code
```

### 자주 발생하는 문제

| 문제 | 해결법 |
|------|--------|
| 마켓플레이스 로딩 안 됨 | URL 접근 가능한지 확인, `.claude-plugin/marketplace.json` 존재 여부 확인 |
| 플러그인 설치 실패 | 소스 URL 접근 가능한지, 저장소가 public인지 확인 |
| 스킬이 안 보임 | `rm -rf ~/.claude/plugins/cache` 후 재시작, 재설치 |
| LSP 서버 안 됨 | 해당 바이너리가 `$PATH`에 있는지 확인. `/plugin` → Errors 탭 확인 |
| 메모리 과다 사용 | `rust-analyzer`, `pyright` 등 큰 프로젝트에서 메모리 문제 시 `/plugin disable` |

---

## Skills 2.0 — 자가 테스트와 자동 개선

최신 Skills 2.0에는 3가지 핵심 업그레이드가 추가되었습니다:

### 1. eVals (자가 테스트)

스킬을 실제로 쓰기 전에 **Claude가 스스로 테스트**합니다.

샘플 입력을 주면 → Claude가 실행해보고 → 결과가 기대와 맞는지 확인합니다.

<div class="example-case">

비유: 요리사가 손님에게 내기 전에 맛보기

"이 레시피(스킬)대로 만들어봤는데, 맛(결과)이 괜찮은지 먼저 확인"
→ 문제가 있으면 미리 알려줌
</div>

### 2. Auto Refinement (자동 개선)

eVals에서 문제가 발견되면 Claude가 **스스로 스킬을 수정**합니다.

사람이 직접 SKILL.md를 다시 열어서 고칠 필요 없이, Claude가 피드백을 바탕으로 지침을 자동 업데이트합니다.

### 3. Composability (조합 가능)

여러 스킬을 **레고 블록처럼 쌓아서** 복잡한 워크플로우를 만들 수 있습니다.

```
스킬 A: 리서치 → 스킬 B: 글쓰기 → 스킬 C: 포맷팅
= 하나의 자동화 파이프라인 완성
```

이 기능들은 Claude.ai, Claude Code, Claude API 모두에서 동작합니다.

---

## 언제 뭘 쓰면 좋을까?

**스킬을 쓸 때:**
- Claude의 행동 방식을 바꾸고 싶을 때
- "이런 형식으로 해줘" 같은 규칙을 정할 때
- 직접 만들어서 프로젝트에 넣고 싶을 때

  예: <span class="keyword-highlight">코드 리뷰는 항상 보안 체크부터 해줘</span>
     <span class="keyword-highlight">커밋 메시지는 이 형식으로 써줘</span>

**플러그인을 쓸 때:**
- 새로운 도구/능력이 필요할 때
- 외부 서비스와 연결해야 할 때
- 복잡한 기능을 한 번에 추가하고 싶을 때

  예: <span class="keyword-highlight">디자인 생성 기능이 필요해</span> → frontend-design 플러그인
     <span class="keyword-highlight">Slack과 연동하고 싶어</span> → Slack 플러그인

<div class="example-case">

비유 정리:
스킬 = 직원에게 주는 업무 지침서
(행동 규칙을 알려줌)

플러그인 = 직원에게 주는 새 장비
(새로운 능력을 부여함)
</div>

> 출처: [Anthropic 공식 문서 - 플러그인 만들기](https://code.claude.com/docs/en/plugins) · [플러그인 설치](https://code.claude.com/docs/en/discover-plugins)
