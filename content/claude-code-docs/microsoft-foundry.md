---
title: "Microsoft Foundry로 Claude Code 사용하기"
source: "https://code.claude.com/docs/en/microsoft-foundry"
order: 45
tags: ["엔터프라이즈", "Azure"]
---

# Microsoft Foundry로 Claude Code 사용하기

Microsoft Foundry(구 Azure AI Foundry)는 마이크로소프트 Azure 클라우드에서 AI 모델을 사용할 수 있게 해주는 플랫폼입니다. 회사에서 이미 Microsoft Azure를 사용하고 있다면, 기존 Azure 계정, Active Directory(Entra ID), 비용 관리 도구를 그대로 활용하면서 Claude Code를 사용할 수 있습니다.

---

## 이런 분에게 필요합니다

- 회사에서 Microsoft Azure를 주로 사용하는 분
- Azure Active Directory(Entra ID)로 인증을 관리하는 조직
- Azure Cost Management로 AI 비용도 함께 관리하고 싶은 분
- Microsoft의 RBAC(역할 기반 접근 제어) 체계를 활용하고 싶은 분

---

## 시작하기 전에 필요한 것

| 항목 | 설명 |
|------|------|
| Azure 구독 | Microsoft Foundry 리소스 생성 권한 포함 |
| RBAC 권한 | Foundry 리소스 및 배포 생성 가능한 역할 |
| Azure CLI | 선택 사항 — 자격증명 설정 시 편리 |

> **팁**: 여러 사람에게 배포할 때는 반드시 모델 버전을 고정하세요. Azure 배포 생성 시 "자동 업데이트" 대신 특정 모델 버전을 선택하세요.

---

## 설정 단계

### 1단계: Microsoft Foundry 리소스 생성

1. [Microsoft Foundry 포털](https://ai.azure.com/)에 접속합니다.
2. 새 리소스를 생성하고 **리소스 이름**을 메모합니다.
3. 아래 Claude 모델에 대한 배포(deployment)를 각각 생성합니다:
   - Claude Opus
   - Claude Sonnet
   - Claude Haiku

### 2단계: Azure 자격증명 설정

두 가지 인증 방식을 지원합니다. 조직의 보안 요구사항에 맞는 방법을 선택하세요.

**방법 A: API 키 인증** (간단한 방법)

1. Foundry 포털에서 리소스를 선택합니다.
2. **Endpoints and keys** 섹션으로 이동합니다.
3. **API Key**를 복사합니다.
4. 환경변수를 설정합니다:

```bash
export ANTHROPIC_FOUNDRY_API_KEY=your-azure-api-key
```

**방법 B: Microsoft Entra ID 인증** (보안 강화 방법)

`ANTHROPIC_FOUNDRY_API_KEY`를 설정하지 않으면 Claude Code가 자동으로 Azure SDK의 기본 자격증명 체계를 사용합니다. 로컬 환경에서는 Azure CLI 로그인을 사용하는 것이 일반적입니다:

```bash
az login
```

> Foundry 사용 시 `/login` 및 `/logout` 명령은 비활성화됩니다. 인증은 Azure 자격증명으로 처리됩니다.

### 3단계: Claude Code 환경변수 설정

```bash
# Microsoft Foundry 연동 활성화
export CLAUDE_CODE_USE_FOUNDRY=1

# Azure 리소스 이름 설정 (방법 1: 리소스 이름만)
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource-name

# 또는 전체 URL로 설정 (방법 2)
# export ANTHROPIC_FOUNDRY_BASE_URL=https://your-resource.services.ai.azure.com/anthropic
```

### 4단계: 모델 버전 고정 (중요!)

> **경고**: 모델 별칭만 사용하면 Foundry 계정에서 아직 사용 불가한 새 버전을 요청해 오류가 발생할 수 있습니다. 1단계에서 생성한 배포 이름과 일치하도록 설정하세요.

```bash
export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-6'
export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-6'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5'
```

---

## Azure RBAC 권한 설정

`Azure AI User` 또는 `Cognitive Services User` 기본 역할에는 Claude 모델 호출에 필요한 모든 권한이 포함되어 있습니다.

더 제한적인 권한이 필요하다면 아래와 같이 커스텀 역할을 생성하세요:

```json
{
  "permissions": [
    {
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/providers/*"
      ]
    }
  ]
}
```

자세한 내용은 [Microsoft Foundry RBAC 문서](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry)를 참고하세요.

---

## 문제 해결

| 오류 메시지 | 해결 방법 |
|-------------|-----------|
| "Failed to get token from azureADTokenProvider: ChainedTokenCredential authentication failed" | `az login`으로 Entra ID를 구성하거나 `ANTHROPIC_FOUNDRY_API_KEY`를 설정하세요 |
| 모델 찾을 수 없음 | 1단계에서 생성한 배포 이름과 환경변수 값이 일치하는지 확인하세요 |

---

## API 키 vs Entra ID 인증 비교

| 항목 | API 키 | Entra ID |
|------|--------|----------|
| 설정 난이도 | 간단 | 복잡 |
| 보안 수준 | 중간 (키 분실 위험) | 높음 |
| 키 관리 | 수동 갱신 필요 | 자동 관리 |
| 적합한 환경 | 개인 개발, 소규모 팀 | 기업, 규정 준수 필요 환경 |

---

## 예시 케이스

**상황**: 대기업 IT 부서가 전사 개발자 50명에게 Claude Code를 도입하려 합니다. 회사는 이미 Azure AD(Entra ID)로 모든 시스템 인증을 관리하고 있으며, AI 사용 비용도 Azure Cost Management로 통합 관리해야 합니다. 개별 API 키 발급 없이 기존 Azure 계정으로 바로 사용할 수 있어야 합니다.

**해결책**:
1. Foundry 포털에서 팀 공용 리소스를 생성하고 Claude Sonnet, Haiku 배포를 추가합니다.
2. 개발자들의 Azure AD 그룹에 `Azure AI User` 역할을 할당합니다.
3. 전사 배포 스크립트에 아래 환경변수를 포함합니다:
   ```bash
   export CLAUDE_CODE_USE_FOUNDRY=1
   export ANTHROPIC_FOUNDRY_RESOURCE=company-claude-resource
   export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-6'
   export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5'
   # API 키 없음 — Entra ID로 자동 인증
   ```
4. 개발자들은 이미 `az login`이 되어 있으므로 추가 인증 없이 바로 사용합니다.

결과: API 키 관리 없이 Azure AD 계정만으로 50명이 Claude Code를 사용하고, 비용은 Azure Cost Management 대시보드에서 리소스 그룹별로 추적됩니다.

---

## 추가 자료

- [Microsoft Foundry 공식 문서](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry)
- [Foundry 모델 탐색](https://ai.azure.com/explore/models)
- [Microsoft Foundry 요금 안내](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/)
