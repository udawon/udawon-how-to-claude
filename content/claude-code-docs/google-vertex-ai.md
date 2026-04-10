---
title: "Google Vertex AI로 Claude Code 사용하기"
source: "https://code.claude.com/docs/en/google-vertex-ai"
order: 44
tags: ["엔터프라이즈", "GCP", "기업·개발자", "Google Vertex AI"]
---

# Google Vertex AI로 Claude Code 사용하기

Google Vertex AI는 구글 클라우드(GCP)가 제공하는 AI 모델 호스팅 플랫폼입니다. 이미 구글 클라우드를 사용하는 조직이라면 기존 GCP 인프라, IAM 권한, 비용 관리 체계를 그대로 유지하면서 Claude Code를 사용할 수 있습니다. 마치 구글 클라우드라는 건물 안에 Claude라는 사무실을 차리는 것과 같습니다.

---

## 이런 분에게 필요합니다

- 회사에서 Google Cloud Platform(GCP)을 주로 사용하는 분
- GCP의 IAM, 감사 로그, 비용 관리를 활용하고 싶은 분
- 데이터가 GCP 인프라 안에서 처리되어야 하는 보안 요건이 있는 분

---

## 시작하기 전에 필요한 것

| 항목 | 설명 |
|------|------|
| GCP 계정 | 결제가 활성화된 Google Cloud 계정 |
| GCP 프로젝트 | Vertex AI API가 활성화된 프로젝트 |
| Claude 모델 접근권 | Vertex AI Model Garden에서 승인 필요 |
| Google Cloud SDK | `gcloud` CLI 설치 및 구성 |
| 할당량 | 사용할 GCP 리전에 충분한 할당량 |

> **팁**: 여러 사람에게 배포할 때는 반드시 모델 버전을 고정하세요. 그렇지 않으면 Anthropic이 새 모델을 출시할 때 기존 사용자가 오류를 겪을 수 있습니다.

---

## 리전 구성 안내

Claude Code는 Vertex AI의 **글로벌 엔드포인트**와 **리전별 엔드포인트** 모두 사용할 수 있습니다.

> **주의**: 모든 리전이나 글로벌 엔드포인트에서 모든 Claude 모델을 지원하는 것은 아닙니다. 지원 여부를 [Vertex AI 위치 문서](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations#genai-partner-models)에서 확인하세요.

---

## 설정 단계

### 1단계: Vertex AI API 활성화

```bash
# 프로젝트 ID 설정
gcloud config set project YOUR-PROJECT-ID

# Vertex AI API 활성화
gcloud services enable aiplatform.googleapis.com
```

### 2단계: Claude 모델 접근 신청

1. [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)에 접속합니다.
2. "Claude"를 검색합니다.
3. 원하는 Claude 모델(예: Claude Sonnet 4.6)에 대한 접근을 신청합니다.
4. 승인을 기다립니다 (최대 24~48시간 소요).

### 3단계: GCP 자격증명 설정

Claude Code는 표준 Google Cloud 인증 방식을 사용합니다.

```bash
# 로컬 개발 시 가장 일반적인 방법
gcloud auth application-default login
```

> **참고**: 인증 시 Claude Code는 자동으로 `ANTHROPIC_VERTEX_PROJECT_ID` 환경변수의 프로젝트 ID를 사용합니다. 재정의하려면 `GCLOUD_PROJECT`, `GOOGLE_CLOUD_PROJECT`, 또는 `GOOGLE_APPLICATION_CREDENTIALS`를 설정하세요.

### 4단계: Claude Code 환경변수 설정

```bash
# Vertex AI 연동 활성화
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=global
export ANTHROPIC_VERTEX_PROJECT_ID=YOUR-PROJECT-ID

# 선택 사항: 프롬프트 캐싱 비활성화
export DISABLE_PROMPT_CACHING=1

# 글로벌 엔드포인트 사용 시, 미지원 모델에 대한 리전 지정
export VERTEX_REGION_CLAUDE_3_5_HAIKU=us-east5

# 선택 사항: 특정 모델별 리전 재정의
export VERTEX_REGION_CLAUDE_3_5_SONNET=us-east5
export VERTEX_REGION_CLAUDE_3_7_SONNET=us-east5
export VERTEX_REGION_CLAUDE_4_0_OPUS=europe-west1
export VERTEX_REGION_CLAUDE_4_0_SONNET=us-east5
export VERTEX_REGION_CLAUDE_4_1_OPUS=europe-west1
```

> Vertex AI 사용 시 `/login` 및 `/logout` 명령은 비활성화됩니다. 인증은 Google Cloud 자격증명으로 처리됩니다.

### 5단계: 모델 버전 고정 (중요!)

> **경고**: 모델 별칭만 사용하면 Vertex AI 프로젝트에서 아직 활성화되지 않은 새 버전을 요청해 오류가 발생할 수 있습니다.

```bash
export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-6'
export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-6'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5@20251001'
```

버전을 지정하지 않을 경우 기본 모델:

| 모델 유형 | 기본값 |
|-----------|--------|
| 기본 모델 | `claude-sonnet-4-6` |
| 소형/빠른 모델 | `claude-haiku-4-5@20251001` |

---

## IAM 권한 설정

`roles/aiplatform.user` 역할에는 필요한 권한이 포함되어 있습니다:

- `aiplatform.endpoints.predict` — 모델 호출 및 토큰 계산에 필요

더 제한적인 권한이 필요하다면 위 권한만 포함한 커스텀 역할을 생성하세요.

> 비용 추적과 접근 제어를 간소화하려면, Claude Code 전용 GCP 프로젝트를 별도로 만드는 것을 권장합니다.

---

## 100만 토큰 컨텍스트 윈도우

Claude Sonnet 4 및 Sonnet 4.6은 Vertex AI에서 **100만 토큰 컨텍스트 윈도우**를 지원합니다.

> 현재 베타 기능입니다. 확장된 컨텍스트 윈도우를 사용하려면 `context-1m-2025-08-07` 베타 헤더를 요청에 포함하세요.

---

## 문제 해결

| 오류 상황 | 해결 방법 |
|-----------|-----------|
| 할당량 초과 오류 | [Cloud Console](https://cloud.google.com/docs/quotas/view-manage)에서 할당량 확인 또는 증가 신청 |
| 404 "model not found" 오류 | Model Garden에서 모델 활성화 여부 확인, 리전 접근 권한 확인 |
| 429 오류 | 리전별 엔드포인트에서 기본/소형 모델 지원 여부 확인, `CLOUD_ML_REGION=global`로 전환 고려 |
| 글로벌 엔드포인트 불가 모델 | `ANTHROPIC_MODEL` 또는 `VERTEX_REGION_<모델명>` 환경변수로 리전 엔드포인트 지정 |

---

## 예시 케이스

**상황**: 스타트업 개발팀이 이미 GCP를 사용 중이며, 추가 클라우드 계정 없이 Claude Code를 팀 전체에 도입하고 싶습니다. 팀원 10명의 GCP IAM 계정을 활용해 인증을 처리하고, GCP Billing으로 AI 비용을 기존 클라우드 비용과 통합 관리하려 합니다.

**해결책**:
1. GCP 프로젝트를 Claude Code 전용으로 생성합니다.
2. 팀원들에게 `roles/aiplatform.user` 역할을 부여합니다.
3. 팀원들의 개발 환경에 아래 환경변수를 배포합니다:
   ```bash
   export CLAUDE_CODE_USE_VERTEX=1
   export CLOUD_ML_REGION=global
   export ANTHROPIC_VERTEX_PROJECT_ID=my-claude-project
   export ANTHROPIC_DEFAULT_SONNET_MODEL='claude-sonnet-4-6'
   export ANTHROPIC_DEFAULT_HAIKU_MODEL='claude-haiku-4-5@20251001'
   ```
4. 각 팀원은 `gcloud auth application-default login`으로 인증합니다.

결과: 기존 GCP 인프라 안에서 Claude Code를 운영하고, GCP Billing 대시보드에서 AI 비용을 통합 관리할 수 있습니다.

---

## 추가 자료

- [Vertex AI 공식 문서](https://cloud.google.com/vertex-ai/docs)
- [Vertex AI 요금 안내](https://cloud.google.com/vertex-ai/pricing)
- [Vertex AI 할당량 및 한도](https://cloud.google.com/vertex-ai/docs/quotas)
