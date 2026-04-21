---
date: "2026-04-21"
title: "Claude Design 실전 가이드: 대화로 랜딩페이지·프레젠테이션 만들기"
description: "Anthropic이 출시한 Claude Design으로 비개발자가 랜딩페이지·프레젠테이션·UI 프로토타입을 대화만으로 만드는 방법"
order: 53
tags: ["신기능", "활용법", "워크플로우", "youtube"]
source_url: "https://youtube.com/watch?v=7o7E1dicLh4"
---

## 이게 뭔가요?

Claude Design은 Anthropic(클로드 제조사)이 2026년 4월 17일 Anthropic Labs(앤스로픽의 실험 제품 조직) 이름으로 공개한 새 시각 제작 도구입니다. 글로 설명만 하면 클로드가 랜딩페이지·프레젠테이션·앱 UI 초안을 실제로 눈에 보이는 화면으로 만들어 줍니다. 웹 주소는 `claude.ai/design`이고, Claude Pro 이상(Pro·Max·Team·Enterprise) 구독자가 연구 미리보기(Research Preview - 정식 출시 전 체험판) 형태로 쓸 수 있습니다.

카카오톡 대화창에 "이런 느낌의 홈페이지 만들어 줘"라고 쓰면 옆 화면에서 실제 홈페이지가 그려지는 장면을 떠올리면 됩니다. 내가 말하면 클로드가 그리고, 마음에 안 드는 부분을 손으로 짚어 수정 요청하면 그 자리에서 바뀝니다.

## 왜 알아야 하나요?

비개발자·마케터·창업자에게는 "아이디어는 있는데 보여줄 방법이 없다"는 장벽이 가장 크게 다가옵니다. 영상 제작자(AI Run the Show 채널)는 이 간극을 이렇게 정리합니다.

- 디자이너는 시간 때문에 10개 아이디어 중 1~2개만 시도한다
- 창업자는 머릿속 제품 그림을 보여주려면 사람을 고용하거나 도구를 몇 달 배워야 한다
- 기획자(PM)는 기능 흐름을 설명하려고 5문단 브리프를 쓰고 디자이너가 맞게 해석해 주길 기다린다

Claude Design은 이 "생각 → 화면" 구간을 대화로 건너뛰게 해 줍니다. 다만 정식 출시가 아니라 연구 미리보기 단계라는 점, 그리고 사용량 한도가 따로 있다는 점(뒤에서 설명)은 미리 감안하고 써야 합니다.

## 어떻게 하나요?

### 1. 접속과 시작 화면

1. 웹 브라우저에서 `claude.ai` 로그인
2. 왼쪽 메뉴에서 Design 아이콘 클릭 (Claude Pro 이상 구독 필요)
3. 첫 화면에서 프로젝트 종류를 고른다
   - **Prototype**: 랜딩페이지·앱 UI·인터랙티브 시안
   - **Slide Deck**: 프레젠테이션(발표 자료)
   - **Template**: 미리 만들어진 샘플에서 시작
4. 프로젝트 이름을 적고 `Create` 클릭

### 2. 4단계 워크플로우

공식 소개 영상(i945ikMP_Mg)이 정리한 4단계입니다.

```
1. 브랜드 구축   → 기존 코드/Figma에서 디자인 시스템 학습
2. 인풋 입력    → 글·이미지·문서·웹사이트 캡처로 시작
3. 대화형 다듬기 → 채팅·코멘트·편집으로 협업
4. 내보내기    → 링크·Canva·PDF·PPTX·HTML
```

### 3. 디자인 시스템 자동 추출 (가장 강력한 기능)

디자인 시스템(Design System - 한 회사의 색·글꼴·로고를 모아 둔 규칙 묶음)을 Claude가 스스로 읽어 만들어 줍니다. 4가지 인풋을 지원합니다.

| 입력 소스 | 쓰는 경우 |
|---|---|
| GitHub 저장소 링크 | 웹사이트 코드가 GitHub에 올라가 있을 때 |
| 로컬 코드 폴더 업로드 | 내 컴퓨터에 프로젝트 코드가 있을 때 |
| Figma 파일(.fig) 업로드 | 디자이너가 만든 파일이 있을 때 |
| 폰트·로고·이미지 직접 업로드 | 코드도 Figma도 없고 자산만 있을 때 |

**Figma 파일에서 추출하는 실제 흐름** (영상 EiIZBOu4MHk):

1. Figma 메뉴에서 `파일 → 로컬 복사본 저장` → `.fig` 파일 생성
2. Claude Design에서 `.fig` 드래그&드롭
3. 몇 분 기다리면 Claude가 Primary colors, Grays, 시맨틱 컬러, 폰트, 로고마크, 간격(Spacing), 랜딩페이지 초안까지 자동 정리
4. 각 항목에서 `Looks good` 또는 수정 요청 후 확정

<div class="example-case">
<strong>예시: 내 블로그 스타일 그대로 프레젠테이션 만들기</strong>

자기 웹사이트 GitHub 저장소 URL을 디자인 시스템 소스로 붙여넣으면, Claude가 웹사이트의 색과 폰트를 읽어 저장해 둡니다. 그 뒤 `Slide Deck`에서 "내 AI 서비스 소개 발표 자료 만들어 줘"라고만 말해도 슬라이드가 사이트와 같은 톤으로 나옵니다. Canva처럼 매번 로고·색을 다시 얹을 필요가 없습니다(영상 C5TbJmLLokw 시연).

</div>

### 4. 두 가지 수정 방식: Tweaks vs Comments

디자인을 받은 뒤 바꿀 때 방법이 두 가지 있습니다. 이름이 비슷하게 들리지만 성격이 다릅니다.

| 방식 | 동작 | 비유 |
|---|---|---|
| **Tweaks**(트윅스) | 전역 속성 조절. 색·폰트·헤드라인·모션 등을 슬라이더·드롭다운으로 바꿈 | 방 전체 조명 밝기 조절 |
| **Comments**(코멘트) | 특정 요소에 자연어로 "이 버튼 더 크게" 같은 지시 | 벽의 한 액자만 집어서 "이거 바꿔" |

Tweaks에서 특이한 점은 **프로젝트마다 Claude가 슬라이더를 새로 만들어 준다**는 것입니다. 일반 설정창이 아니라 "당신이 만든 이 디자인에 맞는 조절기"를 띄워 줍니다. 영상 7uW1SKmx-Ic에서는 슬라이더가 기본 5개 수준이었는데, "트윅스를 더 공격적으로 늘려 달라"고 요청하니 15개까지 확장된 장면이 나옵니다(CTA 문구·Emberglow·Overlay Darkness 등).

Comments 쪽에서는 영역을 마우스로 그려 표시하고("Draw" 기능) "이 두 요소 지워 줘" 같은 지시도 가능합니다(영상 VNEep9Z7cfk에서 로고의 `PRO` 글자와 M 심볼을 ✕로 그어 삭제).

### 5. 인터랙티브 3D·게임 요소까지

영상 EiIZBOu4MHk에서 단일 프롬프트(프롬프트 - AI에게 보내는 요청 메시지)로 만들어 낸 결과물 중 대표적인 것:

- 회전 속도 조절·일시정지·도시 클릭 시 정보 표시가 되는 **인터랙티브 3D 지구본**
- 퀴즈 iOS 앱 화면 5단계 플로우(영상 ATyTXubBhZ4)
- 마우스 위치에 반응하는 자연·태양계·우주 배경화면 3종
- 단어별 입자 효과(electric → 번개, spark → 스파크) 입혀진 텍스트 박스

내부적으로 HTML/CSS/JavaScript로 만들어지기 때문에 `Present → New tab`을 누르면 실제 웹에서 동작하는 URL이 열립니다.

### 6. 내보내기와 Claude Code 연결

상단 우측 `Share` 버튼에서 네 가지 경로가 있습니다.

```
Share/Export
├─ 조직 내 링크 공유 (View-only 또는 Edit 권한)
├─ PDF / PPTX / Canva / HTML 내보내기
├─ Hand off to Claude Code  ← 코드 구현 넘김
└─ Download ZIP            ← 비디오·대용량 자원 포함 시
```

**Claude Code 핸드오프(Hand off)** 는 버튼 하나로 만들어진 디자인을 코드로 구현하는 Claude Code 세션에 넘기는 기능입니다. 영상 EiIZBOu4MHk의 실제 순서:

1. `Export → Hand off to Claude Code` 클릭
2. 복사된 명령어를 Claude Code(키보드로 명령어를 입력하는 화면 기반의 클로드 개발 도구) 세션에 붙여넣기
3. `bypass permissions`(권한 확인 건너뛰기) 옵션으로 실행
4. Claude Code가 폴더·파일을 만들어 실제 웹사이트 코드로 변환
5. 이어서 "Vercel(클라우드 호스팅 서비스)에 배포해 줘"로 실제 공개 URL까지 연결

### 7. Figma 우회 내보내기

영상 EiIZBOu4MHk는 Claude Design에 "Export to Figma"가 없다고 지적하면서 우회법을 보여 줍니다.

1. `Present → New tab`으로 디자인을 실제 웹 페이지로 연다
2. Chrome 확장 프로그램(브라우저에 기능을 더하는 작은 프로그램) `HTML to Design` 설치
3. 확장에서 현재 페이지 캡처 → `Copy`
4. Figma 새 프로젝트에서 `Paste` → 모든 레이어가 편집 가능한 상태로 붙여 넣어짐

Figma를 계속 쓰던 디자이너라면 "Claude Design에서 뼈대, Figma에서 손 다듬기" 식으로 조합할 수 있다는 뜻입니다. 다만 공식 기능이 아니라 서드파티(제3자 제공) 확장을 쓰는 방법이므로 호환성은 확장 제작자의 대응에 달려 있습니다.

### 8. 호스팅 옵션: Vercel vs 전통 호스팅

공식 추천은 Claude Code → Vercel 연동이지만(영상 EiIZBOu4MHk), 도메인과 호스팅을 한 곳에서 관리하고 싶은 경우 전통 호스팅 업체를 쓰는 방법도 있습니다. 영상 VNEep9Z7cfk는 브라질 기준으로 HostGator를 예로 듭니다.

전통 호스팅 배포 순서 요약:

1. HostGator(또는 다른 호스팅)에서 도메인 + 호스팅(M 플랜 같은 중간 상품) 구매
2. Claude Design → `Share → Export as HTML` → `index.html` 다운로드
3. 파일 이름을 `index.html`로 확정
4. 호스팅 업체의 cPanel(호스팅 관리 화면) → 파일 관리자(File Manager) → 해당 도메인 폴더
5. `Upload`로 `index.html` 업로드 → 도메인 접속 시 사이트가 뜸

Vercel은 "코드 변경 시 자동 재배포·무료 HTTPS" 같은 현대적 편의가 있고, 전통 호스팅은 "한 곳에서 도메인+이메일+파일 전부 관리" 편의가 있습니다. 트레이드오프(trade-off - 장단점 맞교환)는 상황에 따라 다르므로 한쪽이 정답은 아닙니다.

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 30분 만에 애니메이션 배경 랜딩페이지</strong>

영상 7uW1SKmx-Ic의 흐름을 정리한 결과입니다.

1. **정지 이미지 준비**: 히어로(Hero - 페이지 상단 가장 큰 시각 영역) 구도를 먼저 정한 뒤, 이미지 생성 AI(Nano Banana Pro)에서 "왼쪽 비우고 오른쪽에 주인공" 구도로 정지 이미지 한 장 생성
2. **Claude Design 진입**: `Prototype → High fidelity → Create`
3. **컨텍스트 업로드**: 방금 만든 이미지 + 프롬프트(제품 설명·섹션 구성·원하는 모션) 업로드. 프롬프트 끝에 "시작 전에 질문이 있으면 물어봐 줘"를 붙이면 Claude Design이 Plan Mode(계획 모드)로 들어가 타이포그래피·컬러 팔레트·Copy Voice·섹션 순서·Tweaks 등을 단계별로 질문
4. **변형 3개 탐색**: "같은 페이지의 레이아웃 변형 2개를 더 만들어 달라"고 요청 → Cinematic·Archive·Terminal 3개 변형을 한 화면에서 비교
5. **Tweaks 확장**: 마음에 드는 변형 고정 후 "Tweaks를 공격적으로 더 만들어 달라"로 슬라이더 15개 수준까지 확장
6. **배경 영상 교체**: 정지 이미지를 비디오 생성 AI(Seedance 2.0·Kling 3.0·VO 3.1 등)에 넣어 15초 루프 영상으로 변환 → Claude Design 채팅창에 MP4 드래그&드롭하면서 "히어로 배경을 방금 올린 비디오로 교체해 줘"
7. **코드 인수인계**: `Share → Download ZIP`(비디오 포함이라 ZIP 권장) → 압축 해제 폴더를 Claude Code 세션에 드롭 → "이 파일들 추출해서 개발 서버 띄워 줘"

영상 제작자가 사용량 기준으로 계산한 비용은 **랜딩페이지 1개당 약 $5 상당의 Extra Usage**(기본 한도 초과 요금). Claude Pro 기본 한도와 별도로 Claude Design은 자체 한도가 있다는 경고가 영상에 명시되어 있습니다.

</div>

<div class="example-case">
<strong>실전 케이스: AI 서비스 영업용 프레젠테이션(영상 C5TbJmLLokw)</strong>

1. 개인 웹사이트 GitHub 링크로 디자인 시스템 구축
2. Home → `Slide Deck` 선택 → 디자인 시스템 활성화
3. 프롬프트: "AI·자동화 서비스 제안 프레젠테이션. 고객 이익 강조"
4. Claude가 질문: 청중(pymes 대표)·맥락(1:1 미팅)·길이·강조점(가격/사용 사례/이익)·CTA(무료 상담 예약)·톤 입력
5. 수 분 뒤 9장짜리 슬라이드 완성. 회전 단어 애니메이션·CTA 버튼 포함
6. Comments로 특정 버튼만 지목해 "링크 빼고 '무료 상담 예약' 문구만 남겨라" 요청 → 즉시 반영
7. `Export → PowerPoint/Canva/PDF/HTML` 중 선택

</div>

## 협업·공유 기능

영상 7o7E1dicLh4는 협업 구조를 이렇게 정리합니다.

- **조직 범위 공유**: 같은 조직 구성원 대상 View-only 또는 Edit 권한
- **그룹 대화**: 여러 사람이 같은 Claude와 동시에 채팅하면서 같이 디자인 수정
- **외부 통합**: 공식 파트너로 Canva 언급(Canva CEO Melanie Perkins 인용). Brilliant의 Olivia Sue는 "다른 도구에서 20개 넘는 프롬프트가 필요했던 페이지를 Claude Design에서는 2개로 끝냈다"고 발언. Datadog의 Anish Kaviani는 "브리프·목업·리뷰로 일주일 걸리던 과정이 한 번의 대화로 끝난다"고 발언(영상 i945ikMP_Mg 소개). 이런 증언은 벤더 자료이므로 실제 체감은 팀 상황에 따라 다를 수 있습니다.

## 주의할 점

**연구 미리보기(Research Preview)라는 전제**
- 정식 출시가 아닙니다. 기능·가격·한도는 변경될 수 있습니다.
- 현재는 웹(`claude.ai/design`)에서만 접근 가능. 데스크톱 앱에는 아직 없습니다(영상 ATyTXubBhZ4).

**사용량 한도는 별도**
- Claude Pro/Max 채팅 한도와 Claude Design 한도는 따로 계산됩니다.
- 영상 7uW1SKmx-Ic 사례에서는 랜딩페이지 1개에 약 $5 상당의 Extra Usage가 발생했습니다. 탐색 단계를 길게 끌면 예상보다 빨리 소진되므로, 핵심 의사결정을 먼저 내리고 잔손질은 Claude Code로 넘기는 전략이 현실적입니다.

**품질 확인은 여전히 필요**
- Claude가 잡아 준 디자인 시스템이 매번 정확하지는 않습니다. 영상 EiIZBOu4MHk에서도 로고 교체·색 재확인 같은 수동 보정이 있었습니다. "첫 결과가 곧 최종"이 아니라 "첫 결과가 90% 완성"이라는 감각으로 쓰는 편이 안전합니다.

**Export to Figma 부재**
- 공식 Figma 내보내기는 아직 없습니다. `HTML to Design` 같은 서드파티 확장으로 우회해야 합니다. Figma가 팀의 핵심 도구라면 이 한계가 도입 결정에 영향을 줄 수 있습니다.

**키보드 단축키 참고**
- `Present → New tab`으로 실제 웹 페이지처럼 미리보기 열기는 Mac·Windows 동일하게 버튼 클릭
- 브라우저 전체 화면: Mac은 `Ctrl + Cmd + F`, Windows는 `F11`

## 정리

- Claude Design은 대화만으로 랜딩페이지·프레젠테이션·앱 UI를 만드는 Anthropic의 새 도구이고, Pro 이상 구독자만 `claude.ai/design`에서 연구 미리보기로 쓸 수 있다.
- 디자인 시스템 자동 추출·Tweaks·Comments·Claude Code 핸드오프가 핵심 기능이며, 90% 완성은 Design에서 잡고 10% 잔손질은 Claude Code로 넘기는 구성이 사용량 관리 측면에서 합리적이다.
- Figma 내보내기 부재·별도 사용량 한도·연구 미리보기라는 한계는 사전에 인지하고 도입 여부를 판단해야 한다.

---

**참고 영상**
- 메인: [Claude Design by Anthropic Just Changed Everything](https://youtube.com/watch?v=7o7E1dicLh4)
- 디자이너 관점: [Claude Design: 3 Real Use Cases for Professional Designers](https://youtube.com/watch?v=EiIZBOu4MHk)
- 공식 소개: [Claude Design: The New AI Powerhouse for Prototyping & Design](https://youtube.com/watch?v=i945ikMP_Mg)
- Seedance 2.0 연동: [Claude Design + Seedance 2.0 = INSANE Animated Websites](https://youtube.com/watch?v=7uW1SKmx-Ic)
- 디자인 시스템 시연: [Adiós Canva: Probando el nuevo Claude Design](https://youtube.com/watch?v=C5TbJmLLokw)
- 4가지 유스케이스: [New Claude Design - Cool Use Cases](https://youtube.com/watch?v=ATyTXubBhZ4)
- 호스팅까지 공개: [CLAUDE DESIGN: LANDING PAGES INCRÍVEIS!](https://youtube.com/watch?v=VNEep9Z7cfk)
- 영역 편집·PPT: [彻底颠覆Figma！实测Claude Design神器](https://youtube.com/watch?v=Jucq2HDg7mw)
