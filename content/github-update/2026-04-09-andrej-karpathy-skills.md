---
date: "2026-04-09"
title: "Andrej Karpathy의 AI 코딩 조언을 Claude에 이식한 프로젝트"
description: "AI가 코드를 짤 때 반복하는 4가지 실수를 막아주는 단일 CLAUDE.md 파일 — 비개발자도 읽을 수 있는 해설"
order: 2
tags: ["claude-code", "AI코딩", "CLAUDE.md", "프롬프트"]
repo_url: "https://github.com/forrestchang/andrej-karpathy-skills"
---

## 이게 뭔가요?

Andrej Karpathy(안드레이 카르파티)는 OpenAI 공동창업자이자 Tesla AI 전 책임자로, 현재 AI 교육 플랫폼 Eureka Labs를 이끌고 있습니다. 세계에서 가장 영향력 있는 AI 연구자 중 한 명인 그가 AI 코딩 도구를 직접 써보며 겪은 불만을 공개 포스트에 털어놓았습니다.

이 레포는 그 불만을 정리해 **Claude Code(클로드 코드, AI 코딩 어시스턴트)에게 주는 지침서 한 장**으로 만든 프로젝트입니다.

비유하자면: AI 개발자를 처음 채용했을 때 주는 "우리 회사 일 처리 방식" 안내서. 한 번 세팅해두면 AI가 그 규칙을 따라 일합니다.

| 항목 | 내용 |
|------|------|
| 만든 사람 | forrestchang |
| 전체 ⭐ | 10,800+ |
| 포크(복제) | 718 |
| 라이선스 | MIT (자유롭게 사용 가능) |
| 링크 | [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) |

---

## 왜 필요한가요? — Karpathy가 지적한 문제들

Karpathy는 이렇게 말했습니다:

> "AI 모델들은 잘못된 가정을 아무 확인 없이 실행합니다. 혼란을 관리하지 못하고, 명확한 질문을 하지 않으며, 모순을 발견하지 못하고, 더 좋은 방법이 있어도 대안을 제시하지 않습니다."

> "AI들은 1,000줄짜리 코드로 부풀려놓는데, 100줄로도 충분히 해결되는 문제였습니다."

이것이 이 프로젝트가 해결하려는 문제입니다.

---

## 4가지 핵심 원칙

### 원칙 1. 코딩 전에 생각하기 (Think Before Coding)

AI가 "그냥 해버리는" 습관을 막습니다.

**금지 행동:**
- 가정을 세워두고 말 없이 진행
- 여러 해석 가능성이 있는데 혼자 하나 골라서 실행
- 더 간단한 방법이 있는데도 시키는 대로만 함

**요구 행동:**
- 가정은 명시적으로 언급
- 애매하면 물어보고 시작
- 더 좋은 방법이 있으면 먼저 제안

<div class="example-case">
<strong>예시: "사용자 로그인 기능 추가해줘"</strong>

**원칙 없이**: AI가 임의로 JWT 방식 선택 → 이메일/비밀번호 방식으로 구현 → 나중에 소셜 로그인이 필요한 상황임을 알게 됨 → 전부 재작성

**원칙 적용 후**: "구글 로그인도 나중에 필요하신가요? 지금 그 구조를 고려해두면 나중에 바꾸는 비용이 줄어듭니다"라고 먼저 물어봄

</div>

---

### 원칙 2. 단순함 우선 (Simplicity First)

"일단 복잡하게 만들고 보자"는 AI의 습관을 차단합니다.

**금지 행동:**
- 요청하지 않은 기능 추가
- 한 번만 쓸 코드에 복잡한 구조 적용
- "나중에 쓸 수도 있으니" 식의 여유 설계
- 불가능한 상황에 대한 오류 처리 코드 작성

**판단 기준**: 시니어 개발자가 봤을 때 "이거 왜 이렇게 복잡해?"라고 할 것 같으면 → 다시 짜기

<div class="example-case">
<strong>예시: "버튼 클릭 시 알림 보여줘"</strong>

**원칙 없이**: 알림 시스템 전체를 설계, 큐(queue) 관리, 우선순위 설정, 다국어 지원 구조까지 만들어버림 (400줄)

**원칙 적용 후**: 그냥 알림창 하나 뜨는 코드 작성 (20줄)

</div>

---

### 원칙 3. 외과적 수정 (Surgical Changes)

요청한 것만 건드리고, 나머지는 놔둡니다.

**수정하면 안 되는 것:**
- 요청과 관계없는 코드, 주석, 포맷
- 이미 잘 돌아가는 부분

**수정해야 하는 것:**
- 내 변경으로 생긴 불필요한 코드만 정리

**테스트**: 변경된 모든 줄이 사용자의 요청과 직접 연결되는가?

<div class="example-case">
<strong>예시: "이 함수 이름 바꿔줘"</strong>

**원칙 없이**: 함수 이름 바꾸면서 "어차피 보는 김에" 주변 코드도 리팩터링(코드 구조 개선), 오래된 주석 삭제, 변수명 정리까지 같이 함

**원칙 적용 후**: 함수 이름만 바꿈. 주변에 죽은 코드가 보이면 "여기 안 쓰는 코드가 있네요. 삭제할까요?"라고 물어봄

</div>

---

### 원칙 4. 목표 중심 실행 (Goal-Driven Execution)

"해줘" 대신 "이렇게 되면 성공" 방식으로 일합니다.

Karpathy가 가장 강조한 인사이트:

> "AI는 명확한 목표가 주어졌을 때 독립적으로 루프를 돌면서 일을 끝내는 능력이 탁월합니다. 뭘 할지 말하지 말고, 성공 기준을 주면 AI가 알아서 달성합니다."

| 기존 방식 | 목표 중심 방식 |
|-----------|---------------|
| "유효성 검사 추가해줘" | "잘못된 입력에 대한 테스트를 먼저 작성하고, 그 테스트를 통과시켜줘" |
| "버그 고쳐줘" | "이 버그를 재현하는 테스트를 쓰고, 그 테스트가 통과하도록 고쳐줘" |
| "리팩터링 해줘" | "수정 전후 테스트가 모두 통과하도록 유지하면서 리팩터링해줘" |

<div class="example-case">
<strong>예시: 여러 단계 작업</strong>

AI가 스스로 계획을 세우고 각 단계마다 "검증 방법"을 붙입니다:

1. API 엔드포인트 작성 → 검증: curl 요청으로 200 응답 확인
2. 에러 케이스 처리 → 검증: 잘못된 입력에 400 반환 확인
3. 테스트 코드 추가 → 검증: `npm test` 전부 통과

이렇게 되면 중간에 막혀도 어디서 막혔는지 바로 보입니다.

</div>

---

## 어떻게 설치하나요?

### 방법 A: Claude Code 플러그인 (추천)

Claude Code 터미널에서:

```
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

설치하면 모든 프로젝트에 자동 적용됩니다.

### 방법 B: 프로젝트별 CLAUDE.md

새 프로젝트:
```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

기존 프로젝트 (뒤에 추가):
```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

---

## 이런 분께 유용합니다

- AI 코딩 도구를 써봤는데 "왜 이걸 여기까지 건드려?" 경험이 있는 분
- AI에게 간단한 걸 시켰는데 과도하게 복잡한 결과물이 나온 경험이 있는 분
- Claude Code를 처음 도입하는 팀에서 행동 기준을 통일하고 싶은 분

---

## 주의할 점

**이 지침은 신중함 쪽으로 치우쳐 있습니다.** 단순한 오타 수정이나 한 줄 수정에는 굳이 적용할 필요가 없습니다. 복잡한 작업에서 비싼 실수를 줄이는 것이 목적입니다.

---

## 비슷한 프로젝트

- [anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts) — Anthropic 공식 Claude 예제 모음
- [Paul Graham 에세이 + CLAUDE.md 템플릿](https://github.com/threepointone/AGENTS.md) — 유사한 AI 지침 파일 접근법
