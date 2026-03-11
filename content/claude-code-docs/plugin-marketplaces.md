---
title: "플러그인 마켓플레이스 만들기 — 팀과 커뮤니티에 플러그인 배포하기"
source: "https://code.claude.com/docs/en/plugin-marketplaces"
order: 26
tags: ["플러그인", "마켓플레이스", "기업·개발자"]
---

# 플러그인 마켓플레이스 만들기

> 마켓플레이스는 여러분이 만든 플러그인을 팀이나 커뮤니티와 쉽게 나눌 수 있는 "배포 채널"입니다.

---

## 마켓플레이스 만들기란?

마켓플레이스를 만든다는 것은 "내가 운영하는 앱스토어"를 만드는 것과 같습니다. 팀 전용 플러그인 목록을 한 곳에 모아두면, 팀원들이 `/plugin marketplace add`로 접근해 원하는 플러그인을 설치할 수 있습니다.

**마켓플레이스 운영 흐름**:
1. 플러그인 제작 (명령어, 에이전트, 훅 등)
2. `marketplace.json` 파일로 카탈로그 생성
3. GitHub 등 git 서비스에 호스팅
4. 사용자에게 공유

---

## 예시 케이스

> **상황**: 스타트업 개발팀 리드인 현아씨는 팀 전체가 동일한 코드 리뷰 기준을 따르길 원합니다. 혼자서 `.claude/` 폴더에 설정해두었는데, 새로운 팀원이 합류할 때마다 수동으로 파일을 복사해줘야 하는 상황입니다. 팀 마켓플레이스를 만들어 GitHub에 올리면, 신규 팀원이 `/plugin marketplace add your-org/team-plugins` 한 줄로 모든 팀 플러그인을 설치할 수 있습니다.

---

## 로컬 마켓플레이스 만들기 (단계별 가이드)

### 1단계: 폴더 구조 만들기

```bash
mkdir -p my-marketplace/.claude-plugin
mkdir -p my-marketplace/plugins/quality-review-plugin/.claude-plugin
mkdir -p my-marketplace/plugins/quality-review-plugin/skills/quality-review
```

### 2단계: 스킬 파일 만들기

`my-marketplace/plugins/quality-review-plugin/skills/quality-review/SKILL.md`:

```markdown
---
description: 버그, 보안, 성능을 위한 코드 검토
disable-model-invocation: true
---

선택한 코드나 최근 변경사항에서 다음을 검토합니다:
- 잠재적 버그 또는 엣지 케이스
- 보안 우려사항
- 성능 문제
- 가독성 개선점

간결하고 실행 가능한 피드백을 제공하세요.
```

### 3단계: 플러그인 manifest 만들기

`my-marketplace/plugins/quality-review-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "quality-review-plugin",
  "description": "빠른 코드 리뷰를 위한 /quality-review 스킬 추가",
  "version": "1.0.0"
}
```

### 4단계: 마켓플레이스 카탈로그 파일 만들기

`my-marketplace/.claude-plugin/marketplace.json`:

```json
{
  "name": "my-plugins",
  "owner": {
    "name": "홍길동"
  },
  "plugins": [
    {
      "name": "quality-review-plugin",
      "source": "./plugins/quality-review-plugin",
      "description": "빠른 코드 리뷰를 위한 /quality-review 스킬 추가"
    }
  ]
}
```

### 5단계: 추가 및 설치

```shell
/plugin marketplace add ./my-marketplace
/plugin install quality-review-plugin@my-plugins
```

### 6단계: 사용해보기

```shell
/review
```

---

## marketplace.json 파일 구조

### 필수 항목

| 항목 | 유형 | 설명 | 예시 |
|------|------|------|------|
| `name` | 문자열 | 마켓플레이스 고유 이름 (소문자, 하이픈) | `"acme-tools"` |
| `owner` | 객체 | 관리자 정보 | `{"name": "팀 이름"}` |
| `plugins` | 배열 | 플러그인 목록 | 아래 참조 |

> **예약 이름 주의**: `claude-code-marketplace`, `claude-plugins-official`, `anthropic-marketplace` 등 Anthropic 공식 이름을 흉내 낸 이름은 사용할 수 없습니다.

### 선택 메타데이터

| 항목 | 설명 |
|------|------|
| `metadata.description` | 마켓플레이스 간단 설명 |
| `metadata.version` | 마켓플레이스 버전 |
| `metadata.pluginRoot` | 상대 경로 기준 폴더 (예: `"./plugins"` 설정 시 각 플러그인 source에서 `./plugins/` 생략 가능) |

---

## 플러그인 소스 유형

마켓플레이스 내 각 플러그인을 어디서 가져올지 지정합니다.

| 소스 유형 | 사용 방법 | 예시 |
|---------|---------|------|
| **상대 경로** | 같은 저장소 내 폴더 | `"./plugins/my-plugin"` |
| **GitHub** | GitHub 저장소 | `{"source": "github", "repo": "owner/repo"}` |
| **Git URL** | 모든 Git 서비스 | `{"source": "url", "url": "https://gitlab.com/x.git"}` |
| **Git 하위 폴더** | 모노레포 내 특정 폴더 | `{"source": "git-subdir", "url": "...", "path": "tools/plugin"}` |
| **npm** | npm 패키지 | `{"source": "npm", "package": "@org/plugin"}` |

### 상대 경로 예시

```json
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

> **주의**: 상대 경로는 Git을 통해 마켓플레이스를 추가할 때만 작동합니다. URL로 직접 추가하면 작동하지 않습니다.

### GitHub 예시 (특정 버전 고정)

```json
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6..."
  }
}
```

### npm 예시

```json
{
  "name": "my-npm-plugin",
  "source": {
    "source": "npm",
    "package": "@acme/claude-plugin",
    "version": "2.1.0"
  }
}
```

---

## 마켓플레이스 호스팅 및 배포

### GitHub에서 호스팅 (권장)

1. 새 GitHub 저장소 만들기
2. `.claude-plugin/marketplace.json` 추가
3. 팀과 공유:

```shell
/plugin marketplace add your-org/your-marketplace-repo
```

### 비공개(Private) 저장소

비공개 저장소도 지원됩니다. 터미널에서 git이 작동하면 Claude Code에서도 작동합니다.

자동 업데이트를 위해서는 환경 변수 설정이 필요합니다:

| 서비스 | 환경 변수 |
|-------|---------|
| GitHub | `GITHUB_TOKEN` 또는 `GH_TOKEN` |
| GitLab | `GITLAB_TOKEN` 또는 `GL_TOKEN` |
| Bitbucket | `BITBUCKET_TOKEN` |

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

---

## 팀에 마켓플레이스 강제 적용

프로젝트의 `.claude/settings.json`에 추가하면 팀원들이 자동으로 설치 안내를 받습니다:

```json
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

기본 활성화할 플러그인도 지정할 수 있습니다:

```json
{
  "enabledPlugins": {
    "code-formatter@company-tools": true,
    "deployment-tools@company-tools": true
  }
}
```

---

## 관리자 마켓플레이스 제한

조직 관리자가 `strictKnownMarketplaces` 설정으로 허용 마켓플레이스를 제한할 수 있습니다.

| 설정 값 | 동작 |
|--------|------|
| 미설정 (기본) | 제한 없음, 사용자가 어떤 마켓플레이스든 추가 가능 |
| 빈 배열 `[]` | 완전 잠금, 어떤 마켓플레이스도 추가 불가 |
| 소스 목록 | 목록에 있는 마켓플레이스만 추가 가능 |

**특정 마켓플레이스만 허용**:

```json
{
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "acme-corp/approved-plugins"
    }
  ]
}
```

**내부 Git 서버의 모든 마켓플레이스 허용**:

```json
{
  "strictKnownMarketplaces": [
    {
      "source": "hostPattern",
      "hostPattern": "^github\\.example\\.com$"
    }
  ]
}
```

---

## 버전 관리 및 릴리스 채널

### 버전 설정 위치

| 플러그인 소스 | 버전 설정 위치 |
|------------|-------------|
| 상대 경로 플러그인 | `marketplace.json`의 플러그인 항목 |
| 다른 모든 소스 | 플러그인의 `plugin.json` |

> **주의**: 두 곳에 모두 설정하지 마세요. `plugin.json`이 항상 우선합니다.

### 릴리스 채널 구성 예시 (안정/최신)

**안정 채널 마켓플레이스** (`stable-tools/marketplace.json`):

```json
{
  "name": "stable-tools",
  "plugins": [
    {
      "name": "code-formatter",
      "source": {
        "source": "github",
        "repo": "acme-corp/code-formatter",
        "ref": "stable"
      }
    }
  ]
}
```

**최신 채널 마켓플레이스** (`latest-tools/marketplace.json`):

```json
{
  "name": "latest-tools",
  "plugins": [
    {
      "name": "code-formatter",
      "source": {
        "source": "github",
        "repo": "acme-corp/code-formatter",
        "ref": "latest"
      }
    }
  ]
}
```

---

## 검증 및 테스트

### 마켓플레이스 JSON 검증

```bash
claude plugin validate .
```

또는 Claude Code 내에서:

```shell
/plugin validate .
```

### 자주 발생하는 검증 오류

| 오류 메시지 | 원인 | 해결 방법 |
|-----------|------|---------|
| `File not found: .claude-plugin/marketplace.json` | manifest 파일 없음 | 필수 항목을 갖춘 파일 생성 |
| `Invalid JSON syntax` | JSON 문법 오류 | 쉼표, 따옴표 등 확인 |
| `Duplicate plugin name "x"` | 플러그인 이름 중복 | 각 플러그인에 고유한 이름 사용 |
| `Path traversal not allowed` | `..`를 포함한 경로 | `../` 없이 상대 경로 사용 |

---

## 문제 해결

### 마켓플레이스가 로드되지 않을 때

- URL이 접근 가능한지 확인
- `.claude-plugin/marketplace.json` 경로 확인
- `claude plugin validate`로 JSON 유효성 검사

### 상대 경로 플러그인이 URL 기반 마켓플레이스에서 실패할 때

URL로 추가한 마켓플레이스는 `marketplace.json` 파일만 다운로드하므로 상대 경로가 작동하지 않습니다. 해결 방법:

- 플러그인 소스를 GitHub, npm 등 외부 소스로 변경
- 마켓플레이스를 URL 대신 Git 저장소로 추가

### 설치 후 파일을 찾을 수 없을 때

플러그인은 캐시 폴더로 복사됩니다. 플러그인 폴더 밖의 파일(`../shared-utils` 등)은 복사되지 않아 작동하지 않습니다. 심볼릭 링크를 사용하면 외부 파일을 플러그인 폴더 안에 포함시킬 수 있습니다:

```bash
# 플러그인 폴더 안에서
ln -s /path/to/shared-utils ./shared-utils
```

### Git 작업 시간 초과

기본 제한은 120초입니다. 대용량 저장소나 느린 네트워크에서는 아래와 같이 늘릴 수 있습니다:

```bash
export CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS=300000  # 5분
```

---

## 다음 단계

- **플러그인 설치**: [플러그인 마켓플레이스 탐색](./discover-plugins.md)
- **플러그인 제작**: [플러그인 만들기](./plugins.md)
- **기술 명세**: [플러그인 레퍼런스](./plugins-reference.md)
