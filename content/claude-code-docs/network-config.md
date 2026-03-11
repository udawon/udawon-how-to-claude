---
title: "기업 네트워크 구성 — 프록시, 인증서, mTLS 설정"
source: "https://code.claude.com/docs/en/network-config"
order: 49
tags: ["엔터프라이즈", "네트워크"]
---

# 기업 네트워크 구성 — 프록시, 인증서, mTLS 설정

기업 환경에서는 인터넷 트래픽이 바로 외부로 나가지 않고, 회사의 보안 서버를 거쳐 나가는 경우가 많습니다. 마치 아파트 단지의 경비실처럼, 모든 방문자(트래픽)가 경비실을 거쳐야 하는 것과 같습니다. 이 문서는 Claude Code가 이런 환경에서도 잘 작동하도록 설정하는 방법을 안내합니다.

> 이 페이지의 모든 환경변수는 `settings.json` 파일에서도 동일하게 설정할 수 있습니다.

---

## 프록시 설정

### 기본 프록시 환경변수

Claude Code는 표준 프록시 환경변수를 지원합니다:

```bash
# HTTPS 프록시 (권장)
export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP 프록시 (HTTPS를 쓸 수 없는 경우)
export HTTP_PROXY=http://proxy.example.com:8080

# 프록시 예외 설정 — 스페이스로 구분
export NO_PROXY="localhost 192.168.1.1 example.com .example.com"

# 프록시 예외 설정 — 쉼표로 구분
export NO_PROXY="localhost,192.168.1.1,example.com,.example.com"

# 모든 요청에서 프록시 우회
export NO_PROXY="*"
```

> **참고**: Claude Code는 SOCKS 프록시를 지원하지 않습니다.

### 기본 인증이 있는 프록시

프록시 서버가 사용자 이름/비밀번호를 요구하는 경우, URL에 포함합니다:

```bash
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

> **주의**: 스크립트에 비밀번호를 직접 입력하지 마세요. 환경변수나 안전한 자격증명 저장소를 사용하세요.

> **고급 인증(NTLM, Kerberos 등)이 필요한 경우**: 해당 인증 방식을 지원하는 LLM 게이트웨이 서비스 사용을 고려하세요.

---

## 커스텀 CA 인증서 설정

기업 환경에서는 회사 자체 발급 SSL 인증서(Custom CA)를 사용하는 경우가 있습니다. 마치 회사가 자체 발급한 사원증처럼, 외부에서는 인식하지 못하는 내부 인증서입니다. Claude Code가 이 인증서를 신뢰하게 설정해야 HTTPS 연결이 정상적으로 작동합니다.

```bash
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

이 설정은 프록시를 통한 연결이든 API 직접 연결이든 모두 적용됩니다.

---

## mTLS (상호 인증) 설정

mTLS는 "Mutual TLS"의 약자로, 서버뿐 아니라 클라이언트도 인증서를 제시해야 하는 보안 방식입니다. 일반 HTTPS가 "이 서버가 진짜 맞나요?"를 확인하는 것이라면, mTLS는 "이 서버가 진짜 맞나요? 그리고 나도 인증된 클라이언트예요"를 서로 확인하는 방식입니다. 금융, 의료, 정부 기관 등 높은 보안이 필요한 환경에서 사용합니다.

```bash
# 클라이언트 인증서 (내 신원을 증명하는 파일)
export CLAUDE_CODE_CLIENT_CERT=/path/to/client-cert.pem

# 클라이언트 개인 키 (인증서의 비밀 열쇠)
export CLAUDE_CODE_CLIENT_KEY=/path/to/client-key.pem

# 선택 사항: 암호화된 개인 키의 패스프레이즈
export CLAUDE_CODE_CLIENT_KEY_PASSPHRASE="your-passphrase"
```

---

## 필수 네트워크 접근 허용 목록

Claude Code가 정상적으로 작동하려면 아래 URL에 대한 접근이 허용되어야 합니다. 방화벽이나 프록시의 허용 목록(allowlist)에 추가하세요.

| URL | 용도 |
|-----|------|
| `api.anthropic.com` | Claude API 엔드포인트 |
| `claude.ai` | claude.ai 계정 인증 |
| `platform.claude.com` | Anthropic 콘솔 계정 인증 |

> 컨테이너 환경이나 제한된 네트워크 환경에서 Claude Code를 사용할 때 특히 중요합니다.

---

## 설정 방법: 환경변수 vs settings.json

모든 네트워크 설정은 두 가지 방식으로 적용할 수 있습니다.

**방법 1: 셸 환경변수**
```bash
# .bashrc 또는 .zshrc에 추가
export HTTPS_PROXY=https://proxy.example.com:8080
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

**방법 2: settings.json 파일**
```json
{
  "env": {
    "HTTPS_PROXY": "https://proxy.example.com:8080",
    "NODE_EXTRA_CA_CERTS": "/path/to/ca-cert.pem"
  }
}
```

settings.json 방식은 조직의 관리자가 중앙 설정 파일로 배포할 때 특히 유용합니다.

---

## 설정 조합 예시

### 프록시 + 커스텀 CA 조합

```bash
# 기업 프록시 설정
export HTTPS_PROXY=https://proxy.company.com:8080

# 프록시 서버의 자체 발급 인증서 신뢰
export NODE_EXTRA_CA_CERTS=/etc/ssl/company-ca.pem

# 내부 서비스는 프록시 우회
export NO_PROXY="*.company.internal,192.168.0.0/16"
```

### 프록시 + mTLS 조합 (보안 강화)

```bash
export HTTPS_PROXY=https://secure-proxy.company.com:8443
export NODE_EXTRA_CA_CERTS=/etc/ssl/company-ca.pem
export CLAUDE_CODE_CLIENT_CERT=/etc/ssl/my-cert.pem
export CLAUDE_CODE_CLIENT_KEY=/etc/ssl/my-key.pem
```

---

## 예시 케이스

**상황**: 금융회사의 개발자들이 회사 보안 정책상 모든 인터넷 트래픽이 회사 프록시 서버를 거쳐야 합니다. 또한 프록시 서버는 SSL 검사(SSL inspection)를 수행하므로 회사 자체 CA 인증서를 신뢰해야 합니다.

**해결책**:
1. IT 부서에서 모든 개발자 노트북의 `/etc/ssl/company-ca.pem`에 회사 CA 인증서를 배포합니다.
2. 조직의 managed settings 또는 배포 스크립트를 통해 아래 설정을 배포합니다:
   ```bash
   export HTTPS_PROXY=https://proxy.bank-company.com:8080
   export NODE_EXTRA_CA_CERTS=/etc/ssl/company-ca.pem
   export NO_PROXY="localhost,*.internal.bank-company.com"
   ```
3. `api.anthropic.com`을 프록시 허용 목록에 추가합니다.

결과: 개발자들은 회사 보안 정책을 준수하면서 Claude Code를 정상적으로 사용할 수 있습니다.

---

## 추가 자료

- [Claude Code 설정 레퍼런스](/en/settings)
- [환경변수 전체 목록](/en/settings#environment-variables)
- [문제 해결 가이드](/en/troubleshooting)
