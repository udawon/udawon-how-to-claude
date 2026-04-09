---
date: "2026-03-20"
title: "Claude Code 채널 — 텔레그램으로 Claude에게 원격 지시하기"
description: "텔레그램 봇을 만들어 Claude Code 세션에 메시지를 보내고 답변받는 Channels 기능 설정법"
order: 28
tags: ["신기능", "연동", "youtube"]
source_url: "https://youtube.com/watch?v=uub34E4DwZI"
---

## 이게 뭔가요?

Claude Code 채널(Channel)은 **텔레그램이나 디스코드 같은 메신저에서 Claude Code로 작업 지시를 보내는 기능**입니다.

카카오톡으로 집에 있는 가족에게 "냉장고에서 우유 좀 꺼내줘"라고 메시지 보내는 것과 같습니다. 컴퓨터 앞에 없어도 **스마트폰 텔레그램에서 Claude에게 "이거 해줘"라고 보내면, Claude가 작업하고 결과를 텔레그램으로 답장**해줍니다.

기존에는 Claude에게 뭔가 시키려면 반드시 터미널(키보드로 명령어를 입력하는 화면) 앞에 앉아 있어야 했는데, 이제는 **MCP(외부 도구 연결 기능)를 통해 바깥에서 안으로 메시지를 쏠 수 있게** 된 것입니다.

## 왜 알아야 하나요?

**알면 좋은 점:**
- 퇴근 후에도 **스마트폰으로 Claude에게 추가 지시** 가능
- 장시간 작업 중 진행 상황을 **터미널 없이 텔레그램으로 확인**
- 나만의 서비스에서 Claude Code로 **자동 작업 요청** 가능 (API 연동)
- 텔레그램, 디스코드뿐 아니라 **직접 만든 채널도 연결** 가능

**모르면 불편한 점:**
- Claude에게 추가 지시하려면 매번 컴퓨터 앞으로 돌아가야 함
- 외부 서비스에서 Claude에게 자동으로 작업을 시킬 수 없음

## 어떻게 하나요?

### 방법 1: 텔레그램 봇 연결 (영상에서 시연한 방법)

영상에서 코드팩토리가 직접 시연한 **텔레그램 연동 5단계**입니다.

**사전 준비:**
- Claude Code v2.1.80 이상
- [Bun](https://bun.sh)(자바스크립트 실행 도구) 설치
- claude.ai 계정 로그인 (API 키 인증은 미지원)

**1단계: 텔레그램 봇 만들기**

텔레그램에서 [@BotFather](https://t.me/BotFather)를 찾아서 `/newbot`을 보냅니다. 봇 이름과 사용자명을 입력하면 **토큰(인증 열쇠)**이 발급됩니다.

> 영상에서도 봇 이름 짓기가 쉽지 않았습니다 — 요즘 텔레그램 봇이 워낙 많아서 이름 잡기가 어렵다고 합니다.

**2단계: 플러그인(확장 기능) 설치**

Claude Code에서 실행:
```
/plugin install telegram@claude-plugins-official
```
설치 후 `/reload-plugins`로 플러그인을 활성화합니다.

**3단계: 토큰 등록**

BotFather에서 받은 토큰을 등록:
```
/telegram:configure <여기에_토큰_붙여넣기>
```
토큰은 `.claude/channels/telegram/.env` 파일에 저장됩니다.

**4단계: 채널 모드로 재시작**

Claude Code를 종료하고 다시 시작합니다:
```bash
claude --channels plugin:telegram@claude-plugins-official
```
시작하면 `listening for channels message from plugin telegram...`이라는 메시지가 나옵니다.

**5단계: 페어링(연결 확인) & 보안 잠금**

텔레그램에서 만든 봇에게 아무 메시지를 보내면, 봇이 페어링 코드를 답장합니다. 이 코드를 Claude Code에 입력:
```
/telegram:access pair <코드>
/telegram:access policy allowlist
```
두 번째 명령어는 **나만 메시지를 보낼 수 있도록** 보안을 잠그는 것입니다.

<div class="example-case">
<strong>예시: 영상 속 실제 시연</strong>

코드팩토리가 텔레그램에서 "HTML CSS 자바스크립트 사용해서 클로드 코드 사용 가이드 사이트 만들어 줘"라고 메시지를 보냈더니, Claude가 "클로드 코드 사용 가이드 사이트를 만들고 있습니다. 잠시 기다려 주세요"라고 답장하고 실제로 사이트를 만들기 시작했습니다. 일반적으로 터미널에서 쓰는 것과 동일하게 동작합니다.

</div>

### 방법 2: fakechat으로 먼저 체험하기

외부 계정 없이 내 컴퓨터에서 바로 체험할 수 있는 데모입니다:

```
/plugin install fakechat@claude-plugins-official
```

재시작:
```bash
claude --channels plugin:fakechat@claude-plugins-official
```

브라우저에서 `http://localhost:8787`을 열면 채팅 화면이 나타나고, 여기서 보낸 메시지가 Claude Code 세션으로 전달됩니다.

### 방법 3: 나만의 채널 직접 만들기

영상에서 강조한 **핵심 포인트** — Anthropic(Claude를 만든 회사)이 채널 인터페이스를 완전히 공개했기 때문에, 텔레그램/디스코드 외에도 **자기만의 서비스를 Claude Code에 연결**할 수 있습니다. 공식 문서의 [Build your own channel](https://code.claude.com/docs/en/channels-reference)에서 방법을 확인할 수 있습니다.

<div class="example-case">
<strong>예시: 사업자를 위한 활용</strong>

영상에서 "사업하시는 형님들, SaaS(서비스형 소프트웨어) 만드시는 분들"을 위해 강조한 부분입니다. 예를 들어 고객 문의가 들어오면 → 내 서버에서 MCP를 통해 Claude Code 세션에 "이 문의 분석해줘"라고 자동으로 쏘고 → Claude가 분석 결과를 다시 돌려주는 식의 자동화가 가능해졌습니다.

</div>

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 퇴근 후 스마트폰으로 추가 작업 지시</strong>

프리랜서 개발자 이수진씨는 Claude Code에 대규모 리팩토링(코드 구조 개선)을 시켜놓고 퇴근했습니다. 저녁에 스마트폰 텔레그램으로 봇에게 "리팩토링 끝났으면 테스트 돌려줘"라고 메시지를 보냈습니다. Claude가 테스트를 실행하고 "3개 실패, 나머지 통과"라는 결과를 텔레그램으로 답장해줬습니다. 다음날 출근하니 실패한 3개만 수정하면 되는 상태였습니다.

</div>

## 주의할 점

- **리서치 프리뷰(시험 운영) 단계** — 아직 정식 기능이 아닙니다. 언제든 바뀔 수 있습니다.
- **Claude Code 세션이 열려 있어야** 메시지를 받을 수 있습니다. 세션을 닫으면 텔레그램에서 보낸 메시지가 전달되지 않습니다.
- **권한 확인 팝업 주의** — 자리를 비운 사이에 Claude가 권한 확인을 요청하면 세션이 멈춥니다. 영상에서도 `--dangerously-skip-permissions` 모드로 시연했는데, 이건 **신뢰할 수 있는 환경에서만** 사용해야 합니다.
- **claude.ai 로그인 필수** — API(프로그램끼리 대화하는 통로) 키나 Console 인증으로는 채널 기능을 사용할 수 없습니다.
- **Team/Enterprise 조직**은 관리자가 먼저 채널 기능을 활성화해야 사용 가능합니다.

## 정리

- Claude Code 채널은 **텔레그램/디스코드에서 Claude에게 메시지를 보내고 답장받는 양방향 통신 기능**입니다.
- 텔레그램 봇 만들기 → 플러그인 설치 → 토큰 등록 → 채널 모드 시작 → 페어링 **5단계**로 설정합니다.
- 인터페이스가 공개되어 있어 **나만의 서비스도 연결 가능** — 사업용 자동화에 큰 가능성이 있습니다.

## 출처

- [코드팩토리 — 4시간전에 나온 따끈따끈한 클로드 채널 업데이트](https://youtube.com/watch?v=uub34E4DwZI)
