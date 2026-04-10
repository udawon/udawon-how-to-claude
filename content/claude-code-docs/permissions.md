---
title: "권한 설정 가이드: Claude가 무엇을 할 수 있는지 정하기"
source: "https://code.claude.com/docs/en/permissions"
order: 9
tags: ["설정", "권한", "Permissions"]
---

# 권한 설정 가이드: Claude가 무엇을 할 수 있는지 정하기

Claude Code는 당신의 컴퓨터에서 파일을 읽고, 명령어를 실행하고, 웹에 접속할 수 있는 강력한 도구입니다. 그만큼 "무엇을 허용하고, 무엇을 막을지"를 명확히 설정하는 것이 중요합니다. 마치 집에 들어온 도우미에게 "냉장고는 열어도 되지만, 서랍장은 열지 마세요"라고 말하는 것과 같습니다.

---

## 권한 시스템 이해하기

| 도구 종류 | 예시 | 승인 필요? | "다시 묻지 않기" 효과 |
|----------|------|----------|--------------------|
| 읽기 전용 | 파일 읽기, 검색 | 아니오 | 해당 없음 |
| 명령어 실행 | 셸 실행 | 예 | 프로젝트 + 명령어 단위로 영구 허용 |
| 파일 수정 | 파일 편집/저장 | 예 | 세션이 끝날 때까지 허용 |

---

## 허용(Allow) / 거부(Deny) / 확인(Ask) 규칙

`/permissions` 명령어를 실행하면 현재 설정된 권한 목록을 볼 수 있습니다.

- **Allow**: Claude가 물어보지 않고 바로 실행
- **Ask**: 실행 전 항상 사용자에게 확인
- **Deny**: 절대 실행 불가

> **중요:** 규칙은 **Deny → Ask → Allow** 순서로 검토됩니다. Deny가 가장 강합니다.

---

## 권한 규칙 작성법

규칙은 `도구이름` 또는 `도구이름(조건)` 형식으로 씁니다.

### 모든 사용 허용/거부

```json
{
  "permissions": {
    "allow": ["Bash"],
    "deny": ["WebFetch"]
  }
}
```

| 규칙 | 의미 |
|------|------|
| `Bash` | 모든 셸 명령어 허용/거부 |
| `WebFetch` | 모든 웹 요청 허용/거부 |
| `Read` | 모든 파일 읽기 허용/거부 |

### 특정 명령어만 허용

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run test *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

`*`는 와일드카드(어떤 내용이든 매칭)입니다.

| 규칙 | 매칭되는 명령어 |
|------|--------------|
| `Bash(npm run *)` | `npm run build`, `npm run test`, `npm run lint` 등 |
| `Bash(git * main)` | `git checkout main`, `git merge main` 등 |
| `Bash(* --version)` | `node --version`, `npm --version` 등 |

### 파일/폴더 접근 제어

| 규칙 | 의미 |
|------|------|
| `Read(./.env)` | 현재 폴더의 `.env` 파일 읽기 |
| `Read(~/Documents/*.pdf)` | 홈 폴더의 모든 PDF 파일 |
| `Edit(/src/**/*.ts)` | 프로젝트의 모든 TypeScript 파일 편집 |
| `Read(//Users/alice/secrets/**)` | 절대 경로로 지정한 폴더 |

> **팁:** `//경로`는 절대 경로, `~/경로`는 홈 디렉토리 기준, `/경로`는 프로젝트 루트 기준입니다.

### 웹 요청 도메인 제한

```json
{
  "permissions": {
    "allow": ["WebFetch(domain:github.com)"],
    "deny": ["WebFetch"]
  }
}
```

이 설정은 github.com만 접속 허용하고 나머지 모든 웹 요청을 막습니다.

---

## 권한 모드: 작업 방식 선택

설정 파일의 `defaultMode`로 전체적인 권한 동작 방식을 정할 수 있습니다.

| 모드 | 설명 | 적합한 상황 |
|------|------|----------|
| `default` | 새 도구 사용 시 매번 확인 | 일반적인 작업 |
| `acceptEdits` | 파일 편집은 자동 허용 | 빠른 코딩 작업 |
| `plan` | 분석만 가능, 파일 수정 불가 | 코드 리뷰, 검토 |
| `dontAsk` | 사전 등록된 것만 자동 실행 | 자동화 작업 |
| `bypassPermissions` | 모든 확인 건너뜀 | 격리된 환경에서만! |

---

## 추가 폴더 접근 허용

기본적으로 Claude는 실행한 폴더에만 접근할 수 있습니다. 다른 폴더도 접근하게 하려면:

- **시작 시**: `claude --add-dir ../문서폴더` 옵션 사용
- **작업 중**: `/add-dir` 명령어 사용
- **영구 설정**: `additionalDirectories`에 추가

```json
{
  "permissions": {
    "additionalDirectories": ["../docs/", "~/공유폴더"]
  }
}
```

---

## 조직 관리자를 위한 설정

기업 환경에서 IT 관리자는 모든 사용자에게 강제 적용되는 정책을 설정할 수 있습니다.

| 설정 | 설명 |
|------|------|
| `disableBypassPermissionsMode` | "모든 확인 건너뜀" 모드 비활성화 |
| `allowManagedPermissionRulesOnly` | 관리자가 정한 규칙만 허용 |
| `allowManagedMcpServersOnly` | 관리자가 허용한 MCP 서버만 사용 |

---

## 예시 케이스

**상황 1: 개발자가 실수로 코드를 배포할까봐 걱정되는 팀장**

> 김팀장은 Claude가 실수로 `git push`를 실행할까봐 걱정입니다. `.claude/settings.json`에 아래 설정을 추가하고 git에 올렸습니다:
> ```json
> {
>   "permissions": {
>     "deny": ["Bash(git push *)"]
>   }
> }
> ```
> 이제 모든 팀원의 Claude에서 push 명령은 차단됩니다.

**상황 2: API 키 파일이 유출될까봐 걱정되는 개발자**

> 이개발 씨는 프로젝트 폴더에 `.env` 파일이 있는데, Claude가 이 파일을 읽어서 내용을 노출할까봐 걱정합니다:
> ```json
> {
>   "permissions": {
>     "deny": [
>       "Read(./.env)",
>       "Read(./.env.*)",
>       "Read(./secrets/**)"
>     ]
>   }
> }
> ```
> 이제 Claude는 이 파일들의 내용을 볼 수 없습니다.

**상황 3: 자동화 파이프라인에서 Claude 사용하기**

> 박자동화 씨는 CI/CD 파이프라인에서 Claude를 자동으로 실행합니다. 매번 확인 창이 뜨면 멈춰버리기 때문에 `dontAsk` 모드를 사용하고, 필요한 명령어만 미리 허용해 두었습니다:
> ```json
> {
>   "permissions": {
>     "defaultMode": "dontAsk",
>     "allow": ["Bash(npm run lint)", "Bash(npm run test)"]
>   }
> }
> ```
