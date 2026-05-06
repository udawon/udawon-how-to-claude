---
name: push
description: "현재 working tree의 변경 사항을 자동 커밋하고 원격에 푸시하는 스킬. /push 명령 또는 '커밋하고 올려줘', '푸시해줘', 'push 해줘', '깃허브에 올려줘', '커밋 푸시' 등의 요청에 이 스킬을 사용하라. how-to-claude 프로젝트 전용 — 단순 문서/데이터 업데이트용 가벼운 커밋 워크플로우."
---

# /push — 단순 커밋 + 푸시 스킬

> **목적**: how-to-claude 프로젝트의 문서·데이터 업데이트를 위한 가벼운 커밋·푸시 워크플로우.
> 테스트/VERSION bump/PR 생성 같은 무거운 단계는 포함하지 않는다. 그건 `/ship` 영역이다.

## 언제 쓰는가

- `/updategithub`, `/updateyoutube`, `/updatedocs` 실행 직후 생성된 문서를 깃허브에 올릴 때
- `data/` 디렉토리의 랭킹 JSON 같은 단순 데이터 업데이트
- 그 외 코드 변경이 아닌 콘텐츠 변경

코드 변경(로직, 버그 수정, 기능 추가)에는 사용하지 말 것 — 그쪽은 `/ship`을 쓴다.

---

## 실행 절차

### Step 1: 변경 사항 점검

다음 명령을 **병렬로** 실행하여 현재 상태를 파악한다.

```bash
git status
git diff --stat
git log --oneline -5
```

- `git status`: 추가된 파일, 수정된 파일, 미추적 파일 확인
- `git diff --stat`: 어떤 파일이 얼마나 바뀌었는지 한눈에
- `git log --oneline -5`: 최근 커밋 메시지 스타일 확인 (이 프로젝트의 컨벤션 추출용)

### Step 2: 변경 사항 분류

수집한 정보로 변경의 성격을 한 줄로 요약한다.

| 변경 패턴 | 권장 커밋 메시지 prefix |
|-----------|----------------------|
| `content/github-update/YYYY-MM-DD-github-trending.md` 신규 | `문서 추가: YYYY-MM-DD 주간 GitHub 트렌딩 Top N` |
| `content/github-update/YYYY-MM-DD-{repo}.md` 신규 | `문서 추가: {repo} 단독 분석` |
| `content/youtube-update/YYYY-MM-DD-*.md` 신규 | `문서 추가: YYYY-MM-DD YouTube 영상 기반 Claude 한국어 가이드 N건` |
| `content/docs-update/...` 신규 | `문서 추가: {주제}` |
| `data/*.json` 갱신 | `data: 랭킹 업데이트 YYYY-MM-DD` |
| 기타 단순 수정 | `chore: {간결한 한 줄 설명}` |

여러 파일 묶음일 때는 가장 큰 변경을 메인 메시지로, 나머지는 본문 bullet로 정리한다.

### Step 3: 사용자 확인

다음을 사용자에게 보고하고 **승인을 받는다**.

```
## 커밋 예정 내용

**변경 파일** (N개):
- A path/to/new-file.md
- M path/to/modified-file.md

**커밋 메시지**:
{Step 2에서 결정한 메시지}

진행할까요?
```

승인 없이는 절대 다음 단계로 넘어가지 않는다.

### Step 4: 커밋 + 푸시

승인을 받으면 다음을 실행한다.

```bash
git add {구체적인 파일 경로 나열 — 'git add .'는 금지}
git commit -m "{Step 2의 메시지}"
git push
```

**중요 규칙**:
- `git add .` 또는 `git add -A`는 절대 사용하지 않는다. 사용자가 의도하지 않은 파일(예: `.tmp/`, `.env`, `.playwright-mcp/`)이 함께 올라갈 수 있다.
- 변경 사항을 명시적으로 파일 단위로 추가한다.
- 커밋 메시지에 **이모지 사용 금지** (YMYD 팀 규칙).
- `Co-Authored-By` 트레일러 **사용하지 않는다** — 이 프로젝트의 기존 커밋 히스토리에 없다.
- `--no-verify` 같은 hook 우회 플래그 금지.

### Step 5: 결과 보고

```
✅ 푸시 완료

**커밋**: {short SHA} {커밋 메시지}
**원격**: {origin URL의 마지막 경로}
**파일 수**: N개
```

---

## 에러 처리

| 상황 | 대응 |
|------|------|
| 변경 사항 없음 (`git status` clean) | "커밋할 변경 사항이 없습니다" 보고 후 종료 |
| `.env`, `credentials*` 같은 시크릿 의심 파일 포함 | 절대 자동 추가하지 않음. 사용자에게 명시적 경고 후 의도 확인 |
| 푸시 실패 (rejected, non-fast-forward) | `git pull --rebase` 권유. 자동 force push 절대 금지 |
| pre-commit hook 실패 | 우회하지 말고 원인 보고 후 사용자에게 결정권 |
| `.tmp/`, `.playwright-mcp/` 등 임시 디렉토리 변경 | `.gitignore` 확인. 누락이면 `.gitignore` 갱신 제안만, 자동 커밋 안 함 |

---

## 비교: /push vs /ship

| 항목 | /push (이 스킬) | /ship (gstack) |
|------|---------------|---------------|
| 대상 | 문서·데이터 단순 업데이트 | 코드 변경 |
| 단계 | 3단계 (확인·커밋·푸시) | 다단계 (테스트·VERSION·CHANGELOG·PR) |
| 사용자 확인 | 1회 (커밋 직전) | 다회 |
| PR 생성 | 안 함 | 함 |
| 적합한 상황 | `/updategithub` 후, `/updateyoutube` 후 | 기능 개발 후 |

코드 변경이 섞여 있다고 판단되면 `/push` 대신 `/ship`을 권고한다.

---

## 금지 사항

- `git add .` / `git add -A` 사용
- `--no-verify`로 hook 우회
- `git push --force` (사용자 명시 요청 없으면)
- 시크릿 파일 자동 추가
- 사용자 승인 없이 커밋
- 이모지 포함 커밋 메시지
- `Co-Authored-By` 트레일러 추가
