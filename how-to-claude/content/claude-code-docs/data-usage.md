---
title: "데이터 사용 정책 - 내 코드와 대화는 어떻게 사용되나요?"
source: "https://code.claude.com/docs/en/data-usage"
order: 55
tags: ["보안", "데이터", "Data usage"]
---

# 데이터 사용 정책: 내 코드와 대화는 어떻게 사용되나요?

Claude Code를 쓸 때 입력하는 코드, 질문, 대화 내용이 어떻게 처리되는지 궁금할 수 있습니다. 이 문서는 그 내용을 투명하게 설명합니다.

---

## 계정 유형별 데이터 학습 정책

| 계정 유형 | AI 학습에 사용? |
|---|---|
| 무료 (Free) | 기본적으로 사용됨 (설정에서 끌 수 있음) |
| Pro / Max | 기본적으로 사용됨 (설정에서 끌 수 있음) |
| Team / Enterprise | 사용 안 함 (고객이 명시적으로 동의한 경우 제외) |
| API 직접 사용 | 사용 안 함 (명시적 동의 제외) |
| AWS Bedrock / Google Vertex | 해당 플랫폼의 정책 적용 |

무료·Pro·Max 사용자는 [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls)에서 언제든지 설정을 변경할 수 있습니다.

---

## 데이터 보존 기간

얼마나 오래 데이터를 보관할까요?

### 일반 사용자 (Free, Pro, Max)

| 상황 | 보존 기간 |
|---|---|
| AI 학습 허용한 경우 | 5년 |
| AI 학습 허용하지 않은 경우 | 30일 |

### 기업 사용자 (Team, Enterprise, API)

| 상황 | 보존 기간 |
|---|---|
| 일반 | 30일 |
| 제로 데이터 보존(ZDR) 활성화 | 응답 직후 삭제 |
| 로컬 캐시 (세션 재개용) | 최대 30일 (설정 가능) |

웹 세션을 개별적으로 직접 삭제할 수도 있습니다. 삭제하면 해당 세션 데이터가 영구 제거됩니다.

---

## `/bug` 명령 피드백

`/bug` 명령으로 문제를 신고하면, **전체 대화 내용**이 Anthropic으로 전송됩니다.

- 데이터는 암호화되어 전송됩니다.
- **5년간 보관**됩니다.
- 원할 경우 GitHub 공개 이슈로도 등록됩니다.
- `DISABLE_BUG_COMMAND=1` 환경변수로 비활성화 가능합니다.

---

## 세션 품질 설문

"이번 세션에서 Claude는 어떠셨나요?" 같은 설문이 나타날 때:

- 별점(1, 2, 3) 또는 "나중에"만 기록됩니다.
- **대화 내용은 전혀 저장되지 않습니다.**
- AI 학습에 사용되지 않습니다.
- `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1`로 끌 수 있습니다.

---

## 어떤 데이터가 외부로 나가나요?

### 로컬 설치 사용 시

Claude Code는 컴퓨터에서 직접 실행되며, 다음 서비스에 연결합니다.

| 서비스 | 역할 | 데이터 내용 |
|---|---|---|
| Anthropic API | AI 응답 생성 | 사용자 입력, 모델 출력 |
| Statsig | 기능 플래그, 성능 측정 | 지연 시간, 사용 패턴 (코드 없음) |
| Sentry | 오류 로그 | 오류 정보 |
| NPM | 설치·업데이트 | 없음 |

모든 데이터는 **TLS 암호화**로 전송됩니다. 저장 시에는 암호화가 적용되지 않습니다.

### 웹(클라우드) 사용 시

Anthropic 관리 가상 머신에서 실행되며 다음이 적용됩니다.

- 코드·세션 데이터는 계정 유형의 보존 정책 적용
- GitHub 자격증명은 보안 프록시를 통해 처리 (샌드박스에 직접 노출 안 됨)
- 모든 외부 트래픽은 감사 로그용 보안 프록시 경유

---

## API 공급자별 기본 동작

| 서비스 | Claude API | Vertex API | Bedrock API | Foundry API |
|---|---|---|---|---|
| Statsig (성능 측정) | 기본 켜짐 | 기본 꺼짐 | 기본 꺼짐 | 기본 꺼짐 |
| Sentry (오류 로그) | 기본 켜짐 | 기본 꺼짐 | 기본 꺼짐 | 기본 꺼짐 |
| `/bug` 명령 | 기본 켜짐 | 기본 꺼짐 | 기본 꺼짐 | 기본 꺼짐 |
| 세션 품질 설문 | 기본 켜짐 | 기본 꺼짐 | 기본 꺼짐 | 기본 꺼짐 |

Bedrock, Vertex, Foundry를 사용하면 불필요한 트래픽이 자동으로 꺼집니다. 한 번에 모두 끄려면 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`을 설정하세요.

---

## 데이터 비활성화 환경변수 정리

| 환경변수 | 효과 |
|---|---|
| `DISABLE_TELEMETRY=1` | Statsig 성능 수집 비활성화 |
| `DISABLE_ERROR_REPORTING=1` | Sentry 오류 로그 비활성화 |
| `DISABLE_BUG_COMMAND=1` | `/bug` 명령 비활성화 |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1` | 세션 품질 설문 비활성화 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` | 위 네 가지 한 번에 비활성화 |

이 환경변수는 `settings.json`에 기입해 영구 적용할 수 있습니다.

---

## 예시 케이스

### 상황 1: 회사 코드를 Claude Code로 분석할 때
Team 또는 Enterprise 플랜을 사용하고 있다면, 코드와 대화는 AI 학습에 사용되지 않고 30일 후 삭제됩니다. ZDR을 활성화하면 응답 직후 서버에서 삭제됩니다.

### 상황 2: 개인 Pro 계정으로 사이드 프로젝트 작업 시
기본 설정에서는 대화 내용이 AI 학습에 활용됩니다. 개인정보가 민감하거나 학습에 기여하기 원하지 않는다면 [설정 페이지](https://claude.ai/settings/data-privacy-controls)에서 "사용 데이터 학습 허용"을 꺼주세요.

### 상황 3: AWS Bedrock으로 Claude Code를 연동한 기업
Bedrock 사용 시 Statsig, Sentry, `/bug` 기능이 기본으로 꺼져 있습니다. 데이터 정책은 Anthropic이 아닌 AWS Bedrock 정책이 적용됩니다.
