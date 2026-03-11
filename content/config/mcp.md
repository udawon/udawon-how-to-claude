---
title: "MCP (Model Context Protocol) 가이드"
description: "외부 서비스를 Claude Code에 연결하는 MCP의 개념, 설치, 활용법"
order: 4
tags: ["설정", "MCP", "외부연결", "도구", "API"]
---

## MCP란?

Claude Code에게 **외부 도구를 연결해주는 어댑터**입니다.

<div class="example-case">

비유: 스마트폰의 블루투스
블루투스를 켜면 이어폰, 스피커, 키보드 등
다양한 기기를 연결해서 쓸 수 있음

<span class="keyword-highlight">MCP</span>를 설정하면 데이터베이스, GitHub, Slack 등
다양한 외부 서비스를 Claude Code에 연결해서 쓸 수 있음
</div>

정리:
<span class="keyword-highlight">MCP</span> = Claude Code가 바깥 세계와 소통하는 통로
MCP 서버 = 바깥 세계의 특정 서비스 (GitHub, DB 등)

## 왜 필요한가?

<span class="keyword-highlight">MCP</span> 없이:
Claude Code는 내 컴퓨터 안에서만 일할 수 있음
→ 파일 읽기, 코드 수정, 터미널 명령 정도만 가능
→ "GitHub에서 PR 만들어줘" 같은 건 직접 못 함

<span class="keyword-highlight">MCP</span> 있으면:
Claude Code가 외부 서비스까지 직접 조작 가능

<div class="example-case">

"<span class="keyword-highlight">JIRA 이슈 보고 기능 구현하고 GitHub에 PR까지 만들어줘</span>"
"<span class="keyword-highlight">데이터베이스에서 이번 달 매출 조회해줘</span>"
"<span class="keyword-highlight">Slack에 팀원에게 메시지 보내줘</span>"

비유: 만능 리모컨
TV 리모컨으로는 TV만 조작 가능 (MCP 없음)
만능 리모컨이면 TV, 에어컨, 보일러 전부 조작 가능 (MCP 있음)
</div>

## MCP로 할 수 있는 것들

| 분류 | 예시 |
|------|------|
| 이슈 추적기 연동 | JIRA 이슈 내용 읽고 → 코드 작성 → GitHub PR 생성 |
| 모니터링 분석 | Sentry에서 최근 24시간 에러 확인 |
| 데이터베이스 쿼리 | DB에 직접 쿼리 실행해서 결과 조회 |
| 디자인 통합 | Figma 디자인 보고 코드에 반영 |
| 워크플로우 자동화 | Gmail에서 자동으로 이메일 초안 생성 |

<div class="example-case">

비유: 비서에게 "<span class="keyword-highlight">이거 해줘</span>"라고 하면
비서가 직접 여러 부서를 돌아다니며 처리하는 것
비서(Claude)가 돌아다닐 수 있는 통로 = <span class="keyword-highlight">MCP</span>
</div>

## 입력하는 곳 구분 (중요!)

MCP 설정에서는 두 곳에서 입력하는 것이 섞여 있습니다.

| 입력 위치 | 언제 사용 | 비유 |
|----------|----------|------|
| **일반 터미널** | `claude mcp add ...` 서버 설치/제거 | 건물 관리실 (장비 설치) |
| **Claude Code 대화창** | `/mcp` 상태 확인, 인증 관리 | 사무실 (실제 업무) |

<div class="example-case">

비유: 장비를 설치(터미널)한 다음, 사무실(대화창)에서 사용
에어컨 설치기사가 설치(터미널) → 리모컨으로 조작(대화창)
</div>

## MCP 서버 설치 방법

3가지 방법이 있습니다. **모두 일반 터미널에서 입력합니다.**

### 1. 원격 HTTP 서버 (가장 권장)

클라우드에 있는 서비스에 바로 연결하는 방식입니다.

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">Notion을 Claude Code에 연결하고 싶어</span>"

→ 터미널(명령 프롬프트)을 연다
→ 위 명령어를 복사해서 붙여넣고 <kbd>Enter</kbd>
→ "Added notion" 메시지가 나오면 성공
→ 다음에 Claude Code를 실행하면 Notion이 연결되어 있음

비유: 인터넷으로 은행 앱에 접속하는 것
내 컴퓨터에 뭔가 설치할 필요 없이 바로 연결
</div>

### 2. 원격 SSE 서버 (구버전)

HTTP와 비슷하지만 오래된 방식입니다. 가능하면 HTTP 사용을 권장합니다.

```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

<div class="example-case">

비유: 구형 충전기 — 작동은 하지만 새 규격(HTTP)이 더 좋음
</div>

### 3. 로컬 stdio 서버

내 컴퓨터에서 직접 실행하는 서버입니다.

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@localhost:5432/mydb"
```

<div class="example-case">

비유: 컴퓨터에 프로그램을 설치해서 쓰는 것
인터넷 없이도 작동
</div>

### Windows 사용자 주의사항

Windows에서 `npx`를 쓰는 로컬 서버는 `cmd /c`를 앞에 붙여야 합니다.

```bash
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

`cmd /c` 없으면 "Connection closed" 에러가 발생합니다.

<div class="example-case">

비유: Windows라는 집에서는 '통역사(`cmd /c`)'가 필요한 것
</div>

## MCP 서버 관리

### 터미널에서 (설치/제거)

```bash
claude mcp list              # 설치된 서버 목록 보기
claude mcp get github        # 특정 서버 정보 보기
claude mcp remove github     # 서버 제거
```

### Claude Code 대화창에서 (상태/인증)

```bash
/mcp                         # 연결 상태 확인, 인증 관리
```

<div class="example-case">

비유: 블루투스 설정 화면
연결된 기기 목록 보기, 정보 확인, 연결 해제
</div>

## 설치 범위 (어디에 저장하나)

| 범위 | 적용 대상 | 비유 |
|------|----------|------|
| **로컬** (기본) | 이 프로젝트, 나만 | 내 방 책상 위 메모 |
| **프로젝트** | 이 프로젝트, 모든 팀원 | 팀 공용 게시판 안내문 |
| **사용자** | 내 모든 프로젝트 | 지갑에 넣고 다니는 만능카드 |

```bash
claude mcp add --scope local ...    # 기본값, 생략 가능
claude mcp add --scope project ...  # 팀 공유
claude mcp add --scope user ...     # 모든 프로젝트
```

<div class="example-case">

언제 뭘 쓸까:
개인 실험용 → <span class="keyword-highlight">로컬</span>
팀 공유 도구 → <span class="keyword-highlight">프로젝트</span>
항상 쓰는 도구 → <span class="keyword-highlight">사용자</span>
</div>

---

## 실제 활용 예시

### GitHub 연동 (따라하기)

**예시 케이스:**

<div class="example-case">

**[1단계]** 일반 터미널에서 서버 추가:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

→ "Added github" 메시지가 나오면 성공

**[2단계]** Claude Code 실행:

```bash
claude
```

**[3단계]** Claude Code 대화창에서 인증:
→ `/mcp` 입력 → 목록에서 github 선택 → "Authenticate" 선택
→ 브라우저가 자동으로 열림 → GitHub 계정으로 로그인 → 완료

**[4단계]** 이제 자연어로 요청:
"<span class="keyword-highlight">PR #456 리뷰하고 개선점 제안해줘</span>"
"<span class="keyword-highlight">방금 발견한 버그로 이슈 만들어줘</span>"
"<span class="keyword-highlight">나한테 할당된 PR 목록 보여줘</span>"

비유: 새 앱 설치 과정
앱 설치(1단계) → 앱 실행(2단계) → 로그인(3단계) → 사용(4단계)
</div>

### 데이터베이스 연동 (따라하기)

**예시 케이스:**

<div class="example-case">

**[1단계]** 일반 터미널에서 서버 추가:

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@prod.db.com:5432/analytics"
```

→ "Added db" 메시지가 나오면 성공
(user, pass, prod.db.com 등은 실제 DB 정보로 바꿔야 함)

**[2단계]** Claude Code 실행 후 대화창에서 자연어로 질문:
"<span class="keyword-highlight">이번 달 총 매출이 얼마야?</span>"
"<span class="keyword-highlight">orders 테이블 구조 보여줘</span>"
"<span class="keyword-highlight">90일 동안 구매 안 한 고객 찾아줘</span>"

비유: Claude에게 회사 데이터베이스 열람 권한을 주는 것
질문하면 직접 조회해서 답변해줌
</div>

### 에러 모니터링 Sentry 연동 (따라하기)

**예시 케이스:**

<div class="example-case">

**[1단계]** 일반 터미널에서:

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**[2단계]** Claude Code 실행 후 인증:
→ `/mcp` 입력 → sentry 선택 → "Authenticate" → 브라우저에서 로그인

**[3단계]** 자연어로 질문:
"<span class="keyword-highlight">최근 24시간 가장 많이 발생한 에러가 뭐야?</span>"
"<span class="keyword-highlight">에러 ID abc123의 스택 트레이스 보여줘</span>"
"<span class="keyword-highlight">어떤 배포에서 이 에러가 시작됐어?</span>"
</div>

---

## 보안과 인증

### OAuth 인증

많은 클라우드 서비스는 로그인이 필요합니다.

**따라하기:**

<div class="example-case">

→ 일반 터미널에서 MCP 서버 추가 (`claude mcp add ...`)
→ Claude Code 실행 (`claude` 입력)
→ Claude Code 대화창에서 `/mcp` 입력
→ 인증이 필요한 서버 선택 → "Authenticate" 선택
→ 브라우저가 자동으로 열림 → 해당 서비스에 로그인
→ 로그인 완료 후 Claude Code로 돌아오면 연결 완료

비유: 앱에서 "<span class="keyword-highlight">Google로 로그인</span>" 버튼 누르는 것
한 번 로그인하면 이후에는 자동 접속
</div>

### 프로젝트 공유 서버의 승인

팀이 공유한 `.mcp.json`의 서버는 처음 사용할 때 승인 요청이 뜹니다.
→ 동의해야 작동

<div class="example-case">

비유: "이 앱이 연락처에 접근하려고 합니다" 팝업
내가 허용해야만 접근 가능
</div>

### 조직 관리

회사에서 허용된 <span class="keyword-highlight">MCP</span> 서버만 사용하도록 제한할 수 있습니다.
→ 허용 목록 / 거부 목록 설정

<div class="example-case">

비유: 회사 컴퓨터에서 승인된 프로그램만 설치 가능한 것
IT 관리자가 관리
</div>

## 플러그인과의 관계

플러그인 안에 <span class="keyword-highlight">MCP</span> 서버가 포함될 수 있습니다.

플러그인을 설치하면:
→ 안에 들어있는 MCP 서버가 자동으로 시작됨
→ 별도로 `claude mcp add` 할 필요 없음

<div class="example-case">

비유:
MCP 서버를 직접 설치 = 블루투스 기기를 하나씩 수동 페어링
플러그인으로 설치 = 블루투스 기기가 포함된 세트 구매 (자동 연결)
</div>

## MCP vs 플러그인 vs 스킬 비교

| 구분 | 스킬 (Skill) | 플러그인 (Plugin) | MCP 서버 |
|------|-------------|-----------------|----------|
| 정체 | 텍스트 지침 | 기능 묶음 패키지 | 외부 서비스 연결 |
| 역할 | '이렇게 해줘' | '이 도구 세트 써' | '저기 접속해' |
| 비유 | 레시피 카드 | 밀키트 (세트) | 블루투스 연결 |
| 외부 연결 | 불가능 | 가능 (MCP 포함) | 이것이 연결 자체 |
| 설치 | 파일 만들기 | `/plugin install` | `claude mcp add` |

**관계도:**

플러그인 = 스킬 + <span class="keyword-highlight">MCP</span> 서버 + <span class="keyword-highlight">Hooks</span> + 에이전트를 묶은 패키지
MCP 서버 = 플러그인 안에 포함될 수도 있고, 따로 설치할 수도 있음
스킬 = 플러그인 안에 포함될 수도 있고, 따로 만들 수도 있음

<div class="example-case">

비유:
스킬 = 직원에게 주는 업무 매뉴얼
<span class="keyword-highlight">MCP</span> = 직원이 사용할 수 있는 전화/인터넷 회선
플러그인 = 매뉴얼 + 장비 + 회선이 포함된 스타터 키트
</div>

> 출처: [Anthropic 공식 문서 - MCP 가이드](https://code.claude.com/docs/en/mcp)
