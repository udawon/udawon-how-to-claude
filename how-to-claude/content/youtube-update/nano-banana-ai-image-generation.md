---
date: "2026-04-06"
title: "Claude Code에서 AI 이미지 생성하기 — Nano Banana 플러그인"
description: "Claude Code 플러그인 마켓플레이스에서 Nano Banana를 설치하면 Google의 최신 이미지 생성 모델로 바로 AI 이미지를 만들 수 있다"
order: 39
tags: ["신기능", "업데이트", "활용법", "youtube"]
source_url: "https://youtube.com/watch?v=qNwXSF_1dLI"
---

## 이게 뭔가요?

Claude Code 안에서 AI 이미지를 바로 만들 수 있다면 어떨까요?

**Nano Banana**는 Claude Code용 플러그인(추가 기능 모듈)으로, Google의 이미지 생성 모델인 **Gemini 3.1 Flash Image Preview**(`gemini-3.1-flash-image-preview`)를 Claude Code에 연결해 줍니다. 마치 카카오톡에 스티커팩을 추가하듯, Claude Code에 이미지 생성 기능을 끼워 넣는다고 생각하면 됩니다.

**Nano Banana 2**는 이 플러그인의 두 번째 버전으로, 더 많은 화면 비율과 512px 소형 해상도를 새로 지원합니다. 텍스트를 이미지에 넣거나, 지역 분위기에 맞는 배경 이미지를 자동으로 생성하는 것도 가능합니다.

## 왜 알아야 하나요?

- 랜딩 페이지(홍보 웹페이지)를 만들 때 관련 이미지를 Claude Code 안에서 바로 생성할 수 있다
- 디자인 외주 없이 장소에 맞는 배경 이미지를 자동으로 만들 수 있다
- 일본어, 스페인어 등 다국어 텍스트가 들어간 이미지를 별도 편집 없이 생성할 수 있다

## 어떻게 하나요?

### 사전 준비: Gemini API(구글 AI 프로그램 접근 열쇠) 키 발급

Nano Banana 플러그인은 Google의 이미지 생성 모델을 사용하므로, 먼저 Gemini API 키가 필요합니다. API 키는 외부 서비스를 사용하기 위한 고유 비밀번호라고 생각하면 됩니다.

1. [Google AI Studio](https://aistudio.google.com/api-keys)에서 API 키 발급
2. Claude Code 환경 변수에 `GEMINI_API_KEY` 설정

### 방법 1: 플러그인 마켓플레이스에서 설치

Claude Code 터미널(키보드로 명령어를 입력하는 화면)에서 아래 명령어를 순서대로 입력합니다.

```bash
# 1. Build at Scale 마켓플레이스를 Claude Code에 등록
/plugin marketplace add https://github.com/buildatscale-tv/claude-code-plugins

# 2. Nano Banana 플러그인 설치
/plugin install nano-banana@buildatscale-claude-code
```

설치 후 Claude Code를 재시작하면 `/nano` 명령어로 바로 사용할 수 있습니다.

<div class="example-case">
<strong>예시: 기본 이미지 생성</strong>

설치 후 Claude Code에 다음과 같이 요청하면 됩니다:

```
/nano 하와이 해변에서 스카이다이빙하는 장면을 생성해줘 (1:1 비율, 1K 해상도)
```

Claude Code가 자동으로 이미지를 생성하고 결과를 보여줍니다.

</div>

### 방법 2: 화면 비율 선택해서 생성

Nano Banana 2는 다양한 화면 비율을 지원합니다. 용도에 따라 선택하세요:

| 비율 | 용도 | 해상도 옵션 |
|------|------|-----------|
| 1:1 (정사각형) | SNS 게시물, 프로필 이미지 | 512px, 1K, 2K, 4K |
| 16:9 (가로) | 웹 배너, 유튜브 썸네일 | 512px, 1K, 2K, 4K |
| 9:16 (세로) | 인스타그램 스토리, 모바일 화면 | 512px, 1K, 2K, 4K |
| 북마크형 (세로 긴 직사각형) | 책 표지, 포스터 | 512px, 1K, 2K, 4K |

> **512px 해상도**: 빠른 테스트용으로 적합합니다. 아이디어를 빠르게 확인하고 싶을 때 사용하세요.

<div class="example-case">
<strong>예시: 지역 맞춤 랜딩 페이지 이미지 자동 생성</strong>

영상에서 실제로 시연한 사례입니다. 스카이다이빙 업체 웹사이트를 하와이 호놀룰루 버전으로 교체하는 요청:

```
웹사이트와 이미지를 전부 하와이 호놀룰루에 위치한 스카이다이빙 업체로 업데이트해줘
```

Claude Code가 사이트 콘텐츠 전체를 수정하고, 7개의 이미지를 하와이 분위기에 맞게 일괄 재생성했습니다. Nano Banana 2는 Google Search 그라운딩(검색 결과를 실시간으로 참조하는 기능)을 통해 특정 지역의 분위기와 특징을 이미지에 반영할 수 있습니다.

</div>

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 다국어 텍스트가 포함된 이미지 생성</strong>

일반적인 AI 이미지 생성 도구는 한국어나 일본어 텍스트를 이미지 안에 정확하게 넣기 어렵습니다. Nano Banana 2는 텍스트 생성 기능을 지원해서 일본어 인사말 카드, 스페인어 레스토랑 메뉴 배경 등을 직접 생성할 수 있습니다.

```
"물의 순환"을 주제로 스페인어 설명이 들어간 교육용 인포그래픽 이미지를 만들어줘
```

영상에서는 일본어 텍스트 카드, 스페인어 물의 순환 설명 이미지가 정상적으로 생성되었습니다.

</div>

## 주의할 점

- **Gemini API 키 필수**: 키가 없으면 이미지 생성이 되지 않습니다. Google AI Studio에서 무료로 발급 가능합니다.
- **플러그인은 커뮤니티 제작**: Nano Banana 플러그인은 공식 Anthropic 제품이 아닌 Build at Scale 채널이 만든 서드파티(제3자 제작) 플러그인입니다. 업데이트나 지원은 해당 저장소([GitHub](https://github.com/buildatscale-tv/claude-code-plugins))를 통해 이루어집니다.
- **위치 인식은 Google Search 경유**: "하와이 느낌"처럼 지역 특색을 반영하는 것은 모델 자체에 지리 정보가 내장된 게 아니라, Google 검색 데이터를 실시간으로 참조하는 방식입니다.

## 정리

- Claude Code에 `/plugin` 명령어로 Nano Banana를 설치하면 AI 이미지 생성이 가능해진다
- Nano Banana 2는 Gemini 3.1 Flash Image Preview 모델을 사용하며, 512px~4K 해상도와 다양한 화면 비율을 지원한다
- 랜딩 페이지 이미지 일괄 생성, 다국어 텍스트 이미지, 지역 맞춤 이미지 등 실무 활용이 가능하다

---

> 참고 영상: [Generate AI Images in Claude Code (Nano Banana 2)](https://youtube.com/watch?v=qNwXSF_1dLI) — Build at Scale (2026-03-12)
