---
date: "2026-03-12"
title: "Figma MCP — 코드를 디자인으로, 디자인을 코드로"
description: "Claude Code와 Figma를 MCP로 연결해서 코드↔디자인 양방향 워크플로우 구축하기"
order: 13
tags: ["설정", "연동", "youtube"]
---

## 이게 뭔가요?

**Figma MCP**는 Claude Code와 Figma를 연결해서, **코드를 Figma 디자인으로** 보내거나, **Figma 디자인을 코드로** 변환하는 양방향 다리입니다.

> 비유: 번역기가 한국어↔영어 양방향 번역을 하듯이, Figma MCP는 **코드↔디자인을 양방향으로 변환**해줘요. 개발자와 디자이너가 같은 언어로 소통할 수 있게 되는 거예요.

아이디어는 어디서든 시작할 수 있어요. 문서에서, Figma 디자인에서, 또는 코드에서. Figma MCP는 이 모든 출발점을 **하나의 캔버스에서 합칠 수 있게** 해줍니다.

## 왜 알아야 하나요?

- **코드로 만든 프로토타입을 Figma에서 공유**: 팀원들이 코드를 몰라도 디자인을 보고 피드백 가능
- **Figma 디자인을 코드로 바로 변환**: 디자이너가 만든 시안을 Claude Code가 코드로 구현
- **디자인 탐색 → 코드 반영 → 디자인 업데이트** 사이클이 매끄러워짐
- **협업 효율화**: 디자이너와 개발자 사이의 핸드오프(전달) 과정 간소화

## 어떻게 하나요?

### 방법 1: 플러그인으로 설치

```
/plugin → Figma 검색 → 설치
```

Claude Code에서 `/plugin`을 입력하고 Figma를 검색하면 MCP 플러그인을 설치할 수 있습니다.

### 방법 2: CLI로 직접 추가

```bash
claude mcp add figma --transport streamable-http
```

실행하면 브라우저가 열리면서 **Figma 인증**을 요청합니다. "Claude에게 내 Figma 접근 허용" → 승인.

<div class="example-case">
<strong>💬 예시: 코드 → Figma로 보내기</strong>

```
1. Claude Code에서 앱을 로컬로 실행
   → "내 앱을 로컬에서 실행해줘"
   → localhost에서 프리뷰 확인

2. Figma로 디자인 전송
   → "이 앱의 현재 UI를 Figma에 보내줘"
   → Claude가 Figma MCP를 통해 디자인 레이어를 Figma 캔버스에 생성

3. Figma에서 팀원들과 함께 디자인 탐색/수정

4. 수정된 디자인을 다시 코드로 반영
   → "Figma에서 수정된 부분을 코드에 반영해줘"
```

</div>

### 실제 워크플로우: Code to Canvas

Figma 팀에서 공식으로 소개한 워크플로우입니다:

1. **코드에서 시작**: Claude Code로 프로토타입 개발
2. **Figma로 전송**: MCP를 통해 코드 UI를 Figma 디자인 레이어로 변환
3. **협업 탐색**: Figma 캔버스에서 팀원들과 아이디어 비교, 피드백
4. **코드로 복귀**: 수정사항을 다시 코드에 반영

<div class="example-case">
<strong>💬 예시: 필터링 UI 개선</strong>

```
상황: 레시피 브라우징 앱의 필터링 기능이 있는데, 디자인을 다듬고 싶음

1. Claude Code: "이 앱을 localhost에서 실행해줘"
2. 프리뷰 확인 → 필터링 UI가 좀 투박함
3. Claude Code: "현재 필터링 UI를 Figma에 보내줘"
4. Figma에서 디자이너와 함께 레이아웃 수정
5. Claude Code: "Figma에서 수정한 필터링 디자인을 코드에 반영해줘"
6. 코드 업데이트 완료!
```

</div>

## 실전 예시

<div class="example-case">
<strong>📌 실전 케이스: 디자이너 없이 프로토타입 공유</strong>

**상황**: 1인 개발자가 코드로 프로토타입을 만들었는데, 비개발자 팀원에게 보여주고 피드백을 받고 싶음

**기존 방식**: 스크린샷 찍어서 슬랙에 올리기 → 피드백이 "저기 좀 바꿔주세요" 수준으로 모호

**Figma MCP 활용**:
1. Claude Code로 Figma에 디자인 전송
2. 팀원이 Figma에서 직접 코멘트, 수정 제안
3. Claude Code가 수정사항을 코드에 반영

**결과**: 스크린샷+슬랙 핑퐁 없이, 정확한 디자인 피드백 사이클 구축

</div>

## 주의할 점

- **Figma 계정 필요**: MCP 연결 시 Figma 인증이 필요합니다
- **양방향이지만 완벽하지 않을 수 있음**: 복잡한 인터랙션이나 애니메이션은 변환 시 손실될 수 있음
- **Figma MCP 공식 문서 참고**: 자세한 설정은 Figma 개발자 문서에서 확인
- **팀 플랜이면 더 효과적**: Figma 무료 플랜에서는 일부 기능 제한 가능

## 정리

- Figma MCP = Claude Code와 Figma를 연결하는 양방향 다리
- 코드 → Figma 디자인 전송, Figma 수정 → 코드 반영 모두 가능
- 디자이너-개발자 협업을 한 단계 매끄럽게 만들어줌

> 참고 영상: [Code to Canvas: Claude Code](https://www.youtube.com/watch?v=C0fNUdjQxeY) — Figma
