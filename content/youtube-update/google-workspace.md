---
date: "2026-03-12"
title: "Claude Code + Google Workspace 연동하기"
description: "Gmail, Drive, Calendar, Docs를 Claude Code에서 직접 제어하는 방법"
order: 3
tags: ["설정", "연동", "youtube"]
source_url: "https://www.youtube.com/watch?v=WP3VRGdhxHw"
---

## 이게 뭔가요?

Claude Code에 Google Workspace(Gmail, Drive, Calendar, Docs, Sheets)를 연결하면, **브라우저를 열지 않고도** 터미널에서 이메일을 보내고, 문서를 만들고, 일정을 확인할 수 있습니다.

비유하자면:

> 원래: "이메일 확인하려면 크롬 열고, Gmail 들어가고, 메일 찾고..."
> 연동 후: Claude Code에 "오늘 온 중요 메일 정리해줘" 한마디면 끝

## 왜 알아야 하나요?

개발자든 사업가든, 하루에 이런 일을 반복하잖아요:

- 이메일 확인하고 답장
- 문서 만들고 공유
- 일정 확인하고 조율
- 스프레드시트에 데이터 정리

이걸 전부 Claude Code 안에서 **말 한마디로** 처리할 수 있다면?

## 어떻게 하나요?

### 준비물

- Google 계정
- Claude Code 설치
- Google Workspace CLI(키보드로 명령어를 입력하는 화면) 도구 설치

### 1단계: Google Workspace CLI 설치

Google이 공식 오픈소스로 발표한 Workspace CLI를 설치합니다. 이 도구 하나로 Drive, Gmail, Calendar, Docs, Sheets, Slides 등 **Google 생태계 전체**에 접근할 수 있습니다.

```bash
# 터미널에서 직접 설치하거나
# Claude Code에 "Google Workspace CLI 설치해줘"라고 요청하면 알아서 안내해줍니다
```

> 💡 이전에는 MCP(외부 도구 연결 기능) 서버로 Gmail, Calendar 정도만 연동 가능했지만, 새 CLI는 **100개 이상의 내장 레시피**를 제공하며 Drive, Docs, Sheets까지 모두 지원합니다.

#### 새 CLI의 장점

| 항목 | 이전 방식 (MCP) | 새 CLI |
|------|-----------------|--------|
| 접근 범위 | Gmail, Calendar | Drive, Docs, Sheets, Slides 전부 |
| 문서 포맷 | Raw Markdown (서식 깨짐) | 헤더, 이미지, 링크 정상 포맷팅 |
| 내장 레시피 | 없음 | 100개+ |

### 2단계: Google 계정 인증

```bash
# Google 로그인 (브라우저가 열립니다)
google-workspace auth login
```

브라우저에서 Google 계정 로그인 → 권한 허용 → 완료!

### 3단계: 사용하기

이제 Claude Code에서 바로 쓸 수 있습니다.

<div class="example-case">
<strong>💬 예시: 5가지 핵심 활용</strong>

**1. 이메일 확인**
```
"오늘 받은 메일 중에 중요한 것만 정리해줘"
```

**2. 이메일 보내기**
```
"김팀장에게 이번 주 회의 일정 변경 메일 보내줘.
수요일 2시에서 목요일 3시로 바뀌었다고."
```

**3. 일정 확인**
```
"이번 주 내 캘린더 일정 보여줘"
```

**4. 문서 작성**
```
"Google Docs에 프로젝트 기획서 초안 만들어줘"
```

**5. 파일 검색**
```
"Google Drive에서 '계약서' 관련 파일 찾아줘"
```

</div>

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: 아침 업무 자동화</strong>

**상황**: 매일 아침 출근하면 하는 루틴이 있다.
1. 메일 확인
2. 오늘 일정 보기
3. 어제 공유된 문서 확인

**해결**: Claude Code에서 한 번에 처리
```
"오늘 아침 브리핑 해줘:
1. 어제 퇴근 후 온 메일 중 답장이 필요한 것
2. 오늘 미팅 일정
3. 어제 공유된 Google Docs 파일"
```

**결과**: 크롬 열 필요 없이 터미널에서 30초 만에 아침 브리핑 완료!

</div>

<div class="example-case">
<strong>📌 실전 케이스: 회의록 자동 정리</strong>

**상황**: 회의 끝나고 회의록을 Google Docs에 정리해야 한다.

**해결**:
```
"방금 회의 내용 정리해서 Google Docs에 올려줘:
- 참석자: 김팀장, 박대리, 이사원
- 주제: Q2 마케팅 계획
- 결정사항: SNS 광고 예산 20% 증가
- 다음 회의: 3월 20일"
```

Claude Code가 자동으로 Google Docs에 깔끔한 회의록을 생성합니다.

</div>

## 주의할 점

- **처음 인증 시 브라우저 필요**: Google 로그인은 브라우저에서 한 번만 하면 됩니다
- **권한 범위**: 연결 시 어떤 권한을 줄지 선택 가능 (읽기만 / 읽기+쓰기)
- **업무 계정 주의**: 회사 Google Workspace 계정은 관리자가 외부 앱 접근을 막아둔 경우가 있어요

## 정리

- Google Workspace + Claude Code = 브라우저 없이 이메일, 문서, 일정 관리
- 설치 한 번이면 영구 사용
- 코딩 중에 창을 전환할 필요 없이 모든 업무를 터미널에서 해결

> 참고 영상: [Claude Code + Google Workspace = CHEAT CODE](https://www.youtube.com/watch?v=WP3VRGdhxHw) — (영상 채널)
