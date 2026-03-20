---
title: "환경 변수 레퍼런스 — Claude Code 동작을 제어하는 숨은 설정들"
source: "https://code.claude.com/docs/en/env-vars"
order: 66
tags: ["설정", "환경변수", "기업·개발자", "Environment variables", "claude-docs"]
---

## 이게 뭔가요?

환경 변수(Environment Variable)는 **프로그램이 실행될 때 참고하는 숨은 설정값**입니다.

자동차에 비유하면 **계기판 뒤에 숨어 있는 정비사 전용 설정**과 같습니다. 일반 운전자는 핸들과 페달만 쓰지만, 정비사는 엔진 회전수 한계, 변속 타이밍, 에어백 감도 같은 세부 설정을 조정할 수 있습니다. 환경 변수가 바로 그런 역할을 합니다 — 평소에는 건드릴 일이 없지만, 특별한 상황에서 Claude Code의 동작 방식을 바꿀 수 있는 열쇠입니다.

Claude Code에서는 **어떤 AI 모델을 쓸지**, **응답 길이를 얼마나 허용할지**, **회사 내부 네트워크를 경유할지** 같은 것들을 환경 변수로 제어합니다.

---

## 왜 알아야 하나요?

- **기업 환경**에서 Claude Code를 쓸 때 프록시(Proxy, 회사 내부 네트워크 중계 서버) 설정이나 인증 방식을 바꿔야 할 수 있습니다
- API 키(프로그램끼리 신원을 확인하는 비밀번호)를 코드에 직접 쓰면 보안 사고가 나는데, 환경 변수에 넣으면 안전합니다
- Claude의 응답이 너무 짧게 잘리거나, 특정 기능이 안 될 때 환경 변수 하나로 해결되는 경우가 많습니다
- 대부분의 사용자는 기본값 그대로 써도 되지만, **문제가 생겼을 때 어디를 조정해야 하는지** 알아두면 유용합니다

---

## 어떻게 하나요?

### 방법 1: 터미널에서 직접 설정 (일시적)

터미널(CLI, 키보드로 명령어를 입력하는 화면)에서 Claude Code를 실행하기 전에 환경 변수를 지정합니다. 이 방법은 **해당 세션에서만** 유효합니다.

**Mac / Linux:**
```bash
export ANTHROPIC_MODEL=claude-sonnet-4-20250514
claude
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_MODEL = "claude-sonnet-4-20250514"
claude
```

<div class="example-case">
<strong>예시: 모델을 Sonnet으로 바꿔서 실행하기</strong>

평소에는 기본 모델(Opus)을 쓰지만, 간단한 작업에는 더 빠른 Sonnet을 쓰고 싶을 때:

Mac: `export ANTHROPIC_MODEL=claude-sonnet-4-20250514 && claude`
Windows: `$env:ANTHROPIC_MODEL = "claude-sonnet-4-20250514"; claude`

이렇게 하면 이번 세션에서만 Sonnet 모델로 동작합니다. 터미널을 닫으면 원래대로 돌아갑니다.

</div>

### 방법 2: `.env` 파일에 저장 (영구적)

프로젝트 폴더에 `.env` 파일을 만들어 환경 변수를 저장합니다. Claude Code가 시작할 때 자동으로 읽습니다.

```bash
# .env 파일 예시
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514
CLAUDE_CODE_MAX_OUTPUT_TOKENS=16000
```

### 방법 3: `CLAUDE_ENV_FILE`로 별도 파일 지정

환경 변수 파일의 위치를 직접 지정할 수도 있습니다. 여러 프로젝트에서 같은 설정을 공유할 때 유용합니다.

```bash
export CLAUDE_ENV_FILE=/path/to/my-custom-env
claude
```

---

## 환경 변수 전체 목록

### 핵심 설정 (Core)

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | API 키. Claude와 통신하기 위한 인증 비밀번호 | 없음 (필수) |
| `ANTHROPIC_MODEL` | 사용할 모델 이름 (예: `claude-sonnet-4-20250514`) | 기본 모델 자동 선택 |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Claude 응답의 최대 토큰(글자 단위) 수 | 모델 기본값 |

### 인증 및 클라우드 연결 (Auth)

기업에서 AWS Bedrock이나 Google Vertex를 통해 Claude를 사용할 때 필요한 설정입니다.

| 변수명 | 설명 |
|--------|------|
| `CLAUDE_CODE_USE_BEDROCK` | `1`로 설정하면 Amazon Bedrock(AWS의 AI 서비스 플랫폼)을 통해 연결 |
| `CLAUDE_CODE_USE_VERTEX` | `1`로 설정하면 Google Vertex AI(GCP의 AI 서비스 플랫폼)를 통해 연결 |
| `ANTHROPIC_BEDROCK_BASE_URL` | Bedrock 커스텀 엔드포인트(연결 주소) URL |
| `ANTHROPIC_VERTEX_PROJECT_ID` | Vertex AI 프로젝트 ID |
| `ANTHROPIC_VERTEX_REGION` | Vertex AI 리전(서버 위치) |

### 동작 제어 (Behavior)

| 변수명 | 설명 |
|--------|------|
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | `1`로 설정하면 핵심 기능 외의 네트워크 트래픽(사용 통계 전송 등)을 차단 |
| `CLAUDE_CODE_SKIP_VENV_CHECK` | `1`로 설정하면 Python 가상 환경(venv) 검사를 건너뜀 |
| `CLAUDE_CODE_DISABLE_AUTO_UPDATE` | `1`로 설정하면 자동 업데이트를 끔 |

### 프로젝트 경로 (Hooks / Context)

| 변수명 | 설명 |
|--------|------|
| `CLAUDE_ENV_FILE` | 환경 변수 파일 경로를 직접 지정 |
| `CLAUDE_PROJECT_DIR` | 프로젝트 디렉토리(작업 폴더) 경로를 직접 지정 |

### 네트워크 (Network)

회사 내부 네트워크에서 프록시를 거쳐야 하는 경우에 사용합니다.

| 변수명 | 설명 |
|--------|------|
| `HTTP_PROXY` | HTTP 프록시(중계 서버) 주소 |
| `HTTPS_PROXY` | HTTPS 프록시 주소 |
| `CUSTOM_CERTIFICATE_PATH` | 사내 인증서(보안 통신에 쓰는 디지털 신분증) 파일 경로 |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0`으로 설정하면 TLS(보안 통신) 인증서 검증을 건너뜀 (보안 주의) |

### 디버그 (Debug)

문제가 생겼을 때 원인을 추적하기 위한 설정입니다.

| 변수명 | 설명 |
|--------|------|
| `BASH_DEBUG` | `1`로 설정하면 Bash(터미널 명령어 실행기) 실행 과정을 상세 출력 |
| `CLAUDE_CODE_DEBUG` | `1`로 설정하면 Claude Code 내부 디버그 로그를 출력 |

---

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 회사 네트워크에서 Claude Code가 연결되지 않을 때</strong>

회사에서 Claude Code를 실행했더니 "네트워크 오류"가 뜹니다. 회사 보안 정책 때문에 외부 인터넷 접속 시 프록시 서버를 거쳐야 하기 때문입니다.

해결 방법 — `.env` 파일에 프록시 설정 추가:

```bash
# .env
HTTPS_PROXY=http://proxy.company.com:8080
CUSTOM_CERTIFICATE_PATH=/etc/ssl/company-cert.pem
```

이렇게 설정하면 Claude Code가 회사 프록시를 통해 외부 API에 접속합니다. IT 팀에 프록시 주소와 인증서 파일을 요청하세요.

</div>

<div class="example-case">
<strong>실전 케이스: 응답이 중간에 잘릴 때</strong>

Claude에게 긴 코드를 생성해달라고 했는데 중간에 끊깁니다. 이런 경우 최대 출력 토큰 수를 늘려줄 수 있습니다.

Mac: `export CLAUDE_CODE_MAX_OUTPUT_TOKENS=16000 && claude`
Windows: `$env:CLAUDE_CODE_MAX_OUTPUT_TOKENS = "16000"; claude`

기본값보다 큰 숫자를 설정하면 Claude가 더 긴 응답을 생성할 수 있습니다. 다만, 토큰 사용량이 늘어나므로 비용에 주의하세요.

</div>

---

## 주의할 점

- **API 키는 절대 코드 파일이나 Git 저장소에 넣지 마세요.** `.env` 파일에만 저장하고, `.gitignore`에 `.env`를 추가해야 합니다
- `NODE_TLS_REJECT_UNAUTHORIZED=0`은 보안 검증을 끄는 것이므로, **테스트 환경에서만** 사용하세요. 프로덕션(실제 서비스)에서는 올바른 인증서를 설정하는 것이 맞습니다
- 환경 변수 이름은 **대소문자를 구분**합니다. `ANTHROPIC_API_KEY`와 `anthropic_api_key`는 다릅니다
- Bedrock이나 Vertex 설정은 해당 클라우드 서비스 계정이 먼저 있어야 합니다. 개인 사용자라면 `ANTHROPIC_API_KEY`만 있으면 충분합니다

---

## 정리

- 환경 변수는 Claude Code의 동작을 바꾸는 "숨은 설정판"입니다
- 대부분의 사용자는 `ANTHROPIC_API_KEY`와 `ANTHROPIC_MODEL` 정도만 알면 됩니다
- 기업 환경이나 문제 해결 시 네트워크, 디버그 관련 변수를 참고하세요

---

## 출처

- [Claude Code 공식 문서 — Environment Variables](https://code.claude.com/docs/en/env-vars)
