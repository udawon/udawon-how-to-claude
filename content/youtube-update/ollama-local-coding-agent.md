---
date: "2026-04-09"
title: "Ollama로 로컬 AI 코딩 에이전트 만들기 — 크레딧 없이 Claude Code 수준 경험"
description: "Ollama와 Qwen 3.5 9B 모델로 무료 로컬 코딩 에이전트를 구축하는 방법. 64K 컨텍스트 윈도우 설정과 하이브리드 전략까지."
order: 46
tags: ["설정", "활용법", "youtube"]
source_url: "https://youtube.com/watch?v=yCEHRdw6f4g"
---

# Ollama로 로컬 AI 코딩 에이전트 만들기

## 이게 뭔가요?

택시를 쓸 때마다 요금이 나가는 것처럼, Claude Code를 API로 쓰면 요청할 때마다 크레딧이 소모됩니다. AI 에이전트가 터미널을 자율적으로 탐색하다 보면 하룻밤 사이에 크레딧을 다 써버릴 수도 있습니다.

**Ollama** (올라마, 로컬 AI 모델 실행 도구)는 이 문제를 해결합니다. 내 컴퓨터 안에서 AI 모델을 직접 실행하기 때문에 API 비용이 전혀 없습니다. 여기에 **Qwen 3.5 9B** (큰언어모델, 중국 알리바바의 오픈소스 모델)를 얹으면 Claude Code와 유사한 코딩 에이전트 경험을 $0에 구현할 수 있습니다.

---

## 왜 Qwen 3.5 9B인가요?

| 항목 | 내용 |
|------|------|
| 파라미터 수 | 9B (90억 개) — 소비자 하드웨어에서 실행 가능 |
| 필요 RAM | 10~16GB (4비트 양자화 기준) |
| 특징 | 내장 **thinking mode** (단계별 추론 후 답변 생성) |
| 성능 | 추론 벤치마크에서 훨씬 큰 모델과 비슷하거나 앞서는 결과를 보임 |

**9B 파라미터**면 작은 모델인데도 코딩 특화 성능이 뛰어납니다. 특히 도구 호출(tool calling)과 단계별 추론에서 강점을 보입니다.

---

## 준비물

- Ollama 설치 (ollama.com)
- VS Code (Visual Studio Code, 코드 편집기)
- RAM 10GB 이상 (16GB 권장)

---

## 설치 및 설정

### Step 1 — Ollama 설치

**Mac:**
```bash
# 터미널에서 실행
curl -fsSL https://ollama.com/install.sh | sh
```
또는 ollama.com에서 macOS 설치 파일(.dmg)을 직접 다운로드합니다.

**Windows:**
PowerShell을 관리자 권한으로 열고 ollama.com의 설치 스크립트를 붙여넣어 실행합니다. 백그라운드에서 자동 설치됩니다.

### Step 2 — Qwen 3.5 모델 다운로드

VS Code 터미널을 열고 실행합니다:

```bash
ollama pull qwen3:9b
```

### Step 3 — 컨텍스트 윈도우 확장 (핵심 설정)

기본 설정으로는 모델이 대규모 코드베이스를 한 번에 읽지 못합니다. **Modelfile** (모델 설정 파일)을 만들어 **컨텍스트 윈도우** (한 번에 처리할 수 있는 텍스트 양)를 64,000 토큰으로 확장해야 합니다.

**Mac (터미널):**
```bash
# Modelfile 생성
cat > Modelfile << 'EOF'
FROM qwen3:9b
PARAMETER num_ctx 64000
EOF

# 커스텀 모델 생성
ollama create qwen3-coder -f Modelfile
```

**Windows (Command Prompt):**
```cmd
# Modelfile 생성 후 커스텀 모델 생성
ollama create qwen3-coder -f Modelfile
```

`success` 메시지가 나오면 64K 컨텍스트 코딩 모델이 준비된 것입니다.

### Step 4 — 모델 실행 및 테스트

```bash
ollama run qwen3-coder
```

프로젝트 디렉토리에서 실행하면 모델이 폴더 구조를 자동으로 스캔합니다.

**자율 에이전트 동작 테스트:**
```
텍스트 파일을 만들고 인사말을 작성해줘
```

모델이 내부적으로 write 도구를 실행하고, VS Code에 확인 프롬프트를 표시합니다. Enter를 누르면 완료됩니다.

---

## 실제 활용 범위

<div class="example-case">

### 잘 하는 작업 (로컬 모델 적합)

| 작업 유형 | 예시 |
|-----------|------|
| 보일러플레이트 생성 | CRUD API 기본 코드 작성 |
| 단위 테스트 작성 | 기존 함수에 대한 테스트 케이스 생성 |
| 코드 설명 | 복잡한 로직 한국어로 설명 |
| 기본 리팩토링 | 변수명 정리, 함수 분리 |
| 즉시 문서화 | 함수에 JSDoc/docstring 추가 |

하루 일과의 80%는 이 작업들입니다. 전부 로컬에서 처리 가능합니다.

</div>

<div class="example-case">

### Claude API가 필요한 작업

| 작업 유형 | 이유 |
|-----------|------|
| 복잡한 아키텍처 결정 | 9B 모델의 추론 한계 |
| 난해한 버그 디버깅 | 깊은 문맥 이해 필요 |
| 최신 라이브러리 지식 | 학습 데이터 최신성 차이 |
| 대규모 코드 리뷰 | 전체 맥락 파악 정확도 |

전체 작업의 20% 정도만 Claude API를 씁니다. 나머지는 로컬로 처리해 크레딧을 아낍니다.

</div>

---

## 하이브리드 전략

```
일상 코딩 (80%)          복잡한 작업 (20%)
      │                          │
      ▼                          ▼
 로컬 Ollama              Claude API
 (비용: $0)           (크레딧 사용)
      │                          │
      └──────────┬───────────────┘
                 ▼
            완성된 코드
```

**판단 기준:** 막히면 Claude API로 전환합니다. 잘 풀리면 로컬 모델을 계속 씁니다.

---

## 빠른 참조

| 명령어 | 설명 |
|--------|------|
| `ollama pull qwen3:9b` | 모델 다운로드 |
| `ollama create qwen3-coder -f Modelfile` | 커스텀 모델 생성 |
| `ollama run qwen3-coder` | 모델 실행 |
| `ollama list` | 설치된 모델 목록 확인 |
| `ollama rm qwen3-coder` | 모델 삭제 |

---

## 키보드 단축키

| 동작 | Mac | Windows |
|------|-----|---------|
| VS Code 터미널 열기 | `Ctrl + `` ` | `Ctrl + `` ` |
| 터미널에서 실행 취소 | `Ctrl + C` | `Ctrl + C` |
| 모델 대화 종료 | `/bye` 입력 | `/bye` 입력 |

---

## 정리

Ollama + Qwen 3.5 9B는 Claude Code의 완전한 대체제가 아닙니다. 하지만 **일상적인 코딩 작업의 80%를 무료로** 처리할 수 있습니다. 64K 컨텍스트 확장 설정이 가장 중요한 단계입니다. 이 설정 없이는 대형 프로젝트를 제대로 읽지 못합니다.

시작점: 로컬 모델로 하루를 보내보고, 어디서 한계를 느끼는지 파악한 뒤 그 부분만 Claude API로 처리하는 루틴을 만드세요.
