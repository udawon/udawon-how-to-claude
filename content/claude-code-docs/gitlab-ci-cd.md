---
title: "GitLab CI/CD로 Claude 자동화하기"
source: "https://code.claude.com/docs/en/gitlab-ci-cd"
order: 39
tags: ["CI/CD", "GitLab"]
---

# GitLab CI/CD로 Claude 자동화하기

> **참고**: 이 기능은 현재 베타(시험 운영) 단계입니다. GitLab이 직접 유지 관리합니다.

## 이게 뭔가요?

GitLab CI/CD는 코드 저장소에서 특정 이벤트가 발생할 때 자동으로 작업을 실행하는 시스템입니다. Claude Code를 GitLab CI/CD에 연결하면, 이슈나 MR(Merge Request, 코드 변경 요청)에서 `@claude`를 멘션하거나 특정 조건이 충족되면 Claude가 자동으로 코드를 분석하고 수정하며 MR을 생성합니다.

GitHub와 GitLab의 차이를 비유하자면, 같은 기능을 제공하는 두 개의 다른 플랫폼입니다. 회사에서 GitLab을 사용한다면 이 가이드가 맞습니다.

## 무엇을 할 수 있나요?

| 할 수 있는 일 | 설명 |
|---|---|
| 즉시 MR 생성 | 필요한 내용을 설명하면 Claude가 모든 변경사항이 포함된 MR을 제안합니다 |
| 자동 코드 구현 | 이슈 설명을 보고 실제 동작하는 코드로 변환합니다 |
| 프로젝트 규칙 준수 | `CLAUDE.md` 파일에 정의한 규칙을 자동으로 따릅니다 |
| 기업 환경 지원 | Claude API, AWS Bedrock, Google Vertex AI 중 선택 가능 |
| 보안 | 여러분의 GitLab 러너에서 실행되고 MR을 통해서만 변경사항이 반영됩니다 |

## 동작 방식

Claude Code가 GitLab CI/CD에서 작동하는 원리는 다음과 같습니다.

1. **이벤트 감지**: GitLab이 설정된 트리거(예: `@claude` 멘션)를 감지합니다.
2. **작업 실행**: 격리된 컨테이너(독립된 실행 환경)에서 Claude Code가 실행됩니다.
3. **결과 반영**: Claude의 변경사항은 MR을 통해서만 반영되므로, 담당자가 검토하고 승인해야 합니다.

이 과정 덕분에 AI가 자동으로 생성한 코드도 사람의 검토를 거치게 되어 안전합니다.

## 빠른 시작

### 1단계: API 키 등록

GitLab 저장소에서 **설정 → CI/CD → 변수(Variables)**로 이동해 `ANTHROPIC_API_KEY`를 추가합니다. 이때 반드시 "마스킹(Masked)" 옵션을 체크하여 로그에 키가 노출되지 않도록 합니다.

### 2단계: `.gitlab-ci.yml` 파일 수정

저장소 루트의 `.gitlab-ci.yml` 파일에 아래 내용을 추가합니다.

```yaml
stages:
  - ai

claude:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  variables:
    GIT_STRATEGY: fetch
  before_script:
    - apk update
    - apk add --no-cache git curl bash
    - curl -fsSL https://claude.ai/install.sh | bash
  script:
    - >
      claude
      -p "${AI_FLOW_INPUT:-'이 MR을 검토하고 요청된 변경사항을 구현해주세요'}"
      --permission-mode acceptEdits
      --allowedTools "Bash Read Edit Write mcp__gitlab"
```

설정 후 **CI/CD → 파이프라인**에서 수동으로 작업을 실행하거나, MR에서 `@claude`를 멘션하여 테스트할 수 있습니다.

## 예시 케이스

### 케이스 1: 이슈를 MR로 전환

개발팀 리더가 GitLab 이슈에 "결제 페이지 버그: 금액이 잘못 계산됨"이라고 등록하고 댓글로 `@claude implement this feature based on the issue description`이라고 입력합니다. Claude가 코드베이스를 분석하고 버그를 수정한 뒤 MR을 자동으로 생성합니다. 담당자는 MR을 검토하고 승인하면 됩니다.

### 케이스 2: MR 코드 개선 제안

코드 리뷰 중 팀원이 MR 댓글에 `@claude suggest a concrete approach to cache the results of this API call`이라고 입력합니다. Claude가 적절한 캐싱 코드를 작성하고 MR을 업데이트합니다.

### 케이스 3: 버그 신속 수정

이슈에 `@claude fix the TypeError in the user dashboard component`라고 댓글을 달면, Claude가 해당 버그를 찾아 수정하고 새 MR을 오픈합니다.

## 지원되는 클라우드 환경

기업 환경에 따라 세 가지 방식 중 선택할 수 있습니다.

| 방식 | 특징 | 적합한 상황 |
|---|---|---|
| Claude API (SaaS) | 가장 간단한 설정 | 개인 또는 소규모 팀 |
| AWS Bedrock | AWS 인프라 활용, IAM 기반 인증 | AWS를 주로 사용하는 기업 |
| Google Vertex AI | GCP 네이티브, Workload Identity Federation | GCP를 주로 사용하는 기업 |

### AWS Bedrock 설정

GitLab CI/CD 변수에 아래 항목을 추가합니다.

- `AWS_ROLE_TO_ASSUME`: IAM 역할 ARN
- `AWS_REGION`: Bedrock 리전 (예: `us-west-2`)

### Google Vertex AI 설정

GitLab CI/CD 변수에 아래 항목을 추가합니다.

- `GCP_WORKLOAD_IDENTITY_PROVIDER`: WIF 프로바이더 리소스 이름
- `GCP_SERVICE_ACCOUNT`: 서비스 계정 이메일
- `CLOUD_ML_REGION`: Vertex 리전 (예: `us-east5`)

## 보안 및 거버넌스

| 보안 요소 | 내용 |
|---|---|
| 격리 실행 | 각 작업은 네트워크가 제한된 독립 컨테이너에서 실행됩니다 |
| MR을 통한 변경 | Claude의 변경사항은 MR로만 반영되어 모든 변경이 검토를 거칩니다 |
| 브랜치 보호 | 기존 브랜치 보호 및 승인 규칙이 AI 생성 코드에도 동일하게 적용됩니다 |
| 권한 제한 | Claude Code는 작업 공간 내 파일만 수정할 수 있습니다 |

## 비용 안내

| 비용 종류 | 내용 |
|---|---|
| GitLab 러너 실행 비용 | Claude가 실행되는 동안 컴퓨팅 자원이 소모됩니다 |
| API 사용 비용 | Claude가 분석하고 응답할 때마다 토큰이 사용됩니다 |

**비용 절감 팁:**
- `max_turns` 및 작업 타임아웃을 적절히 설정하세요.
- 병렬 실행 수를 제한해 동시 작업량을 조절하세요.
- 구체적인 `@claude` 명령을 사용해 불필요한 반복을 줄이세요.

## 문제 해결

| 문제 | 확인할 것 |
|---|---|
| `@claude`에 반응이 없다 | 파이프라인 트리거 설정, CI/CD 변수 등록 여부 확인 |
| MR 생성이나 댓글 작성이 안 된다 | `CI_JOB_TOKEN` 권한, `mcp__gitlab` 도구 허용 여부 확인 |
| 인증 오류 | API 키 유효성, OIDC/WIF 설정, 시크릿 이름 확인 |

## Claude 행동 커스터마이징

저장소 루트에 `CLAUDE.md` 파일을 만들어 코딩 기준, 보안 요구사항, 프로젝트 규칙을 정의하세요. Claude는 실행 중 이 파일을 읽고 규칙에 따라 작동합니다.

특정 작업에 맞는 지시는 `.gitlab-ci.yml`의 `prompt` 또는 `AI_FLOW_INPUT` 변수를 통해 전달할 수 있습니다. 예를 들어 코드 리뷰용 작업과 기능 구현용 작업에 각각 다른 프롬프트를 설정할 수 있습니다.
