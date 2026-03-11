---
title: "Chrome 브라우저와 Claude Code 연동하기"
source: "https://code.claude.com/docs/en/chrome"
order: 35
tags: ["플랫폼", "브라우저"]
---

# Chrome 브라우저와 Claude Code 연동하기

Claude Code와 Chrome 브라우저 확장 프로그램을 연결하면, AI가 직접 브라우저를 조작해 웹 앱을 테스트하고 오류를 잡아내며 반복 작업을 자동화할 수 있습니다. 마치 QA 테스터가 내 컴퓨터 화면을 보면서 직접 클릭하고 결과를 알려주는 것과 같습니다.

> Chrome 통합 기능은 현재 베타 버전입니다. Google Chrome과 Microsoft Edge를 지원하며, Brave, Arc 등 다른 크로미움 브라우저와 WSL은 지원하지 않습니다.

## 예시 케이스

> 웹 디자이너 오예진 씨는 새로 만든 회원가입 폼이 제대로 작동하는지 확인해야 합니다. `@browser localhost:3000 접속해서 이름 없이 제출 버튼 눌렀을 때 오류 메시지가 나타나는지 확인해줘`라고 입력합니다. Claude가 자동으로 브라우저를 열고, 폼을 찾아 빈 상태로 제출한 뒤 결과를 보고합니다. 직접 클릭해볼 필요도 없습니다.

---

## 사전 준비사항

| 항목 | 요구사항 |
|------|----------|
| 브라우저 | Google Chrome 또는 Microsoft Edge |
| Chrome 확장 | [Claude in Chrome 확장](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) 버전 1.0.36 이상 |
| Claude Code | 버전 2.0.73 이상 |
| 구독 | Pro, Max, Teams, Enterprise (직접 Anthropic 구독) |

> Amazon Bedrock, Google Vertex AI, Microsoft Foundry 같은 서드파티 제공자를 통해 Claude에 접근하는 경우 Chrome 통합을 사용할 수 없습니다.

---

## 할 수 있는 일들

| 기능 | 설명 |
|------|------|
| **실시간 디버깅** | 브라우저 콘솔 오류와 DOM 상태를 직접 읽고 코드 수정 |
| **디자인 검증** | Figma 디자인대로 UI가 만들어졌는지 브라우저에서 확인 |
| **웹 앱 테스트** | 폼 유효성 검사, 사용자 흐름, 시각적 오류 확인 |
| **인증된 앱 접근** | 로그인된 Google Docs, Gmail, Notion 등 직접 조작 |
| **데이터 추출** | 웹 페이지에서 구조화된 정보 수집 후 파일로 저장 |
| **작업 자동화** | 데이터 입력, 폼 작성, 여러 사이트 작업 자동화 |
| **GIF 녹화** | 브라우저 작업 과정을 GIF로 기록해 공유 |

---

## 시작 방법 (CLI)

### 1단계: Chrome 활성화하여 Claude 시작

```bash
claude --chrome
```

이미 실행 중인 세션에서는 `/chrome`을 입력해 활성화할 수 있습니다.

### 2단계: 브라우저 작업 요청

```
code.claude.com/docs에 접속해서 검색창 클릭하고
"hooks"를 입력한 다음 검색 결과를 알려줘
```

세션 상태 확인 및 재연결: `/chrome` 입력

### VS Code에서 사용하기

VS Code 확장에서는 입력창에 `@browser`를 입력한 후 작업을 요청합니다:
```
@browser localhost:3000에 접속해서 콘솔 오류 확인해줘
```

---

## Chrome을 기본으로 활성화하기

매번 `--chrome` 플래그 없이 사용하려면:
- CLI: `/chrome` → "기본으로 활성화" 선택
- VS Code: Chrome 확장이 설치되어 있으면 자동으로 사용 가능

> 기본 활성화 시 Chrome 도구가 항상 로드되어 컨텍스트를 더 많이 사용합니다. 필요할 때만 `--chrome`을 사용하는 것이 효율적입니다.

---

## 실제 사용 예시

### 로컬 웹 앱 테스트

```
방금 로그인 폼 유효성 검사를 업데이트했어.
localhost:3000을 열고 잘못된 데이터로 폼을 제출해서
오류 메시지가 제대로 나타나는지 확인해줘
```

### 콘솔 오류 디버깅

```
대시보드 페이지를 열고 페이지 로드 시
콘솔에서 오류를 확인해줘
```

> 콘솔 출력이 많을 수 있으므로 "모든 콘솔 출력"보다 특정 패턴이나 오류 유형을 찾도록 요청하는 것이 효율적입니다.

### 반복적인 폼 입력 자동화

```
contacts.csv에 고객 연락처 목록이 있어.
각 행마다 crm.example.com에서 "연락처 추가"를 클릭하고
이름, 이메일, 전화번호를 입력해줘
```

### Google Docs에 내용 작성하기

```
최근 커밋을 기반으로 프로젝트 업데이트를 작성해서
docs.google.com/document/d/abc123 문서에 추가해줘
```

로그인된 모든 웹 앱에서 작동합니다: Gmail, Notion, Sheets 등.

### 웹 페이지에서 데이터 추출

```
상품 목록 페이지에서 각 상품의 이름, 가격, 재고 여부를
추출해서 CSV 파일로 저장해줘
```

### 데모 GIF 녹화

```
장바구니에 상품 추가부터 구매 확인 페이지까지
결제 흐름을 보여주는 GIF를 녹화해줘
```

---

## 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| 확장이 감지되지 않음 | `chrome://extensions`에서 확장 활성화 확인, Claude Code 버전 확인, Chrome 재시작 후 `/chrome`으로 재연결 |
| 브라우저가 응답 없음 | 자바스크립트 경고창이 뜬 것은 아닌지 확인 (수동으로 닫기), Claude에게 새 탭 열기 요청 |
| 장시간 세션 중 연결 끊김 | `/chrome` → "확장 재연결" 선택 |
| Windows에서 파이프 충돌 | Claude Code 재시작, 다른 Claude Code 세션 종료 |

### Chrome 확장 감지 실패 시 파일 위치 확인

**Chrome:**
- macOS: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.anthropic.claude_code_browser_extension.json`
- Windows: 레지스트리 `HKCU\Software\Google\Chrome\NativeMessagingHosts\`

**Edge:**
- macOS: `~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/com.anthropic.claude_code_browser_extension.json`
- Windows: 레지스트리 `HKCU\Software\Microsoft\Edge\NativeMessagingHosts\`

### 자주 발생하는 오류 메시지

| 오류 메시지 | 원인 | 해결 방법 |
|-------------|------|-----------|
| "Browser extension is not connected" | 네이티브 메시지 호스트가 확장에 연결 불가 | Chrome과 Claude Code 재시작 후 `/chrome`으로 재연결 |
| "Extension not detected" | 확장이 설치되지 않았거나 비활성화됨 | `chrome://extensions`에서 설치 또는 활성화 |
| "No tab available" | 탭이 준비되기 전에 작업 시도 | Claude에게 새 탭 열기 요청 후 재시도 |
| "Receiving end does not exist" | 확장 서비스 워커가 유휴 상태 | `/chrome` → "확장 재연결" 선택 |

---

## 보안 및 개인정보

- Claude는 작업을 위해 새 탭을 엽니다.
- 브라우저의 로그인 상태를 공유하므로 이미 로그인된 사이트에 접근 가능합니다.
- CAPTCHA나 로그인 페이지를 만나면 멈추고 수동으로 처리하도록 안내합니다.
- 사이트별 권한은 Chrome 확장 설정에서 관리합니다.
