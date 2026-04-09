---
title: "보안 헤더 설정하기"
description: "\"보안 헤더 설정해줘\" 한 마디로 사이트 보안을 강화하는 방법과 각 헤더의 역할"
order: 10
tags: ["워크플로우", "보안", "헤더", "Next.js", "CSP", "HTTPS", "배포"]
---

## "<span class="keyword-highlight">보안 헤더 설정해줘</span>"가 뭘 하는 건가요?

웹사이트를 만들고 배포하면, 브라우저와 서버 사이에 <span class="keyword-highlight">HTTP 헤더</span>라는 게 오갑니다.
이 중 <span class="keyword-highlight">보안 헤더</span>는 브라우저에게 "이 사이트에서는 이런 건 허용하고, 저런 건 차단해"라고 지시하는 규칙입니다.

Claude에게 "<span class="keyword-highlight">보안 헤더 설정해줘</span>"라고 말하면, 사이트에 맞는 보안 헤더 7개를 자동으로 설정해줍니다.

<div class="example-case">

비유: 가게 문에 붙이는 안내문

    "CCTV 작동 중" → 범죄 억제
    "관계자 외 출입금지" → 무단 접근 차단
    "음식물 반입 금지" → 외부 위험 요소 차단

    보안 헤더도 같은 역할입니다.
    브라우저에게 "이건 허용, 저건 차단"이라고 알려주는 안내문.

</div>

---

## 설정되는 보안 헤더 7개

### 1. <span class="keyword-highlight">Content-Security-Policy</span> (CSP)

**한 줄 설명:** "이 사이트에서 허락한 코드만 실행해라"

해커가 사이트에 악성 스크립트를 삽입하는 공격(<span class="keyword-highlight">XSS</span>)을 막습니다.
어디서 온 스크립트, 스타일, 폰트, 이미지를 허용할지 하나하나 지정합니다.

```
Content-Security-Policy:
  default-src 'self';                          ← 기본: 내 사이트 것만
  script-src 'self' https://cdn.tailwindcss.com;  ← JS: 내 것 + Tailwind CDN만
  style-src 'self' https://fonts.googleapis.com;  ← CSS: 내 것 + 구글 폰트만
  font-src 'self' https://fonts.gstatic.com;      ← 폰트 파일: 내 것 + 구글만
  img-src 'self' data:;                        ← 이미지: 내 것 + data URI만
  frame-ancestors 'none';                      ← iframe 삽입 완전 차단
```

<div class="warning-box">

<span class="keyword-highlight">CSP</span>는 사이트마다 다르게 설정해야 합니다. 외부 서비스(Google Analytics, 채팅 위젯, 결제 모듈 등)를 쓰면 해당 도메인을 허용 목록에 추가해야 합니다. Claude가 사이트 코드를 분석해서 자동으로 맞춰줍니다.

</div>

### 2. <span class="keyword-highlight">Strict-Transport-Security</span> (HSTS)

**한 줄 설명:** "무조건 <span class="keyword-highlight">HTTPS</span>로만 접속해라"

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

- `max-age=63072000` → 2년간 이 규칙 유지
- `includeSubDomains` → 하위 도메인도 적용
- `preload` → 브라우저에 미리 등록 (첫 방문부터 적용)

<span class="keyword-highlight">HTTP</span>(암호화 없음)로 접속하면 자동으로 <span class="keyword-highlight">HTTPS</span>(암호화)로 전환합니다.
도청이나 <span class="keyword-highlight">중간자 공격</span>을 방지합니다.

<div class="example-case">

비유: 건물 출입구에 보안 게이트를 설치하는 것

     일반 출입구(HTTP) = 아무나 들어올 수 있음
     보안 게이트(HTTPS) = 신분증 확인 후 입장

     HSTS = "이 건물은 보안 게이트로만 들어오세요" 안내판
</div>

### 3. <span class="keyword-highlight">X-Frame-Options</span>

**한 줄 설명:** "다른 사이트가 내 사이트를 <span class="keyword-highlight">iframe</span>으로 감싸지 못하게 해라"

```
X-Frame-Options: DENY
```

피싱 사이트가 내 사이트를 <span class="keyword-highlight">iframe</span> 안에 넣고, 그 위에 가짜 버튼을 덮어씌우는 공격(<span class="keyword-highlight">클릭재킹</span>)을 막습니다.

<div class="example-case">

비유: 클릭재킹은 이런 것

     진짜 은행 사이트 위에 투명한 가짜 버튼을 덮어씌움
     사용자는 "로그인"을 누른 줄 알지만
     실제로는 "송금 확인"을 누르게 되는 것

     X-Frame-Options = "내 사이트를 다른 액자에 끼워넣지 마"
</div>

### 4. <span class="keyword-highlight">X-Content-Type-Options</span>

**한 줄 설명:** "파일 종류를 브라우저 맘대로 추측하지 마라"

```
X-Content-Type-Options: nosniff
```

브라우저가 `.txt` 파일을 JavaScript로 실행하는 등의 <span class="keyword-highlight">MIME 타입 혼동 공격</span>을 방지합니다.

### 5. <span class="keyword-highlight">Referrer-Policy</span>

**한 줄 설명:** "다른 사이트로 이동할 때 내 URL 정보를 함부로 보내지 마라"

```
Referrer-Policy: strict-origin-when-cross-origin
```

- 같은 사이트 내 이동: 전체 URL 전달 (정상)
- 다른 사이트로 이동: 도메인만 전달 (경로 정보 숨김)
- <span class="keyword-highlight">HTTPS</span> → <span class="keyword-highlight">HTTP</span> 이동: 아무것도 안 보냄

<div class="example-case">

비유: 택배 보낼 때

     같은 회사 내부 전달 = 보내는 사람 이름+부서+내선번호 다 적음
     외부 업체에 보낼 때 = 보내는 사람 이름+회사명만 적음 (내선번호는 안 적음)
     보안 등급이 낮은 곳 = 아예 익명으로 보냄
</div>

### 6. <span class="keyword-highlight">Permissions-Policy</span>

**한 줄 설명:** "카메라, 마이크 같은 건 쓸 일 없으니 꺼라"

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

사이트에서 필요 없는 브라우저 기능을 명시적으로 차단합니다.
`interest-cohort=()`는 구글의 사용자 추적 기술(<span class="keyword-highlight">FLoC</span>)도 차단합니다.

### 7. <span class="keyword-highlight">X-XSS-Protection</span>

**한 줄 설명:** "구형 브라우저의 <span class="keyword-highlight">XSS</span> 필터를 켜라"

```
X-XSS-Protection: 1; mode=block
```

최신 브라우저는 <span class="keyword-highlight">CSP</span>로 충분하지만, IE 등 구형 브라우저를 위한 보험입니다.

---

## 실제 구현 위치

Next.js 프로젝트에서는 <span class="keyword-highlight">next.config.ts</span>에 설정합니다:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
      "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com",
      "img-src 'self' data: https://placehold.co",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## Claude에게 요청하는 법

<div class="example-case">

"<span class="keyword-highlight">보안 헤더 설정해줘</span>"

이 한 마디면 됩니다. Claude가 알아서:

1. 사이트 코드를 분석해서 사용 중인 외부 리소스(CDN, 폰트, API 등)를 파악
2. <span class="keyword-highlight">CSP</span>를 해당 리소스에 맞게 설정
3. 나머지 6개 헤더도 함께 적용
4. 빌드 테스트까지 완료
</div>

**외부 서비스를 추가했을 때:**

<div class="example-case">

"<span class="keyword-highlight">CSP에 Google Analytics 도메인 추가해줘</span>"

"<span class="keyword-highlight">채널톡 위젯 추가했는데 CSP 업데이트해줘</span>"

-> Claude가 해당 서비스의 도메인을 CSP 허용 목록에 추가
</div>

<div class="warning-box">

나중에 외부 서비스를 추가하면(Google Analytics, 채팅 위젯 등), <span class="keyword-highlight">CSP</span> 허용 목록도 업데이트해야 합니다. 안 하면 해당 서비스가 브라우저에서 차단되어 동작하지 않습니다.

</div>

---

## 보안 헤더 적용 확인하는 법

배포 후 아래 방법으로 확인할 수 있습니다:

**방법 1: 브라우저 개발자 도구**
1. 사이트 접속 → <span class="keyword-highlight">F12</span> → <span class="keyword-highlight">Network</span> 탭
2. 첫 번째 요청 클릭 → <span class="keyword-highlight">Response Headers</span> 확인

**방법 2: 온라인 도구**
- [SecurityHeaders.com](https://securityheaders.com)에 사이트 URL 입력
- <span class="keyword-highlight">A+ 등급</span>이면 잘 된 것

<div class="example-case">

비유: 건강검진 결과표

     보안 헤더 = 각종 검사 항목
     SecurityHeaders.com = 종합 검진 점수

     A+ = "아주 건강합니다"
     F = "당장 치료가 필요합니다"
</div>

---

## 요약

| 헤더 | 막는 공격 | 쉬운 설명 |
|------|-----------|-----------|
| **<span class="keyword-highlight">CSP</span>** | XSS (악성 스크립트 삽입) | 허락한 코드만 실행 |
| **<span class="keyword-highlight">HSTS</span>** | 도청, 중간자 공격 | HTTPS 강제 |
| **<span class="keyword-highlight">X-Frame-Options</span>** | 클릭재킹 | iframe 삽입 차단 |
| **<span class="keyword-highlight">X-Content-Type-Options</span>** | MIME 혼동 | 파일 타입 추측 금지 |
| **<span class="keyword-highlight">Referrer-Policy</span>** | URL 정보 노출 | 이동 시 경로 숨김 |
| **<span class="keyword-highlight">Permissions-Policy</span>** | 불필요한 기능 악용 | 카메라/마이크 등 차단 |
| **<span class="keyword-highlight">X-XSS-Protection</span>** | XSS (구형 브라우저) | 레거시 브라우저 보험 |
