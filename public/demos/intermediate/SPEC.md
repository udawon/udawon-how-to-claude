# 우리동네 카페 — 예약 시스템 사이트 기획서

> 이 문서는 사이트의 완전한 설계 청사진입니다. Claude에게 이 문서만 주면 동일한 사이트를 처음부터 재구축하거나 정확하게 수정할 수 있습니다.

---

## 1. 프로젝트 개요

- **사이트 이름**: 우리동네 카페
- **타이틀**: `우리동네 카페 — 예약 시스템`
- **목적**: 카페 좌석 예약 시스템 풀스택 시뮬레이션 (고객용 + 관리자용)
- **타겟 레벨**: 중급 (Claude Code 데모)
- **언어**: 한국어 (ko)

### 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | 없음 — 순수 HTML + Vanilla JS (단일 `index.html`) |
| CSS | Tailwind CSS (CDN: `https://cdn.tailwindcss.com`) |
| 폰트 | Google Fonts — Noto Sans KR (300, 400, 500, 600, 700) |
| 상태관리 | 자체 구현 Store 패턴 (옵저버) |
| 라우팅 | Hash 기반 SPA 라우터 (`#/path`) |
| 데이터 저장 | localStorage (내 예약), 메모리 (전체 예약 Mock) |
| 외부 의존성 | 없음 (Alpine.js, React 등 미사용) |

### 아키텍처 패턴

- **SPA (Single Page Application)**: Hash 라우터로 페이지 전환, `<main id="app">` 영역만 innerHTML로 교체
- **Store 패턴**: 중앙 상태 관리 + 구독 기반 알림
- **Mock API 레이어**: 비동기 delay를 포함한 가짜 API로 실제 백엔드 시뮬레이션
- **렌더 함수 기반 UI**: 각 페이지가 `render*()` 함수로 `app` 요소의 innerHTML을 교체

---

## 2. 디자인 시스템

### 색상 팔레트 (Tailwind 커스텀 설정)

```javascript
tailwindcss.config = {
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d9b5',
          300: '#e8bf85',
          400: '#dca05a',
          500: '#d4873a',
          600: '#c06d2e',   // 주요 액션 색상
          700: '#a05428',
          800: '#824326',
          900: '#6a3822',
          950: '#3a1b0f',   // 가장 어두운 배경
        },
        cream: {
          50: '#fffefb',
          100: '#fef9ee',
          200: '#fdf0d5',
          300: '#fbe4b4',
          400: '#f8d48e',
          500: '#f5c162',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c7d7c8',
          300: '#a1bba3',
          400: '#789b7b',
          500: '#587e5b',
          600: '#446548',   // 성공/확인 액션
          700: '#38513b',   // 데모 배너 배경
          800: '#2f4232',
          900: '#28372b',
        },
        warmgray: {
          50: '#f9f7f5',
          100: '#f0ece7',
          200: '#e0d7ce',
          300: '#cdbdaf',
          400: '#b69e8c',
          500: '#a68872',
          600: '#997764',
          700: '#806254',
          800: '#695148',
          900: '#57443e',
        },
      },
    },
  },
};
```

### 색상 용도 규칙

| 용도 | 색상 |
|------|------|
| 페이지 배경 | `cream-50` |
| 본문 텍스트 | `coffee-900` |
| 주요 버튼/액션 | `coffee-600` (hover: `coffee-700`) |
| 성공/확인 | `sage-600` (hover: `sage-700`) |
| 카드 배경 | `white` |
| 카드 테두리 | `warmgray-100` |
| 보조 텍스트 | `warmgray-400` ~ `warmgray-500` |
| 상태 배지 — 대기중 | `bg-yellow-100 text-yellow-700` |
| 상태 배지 — 확인됨 | `bg-sage-100 text-sage-700` |
| 상태 배지 — 완료 | `bg-warmgray-100 text-warmgray-500` |
| 푸터 배경 | `coffee-900` |
| 데모 배너 | `sage-700` 배경, `sage-50` 텍스트 |

### 폰트 설정

```css
* { font-family: 'Noto Sans KR', system-ui, sans-serif; }
```

Tailwind fontFamily 설정은 `Pretendard`로 되어 있지만, 실제 CSS 오버라이드로 `Noto Sans KR`이 적용됨.

### 컴포넌트 스타일

#### 카드
```
bg-white rounded-2xl p-8 shadow-sm border border-warmgray-100 hover:shadow-md transition-shadow
```
- 내부 카드 (더 작은): `rounded-xl p-5`

#### 주요 버튼 (CTA)
```
bg-coffee-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-coffee-700 transition-colors shadow-lg
```

#### 보조 버튼
```
bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold transition-all border border-white/30
```

#### 이전 버튼
```
text-warmgray-500 px-6 py-3 rounded-xl font-medium hover:bg-warmgray-100 transition-colors
```

#### 성공 액션 버튼
```
bg-sage-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors shadow-lg
```

#### 탭 버튼 (카테고리)
- 활성: `bg-coffee-600 text-white shadow-md`
- 비활성: `bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200`
- 공통: `px-5 py-2 rounded-full text-sm font-medium transition-all`

#### 뷰 토글 (고객/관리자)
- 컨테이너: `bg-warmgray-100 rounded-lg p-1`
- 활성 탭: `bg-white text-coffee-800 shadow-sm`
- 비활성 탭: `text-warmgray-500`
- 공통: `px-3 py-1.5 rounded-md text-sm font-medium transition-all`

#### 테이블 (관리자)
```
<table class="w-full text-sm">
  <thead> → bg-warmgray-50 border-b border-warmgray-100
  <th> → text-left px-4 py-3 font-semibold text-coffee-700, 정렬 가능 컬럼은 cursor-pointer hover:bg-warmgray-100
  <tr> → border-b border-warmgray-50 hover:bg-cream-50 transition-colors
  <td> → px-4 py-3
  하단 요약: bg-warmgray-50 border-t border-warmgray-100 text-xs text-warmgray-400
```

#### 모달
- 오버레이: `fixed inset-0 bg-coffee-950/50 z-[80]`
- 컨테이너: `bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto`
- 닫기 버튼: `text-warmgray-400 hover:text-coffee-700 text-xl` (`&times;`)
- 오버레이 클릭 시 닫힘

#### 토스트
- 컨테이너: `fixed top-20 right-4 z-[100]`
- 타입별 색상:
  - success: `bg-sage-600 text-white`, 아이콘 `✓`
  - error: `bg-red-600 text-white`, 아이콘 `✕`
  - info: `bg-coffee-600 text-white`, 아이콘 `ℹ`
  - warning: `bg-yellow-500 text-coffee-900`, 아이콘 `⚠`
- 공통: `px-5 py-3 rounded-xl shadow-lg text-sm font-medium`
- 애니메이션: slideIn (0.3s) → 3초 후 → slideOut (0.3s) → DOM 제거

#### 로딩 오버레이
- 배경: `fixed inset-0 bg-coffee-950/40 z-[90]`
- 스피너 박스: `bg-white rounded-2xl p-8 shadow-2xl`
- 스피너: `w-10 h-10 border-4 border-coffee-200 border-t-coffee-600 rounded-full` + CSS spin 애니메이션

#### 인풋 필드
```
w-full border border-warmgray-200 rounded-lg px-4 py-2.5 text-sm
focus:outline-none focus:ring-2 focus:ring-coffee-300 focus:border-coffee-400 transition-all
```

#### 상태 배지
```
px-2 py-0.5 rounded-full text-xs font-medium
(또는 테이블 내에서) px-2 py-1 rounded-full text-xs font-medium
```

### 커스텀 CSS

```css
/* Parallax hero 배경 — SVG 인라인 */
.hero-parallax { background-attachment: fixed; background-size: cover; }

/* 캘린더 날짜 */
.cal-day { transition: all 0.15s; }
.cal-day:hover:not(.disabled) { transform: scale(1.1); }
.cal-day.selected { background: #c06d2e; color: white; }
.cal-day.disabled { opacity: 0.3; cursor: not-allowed; }

/* 좌석 선택 */
.table-seat { transition: all 0.2s; }
.table-seat:hover:not(.occupied) { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

/* 스크롤바 */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f9f7f5; }
::-webkit-scrollbar-thumb { background: #cdbdaf; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a68872; }

/* 좌석 배치 그리드 */
.floor-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
}

/* [x-cloak] 숨김 */
[x-cloak] { display: none !important; }
```

---

## 3. 라우팅 구조

### 해시 라우터 경로 목록

| 경로 | 뷰 | 렌더 함수 | 설명 |
|------|-----|-----------|------|
| `#/` | 고객 | `renderHome()` | 홈 페이지 |
| `#/menu` | 고객 | `renderMenu()` | 메뉴 페이지 |
| `#/booking` | 고객 | `renderBooking()` | 예약 3단계 위저드 |
| `#/my-bookings` | 고객 | `renderMyBookings()` | 내 예약 목록 |
| `#/contact` | 고객 | `renderContact()` | 연락처/오시는 길 |
| `#/admin` | 관리자 | `renderAdminLogin()` 또는 `renderAdminDashboard()` | 로그인 여부에 따라 분기 |
| 그 외 | - | 404 페이지 | "페이지를 찾을 수 없습니다" |

### 뷰 전환 (고객 vs 관리자)

- 네비게이션 바에 **뷰 토글** 존재 (`고객용` / `관리자`)
- `switchView('customer')` → 고객 내비 링크 표시, `#/`로 이동
- `switchView('admin')` → 고객 내비 링크 숨김, `#/admin`으로 이동
- Store의 `currentView` 값으로 관리

### 네비게이션 하이라이트

현재 해시 경로와 일치하는 `.nav-link`에 `bg-coffee-100 text-coffee-800` 추가.

### 404 페이지

```html
<p class="text-6xl mb-4">🔍</p>
<h2>페이지를 찾을 수 없습니다</h2>
<p>요청하신 페이지가 존재하지 않습니다.</p>
<a href="#/">홈으로 돌아가기</a>  <!-- bg-coffee-600 버튼 -->
```

---

## 4. 고객용 페이지 구조

### 4.1 홈 페이지 (`#/`)

4개 섹션으로 구성:

#### (1) 히어로 섹션
- 패럴랙스 배경 (SVG 인라인 — 커피 테마)
- 그라데이션 오버레이: `from-coffee-950/60 via-coffee-950/40 to-coffee-950/80`
- 커피 이모지 + "우리동네 카페" + "매일 신선한 원두, 따뜻한 공간"
- 버튼 2개: "예약하기" (CTA), "메뉴 보기" (보조)
- 높이: `h-[70vh] min-h-[400px]`

#### (2) 특징 소개 섹션
- 3열 그리드 (`md:grid-cols-3`)
- 카드 3개:
  - 🫘 스페셜티 원두 — "매일 아침 로스팅하는 싱글 오리진 원두로 최고의 한 잔을 선사합니다."
  - 🪴 아늑한 공간 — "창가석, 소파석, 단체석까지. 모든 방문이 특별한 경험이 됩니다."
  - 📱 간편 예약 — "원하는 날짜, 시간, 좌석을 선택하고 몇 번의 클릭으로 예약하세요."

#### (3) 인기 메뉴 프리뷰
- 배경: `bg-warmgray-50`
- 제목: "인기 메뉴" / "가장 많이 사랑받는 메뉴를 소개합니다"
- 4열 그리드 (`sm:grid-cols-2 lg:grid-cols-4`)
- `popular: true`인 메뉴 아이템만 표시 (이름, 설명, 가격, "인기" 배지)
- 하단 링크: "전체 메뉴 보기 →"

#### (4) CTA 섹션
- 그라데이션 카드: `from-coffee-700 to-coffee-900`, 둥글기 `rounded-3xl`
- "지금 바로 예약하세요" / "원하는 시간과 자리를 미리 확보하세요"
- 버튼: "예약 페이지로 이동" (흰색 버튼)

### 4.2 메뉴 페이지 (`#/menu`)

- 제목: "메뉴" / "정성을 담은 음료와 디저트"
- **카테고리 탭**: 커피, 차, 디저트, 음료, 전체 (라운드 필 버튼)
- 초기 선택: `coffee` (첫 번째 카테고리)
- 메뉴 그리드: `sm:grid-cols-2 lg:grid-cols-3`
- 각 카드: 카테고리 아이콘 + 카테고리명 + 인기 배지(있으면) + 메뉴명 + 설명 + 가격
- `filterMenu(category)` 함수로 탭 전환

### 4.3 예약 3단계 위저드 (`#/booking`)

- 제목: "좌석 예약" / "3단계로 간편하게 예약하세요"
- **스텝 인디케이터**: 3개 원 + 연결선
  - 현재 단계: `bg-coffee-600 text-white`
  - 완료 단계: `bg-sage-600 text-white`, 내용 `✓`
  - 미래 단계: `bg-warmgray-200 text-warmgray-500`
  - 연결선 완료: `bg-sage-400`, 미완료: `bg-warmgray-200`

#### 1단계 — 날짜/시간/좌석 선택

**캘린더:**
- 월 이동 버튼 (`<`, `>`)
- 7열 그리드 (일~토)
- 과거 날짜: 비활성 (opacity 0.3, not-allowed)
- 오늘: `bg-coffee-100 text-coffee-700`
- 선택됨: `bg-coffee-600 text-white`
- 날짜 선택 시 시간/좌석 초기화

**시간 슬롯:**
- 날짜 미선택 시 비활성 (`opacity:0.4; pointer-events:none`)
- 4~6열 그리드 (`grid-cols-4 sm:grid-cols-6`)
- 선택됨: `bg-coffee-600 text-white shadow-md`
- 미선택: `bg-warmgray-50 text-warmgray-600`

**좌석 배치도 (Floor Map):**
- 시간 미선택 시 비활성
- 시간 선택 시 API로 예약된 좌석 조회 후 표시
- `floor-grid` (4열 x 3행)
- 범례: 이용 가능(초록), 예약됨(빨강), 선택됨(커피색)
- 예약됨: `bg-red-50 border-red-200 text-red-400 cursor-not-allowed`
- 선택됨: `bg-coffee-500 border-coffee-600 text-white shadow-lg ring-4 ring-coffee-200`
- 이용 가능: `bg-sage-50 border-sage-200 text-sage-700`

**다음 버튼:** 3가지 모두 선택해야 활성화

#### 2단계 — 정보 입력

**선택 내역 요약:** 날짜, 시간, 좌석 (coffee-50 배경 카드)

**폼 필드:**
- 예약자 이름 (필수) — placeholder: "홍길동"
- 연락처 (필수) — placeholder: "010-1234-5678", type="tel"
- 인원수 — `-` / `+` 버튼, 최소 1, 최대 테이블 seats 수
- 요청사항 (선택) — textarea, placeholder: "특별한 요청이 있으시면 적어주세요"

**네비게이션:** "← 이전" / "다음 단계 →"
**유효성 검사:** 이름, 연락처 비어있으면 토스트 경고 + focus

#### 3단계 — 확인 및 제출

**예약 요약 카드:** 날짜, 시간, 좌석, 예약자, 연락처, 인원, 요청사항(있으면) — 각 행 `border-b` 구분

**네비게이션:** "← 이전" / "예약 확정하기 ✓" (sage-600 버튼)

**제출 프로세스:**
1. 로딩 오버레이 ("예약을 접수하고 있습니다...")
2. `API.checkAvailability()` — 충돌 시 에러 토스트, 1단계로 복귀
3. `API.createReservation()` — 성공 시 성공 화면

**성공 화면:**
- 초록 체크 원 (sage-100 배경, sage-600 체크)
- "예약이 완료되었습니다!" + 예약번호
- 예약 상태: 대기중 배지
- 날짜, 시간, 좌석 표시
- 버튼: "내 예약 보기" (CTA) / "홈으로" (보조)

### 4.4 내 예약 (`#/my-bookings`)

- 제목: "내 예약" / "내가 만든 예약 내역 (이 브라우저에 저장됨)"
- 데이터 소스: `localStorage` 키 `myBookings`
- Store의 예약 상태와 동기화 (관리자가 상태 변경하면 반영)
- 예약 없을 때: 📋 아이콘 + "아직 예약 내역이 없습니다." + "예약하러 가기" 버튼
- 예약 있을 때: 카드 리스트 (예약번호, 상태 배지, 날짜/시간, 좌석/인원/이름, 예약일)

### 4.5 연락처 (`#/contact`)

- 제목: "오시는 길" / "방문을 환영합니다"
- 2열 그리드 (`md:grid-cols-2`)

**좌측 — 지도 플레이스홀더:**
- `bg-warmgray-100 rounded-2xl aspect-square`
- 🗺️ 아이콘 + "지도 영역" + 안내 텍스트

**우측 — 매장 정보 + 교통편 카드 2개:**

매장 정보:
- 📍 주소: 서울시 마포구 연남동 123-45
- 📞 전화: 02-1234-5678
- 🕐 영업시간: 매일 10:00 — 21:00 (라스트 오더 20:30)
- 📧 이메일: hello@uridongne.cafe

교통편:
- 2호선 (초록 배지): 홍대입구역 3번 출구 도보 5분
- 버스 (파랑 배지): 연남동 사거리 정류장 하차
- 주차 (회색 배지): 매장 앞 주차 2대 가능

---

## 5. 관리자 페이지 구조

### 5.1 로그인 (`#/admin`, 미인증 시)

- 🔐 아이콘 (coffee-100 원형 배경)
- "관리자 로그인" / "관리자 비밀번호를 입력하세요"
- 비밀번호 input (Enter 키 지원)
- 로그인 버튼
- 데모 비밀번호 힌트 박스: `admin1234` (cream-100 배경)
- 로그인 성공 시 `Store.adminLoggedIn = true`, 대시보드로 이동

### 5.2 대시보드 (`#/admin`, 인증 후)

#### 헤더
- "관리자 대시보드" + 오늘 날짜
- 로그아웃 버튼 (우측)

#### 통계 카드 (4열 그리드: `grid-cols-2 lg:grid-cols-4`)

| 카드 | 계산 방법 |
|------|----------|
| 오늘 예약 | `reservations.filter(r => r.date === today).length` |
| 이번 주 예약 | 현재 주 (일~토) 범위 내 예약 수 |
| 오늘 테이블 이용률 | `(오늘 활성 예약 수 / 전체 테이블 수) * 100` (% + 프로그레스 바) |
| 대기중 예약 | status === '대기중' 수, 0 초과 시 `text-yellow-600`, 0이면 `text-sage-600` |

프로그레스 바: `h-2 bg-warmgray-100 rounded-full` 안에 `bg-coffee-500` 바

#### 필터 바
- 날짜 필터: `<input type="date">`
- 상태 필터: `<select>` — 전체 상태 / 대기중 / 확인됨 / 완료
- "필터 초기화" 링크 (우측)

#### 예약 관리 테이블

**컬럼:**

| 컬럼 | 정렬 가능 | 반응형 |
|------|----------|--------|
| 날짜/시간 | O (date) | 항상 표시 |
| 예약자 (이름+연락처) | O (name) | 항상 표시 |
| 좌석 | O (table) | `hidden sm:table-cell` |
| 인원 | X | `hidden md:table-cell` |
| 상태 | O (status) | 항상 표시 |
| 작업 | X | 항상 표시 |

**정렬:** 컬럼 헤더 클릭 시 asc/desc 토글, 현재 방향 화살표 표시 (↑/↓)

**작업 버튼:**
- "상세" — 항상 표시, 모달 열기
- "확인" — 대기중일 때만 표시 (sage 스타일)
- "완료" — 확인됨일 때만 표시 (coffee 스타일)

**하단:** "총 N건의 예약"

### 5.3 예약 상세 모달

모달 내용:
- 예약번호, 상태 배지, 날짜, 시간, 좌석, 예약자, 연락처, 인원, 요청사항(있으면), 예약 생성일
- 하단 버튼:
  - 대기중 → "확인 처리" (sage-600)
  - 확인됨 → "완료 처리" (coffee-600)
  - "닫기" (warmgray-100)
- 상태 변경 후 모달 닫고 대시보드 새로고침

---

## 6. 콘텐츠 원본

### 메뉴 데이터

```javascript
const MENU_DATA = {
  coffee: {
    name: '커피', icon: '☕',
    items: [
      { name: '아메리카노', price: 4500, desc: '깊고 진한 에스프레소', popular: true },
      { name: '카페라떼', price: 5000, desc: '부드러운 우유와 에스프레소', popular: true },
      { name: '바닐라 라떼', price: 5500, desc: '달콤한 바닐라 시럽 추가' },
      { name: '카라멜 마키아토', price: 5500, desc: '카라멜 드리즐 토핑' },
      { name: '콜드브루', price: 5000, desc: '18시간 저온 추출', popular: true },
      { name: '에스프레소', price: 3500, desc: '진한 싱글 샷' },
    ]
  },
  tea: {
    name: '차', icon: '🍵',
    items: [
      { name: '얼그레이', price: 4500, desc: '베르가못 향 홍차' },
      { name: '캐모마일', price: 4500, desc: '은은한 꽃 향' },
      { name: '녹차 라떼', price: 5000, desc: '제주 녹차 파우더', popular: true },
      { name: '유자차', price: 5000, desc: '상큼한 국산 유자' },
    ]
  },
  dessert: {
    name: '디저트', icon: '🍰',
    items: [
      { name: '티라미수', price: 6500, desc: '마스카포네 치즈 케이크', popular: true },
      { name: '크루아상', price: 4000, desc: '버터 풍미 가득' },
      { name: '당근 케이크', price: 5500, desc: '크림치즈 프로스팅' },
      { name: '마카롱 세트', price: 7000, desc: '4종 구성' },
      { name: '스콘', price: 3500, desc: '클로티드 크림 제공' },
    ]
  },
  beverage: {
    name: '음료', icon: '🥤',
    items: [
      { name: '딸기 스무디', price: 5500, desc: '신선한 딸기 블렌딩' },
      { name: '망고 주스', price: 5000, desc: '열대과일의 달콤함' },
      { name: '에이드', price: 4500, desc: '레몬/자몽 선택 가능' },
    ]
  }
};
```

### 테이블 (좌석) 데이터

```javascript
const TABLES = [
  { id: 'A1', name: 'A1', seats: 2, type: '창가', x: 0, y: 0 },
  { id: 'A2', name: 'A2', seats: 2, type: '창가', x: 1, y: 0 },
  { id: 'A3', name: 'A3', seats: 4, type: '창가', x: 2, y: 0 },
  { id: 'B1', name: 'B1', seats: 4, type: '홀',   x: 0, y: 1 },
  { id: 'B2', name: 'B2', seats: 4, type: '홀',   x: 1, y: 1 },
  { id: 'B3', name: 'B3', seats: 6, type: '홀',   x: 2, y: 1 },
  { id: 'B4', name: 'B4', seats: 2, type: '홀',   x: 3, y: 1 },
  { id: 'C1', name: 'C1', seats: 2, type: '바',   x: 0, y: 2 },
  { id: 'C2', name: 'C2', seats: 2, type: '바',   x: 1, y: 2 },
  { id: 'D1', name: 'D1', seats: 8, type: '단체석', x: 2, y: 2, span: 2 },
];
```

좌석 타입: 창가 (A열), 홀 (B열), 바 (C열), 단체석 (D열)
D1은 `grid-column: span 2`로 2칸 차지.

### 시간 슬롯

```javascript
const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30',
];
```

30분 간격, 10:00 ~ 20:30 (총 22개 슬롯)

### Mock 예약 데이터 생성 규칙

`generateMockReservations()` 함수:

```javascript
const names = ['김민수', '이서연', '박지훈', '최유진', '정태호', '강하늘', '윤소희', '한재민', '임수빈', '오현우', '신예린', '장동건'];
const phones = ['010-1234-5678', '010-2345-6789', '010-3456-7890', '010-4567-8901', '010-5678-9012', '010-6789-0123', '010-7890-1234', '010-8901-2345', '010-9012-3456', '010-0123-4567', '010-1111-2222', '010-3333-4444'];
const statuses = ['대기중', '확인됨', '완료', '대기중', '확인됨', '대기중', '완료', '확인됨', '대기중', '대기중', '확인됨', '완료'];
const notes = ['창가 자리 희망', '', '생일 파티', '조용한 자리 부탁', '', '노트북 사용 예정', '아기 동반', '', '단체 모임', '', '알레르기 있음', ''];
```

- 12건 생성
- 날짜: 오늘 기준 -3 ~ +10일 랜덤
- 시간: TIME_SLOTS에서 랜덤
- 테이블: TABLES에서 랜덤
- 인원: 1 ~ min(테이블 seats, 4) 랜덤
- 예약번호: `R1000` ~ `R1011`
- 생성일: 예약일 기준 0~2일 전 랜덤
- 날짜순 정렬

### 카페 정보

| 항목 | 값 |
|------|-----|
| 이름 | 우리동네 카페 |
| 주소 | 서울시 마포구 연남동 123-45 |
| 전화 | 02-1234-5678 |
| 영업시간 | 매일 10:00 — 21:00 |
| 라스트 오더 | 20:30 |
| 이메일 | hello@uridongne.cafe |
| 지하철 | 2호선 홍대입구역 3번 출구 도보 5분 |
| 버스 | 연남동 사거리 정류장 하차 |
| 주차 | 매장 앞 주차 2대 가능 |
| 저작권 | © 2026 우리동네 카페. 모든 권리 보유. |

---

## 7. 기능 명세

### 상태 관리 (Store)

```javascript
const Store = {
  _state: {
    currentView: 'customer',     // 'customer' | 'admin'
    currentRoute: '/',
    adminLoggedIn: false,
    bookingStep: 1,              // 1 | 2 | 3
    bookingData: {
      date: null,
      time: null,
      tableId: null,
      name: '',
      phone: '',
      guests: 2,
      note: '',
      // 내부 사용: _viewMonth, _viewYear (캘린더 월 이동용)
    },
    reservations: [],            // 전체 예약 (Mock + 사용자 생성)
    myBookings: [],              // 내 예약 (localStorage 동기화)
    adminFilter: { date: '', status: '' },
    adminSort: { column: 'date', direction: 'asc' },
  },
  _listeners: [],
  get(key),        // key 없으면 전체 state 복사본 반환
  set(key, value), // 값 설정 후 리스너 알림
  update(updates), // Object.assign 후 리스너 알림
  subscribe(fn),   // 구독, 해제 함수 반환
  _notify(),       // 모든 리스너 호출
};
```

### Mock API 레이어

| 메서드 | delay | 동작 |
|--------|-------|------|
| `API.getReservations()` | 400ms | Store의 전체 예약 반환 |
| `API.checkAvailability(date, time, tableId)` | 300ms | 해당 좌석에 완료가 아닌 예약 있으면 false |
| `API.getOccupiedTables(date, time)` | 200ms | 해당 시간에 완료가 아닌 예약의 tableId 배열 반환 |
| `API.createReservation(data)` | 600ms | 예약 생성, Store + localStorage 모두 저장 |
| `API.updateReservationStatus(id, status)` | 400ms | 상태 변경, Store + localStorage 모두 업데이트 |
| `API.adminLogin(password)` | 500ms | password === 'admin1234'이면 성공, 아니면 에러 |

### 토스트 알림 시스템

- `showToast(message, type)` — type: `success`, `error`, `info`, `warning`
- 위치: 화면 우상단 (`top-20 right-4`)
- 동작: slideIn → 3초 대기 → slideOut → DOM 제거

### 로딩 오버레이

- `showLoading(text)` — 텍스트 기본값: "처리 중..."
- `hideLoading()` — hidden 클래스 토글
- z-index: 90 (모달 80보다 위)

### 모달 시스템

- `showModal(html)` — `#modal-content`에 innerHTML 설정, 오버레이 표시
- `closeModal()` — 오버레이 숨김
- 오버레이 클릭 시 자동 닫힘 (이벤트 타겟 확인)
- z-index: 80

### 예약 상태 워크플로우

```
대기중 → 확인됨 → 완료
```

- 대기중: 신규 예약의 초기 상태
- 확인됨: 관리자가 "확인" 버튼 클릭
- 완료: 관리자가 "완료" 버튼 클릭
- 단방향 — 되돌리기 없음
- 완료된 예약은 좌석 가용성 계산에서 제외

### 유틸리티 함수

| 함수 | 용도 |
|------|------|
| `delay(ms)` | Promise 기반 대기 |
| `formatDate(d)` | Date 객체 → `YYYY-MM-DD` 문자열 |
| `formatDateKR(dateStr)` | `YYYY-MM-DD` → `YYYY년 M월 D일` |
| `formatPrice(n)` | 숫자 → `N,NNN원` (한국어 로케일) |
| `getDayName(dateStr)` | 요일명 반환 (일/월/화/수/목/금/토) |

---

## 8. 반응형 규칙

### 브레이크포인트 (Tailwind 기본)

| 접두사 | 최소 너비 |
|--------|----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |

### 컨테이너

- 최대 너비: `max-w-6xl` (대부분의 페이지), `max-w-4xl` (예약, CTA), `max-w-xl` (예약 2~3단계), `max-w-md` (관리자 로그인)
- 패딩: `px-4`

### 반응형 동작

| 요소 | 모바일 | 데스크톱 |
|------|--------|---------|
| 내비게이션 링크 | 별도 모바일 바 (`sm:hidden`) | 헤더 내 인라인 (`hidden sm:flex`) |
| 히어로 제목 | `text-4xl` | `md:text-5xl` |
| 특징 카드 | 1열 | `md:grid-cols-3` |
| 인기 메뉴 | 2열 (`sm:grid-cols-2`) | 4열 (`lg:grid-cols-4`) |
| 메뉴 그리드 | 2열 (`sm:grid-cols-2`) | 3열 (`lg:grid-cols-3`) |
| 시간 슬롯 | 4열 | 6열 (`sm:grid-cols-6`) |
| 연락처 | 1열 | 2열 (`md:grid-cols-2`) |
| 관리자 통계 | 2열 | 4열 (`lg:grid-cols-4`) |
| 테이블 좌석열 | 숨김 | `sm:table-cell` |
| 테이블 인원열 | 숨김 | `md:table-cell` |
| 예약 스텝 라벨 | 숨김 | `sm:inline` |
| 히어로 CTA | 세로 배치 | 가로 배치 (`sm:flex-row`) |

---

## 9. 수정 가이드

### 메뉴 데이터 변경

`MENU_DATA` 객체를 수정합니다.

```javascript
// 새 카테고리 추가
brunch: {
  name: '브런치', icon: '🥞',
  items: [
    { name: '에그 베네딕트', price: 12000, desc: '수란과 홀란데이즈 소스', popular: true },
  ]
}
```

- `popular: true` 추가 시 홈 인기 메뉴에 자동 노출
- 가격은 원 단위 정수 (예: 4500)
- 카테고리 키는 영문 소문자

### Mock 예약 데이터 변경

`generateMockReservations()` 함수 내부 수정:
- `names` 배열: 예약자 이름 목록
- `phones` 배열: 연락처 목록
- `statuses` 배열: 각 예약의 초기 상태
- `notes` 배열: 요청사항 (빈 문자열 = 없음)
- 예약 수 변경: for 루프 `i < 12` 값과 배열 길이를 맞춰서 수정
- 날짜 범위: `Math.floor(Math.random() * 14) - 3` → -3일~+10일

### 라우트 추가

```javascript
// 1. 렌더 함수 정의
function renderNewPage() {
  document.getElementById('app').innerHTML = `...`;
}

// 2. 라우트 등록
Router.register('/new-page', renderNewPage);

// 3. (선택) 네비게이션에 링크 추가 — customer-nav, customer-nav-mobile 두 곳 모두
```

### 관리자 비밀번호 변경

`API.adminLogin` 함수 내:
```javascript
if (password === 'admin1234') {  // ← 이 값을 변경
```

로그인 페이지 데모 힌트도 함께 변경:
```html
<p class="font-mono font-bold text-coffee-700 text-lg mt-1">admin1234</p>  <!-- ← 이 값도 변경 -->
```

### 통계 데이터 변경

관리자 대시보드의 통계는 `renderAdminDashboard()` 내에서 실시간 계산됩니다:

- **오늘 예약**: `reservations.filter(r => r.date === today).length`
- **이번 주 예약**: 현재 주 일~토 기준 필터
- **테이블 이용률**: `(오늘 활성 예약 / TABLES.length) * 100`
- **대기중**: `reservations.filter(r => r.status === '대기중').length`

통계 카드를 추가하려면 `grid-cols-2 lg:grid-cols-4`를 조정하고 새 카드 HTML을 추가합니다.

### 테이블/좌석 변경

`TABLES` 배열을 수정합니다:
- `x`, `y`: 4x3 그리드 내 위치 (0-indexed)
- `span`: 2 이상이면 `grid-column: span N`으로 여러 칸 차지
- `type`: 좌석 타입 라벨 (자유 텍스트)
- `seats`: 최대 인원수 (예약 시 인원수 상한)

그리드 크기 변경 시 `.floor-grid`의 `grid-template-columns`도 수정 필요.

### 시간 슬롯 변경

`TIME_SLOTS` 배열을 수정합니다. 문자열 형식 `HH:MM`.

### 색상 테마 변경

`tailwindcss.config`의 `colors` 객체를 수정합니다. 모든 색상은 Tailwind 유틸리티 클래스로 참조되므로, 키 이름을 변경하면 HTML 전체의 클래스명도 일괄 변경해야 합니다.
