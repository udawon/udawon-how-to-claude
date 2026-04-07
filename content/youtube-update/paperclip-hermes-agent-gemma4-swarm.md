---
date: "2026-04-07"
title: "PaperClip + Hermes Agent + Gemma4로 만드는 오픈소스 AI 자동화 시스템"
description: "할 일 목록에 작업을 적으면 AI가 알아서 처리하는 오픈소스 자동화 시스템 구축법"
order: 39
tags: ["활용법", "워크플로우", "자동화", "연동", "youtube"]
source_url: "https://youtube.com/watch?v=-NsQZcbCV8Q"
---

## 이게 뭔가요?

카카오톡으로 심부름을 시키듯이, **할 일 목록에 작업을 적어두면 AI가 자동으로 처리해주는 시스템**입니다.

세 가지 오픈소스(누구나 무료로 사용 가능한 공개 소프트웨어) 도구를 조합합니다:

| 도구 | 역할 | 비유 |
|------|------|------|
| **PaperClip** | 작업 관리 툴 | 팀 노션/지라처럼 할 일 목록 관리 |
| **Hermes Agent** | AI 에이전트(자율적으로 행동하는 AI) 프레임워크 | 심부름꾼 AI — 복잡한 일도 혼자 처리 |
| **Gemma 4 26B** | Google이 출시한 오픈소스 LLM(대형 언어 모델) | AI의 두뇌 역할 |

## 왜 알아야 하나요?

- **완전 로컬 실행** — 인터넷 없이 내 컴퓨터에서만 돌아가므로 데이터가 외부로 나가지 않음
- **비용 제로** — Claude API나 GPT API 없이 무료로 AI 자동화 구현 가능
- **병렬 처리** — 여러 작업을 동시에 여러 서브 에이전트가 나눠서 처리, 속도 향상

## 어떻게 하나요?

### 방법 1: Hermes Agent 설치 및 기본 설정

```bash
# 1. Hermes Agent 설치 (npm: Node.js 패키지 관리자)
npm install -g hermes

# 2. PaperClip 연동 어댑터 설치 (정확한 패키지명 사용)
npm install @nousresearch/paperclip-adapter-hermes
```

설치 후 Hermes 설정 파일에서 사용할 모델과 서버 주소를 지정합니다:
- **베이스 URL**: Ollama(로컬에서 AI 모델을 실행하는 툴)가 실행 중인 주소
- **모델명**: `gemma4:26b` (또는 원하는 모델)

<div class="example-case">
<strong>예시 — Hermes 설정 파일 구성</strong>

```json
{
  "llm": {
    "baseUrl": "http://localhost:11434",
    "model": "gemma4:26b"
  }
}
```

Ollama가 로컬 서버로 실행 중이라면 위 주소가 기본값입니다.

</div>

### 방법 2: PaperClip에서 Hermes Agent 등록

1. PaperClip 대시보드 → **에이전트 섹션** → `+` 버튼
2. **Advanced Agent** 선택
3. 에이전트 이름 입력, 타입을 `hermes`로 설정
4. 커맨드 입력:
   - Hermes가 시스템 PATH(운영체제가 프로그램을 찾는 경로 목록)에 등록된 경우: `hermes`
   - PATH에 없으면 절대 경로 사용: `/usr/local/bin/hermes` (실제 설치 경로로 변경)
5. **Create Agent** 클릭

<div class="example-case">
<strong>예시 — 마케팅 리서치 리포트 자동 작성</strong>

PaperClip에서 이슈(작업 항목)를 생성합니다:

> 제목: 에이전트 하네스 마케팅 리서치 리포트 작성  
> 내용: 웹에서 관련 정보를 검색하고 요약해서 리포트 파일로 저장해줘

Hermes Agent가 자동으로:
1. 웹 검색 실행
2. 결과 분석 및 정리
3. 마크다운 리포트 파일 생성

사람이 직접 할 필요 없이 PaperClip 이슈 하나로 끝납니다.

</div>

### 방법 3: 여러 작업 병렬 처리 (서브 에이전트)

Hermes에게 복잡한 작업을 주면 자동으로 여러 서브 에이전트(하위 AI)로 분해해서 동시에 처리합니다.

<div class="example-case">
<strong>실전 케이스: 3가지 리서치 동시 실행</strong>

Hermes에게 이렇게 요청:

> "최신 AI 에이전트 뉴스를 리서치하고, Hermes와 OpenClaw를 비교하고, GitHub 이슈 Top 5를 요약해줘. 모두 병렬 서브 에이전트로 처리해줘."

결과:
- 서브 에이전트 1 → 최신 뉴스 리서치
- 서브 에이전트 2 → 도구 비교 분석
- 서브 에이전트 3 → GitHub 이슈 요약

세 작업이 **동시에** 실행되어 순차 처리보다 빠르게 완료됩니다.

</div>

## 보안 설정 — 꼭 확인하세요

Hermes Agent가 내 컴퓨터에서 명령어를 실행할 수 있기 때문에 보안 모드 선택이 중요합니다.

| 모드 | 동작 | 권장 상황 |
|------|------|----------|
| **manual** (기본값) | 모든 액션을 사람이 직접 승인 | 처음 사용할 때, 중요한 작업 |
| **smart** | LLM이 안전 여부를 판단해서 자동 승인 | 어느 정도 익숙해진 후 |
| **yolo** | 모든 커맨드를 자동 승인 (무조건 실행) | 테스트 환경에서만 — 실제 사용 금지 |

> **주의**: yolo 모드는 파일 삭제, 네트워크 요청 등 위험한 작업도 자동으로 실행합니다. 테스트 목적으로만 사용하세요.

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 랜딩 페이지 자동 생성</strong>

PaperClip에서 이슈 생성:
> "Gemma 4 소개 랜딩 페이지를 만들어줘. 심플하고 깔끔하게. 완성되면 home/research 폴더에 저장해줘."
> 우선순위: Critical / 담당: 엔지니어

Hermes Agent가:
1. HTML/CSS로 랜딩 페이지 작성
2. 지정 폴더에 파일 저장
3. PaperClip 이슈 상태를 "완료"로 업데이트

결과물을 브라우저 HTML 뷰어로 바로 확인 가능합니다.

</div>

## 주의할 점

- **Ollama 필수**: Gemma 4 같은 대형 모델을 로컬에서 돌리려면 Ollama가 먼저 설치되어 있어야 함
- **GPU 메모리**: Gemma 4 26B 모델은 약 30GB VRAM이 필요함. 사양이 낮으면 더 작은 모델(4B 등) 사용 권장
- **PATH 설정**: Hermes 커맨드를 찾지 못하면 절대 경로로 지정해야 함
- **어댑터 필수**: PaperClip과 연동하려면 반드시 `@nousresearch/paperclip-adapter-hermes`를 별도 설치해야 함 — 이 과정을 빠뜨리면 PaperClip 이슈에서 에이전트가 실행되지 않음

## 정리

- PaperClip(작업 관리) + Hermes Agent(AI 실행) + Gemma 4(두뇌)를 조합하면 완전 로컬 AI 자동화 시스템을 무료로 구축할 수 있다
- 여러 작업을 병렬 서브 에이전트로 처리하므로 복잡한 리서치·코드 생성 작업도 빠르게 완료된다
- 보안 모드는 반드시 확인하고, 실서비스에서는 yolo 모드를 절대 사용하지 않는다

---

참고 영상: [PaperClip + Hermes Agent + Gemma4: The Ultimate Open Source Swarm Intelligence That Can Do Anything](https://www.youtube.com/watch?v=-NsQZcbCV8Q) — Devs Kingdom (2026-04-06)
