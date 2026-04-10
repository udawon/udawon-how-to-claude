---
title: "채널 레퍼런스 — 나만의 채널 서버 만들기"
source: "https://code.claude.com/docs/en/channels-reference"
order: 63
tags: ["커스터마이징", "연동", "기업·개발자", "Channels reference", "claude-docs"]
---

## 이게 뭔가요?

채널 레퍼런스는 **나만의 커스텀 채널 서버를 직접 만드는 방법을 설명하는 개발자용 가이드**입니다.

아파트 현관에 있는 **택배 수거함**을 떠올려보세요. 외부에서 택배 기사(외부 시스템)가 물건(메시지)을 수거함에 넣으면, 집 안에 있는 사람(Claude Code)이 꺼내서 처리합니다. 반대로 집 안에서 수거함에 물건을 넣으면 택배 기사가 가져갑니다. 채널 서버는 바로 이 **수거함 역할**을 합니다 — 외부 시스템과 Claude Code 사이에서 메시지를 주고받는 통로를 직접 설계하는 것입니다.

기본 제공되는 텔레그램/디스코드 채널이 아니라, **내가 원하는 서비스**(Slack 웹훅, 사내 메신저, 모니터링 시스템 등)와 Claude Code를 연결하고 싶을 때 이 레퍼런스를 참고합니다.

핵심 개념:
- **Capability 선언(능력 선언)** — 채널 서버가 어떤 기능(알림 수신, 메시지 전송 등)을 지원하는지 선언
- **Notification(알림)** — 외부에서 Claude Code로 들어오는 메시지
- **Reply Tool(답장 도구)** — Claude Code가 외부로 답장을 보내는 기능
- **Sender Gating(발신자 제한)** — 누가 메시지를 보낼 수 있는지 제어

## 왜 알아야 하나요?

**알면 좋은 점:**
- 텔레그램/디스코드 외에 **어떤 서비스든** Claude Code와 연결할 수 있음
- 사내 시스템(모니터링 도구, 빌드 서버 등)의 알림을 Claude가 자동으로 받아 처리하게 만들 수 있음
- 양방향이 필요 없는 경우 **단방향 채널**(알림만 받기)로 간단하게 구성 가능

**모르면 불편한 점:**
- 기본 제공 플러그인(텔레그램/디스코드)만 사용 가능하고, 다른 서비스 연결은 불가능
- 웹훅(외부에서 자동으로 보내는 HTTP 요청) 알림을 Claude에게 자동 전달하는 자동화를 만들 수 없음

## 어떻게 하나요?

### 방법 1: 단방향 채널 — 알림만 받기 (Webhook Alerts)

외부 시스템이 Claude Code에 **알림만 보내는** 가장 간단한 형태입니다. Claude는 답장을 보내지 않습니다.

**단계별 설명:**

1. MCP(외부 도구 연결 기능) 서버로 채널 서버를 구현합니다
2. Capability에 `notifications`만 선언합니다
3. 외부 시스템에서 이벤트가 발생하면 MCP notification을 Claude Code로 전송합니다

```javascript
// 서버의 capability 선언 예시
{
  "capabilities": {
    "notifications": true,    // 알림 수신 가능
    "reply": false            // 답장 기능 없음
  }
}
```

**Notification 형식:**

외부에서 Claude Code로 보내는 알림은 아래 형식을 따릅니다:

```javascript
{
  "method": "notifications/message",
  "params": {
    "channel": "my-webhook-channel",
    "sender": {
      "id": "github-actions",       // 발신자 식별자
      "displayName": "GitHub CI"    // 화면에 표시될 이름
    },
    "content": "빌드 실패: main 브랜치 테스트 3개 에러",
    "metadata": {}                   // 추가 정보 (선택)
  }
}
```

<div class="example-case">
<strong>예시: GitHub Actions 빌드 실패 알림 자동 전달</strong>

DevOps 엔지니어 박서준씨는 GitHub Actions에서 빌드가 실패할 때마다 Claude Code가 자동으로 에러 로그를 분석하길 원합니다. 단방향 채널 서버를 만들어서, GitHub Webhook이 발생하면 MCP notification 형식으로 변환한 뒤 Claude Code에 전달합니다. Claude는 알림을 받으면 에러 로그를 읽고 원인을 분석하기 시작합니다.

</div>

### 방법 2: 양방향 채널 — 메시지 주고받기 (Chat Bridges)

외부 시스템과 Claude Code가 **메시지를 주고받는** 형태입니다. 사내 메신저나 커스텀 챗봇을 연결할 때 사용합니다.

**단계별 설명:**

1. Capability에 `notifications`와 `reply`를 모두 선언합니다
2. Reply Tool(답장 도구)을 MCP tool로 노출합니다
3. Sender Gating(발신자 제한)을 설정하여 인증된 사용자만 메시지를 보내도록 합니다

```javascript
// 양방향 채널 capability 선언
{
  "capabilities": {
    "notifications": true,    // 알림 수신 가능
    "reply": true             // 답장 가능
  }
}
```

**Reply Tool 노출:**

Claude Code가 외부로 답장을 보낼 수 있도록 MCP tool을 정의합니다:

```javascript
// Reply tool 정의 예시
{
  "name": "reply",
  "description": "채널을 통해 메시지를 보냅니다",
  "inputSchema": {
    "type": "object",
    "properties": {
      "channelId": { "type": "string" },
      "recipientId": { "type": "string" },
      "content": { "type": "string" }
    },
    "required": ["channelId", "content"]
  }
}
```

**Sender Gating (발신자 제한):**

누가 메시지를 보낼 수 있는지 제어하는 보안 장치입니다:

```javascript
// 발신자 제한 예시
{
  "gating": {
    "mode": "allowlist",              // 허용 목록 방식
    "allowedSenders": [
      "user-1234",                     // 특정 사용자 ID만 허용
      "admin-5678"
    ]
  }
}
```

<div class="example-case">
<strong>예시: 사내 Slack 채널과 Claude Code 연결</strong>

스타트업 CTO 김민아씨는 팀원들이 Slack에서 Claude에게 코드 리뷰를 요청하게 하고 싶습니다. 양방향 채널 서버를 만들어 Slack 봇의 메시지를 MCP notification으로 변환하고, Claude의 답장을 Slack 메시지로 다시 변환합니다. Sender Gating으로 팀원 Slack ID만 허용해두어, 외부인이 봇에게 메시지를 보내도 무시됩니다.

</div>

### 플러그인으로 패키징하기

만든 채널 서버를 **플러그인(확장 기능)**으로 패키징하면, 다른 사람들도 `/plugin install`로 간편하게 설치할 수 있습니다.

```
my-channel-plugin/
  ├── package.json          # 플러그인 메타데이터
  ├── manifest.json         # 채널 capability 선언
  └── src/
      └── server.ts         # MCP 서버 구현 코드
```

`manifest.json`에 채널 설정을 명시합니다:

```json
{
  "name": "my-slack-channel",
  "type": "channel",
  "capabilities": ["notifications", "reply"],
  "configure_command": "configure",
  "access_command": "access"
}
```

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 서버 모니터링 알림 → Claude 자동 분석</strong>

인프라 팀에서 Datadog(서버 모니터링 도구)의 알림을 Claude Code가 자동으로 받아 분석하도록 시스템을 구축했습니다. Datadog에서 "CPU 사용률 90% 초과" 알림이 발생하면, 단방향 채널 서버가 이 알림을 MCP notification으로 변환하여 Claude Code에 전달합니다. Claude는 알림을 받으면 서버 로그를 확인하고, 원인이 될 만한 프로세스를 분석한 뒤 결과를 터미널에 출력합니다.

</div>

## 주의할 점

- **개발자용 기능** — 이 레퍼런스는 MCP 서버 개발 경험이 있는 사람을 대상으로 합니다. MCP 기본 개념을 먼저 익히세요.
- **리서치 프리뷰 단계** — 채널 기능 자체가 아직 시험 운영 중입니다. API(프로그램끼리 대화하는 통로) 형식이나 capability 구조가 변경될 수 있습니다.
- **보안에 특히 주의** — 양방향 채널을 만들 때 Sender Gating을 반드시 설정하세요. 설정하지 않으면 누구나 Claude Code에 명령을 보낼 수 있어 위험합니다.
- **세션 유지 필수** — Claude Code 세션이 닫혀 있으면 채널로 보낸 메시지가 유실됩니다.
- **claude.ai 로그인 필수** — API 키 인증으로는 채널 기능을 사용할 수 없습니다.

## 정리

- 채널 레퍼런스는 텔레그램/디스코드 외에 **어떤 서비스든 Claude Code와 연결**하기 위한 커스텀 채널 서버 개발 가이드입니다.
- **단방향**(알림만 받기)과 **양방향**(메시지 주고받기) 두 가지 방식을 지원합니다.
- 만든 채널 서버를 플러그인으로 패키징하면 다른 사용자도 설치할 수 있습니다.

## 출처

- [Claude Code Channels Reference 공식 문서](https://code.claude.com/docs/en/channels-reference)
- [Claude Code Channels 공식 문서](https://code.claude.com/docs/en/channels)
