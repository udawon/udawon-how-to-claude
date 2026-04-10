---
title: "내장 도구 목록"
description: "Claude Code가 제공하는 핵심 도구들과 사용법"
order: 1
tags: ["도구", "기본"]
---

Claude Code는 내부적으로 여러 도구를 자동으로 사용합니다.
사용자가 직접 도구를 선택할 필요는 없지만, 어떤 도구가 있는지 알면 동작을 이해하기 쉽습니다.

대부분의 도구는 사용자가 직접 호출하는 게 아닙니다.
Claude Code 대화창에서 자연어로 요청하면
Claude가 알아서 적절한 도구를 골라 사용합니다.

> 예외: AskUserQuestion은 사용자가 "물어봐줘"라고 **명시적으로 요청**해야 사용됩니다.

예: "<span class="keyword-highlight">메인 페이지 파일을 읽어봐</span>" 라고 말하면
→ Claude가 내부적으로 Read 도구를 사용
→ 사용자는 도구 이름을 몰라도 됨

<div class="example-case">

비유: 식당에서 "파스타 주세요"라고 하면
주방에서 냄비, 프라이팬, 오븐 중 뭘 쓸지는 셰프가 결정
손님은 도구를 몰라도 됨
</div>

## 파일 관련 도구

### Read - 파일 읽기
프로젝트 안의 파일 내용을 열어봅니다. 이미지, PDF도 볼 수 있습니다.

**한국어로 말하면:** <span class="keyword-highlight">읽어줘</span> · <span class="keyword-highlight">읽어봐</span> · <span class="keyword-highlight">열어봐</span> · <span class="keyword-highlight">보여줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">메인 페이지 파일을 읽어봐</span>"
→ Claude가 해당 파일을 열어서 내용을 보여줌

"<span class="keyword-highlight">이 스크린샷 봐봐</span>" (이미지 파일 경로와 함께)
→ Claude가 이미지를 직접 보고 내용을 설명해줌

비유: 서류함에서 특정 서류를 꺼내서 보는 것.
     사진이나 PDF도 꺼내서 볼 수 있음.
</div>

### Write - 새 파일 만들기
프로젝트에 새 파일을 생성합니다.

**한국어로 말하면:** <span class="keyword-highlight">만들어줘</span> · <span class="keyword-highlight">새로 만들어줘</span> · <span class="keyword-highlight">생성해줘</span> · <span class="keyword-highlight">작성해줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">회사 소개 페이지를 새로 만들어줘</span>"

→ Claude가 새 파일을 생성하고 내용을 채움

비유: 빈 종이에 새 문서를 작성하는 것
</div>

### Edit - 기존 파일 수정하기
이미 있는 파일에서 특정 부분만 바꿉니다.

**한국어로 말하면:** <span class="keyword-highlight">수정해줘</span> · <span class="keyword-highlight">바꿔줘</span> · <span class="keyword-highlight">고쳐줘</span> · <span class="keyword-highlight">변경해줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">메인 페이지의 제목을 '안녕하세요'에서 '환영합니다'로 바꿔줘</span>"

→ Claude가 해당 부분만 정확히 교체

비유: 문서에서 특정 단어만 지우개로 지우고 다시 쓰는 것
전체를 다시 쓰지 않아서 효율적
</div>

### Glob - 파일 이름으로 찾기
프로젝트 안에서 특정 이름 패턴의 파일을 검색합니다.

**한국어로 말하면:** <span class="keyword-highlight">어디 있어?</span> · <span class="keyword-highlight">파일 찾아줘</span> · <span class="keyword-highlight">목록 보여줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">이 프로젝트에서 이미지 파일이 어디에 있는지 찾아줘</span>"
→ Claude가 프로젝트 전체를 훑어서 이미지 파일 위치를 알려줌

"<span class="keyword-highlight">설정 파일이 어디 있어?</span>"
→ 파일 이름에 "config"나 "settings" 등이 들어간 파일을 찾아줌

비유: 서류함 전체에서 "사진"이라고 적힌 폴더를 찾는 것.
     파일 이름을 기준으로 찾는 도구 (내용이 아닌 이름)
</div>

### Grep - 파일 내용으로 찾기
파일들 안에서 특정 단어나 문장이 들어있는 파일을 검색합니다.

**한국어로 말하면:** <span class="keyword-highlight">~라는 단어 찾아줘</span> · <span class="keyword-highlight">어디서 쓰이고 있어?</span> · <span class="keyword-highlight">~가 있는 파일 찾아줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">'결제'라는 단어가 들어있는 파일을 모두 찾아줘</span>"
→ Claude가 모든 파일을 뒤져서 '결제'가 포함된 파일과 위치를 알려줌

"<span class="keyword-highlight">이 함수가 어디서 쓰이고 있어?</span>"
→ 해당 함수 이름이 등장하는 모든 파일을 찾아줌

비유: 서류함의 모든 서류를 넘기면서 '결제'라는 단어가 적힌 페이지를 찾는 것.
     Glob이 파일 **이름**으로 찾는 거라면, Grep은 파일 **내용**으로 찾는 것.
</div>

## 실행 도구

### Bash - 명령어 실행
프로그램 설치, 서버 실행, 테스트, Git 관련 작업 등 컴퓨터에 직접 명령을 내립니다.
파일을 읽거나 수정하는 작업 외에 **시스템에서 무언가를 실행**해야 할 때 사용됩니다.

**한국어로 말하면:** <span class="keyword-highlight">설치해줘</span> · <span class="keyword-highlight">실행해줘</span> · <span class="keyword-highlight">빌드해줘</span> · <span class="keyword-highlight">서버 켜줘</span> · <span class="keyword-highlight">테스트해줘</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">필요한 프로그램들을 설치해줘</span>"
→ Claude가 `npm install` 같은 설치 명령을 실행

"<span class="keyword-highlight">개발 서버를 실행해줘</span>"
→ Claude가 서버를 켜서 브라우저에서 확인할 수 있게 해줌

"<span class="keyword-highlight">이 코드가 제대로 동작하는지 테스트해줘</span>"
→ Claude가 테스트 명령을 실행하고 결과를 알려줌

비유: 컴퓨터에 일을 시키는 것.
파일을 보거나 고치는 건 다른 도구가 하고,
Bash는 "실행 버튼을 누르는" 역할
</div>

## 소통 도구

### AskUserQuestion - 사용자에게 질문하기
Claude가 작업 전에 필요한 정보를 사용자에게 물어봅니다.

**중요:** 이 도구는 **사용자가 "물어봐줘"라고 명시적으로 요청해야** 사용됩니다. 그냥 "만들어줘"라고 하면 Claude가 알아서 물어보지 않고 바로 만들기 시작합니다.

**한국어로 말하면:** <span class="keyword-highlight">인터뷰해줘</span> · <span class="keyword-highlight">먼저 물어봐줘</span> · <span class="keyword-highlight">AskUserQuestion 도구로 질문해줘</span>

**예시 케이스:**

<div class="example-case">

(X) "<span class="keyword-highlight">홈페이지 만들어줘</span>"
→ Claude가 바로 만들기 시작함 (물어보지 않음)

(O) "홈페이지를 만들 건데, <span class="keyword-highlight">AskUserQuestion 도구를 써서 나를 인터뷰해줘</span>.
     어떤 홈페이지인지 상세하게 물어봐."
→ Claude: "어떤 종류의 홈페이지인가요? 회사 소개? 쇼핑몰? 블로그?"
→ Claude: "주요 기능은 뭐가 필요한가요?"
→ Claude: "디자인 스타일은 어떤 느낌을 원하나요?"
→ 충분히 파악한 후에 구현 시작

비유: 인테리어 업체에게
(X) "거실 꾸며주세요" → 업체가 마음대로 시작
(O) "거실 꾸밀 건데, <span class="keyword-highlight">먼저 뭐가 필요한지 물어봐주세요</span>" → 취향/예산/스타일을 물어본 후 시작
</div>

## 위임 도구

### Agent - 별도 도우미에게 맡기기
Claude가 혼자 처리하기엔 범위가 넓을 때, **별도의 도우미**를 불러서 조사나 탐색을 맡깁니다.
도우미가 작업하는 동안 Claude는 다른 일을 할 수 있어서 효율적입니다.

**한국어로 말하면:** <span class="keyword-highlight">파악해줘</span> · <span class="keyword-highlight">분석해줘</span> · <span class="keyword-highlight">조사해줘</span> · <span class="keyword-highlight">정리해줘</span> (범위가 넓은 복잡한 작업)

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">이 프로젝트의 전체 구조를 파악하고 정리해줘</span>"

→ Claude가 탐색 전문 도우미를 불러서 프로젝트 전체를 조사하게 함
→ 도우미가 폴더 구조, 파일 목록, 코드 패턴 등을 살펴봄
→ 조사가 끝나면 결과 요약만 Claude에게 보고

비유: 팀장이 직접 서류를 다 뒤지지 않고,
     인턴에게 "이 서류함 전체를 정리해서 보고해"라고 시키는 것.
     인턴이 보고하면 팀장이 결과를 정리해서 알려줌.
</div>

## 인터넷 도구

### WebSearch - 웹 검색
Claude의 학습 데이터에 없는 최신 정보나 공식 문서를 실시간으로 검색합니다.

**한국어로 말하면:** <span class="keyword-highlight">검색해줘</span> · <span class="keyword-highlight">최신 정보 알려줘</span> · <span class="keyword-highlight">알아봐줘</span> · <span class="keyword-highlight">찾아봐</span>

**예시 케이스:**

<div class="example-case">

"<span class="keyword-highlight">Next.js 16의 새로운 기능이 뭐야?</span>"
→ 웹을 검색해서 최신 공식 문서 기반으로 답변

"<span class="keyword-highlight">이 에러 메시지 해결 방법 찾아봐</span>"
→ 에러 메시지로 웹 검색해서 해결책을 찾아줌

Claude의 학습 데이터에는 시점 제한이 있습니다.
기억에만 의존하면 구버전 정보를 말할 수 있어서,
최신 정보가 필요할 때 이 도구가 사용됩니다.

비유: 오래된 교과서로 공부하는 것 vs. 최신 뉴스를 직접 검색하는 것
</div>

### WebFetch - 특정 URL 내용 가져오기
특정 웹페이지나 공식 문서의 내용을 직접 읽어와서 분석합니다.

**한국어로 말하면:** URL과 함께 <span class="keyword-highlight">읽어줘</span> · <span class="keyword-highlight">분석해줘</span> · <span class="keyword-highlight">요약해줘</span>

**예시 케이스:**

<div class="example-case">

"https://docs.example.com/api 를 <span class="keyword-highlight">읽고 이 API 사용법을 알려줘</span>"
→ 해당 페이지 내용을 가져와서 요약하고 설명

비유: "이 책 사이트에 가서 목차를 읽어와줘"라고 심부름을 시키는 것
</div>

## 작업 관리 도구

### TodoWrite - 작업 목록 관리
Claude가 여러 단계의 작업을 처리할 때 할 일 목록을 만들고 추적합니다.
긴 작업에서 어디까지 했는지 놓치지 않습니다.

이 도구는 **요청하면 사용하기도 하고**, 작업이 복잡할 때 **Claude가 알아서 사용하기도** 합니다.

**한국어로 말하면:** <span class="keyword-highlight">단계별로 해줘</span> · <span class="keyword-highlight">목록 만들고 진행해줘</span> · <span class="keyword-highlight">하나씩 체크하면서 해줘</span>

**예시 케이스:**

<div class="example-case">

사용자가 요청한 경우:
"<span class="keyword-highlight">이번 작업에서 뭘 해야 하는지 할 일 목록을 먼저 만들고,
하나씩 체크하면서 진행해줘</span>"
→ Claude가 작업 목록을 만들고 완료할 때마다 체크

Claude가 자동으로 사용하는 경우:
"10개 페이지를 전부 수정해줘" 같은 복잡한 작업을 시키면
→ Claude가 스스로 할 일 목록을 만들어서 하나씩 처리
→ 화면 왼쪽에 체크리스트가 표시됨

비유: 이삿짐 작업에서 체크리스트를 만들고
하나씩 완료할 때마다 체크하는 것.
항목이 적으면 머릿속으로 하고, 많으면 종이에 적는 것처럼
Claude도 작업이 많으면 자동으로 목록을 만듦.
</div>
