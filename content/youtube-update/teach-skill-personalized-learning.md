---
date: "2026-06-22"
title: "무엇이든 가르쳐 주는 /teach 스킬 — 나만의 AI 과외 선생님 만들기"
description: "개발자 교육으로 유명한 Matt Pocock이 만든 /teach 스킬 소개. 내가 왜 배우려는지(목표)를 기억하고, 진도를 추적하며, 내 수준에 딱 맞춘 맞춤형 레슨을 직접 만들어 주는 'AI 과외 선생님'. 루빅스 큐브 풀이부터 신입사원 코드 적응까지 활용합니다."
order: 74
tags: ["활용법", "워크플로우", "비즈니스", "youtube"]
source_url: "https://youtube.com/watch?v=s5T5oQJcJ6U"
---

## 이게 뭔가요?

**/teach(티치)** 는 AI에게 "이걸 가르쳐 줘"라고 부탁하면, **나 한 사람만을 위한 과외 선생님처럼** 행동하게 만드는 도구입니다. 여기서 도구라고 부르는 것은 **스킬(skill — AI에게 미리 정해 둔 행동 방식을 한 묶음으로 설치해 두는 기능)** 입니다.

이 스킬을 만든 사람은 영상 화자(저자 보충: Total TypeScript 강의 등으로 유명한 개발자 교육자 Matt Pocock)입니다. 그는 영상 첫머리에서 이렇게 말합니다.

> 원문: "I've been teaching stuff for 10 years... wouldn't it be great if I could take everything I know about teaching and put it inside a skill so that anyone could learn anything."
> 풀이: "저는 10년 동안 무언가를 가르쳐 왔습니다... 제가 가르치는 일에 대해 아는 모든 것을 하나의 스킬 안에 담아서, 누구나 무엇이든 배울 수 있게 한다면 멋지지 않을까요."

쉽게 비유하면, **유튜브 강의 영상을 틀어 놓고 혼자 따라 하는 것**과 **나를 잘 아는 과외 선생님에게 일대일로 배우는 것**의 차이입니다. 유튜브 영상은 누구에게나 똑같은 내용을 보여 주지만, 과외 선생님은 "지난번에 여기까지 했지? 이건 알고 이건 헷갈려 했으니, 오늘은 딱 이걸 해 보자"라고 **나에게 맞춰** 줍니다. /teach 스킬은 AI를 바로 그 과외 선생님으로 만들어 줍니다.

화자는 실제로 이 스킬로 **루빅스 큐브(3×3 정육면체 퍼즐) 맞추는 법**을 배웠다고 합니다.

> 원문: "It taught me how to solve a Rubik's Cube... it felt like I had a real teacher who was teaching how I like to be taught and was totally aligned with my mission."
> 풀이: "이 스킬은 제게 루빅스 큐브 푸는 법을 가르쳐 줬습니다... 마치 제가 배우고 싶은 방식 그대로 가르쳐 주고, 제 목표에 완전히 맞춰 주는 진짜 선생님이 있는 것 같았습니다."

## 왜 알아야 하나요?

보통 AI에게 무언가를 물어보면 **그 자리에서 한 번 답하고 끝**입니다. 다음에 다시 물으면 지난번에 무엇을 배웠는지, 어디까지 이해했는지 전혀 기억하지 못합니다. 그래서 같은 설명을 반복해서 듣거나, 너무 쉬운 내용과 너무 어려운 내용을 뒤죽박죽 받게 됩니다.

/teach 스킬은 이 문제를 **"기억하는 선생님"** 으로 해결합니다.

- **내 목표를 기억합니다** — 내가 왜 이걸 배우려는지(빠르게 푸는 게 목표인지, 한 번이라도 스스로 풀어 보는 게 목표인지)를 적어 두고 거기에 맞춥니다.
- **내 진도를 추적합니다** — 무엇을 끝냈고 무엇이 아직 헷갈리는지 기록해 두었다가, 다음 수업을 그에 맞춰 새로 만듭니다.
- **내 수준에 맞춥니다** — 너무 쉬워서 지루하지도, 너무 어려워서 겁먹지도 않는 딱 그 지점(아래 '핵심 아이디어' 참고)으로 수업을 좁혀 줍니다.

이 차이를 만드는 핵심 기술 개념이 하나 있는데, 바로 **스킬의 "기억" 유무(상태 유지)** 입니다.

### 기억하는 스킬 vs 기억 못 하는 스킬

영상에서 화자가 가장 강조하는 개념입니다. 스킬은 크게 두 종류로 나뉩니다.

| 구분 | 영문 용어 | 뜻 | 같은 저자의 예시 스킬 |
|------|-----------|-----|----------------------|
| **기억 못 하는 스킬** | stateless(스테이트리스 = 상태를 남기지 않음) | 매번 처음부터 시작. 지난번에 한 일을 전혀 기억하지 못함. 컴퓨터에 아무것도 저장하지 않음 | `grill-me`(특정 주제에 대해 준비될 때까지 질문 공세를 퍼붓는 스킬) |
| **기억하는 스킬** | stateful(스테이트풀 = 상태를 유지함) | 진행 내용을 컴퓨터(내 폴더)나 외부 저장소에 저장해 두고, 다음에 이어서 함. 쓸수록 좋아짐 | `grill-with-docs`(질문을 하면서 결정 기록·용어집 등을 폴더에 저장하는 스킬) |

화자의 설명 그대로:

> 원문: "If a skill is stateless, it means that it doesn't retain any state from previous runs... Whereas stateful skills... save things either to the local file system or they save things to MCP servers. They keep notes that they later track."
> 풀이: "스킬이 '기억 못 하는' 종류라면 이전 실행의 어떤 상태도 남기지 않는다는 뜻입니다... 반면 '기억하는' 스킬은 내 컴퓨터의 파일이나 외부 저장소(MCP 서버)에 내용을 저장합니다. 나중에 추적할 수 있도록 메모를 남겨 둡니다."

> 참고: MCP(Model Context Protocol)는 AI를 외부 도구·저장소와 연결하는 통로입니다. 여기서는 "내 컴퓨터 말고 다른 곳에도 기억을 저장할 수 있다" 정도로만 이해하면 충분합니다.

화자는 어느 쪽이 더 낫다는 게 아니라고 못 박습니다.

> 원문: "Now, one of these is not better than the other, they're just useful in different situations."
> 풀이: "둘 중 하나가 더 나은 게 아니라, 그저 서로 다른 상황에서 쓸모가 있을 뿐입니다."

좋은 가르침은 **선생님이 학생의 진도를 기억하는 것**에서 나오기 때문에, /teach 스킬은 반드시 **기억하는(stateful) 스킬**로 만들어졌습니다. 이게 이 스킬이 "한 번 답하고 끝"인 보통 AI와 다른 결정적 이유입니다.

## 어떻게 하나요?

### 방법 1: 스킬 설치하기

화자는 자신의 스킬 저장소(skills repository — 여러 스킬을 모아 둔 깃허브 창고)에서 설치한다고 안내합니다. 저장소 주소는 영상 설명란에 나와 있습니다.

1. 스킬 저장소 [github.com/mattpocock/skills](https://github.com/mattpocock/skills) 로 갑니다.
2. 화면의 "빠른 시작(quick start)" 안내에 있는 **설치 도구(skills.sh 설치기)** 를 실행합니다.
3. 설치할 스킬 목록에서 **Teach 스킬**을 고릅니다.

> 원문: "You go to my skills repo... you just run the skills.sh installer and you choose the Teach skill."
> 풀이: "제 스킬 저장소로 가서... 설치 도구(skills.sh)를 실행하고 Teach 스킬을 고르면 됩니다."

### 방법 2: 빈 폴더에서 "가르쳐 줘" 하고 말하기

설치가 끝나면, **새 빈 폴더**를 하나 만들고 그 안에서 코딩 에이전트(Claude Code처럼 AI에게 일을 시키는 프로그램)를 켠 다음, 평소 말하듯 부탁하면 됩니다.

<div class="example-case">
<strong>예시: 루빅스 큐브 배우기 시작</strong>

화자는 'Rubik's Cube'라는 이름의 빈 폴더를 만들고, 그 안에서 이렇게 말했습니다.

- "Teach me how to solve a Rubik's Cube." (루빅스 큐브 푸는 법을 가르쳐 줘.)

그러자 스킬이 폴더 안에 여러 개의 파일을 차례로 만들기 시작합니다. 가장 먼저 만든 것은 **미션(mission — 학습 목표)** 파일이었습니다. 화자는 "선생님이 잘 가르치려면 학생이 *왜* 그것을 배우려는지를 알아야 한다"고 믿어서, 스킬이 제일 먼저 목표를 정리하게 했습니다.

실제로 만들어진 미션 파일 내용(영상 화면):

> 원문: "Matt wants to be able to take a scrambled 3 by 3 Rubik's Cube and solve it unaided at least once. The goal is the achievement itself, not speed, not theory."
> 풀이: "Matt은 뒤섞인 3×3 루빅스 큐브를 도움 없이 한 번이라도 스스로 풀 수 있게 되기를 원한다. 목표는 '풀어냈다'는 성취 그 자체이지, 속도나 이론이 아니다."

</div>

### 스킬이 폴더 안에 만들어 주는 것들

미션을 정한 뒤, 스킬은 **나만의 학습 작업 공간(폴더)** 을 차근차근 채워 나갑니다. 영상에서 화자가 보여 준 파일들입니다.

| 만들어지는 것 | 무엇인가 |
|--------------|----------|
| 미션(mission) | 내가 *왜* 배우려는지, 무엇을 목표로 하는지 |
| 자료 모음(resources) | AI가 웹에서 직접 찾아온 **믿을 만한 원본 자료**. 배움이 진행되며 계속 갱신 |
| 레슨(lessons) 폴더 | 번호가 매겨진 개별 수업 파일들. 각 수업은 HTML(웹페이지를 만드는 형식)로 작성 |
| 학습 기록(learning record) | 내가 "이건 할 수 있어요"라고 보고하면 남기는 간단한 진도 기록 |
| 용어집(glossary) | 배우면서 나온 낯선 용어들을 모아 둔 사전 |
| 치트 시트(cheat sheet) | 전체 풀이를 한곳에 모은 요약 카드 (예: 큐브 '솔브 카드') |
| notes.md | AI가 내 선호·주의점 등을 적어 두는 자기 메모장 |

**왜 수업을 HTML로 만들까?** 화자는 글자만 있는 markdown(마크다운 — 간단한 문서 작성 형식)보다 HTML이 훨씬 풍부하다고 설명합니다.

> 원문: "HTML is just so much richer than markdown, it allows it to be so much more expressive, so much more interactive. And this is really the core of what makes this such a good learning experience."
> 풀이: "HTML은 마크다운보다 훨씬 풍부해서, 더 표현력 있고 더 상호작용적인 수업을 만들 수 있습니다. 이게 바로 이 학습 경험을 좋게 만드는 핵심입니다."

실제로 화자의 첫 수업은 "큐브의 구조, 기호, 흰색 십자가 만들기"였고, **그림(다이어그램), 쉬운 설명, 강조 박스, 그리고 퀴즈**까지 들어 있었습니다. 영상 뒷부분의 한 수업에서는 화면을 **손으로 눌러 가며(탭) 동작을 따라 하는 안내 모드**까지 등장해 화자가 감탄합니다 — HTML이라서 브라우저(웹 화면)의 기능을 그대로 쓸 수 있기 때문입니다.

### 핵심 아이디어: "근접 발달 영역"

화자가 "집착할 정도로 좋아한다"고 말하는 교육 개념이 이 스킬의 중심에 있습니다. **근접 발달 영역(zone of proximal development)** 입니다.

> 원문: "...you should always teach someone in the area where they are perfectly challenged but not intimidated... So the student's not bored, but also not freaked out."
> 풀이: "...학생을 가르칠 때는 늘 '완벽하게 도전적이지만 겁먹지는 않는' 지점에서 가르쳐야 합니다... 그래야 학생이 지루하지도, 잔뜩 겁먹지도 않습니다."

그래서 모든 수업은 **짧고, 압축적이고, 딱 이 지점에 맞춰** 만들어집니다. 너무 쉬우면 지루하고, 너무 어려우면 포기하기 때문입니다. 진도가 폴더에 저장되어 있으니, /teach를 다시 실행할 때마다 AI는 내가 어디까지 왔는지 알고 늘 이 지점에 맞춰 줍니다.

### 이어서 배우기 (다음 시간)

기억하는 스킬이라서, 며칠 뒤 다시 와도 처음부터 다시 시작하지 않습니다.

<div class="example-case">
<strong>예시: 며칠 뒤 수업 이어 가기</strong>

화자는 새 대화(AI가 이전 대화를 기억하지 못하는 '빈 상태')에서 그냥 "teach"라고 입력한 뒤, 자신의 근황을 말했습니다.

- "이제 루빅스 큐브를 거의 다 풀 수 있는데, '코너 사이클(corner cycle)'이라는 동작 하나가 아직 손에 안 익었어요."

그러자 스킬은 먼저 **작업 공간(폴더)의 상태부터 점검**했습니다. 저장된 치트 시트들을 읽어 어디까지 왔는지 확인하고, 진단을 내립니다 — "개념은 탄탄한데, 이 동작 하나가 아직 '근육 기억(muscle memory)'에 도달하지 못했다"고. 그러고는 기존 수업의 작성 스타일을 참고해, **'코너 사이클'만을 위한 새 수업**을 그 자리에서 만들어 줬습니다. 그 수업은 동작을 잘게 쪼개고("네 동작짜리 짧은 순서를 두 번 반복"), 화면을 눌러 가며 따라 할 수 있는 안내 모드까지 담고 있었습니다.

(참고: 화자가 이때 사용한 AI 모델은 'Opus 4.8, medium effort(중간 강도)' 설정이라고 영상에서 밝힙니다.)

</div>

화자는 이 과정을 이렇게 정리합니다.

> 원문: "We've turned the agent basically into a teacher and you've got to work with it in the same way that you would any one-to-one teacher. You tell it what problems you're having and it will design lessons to find solutions."
> 풀이: "우리는 사실상 AI를 선생님으로 바꾼 것이고, 일대일 과외 선생님을 대하듯 함께 작업하면 됩니다. 어떤 어려움을 겪는지 말하면, 그에 맞는 수업을 설계해 줍니다."

### 스킬의 설계 철학: 지식 → 기술 → 지혜

영상 후반, 화자는 스킬 내부의 설계 원칙을 보여 줍니다. AI가 세 단계로 생각하도록 정의되어 있습니다.

- **지식(knowledge)** — 신뢰할 수 있는 양질의 원본 자료에서 얻습니다.
- **기술(skills)** — 상호작용형 수업으로 직접 연습하며 익힙니다.
- **지혜(wisdom)** — 다른 학습자·실무자들과 부대끼며 얻습니다. 이건 AI 혼자 줄 수 없습니다.

그래서 스킬에는 **"AI에게만 의존하지 말고 결국 커뮤니티로 내보내라"** 는 원칙이 박혀 있습니다.

> 원문: "When the user asks a question that appears to require wisdom, your default posture should be to attempt to answer, but to ultimately delegate to a community."
> 풀이: "사용자가 '지혜'가 필요해 보이는 질문을 하면, 기본 태도는 일단 답을 시도하되 궁극적으로는 커뮤니티에 넘기는 것이어야 한다."

> 원문: "My idea with this teach skill is not to have you hooked onto the agent for learning everything. It's to actually give you the skills you need to feel confident to go out and work with a community."
> 풀이: "이 teach 스킬의 의도는 모든 학습을 AI에 매달리게 만드는 게 아닙니다. 자신감을 갖고 세상으로 나가 커뮤니티와 함께할 수 있는 능력을 실제로 길러 주는 것입니다."

## 실전 예시

<div class="example-case">
<strong>실전 케이스: 신입사원을 코드베이스에 적응시키기 (업무 활용)</strong>

화자는 이 스킬이 **회사에서 신입을 온보딩(새 환경에 적응시키기)** 할 때 특히 유용하다고 봅니다.

문서(매뉴얼)를 만들어 두는 방식의 문제는 두 가지입니다. 첫째, 계속 최신 상태로 유지해야 해서 손이 많이 갑니다. 둘째, 그 문서가 **읽는 사람의 수준에 맞지 않습니다** — 어떤 사람은 우리 기술 스택은 써 봤지만 우리 업무 영역을 모르고, 또 어떤 사람은 업무는 알지만 사용하는 프로그래밍 언어(예: TypeScript)를 전혀 모릅니다.

/teach를 쓰면, 신입에게 **각자의 작업 공간**을 주고 우리 코드베이스(회사의 전체 코드)를 가리키게 한 뒤, **스스로 자기 수준에 맞춰** 개념과 코드를 익히게 할 수 있습니다.

> 원문: "...you've got a productive employee in record time."
> 풀이: "...그러면 기록적으로 짧은 시간 안에 제 몫을 하는 직원을 얻게 됩니다."

</div>

<div class="example-case">
<strong>실전 케이스: 개인적으로 무엇이든 배우기</strong>

화자는 개인 용도로도 신난다고 말합니다. 코딩과 무관한 것들 — 루빅스 큐브, 옛날에 보던 체스 오프닝(첫 수 전개법), 심지어 **보컬 화음(vocal harmonies)** 까지 이 스킬로 배워 볼 생각이라고 합니다. 즉, /teach는 코드뿐 아니라 **사람이 배우고 싶은 거의 모든 것**(코딩 언어든, 외국어든, 취미든)에 쓸 수 있습니다.

</div>

## 더 큰 메시지: 개발자가 'AI 시대의 첫 주자'

화자는 영상을 이 생각으로 마무리합니다. 지금 AI가 가장 잘하는 일은 **코드 작성**이고, 그래서 **개발자들이 AI의 진짜 능력을 가장 먼저 경험하는 사람들**이라는 것입니다.

> 원문: "...developers have an advantage that we're the first people to really get to test AI out on a problem where it's very good at it... we can take the ideas that we develop here, turn them into skills, and start bringing them out to the world."
> 풀이: "...개발자들은 AI가 정말 잘하는 문제에서 그걸 가장 먼저 시험해 보는 사람들이라는 이점이 있습니다... 우리가 여기서 발전시킨 아이디어를 스킬로 만들어, 세상으로 가지고 나갈 수 있습니다."

그래서 화자는, AI와 씨름하다 지칠 때조차 **"지금 익히는 감각을 코딩 밖의 영역으로 가져갈 수 있다"** 는 점을 기억하라고 격려합니다. /teach 스킬은 그가 말하는 그 '첫걸음'의 한 예입니다.

## 주의할 점

- **이것은 화자(Matt Pocock)가 개인적으로 만들어 공개한 스킬**입니다. Claude나 앤스로픽(Anthropic)의 공식 기본 기능이 아니라, 별도로 **설치해서** 쓰는 도구입니다.
- **새 빈 폴더에서 시작하세요.** 영상에서 화자는 배울 주제마다 전용 빈 폴더(예: 'Rubik's Cube' 폴더)를 만들어 그 안을 학습 작업 공간으로 씁니다. 진도·자료·수업이 모두 그 폴더에 저장됩니다.
- **AI는 '지혜'까지 주지는 못합니다.** 스킬 자체가 그렇게 설계되어 있습니다 — 지식과 연습은 도와주되, 실제 실력(지혜)은 커뮤니티에서 사람들과 부대끼며 완성하라고 안내합니다.
- 영상에서 본 결과(루빅스 큐브 학습 등)는 **화자 한 사람의 사용 경험**입니다. 배우려는 주제·자료 상황에 따라 결과는 달라질 수 있습니다.

## 정리

- **/teach 스킬**은 AI를 "내 목표를 기억하고 진도를 추적하는 일대일 과외 선생님"으로 바꿔, 무엇이든 내 수준에 맞춰 단계별로 가르쳐 줍니다.
- 핵심은 **기억하는 스킬(stateful)** 이라는 점입니다 — 미션·자료·수업·진도를 폴더에 저장해, 다음에 이어서 배우고 늘 '딱 맞는 난이도(근접 발달 영역)'를 유지합니다.
- 루빅스 큐브 같은 취미부터 **신입사원 코드베이스 온보딩**까지 쓸 수 있고, 화자는 "AI에 의존시키지 말고, 결국 스스로 커뮤니티로 나가게 하는 것"이 이 스킬의 목표라고 강조합니다.

---

**참고 영상**: [Learn anything with the /teach skill](https://youtube.com/watch?v=s5T5oQJcJ6U) (채널: Matt Pocock, 2026-06-08, 길이 13:04)
**스킬 저장소**: https://github.com/mattpocock/skills
