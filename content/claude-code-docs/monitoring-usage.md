---
title: "OpenTelemetry 모니터링 — Claude Code 사용량 추적 및 관측"
source: "https://code.claude.com/docs/en/monitoring-usage"
order: 52
tags: ["엔터프라이즈", "모니터링", "기업·개발자"]
---

# OpenTelemetry 모니터링 — Claude Code 사용량 추적 및 관측

모니터링은 Claude Code가 어떻게 사용되고 있는지를 실시간으로 추적하는 "계기판"과 같습니다. OpenTelemetry(OTel)를 통해 사용량, 비용, 도구 활동 데이터를 조직의 기존 모니터링 시스템으로 내보낼 수 있습니다.

Claude Code는 두 가지 형태의 데이터를 내보냅니다:
- **메트릭(Metrics)**: 시간에 따른 수치 데이터 (코드 줄 수, 토큰 사용량, 비용 등)
- **이벤트(Events)**: 개별 행동 기록 (프롬프트 입력, 도구 실행, API 요청 등)

---

## 빠른 시작

```bash
# 1. 텔레메트리 활성화
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# 2. 내보내기 방식 선택 (필요한 것만 설정)
export OTEL_METRICS_EXPORTER=otlp       # 선택지: otlp, prometheus, console
export OTEL_LOGS_EXPORTER=otlp          # 선택지: otlp, console

# 3. OTLP 엔드포인트 설정 (OTLP 내보내기 사용 시)
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 4. 인증 설정 (필요한 경우)
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token"

# 5. 디버깅용: 내보내기 간격 단축
export OTEL_METRIC_EXPORT_INTERVAL=10000  # 10초 (기본: 60초)
export OTEL_LOGS_EXPORT_INTERVAL=5000     # 5초 (기본: 5초)

# 6. Claude Code 실행
claude
```

> 기본 내보내기 간격은 메트릭 60초, 로그 5초입니다. 설정 완료 후 프로덕션에서는 기본값으로 되돌리세요.

---

## 관리자 설정

관리자는 [managed settings 파일](/en/settings#settings-files)을 통해 조직 전체의 OpenTelemetry 설정을 중앙에서 구성할 수 있습니다:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.example.com:4317",
    "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer example-token"
  }
}
```

> managed settings의 환경변수는 우선순위가 높아 사용자가 덮어쓸 수 없습니다.

---

## 주요 환경변수

### 핵심 설정

| 환경변수 | 설명 | 예시 값 |
|----------|------|---------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | 텔레메트리 수집 활성화 (필수) | `1` |
| `OTEL_METRICS_EXPORTER` | 메트릭 내보내기 방식 (쉼표 구분) | `console`, `otlp`, `prometheus` |
| `OTEL_LOGS_EXPORTER` | 로그/이벤트 내보내기 방식 | `console`, `otlp` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | OTLP 프로토콜 | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP 수집기 엔드포인트 | `http://localhost:4317` |
| `OTEL_EXPORTER_OTLP_HEADERS` | OTLP 인증 헤더 | `Authorization=Bearer token` |

### 고급 설정

| 환경변수 | 설명 |
|----------|------|
| `OTEL_METRIC_EXPORT_INTERVAL` | 메트릭 내보내기 간격 (밀리초, 기본: 60000) |
| `OTEL_LOGS_EXPORT_INTERVAL` | 로그 내보내기 간격 (밀리초, 기본: 5000) |
| `OTEL_LOG_USER_PROMPTS` | 사용자 프롬프트 내용 로깅 활성화 (기본: 비활성화, `1`로 활성화) |
| `OTEL_LOG_TOOL_DETAILS` | MCP 서버/도구 이름 및 스킬 이름 로깅 (`1`로 활성화) |

### 메트릭 카디널리티 제어

| 환경변수 | 설명 | 기본값 |
|----------|------|--------|
| `OTEL_METRICS_INCLUDE_SESSION_ID` | 메트릭에 session.id 포함 | `true` |
| `OTEL_METRICS_INCLUDE_VERSION` | 메트릭에 app.version 포함 | `false` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | 메트릭에 user.account_uuid 포함 | `true` |

> **카디널리티란?** 데이터의 고유값 종류 수를 의미합니다. 카디널리티가 높을수록 저장 공간과 쿼리 비용이 증가합니다. 필요하지 않은 차원은 비활성화해 비용을 절감할 수 있습니다.

---

## 동적 헤더 설정

엔터프라이즈 환경에서 토큰이 주기적으로 갱신되는 경우:

**1. settings.json에 헬퍼 스크립트 등록:**
```json
{
  "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"
}
```

**2. 헬퍼 스크립트 예시:**
```bash
#!/bin/bash
echo "{\"Authorization\": \"Bearer $(get-token.sh)\", \"X-API-Key\": \"$(get-api-key.sh)\"}"
```

스크립트는 시작 시 실행되고 기본적으로 29분마다 갱신됩니다. `CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS`로 간격을 조정할 수 있습니다.

---

## 멀티팀 조직 지원

여러 팀이나 부서를 구분하려면 `OTEL_RESOURCE_ATTRIBUTES`로 커스텀 속성을 추가합니다:

```bash
export OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123"
```

> **중요한 형식 요건**: 값에 공백을 포함할 수 없습니다!
> - 잘못된 예: `org.name=My Company`
> - 올바른 예: `org.name=MyCompany` 또는 `org.name=My_Company`

---

## 수집되는 메트릭 목록

| 메트릭 이름 | 설명 | 단위 |
|-------------|------|------|
| `claude_code.session.count` | 시작된 CLI 세션 수 | 횟수 |
| `claude_code.lines_of_code.count` | 수정된 코드 줄 수 | 줄 |
| `claude_code.pull_request.count` | 생성된 PR 수 | 횟수 |
| `claude_code.commit.count` | 생성된 커밋 수 | 횟수 |
| `claude_code.cost.usage` | 세션 비용 | USD |
| `claude_code.token.usage` | 사용된 토큰 수 | 토큰 |
| `claude_code.code_edit_tool.decision` | 코드 편집 도구 권한 결정 수 | 횟수 |
| `claude_code.active_time.total` | 총 활성 사용 시간 | 초 |

### 메트릭별 추가 속성

- **lines_of_code**: `type` (added/removed)
- **cost/token**: `model` (예: "claude-sonnet-4-6")
- **token**: `type` (input/output/cacheRead/cacheCreation)
- **code_edit_tool.decision**: `tool_name`, `decision`, `source`, `language`
- **active_time**: `type` (user: 키보드 입력, cli: 도구 실행 및 AI 응답)

---

## 수집되는 이벤트 목록

이벤트는 `OTEL_LOGS_EXPORTER` 설정 시 OpenTelemetry 로그/이벤트로 전송됩니다.

### 이벤트 연결 속성

단일 프롬프트로 인해 발생하는 여러 이벤트를 연결하려면 `prompt.id`를 사용합니다. 하나의 `prompt.id`로 필터링하면 해당 프롬프트가 트리거한 모든 API 요청과 도구 실행을 추적할 수 있습니다.

### 이벤트 유형

| 이벤트 이름 | 트리거 시점 | 주요 속성 |
|-------------|------------|-----------|
| `claude_code.user_prompt` | 사용자가 프롬프트 입력 시 | `prompt_length`, `prompt` (기본 비활성) |
| `claude_code.tool_result` | 도구 실행 완료 시 | `tool_name`, `success`, `duration_ms`, `decision_type` |
| `claude_code.api_request` | Claude API 요청 시 | `model`, `cost_usd`, `duration_ms`, `input_tokens`, `output_tokens` |
| `claude_code.api_error` | API 요청 실패 시 | `model`, `error`, `status_code`, `duration_ms`, `attempt` |
| `claude_code.tool_decision` | 도구 권한 결정 시 | `tool_name`, `decision`, `source` |

### 모든 이벤트의 공통 표준 속성

| 속성 | 설명 |
|------|------|
| `session.id` | 고유 세션 식별자 |
| `app.version` | Claude Code 버전 |
| `organization.id` | 조직 UUID |
| `user.account_uuid` | 계정 UUID |
| `user.id` | 익명 기기/설치 식별자 |
| `user.email` | OAuth 인증 사용자 이메일 |
| `terminal.type` | 터미널 유형 (iTerm, vscode, cursor 등) |

---

## 설정 예시 모음

```bash
# 콘솔 디버깅 (1초 간격)
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console
export OTEL_METRIC_EXPORT_INTERVAL=1000

# OTLP/gRPC
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Prometheus
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=prometheus

# 메트릭 + 로그 각각 다른 백엔드
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://metrics.example.com:4318
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://logs.example.com:4317
```

---

## 백엔드 선택 가이드

### 메트릭용

| 백엔드 | 적합한 용도 |
|--------|------------|
| Prometheus | 비율 계산, 집계 메트릭 |
| ClickHouse | 복잡한 쿼리, 고유 사용자 분석 |
| Honeycomb, Datadog | 고급 쿼리, 시각화, 알림 |

### 이벤트/로그용

| 백엔드 | 적합한 용도 |
|--------|------------|
| Elasticsearch, Loki | 전문 검색, 로그 분석 |
| ClickHouse | 구조화된 이벤트 분석 |
| Honeycomb, Datadog | 메트릭-이벤트 상관관계 분석 |

> DAU/WAU/MAU(일간/주간/월간 활성 사용자) 지표가 필요하다면 고유값 쿼리를 효율적으로 지원하는 백엔드를 선택하세요.

---

## 보안 및 개인정보

- 텔레메트리는 **명시적 설정이 없으면 비활성화** 상태입니다.
- 파일 내용과 코드 스니펫은 메트릭이나 이벤트에 포함되지 않습니다.
- Bash 명령어와 파일 경로는 `tool_parameters`에 포함될 수 있습니다. 명령어에 비밀 정보가 포함될 가능성이 있다면 텔레메트리 백엔드에서 필터링하세요.
- 사용자 프롬프트 내용은 기본적으로 수집되지 않습니다. `OTEL_LOG_USER_PROMPTS=1`로 활성화할 수 있습니다.
- MCP 서버/도구 이름과 스킬 이름은 기본적으로 로깅되지 않습니다. `OTEL_LOG_TOOL_DETAILS=1`로 활성화할 수 있습니다.
- OAuth 인증 시 `user.email`이 텔레메트리 속성에 포함됩니다. 필요시 백엔드에서 필터링하세요.

---

## 예시 케이스

**상황**: 엔지니어링 팀장이 Claude Code의 비용을 팀별로 추적하고, 이상한 사용 패턴(예: 특정 사용자가 갑자기 비용이 10배 급증)이 생기면 Slack 알림을 받고 싶습니다. 또한 매주 팀별 사용량 리포트를 자동으로 생성하고 싶습니다.

**해결책**:
1. 조직 내 모든 개발자에게 아래 managed settings를 배포합니다:
   ```json
   {
     "env": {
       "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
       "OTEL_METRICS_EXPORTER": "otlp",
       "OTEL_LOGS_EXPORTER": "otlp",
       "OTEL_EXPORTER_OTLP_ENDPOINT": "http://otel-collector.internal:4317",
       "OTEL_RESOURCE_ATTRIBUTES": "cost_center=eng,team.id=backend"
     }
   }
   ```
2. Prometheus로 `claude_code.cost.usage`를 수집하고, `user.account_uuid` 기준으로 집계합니다.
3. Grafana 대시보드에 팀별 비용 차트를 구성합니다.
4. 개인 비용이 평소의 3배를 초과하면 Slack 알림을 발송하는 규칙을 추가합니다.
5. 주간 요약 리포트를 자동 생성하는 스케줄러를 설정합니다.

결과: 비용 급증을 실시간으로 감지하고, 팀별 Claude Code 사용 효율을 데이터로 파악할 수 있습니다.

---

## 추가 자료

- [Claude Code ROI 측정 가이드](https://github.com/anthropics/claude-code-monitoring-guide) — Docker Compose, Prometheus, OTel 설정 및 생산성 리포트 템플릿
- [Amazon Bedrock용 모니터링 구현 가이드](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock/blob/main/assets/docs/MONITORING.md)
- [분석 대시보드 가이드](/en/analytics)
- [비용 효율 관리 가이드](/en/costs)
