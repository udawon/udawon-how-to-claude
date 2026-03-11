---
title: "GitHub Actions로 Claude 자동화하기"
source: "https://code.claude.com/docs/en/github-actions"
order: 38
tags: ["CI/CD", "GitHub", "기업·개발자"]
---

# GitHub Actions로 Claude 자동화하기

## 이게 뭔가요?

GitHub Actions는 코드 저장소에서 특정 일이 일어날 때 자동으로 작업을 실행하는 기능입니다. 예를 들어 누군가 코드 변경 사항을 올리면(PR을 열면) 자동으로 Claude가 그 코드를 검토하거나, 이슈에 `@claude`라고 언급하면 Claude가 직접 코드를 작성해 PR을 만들어주는 식입니다.

쉽게 비유하자면, GitHub Actions는 **사무실 자동화 시스템**과 같습니다. "누군가 문서를 제출하면 자동으로 검토 요청 이메일을 보내라"처럼, "누군가 `@claude`라고 댓글을 달면 자동으로 Claude가 작업을 수행하라"고 설정하는 것입니다.

## 무엇을 할 수 있나요?

| 할 수 있는 일 | 설명 |
|---|---|
| 즉시 PR 생성 | 원하는 내용을 설명하면 Claude가 모든 변경사항이 포함된 PR을 만들어줍니다 |
| 자동 코드 구현 | 이슈(작업 요청)를 실제 동작하는 코드로 변환합니다 |
| 프로젝트 규칙 준수 | `CLAUDE.md` 파일에 정의한 코딩 규칙을 자동으로 따릅니다 |
| 보안 유지 | 코드는 GitHub 서버에서만 실행되어 외부로 유출되지 않습니다 |

## 시작하는 방법

### 방법 1: 자동 설치 (권장)

Claude Code 터미널에서 아래 명령어를 실행하세요.

```
/install-github-app
```

이 명령어가 GitHub 앱 설치와 필요한 설정을 단계별로 안내해줍니다.

> **주의**: 이 방법은 GitHub에서 직접 Claude API를 사용하는 경우에만 가능합니다. AWS Bedrock이나 Google Vertex AI를 사용하는 기업 환경이라면 수동 설치가 필요합니다.

### 방법 2: 수동 설치

1. **Claude GitHub 앱 설치**: [https://github.com/apps/claude](https://github.com/apps/claude) 에서 저장소에 설치합니다.
2. **API 키 등록**: 저장소 설정 → Secrets에 `ANTHROPIC_API_KEY`를 추가합니다.
3. **워크플로우 파일 복사**: [공식 예시 파일](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml)을 저장소의 `.github/workflows/` 폴더에 복사합니다.

설치가 완료되면 이슈나 PR 댓글에 `@claude`라고 입력해서 테스트해보세요.

## 기본 워크플로우 파일 예시

아래는 가장 기본적인 설정입니다. 이 파일을 `.github/workflows/claude.yml`로 저장하면, PR이나 이슈에 `@claude`라고 댓글을 달 때마다 Claude가 자동으로 응답합니다.

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 예시 케이스

### 케이스 1: 이슈를 코드로 전환

팀원이 GitHub 이슈에 "사용자 로그인 기능이 필요합니다"라고 작성하고 댓글로 `@claude implement this feature based on the issue description`라고 입력합니다. Claude는 이슈 내용을 분석하고 로그인 기능 코드를 작성한 뒤 PR을 자동으로 생성합니다.

### 케이스 2: 버그 수정 요청

PR 리뷰 중 개발자가 `@claude fix the TypeError in the user dashboard component`라고 댓글을 답니다. Claude가 해당 오류를 찾아 수정한 뒤 코드를 업데이트합니다.

### 케이스 3: 매일 아침 자동 리포트

매일 오전 9시에 어제의 커밋 내역과 열린 이슈를 정리한 리포트를 자동으로 생성합니다.

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "어제의 커밋과 열린 이슈 요약을 생성해주세요"
```

## 비용 안내

Claude GitHub Actions를 사용하면 두 가지 비용이 발생합니다.

| 비용 종류 | 내용 |
|---|---|
| GitHub Actions 실행 비용 | GitHub 서버(runner)에서 작업이 실행될 때마다 발생 |
| Claude API 사용 비용 | Claude가 코드를 분석하고 응답할 때마다 토큰이 소모됨 |

**비용 절감 팁:**
- 불필요한 `@claude` 호출을 줄이세요.
- `--max-turns` 옵션으로 대화 횟수를 제한하세요.
- 워크플로우에 타임아웃을 설정해 무한 실행을 방지하세요.

## 주요 설정 옵션

| 옵션 이름 | 설명 | 필수 여부 |
|---|---|---|
| `prompt` | Claude에게 줄 지시 사항 | 아니오 |
| `claude_args` | Claude CLI에 전달할 추가 옵션 | 아니오 |
| `anthropic_api_key` | Claude API 키 | 예 |
| `trigger_phrase` | 트리거 문구 (기본값: `@claude`) | 아니오 |
| `use_bedrock` | AWS Bedrock 사용 여부 | 아니오 |
| `use_vertex` | Google Vertex AI 사용 여부 | 아니오 |

## 보안 주의사항

> **절대로 API 키를 코드에 직접 적지 마세요!**

항상 GitHub Secrets를 사용해 API 키를 안전하게 관리하세요. 워크플로우 파일에서는 `${{ secrets.ANTHROPIC_API_KEY }}` 형태로만 참조하면 됩니다.

## Claude의 행동 방식 커스터마이징

저장소 루트에 `CLAUDE.md` 파일을 만들면 Claude가 해당 프로젝트에서 따라야 할 규칙을 정의할 수 있습니다. 예를 들어 코딩 스타일, 리뷰 기준, 프로젝트 특화 규칙 등을 작성해두면 Claude가 자동으로 이 규칙을 준수합니다.

## 기업 환경 (AWS Bedrock / Google Vertex AI)

회사에서 데이터 보안 정책 또는 클라우드 계약 때문에 AWS나 Google Cloud를 직접 사용해야 하는 경우에도 동일한 기능을 사용할 수 있습니다. 별도의 GitHub App을 만들고 클라우드 인증을 설정한 뒤 워크플로우 파일을 조정하면 됩니다.

## 문제 해결

| 문제 | 확인할 것 |
|---|---|
| `@claude`를 입력해도 반응이 없다 | GitHub App 설치 여부, 워크플로우 활성화 여부, API 키 등록 여부 확인 |
| Claude가 커밋한 코드로 CI가 실행 안 된다 | GitHub App 또는 커스텀 앱 사용 여부, 워크플로우 트리거 설정 확인 |
| 인증 오류가 발생한다 | API 키 유효성, Bedrock/Vertex 자격증명 설정 확인 |
