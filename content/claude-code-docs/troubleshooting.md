---
title: "문제 해결 - Claude Code 오류와 해결책 완전 가이드"
source: "https://code.claude.com/docs/en/troubleshooting"
order: 60
tags: ["참조", "문제해결"]
---

# 문제 해결: Claude Code 오류와 해결책 완전 가이드

Claude Code를 사용하다 보면 가끔 예상치 못한 오류가 발생합니다. 이 문서는 **병원의 증상별 진료 안내판**과 같습니다 — "이런 증상이 있으면 → 이 과(해결책)로 가세요"처럼, 오류 메시지를 찾아서 해당 해결책을 따라하면 됩니다.

---

## 빠른 문제 진단표

| 이런 오류/증상이 보인다면 | 해결책 |
|---|---|
| `command not found: claude` 또는 `'claude' is not recognized` | PATH 설정 문제 → [PATH 확인 방법](#경로path-확인) 참조 |
| `syntax error near unexpected token '<'` | HTML이 반환됨 → [설치 스크립트 문제](#설치-스크립트가-html을-반환하는-경우) 참조 |
| `curl: (56) Failure writing output to destination` | 다운로드 실패 → [curl 오류](#curl-56-오류) 참조 |
| Linux에서 설치 중 `Killed` 메시지 | 메모리 부족 → [스왑 추가](#linux-메모리-부족으로-설치-실패) 참조 |
| `TLS connect error` 또는 SSL 오류 | 인증서 문제 → [TLS 오류](#tls-ssl-연결-오류) 참조 |
| `irm is not recognized` 또는 `&& is not valid` | 잘못된 셸 명령 → [Windows 셸 오류](#windows-irm-또는--인식-안됨) 참조 |
| `Claude Code on Windows requires git-bash` | Git Bash 미설치 → [Git Bash 설치](#windows-git-bash-필요-오류) 참조 |
| `Error loading shared library` (Linux) | 잘못된 바이너리 → [musl/glibc 불일치](#linux-잘못된-바이너리-설치) 참조 |
| `OAuth error` 또는 `403 Forbidden` | 인증 문제 → [인증 문제](#인증-문제) 참조 |
| 지역 제한 메시지 | Claude Code가 해당 국가에서 미지원 |

---

## 설치 문제 해결

### 1단계: 네트워크 연결 확인

설치 파일은 `storage.googleapis.com`에서 다운로드됩니다. 연결 테스트:

```bash
curl -sI https://storage.googleapis.com
```

오류가 나면 회사 방화벽이나 프록시가 차단하고 있을 수 있습니다.

**프록시 환경에서 설치:**

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
curl -fsSL https://claude.ai/install.sh | bash
```

---

### 경로(PATH) 확인

설치는 됐지만 `claude` 명령이 안 되면, 설치 폴더가 셸 경로에 없는 것입니다.

**macOS/Linux:**

```bash
# 경로 확인
echo $PATH | tr ':' '\n' | grep local/bin

# 없으면 추가 (Zsh)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 없으면 추가 (Bash)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Windows PowerShell:**

```powershell
# 확인
$env:PATH -split ';' | Select-String 'local\\bin'

# 추가
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

설정 후 터미널을 재시작하고 `claude --version`으로 확인하세요.

---

### 중복 설치 확인

여러 버전이 충돌하면 이상한 동작이 생깁니다.

```bash
# 모든 claude 위치 확인
which -a claude

# npm 전역 설치 제거
npm uninstall -g @anthropic-ai/claude-code

# macOS Homebrew 설치 제거
brew uninstall --cask claude-code
```

네이티브 설치(`~/.local/bin/claude`)만 남기는 것을 권장합니다.

---

### 설치 스크립트가 HTML을 반환하는 경우

다음 오류가 보이면:

```
bash: line 1: syntax error near unexpected token `<'
bash: line 1: `<!DOCTYPE html>'
```

스크립트 대신 웹페이지가 다운로드된 것입니다. 지역 제한이면 "App unavailable in region" 메시지가 나타납니다.

**대안 설치 방법:**

```bash
# macOS/Linux
brew install --cask claude-code

# Windows
winget install Anthropic.ClaudeCode
```

---

### curl (56) 오류

```bash
# 연결 테스트
curl -fsSL https://storage.googleapis.com -o /dev/null
```

오류가 없으면 일시적 문제입니다. 다시 시도하거나 Homebrew/WinGet으로 설치하세요.

---

### TLS/SSL 연결 오류

**Ubuntu/Debian:**

```bash
sudo apt-get update && sudo apt-get install ca-certificates
```

**macOS:**

```bash
brew install ca-certificates
```

**Windows - TLS 1.2 활성화:**

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
irm https://claude.ai/install.ps1 | iex
```

**회사 인증서 문제:**

```bash
export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem
```

---

### Linux 메모리 부족으로 설치 실패

설치 중 `Killed`가 보이면 메모리가 부족합니다. Claude Code는 최소 4GB RAM이 필요합니다.

**스왑 공간 추가:**

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 그 후 다시 설치
curl -fsSL https://claude.ai/install.sh | bash
```

---

### Windows irm 또는 `&&` 인식 안됨

| 오류 | 원인 | 해결 |
|---|---|---|
| `'irm' is not recognized` | CMD에서 PowerShell 명령 실행 | PowerShell 열고 `irm https://claude.ai/install.ps1 \| iex` |
| `&& is not valid` | PowerShell에서 CMD 명령 실행 | PowerShell 명령 사용 |

---

### Windows Git Bash 필요 오류

[Git for Windows](https://git-scm.com/downloads/win)를 설치하세요. 설치 시 "Add to PATH" 선택.

이미 설치했는데 오류가 나면 `settings.json`에 경로 추가:

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

---

### Linux 잘못된 바이너리 설치 (musl/glibc 불일치)

```
Error loading shared library libstdc++.so.6
```

```bash
# 어떤 libc 사용 중인지 확인
ldd /bin/ls | head -1
```

**musl 기반 (Alpine Linux):**

```bash
apk add libgcc libstdc++ ripgrep
```

---

## 인증 문제

### 반복적인 권한 확인 프롬프트

같은 명령을 계속 승인해야 한다면, `/permissions` 명령으로 특정 도구를 허용 목록에 추가하세요.

### 로그인 오류

1. `/logout` 실행
2. Claude Code 종료
3. `claude`로 재시작 후 다시 로그인

브라우저가 자동으로 열리지 않으면 `c`를 눌러 OAuth URL을 복사한 후 수동으로 붙여넣으세요.

### OAuth 코드 오류

코드가 만료되었을 가능성이 있습니다.

- Enter를 눌러 다시 시도하고 브라우저가 열리면 빠르게 완료
- 원격/SSH 환경에서는 URL을 로컬 브라우저에서 열어야 합니다

### 403 Forbidden 오류

| 계정 유형 | 확인 사항 |
|---|---|
| Pro/Max | [claude.ai/settings](https://claude.ai/settings)에서 구독 상태 확인 |
| Console | 관리자가 "Claude Code" 또는 "Developer" 역할을 부여했는지 확인 |
| 프록시 환경 | 기업 프록시가 API 요청을 차단하고 있을 수 있음 |

### WSL2에서 OAuth 로그인 실패

```bash
export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
claude
```

또는 로그인 프롬프트에서 `c`를 눌러 URL을 Windows 브라우저에 붙여넣으세요.

---

## 설정 파일 위치

| 파일 | 용도 |
|---|---|
| `~/.claude/settings.json` | 사용자 전체 설정 |
| `.claude/settings.json` | 프로젝트 설정 (버전 관리에 포함) |
| `.claude/settings.local.json` | 로컬 전용 설정 (버전 관리 제외) |
| `~/.claude.json` | 전역 상태 (테마, OAuth, MCP 서버) |
| `.mcp.json` | 프로젝트 MCP 서버 설정 |

Windows에서 `~`는 `C:\Users\사용자명`을 의미합니다.

### 설정 초기화

```bash
# 모든 사용자 설정 초기화
rm ~/.claude.json
rm -rf ~/.claude/

# 프로젝트 설정만 초기화
rm -rf .claude/
rm .mcp.json
```

> 주의: 이 명령을 실행하면 모든 설정, MCP 서버 설정, 세션 기록이 사라집니다.

---

## 성능 문제

### CPU·메모리 사용량이 높을 때

1. `/compact`로 대화 맥락 줄이기
2. 주요 작업 사이에 Claude Code 재시작
3. 큰 빌드 디렉토리를 `.gitignore`에 추가

### 명령이 멈추거나 응답이 없을 때

1. `Ctrl+C`로 취소 시도
2. 응답 없으면 터미널 닫고 재시작

### 검색 기능이 작동 안 할 때

`ripgrep`이 설치되어 있지 않을 수 있습니다.

```bash
# macOS
brew install ripgrep

# Windows
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep

# Alpine Linux
apk add ripgrep
```

설치 후 `USE_BUILTIN_RIPGREP=0` 환경변수를 설정하세요.

---

## IDE 연동 문제

### JetBrains IDE가 WSL2에서 인식되지 않을 때

**방법 1: Windows 방화벽 규칙 추가**

```bash
# WSL2 IP 확인
wsl hostname -I
```

PowerShell (관리자 권한)에서:

```powershell
New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
```

**방법 2: 미러링 네트워크 모드**

`~/.wslconfig` 파일 (Windows 사용자 디렉토리)에:

```ini
[wsl2]
networkingMode=mirrored
```

설정 후 `wsl --shutdown`으로 재시작.

### JetBrains 터미널에서 Escape 키가 안 될 때

Settings → Tools → Terminal → "Move focus to the editor with Escape" 체크 해제

---

## 마크다운 형식 문제

### 코드 블록에 언어 태그가 없을 때

Claude에게 직접 요청하세요: "이 마크다운 파일의 모든 코드 블록에 언어 태그를 추가해줘"

또는 자동화를 위해 PostToolUse 훅에 prettier 같은 포매터를 설정할 수 있습니다.

---

## 더 많은 도움 받기

1. **Claude Code 내에서**: `/bug` 명령으로 문제 직접 신고
2. **GitHub**: [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)에서 이슈 확인
3. **자가 진단**: `/doctor` 명령 실행

`/doctor`는 다음을 자동으로 확인합니다:
- 설치 유형, 버전, 검색 기능
- 자동 업데이트 상태
- 잘못된 설정 파일 (JSON 형식 오류 등)
- MCP 서버 설정 오류
- 키 바인딩 충돌
- 대형 CLAUDE.md, 높은 MCP 토큰 사용량 등 경고
- 플러그인·에이전트 로딩 오류

---

## 예시 케이스

### 상황 1: 회사 VPN 환경에서 설치가 안 될 때
IT팀에 `storage.googleapis.com`에 대한 접근 허용을 요청하거나, 프록시 주소를 받아 `HTTPS_PROXY` 환경변수에 설정하세요. 그래도 안 되면 Homebrew나 WinGet으로 설치하세요.

### 상황 2: 팀원의 컴퓨터에서만 Claude Code가 느릴 때
`/doctor`로 먼저 진단하세요. CLAUDE.md가 너무 크거나, MCP 서버를 너무 많이 설정했거나, `ripgrep`이 없어서 검색이 느린 것일 수 있습니다.

### 상황 3: WSL2에서 PyCharm 연동이 안 될 때
WSL2의 NAT 네트워킹이 IDE 감지를 방해합니다. 방화벽 규칙을 추가하거나 미러링 모드로 전환하면 해결됩니다.
