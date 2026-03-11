---
title: "고급 설치 가이드: Claude Code 설치 완전 정복"
source: "https://code.claude.com/docs/en/setup"
order: 7
tags: ["설정", "설치"]
---

# 고급 설치 가이드: Claude Code 설치 완전 정복

Claude Code를 설치하고 관리하는 방법을 쉽게 설명합니다. 처음 설치부터 버전 관리, 제거까지 모두 다룹니다.

---

## 내 컴퓨터에서 Claude Code를 쓸 수 있을까요?

Claude Code를 사용하려면 아래 조건을 갖춰야 합니다.

| 항목 | 최소 요건 |
|------|----------|
| 운영체제 | macOS 13+, Windows 10(1809+), Ubuntu 20.04+, Debian 10+, Alpine Linux 3.19+ |
| 메모리 | 4GB 이상 RAM |
| 인터넷 | 반드시 연결되어 있어야 함 |
| 셸(Shell) | Bash, Zsh, PowerShell, CMD |
| 계정 | Claude Pro, Max, Teams, Enterprise, 또는 Console |

> **무료 계정(Free)으로는 Claude Code를 사용할 수 없습니다.** Pro 이상 구독이 필요합니다.

---

## 설치 방법

### macOS / Linux / WSL (추천 방식)

터미널을 열고 아래 명령어를 붙여넣기 하세요. 마치 앱스토어 설치 버튼을 누르는 것처럼 자동으로 설치됩니다.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

### Windows CMD

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

> **Windows 사용자 주의:** Git for Windows가 먼저 설치되어 있어야 합니다. [다운로드 링크](https://git-scm.com/downloads/win)

설치가 완료되면 터미널에 `claude`를 입력하면 바로 시작됩니다.

---

## 설치 확인하기

설치가 잘 됐는지 확인하려면:

```bash
claude --version
```

더 자세한 상태 확인이 필요하면:

```bash
claude doctor
```

---

## 자동 업데이트: 항상 최신 버전 유지

네이티브 설치 방식(curl 명령어 사용)으로 설치하면 **자동으로 최신 버전으로 업데이트**됩니다. 직접 업데이트할 필요가 없습니다.

### 업데이트 채널 선택하기

| 채널 | 설명 | 언제 사용? |
|------|------|----------|
| `latest` (기본값) | 새 기능이 나오면 즉시 업데이트 | 최신 기능을 빠르게 써보고 싶을 때 |
| `stable` | 약 1주일 정도 지난 안정 버전 | 안정성이 중요한 업무 환경 |

채널을 변경하려면 설정 파일(`~/.claude/settings.json`)에 추가합니다:

```json
{
  "autoUpdatesChannel": "stable"
}
```

### 수동 업데이트

지금 바로 최신 버전으로 올리고 싶다면:

```bash
claude update
```

---

## 특정 버전 설치하기 (버전 고정)

팀 전체가 동일한 버전을 사용해야 하거나, 특정 버전으로 돌아가야 할 때 유용합니다.

```bash
# 특정 버전 번호 설치
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58

# 안정 버전 설치
curl -fsSL https://claude.ai/install.sh | bash -s stable
```

---

## 예시 케이스

**상황 1: 처음 Claude Code를 설치하는 마케터**

> 김민지 씨는 마케터입니다. 개발자 동료가 "Claude Code를 써보라"고 권했습니다. 맥북에서 터미널을 열고 `curl -fsSL https://claude.ai/install.sh | bash`를 붙여넣기 했습니다. 1분도 안 돼서 설치가 완료됐고, `claude`를 입력하자 로그인 창이 떴습니다. Claude Pro 계정으로 로그인하니 바로 사용할 수 있었습니다.

**상황 2: 회사 전체에 배포해야 하는 IT 담당자**

> 박IT 씨는 100명 규모 회사의 IT 담당자입니다. 모든 직원이 같은 버전을 사용하길 원합니다. `stable` 채널을 설정하고 `autoUpdatesChannel`을 관리 설정에서 고정해 두었습니다. 이제 새 버전이 나와도 급하게 모든 직원 컴퓨터에서 오류가 나는 일이 없어졌습니다.

**상황 3: Windows에서 설치가 안 될 때**

> 이대리는 Windows 11을 씁니다. PowerShell 명령어를 실행했는데 Git Bash를 찾을 수 없다는 오류가 났습니다. Git for Windows를 먼저 설치하고, 설정 파일에 경로를 지정해줬습니다:
> ```json
> {
>   "env": {
>     "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
>   }
> }
> ```
> 이후 정상적으로 작동했습니다.

---

## Claude Code 제거하기

사용을 중단하고 싶다면 아래 명령어로 깔끔하게 제거할 수 있습니다.

### macOS / Linux / WSL

```bash
rm -f ~/.local/bin/claude
rm -rf ~/.local/share/claude
```

설정 파일까지 모두 삭제하려면:

```bash
rm -rf ~/.claude
rm ~/.claude.json
```

> **주의:** 설정 파일을 삭제하면 모든 설정, 허용 도구 목록, 대화 기록이 영구적으로 삭제됩니다.

### Windows PowerShell

```powershell
Remove-Item -Path "$env:USERPROFILE\.local\bin\claude.exe" -Force
Remove-Item -Path "$env:USERPROFILE\.local\share\claude" -Recurse -Force
```
