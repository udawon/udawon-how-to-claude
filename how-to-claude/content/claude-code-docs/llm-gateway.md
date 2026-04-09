---
title: "LLM 게이트웨이 설정 가이드"
source: "https://code.claude.com/docs/en/llm-gateway"
order: 47
tags: ["엔터프라이즈", "게이트웨이", "기업·개발자", "LLM gateway"]
---

# LLM 게이트웨이 설정 가이드

LLM 게이트웨이는 Claude Code와 AI 모델 제공업체 사이에 놓이는 "중간 관리자" 역할을 합니다. 쉽게 비유하면, 회사의 모든 인터넷 트래픽이 IT 부서의 방화벽을 거쳐 나가는 것처럼, AI 요청도 중앙 게이트웨이를 거쳐 나가게 만드는 장치입니다.

---

## LLM 게이트웨이가 필요한 이유

| 기능 | 설명 |
|------|------|
| **중앙 집중식 인증** | API 키를 한 곳에서 관리 — 팀원 개인이 키를 갖지 않아도 됩니다 |
| **사용량 추적** | 팀별, 프로젝트별 AI 사용량을 한 곳에서 확인합니다 |
| **비용 제어** | 예산 한도와 속도 제한을 설정합니다 |
| **감사 로깅** | 규정 준수를 위해 모든 AI 대화를 기록합니다 |
| **모델 라우팅** | 코드 변경 없이 제공업체를 교체할 수 있습니다 |

---

## 게이트웨이가 반드시 지원해야 하는 기능

Claude Code와 함께 작동하려면 게이트웨이가 아래 API 형식 중 하나 이상을 지원해야 합니다:

### 지원 API 형식

**1. Anthropic Messages 형식** (직접 연결)
- 엔드포인트: `/v1/messages`, `/v1/messages/count_tokens`
- 필수 조건: `anthropic-beta`, `anthropic-version` 요청 헤더를 그대로 전달해야 합니다.

**2. Bedrock InvokeModel 형식**
- 엔드포인트: `/invoke`, `/invoke-with-response-stream`
- 필수 조건: 요청 본문의 `anthropic_beta`, `anthropic_version` 필드를 보존해야 합니다.

**3. Vertex rawPredict 형식**
- 엔드포인트: `:rawPredict`, `:streamRawPredict`, `/count-tokens:rawPredict`
- 필수 조건: `anthropic-beta`, `anthropic-version` 요청 헤더를 그대로 전달해야 합니다.

> 헤더나 본문 필드를 전달하지 않으면 Claude Code 기능이 제한되거나 작동하지 않을 수 있습니다.

> **참고**: Anthropic Messages 형식을 Bedrock/Vertex와 함께 사용할 경우, `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` 환경변수 설정이 필요할 수 있습니다.

---

## LiteLLM 설정 가이드

LiteLLM은 가장 널리 사용되는 오픈소스 LLM 프록시 서버입니다. 아래 가이드는 LiteLLM을 Claude Code와 연결하는 방법을 설명합니다.

> **주의**: LiteLLM은 Anthropic과 무관한 서드파티 서비스입니다. Anthropic은 LiteLLM의 보안이나 기능을 보증하지 않습니다.

### 사전 준비

- 최신 버전의 Claude Code
- 배포되어 접근 가능한 LiteLLM 프록시 서버
- 선택한 제공업체를 통한 Claude 모델 접근권

### 인증 방법

#### 방법 1: 고정 API 키 (가장 간단한 방법)

```bash
# 환경변수로 설정
export ANTHROPIC_AUTH_TOKEN=sk-litellm-static-key

# 또는 Claude Code 설정 파일에
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-litellm-static-key"
  }
}
```

이 값은 `Authorization` 헤더로 전송됩니다.

#### 방법 2: 동적 API 키 (키 갱신이 필요한 경우)

사용자별 인증이나 자동 갱신 키가 필요할 때 사용합니다.

**1. API 키 헬퍼 스크립트 생성:**

```bash
#!/bin/bash
# ~/bin/get-litellm-key.sh

# 예시 1: 볼트에서 키 가져오기
vault kv get -field=api_key secret/litellm/claude-code

# 예시 2: JWT 토큰 생성
jwt encode \
  --secret="${JWT_SECRET}" \
  --exp="+1h" \
  '{"user":"'${USER}'","team":"engineering"}'
```

**2. Claude Code 설정에 헬퍼 등록:**

```json
{
  "apiKeyHelper": "~/bin/get-litellm-key.sh"
}
```

**3. 토큰 갱신 주기 설정:**

```bash
# 1시간마다 갱신 (3600000 밀리초)
export CLAUDE_CODE_API_KEY_HELPER_TTL_MS=3600000
```

이 값은 `Authorization` 및 `X-Api-Key` 헤더로 전송됩니다.

---

### 엔드포인트 설정 방법

#### 통합 엔드포인트 (권장)

LiteLLM의 [Anthropic 형식 엔드포인트](https://docs.litellm.ai/docs/anthropic_unified)를 사용합니다:

```bash
export ANTHROPIC_BASE_URL=https://litellm-server:4000
```

**통합 엔드포인트의 장점:**
- 로드 밸런싱
- 장애 조치(Fallback)
- 비용 추적 및 사용자 추적 일관성 지원

#### 제공업체별 패스스루 엔드포인트 (대안)

**Claude API를 LiteLLM 통해 연결:**
```bash
export ANTHROPIC_BASE_URL=https://litellm-server:4000/anthropic
```

**Amazon Bedrock를 LiteLLM 통해 연결:**
```bash
export ANTHROPIC_BEDROCK_BASE_URL=https://litellm-server:4000/bedrock
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1
export CLAUDE_CODE_USE_BEDROCK=1
```

**Google Vertex AI를 LiteLLM 통해 연결:**
```bash
export ANTHROPIC_VERTEX_BASE_URL=https://litellm-server:4000/vertex_ai/v1
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
```

---

## 환경변수 요약

| 환경변수 | 설명 |
|----------|------|
| `ANTHROPIC_BASE_URL` | Anthropic API 형식 게이트웨이 URL |
| `ANTHROPIC_BEDROCK_BASE_URL` | Bedrock 형식 게이트웨이 URL |
| `ANTHROPIC_VERTEX_BASE_URL` | Vertex 형식 게이트웨이 URL |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | 게이트웨이가 AWS 인증을 처리할 때 설정 |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | 게이트웨이가 GCP 인증을 처리할 때 설정 |
| `CLAUDE_CODE_SKIP_FOUNDRY_AUTH` | 게이트웨이가 Azure 인증을 처리할 때 설정 |
| `ANTHROPIC_AUTH_TOKEN` | 게이트웨이 인증용 고정 API 키 |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | 동적 키 갱신 주기 (밀리초) |

---

## 예시 케이스

**상황**: 테크 회사의 플랫폼팀이 30개 개발팀 모두의 Claude Code 사용을 중앙에서 관리해야 합니다. 팀별 월 예산을 설정하고, AI 사용 내역을 감사 로그로 남겨야 하며, API 키는 개발자에게 직접 노출되지 않아야 합니다.

**해결책**:
1. LiteLLM 프록시 서버를 사내 인프라에 배포합니다.
2. LiteLLM에서 팀별 가상 키를 발급하고 예산 한도를 설정합니다.
3. 각 팀의 개발 환경에 아래를 배포합니다:
   ```bash
   export ANTHROPIC_BASE_URL=https://internal-litellm.company.com
   # 팀별 키는 시크릿 관리자에서 주입
   export ANTHROPIC_AUTH_TOKEN=sk-team-frontend-xxxx
   ```
4. LiteLLM 대시보드에서 팀별 사용량과 비용을 모니터링합니다.

결과: 개발자들은 실제 Anthropic API 키를 알 필요 없고, 플랫폼팀은 팀별 AI 사용량과 비용을 중앙에서 관리합니다.

---

## 추가 자료

- [LiteLLM 공식 문서](https://docs.litellm.ai/)
- [Claude Code 설정 가이드](/en/settings)
- [기업 네트워크 구성 가이드](/en/network-config)
- [서드파티 통합 개요](/en/third-party-integrations)
