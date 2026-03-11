---
title: "법적 준수 - Claude Code 사용 시 알아야 할 법률과 정책"
source: "https://code.claude.com/docs/en/legal-and-compliance"
order: 57
tags: ["보안", "법적", "기업·개발자"]
---

# 법적 준수: Claude Code 사용 시 알아야 할 법률과 정책

Claude Code를 업무나 프로젝트에 활용할 때 적용되는 약관, 규정 준수 사항, 사용 정책을 정리했습니다.

---

## 이용 약관

### 어떤 약관이 적용되나요?

사용하는 계정 유형에 따라 다른 약관이 적용됩니다.

| 계정 유형 | 적용 약관 |
|---|---|
| Team, Enterprise, API | [상업용 서비스 약관](https://www.anthropic.com/legal/commercial-terms) |
| Free, Pro, Max | [소비자 서비스 약관](https://www.anthropic.com/legal/consumer-terms) |

### 기업 계약 (API 연동 시)

Anthropic API를 직접 사용하거나 AWS Bedrock, Google Vertex를 통해 사용하는 경우, 기존에 체결한 상업 계약이 Claude Code 사용에도 그대로 적용됩니다. 별도로 합의한 경우는 예외입니다.

---

## 의료 규정 준수 (HIPAA)

### BAA(사업자 협약)란?

BAA(Business Associate Agreement)는 의료 정보를 다루는 기업이 서비스 제공자와 맺는 개인정보 보호 계약입니다. 미국 의료 개인정보법 HIPAA 준수를 위해 필요합니다.

### Claude Code와 BAA

이미 Anthropic과 BAA를 체결한 고객이 Claude Code를 사용하려면:

1. BAA가 체결되어 있어야 하고
2. 해당 조직에 **ZDR(제로 데이터 보존)**이 활성화되어 있어야 합니다.

두 조건을 모두 충족하면 BAA가 Claude Code API 트래픽에 자동 적용됩니다.

> ZDR은 조직 단위로 설정됩니다. 새 조직을 만들 경우 별도로 ZDR을 활성화해야 BAA가 적용됩니다.

---

## 사용 정책

### 허용되는 사용

Claude Code 사용은 [Anthropic 사용 정책](https://www.anthropic.com/legal/aup)을 따릅니다. Pro 및 Max 플랜의 사용량 한도는 **개인의 일반적인 사용**을 기준으로 합니다.

### 인증 방식과 허용 범위

| 인증 방식 | 허용 용도 |
|---|---|
| OAuth (Free, Pro, Max) | Claude Code와 Claude.ai 전용 |
| API 키 | 개발자 제품, Agent SDK, 서비스 구축 |

**중요한 제한사항**: Pro, Max 계정의 OAuth 토큰을 다른 제품이나 서비스에 재사용하거나, 자신의 앱 사용자들에게 Claude.ai 로그인을 제공하는 것은 **소비자 약관 위반**입니다.

개발자가 Claude 기능을 자신의 서비스에 통합하려면 [Claude Console](https://platform.claude.com/)에서 API 키를 발급받아 사용해야 합니다.

Anthropic은 이 제한을 사전 통지 없이 집행할 수 있습니다.

---

## 보안 및 신뢰

### 신뢰 정보 확인

- [Anthropic Trust Center](https://trust.anthropic.com): SOC 2, ISO 27001 등 보안 인증 문서
- [Transparency Hub](https://www.anthropic.com/transparency): AI 안전 및 정책 투명성 정보

### 보안 취약점 신고

Claude Code에서 보안 취약점을 발견한 경우 HackerOne을 통해 신고할 수 있습니다.

[취약점 신고 양식 →](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability)

---

## 예시 케이스

### 상황 1: 병원 IT팀이 Claude Code를 도입할 때
병원이 환자 기록 시스템의 코드를 Claude Code로 개선하려 한다면, 먼저 Anthropic과 BAA를 체결하고, ZDR을 활성화해야 합니다. 이 두 가지가 갖춰지면 HIPAA 요건에 부합하게 Claude Code를 사용할 수 있습니다.

### 상황 2: SaaS 스타트업이 자체 제품에 Claude를 탑재할 때
"우리 서비스 사용자가 Claude.ai 계정으로 로그인해 Claude 기능을 쓰게 하자"는 아이디어는 약관 위반입니다. 이 경우 API 키를 발급받아 직접 통합해야 합니다.

### 상황 3: 금융사가 AWS Bedrock으로 Claude를 사용할 때
기존 Bedrock 계약이 있다면 Claude Code 사용에도 그 계약이 적용됩니다. 데이터 보존, 보안, 규정 준수는 Anthropic 정책보다 AWS Bedrock 정책이 우선합니다.
