---
title: "플러그인 마켓플레이스 탐색 및 설치 — 앱스토어처럼 Claude를 확장하기"
source: "https://code.claude.com/docs/en/discover-plugins"
order: 25
tags: ["플러그인", "마켓플레이스"]
---

# 플러그인 마켓플레이스 탐색 및 설치

> 마켓플레이스는 Claude Code용 "앱스토어"입니다. 누군가 만들어둔 유용한 플러그인을 찾아 설치할 수 있습니다.

---

## 마켓플레이스란?

마켓플레이스는 여러 플러그인이 모여 있는 카탈로그입니다. 사용 방법은 두 단계입니다:

1. **마켓플레이스 추가**: 어떤 앱스토어를 사용할지 등록합니다. 아직 아무것도 설치되지 않습니다.
2. **플러그인 설치**: 카탈로그를 둘러보고 원하는 플러그인을 선택해 설치합니다.

스마트폰 비유: 앱스토어를 추가하는 것이 첫 번째 단계, 원하는 앱을 다운로드하는 것이 두 번째 단계입니다.

---

## 예시 케이스

> **상황**: 백엔드 개발자 지수씨는 매일 GitHub PR 리뷰, 코드 포매팅, 슬랙 알림 전송을 반복합니다. Claude Code 마켓플레이스에서 `github`, `commit-commands` 플러그인을 설치하면 이 작업들을 자동화할 수 있다는 것을 알게 되었습니다. 마켓플레이스를 추가하고 플러그인을 설치하는 데 5분도 걸리지 않았습니다.

---

## 공식 Anthropic 마켓플레이스

Claude Code를 시작하면 공식 Anthropic 마켓플레이스(`claude-plugins-official`)가 자동으로 사용 가능합니다. `/plugin`을 실행하고 **Discover** 탭으로 이동하면 됩니다.

공식 마켓플레이스에서 플러그인 설치:

```shell
/plugin install plugin-name@claude-plugins-official
```

---

## 공식 마켓플레이스 플러그인 카테고리

### 코드 지능 (Language Server Protocol)

Claude Code에 실시간 코드 분석 기능을 추가합니다. 파일을 수정할 때마다 즉시 오류와 경고를 알려줍니다.

| 언어 | 플러그인 이름 | 필요한 바이너리 |
|------|------------|--------------|
| C/C++ | `clangd-lsp` | `clangd` |
| Go | `gopls-lsp` | `gopls` |
| Java | `jdtls-lsp` | `jdtls` |
| PHP | `php-lsp` | `intelephense` |
| Python | `pyright-lsp` | `pyright-langserver` |
| Rust | `rust-analyzer-lsp` | `rust-analyzer` |
| TypeScript | `typescript-lsp` | `typescript-language-server` |

> **코드 지능 플러그인의 효과**: 설치 후 Claude가 파일을 수정할 때마다 언어 서버가 자동으로 오류와 경고를 보고합니다. Claude가 실수를 즉시 발견하고 같은 턴 안에 수정합니다. **Ctrl+O**를 누르면 진단 내용을 인라인으로 볼 수 있습니다.

### 외부 서비스 연결

별도 설정 없이 Claude를 외부 서비스에 연결합니다:

| 카테고리 | 플러그인 |
|---------|---------|
| 소스 관리 | `github`, `gitlab` |
| 프로젝트 관리 | `atlassian` (Jira/Confluence), `asana`, `linear`, `notion` |
| 디자인 | `figma` |
| 인프라 | `vercel`, `firebase`, `supabase` |
| 커뮤니케이션 | `slack` |
| 모니터링 | `sentry` |

### 개발 워크플로우

| 플러그인 | 기능 |
|---------|------|
| `commit-commands` | Git 커밋, 푸시, PR 생성 자동화 |
| `pr-review-toolkit` | PR 리뷰 전문 에이전트 |
| `agent-sdk-dev` | Claude Agent SDK 개발 도구 |
| `plugin-dev` | 플러그인 제작 도구 |

### 출력 스타일 커스터마이징

| 플러그인 | 효과 |
|---------|------|
| `explanatory-output-style` | 구현 선택에 대한 교육적 인사이트 추가 |
| `learning-output-style` | 기술 습득을 위한 인터랙티브 학습 모드 |

---

## 데모 마켓플레이스 체험하기

Anthropic이 운영하는 데모 마켓플레이스(`claude-code-plugins`)로 플러그인 시스템을 체험할 수 있습니다.

### 1단계: 마켓플레이스 추가

```shell
/plugin marketplace add anthropics/claude-code
```

### 2단계: 플러그인 탐색

`/plugin`을 실행하면 4개 탭이 나타납니다:

| 탭 | 기능 |
|----|------|
| **Discover** | 모든 마켓플레이스에서 사용 가능한 플러그인 탐색 |
| **Installed** | 설치된 플러그인 관리 |
| **Marketplaces** | 마켓플레이스 추가/제거/업데이트 |
| **Errors** | 플러그인 로딩 오류 확인 |

### 3단계: 플러그인 설치

설치 범위를 선택합니다:

| 범위 | 의미 |
|------|------|
| **User scope** | 모든 프로젝트에서 나만 사용 |
| **Project scope** | 이 저장소의 모든 협업자가 사용 |
| **Local scope** | 이 저장소에서 나만 사용 (공유되지 않음) |

CLI에서 직접 설치:

```shell
/plugin install commit-commands@anthropics-claude-code
```

### 4단계: 사용해보기

```shell
/commit-commands:commit
```

이 명령어 하나로 변경사항 스테이징, 커밋 메시지 생성, 커밋 생성이 자동으로 완료됩니다.

---

## 마켓플레이스 추가 방법

### GitHub 저장소에서 추가

```shell
/plugin marketplace add owner/repo
```

예시: `anthropics/claude-code` = GitHub의 `anthropics` 사용자의 `claude-code` 저장소

### 다른 Git 서비스에서 추가

```shell
# HTTPS
/plugin marketplace add https://gitlab.com/company/plugins.git

# SSH
/plugin marketplace add git@gitlab.com:company/plugins.git

# 특정 브랜치나 태그
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

### 로컬 폴더에서 추가

```shell
/plugin marketplace add ./my-marketplace
```

### 원격 URL에서 추가

```shell
/plugin marketplace add https://example.com/marketplace.json
```

---

## 설치된 플러그인 관리

### 비활성화/활성화

```shell
# 비활성화 (제거하지 않음)
/plugin disable plugin-name@marketplace-name

# 다시 활성화
/plugin enable plugin-name@marketplace-name
```

### 제거

```shell
/plugin uninstall plugin-name@marketplace-name
```

### 범위 지정 (CLI)

```shell
claude plugin install formatter@your-org --scope project
claude plugin uninstall formatter@your-org --scope project
```

### 재시작 없이 변경사항 적용

```shell
/reload-plugins
```

새로 설치하거나 활성화/비활성화한 플러그인의 명령어와 훅이 즉시 적용됩니다. LSP 서버 변경은 재시작이 필요합니다.

---

## 팀 마켓플레이스 설정

프로젝트의 `.claude/settings.json`에 마켓플레이스 설정을 추가하면, 팀원들이 해당 폴더를 신뢰할 때 자동으로 설치 안내를 받습니다.

```json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

---

## 보안 주의사항

플러그인과 마켓플레이스는 여러분의 컴퓨터에서 임의 코드를 실행할 수 있는 높은 권한을 가집니다. **믿을 수 있는 출처의 플러그인만 설치하세요.** 각 플러그인의 홈페이지에서 상세 정보를 확인하세요.

---

## 자주 묻는 문제 해결

### `/plugin` 명령어가 없다고 나올 때

1. 버전 확인: `claude --version` (1.0.33 이상 필요)
2. 업데이트:
   - Homebrew: `brew upgrade claude-code`
   - npm: `npm update -g @anthropic-ai/claude-code`
3. 터미널 재시작 후 `claude` 재실행

### 마켓플레이스가 로드되지 않을 때

- URL이 접근 가능한지 확인
- `.claude-plugin/marketplace.json` 파일이 해당 경로에 있는지 확인

### 플러그인 스킬이 보이지 않을 때

캐시를 삭제하고 재시작 후 재설치합니다:

```bash
rm -rf ~/.claude/plugins/cache
```

### 코드 지능 플러그인 관련

- **언어 서버가 시작되지 않음**: 바이너리가 PATH에 있는지 확인, `/plugin` Errors 탭 확인
- **메모리 사용량이 높음**: `rust-analyzer`, `pyright` 등은 대형 프로젝트에서 많은 메모리를 사용합니다. 문제가 심각하면 `/plugin disable <plugin-name>`으로 비활성화하세요

---

## 다음 단계

- **나만의 플러그인 만들기**: [플러그인 만들기](./plugins.md)
- **마켓플레이스 만들기**: [마켓플레이스 만들기](./plugin-marketplaces.md)
- **기술 명세**: [플러그인 레퍼런스](./plugins-reference.md)
