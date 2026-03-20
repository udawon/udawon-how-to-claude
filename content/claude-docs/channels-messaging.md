---
date: "2026-03-20"
title: "Channels — 텔레그램·디스코드로 Claude Code에 메시지 보내기"
description: "자리를 비운 사이에도 텔레그램이나 디스코드로 Claude Code 세션에 지시를 보내고 답변을 받는 방법"
order: 2
tags: ["연동", "자동화", "활용법", "claude-docs"]
source_url: "https://code.claude.com/docs/en/channels"
---

## 이게 뭔가요?

Channel(채널)은 **텔레그램이나 디스코드 같은 메신저에서 Claude Code로 메시지를 보내는 기능**입니다.

집에 있는 AI 비서를 생각해보세요. 평소에는 집(터미널)에서 직접 말을 걸지만, **외출 중에도 카카오톡(텔레그램/디스코드)으로 "이거 해줘"라고 문자를 보내면 비서가 알아서 처리하고 결과를 다시 문자로 보내주는 것**과 같습니다.

핵심 포인트:
- Claude Code 세션이 열려 있어야 메시지를 받을 수 있습니다
- 양방향 통신 — 메시지를 보내면 Claude가 답장을 해줍니다
- 현재 **리서치 프리뷰(시험 운영 중인 기능)** 단계로, Claude Code v2.1.80 이상 필요

## 왜 알아야 하나요?

**알면 좋은 점:**
- 컴퓨터 앞에 없어도 **스마트폰에서 Claude Code에 지시**를 보낼 수 있음
- CI/CD(코드를 자동으로 테스트하고 배포하는 시스템) 결과, 모니터링 알림 등을 Claude에게 자동 전달 가능
- 장시간 작업 중 추가 지시를 터미널 없이 보낼 수 있음

**모르면 불편한 점:**
- 외출 중 Claude에게 추가 지시를 보내려면 컴퓨터 앞으로 돌아와야 함
- CI 결과나 서버 알림을 Claude가 자동으로 처리하게 만들 수 없음

## 어떻게 하나요?

### 방법 1: 텔레그램으로 연결하기

텔레그램 봇을 만들어서 Claude Code와 연결하는 방법입니다.

**사전 준비:**
- [Bun](https://bun.sh)(자바스크립트 실행 도구)이 설치되어 있어야 합니다
- claude.ai 계정으로 로그인한 상태여야 합니다 (API(프로그램끼리 대화하는 통로) 키 인증은 미지원)

**1단계: 텔레그램 봇 만들기**

텔레그램에서 [@BotFather](https://t.me/BotFather)를 찾아 `/newbot`을 보냅니다. 봇 이름과 사용자명을 입력하면 **토큰(인증 열쇠)**이 발급됩니다. 이 토큰을 복사해두세요.

**2단계: 플러그인(확장 기능) 설치**

Claude Code에서 실행:
```
/plugin install telegram@claude-plugins-official
```

**3단계: 토큰 등록**
```
/telegram:configure <여기에_토큰_붙여넣기>
```

**4단계: 채널 모드로 재시작**

Claude Code를 종료하고 다시 시작:
```bash
claude --channels plugin:telegram@claude-plugins-official
```

**5단계: 내 계정 연결하기**

텔레그램에서 만든 봇에게 아무 메시지나 보내면, 봇이 **페어링 코드(연결 확인 번호)**를 보내줍니다. Claude Code에서 이 코드를 입력:
```
/telegram:access pair <코드>
/telegram:access policy allowlist
```

두 번째 명령어는 **나만 메시지를 보낼 수 있도록** 잠금을 거는 것입니다.

<div class="example-case">
<strong>예시: 퇴근 후 스마트폰으로 지시 보내기</strong>

프리랜서 이수진씨는 Claude Code에 대규모 리팩토링을 시키고 퇴근했습니다. 저녁에 스마트폰 텔레그램으로 "리팩토링 끝났으면 테스트 돌려줘"라고 메시지를 보냈더니, Claude가 테스트를 실행하고 결과를 텔레그램으로 답장해줬습니다. 다음날 출근하니 모든 작업이 완료되어 있었습니다.

</div>

### 방법 2: 디스코드로 연결하기

디스코드 봇을 만들어서 연결하는 방법입니다. 팀이 디스코드를 사용하고 있다면 이 방법이 편합니다.

**1단계: 디스코드 봇 만들기**

[Discord Developer Portal](https://discord.com/developers/applications)에서 새 앱 생성 → Bot 섹션에서 토큰 복사 → **Message Content Intent** 활성화

**2단계~5단계**: 텔레그램과 동일한 흐름 (플러그인 이름만 `discord@claude-plugins-official`로 변경)

```
/plugin install discord@claude-plugins-official
/discord:configure <토큰>
claude --channels plugin:discord@claude-plugins-official
/discord:access pair <코드>
/discord:access policy allowlist
```

### 방법 3: fakechat으로 먼저 체험하기 (초보자 추천)

외부 계정 없이 내 컴퓨터에서 바로 체험할 수 있는 데모입니다.

```
/plugin install fakechat@claude-plugins-official
```
Claude Code를 재시작:
```bash
claude --channels plugin:fakechat@claude-plugins-official
```
브라우저에서 `http://localhost:8787`을 열면 채팅 화면이 나타납니다. 여기서 메시지를 보내면 Claude Code가 받아서 처리합니다.

<div class="example-case">
<strong>예시: 팀 디스코드에서 Claude에게 작업 요청</strong>

스타트업 개발팀은 디스코드 서버를 사용합니다. 팀장 김대리가 디스코드에서 Claude 봇에게 "오늘 PR 올라온 거 코드 리뷰해줘"라고 DM(다이렉트 메시지)을 보내면, Claude Code가 해당 PR(코드 변경 요청)을 분석하고 리뷰 결과를 디스코드로 답장합니다. 팀원들은 컴퓨터 앞에 없어도 스마트폰 디스코드 앱으로 결과를 확인할 수 있습니다.

</div>

## 실전 예시

<div class="example-case">
<strong>실전 케이스: CI 결과를 Claude가 자동으로 받아 처리하기</strong>

DevOps(개발과 운영을 자동화하는 업무 방식) 엔지니어 박민수씨는 GitHub Actions(코드 자동 테스트 도구)의 결과를 Claude Code로 자동 전달하고 싶습니다. 커스텀 채널을 만들어서 "테스트 실패" 알림이 오면 Claude가 자동으로 실패 원인을 분석하고, 텔레그램으로 "이런 이유로 실패했고, 이렇게 고치면 됩니다"라고 보고하도록 설정했습니다.

</div>

## 보안: 누가 메시지를 보낼 수 있나요?

채널은 **허용 목록(allowlist)** 방식으로 보안을 관리합니다:

| 항목 | 설명 |
|------|------|
| **페어링** | 봇에 메시지를 보내면 코드가 발급되고, Claude Code에서 승인해야 연결 |
| **허용 목록** | 승인된 사용자 ID만 메시지를 보낼 수 있음. 나머지는 자동 무시 |
| **세션별 활성화** | `--channels` 플래그로 해당 세션에서만 채널 활성화 |
| **기업 관리** | Team/Enterprise 플랜은 관리자가 명시적으로 활성화해야 사용 가능 |

## 주의할 점

- **리서치 프리뷰 단계** — 아직 정식 기능이 아닙니다. `--channels` 플래그 문법이나 동작 방식이 바뀔 수 있습니다.
- **세션이 열려 있어야 합니다** — Claude Code를 닫으면 메시지를 받을 수 없습니다. 항상 받으려면 백그라운드 프로세스나 지속 터미널에서 실행해야 합니다.
- **권한 확인 팝업** — 자리를 비운 사이에 Claude가 권한 확인을 요청하면 세션이 멈춥니다. 무인 운용 시에는 `--dangerously-skip-permissions`를 쓸 수 있지만, 신뢰할 수 있는 환경에서만 사용하세요.
- **claude.ai 로그인 필수** — API 키나 Console 인증으로는 채널 기능을 사용할 수 없습니다.
- **Bun 설치 필요** — 채널 플러그인은 [Bun](https://bun.sh)(자바스크립트 런타임) 위에서 동작합니다.

## 정리

- Channel은 **텔레그램/디스코드에서 Claude Code로 메시지를 주고받는 양방향 통신 기능**입니다.
- 외출 중에도 스마트폰으로 Claude에게 지시하고 결과를 받을 수 있습니다.
- 현재 리서치 프리뷰 단계이며, fakechat 데모로 먼저 체험해볼 수 있습니다.

## 출처

- [Claude Code Channels 공식 문서](https://code.claude.com/docs/en/channels)
- [Claude Code Channels 레퍼런스 (커스텀 채널 빌드)](https://code.claude.com/docs/en/channels-reference)
- [Claude Plugins Official (GitHub)](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins)
