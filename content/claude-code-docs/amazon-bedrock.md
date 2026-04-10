---
title: "Amazon Bedrock로 Claude Code 사용하기"
source: "https://code.claude.com/docs/en/amazon-bedrock"
order: 43
tags: ["엔터프라이즈", "AWS", "기업·개발자", "Amazon Bedrock"]
---

# Amazon Bedrock로 Claude Code 사용하기

Amazon Bedrock는 AWS(아마존 웹 서비스)가 제공하는 AI 모델 호스팅 서비스입니다. 쉽게 말해, Claude라는 AI를 AWS 인프라 위에서 직접 운영할 수 있게 해주는 "다리" 역할을 합니다. 이미 AWS를 사용하는 회사라면 기존 보안 정책, 비용 관리, 데이터 처리 방식을 그대로 유지하면서 Claude Code를 쓸 수 있습니다.

---

## 이런 분에게 필요합니다

- 회사에서 이미 AWS를 쓰고 있는 분
- 데이터를 AWS 안에서만 처리해야 하는 보안 정책이 있는 분
- AWS 비용 관리 도구로 AI 사용료도 함께 관리하고 싶은 분

---

## 시작하기 전에 필요한 것

| 항목 | 설명 |
|------|------|
| AWS 계정 | Bedrock 사용 권한이 활성화된 계정 |
| Claude 모델 접근권 | AWS Bedrock에서 Claude 모델 사용 승인 |
| AWS CLI | 선택 사항 — 자격증명 설정 시 편리 |
| IAM 권한 | 아래 IAM 정책 참고 |

> **팁**: 여러 사람에게 배포할 때는 반드시 모델 버전을 고정하세요. 그렇지 않으면 Anthropic이 새 모델을 출시할 때 기존 사용자가 오류를 겪을 수 있습니다.

---

## 설정 단계

### 1단계: 사용 사례 제출

처음 Anthropic 모델을 사용하는 경우, AWS에 사용 목적을 한 번 등록해야 합니다.

1. [Amazon Bedrock 콘솔](https://console.aws.amazon.com/bedrock/)에 접속합니다.
2. **Chat/Text playground** 를 선택합니다.
3. Anthropic 모델을 선택하면 사용 사례 양식이 나타납니다. 작성 후 제출합니다.

### 2단계: AWS 자격증명 설정

Claude Code는 AWS SDK의 표준 자격증명 방식을 따릅니다. 아래 중 편한 방법을 선택하세요.

**방법 A: AWS CLI 설정**
```bash
aws configure
```

**방법 B: 환경변수 (액세스 키)**
```bash
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token
```

**방법 C: SSO 프로필**
```bash
aws sso login --profile=<프로필명>
export AWS_PROFILE=your-profile-name
```

**방법 D: Bedrock API 키** (가장 간단한 방법)
```bash
export AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key
```

#### 자격증명 자동 갱신 설정

회사 SSO나 외부 인증 시스템을 쓰는 경우, 자격증명이 만료되면 Claude Code가 자동으로 갱신 명령을 실행하게 설정할 수 있습니다.

`settings.json` 파일에 아래 내용을 추가합니다:
```json
{
  "awsAuthRefresh": "aws sso login --profile myprofile",
  "env": {
    "AWS_PROFILE": "myprofile"
  }
}
```

- **`awsAuthRefresh`**: `.aws` 디렉토리를 수정하는 명령어(예: SSO 갱신). 실행 결과가 사용자에게 표시됩니다.
- **`awsCredentialExport`**: `.aws`를 수정할 수 없을 때만 사용. 아래 형식의 JSON을 출력해야 합니다:
```json
{
  "Credentials": {
    "AccessKeyId": "value",
    "SecretAccessKey": "value",
    "SessionToken": "value"
  }
}
```

### 3단계: Claude Code 환경변수 설정

```bash
# Bedrock 연동 활성화
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1  # 사용할 리전

# 선택 사항: 소형 모델(Haiku)에 다른 리전 사용
export ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION=us-west-2
```

> `AWS_REGION`은 필수 환경변수입니다. `.aws` 설정 파일에서는 읽지 않습니다.

### 4단계: 모델 버전 고정 (중요!)

> **경고**: 모델 별칭(`sonnet`, `opus`, `haiku`)만 쓰면 Anthropic이 새 모델을 출시할 때 Bedrock에서 아직 사용 불가한 버전을 요청해 오류가 발생할 수 있습니다. 반드시 구체적인 버전을 지정하세요.

```bash
export ANTHROPIC_DEFAULT_OPUS_MODEL='us.anthropic.claude-opus-4-6-v1'
export ANTHROPIC_DEFAULT_SONNET_MODEL='us.anthropic.claude-sonnet-4-6'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='us.anthropic.claude-haiku-4-5-20251001-v1:0'
```

버전을 지정하지 않을 경우 기본 모델:

| 모델 유형 | 기본값 |
|-----------|--------|
| 기본 모델 | `global.anthropic.claude-sonnet-4-6` |
| 소형/빠른 모델 | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |

---

## IAM 권한 설정

Claude Code가 Bedrock를 호출하려면 아래 IAM 정책이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowModelAndInferenceProfileAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListInferenceProfiles"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:inference-profile/*",
        "arn:aws:bedrock:*:*:application-inference-profile/*",
        "arn:aws:bedrock:*:*:foundation-model/*"
      ]
    },
    {
      "Sid": "AllowMarketplaceSubscription",
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:ViewSubscriptions",
        "aws-marketplace:Subscribe"
      ],
      "Resource": "*"
    }
  ]
}
```

> 비용 추적과 접근 제어를 간소화하려면, Claude Code 전용 AWS 계정을 별도로 만드는 것을 권장합니다.

---

## AWS Guardrails (콘텐츠 필터링)

Amazon Bedrock Guardrails를 사용하면 Claude Code에 콘텐츠 필터링을 적용할 수 있습니다. 마치 사내 인터넷 필터링처럼, 특정 유형의 응답을 차단할 수 있습니다.

1. [Amazon Bedrock 콘솔](https://console.aws.amazon.com/bedrock/)에서 Guardrail을 생성합니다.
2. 버전을 발행합니다.
3. `settings.json`에 아래 헤더를 추가합니다:

```json
{
  "env": {
    "ANTHROPIC_CUSTOM_HEADERS": "X-Amzn-Bedrock-GuardrailIdentifier: your-guardrail-id\nX-Amzn-Bedrock-GuardrailVersion: 1"
  }
}
```

---

## 문제 해결

| 오류 상황 | 해결 방법 |
|-----------|-----------|
| 리전 관련 오류 | `aws bedrock list-inference-profiles --region your-region` 으로 가용 모델 확인 |
| "on-demand throughput isn't supported" 오류 | 모델을 추론 프로필(inference profile) ID로 지정 |
| 연결 불가 | `AWS_REGION=us-east-1` 등 지원 리전으로 변경 |

> Claude Code는 Bedrock **Invoke API**를 사용하며, Converse API는 지원하지 않습니다.

---

## 예시 케이스

**상황**: 금융 회사의 개발팀이 사내 보안 정책상 모든 AI 트래픽을 AWS 내부에서만 처리해야 합니다. 개발자 20명이 Claude Code를 사용하되, 데이터가 외부로 나가지 않아야 합니다.

**해결책**:
1. AWS 계정에 Bedrock 전용 IAM 정책을 생성합니다.
2. 모든 개발자의 `.bashrc`에 `CLAUDE_CODE_USE_BEDROCK=1`, `AWS_REGION=ap-northeast-2`, 모델 버전 고정 환경변수를 추가합니다.
3. 회사 SSO를 사용하므로 `awsAuthRefresh`에 `aws sso login` 명령을 등록합니다.
4. AWS Cost Explorer로 팀별 AI 사용 비용을 추적합니다.

결과: 모든 AI 대화가 AWS 내부에서만 처리되고, 기존 AWS 보안 및 비용 관리 체계 안에서 운영됩니다.

---

## 추가 자료

- [Bedrock 공식 문서](https://docs.aws.amazon.com/bedrock/)
- [Bedrock 요금 안내](https://aws.amazon.com/bedrock/pricing/)
- [Bedrock 추론 프로필 목록](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html)
