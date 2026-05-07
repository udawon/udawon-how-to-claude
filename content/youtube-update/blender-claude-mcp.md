---
date: "2026-05-07"
title: "Blender + Claude AI MCP 연동 — 자연어로 3D 모델 만들기"
description: "Claude Desktop의 Connectors와 Blender MCP 애드온을 연결해 영어 한 줄 프롬프트만으로 3D 머그컵·커피·조명·텍스처를 자동 생성하는 비개발자 워크플로우"
order: 62
tags: ["설정", "연동", "활용법", "워크플로우", "youtube"]
source_url: "https://youtube.com/watch?v=zoTlIOYALmY"
---

## 이게 뭔가요?

Blender(블렌더)는 무료 3D 모델링 프로그램입니다. 평소에는 마우스로 큐브를 끌어다 놓고, 메뉴를 수십 번 클릭해서 머그컵 하나를 만드는 데 30분이 걸립니다.

이 영상은 그 작업을 **"create a cup with coffee inside in Blender"** 같은 영어 한 줄로 끝내는 방법을 보여줍니다. Claude(클로드, Anthropic의 AI)에게 명령을 내리면 Claude가 알아서 Python(파이썬, 프로그래밍 언어) 코드를 작성하고, 그 코드가 Blender 안에서 실시간으로 실행되어 컵·커피·조명·텍스처·받침 접시까지 자동으로 만들어집니다.

비유하면 이렇습니다.

> **기존 방식** = 도자기 가게에서 점토를 직접 빚는 도공.
> **MCP 연동 방식** = "커피잔 하나, 받침은 하얀색으로" 한마디 하면 옆 직원이 알아서 만들어 가져다주는 비서.

여기서 핵심은 **MCP(Model Context Protocol)**입니다. MCP는 AI에게 외부 프로그램(Blender, 노션, 슬랙 등)과 직접 대화할 수 있는 통로를 열어주는 표준 규격입니다. 한국어로 풀면 "AI용 만능 USB 단자"라고 생각해도 됩니다.

## 왜 알아야 하나요?

3D 작업을 한 번이라도 해본 사람은 알 겁니다. 큐브 하나 만드는 것부터 텍스처 입히기, 조명 세팅까지 단계가 너무 많습니다.

이 워크플로우를 알면:

- **3D 디자이너**: 단순 반복 작업(컵, 의자, 책상 같은 일상 소품)을 영어 한 줄로 끝내고 본인은 디테일에만 집중할 수 있습니다.
- **영상 제작자**: 빠르게 배경 소품을 만들어 시각적 완성도를 높일 수 있습니다.
- **취미 모델러**: Python을 모르고도 Blender의 잠재력 80%를 끌어 쓸 수 있습니다.

3D 모델링을 한 번도 안 해본 비개발자라도, 이 글을 읽으면 "AI가 디자인 도구를 직접 조작한다"는 새로운 흐름이 어떤 의미인지 감이 잡힙니다.

## 어떻게 하나요?

준비물은 두 가지입니다.

1. **Claude Desktop**(Claude의 데스크톱 앱)
2. **Blender**(2.8 이상 버전)

### 1단계: Claude Desktop에 Blender Connector 등록

1. 웹 브라우저에서 `claude.ai` 접속 → 로그인
2. **Customize**(맞춤 설정) 메뉴 클릭
3. **Connectors**(커넥터, 외부 프로그램 연결 기능) 메뉴 클릭
4. **Browse connectors**(커넥터 둘러보기) → 검색창에 **blender** 입력
5. Blender 항목 클릭 → 안내 따라 Claude Desktop 앱 다운로드 (Windows/macOS 둘 다 있음)
6. 설치 후 이메일로 로그인하면 시스템 트레이(Windows) 또는 메뉴 바(macOS)에 Claude 아이콘이 뜸
7. Claude Desktop 호출 단축키:
   - **Windows**: `Ctrl + Alt + Spacebar`
   - **macOS**: 메뉴 바 아이콘 직접 클릭 (영상에서 확인된 macOS 단축키 정보 없음)

### 2단계: Blender에 MCP 애드온 설치

1. Blender 실행 → 상단 메뉴 **Edit → Preferences → Add-ons**
   - macOS는 **Blender → Preferences → Add-ons**
2. 검색창에 **MCP** 입력
3. 항목이 보이면 체크박스 활성화 → 끝

### 3단계: Blender ↔ Claude 연결

1. Blender 메인 화면에서 키보드 **N** 키 누르기 → 우측에 패널이 열림
2. 패널 탭 중 **Blender MCP** 클릭
3. **Connect to MCP server**(MCP 서버에 연결) 버튼 클릭
4. "Connected" 표시가 뜨면 준비 완료

<div class="example-case">
<strong>예시: 첫 명령 던져보기</strong>

1. Claude Desktop 실행 → 새 채팅 시작
2. 입력: `create a cup with coffee inside in Blender` (영어로 입력해야 안정적)
3. Enter
4. Claude가 권한 요청 팝업을 띄움 → **Allow all**(모두 허용) 클릭
5. Claude가 Python 코드를 자동 작성
6. Blender 뷰포트(작업 화면)를 보면 빈 화면에서 머그컵·커피액·받침 접시·조명이 실시간으로 생성됨

영상에서는 약 1~2분 안에 완성되고, 렌더 뷰(완성본 미리보기)로 전환하면 텍스처·재질·조명까지 적용된 결과가 나옵니다.
</div>

### 안 보일 때의 비상 해결법

Blender MCP 탭이 안 보이면 GitHub에서 직접 받아서 설치합니다.

1. Google에서 **blendermcp GitHub** 검색
2. 첫 번째 결과(공식 저장소) 열기
3. 스크롤해서 `addon.py` 파일 찾기 → 다운로드
4. Blender → Edit → Preferences → Add-ons → 우측 상단 작은 ▼ 아이콘 클릭
5. **Install from disk**(디스크에서 설치) 선택 → 다운로드한 `addon.py` 선택
6. **Install** → 다시 활성화 체크

이제 100% Blender MCP 탭이 나타납니다.

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 제품 홍보 영상용 소품 만들기</strong>

상황: 1인 유튜버가 커피 브랜드 리뷰 영상을 찍는데, 인트로에 회전하는 머그컵 3D 컷이 필요함.

기존 방식:
- Blender로 머그컵 모델링 (15분)
- 텍스처 입히기 (10분)
- 조명 세팅 (10분)
- 총 35분 + 시행착오

MCP 워크플로우:
1. Claude에게: `create a cup with coffee inside in Blender, white ceramic, top-down lighting`
2. 1~2분 안에 1차 결과
3. 마음에 안 드는 부분만 수동 보정 (예: 손잡이 두께)
4. 총 5~10분

영상에서 발표자도 강조하듯, **결과물에 약간의 결함**(텍스처 위치 어긋남, 컵 두께 등)이 있을 수 있어 수동 보정은 여전히 필요합니다. 하지만 0에서 시작하는 게 아니라 80% 완성된 결과에서 시작한다는 점이 핵심입니다.
</div>

<div class="example-case">
<strong>실전 케이스: 3D 학습자가 Python 코드를 배우는 보조 도구로 활용</strong>

상황: Blender Python(BPY 라이브러리)을 배우고 싶지만 어디서 시작할지 모름.

활용:
1. Claude에게 "create a simple chair in Blender" 입력
2. Blender 뷰포트에서 의자가 만들어지는 동안 Claude가 작성한 Python 코드를 읽음
3. 어떤 함수로 큐브를 만들고, 어떻게 회전·이동시키는지 실제 작동 코드로 학습
4. 이해 안 가는 줄에 대해 Claude에게 다시 질문

사용자에게 이중 효과: **결과물 + 학습 자료**를 동시에 얻습니다.
</div>

## 주의할 점

- **결과물에 결함이 있을 수 있음**: 텍스처 위치, 비율, 일부 부속품(예: 받침 접시처럼 요청하지 않은 것)이 추가될 수 있음. 1차 생성 후 수동 보정 단계는 필수.
- **권한 팝업에서 반드시 Allow all**: 한 번이라도 거절하면 Claude가 Blender에 명령을 못 보냄. 단, 이건 Claude가 Blender 안에서 코드를 실행한다는 뜻이므로 신뢰할 수 있는 명령만 입력.
- **영어 프롬프트가 안정적**: 한국어 프롬프트도 작동하지만, 영상에서 검증된 워크플로우는 모두 영어 기준.
- **Blender 버전**: MCP 애드온은 Blender 2.8 이상에서 동작. 너무 오래된 버전은 업그레이드 필요.
- **파일 저장 습관**: Claude가 자동 생성한 결과는 Blender 작업 파일(.blend)을 직접 덮어쓰진 않지만, 작업 전 항상 별도 파일로 저장해두는 것을 권장.

## 정리

- Claude Desktop의 Connectors → Blender MCP 애드온 → Blender 패널의 "Connect" 버튼 3단계로 연결.
- 영어 한 줄 프롬프트로 3D 모델·텍스처·조명까지 자동 생성. 1~2분 만에 80% 완성.
- 결과물의 작은 결함은 수동 보정으로 마무리 — AI는 도공이 아니라 1차 작업자.

---

참고 영상: [Create Anything in Blender Using Claude AI (Full MCP Tutorial)](https://youtube.com/watch?v=zoTlIOYALmY)
