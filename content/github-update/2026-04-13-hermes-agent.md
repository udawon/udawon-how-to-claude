---
date: "2026-04-13"
title: "Hermes Agent: 사용할수록 스스로 성장하는 AI 에이전트"
description: "경험에서 스킬을 자동 생성하고, 14개 메신저에서 접근하며, $5 서버부터 GPU 클러스터까지 어디서든 실행되는 자기 개선형 AI 에이전트 플랫폼"
order: 5
tags: ["AI에이전트", "자가학습", "멀티플랫폼", "오픈소스", "github"]
repo_url: "https://github.com/NousResearch/hermes-agent"
---

## 이게 뭔가요?

Hermes Agent(헤르메스 에이전트)는 Nous Research(누스 리서치)가 만든 **자기 개선형 AI(인공지능) 에이전트**입니다. 공식 슬로건은 "The agent that grows with you(당신과 함께 성장하는 에이전트)"입니다.

마치 신입 사원이 업무를 반복하면서 자기만의 노하우를 쌓고, 그 노하우를 파일로 정리해 다음 번에 더 빠르게 꺼내 쓰는 것처럼 — Hermes는 복잡한 작업을 완료할 때마다 그 방법을 "스킬"로 저장하고, 이후 비슷한 상황에서 자동으로 꺼내 씁니다. 사람이 개입하지 않아도 시간이 지날수록 더 유능해집니다.

| 항목 | 내용 |
|------|------|
| 만든 곳 | Nous Research (오픈소스 LLM 연구팀) |
| 전체 ⭐ | 69,343개 |
| 포크(복제) | 9,255개 |
| 라이선스 | MIT (자유롭게 사용 가능) |
| 버전 | 0.8.0 |
| 링크 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) |

---

## 왜 필요한가요?

기존 AI 에이전트에는 세 가지 공통 문제가 있습니다.

**문제 1: 대화가 끝나면 모두 잊어버린다**
오늘 어렵게 해결한 방법을 내일 다시 처음부터 설명해야 합니다. Hermes는 세션이 끝나도 기억을 유지하고, 과거 대화를 검색할 수 있습니다.

**문제 2: 노트북이 꺼지면 에이전트도 멈춘다**
내 컴퓨터에서만 돌아가는 에이전트는 자리를 비우면 멈춥니다. Hermes는 클라우드 서버, 서버리스 환경에 상주해 24시간 돌아갑니다.

**문제 3: 특정 AI 회사에 묶여 있다**
OpenAI(오픈AI)나 Anthropic(앤트로픽) 중 하나만 쓸 수 있으면, 가격이 오르거나 서비스가 불안정할 때 대책이 없습니다. Hermes는 200개 이상의 AI 모델을 코드 수정 없이 전환할 수 있습니다.

---

## 핵심 기능

### 1. 자율 스킬 생성 및 자기 개선
복잡한 작업을 완료하면 에이전트가 스스로 그 과정을 "스킬"로 저장합니다. 저장된 스킬은 반복 사용할수록 더 정교하게 개선됩니다. [agentskills.io](https://agentskills.io)의 오픈 스탠다드(공개 표준)를 따르므로 다른 시스템과도 호환됩니다.

### 2. 14개 플랫폼 게이트웨이
CLI(명령줄 인터페이스), Telegram(텔레그램), Discord(디스코드), Slack(슬랙), WhatsApp(왓츠앱), Signal(시그널), Email(이메일), Matrix(매트릭스), Home Assistant(홈 어시스턴트) 등 14개 채널 어디서든 동일한 에이전트에 접근할 수 있습니다. 채널이 달라도 대화 맥락이 이어집니다.

### 3. 200+ AI 모델 지원
OpenAI, Anthropic, Nous Portal, OpenRouter 등 18개 이상의 프로바이더(공급자)를 지원합니다. `hermes model` 명령 한 줄로 모델을 전환할 수 있으며, 코드를 전혀 수정할 필요가 없습니다.

### 4. 47개 툴 / 20개 툴셋
웹 검색, 파일 읽기·쓰기, 터미널 실행, 브라우저 조작, 이미지 생성, 코드 실행, 메모리 저장 등 47개 도구가 내장되어 있습니다. 6개의 터미널 백엔드(로컬, Docker, SSH, 서버리스 등)를 지원합니다.

### 5. 자연어 크론(cron) 스케줄러
"매주 월요일 오전 9시에 영업 리포트를 Slack으로 보내줘"처럼 자연어로 반복 작업을 설정할 수 있습니다. 에이전트가 알아서 정해진 시간에 실행합니다.

### 6. 영속적 메모리 + 세션 검색
SQLite(에스큐엘라이트)와 FTS5(전문 검색 엔진)를 사용해 모든 대화를 저장하고 검색합니다. [Honcho](https://github.com/plastic-labs/honcho) 연동 시 사용자의 성향과 패턴까지 누적해서 기억합니다.

### 7. 스킬 허브 보안 스캔
커뮤니티가 만든 스킬을 설치할 때 데이터 탈취, 프롬프트 인젝션(악의적 명령 삽입), 공급망 위협을 자동으로 스캔합니다.

<div class="example-case">
<strong>예시 1: 반복 업무 자동화</strong>

매주 금요일 오후, Hermes가 GitHub(깃허브) 저장소의 이슈(업무 목록)를 분석하고 주간 진행 상황 요약을 작성해 Slack 채널에 자동으로 올립니다. 처음에는 형식이 어색했지만, 몇 주가 지나면서 팀이 선호하는 포맷을 학습해 더 보기 좋은 리포트를 생성합니다. 담당자는 별도 지시 없이 품질이 개선되는 것을 확인합니다.
</div>

<div class="example-case">
<strong>예시 2: 멀티플랫폼 비서</strong>

아침에는 Telegram으로 "오늘 일정 정리해줘"라고 묻고, 오후에는 Slack에서 "아까 정리한 내용 다시 보여줘"라고 합니다. 채널이 달라도 같은 에이전트가 맥락을 유지한 채 답변합니다. 노트북 없이 스마트폰만으로도 동일한 AI 비서를 쓸 수 있습니다.
</div>

<div class="example-case">
<strong>예시 3: 연구자의 강화학습 데이터 수집</strong>

AI 연구자가 에이전트에게 다양한 문제를 풀게 하고, 풀이 과정(트라젝토리)을 자동으로 기록합니다. 수집된 데이터는 Atropos RL(강화학습) 환경을 통해 새로운 AI 모델 학습에 바로 사용됩니다. 작업이 끝나면 서버리스 환경이 자동으로 종료되어 비용이 최소화됩니다.
</div>

---

## 설치 방법

Linux, macOS, WSL2(Windows 리눅스 서브시스템), Android Termux에서 설치할 수 있습니다.

```bash
# 설치 (한 줄)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 터미널 재시작 후 실행
hermes
```

**주요 명령어:**

```bash
hermes              # 대화 시작
hermes model        # AI 모델 선택
hermes gateway      # 메시징 플랫폼 연결 (Telegram 등)
hermes setup        # 전체 설정 마법사
hermes doctor       # 문제 진단
hermes update       # 최신 버전 업데이트
```

**대화 중 슬래시 커맨드:**

```
/new         새 대화 시작
/model       모델 전환
/skills      저장된 스킬 목록 확인
/compress    컨텍스트 압축 (긴 대화 정리)
/usage       API 사용량 확인
```

---

## 이런 분께 유용합니다

- AI 에이전트를 노트북 없이 24시간 돌리고 싶은 개발자
- 반복 작업을 자동화하고 싶지만 매번 AI에게 처음부터 설명하기 번거로운 분
- Telegram, Slack, Discord 등 이미 쓰는 메신저에서 AI 비서를 통합 관리하고 싶은 팀
- 특정 AI 회사에 종속되지 않고 여러 모델을 자유롭게 쓰고 싶은 분
- AI 강화학습 데이터를 자동 수집하려는 연구자

---

## 주의할 점

- **Windows 미지원**: 네이티브 Windows 환경은 지원하지 않습니다. WSL2(Windows 리눅스 서브시스템) 필수
- **Python 3.11 이상 필수**: 3.10 이하 버전에서는 설치되지 않습니다
- **버전 0.8.0**: 아직 정식 버전(1.0) 이전으로 API(프로그램 연결 방식)가 변경될 수 있습니다
- **오픈 이슈 3,598개**: 빠르게 성장 중인 프로젝트인 만큼 버그 리포트가 많습니다. 중요한 업무에는 안정성 테스트 후 사용을 권장합니다
- **커뮤니티 스킬 주의**: 자동 보안 스캔이 있지만, "경고" 수준의 스킬은 `--force` 옵션으로 우회 설치가 가능합니다. 출처를 반드시 확인하세요

---

## 비슷한 프로젝트

- [anthropics/claude-code](https://github.com/anthropics/claude-code) — Anthropic 공식 AI 코딩 에이전트. Claude 전용, 코딩에 특화
- [microsoft/autogen](https://github.com/microsoft/autogen) — 마이크로소프트의 멀티 에이전트 대화 프레임워크
- [coleam00/Archon](https://github.com/coleam00/Archon) — YAML로 AI 에이전트 워크플로우를 코드로 정의하는 결정론적 실행 엔진
- [claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) — Claude Code 세션의 지식을 마크다운으로 자동 축적하는 개인용 메모리 시스템
