---
title: "원격 제어로 어디서든 Claude Code 사용하기"
source: "https://code.claude.com/docs/en/remote-control"
order: 37
tags: ["플랫폼", "원격"]
---

# 원격 제어로 어디서든 Claude Code 사용하기

내 컴퓨터에서 실행 중인 Claude Code 세션을 스마트폰, 태블릿, 또는 다른 컴퓨터의 브라우저에서 이어서 사용할 수 있습니다. 마치 사무실 컴퓨터에서 작업하던 것을 집 소파에서 스마트폰으로 이어서 보는 것과 같습니다. 단, 코드는 내 컴퓨터에서 실행되고 화면만 다른 기기에서 보는 방식입니다.

> Remote Control은 모든 플랜에서 사용 가능합니다. Teams/Enterprise 관리자는 [관리자 설정](https://claude.ai/admin-settings/claude-code)에서 먼저 Claude Code를 활성화해야 합니다.

## 예시 케이스

> 개발자 홍수현 씨가 회사에서 큰 리팩토링 작업을 시작했습니다. 퇴근 후 지하철에서 스마트폰으로 claude.ai/code에 접속해서 진행 상황을 확인하고, "이 부분은 다르게 처리해줘"라고 추가 지시를 보냅니다. 집에 도착해서 노트북으로도 같은 세션을 이어서 볼 수 있습니다. 코드는 계속 회사 컴퓨터에서 실행되고 있습니다.

---

## Remote Control의 핵심 특징

| 특징 | 설명 |
|------|------|
| **로컬 환경 유지** | 내 파일, MCP 서버, 도구, 프로젝트 설정 그대로 사용 |
| **동시 접근** | 터미널, 브라우저, 스마트폰에서 동시에 같은 세션 사용 가능 |
| **연결 복구** | 랩탑이 절전 모드가 되거나 네트워크가 끊겼다가 복구되면 자동 재연결 |

---

## Claude Code on the web과의 차이점

| 항목 | Remote Control | Claude Code on the web |
|------|----------------|------------------------|
| 실행 위치 | 내 컴퓨터 | Anthropic 클라우드 서버 |
| 로컬 파일 접근 | 가능 | 불가 (GitHub 저장소 필요) |
| MCP 서버/도구 | 내 환경의 것 사용 | 클라우드 환경의 것 사용 |
| 앱 종료 시 | 세션 종료 | 계속 실행 |
| 적합한 상황 | 로컬 작업 중 다른 기기에서 이어보기 | 컴퓨터 없이 클라우드에서 시작 |

---

## 사전 요구사항

| 항목 | 내용 |
|------|------|
| 구독 | Pro, Max, Teams, Enterprise (API 키는 지원 안 함) |
| 인증 | `/login`으로 claude.ai 로그인 완료 |
| 작업 공간 신뢰 | 프로젝트 폴더에서 `claude`를 최소 한 번 실행하여 신뢰 수락 |

---

## Remote Control 시작하기

### 새 세션 시작

프로젝트 폴더에서 다음 명령을 실행합니다:

```bash
claude remote-control
```

또는 이름을 지정해서 시작:
```bash
claude remote-control "내 프로젝트 이름"
```

터미널에 세션 URL이 표시되고, 스페이스바를 누르면 QR 코드가 나타납니다.

**사용 가능한 옵션:**

| 옵션 | 설명 |
|------|------|
| `--name "이름"` | 세션 목록에 표시될 이름 지정 |
| `--verbose` | 연결 및 세션 상세 로그 표시 |
| `--sandbox` | 파일 및 네트워크 격리 활성화 |
| `--no-sandbox` | 샌드박싱 비활성화 |

### 진행 중인 세션에서 시작

이미 Claude Code 세션을 사용 중이라면 입력창에 입력합니다:

```
/remote-control
```

또는 이름과 함께:
```
/remote-control 내 프로젝트 이름
```

현재 대화 기록이 그대로 유지되며 원격 접속 URL이 표시됩니다.

---

## 다른 기기에서 연결하기

Remote Control 세션이 활성화되면 세 가지 방법으로 연결할 수 있습니다:

| 방법 | 설명 |
|------|------|
| **세션 URL 열기** | 터미널에 표시된 URL을 다른 기기 브라우저에서 열기 |
| **QR 코드 스캔** | 스마트폰 카메라로 QR 코드 스캔 (Claude 앱으로 바로 열림) |
| **목록에서 찾기** | claude.ai/code 또는 Claude 앱에서 세션 목록 확인 (컴퓨터 아이콘 + 초록 점으로 표시) |

Claude 모바일 앱이 없다면 Claude Code 세션에서 `/mobile`을 입력하면 다운로드 QR 코드가 나타납니다.

---

## 모든 세션에서 자동 활성화하기

매번 `remote-control` 명령을 입력하지 않으려면:

1. Claude Code에서 `/config` 입력
2. **모든 세션에서 Remote Control 활성화**를 `true`로 설정

비활성화하려면 같은 방법으로 `false`로 설정합니다.

각 Claude Code 인스턴스는 한 번에 하나의 원격 세션만 지원합니다. 여러 인스턴스를 실행하면 각각 독립적인 세션이 생깁니다.

---

## 보안 방식

내 컴퓨터는 **인바운드 포트를 열지 않습니다.** 대신 Claude Code가 Anthropic API에 아웃바운드 HTTPS 요청을 보내는 방식으로 작동합니다:

```
내 컴퓨터 → (HTTPS) → Anthropic API → (HTTPS) → 다른 기기
```

- 모든 트래픽은 TLS 암호화
- 여러 개의 단기 인증 정보 사용 (각각 단일 목적, 독립 만료)
- 일반 Claude Code 세션과 동일한 보안 수준

---

## 제한사항

| 제한사항 | 내용 |
|----------|------|
| 동시 원격 세션 | 세션당 하나의 원격 연결만 가능 |
| 터미널 종료 시 | 터미널을 닫거나 `claude` 프로세스를 중단하면 세션 종료. `claude remote-control`로 재시작 필요 |
| 네트워크 장애 | 컴퓨터가 켜져 있지만 약 10분 이상 네트워크 연결 불가 시 세션 타임아웃 |

---

## 실제 활용 시나리오

**퇴근 후 이어서 작업하기**
- 사무실: `claude remote-control "리팩토링 작업"` 으로 세션 시작
- 지하철: 스마트폰으로 QR 코드 스캔 → 진행 상황 확인 + 추가 지시
- 집: 노트북 브라우저로 같은 URL 접속 → 계속 작업

**회의 중 확인하기**
- 백그라운드에서 Claude가 테스트를 실행하는 동안 회의 참석
- 회의 중 스마트폰으로 진행 상황 체크
- 문제 발생 시 즉시 "잠시 멈춰줘" 입력

**팀원과 진행 상황 공유하기**
- Remote Control 세션 URL을 팀원에게 공유 (Teams/Enterprise: 팀 내 공유 가능)
- 팀원이 실시간으로 진행 상황 모니터링

---

## 관련 리소스

- [Claude Code on the web](./claude-code-on-the-web.md): 클라우드 인프라에서 실행하는 세션
- [CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference): `claude remote-control` 전체 옵션
- [보안 정책](https://code.claude.com/docs/en/security): Remote Control 세션의 보안 모델
- [데이터 사용 정책](https://code.claude.com/docs/en/data-usage): 로컬/원격 세션에서 Anthropic API로 전송되는 데이터
