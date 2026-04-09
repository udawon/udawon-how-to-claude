---
title: "인증 가이드: Claude Code에 로그인하고 팀 설정하기"
source: "https://code.claude.com/docs/en/authentication"
order: 12
tags: ["설정", "인증", "Authentication"]
---

# 인증 가이드: Claude Code에 로그인하고 팀 설정하기

Claude Code를 사용하려면 먼저 로그인이 필요합니다. 개인 사용자부터 대기업까지, 다양한 방식으로 인증할 수 있습니다. 마치 건물에 들어갈 때 개인 카드키, 회사 출입증, 방문증 등 다양한 방식이 있는 것처럼요.

---

## 처음 로그인하기

Claude Code를 설치하고 터미널에서 `claude`를 실행하면, 자동으로 브라우저가 열려 로그인 창이 나타납니다.

브라우저가 자동으로 열리지 않으면 `c`를 눌러 로그인 URL을 복사하고, 브라우저에 직접 붙여넣기 하세요.

**로그아웃:** `/logout` 명령어를 입력하면 됩니다.

---

## 나에게 맞는 계정 유형은?

| 계정 유형 | 특징 | 적합한 대상 |
|----------|------|-----------|
| **Claude Pro/Max** | 개인 구독, 바로 사용 | 개인 개발자, 프리랜서 |
| **Claude for Teams** | 팀 관리, 중앙 결제 | 소규모~중규모 팀 |
| **Claude for Enterprise** | SSO, 역할별 권한, 규정 준수 | 대기업, 보안 중요 조직 |
| **Claude Console** | API 기반 결제 | API 활용 개발팀 |
| **Amazon Bedrock** | AWS 인프라 활용 | AWS를 이미 쓰는 팀 |
| **Google Vertex AI** | GCP 인프라 활용 | GCP를 이미 쓰는 팀 |
| **Microsoft Foundry** | Azure 인프라 활용 | Azure를 이미 쓰는 팀 |

---

## 팀 설정 방법

### Claude for Teams / Enterprise (추천)

대부분의 팀에게 가장 쉬운 방법입니다.

1. [Claude for Teams](https://claude.com/pricing) 구독 신청
2. 관리자 대시보드에서 팀원 초대
3. 팀원들이 각자 Claude Code 설치 후 claude.ai 계정으로 로그인

**Teams vs Enterprise 차이:**

| 기능 | Teams | Enterprise |
|------|-------|----------|
| 팀 관리 | 기본 | 고급 |
| SSO (단일 로그인) | 없음 | 있음 |
| 역할별 권한 | 없음 | 있음 |
| 관리 정책 설정 | 없음 | 있음 |
| 규정 준수 API | 없음 | 있음 |

### Claude Console 인증

API 기반 결제를 선호하는 팀을 위한 방법입니다.

1. Console 계정 생성 또는 기존 계정 사용
2. 설정 → 멤버 → 초대에서 사용자 추가 (또는 SSO 설정)
3. 역할 배정:
   - **Claude Code 역할**: Claude Code API 키만 생성 가능
   - **Developer 역할**: 모든 종류의 API 키 생성 가능
4. 초대된 팀원이 초대 수락 → Claude Code 설치 → Console 계정으로 로그인

### 클라우드 제공자 인증 (Bedrock, Vertex AI, Foundry)

환경 변수 설정만으로 로그인 없이 사용할 수 있습니다. 브라우저 로그인이 필요 없습니다.

각 제공자별 문서를 참고하여 필요한 환경 변수를 설정하고 `claude`를 실행합니다.

---

## 자격증명 관리 방법

| 항목 | 설명 |
|------|------|
| **저장 위치** | macOS: 암호화된 Keychain에 저장 |
| **지원 인증 유형** | Claude.ai, API 키, Azure Auth, Bedrock Auth, Vertex Auth |
| **자동 갱신** | 기본 5분마다 또는 인증 오류 시 자동 갱신 |

### 커스텀 API 키 스크립트

자동으로 API 키를 생성하는 스크립트를 설정할 수 있습니다. 보안 팀에서 임시 키를 자동 발급하는 시스템과 연동할 때 유용합니다.

`~/.claude/settings.json`에 추가:
```json
{
  "apiKeyHelper": "/bin/generate_temp_api_key.sh"
}
```

갱신 주기 조정:
```json
{
  "env": {
    "CLAUDE_CODE_API_KEY_HELPER_TTL_MS": "1800000"
  }
}
```
(30분마다 갱신)

---

## 예시 케이스

**상황 1: 처음 Claude Code를 쓰는 개인 개발자**

> 프리랜서 박프리 씨는 Claude Pro를 구독하고 있습니다. 터미널에서 `claude`를 실행하자 브라우저가 열렸고, Claude.ai 계정으로 로그인했습니다. 30초 만에 준비 완료! 이후에는 별도 로그인 없이 바로 사용 가능합니다.

**상황 2: 10명짜리 스타트업 팀**

> 스타트업 CTO 최CTO 씨는 Claude for Teams를 신청했습니다. 관리자 대시보드에서 팀원 10명의 이메일을 입력해 초대장을 보냈습니다. 팀원들은 이메일 링크를 클릭하고 Claude Code를 설치한 후, 자신의 계정으로 로그인했습니다. 결제는 회사 카드 하나로 중앙 관리됩니다.

**상황 3: AWS를 사용하는 엔터프라이즈 팀**

> 대기업 IT팀장 이팀장 씨의 회사는 모든 인프라를 AWS에서 운영합니다. Amazon Bedrock을 통해 Claude Code를 사용합니다. 브라우저 로그인 없이 AWS 자격증명 환경 변수만 설정하면 됩니다. IT 팀에서 환경 변수 설정을 자동화 스크립트로 배포해서 모든 개발자 PC에 한 번에 적용했습니다.

**상황 4: 보안이 중요한 금융 회사**

> 금융 회사 보안팀 박보안 씨의 회사는 API 키가 만료되지 않고 장기간 유효한 것이 보안 위험이라고 판단했습니다. `apiKeyHelper` 스크립트를 통해 1시간마다 임시 API 키를 자동으로 발급받는 시스템을 구축했습니다. Claude Code는 이 스크립트를 자동으로 호출해 항상 유효한 키를 사용합니다.
