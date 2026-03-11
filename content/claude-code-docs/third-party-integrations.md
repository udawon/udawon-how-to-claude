---
title: "기업 배포 옵션 비교 및 서드파티 통합 가이드"
source: "https://code.claude.com/docs/en/third-party-integrations"
order: 46
tags: ["엔터프라이즈", "기업·개발자"]
---

# 기업 배포 옵션 비교 및 서드파티 통합 가이드

Claude Code를 조직에 도입할 때 "어떤 방식으로 제공받을까?"를 결정해야 합니다. 마치 사무용 소프트웨어를 구독 서비스로 쓸지, 직접 서버에 설치해서 쓸지 선택하는 것과 비슷합니다. 이 문서는 각 옵션을 비교하고, 프록시·게이트웨이 연결 방법과 조직 운영 모범 사례를 안내합니다.

---

## 배포 옵션 한눈에 비교

| 항목 | Claude for Teams/Enterprise | Anthropic 콘솔 | Amazon Bedrock | Google Vertex AI | Microsoft Foundry |
|------|----------------------------|----------------|----------------|-----------------|-------------------|
| **추천 대상** | 대부분의 조직 (권장) | 개인 개발자 | AWS 기반 조직 | GCP 기반 조직 | Azure 기반 조직 |
| **요금 방식** | Teams: 좌석당 $150/월 (프리미엄), Enterprise: 별도 문의 | 사용량 기반 (PAYG) | AWS 통한 PAYG | GCP 통한 PAYG | Azure 통한 PAYG |
| **인증 방식** | Claude.ai SSO 또는 이메일 | API 키 | AWS 자격증명 또는 API 키 | GCP 자격증명 | API 키 또는 Entra ID |
| **비용 추적** | 사용 대시보드 | 사용 대시보드 | AWS Cost Explorer | GCP Billing | Azure Cost Management |
| **웹 Claude 포함** | 예 | 아니오 | 아니오 | 아니오 | 아니오 |
| **기업 기능** | 팀 관리, SSO, 사용 모니터링 | 없음 | IAM, CloudTrail | IAM, Cloud 감사 로그 | RBAC, Azure Monitor |

### 어떤 옵션을 선택해야 할까요?

**Claude for Teams** — 대부분의 조직에 권장합니다. 팀원들이 Claude Code와 웹 Claude를 하나의 구독으로 함께 사용할 수 있습니다. 빠른 시작을 원하는 소규모 팀에 적합합니다.

**Claude for Enterprise** — SSO, 도메인 캡처, 역할 기반 권한, 규정 준수 API, 조직 전체 정책 관리가 필요한 대기업에 적합합니다.

**클라우드 제공업체(AWS/GCP/Azure)** — 이미 특정 클라우드를 사용 중이고, 데이터를 해당 클라우드 인프라 안에서 처리해야 하는 요건이 있을 때 선택합니다.

---

## 프록시와 게이트웨이 설정

대부분의 조직은 클라우드 제공업체를 직접 연결해도 충분합니다. 하지만 아래 두 가지 추가 레이어가 필요할 수 있습니다.

### 기업 프록시 vs LLM 게이트웨이 차이점

| 구분 | 기업 프록시 | LLM 게이트웨이 |
|------|------------|----------------|
| **역할** | 모든 인터넷 트래픽을 회사 서버를 거쳐 전송 | Claude Code와 클라우드 제공업체 사이에서 인증·라우팅 처리 |
| **사용 이유** | 보안 모니터링, 규정 준수, 네트워크 정책 | 중앙 집중식 사용량 추적, 비율 제한, 예산 관리 |
| **환경변수** | `HTTPS_PROXY` 또는 `HTTP_PROXY` | `ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, `ANTHROPIC_VERTEX_BASE_URL` |

두 설정은 동시에 사용할 수 있습니다.

---

## 프록시/게이트웨이 설정 방법

### Amazon Bedrock

**기업 프록시 사용 시:**
```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# 기업 프록시 설정
export HTTPS_PROXY='https://proxy.example.com:8080'
```

**LLM 게이트웨이 사용 시:**
```bash
export CLAUDE_CODE_USE_BEDROCK=1

# LLM 게이트웨이 설정
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # 게이트웨이가 AWS 인증을 처리하는 경우
```

### Microsoft Foundry

**기업 프록시 사용 시:**
```bash
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource
export ANTHROPIC_FOUNDRY_API_KEY=your-api-key

# 기업 프록시 설정
export HTTPS_PROXY='https://proxy.example.com:8080'
```

**LLM 게이트웨이 사용 시:**
```bash
export CLAUDE_CODE_USE_FOUNDRY=1

# LLM 게이트웨이 설정
export ANTHROPIC_FOUNDRY_BASE_URL='https://your-llm-gateway.com'
export CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1  # 게이트웨이가 Azure 인증을 처리하는 경우
```

### Google Vertex AI

**기업 프록시 사용 시:**
```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id

# 기업 프록시 설정
export HTTPS_PROXY='https://proxy.example.com:8080'
```

**LLM 게이트웨이 사용 시:**
```bash
export CLAUDE_CODE_USE_VERTEX=1

# LLM 게이트웨이 설정
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1  # 게이트웨이가 GCP 인증을 처리하는 경우
```

> **확인 방법**: Claude Code에서 `/status`를 실행하면 프록시 및 게이트웨이 설정이 올바르게 적용되었는지 확인할 수 있습니다.

---

## 조직 운영 모범 사례

### 1. 문서화와 CLAUDE.md에 투자하세요

Claude Code가 코드베이스를 이해하도록 CLAUDE.md 파일에 투자하는 것을 강력히 권장합니다. CLAUDE.md는 여러 레벨에 배치할 수 있습니다:

- **조직 전체**: macOS의 경우 `/Library/Application Support/ClaudeCode/CLAUDE.md`에 회사 전체 표준을 정의합니다.
- **저장소 레벨**: 저장소 루트의 `CLAUDE.md`에 프로젝트 아키텍처, 빌드 명령, 기여 가이드를 작성합니다. 소스 컨트롤에 체크인하면 모든 팀원이 혜택을 받습니다.

### 2. 간편한 설치 방법을 만드세요

커스텀 개발 환경이 있다면, Claude Code를 "원클릭"으로 설치할 수 있는 방법을 만드는 것이 조직 내 도입 확산의 핵심입니다.

### 3. 안내된 사용으로 시작하세요

신규 사용자에게는 코드베이스 Q&A나 작은 버그 수정부터 시작하도록 권장합니다:
- Claude Code에 계획 수립을 요청하세요
- 제안 내용을 검토하고 방향이 맞지 않으면 피드백을 주세요
- 점차 더 자율적인 작업을 맡기며 패러다임에 익숙해지세요

### 4. 클라우드 제공업체 사용 시 모델 버전을 고정하세요

Bedrock, Vertex AI, Foundry를 통해 배포하는 경우, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL`로 구체적인 모델 버전을 지정하세요.

### 5. 보안 정책을 설정하세요

보안팀은 Claude Code가 할 수 있는 것과 없는 것을 관리형 권한으로 구성할 수 있으며, 로컬 설정으로 덮어쓸 수 없습니다.

### 6. MCP로 통합을 확장하세요

MCP는 티켓 관리 시스템이나 오류 로그 같은 추가 정보를 Claude Code에 제공하는 좋은 방법입니다. 중앙 팀이 MCP 서버를 구성하고 `.mcp.json`을 코드베이스에 체크인하면 모든 사용자가 혜택을 받습니다.

---

## 다음 단계

1. **팀에 배포**: 설치 안내를 공유하고 팀원들이 자신의 자격증명으로 Claude Code를 설치하게 합니다.
2. **공유 설정 구성**: 저장소에 CLAUDE.md 파일을 생성해 코드베이스와 코딩 표준을 Claude Code에 알립니다.
3. **권한 설정**: 보안 설정을 검토해 Claude Code가 환경에서 할 수 있는 것과 없는 것을 정의합니다.

---

## 예시 케이스

**상황**: 100명 규모의 소프트웨어 회사가 개발자 전원에게 Claude Code를 도입하려 합니다. 회사는 AWS를 주로 쓰지만, Claude Code는 Teams 플랜으로 시작해 웹 Claude도 함께 사용하고 싶습니다. IT팀은 특정 명령어 실행을 제한하는 정책도 만들고 싶습니다.

**해결책**:
- Claude for Teams 플랜 구독 (개발자 100명 × $150/월)
- 조직 CLAUDE.md 파일을 각 저장소에 배포 (코딩 표준, 아키텍처 설명 포함)
- 관리형 권한으로 `Bash(rm -rf *)` 같은 위험 명령 차단
- Slack과 JIRA를 MCP로 연결해 Claude Code가 티켓 정보를 참조할 수 있게 설정

결과: 팀원들이 웹 Claude와 Claude Code를 하나의 계정으로 사용하고, 회사 정책이 자동으로 적용됩니다.
