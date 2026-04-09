---
title: "JetBrains IDE에서 Claude Code 사용하기"
source: "https://code.claude.com/docs/en/jetbrains"
order: 31
tags: ["플랫폼", "IDE", "JetBrains"]
---

# JetBrains IDE에서 Claude Code 사용하기

IntelliJ, PyCharm, WebStorm 등 JetBrains 계열 개발 도구에서 Claude Code 플러그인을 사용할 수 있습니다. 마치 숙련된 동료 개발자가 내 IDE에 들어와 코드를 같이 보면서 도와주는 것과 같습니다.

## 예시 케이스

> 백엔드 개발자 이민준 씨는 IntelliJ IDEA에서 Java 프로젝트를 작업 중입니다. NullPointerException이 발생하는 이유를 며칠째 못 찾고 있었는데, 플러그인을 설치하고 `Cmd+Esc`를 눌러 Claude에게 "이 오류가 왜 발생하는지 찾아줘"라고 입력했습니다. Claude는 IDE의 오류 진단 정보를 자동으로 읽고, 원인과 수정 방법을 바로 알려주었습니다.

---

## 지원하는 IDE 목록

| IDE | 설명 |
|-----|------|
| IntelliJ IDEA | Java/Kotlin 범용 개발 환경 |
| PyCharm | Python 전용 개발 환경 |
| Android Studio | 안드로이드 앱 개발 환경 |
| WebStorm | JavaScript/TypeScript 개발 환경 |
| PhpStorm | PHP 개발 환경 |
| GoLand | Go 언어 개발 환경 |

---

## 설치 방법

1. JetBrains 마켓플레이스에서 **Claude Code** 플러그인을 검색합니다.
2. **설치** 버튼을 클릭합니다.
3. IDE를 완전히 재시작합니다 (여러 번 재시작이 필요할 수 있습니다).

> Claude Code CLI가 아직 설치되지 않았다면 먼저 설치해야 합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **빠른 실행** | `Cmd+Esc` (Mac) 또는 `Ctrl+Esc` (Windows/Linux)로 Claude 즉시 열기 |
| **변경사항 비교** | 코드 수정 내용을 IDE 내 비교 화면으로 직접 확인 |
| **선택 영역 공유** | 현재 선택한 코드나 탭이 자동으로 Claude와 공유됨 |
| **파일 참조 삽입** | `Cmd+Option+K` (Mac) 또는 `Alt+Ctrl+K` (Windows/Linux)로 파일 참조 삽입 |
| **오류 자동 공유** | IDE에서 감지된 문법 오류, 린트 오류 등이 Claude에 자동으로 전달됨 |

---

## 사용 방법

### IDE 내부 터미널에서 사용하기

IDE의 내장 터미널에서 `claude`를 실행하면 모든 통합 기능이 자동으로 활성화됩니다.

### 외부 터미널에서 연결하기

외부 터미널에서 Claude Code를 실행한 경우, `/ide` 명령을 입력하면 JetBrains IDE와 연결됩니다:

```bash
claude
```

```
/ide
```

> Claude가 IDE와 같은 파일에 접근하려면, IDE 프로젝트의 루트 폴더에서 Claude Code를 시작하세요.

---

## 설정 방법

### IDE 플러그인 설정

**설정 → 도구 → Claude Code [Beta]** 메뉴에서 다음 항목을 조정할 수 있습니다:

| 설정 항목 | 설명 |
|-----------|------|
| **Claude 명령어** | Claude 실행 경로 지정 (예: `claude`, `/usr/local/bin/claude`) |
| **명령어 없음 알림 숨기기** | Claude 명령어를 찾지 못할 때 알림 표시 여부 |
| **Option+Enter 멀티라인** | (macOS) Option+Enter로 줄바꿈 입력 활성화 |
| **자동 업데이트** | 플러그인 자동 업데이트 활성화 |

> **WSL 사용자**: Claude 명령어 설정에 `wsl -d Ubuntu -- bash -lic "claude"` 형식으로 입력하세요. (Ubuntu 부분은 본인의 WSL 배포판 이름으로 변경)

### ESC 키 설정

ESC 키로 Claude 작업을 중단하려면:

1. **설정 → 도구 → 터미널** 으로 이동합니다.
2. **"ESC로 에디터에 포커스 이동"** 체크 해제, 또는
3. "터미널 키 바인딩 설정"에서 "에디터로 포커스 전환" 단축키를 삭제합니다.

---

## 특수 환경 설정

### 원격 개발 환경

원격 개발 환경(Remote Development)에서는 로컬이 아닌 **원격 호스트**에 플러그인을 설치해야 합니다.

설정 경로: **설정 → 플러그인 (호스트)**

### WSL 환경

WSL 사용자는 추가 설정이 필요할 수 있습니다:
- 터미널 구성
- 네트워크 모드 조정
- 방화벽 설정

자세한 내용은 공식 WSL 트러블슈팅 가이드를 참조하세요.

---

## 자주 발생하는 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| 플러그인이 작동하지 않음 | 프로젝트 루트에서 Claude를 실행하고 있는지 확인, IDE 완전 재시작 |
| IDE가 감지되지 않음 | 플러그인 활성화 확인, IDE 재시작, 내장 터미널에서 Claude 실행 |
| 명령어를 찾을 수 없음 | `npm list -g @anthropic-ai/claude-code`로 설치 확인, 설정에서 경로 직접 지정 |
| 원격 개발에서 작동 안 함 | 원격 호스트에 플러그인이 설치되었는지 확인 |

---

## 보안 안내

자동 편집 권한이 활성화된 상태에서는 Claude가 IDE 설정 파일도 수정할 수 있습니다. 이는 Claude Code의 권한 프롬프트를 우회하는 데 악용될 수 있으므로, 다음 사항에 주의하세요:

- 신뢰할 수 있는 코드와 프롬프트에서만 Claude를 사용하세요.
- 가능하면 수동 승인 모드를 사용하세요.
- Claude가 어떤 파일에 접근할 수 있는지 인지하고 계세요.
