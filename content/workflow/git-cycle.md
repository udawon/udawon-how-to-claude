---
title: "Git 사이클 가이드"
description: "커밋, 푸시, 풀의 개념과 실전 개발 사이클"
order: 4
tags: ["워크플로우", "Git", "커밋", "푸시", "풀", "GitHub"]
---

## Git이 뭔가요?

파일의 **타임머신**입니다.

일반적인 파일 관리:
  보고서_최종.docx
  보고서_최종_수정.docx
  보고서_진짜최종.docx
  보고서_진짜최종_v2.docx
  -> 어떤 게 진짜 최신인지 모름. 뭘 바꿨는지도 모름.

Git을 쓰면:
  보고서.docx 하나만 존재
  대신 <span class="keyword-highlight">변경 이력</span>이 자동으로 쌓임:
    3월 1일: 초안 작성
    3월 3일: 서론 수정
    3월 5일: 결론 추가
  -> 언제든 과거 버전으로 <span class="keyword-highlight">돌아갈 수 있음</span>

## 왜 필요한가?

### 1. 되돌리기가 가능해짐

Git 없이:
  Claude가 메인 페이지를 수정했는데 마음에 안 듦
  -> "원래 어떻게 생겼었지?" 기억이 안 남
  -> 복구 불가능

Git 있으면:
  Claude가 수정하기 전에 "<span class="keyword-highlight">저장 포인트</span>"를 만들어 둠
  -> 마음에 안 들면 그 시점으로 <span class="keyword-highlight">되돌리기</span>
  -> 게임의 세이브 포인트와 동일

<div class="example-case">

비유: 게임에서 보스전 전에 세이브하는 것
     죽으면 세이브 포인트에서 다시 시작
</div>

### 2. 뭘 바꿨는지 기록이 남음

Git 없이:
  "어제 뭘 수정했더라?"
  -> 기억에 의존. 파일이 많으면 추적 불가능.

Git 있으면:
  "<span class="keyword-highlight">어제 커밋 내역 보여줘</span>"
  -> 어떤 파일의 어떤 부분을 바꿨는지 전부 기록됨

<div class="example-case">

비유: 병원 진료 기록부
     언제, 어떤 치료를 했는지 전부 기록
     다음 의사도 이전 기록을 보고 이어서 진료
</div>

### 3. 내 컴퓨터가 고장나도 안전

Git + GitHub 없이:
  내 컴퓨터에만 파일이 있음
  -> 컴퓨터 고장 = 프로젝트 소멸

Git + GitHub 있으면:
  내 컴퓨터 + 인터넷 클라우드(GitHub)에 복사본이 있음
  -> 컴퓨터가 고장나도 GitHub에서 다시 받으면 됨

<div class="example-case">

비유: 중요한 서류를 집에만 두는 것 vs
     집 + 은행 금고에 복사본을 보관하는 것
</div>

## 3가지 핵심 동작

| 동작 | 뜻 | 비유 |
|------|-----|------|
| **커밋 (commit)** | "여기까지 저장" 표시 남기기 | 게임 세이브 |
| **푸시 (push)** | 내 저장을 인터넷에 백업 | 세이브 파일을 클라우드에 업로드 |
| **풀 (pull)** | 인터넷의 최신 내용을 내 컴퓨터로 받기 | 클라우드에서 세이브 파일 다운로드 |

### 커밋 (Commit) - 세이브 포인트 만들기

작업 중 "여기까지는 잘 됐다" 싶을 때 <span class="keyword-highlight">커밋</span>

<div class="example-case">

Claude에게: "<span class="keyword-highlight">지금 상태로 커밋해줘</span>"
-> Claude가 변경사항을 정리하고 세이브 포인트를 만듦
-> 메시지 예: "메인 페이지 레이아웃 완성"

비유: RPG 게임에서 마을에 도착할 때마다 세이브

     "1장 클리어", "2장 클리어" 처럼 표시를 남김
</div>

### 푸시 (Push) - 클라우드에 백업

<span class="keyword-highlight">커밋</span>을 했으면 <span class="keyword-highlight">푸시</span>로 인터넷(GitHub)에 올림

<div class="example-case">

Claude에게: "<span class="keyword-highlight">푸시해줘</span>"
-> 내 컴퓨터의 세이브 포인트들이 GitHub에 복사됨

비유: 핸드폰 사진을 클라우드에 백업하는 것
     핸드폰을 잃어버려도 사진은 클라우드에 있음
</div>

### 풀 (Pull) - 최신 내용 받아오기

다른 컴퓨터에서 작업하거나, 팀원이 수정한 게 있을 때

<div class="example-case">

Claude에게: "<span class="keyword-highlight">풀 해줘</span>"
-> GitHub에 있는 최신 내용을 내 컴퓨터로 가져옴

비유: 구글 드라이브에서 최신 파일을 다운로드하는 것
     다른 사람이 수정한 내용도 반영됨
</div>

## 실전 개발 사이클

### 매일 작업할 때의 루틴

[출근] <span class="keyword-highlight">풀 (Pull)</span>
  -> 최신 상태로 맞추기
  -> "혹시 다른 데서 작업한 게 있으면 받아오기"

[작업] 기능 하나 완성할 때마다 <span class="keyword-highlight">커밋 (Commit)</span>
  -> "로그인 화면 완성" 커밋
  -> "회원가입 화면 완성" 커밋
  -> 작은 세이브 포인트를 자주 만들기

[퇴근] <span class="keyword-highlight">푸시 (Push)</span>
  -> 오늘 한 작업을 클라우드에 백업
  -> 내일 다른 컴퓨터에서도 이어서 가능

<div class="example-case">

비유: 회사원의 하루
     출근 -> 메일 확인 (풀)
     업무 -> 보고서 중간 저장 (커밋)
     퇴근 -> 최종 파일 공유 폴더에 올리기 (푸시)
</div>

### Claude Code와 함께하는 사이클

아래는 모두 Claude Code 대화창에서 자연어로 입력합니다.
(터미널에서 `claude` 를 실행한 후 나오는 화면)

1. <span class="keyword-highlight">세션 시작</span>
   "<span class="keyword-highlight">현재 git 상태 확인해줘</span>"
   -> Claude가 마지막 작업 이후 변경사항을 알려줌

2. 작업 진행
   "<span class="keyword-highlight">메인 페이지 헤더를 만들어줘</span>"
   -> Claude가 구현

3. 중간 저장 (<span class="keyword-highlight">커밋</span>) - 두 가지 방법
   방법A: "<span class="keyword-highlight">지금까지 한 거 커밋해줘</span>" (자연어로)
   방법B: `/commit` (슬래시 명령어로)
   -> Claude: "메인 페이지 헤더 구현" 이라는 메시지로 커밋

4. 다음 작업
   "<span class="keyword-highlight">이번엔 푸터를 만들어줘</span>"
   -> Claude가 구현

5. 또 저장 (<span class="keyword-highlight">커밋</span>)
   "<span class="keyword-highlight">커밋해줘</span>"
   -> Claude: "메인 페이지 푸터 구현" 이라는 메시지로 커밋

6. <span class="keyword-highlight">세션</span> 종료 전 (<span class="keyword-highlight">푸시</span>)
   "<span class="keyword-highlight">푸시해줘</span>"
   -> 오늘 한 커밋들이 전부 GitHub에 올라감

### 커밋은 얼마나 자주?

<div class="example-case">

(X) 너무 드물게:
  5시간 동안 10개 기능을 만들고 한 번에 <span class="keyword-highlight">커밋</span>
  -> 중간에 문제 생기면 5시간치 전부 날아감
  -> 비유: 논문 30페이지를 한 번도 저장 안 하고 쓰는 것

(X) 너무 자주:
  줄 하나 바꿀 때마다 <span class="keyword-highlight">커밋</span>
  -> 세이브 포인트가 너무 많아서 의미가 없음
  -> 비유: 글자 하나 쓸 때마다 <kbd>Ctrl+S</kbd> 누르는 것

(O) 적당히 - "의미 있는 단위"로:
  기능 하나 완성 -> <span class="keyword-highlight">커밋</span>
  버그 하나 수정 -> <span class="keyword-highlight">커밋</span>
  디자인 한 섹션 완성 -> <span class="keyword-highlight">커밋</span>
  -> 비유: 책의 한 챕터를 완성할 때마다 저장
</div>

## 처음 시작하기: GitHub 연결

[1단계] GitHub 계정 만들기
  1. 브라우저에서 github.com 접속
  2. "Sign up" 클릭
  3. 이메일, 비밀번호 입력하여 회원가입 (무료)
  비유: 클라우드 저장소 가입

[2단계] 새 저장소(Repository) 만들기
  1. GitHub에 로그인한 상태에서 오른쪽 상단 "+" 클릭
  2. "New repository" 선택
  3. Repository name에 이름 입력 (예: my-portfolio)
  4. "Create repository" 클릭
  5. 나오는 화면의 URL을 복사해둔다
     (예: `https://github.com/내아이디/my-portfolio.git`)
  비유: 클라우드에 새 폴더 만들기

[3단계] Claude Code에서 연결

```bash
cd my-portfolio    # 일반 터미널에서 프로젝트 폴더로 이동
claude             # Claude Code 실행
```

Claude Code 대화창에서:
"이 프로젝트를 <span class="keyword-highlight">GitHub에 연결해줘</span>.
 저장소 주소는 `https://github.com/내아이디/my-portfolio.git` 이야."
-> Claude가 `git init`, `remote add` 등을 자동으로 설정

이후부터는 Claude Code 대화창에서 <span class="keyword-highlight">커밋</span>/<span class="keyword-highlight">푸시</span>/<span class="keyword-highlight">풀</span>만 하면 됨

## 핵심 요약

<span class="keyword-highlight">커밋</span> = 세이브      (게임 저장)
<span class="keyword-highlight">푸시</span> = 백업        (클라우드 업로드)
<span class="keyword-highlight">풀</span>   = 동기화      (최신 버전 다운로드)

사이클: <span class="keyword-highlight">풀</span> -> 작업 -> <span class="keyword-highlight">커밋</span> -> 작업 -> <span class="keyword-highlight">커밋</span> -> <span class="keyword-highlight">푸시</span>
       (시작)              (중간중간)           (마무리)
