---
title: "Cowork"
description: "코딩 없이 파일·문서 업무를 Claude에게 맡기는 데스크톱 기능"
order: 7
tags: ["cowork", "데스크톱", "파일", "문서", "일반사용자"]
---

## 한 줄 요약

**Cowork = Claude Code의 파일 조작 능력을 일반 업무에 쓸 수 있게 만든 데스크톱 앱 기능**

터미널 없이, 코딩 지식 없이, 폴더 접근 권한만 주면 Claude가 파일을 읽고 편집하고 생성합니다.

---

## Claude Code와의 차이

- **Claude Code:** 터미널(CLI) → 코드 파일 중심 → 개발자용
- **Cowork:** 데스크톱 앱 GUI → 모든 파일 종류 → 일반 사용자용

기반 기술은 동일합니다. Cowork는 Claude Code의 일반인용 래퍼(wrapper)입니다.

---

## 할 수 있는 것

| 작업 | 예시 |
|------|------|
| 파일 정리 | 산재된 파일 자동 분류·이름 변경 |
| 문서 생성 | 흩어진 노트 → 보고서 초안 |
| 데이터 변환 | 스크린샷 → 스프레드시트 |
| 브라우저 조작 | Chrome 확장 프로그램으로 웹 접근 |
| 외부 서비스 연동 | Slack, Google Drive 등 커넥터 |

---

## 사용 방법

1. **데스크톱 앱**에서 `Cowork` 사이드바 클릭
2. Claude가 접근할 **폴더 지정** (명시적으로 권한 부여)
3. 자연어로 작업 지시
4. Claude가 계획 수립 → 단계별 실행 → 진행 상황 안내

파괴적 작업(파일 삭제 등)은 실행 전 확인을 요청합니다.

---

## 예시 케이스

### 회의록 정리

<div class="example-case">

폴더: `/Documents/회의록/`

지시: "<span class="keyword-highlight">이 폴더 안에 흩어진 회의록들을 읽고
날짜별로 정리한 뒤 핵심 액션 아이템만 모아서
summary.md 파일을 만들어줘</span>"
</div>

### 파일 일괄 정리

<div class="example-case">

폴더: `/Downloads/`

지시: "<span class="keyword-highlight">파일명이 뒤죽박죽인 이미지들을
찍은 날짜 기준으로 YYYY-MM-DD_이름.확장자
형식으로 이름 바꿔줘</span>"
</div>

### 스프레드시트 생성

<div class="example-case">

지시: "<span class="keyword-highlight">이 영수증 사진들을 보고
날짜, 항목, 금액을 추출해서
expenses.xlsx로 만들어줘</span>"
</div>

---

## 주의사항

- **파일 삭제·덮어쓰기도 실행 가능** — 되돌리기 어려운 작업 전 백업 권장
- **프롬프트 주입 위험** — 외부 문서 안에 악의적 지시가 있으면 오작동 가능
- 지시가 구체적일수록 오류 가능성이 줄어듦

---

## 이용 조건

- **플랫폼**: macOS / Windows 데스크톱 앱
- **플랜**: Pro, Team, Enterprise, Max
- **현황**: 리서치 프리뷰 (대기자 명단 신청 가능)

---

## Claude Code 사용자라면?

Claude Code를 터미널에서 직접 쓸 수 있다면 Cowork가 제공하는 기능을 이미 전부 할 수 있습니다.

단 하나의 예외: **브라우저 조작(Chrome 확장 연동)** — Claude Code 단독으로는 안 되고 Playwright 등 MCP를 별도 설치해야 합니다. Cowork는 이를 기본 내장합니다.

> MCP 세팅까지 할 줄 안다면 → Cowork 불필요
> MCP 세팅이 번거롭다면 → 브라우저 연동 목적으로만 가치 있음
