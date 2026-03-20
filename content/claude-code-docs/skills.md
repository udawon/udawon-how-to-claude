---
title: "스킬 (커스텀 명령어) - Claude의 능력 확장하기"
source: "https://code.claude.com/docs/en/skills"
order: 18
tags: ["커스터마이징", "스킬", "Skills"]
---

# 스킬: Claude의 능력 확장하기

> 스킬은 Claude에게 "새로운 기술"을 가르치는 방법입니다. `SKILL.md` 파일을 만들면 Claude가 그것을 자신의 도구 모음에 추가합니다.

## 스킬이란 무엇인가요?

스킬은 Claude에게 추가 지식이나 작업 방법을 가르치는 마크다운 파일입니다. 마치 회사에 "매뉴얼"을 주는 것처럼, Claude는 그 매뉴얼을 읽고 지시에 따라 행동합니다.

스킬을 `/스킬명`으로 직접 호출하거나, Claude가 상황에 맞게 자동으로 활성화하도록 설정할 수 있습니다.

---

## 기본 제공 스킬 (Bundled Skills)

Claude Code에는 처음부터 사용할 수 있는 내장 스킬이 있습니다.

| 스킬 | 용도 |
|------|------|
| `/simplify` | 최근 변경한 파일의 코드 재사용성·품질·효율성을 검토하고 개선합니다 |
| `/batch <지시>` | 대규모 코드베이스 변경을 병렬로 처리합니다 (5~30개 작업 단위로 분해) |
| `/debug [설명]` | 현재 Claude Code 세션의 문제를 디버그합니다 |
| `/loop [간격] <프롬프트>` | 일정 간격으로 프롬프트를 반복 실행합니다 (예: `/loop 5m check if the deploy finished`) |
| `/claude-api` | 프로젝트 언어에 맞는 Claude API 레퍼런스를 불러옵니다 |

---

## 나만의 스킬 만들기

### 스킬 저장 위치

| 위치 | 경로 | 적용 범위 |
|------|------|-----------|
| 개인 스킬 | `~/.claude/skills/<스킬명>/SKILL.md` | 내 모든 프로젝트 |
| 프로젝트 스킬 | `.claude/skills/<스킬명>/SKILL.md` | 이 프로젝트에만 |
| 플러그인 스킬 | `<플러그인>/skills/<스킬명>/SKILL.md` | 플러그인 활성화 시 |

### 첫 번째 스킬 만들기 (단계별 안내)

**예시**: 코드를 시각적 다이어그램과 비유로 설명하는 스킬

**1단계**: 스킬 디렉토리 만들기
```bash
mkdir -p ~/.claude/skills/explain-code
```

**2단계**: `SKILL.md` 작성하기

파일은 두 부분으로 구성됩니다:
- YAML 프론트매터(`---` 사이): Claude에게 언제 이 스킬을 쓸지 알려주는 메타데이터
- 마크다운 내용: Claude가 따를 실제 지시사항

```yaml
---
name: explain-code
description: 코드를 시각적 다이어그램과 비유로 설명합니다. "이게 어떻게 작동하나요?"처럼 물을 때 사용하세요.
---

코드를 설명할 때 항상 다음을 포함하세요:

1. **비유로 시작**: 일상 생활의 비유로 코드를 설명합니다
2. **다이어그램 그리기**: ASCII 아트로 흐름이나 구조를 보여줍니다
3. **코드 단계별 설명**: 무슨 일이 일어나는지 순서대로 설명합니다
4. **주의사항 강조**: 흔한 실수나 오해는 무엇인가요?

설명은 대화하듯 자연스럽게 하세요.
```

**3단계**: 테스트하기

자동 실행 방식:
```
이 코드가 어떻게 작동하나요?
```

직접 호출 방식:
```
/explain-code src/auth/login.ts
```

---

## 스킬 설정 (프론트매터 옵션)

SKILL.md 상단의 YAML 프론트매터로 스킬 동작을 세밀하게 조정할 수 있습니다.

| 항목 | 필수 여부 | 설명 |
|------|-----------|------|
| `name` | 선택 | 스킬 이름 (생략 시 폴더명 사용). 소문자, 숫자, 하이픈만 사용 가능 |
| `description` | 권장 | 스킬이 하는 일과 언제 쓰는지. Claude가 자동 사용 여부를 판단하는 기준 |
| `argument-hint` | 선택 | 자동완성 시 표시되는 인수 힌트. 예: `[이슈번호]` |
| `disable-model-invocation` | 선택 | `true`로 설정하면 Claude가 자동으로 이 스킬을 불러오지 않음 |
| `user-invocable` | 선택 | `false`로 설정하면 `/` 메뉴에서 숨겨짐 (Claude만 사용 가능) |
| `allowed-tools` | 선택 | 이 스킬 활성화 시 Claude가 승인 없이 쓸 수 있는 도구 목록 |
| `context` | 선택 | `fork`로 설정하면 별도 서브에이전트 맥락에서 실행 |

### 누가 스킬을 호출할 수 있나요?

| 설정 | 직접 호출 | Claude 자동 호출 |
|------|-----------|-----------------|
| (기본값) | 가능 | 가능 |
| `disable-model-invocation: true` | 가능 | 불가능 |
| `user-invocable: false` | 불가능 | 가능 |

**언제 무엇을 써야 할까요?**

- **`disable-model-invocation: true`**: `/deploy`, `/commit`처럼 부작용이 있는 작업. Claude가 "코드가 준비된 것 같으니 배포해야겠다"고 임의로 실행하는 것을 방지합니다.
- **`user-invocable: false`**: Claude가 맥락 파악 시 참고해야 하지만, 사용자가 직접 명령으로 부를 필요는 없는 배경 지식에 사용합니다.

---

## 인수(Arguments) 전달하기

스킬에 값을 넘겨 동적으로 동작하게 할 수 있습니다.

```yaml
---
name: fix-issue
description: GitHub 이슈를 수정합니다
disable-model-invocation: true
---

GitHub 이슈 $ARGUMENTS를 우리 코딩 표준에 따라 수정하세요.

1. 이슈 설명 읽기
2. 요구사항 파악
3. 수정 사항 구현
4. 테스트 작성
5. 커밋 생성
```

`/fix-issue 123`을 입력하면 `$ARGUMENTS`가 `123`으로 대체됩니다.

**위치 기반 인수**:
```yaml
# /migrate-component SearchBar React Vue 처럼 사용
Migrate the $0 component from $1 to $2.
```

---

## 동적 컨텍스트 주입

`!`명령어`` 문법으로 쉘 명령의 실행 결과를 스킬 내용에 삽입할 수 있습니다.

```yaml
---
name: pr-summary
description: 풀 리퀘스트 변경 사항 요약
context: fork
---

## 풀 리퀘스트 정보
- PR diff: !`gh pr diff`
- PR 댓글: !`gh pr view --comments`
- 변경된 파일: !`gh pr diff --name-only`

## 작업
이 풀 리퀘스트를 요약해 주세요...
```

Claude가 이 스킬을 실행하기 전에 백틱 안의 명령어들이 먼저 실행되고, 그 결과가 내용 안에 삽입됩니다.

---

## 지원 파일 추가하기

복잡한 스킬은 여러 파일로 구성할 수 있습니다.

```
my-skill/
├── SKILL.md (필수 - 개요와 지침)
├── reference.md (상세 API 문서 - 필요 시 불러옴)
├── examples.md (사용 예시 - 필요 시 불러옴)
└── scripts/
    └── helper.py (유틸리티 스크립트)
```

SKILL.md에서 지원 파일을 참조하세요:
```markdown
## 추가 자료

- 전체 API 상세 내용은 [reference.md](reference.md)를 참고하세요
- 사용 예시는 [examples.md](examples.md)를 참고하세요
```

---

## 예시 케이스

### 케이스 1: 배포 워크플로우 자동화

**상황**: 프로덕션 배포 전 체크리스트가 있는데, 매번 수동으로 확인하기 번거롭습니다.

**해결책**: 배포 스킬을 만들어 `/deploy`로 호출합니다.

```yaml
---
name: deploy
description: 애플리케이션을 프로덕션에 배포합니다
disable-model-invocation: true
---

$ARGUMENTS 환경에 애플리케이션을 배포하세요:

1. 테스트 스위트 실행 (`npm test`)
2. 빌드 실행 (`npm run build`)
3. Sentry에 소스맵 업로드
4. 배포 대상에 푸시
5. 헬스체크 엔드포인트로 배포 성공 확인
6. Slack #deployments 채널에 알림 전송
```

`/deploy production`을 입력하면 위 체크리스트를 순서대로 실행합니다.

### 케이스 2: 코드 리뷰 보조

**상황**: PR을 올리기 전에 항상 같은 체크리스트로 셀프 리뷰를 합니다.

**해결책**: 코드 리뷰 스킬을 만듭니다.

```yaml
---
name: review-pr
description: 풀 리퀘스트를 우리 팀 기준으로 검토합니다
context: fork
allowed-tools: Bash(gh *)
---

PR diff: !`gh pr diff`

위 변경사항을 검토하고 다음을 확인하세요:
1. 타입 안전성 (any 타입 없음)
2. 테스트 커버리지
3. 에러 처리
4. 성능 문제
5. 보안 취약점

각 항목에 대해 통과/실패/개선 필요 여부를 알려주세요.
```

### 케이스 3: 팀 API 문서 공유

**상황**: 팀의 API 설계 규칙이 있는데, Claude에게 매번 설명하기 귀찮습니다.

**해결책**: API 규칙을 스킬로 만들어 Claude가 자동으로 참고하도록 합니다.

```yaml
---
name: api-conventions
description: 이 코드베이스의 API 설계 패턴. API 엔드포인트 작성 시 자동으로 활성화됩니다.
---

API 엔드포인트 작성 시:
- RESTful 명명 규칙 사용
- 일관된 오류 응답 형식 반환: `{ "error": { "code": "...", "message": "..." } }`
- 모든 요청에 입력 검증 포함
- 인증이 필요한 엔드포인트는 `@auth` 데코레이터 사용
```

---

## 문제 해결

### 스킬이 자동으로 실행되지 않아요

1. description에 사용자가 자연스럽게 말할 키워드가 포함되어 있는지 확인
2. "사용 가능한 스킬은 무엇인가요?"라고 물어보세요
3. 직접 `/스킬명`으로 호출해 보세요

### 스킬이 너무 자주 실행돼요

1. description을 더 구체적으로 작성하세요
2. `disable-model-invocation: true`로 수동 호출만 허용하세요

### Claude가 내 스킬을 못 찾아요

스킬 설명들이 컨텍스트 예산(기본 16,000자)을 초과했을 수 있습니다. `/context`를 실행해 경고가 있는지 확인하세요.
