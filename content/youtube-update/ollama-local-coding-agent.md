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

---

## 2026년 4월 추가: Qwen 3.6과 llama.cpp로 한 단계 더

> 출처: [YouTube — Qwen 3.6 + Claude Code + LLaMA.cpp](https://youtube.com/watch?v=pY1i1R0rchk) (2026-04-20 공개)

2026년 3월 말 Qwen 3.6-Plus Preview가 공개되면서 로컬 모델의 코딩 성능이 눈에 띄게 개선되었습니다. 참고로 2026년 2월에 공개된 것은 Qwen 3.5 시리즈이고, Qwen 3.6 본격 시리즈는 4월 중순부터 순차 공개되고 있습니다. 오픈소스와 프런티어 모델의 격차가 줄어들고 있다는 신호입니다.

### llama.cpp란?

Ollama의 내부 엔진이 **llama.cpp** (CPU·GPU 효율 실행용 C++ 라이브러리)입니다. 2026년 2월 20일 llama.cpp를 개발한 ggml.ai팀이 HuggingFace(오픈소스 AI 모델 저장소)에 공식 합류하면서, Ollama 없이 llama.cpp 서버를 직접 띄워 실행 파라미터를 세밀하게 조정할 수 있는 환경이 더 안정화되었습니다. (Anthropic은 이 합류에 관여하지 않습니다.)

### Claude Code를 로컬 모델로 돌리는 한 줄 설정

**핵심은 환경변수 `ANTHROPIC_BASE_URL` 한 줄입니다.** Claude Code 실행 시 이 주소를 로컬 llama.cpp 서버로 바꾸면, Claude Code는 Anthropic 서버 대신 내 컴퓨터의 모델로 요청을 보냅니다.

```bash
# 예: llama.cpp 서버를 9090 포트에 실행한 뒤
export ANTHROPIC_BASE_URL="http://0.0.0.0:9090"
claude
```

**Windows(PowerShell):**
```powershell
$env:ANTHROPIC_BASE_URL = "http://0.0.0.0:9090"
claude
```

### 성능 파라미터 체크리스트

llama.cpp 서버를 띄울 때 아래 옵션을 적절히 조정하면 응답 속도가 크게 달라집니다.

| 옵션 | 역할 | 권장 설정 |
|------|------|-----------|
| `--n-gpu-layers 99` | 가능한 모든 레이어를 GPU에 올림 | GPU 있으면 필수 |
| `--ctx-size` | 컨텍스트 윈도우 크기 | 32K~64K |
| `--parallel` | 동시 처리 가능한 요청 수 | 2~4 |
| `--flash-attn on` | 메모리 효율 어텐션 | 지원 GPU는 켜기 |
| `--cache-type-k`, `--cache-type-v` | KV 캐시 양자화 | `q8_0` 권장 |
| `--cont-batching` | 연속 배칭으로 처리량 향상 | 켜기 |
| `--reasoning off` | 내부 사고 체인 끄기 | **코딩 에이전트는 끄는 게 빠름** |

### 주의할 점

영상 제작자가 **64개 에이전트를 8시간 30분 동안 병렬로 돌린 실험**에서 Qwen 3.6은 "너무 공격적인 요청"이라고 경고는 하지만 작업을 수락했습니다. 반대로 Qwen 3.6 이전 모델은 이런 대규모 요청을 거부하는 경우가 있었습니다.

다만 대규모 병렬 실행에서는 **조용한 에러** (silent error, 에러가 로그에 안 남고 무한 루프나 자원 경쟁이 발생) 가능성이 있습니다. 8개 이상 동시 실행은 반드시 모니터링을 붙이세요.

### 비개발자가 따라 할 수준인가?

**솔직히 이 방법은 중급 이상 개발자용**입니다. Ollama 경로(위 본문)가 여전히 비개발자에게 가장 안전합니다. llama.cpp + 환경변수 조작은 "Ollama로는 속도가 부족하다"고 느낀 다음 단계로 넘어가세요.
