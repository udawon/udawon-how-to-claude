---
date: "2026-03-12"
title: "Claude Code 무료로 사용하기 (Ollama & OpenRouter)"
description: "Anthropic API 비용 없이 Claude Code를 무료로 사용하는 두 가지 방법"
order: 2
tags: ["설정", "연동", "youtube"]
source_url: "https://www.youtube.com/watch?v=5nbF_p6F6Lk"
---

## 이게 뭔가요?

Claude Code는 원래 Anthropic API(프로그램끼리 대화하는 통로)를 써서 돈이 듭니다. 어떤 사람은 주말에 200달러(약 26만원)를 날린 적도 있어요.

하지만 **무료로 쓰는 방법이 두 가지** 있습니다:

> **방법 A (클라우드)**: OpenRouter라는 서비스를 통해 무료 AI 모델 사용
> **방법 B (로컬)**: 내 컴퓨터에 AI 모델을 직접 설치해서 사용

비유하자면:
- 방법 A = "무료 와이파이 잡아서 인터넷 쓰기" (성능 제한 있지만 어디서든)
- 방법 B = "집에 인터넷 깔기" (초기 설치만 하면 무제한, 대신 컴퓨터 성능 필요)

## 왜 알아야 하나요?

- Claude Code를 **학습용으로 맘껏 연습**하고 싶을 때
- API 비용 걱정 없이 **실험**하고 싶을 때
- 회사 코드를 외부 서버에 보내기 싫을 때 (**방법 B = 완전 오프라인**)

## 어떻게 하나요?

### 공통 준비: Claude Code 설치

```bash
npm install -g @anthropic-ai/claude-code
```

---

### 방법 A: OpenRouter (클라우드 무료)

컴퓨터 사양이 낮아도 OK. 크롬북이나 핸드폰에서도 가능합니다.

#### 1단계: OpenRouter 가입 & API 키 발급

openrouter.ai에서 계정 만들고 API 키 발급.

> 팁: 계정에 10달러만 충전하면 하루 50회 → **1,000회**로 한도가 올라갑니다. 월 구독이 아니라 한 번만 충전하는 거예요.

#### 2단계: 환경변수 설정

**Windows** (환경 변수 GUI):
1. 시작 메뉴에서 "환경 변수" 검색 → "시스템 환경 변수 편집" 클릭
2. 새로 만들기:

| 변수 이름 | 값 |
|-----------|-----|
| `ANTHROPIC_BASE_URL` | `https://openrouter.ai/api` |
| `ANTHROPIC_AUTH_TOKEN` | `여러분의 OpenRouter 키` |
| `ANTHROPIC_API_KEY` | (비워두기) |

**Mac/Linux** (터미널):
```bash
nano ~/.zshrc
```
맨 아래에 추가:
```bash
export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
export ANTHROPIC_AUTH_TOKEN="여러분의 OpenRouter 키"
export ANTHROPIC_API_KEY=""
alias claude='claude --model openrouter/free'
```
저장: `Ctrl+O` → `Enter` → `Ctrl+X`

#### 3단계: 실행

```bash
# Mac/Linux (alias 설정했으면)
claude

# Windows (매번 직접 지정)
claude --model "openrouter/free"
```

<div class="example-case">
<strong>💬 예시: 무료 모델로 코딩하기</strong>

```bash
claude --model "openrouter/free"
> "이 프로젝트의 구조를 분석해줘"
```

OpenRouter가 자동으로 가장 빠른 무료 모델(Qwen 3 등)을 골라서 응답합니다. Claude 4.6 Opus만큼 완벽하진 않지만 학습/실험용으로는 충분!

</div>

---

### 방법 B: Ollama (로컬 무료)

인터넷 없이, 비행기 안에서도 코딩 가능. 회사 코드가 절대 외부로 나가지 않습니다.

#### 1단계: Ollama 설치

ollama.com에서 다운로드 → 설치 → 실행. 시스템 트레이에 라마 아이콘이 보이면 OK.

#### 2단계: AI 모델 다운로드

```bash
# 16GB RAM 노트북용 (입문)
ollama pull deepcoder

# 32GB RAM 이상 (고성능)
ollama pull qwen3-coder
```

#### 3단계: 환경변수 설정

**Windows**:

| 변수 이름 | 값 |
|-----------|-----|
| `ANTHROPIC_BASE_URL` | `http://localhost:11434` |
| `ANTHROPIC_API_KEY` | `ollama` |

**Mac/Linux**:
```bash
nano ~/.zshrc
```
```bash
export ANTHROPIC_BASE_URL="http://localhost:11434"
export ANTHROPIC_API_KEY="ollama"
alias claude='claude --model deepcoder'
```

#### 4단계: 실행

```bash
claude --model deepcoder
```

<div class="example-case">
<strong>💬 예시: 오프라인에서 코드 리뷰</strong>

비행기에서 와이파이 없이:
```bash
claude --model deepcoder
> "이 함수에 버그가 있는 것 같은데 찾아줘"
```

내 컴퓨터의 GPU/CPU가 직접 AI를 돌려서 응답합니다. 인터넷 완전 불필요!

</div>

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: "Claude Code 처음 배우는 중인데 비용이 걱정돼요"</strong>

**상황**: Claude Code를 배우고 싶은데, 연습하다가 API 비용이 쌓일까 걱정.

**해결**:
1. OpenRouter 가입 (무료)
2. 환경변수 3개 설정 (5분)
3. `claude --model "openrouter/free"` 로 실행
4. 하루 50회까지 무료로 연습!

**결과**: 비용 0원으로 Claude Code의 핵심 기능(파일 편집, 프로젝트 분석, Git(코드 버전 관리 도구) 작업)을 모두 연습할 수 있음.

</div>

## 주의할 점

- **무료 모델 ≠ Claude Opus**: 복잡한 대규모 리팩터링에는 성능 차이가 있을 수 있어요
- **OpenRouter 방법 A**: 잔액 0원이면 하루 50회 제한. 10달러 충전하면 1,000회
- **Ollama 방법 B**: 컴퓨터 사양이 중요. 최소 16GB RAM 권장
- **기존 Anthropic 설정 충돌**: 이전에 Anthropic API를 쓰고 있었다면, `claude` 치고 안에서 `logout` 먼저 해야 충돌 안 남

## 보너스: 윈도우에서 클라우드 모델만 쓰는 우회 (manifest-only 트릭)

> 2026-05 추가 — AI Mantra Lab 영상에서 소개된 윈도우 한정 추가 옵션

GPU 없는 윈도우 노트북에서 위 두 방법이 다 무겁다면, **Ollama의 "manifest only" 동작**을 활용해 클라우드에서 추론하는 우회법이 있습니다. Ollama가 모델을 받을 때 실제 가중치(모델의 두뇌, 보통 수십 GB) 대신 **manifest 파일(어떤 모델을 어떻게 부를지 적어둔 한 장짜리 명세서)** 만 다운로드받고, 추론은 Ollama의 클라우드에서 처리하는 흐름입니다. 내 컴퓨터에 GPU가 없어도 OpenAI의 거대한 오픈소스 모델 `gpt-oss` 120B를 무료로 쓸 수 있습니다.

### 1단계: Ollama 설치 후 검증

```powershell
ollama -h
```

`command not found`가 뜨면 한 번 재부팅하고 다시 시도하세요. 윈도우는 환경변수 갱신이 늦게 반영될 때가 있습니다.

### 2단계: 작업 폴더 격리 (중요)

```powershell
D:\
mkdir cloud-projects
cd cloud-projects
```

D 드라이브 등에 전용 폴더를 만들고 **그 안에서만 `claude` 명령을 실행**하세요. 첫 실행 시 "Yes, I trust this folder"를 누르는데, 그 시점에 AI가 만질 수 있는 범위가 그 폴더로 한정됩니다. C:\\Windows 같은 시스템 폴더에서 실행하면 AI가 시스템 파일을 건드릴 위험이 생깁니다.

### 3단계: Ollama 클라우드 로그인

클라우드 모델은 추론을 ollama.com 서버에서 돌리므로 **로그인이 필수**입니다 (로컬 모델만 쓸 때는 불필요).

```powershell
ollama signin
```

브라우저가 열리면서 ollama.com 계정 생성·로그인 절차로 안내됩니다. 한 번만 하면 됩니다.

### 4단계: gpt-oss 120B 모델 manifest 받기

```powershell
ollama pull gpt-oss:120b-cloud
```

여기서 다운로드되는 파일은 manifest(약 수 KB)뿐이고 실제 추론은 Ollama 클라우드에서 일어납니다. 일반 로컬 모델과 사용법은 동일합니다.

### 5단계: Claude Code에서 모델 선택

```powershell
claude
```

실행 후 화살표 키로 모델 목록을 스크롤하면 새로 추가된 **Cloud GPT-OSS 120B** 항목이 보입니다. 선택하고 평소처럼 자연어로 지시하면 됩니다 (예: "make a tic-tac-toe game" — 오타가 있어도 의도를 추론해 HTML/CSS/JS 3개 파일을 자동 생성).

### 주의할 점 (윈도우 한정)

- 연결 timeout이 자주 뜨면 **윈도우 방화벽**을 잠시 꺼보거나 인터넷 연결을 점검하세요.
- 회사 코드처럼 외부 유출이 곤란한 자료에는 클라우드 모델을 쓰면 안 됩니다 (방법 B의 진짜 로컬 모델만 사용).
- Ollama 클라우드는 무료 사용량이 변동될 수 있습니다. 헤비하게 쓸 거라면 ollama.com에서 현재 정책을 확인하세요.

> 참고 영상: [Free Claude on Windows](https://youtube.com/watch?v=_lfruXWsCHw) — AI Mantra Lab

## 정리

- **방법 A (OpenRouter)**: 설정 5분, 어떤 컴퓨터든 OK, 하루 50~1,000회 무료
- **방법 B (Ollama 로컬)**: 설정 10분, 16GB+ RAM 필요, 무제한 + 완전 오프라인
- **보너스 (Ollama manifest-only + cloud GPT-OSS 120B)**: 윈도우 노트북 + GPU 없어도 클라우드 모델 사용, 단 회사 보안 자료엔 부적합
- 셋 다 한 번 설정하면 영구적. 매번 다시 할 필요 없음

> 참고 영상: [Claude Code For Free Forever Using Ollama & OpenRouter](https://www.youtube.com/watch?v=5nbF_p6F6Lk) — To Learn AI Automation
