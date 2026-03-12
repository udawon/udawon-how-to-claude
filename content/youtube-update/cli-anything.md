---
title: "CLI-Anything: 아무 프로그램이든 Claude Code로 조종하기"
description: "오픈소스 소프트웨어를 자동으로 CLI 도구로 만들어서 Claude Code가 직접 제어할 수 있게 하는 방법"
order: 1
tags: ["활용법", "워크플로우", "youtube"]
---

## 이게 뭔가요?

보통 우리가 프로그램을 쓸 때는 마우스로 클릭하잖아요. 포토샵에서 이미지 편집하려면 메뉴 클릭, 필터 클릭, 저장 클릭... 이런 식으로요.

**CLI-Anything**은 이런 "클릭으로 쓰는 프로그램"을 **"말로 쓰는 프로그램"으로 바꿔주는 도구**입니다.

비유하자면 이래요:

> 원래: 리모컨 버튼을 하나하나 눌러서 TV 조작
> CLI-Anything 적용 후: "넷플릭스 열어서 어제 보던 거 이어 틀어줘"라고 말하면 알아서 실행

Claude Code가 터미널(명령어 창)에서 살고 있잖아요. CLI-Anything은 다른 프로그램들도 터미널에서 조작할 수 있게 만들어서, Claude Code가 **직접 그 프로그램을 제어**할 수 있게 해주는 겁니다.

## 왜 알아야 하나요?

지금까지 Claude Code는 파일 읽기/쓰기, 터미널 명령어 실행 정도만 할 수 있었어요. 하지만 CLI-Anything을 쓰면:

- **Draw.io** 같은 다이어그램 도구를 Claude Code가 직접 조작
- **Blender** 같은 3D 프로그램도 명령어로 제어 가능
- **Audacity** 같은 오디오 편집기도 자동화

MCP(외부 도구 연결)보다 **훨씬 빠르고 가볍습니다**. 중간 다리 없이 터미널에서 바로 통하니까요.

## 어떻게 하나요?

### 준비물

- Python 3.1 이상
- Claude Code 설치 완료
- 연결하고 싶은 오픈소스 프로그램의 GitHub 저장소

### 1단계: CLI-Anything 플러그인 설치

```bash
claude plugin add cli-anything
claude plugin install cli-anything
```

설치 확인은 `/plugin`에서 installed 목록에 나오면 OK.

> 설치 후 `/reload plugins` 또는 Claude Code 재시작 필요!

### 2단계: 대상 프로그램 클론

연결하고 싶은 프로그램의 소스코드를 가져옵니다.

```bash
git clone https://github.com/jgraph/drawio.git
```

### 3단계: CLI 도구 자동 생성

```bash
cli-anything ./drawio
```

이 한 줄이면 끝! 내부적으로 7단계 파이프라인이 자동 실행됩니다:

1. 코드 분석 → 2. 설계 → 3. 구현 계획 → 4. 테스트 작성 → 5. 문서화 → 6. 빌드 → 7. 개선

약 20분 정도 걸리고, 완료되면 "all 9 success criteria met"이라고 나옵니다.

### 4단계: 사용하기

이제 Claude Code에서 바로 활용 가능!

<div class="example-case">
<strong>💬 예시: Draw.io로 아키텍처 다이어그램 만들기</strong>

```
프롬프트: "draw CLI 도구를 써서 SaaS 백엔드 아키텍처 다이어그램을 만들어줘.
시각적으로 깔끔하게, 완성되면 열어줘."
```

Claude Code가 draw CLI를 호출해서 자동으로 다이어그램을 생성하고, 완성된 파일을 열어줍니다.

</div>

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: 회의용 다이어그램 자동 생성</strong>

**상황**: 내일 아침 회의에서 시스템 구조도를 보여줘야 하는데, Draw.io 직접 만들 시간이 없다.

**해결**:
1. CLI-Anything으로 Draw.io CLI를 미리 만들어둠
2. Claude Code에게 "우리 서비스 아키텍처 다이어그램 만들어줘" 한마디
3. 5분 만에 전문적인 다이어그램 완성

**결과**: 마우스 한 번 안 잡고 회의 자료 완성!

</div>

<div class="example-case">
<strong>📌 실전 케이스: 이미 만들어진 CLI 바로 쓰기</strong>

CLI-Anything에는 이미 여러 유명 프로그램의 CLI가 **미리 만들어져** 있습니다:

| 프로그램 | 용도 | 테스트 수 |
|----------|------|-----------|
| Blender | 3D 모델링 | 28개 |
| Inkscape | 벡터 그래픽 | 다수 |
| Audacity | 오디오 편집 | 다수 |
| Draw.io | 다이어그램 | 다수 |

설치하면 이 CLI들이 바로 사용 가능합니다!

</div>

## 주의할 점

- **오픈소스만 가능**: 소스코드가 공개된 프로그램만 CLI로 만들 수 있습니다. 포토샵 같은 상용 소프트웨어는 안 돼요.
- **첫 생성에 시간 필요**: CLI 만드는 데 약 20분 걸려요. 하지만 한 번 만들면 계속 쓸 수 있습니다.
- **MCP 대신 사용**: 같은 프로그램에 MCP와 CLI-Anything을 동시에 쓰면 충돌할 수 있어요.

## 정리

- CLI-Anything = "아무 프로그램이든 Claude Code가 조종할 수 있게 만드는 도구"
- 오픈소스 프로그램 + 명령어 한 줄 = 자동 CLI 생성
- MCP보다 빠르고 가벼운 새로운 연동 방식

> 참고 영상: [Claude Code + CLI-Anything: The Future of Agent Coding](https://www.youtube.com/watch?v=Uzd2ckXnsg0) — Chase AI
