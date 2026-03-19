---
date: "2026-03-12"
title: "Claude Code 무료로 사용하기 (Ollama & OpenRouter)"
description: "Anthropic API 비용 없이 Claude Code를 무료로 사용하는 두 가지 방법"
order: 2
tags: ["설정", "연동", "youtube"]
source_url: "https://www.youtube.com/watch?v=5nbF_p6F6Lk"
---

## 이게 뭔가요?

Claude Code는 원래 Anthropic API를 써서 돈이 듭니다. 어떤 사람은 주말에 200달러(약 26만원)를 날린 적도 있어요.

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

**결과**: 비용 0원으로 Claude Code의 핵심 기능(파일 편집, 프로젝트 분석, Git 작업)을 모두 연습할 수 있음.

</div>

## 주의할 점

- **무료 모델 ≠ Claude Opus**: 복잡한 대규모 리팩터링에는 성능 차이가 있을 수 있어요
- **OpenRouter 방법 A**: 잔액 0원이면 하루 50회 제한. 10달러 충전하면 1,000회
- **Ollama 방법 B**: 컴퓨터 사양이 중요. 최소 16GB RAM 권장
- **기존 Anthropic 설정 충돌**: 이전에 Anthropic API를 쓰고 있었다면, `claude` 치고 안에서 `logout` 먼저 해야 충돌 안 남

## 정리

- **방법 A (OpenRouter)**: 설정 5분, 어떤 컴퓨터든 OK, 하루 50~1,000회 무료
- **방법 B (Ollama)**: 설정 10분, 16GB+ RAM 필요, 무제한 + 완전 오프라인
- 둘 다 한 번 설정하면 영구적. 매번 다시 할 필요 없음

> 참고 영상: [Claude Code For Free Forever Using Ollama & OpenRouter](https://www.youtube.com/watch?v=5nbF_p6F6Lk) — To Learn AI Automation
