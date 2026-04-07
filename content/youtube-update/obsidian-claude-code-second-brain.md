---
date: "2026-04-07"
title: "Obsidian + Claude Code — 두 번째 뇌 만들기"
description: "Obsidian을 GitHub에 연결하고 Claude Code 스킬로 이메일·문서를 자동 정리해 AI가 내 프로젝트 전부를 아는 두 번째 뇌를 구축하는 방법"
order: 42
tags: ["활용법", "워크플로우", "연동", "youtube"]
source_url: "https://youtube.com/watch?v=Y2rpFa43jTo"
---

## 이게 뭔가요?

여러 프로젝트를 동시에 진행하다 보면 "이 클라이언트랑 마지막으로 나눈 대화가 뭐였지?", "계약서가 어디 있었더라?" 같은 상황이 반복됩니다. 관련 메일을 뒤지고, 문서 폴더를 열고, 기억을 더듬는 데 시간이 낭비됩니다.

**Obsidian(옵시디언)**은 마크다운(Markdown, 간단한 텍스트 형식) 파일로 노트를 관리하는 무료 앱입니다. 이 영상에서 소개하는 방법은 Obsidian을 Claude Code와 연결해 **두 번째 뇌(Second Brain)**를 만드는 것입니다. 마치 비서가 내 모든 프로젝트 자료를 읽고 정리해 두었다가, 언제든 질문하면 바로 답해주는 것과 같습니다.

핵심 구조는 이렇습니다:

```
Gmail 이메일 + 로컬 파일
        ↓
  Claude Code 스킬이 자동 수집 · 정리
        ↓
   Obsidian 노트로 저장 (GitHub에 백업)
        ↓
  "이 프로젝트 현재 상태가 뭐야?" → Claude Code가 즉시 답변
```

## 왜 알아야 하나요?

- **프로젝트 컨텍스트 자동 구축**: 클라이언트 이메일, 계약서, 회의록을 Claude Code가 읽고 프로젝트별로 정리해 둠
- **AI가 내 기록을 기억**: 이후 Claude Code에게 질문하면 내 Obsidian 노트를 바탕으로 답변 — 매번 배경 설명할 필요 없음
- **무료 클라우드 백업**: GitHub(깃허브, 코드·문서를 저장하는 무료 온라인 저장소)로 자동 동기화, Obsidian 유료 플랜 불필요

## 어떻게 하나요?

### Step 1: Obsidian을 GitHub에 연결

Obsidian 공식 동기화(Sync)는 유료($4/월)입니다. 하지만 **Obsidian Git 커뮤니티 플러그인**을 사용하면 완전 무료로 GitHub에 자동 백업할 수 있습니다.

**GitHub 저장소 만들기:**
1. GitHub에서 새 저장소(repository) 생성 — 비공개(Private)로 설정
2. GitHub Desktop(깃허브 데스크톱, 마우스로 버전관리하는 GUI 앱) 설치
3. 저장소를 내 컴퓨터에 클론(clone, 복사)

**Obsidian에서 해당 폴더 열기:**
1. Obsidian 실행 → Open folder as vault → 클론한 폴더 선택
2. 이제 Obsidian에서 노트를 작성하면 해당 폴더에 파일이 생성됨

**Obsidian Git 플러그인 설치 (자동 동기화):**
1. Obsidian 설정 → Community plugins → Browse
2. "git" 검색 → **Obsidian Git** 설치 및 활성화
3. 플러그인 옵션에서 설정:
   - **Auto commit and sync after stopping file edits**: 활성화
   - **Interval**: 1분 (파일 편집 중단 후 1분 뒤 자동 커밋)
   - **Pull on startup**: 활성화 (다른 기기 변경사항 자동 반영)

<div class="example-case">
<strong>예시: 자동 동기화 확인</strong>

Obsidian에서 노트를 작성하고 1분 기다리면 GitHub 저장소에 자동으로 커밋이 올라갑니다. GitHub Desktop의 히스토리에서 변경 내역을 확인할 수 있고, 언제든 이전 버전으로 되돌릴 수 있습니다.

</div>

### Step 2: Obsidian CLI 활성화

Claude Code가 Obsidian 노트를 직접 다루려면 CLI(커맨드라인 인터페이스, 터미널에서 명령어로 앱을 제어하는 방식)를 활성화해야 합니다.

1. Obsidian → 설정(Settings) → General(일반)
2. 하단의 **Register CLI** 버튼 클릭 → PATH에 등록

> Obsidian v1.12.4(2026년 2월) 이후 모든 무료 사용자에게 CLI가 개방됐습니다.

### Step 3: Obsidian 스킬 설치

Claude Code가 Obsidian의 마크다운(Markdown, 간단한 서식 텍스트), JSON Canvas(노드 연결 시각화 형식), CLI 명령어를 이해하도록 스킬(Claude Code에 추가하는 기능 모듈)을 설치합니다.

Obsidian 공식 채널이나 커뮤니티에서 제공하는 스킬 설치 명령어를 확인해 실행하면 됩니다. 설치 후 Claude Code가 Obsidian의 노트 구조와 API(응용프로그램 인터페이스, 프로그램끼리 소통하는 방식)를 자동으로 이해합니다.

### Step 4: 프로젝트 온보딩 스킬 만들기

영상 제작자는 `onboard-projects`라는 커스텀 스킬을 직접 제작했습니다. 이 스킬의 역할:

1. **데이터 수집**: Gmail(구글 이메일)의 특정 라벨 이메일 + 로컬 PDF·문서 파일 수집
2. **중복 확인**: 기존 프로젝트면 업데이트, 신규면 폴더 구조 생성
3. **자동 분류**: 정적 파일(계약서·NDA)은 문서 폴더에, 대화 내용은 요약해 대화 로그로
4. **프로필 자동 추출**: 업계, 핵심 키워드, 위키링크 자동 생성
5. **최종 요약**: 타임라인, 주요 이벤트, 현황 정리

생성되는 프로젝트 폴더 구조:

```
프로젝트명/
├── overview.md          # 프로젝트 개요, 범위, 기술 스택
├── conversation-log.md  # 시간순 대화 요약 + 액션 아이템
├── documents/           # 계약서, 제안서 등 원본 파일
└── projects.base        # 전체 프로젝트 현황 대시보드
```

<div class="example-case">
<strong>실전 케이스: 새 클라이언트 프로젝트 온보딩</strong>

```
프로젝트 이름을 입력해주세요: MapB 프로젝트

→ Claude Code가 자동으로:
  - Gmail 라벨에서 관련 이메일 스레드 전체 수집
  - 로컬 폴더의 계약서, 제안서, 브리핑 문서 처리
  - 12월~4월 대화를 시간순으로 요약해 conversation-log.md 생성
  - 프로젝트 현황(Phase 1 완료, Phase 2 진행 중) 자동 정리
```

이후 "이 프로젝트 현재 상태랑 클라이언트에게 보낼 답장 초안 작성해줘"라고 질문하면 Claude Code가 노트를 읽고 즉시 답변합니다.

</div>

### Step 5: Claude Code에게 Obsidian으로 질문하기

모든 설정이 완료되면 Claude Code가 Obsidian 노트를 읽고 질문에 답합니다.

```
"데모 프로젝트 현재 상태가 어때? 지금 해야 할 액션 아이템이 뭐야?"

→ Claude Code 답변:
  Phase 1 완료 (최종 결제 수령됨)
  Phase 2 승인됨
  
  액션 아이템:
  - 클라이언트에게 Phase 2 착수 이메일 발송
  - 다음 주 킥오프 일정 조율
```

## 주의할 점

- **Gmail 연동은 추가 설정 필요**: Google Cloud Console에서 Gmail API(구글 이메일 연동 기능)를 활성화하고 OAuth 2.0 인증 파일을 다운로드해야 합니다. `credentials.json` 파일을 지정된 폴더에 저장하면 스킬이 자동으로 이메일을 가져옵니다
- **Obsidian Sync(유료) 불필요**: Git 플러그인으로 완전 무료 버전관리 및 기기 간 동기화가 가능합니다
- **민감한 정보 주의**: 클라이언트 계약서나 이메일이 GitHub에 올라가므로 저장소를 반드시 **비공개(Private)**로 설정하세요
- **첫 온보딩은 시간이 걸림**: 이메일 수백 통을 처리하는 경우 Claude Code 토큰(AI가 처리하는 정보 단위)을 상당히 사용합니다

## 정리

- Obsidian Git 플러그인으로 노트를 GitHub에 자동 백업하고, Obsidian CLI를 활성화해 Claude Code와 연결한다
- 커스텀 스킬을 만들어 Gmail 이메일과 로컬 파일을 프로젝트별로 자동 수집·정리하면 Claude Code가 내 프로젝트 전체 맥락을 이해하는 두 번째 뇌가 된다
- 이후 Claude Code에게 프로젝트 현황, 답장 초안, 액션 아이템을 물어보면 매번 배경 설명 없이 즉시 정확한 답변을 받을 수 있다

---

> 참고 영상: [Obsidian + Claude Code: The Second Brain Setup That Actually Works](https://youtube.com/watch?v=Y2rpFa43jTo) — Eric Tech (2026-04-06)
