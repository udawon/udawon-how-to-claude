# 사이트 기획서 — 우리동네 카페 예약 시스템

이 문서는 `index.html` 파일의 완전한 설계 명세서입니다. 이 문서만으로 사이트를 동일하게 재현하거나 수정할 수 있습니다.

---

## 1. 프로젝트 개요

- **사이트 이름**: 우리동네 카페 — 예약 시스템
- **목적**: 카페 메뉴 소개 + 테이블 예약 폼이 포함된 단일 페이지 랜딩 사이트
- **타겟 레벨**: 초보 (Claude Code로 만들 수 있는 beginner 데모)
- **언어**: 한국어 (`<html lang="ko">`)
- **파일 구조**: 단일 HTML 파일 (외부 JS/CSS 없음)

### 기술 스택

| 항목 | 내용 |
|------|------|
| HTML | 단일 `index.html` |
| CSS | Tailwind CSS CDN (`https://cdn.tailwindcss.com`) + `<style>` 태그 내 커스텀 CSS |
| JavaScript | Vanilla JS (즉시 실행 함수 패턴, `'use strict'`) |
| 폰트 | Google Fonts — Noto Sans KR (300, 400, 500, 600, 700) |
| 저장소 | `localStorage` (예약 내역 보관) |

---

## 2. 디자인 시스템

### 색상 팔레트 (Tailwind Config)

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#fdf8f0',
          100: '#f9edda',
          200: '#f2d7b0',
          300: '#e9bc7e',
          400: '#de9a4b',
          500: '#d4802e',
          600: '#b86424',
          700: '#994c20',
          800: '#7d3e21',
          900: '#67341e',
          950: '#3a1a0e',
        },
        cream: {
          50:  '#fffef7',
          100: '#fef9e7',
          200: '#fdf0c8',
          300: '#fbe39f',
          400: '#f8d06d',
        },
        mocha: {
          50:  '#f7f3ef',
          100: '#ebe3d9',
          200: '#d8c7b3',
          300: '#c1a688',
          400: '#ad8a66',
          500: '#9e7656',
          600: '#876049',
          700: '#6e4d3d',
          800: '#5c4136',
          900: '#4e382f',
        },
      },
    },
  },
}
```

**색상 용도 요약**:

| 역할 | 사용 색상 |
|------|-----------|
| 배경 (본문) | `cream-50` |
| 배경 (히어로) | `coffee-800` → `coffee-900` → `coffee-950` 그라디언트 |
| 배경 (푸터) | `coffee-950` |
| 배경 (카드) | `white` |
| 텍스트 (본문) | `mocha-900` |
| 텍스트 (부제/설명) | `mocha-500` |
| 강조/CTA | `coffee-500` (기본), `coffee-600` (hover), `coffee-700` (active) |
| 에러 | `text-red-500` (Tailwind 기본) |
| 테두리 | `coffee-100`, `coffee-200` |

### 폰트 설정

```css
* { font-family: 'Noto Sans KR', system-ui, sans-serif; }
```

Tailwind config에도 정의:
```javascript
fontFamily: {
  sans: ['"Pretendard"', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
},
```

실제 로드하는 폰트는 Google Fonts의 `Noto Sans KR`만 사용. `<style>` 태그에서 `*` 선택자로 전역 적용.

### 간격/레이아웃 규칙

| 항목 | 값 |
|------|-----|
| 최대 너비 | `max-w-6xl` (일반 섹션), `max-w-4xl` (예약 폼) |
| 좌우 패딩 | `px-4 sm:px-6 lg:px-8` |
| 섹션 상하 패딩 | `py-20` |
| 섹션 헤더 하단 여백 | `mb-16` |
| 카드 내부 패딩 | `p-6` |
| 카드 그리드 간격 | `gap-6` (메뉴), `gap-8` (매장정보) |
| 폼 내부 패딩 | `p-6 sm:p-8` |
| 폼 필드 간격 | `space-y-6` |

### 버튼 스타일

**기본 CTA 버튼 (예약하기 등)**:
```
bg-coffee-500 hover:bg-coffee-600 active:bg-coffee-700 text-white
rounded-full (네비), rounded-xl (폼)
font-semibold 또는 font-bold
transition-all hover:shadow-lg
```

**히어로 기본 CTA**:
```
bg-coffee-400 hover:bg-coffee-300 active:bg-coffee-500 text-coffee-950
px-8 py-3.5 rounded-full font-bold text-lg
hover:shadow-xl hover:shadow-coffee-400/25 hover:-translate-y-0.5
```

**히어로 보조 CTA**:
```
border-2 border-cream-300/40 hover:border-cream-300 text-cream-100 hover:text-white
px-8 py-3.5 rounded-full font-semibold
hover:-translate-y-0.5
```

**폼 제출 버튼**:
```
w-full bg-coffee-500 hover:bg-coffee-600 active:bg-coffee-700 text-white
py-4 rounded-xl font-bold text-lg
hover:shadow-lg hover:shadow-coffee-500/25 focus:ring-4 focus:ring-coffee-400/30
```

**테이블 선택 버튼 (기본)**:
```
border-2 border-coffee-200 rounded-xl p-4 text-center
hover:border-coffee-400 hover:bg-coffee-50 focus:border-coffee-400
```

**테이블 선택 버튼 (선택됨)**: `.table-btn.selected`
```css
background-color: #d4802e; /* coffee-500 */
color: white;
border-color: #b86424; /* coffee-600 */
```

### 카드/컴포넌트 스타일

**메뉴 카드**:
```
bg-white rounded-2xl p-6 border border-coffee-100
hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group
```

내부 이미지 영역:
```
bg-gradient-to-br from-coffee-100 to-cream-200 rounded-xl h-48
group-hover:scale-[1.02] transition-transform
```

**정보 카드** (매장정보):
```
bg-white rounded-2xl p-6 border border-coffee-100 shadow-sm hover:shadow-md transition-shadow
```

**아이콘 박스**:
```
bg-coffee-100 w-12 h-12 rounded-xl flex items-center justify-center text-xl
```

**태그/배지**:
```
bg-coffee-50 text-coffee-600 text-xs px-2.5 py-1 rounded-full font-medium  /* 일반 태그 */
bg-cream-400/30 text-coffee-700 text-xs px-2.5 py-1 rounded-full font-medium  /* 강조 태그 (BEST, NEW, 한정) */
```

**섹션 라벨 배지**:
```
inline-block bg-coffee-100 text-coffee-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4
```

### 커스텀 CSS

```css
html { scroll-behavior: smooth; }

/* 스크롤 페이드인 애니메이션 */
.fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* 모달 배경 블러 */
.modal-backdrop { backdrop-filter: blur(4px); }

/* 인풋 포커스 링 */
input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(222, 154, 75, 0.35);
}

/* 테이블 버튼 선택 상태 */
.table-btn.selected { background-color: #d4802e; color: white; border-color: #b86424; }
.table-btn.selected:hover { background-color: #b86424; }

/* 시간대 비가용 상태 */
.time-slot.unavailable { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }

/* 모달 슬라이드업 애니메이션 */
@keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
.modal-content { animation: slideUp 0.35s ease-out; }

/* 햄버거 메뉴 X 변환 */
.hamburger-line { transition: all 0.3s ease; }
.hamburger-open .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger-open .hamburger-line:nth-child(2) { opacity: 0; }
.hamburger-open .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }
```

---

## 3. 페이지 구조

### 네비게이션 구조

**레벨 배너** (최상단 고정):
- 배경: `coffee-950`, 텍스트: `cream-100`
- 내용: "🌱 초보 레벨 데모 — Next.js 스타일 카페 예약 시스템"

**네비게이션 바** (sticky):
```
sticky top-0 z-50 bg-cream-50/95 backdrop-blur border-b border-coffee-200
```
- 스크롤 10px 이상 시 `shadow-md` 추가

| 위치 | 요소 |
|------|------|
| 왼쪽 | 로고: ☕ 아이콘 + "우리동네 카페" (링크: `#hero`) |
| 오른쪽 (데스크톱) | 홈(`#hero`), 메뉴(`#menu`), 예약(`#booking`), 매장정보(`#info`), 예약하기 버튼(`#booking`) |
| 오른쪽 (모바일) | 햄버거 메뉴 버튼 |

**모바일 메뉴** (숨김 → 토글):
- 동일 링크 세로 배치
- 햄버거 클릭 시 `hidden` 토글 + X 애니메이션 전환
- 메뉴 링크 클릭 시 자동 닫힘

### 섹션 순서와 역할

| 순서 | ID | 역할 | 배경 |
|------|----|------|------|
| 1 | `#hero` | 히어로 — 카페 소개 + CTA | `coffee-800` → `coffee-950` 그라디언트 |
| 2 | `#menu` | 메뉴 — 시그니처 메뉴 카드 6개 | `cream-50` |
| 3 | `#booking` | 예약 — 예약 폼 | `cream-100` → `cream-50` 그라디언트 |
| 4 | `#info` | 매장정보 — 지도, 영업시간, 위치, 연락처 | `cream-50` |
| 5 | (footer) | 푸터 — 로고, 링크, 저작권 | `coffee-950` |

### 섹션별 포함 요소

**히어로 섹션** (`#hero`):
- 배경 장식: 2개의 블러 원형 (`coffee-400`, `cream-400`, opacity 10%)
- 왼쪽 컬럼: 배지("매일 신선한 원두 ✨") + 타이틀 + 설명 + CTA 2개
- 오른쪽 컬럼 (md 이상): 카페 이미지 플레이스홀더 (☕, 800x600)
  - 플로팅 카드 좌하단: 평점 (⭐ 4.8/5.0, 리뷰 320개)
  - 플로팅 카드 우상단: 영업 상태 (🕐 영업중, 22:00 마감)

**메뉴 섹션** (`#menu`):
- 섹션 라벨: "MENU"
- 제목: "시그니처 메뉴"
- 3열 그리드 (lg), 2열 (sm), 1열 (기본)
- 메뉴 카드 6개 (아래 콘텐츠 원본 참조)

**예약 섹션** (`#booking`):
- 섹션 라벨: "BOOKING"
- 제목: "테이블 예약"
- 카드 형태 폼 (상단 그라디언트 헤더 + 하단 폼)
- 폼 필드: 날짜, 시간대, 테이블, 인원, 이름, 연락처, 요청사항
- 최근 예약 내역 표시 영역
- 제출 버튼

**매장정보 섹션** (`#info`):
- 섹션 라벨: "INFO"
- 2열 그리드 (md)
- 왼쪽: 지도 플레이스홀더 (🗺️)
- 오른쪽: 영업시간/찾아오는길/연락처 정보 카드 3개

**푸터**:
- 3분할 (md): 로고 | 링크 4개 | 저작권
- 모바일: 세로 정렬

---

## 4. 콘텐츠 원본

### 히어로 텍스트

| 요소 | 내용 |
|------|------|
| 배지 | 매일 신선한 원두 ✨ |
| 제목 L1 | 우리동네 카페에서 |
| 제목 L2 (강조) | 특별한 순간을 |
| 설명 | 바쁜 일상 속 여유로운 한 잔. 따뜻한 공간에서 소중한 시간을 예약하세요. 원두 향이 가득한 아늑한 공간이 기다리고 있습니다. |
| CTA 기본 | 테이블 예약하기 |
| CTA 보조 | 메뉴 보기 |
| 이미지 플레이스홀더 | ☕ 카페 대표 이미지 (800 x 600) |
| 플로팅 카드 1 | ⭐ 4.8 / 5.0 — 리뷰 320개 |
| 플로팅 카드 2 | 🕐 영업중 — 22:00 마감 |

### 메뉴 아이템

| # | 아이콘 | 이름 | 가격 | 설명 | 태그 |
|---|--------|------|------|------|------|
| 1 | ☕ | 시그니처 라떼 | ₩5,500 | 바닐라빈과 캐러멜의 조화. 부드러운 우유 거품 위에 시나몬 파우더를 올린 시그니처 음료. | HOT, ICE, BEST |
| 2 | 🍵 | 말차 크림 라떼 | ₩6,000 | 교토산 말차와 바닐라 크림의 만남. 쌉싸름한 말차 위에 부드러운 크림이 층을 이룹니다. | HOT, ICE, NEW |
| 3 | 🧁 | 당근 케이크 | ₩6,500 | 촉촉한 당근 시트에 크림치즈 프로스팅을 올린 수제 케이크. 커피와의 궁합이 최고! | BEST |
| 4 | 🫖 | 루이보스 허브티 | ₩5,000 | 카페인 프리 루이보스에 캐모마일과 레몬그라스를 블렌딩한 편안한 차. | HOT, DECAF |
| 5 | 🥐 | 버터 크루아상 | ₩4,500 | 프랑스산 버터로 72겹 접어 만든 바삭한 크루아상. 매일 오전 한정 수량 판매. | 한정 |
| 6 | 🍋 | 레몬 에이드 | ₩5,500 | 제주산 청레몬과 자가제 레몬시럽으로 만든 상큼한 에이드. 여름 인기 메뉴 1위. | ICE |

### 폼 필드 목록

| 필드 | ID | 라벨 | 타입 | 필수 | 옵션/placeholder | 유효성 검사 |
|------|----|------|------|------|------------------|-------------|
| 날짜 | `date` | 날짜 * | `<input type="date">` | O | min: 오늘, max: 오늘+30일 | 빈값 → "날짜를 선택해주세요." / 과거 → "지난 날짜는 선택할 수 없습니다." |
| 시간대 | `time` | 시간대 * | `<select>` | O | placeholder: "시간대를 선택하세요" | 빈값 → "시간대를 선택해주세요." |
| 테이블 | `selected-table` | 테이블 선택 * | `<input type="hidden">` (버튼으로 선택) | O | — | 빈값 → "테이블을 선택해주세요." |
| 인원 | `guests` | 인원 * | `<select>` | O | placeholder: "인원 선택" | 빈값 → "인원을 선택해주세요." |
| 이름 | `name` | 이름 * | `<input type="text">` | O | placeholder: "홍길동" | 빈값 → "이름을 입력해주세요." / 2자 미만 → "이름은 2자 이상 입력해주세요." |
| 연락처 | `phone` | 연락처 * | `<input type="tel">` | O | placeholder: "010-1234-5678" | 빈값 → "연락처를 입력해주세요." / 정규식 불일치 → "올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)" |
| 요청사항 | `request` | 요청사항 (선택) | `<textarea rows="3">` | X | placeholder: "예: 생일 파티 준비 부탁드립니다, 조용한 자리 부탁드립니다..." | 없음 |

**시간대 옵션 (select)**:

| value | 표시 텍스트 |
|-------|------------|
| (빈값) | 시간대를 선택하세요 |
| 10:00 | 10:00 - 11:00 |
| 11:00 | 11:00 - 12:00 |
| 12:00 | 12:00 - 13:00 |
| 13:00 | 13:00 - 14:00 |
| 14:00 | 14:00 - 15:00 |
| 15:00 | 15:00 - 16:00 |
| 16:00 | 16:00 - 17:00 |
| 17:00 | 17:00 - 18:00 |
| 18:00 | 18:00 - 19:00 |
| 19:00 | 19:00 - 20:00 |
| 20:00 | 20:00 - 21:00 |

**인원 옵션 (select)**:

| value | 표시 텍스트 |
|-------|------------|
| (빈값) | 인원 선택 |
| 1 | 1명 |
| 2 | 2명 |
| 3 | 3명 |
| 4 | 4명 |
| 5 | 5명 |
| 6 | 6명 |

**테이블 데이터**:

| data-table | 이름 | 수용인원 | 아이콘 |
|------------|------|----------|--------|
| 1 | A석 | 2인 | 🪑 |
| 2 | B석 | 2인 | 🪑 |
| 3 | C석 | 4인 소파 | 🛋️ |
| 4 | D석 | 4인 소파 | 🛋️ |
| 5 | E석 | 6인 창가 | 🪟 |

JS 내 `tableNames` 매핑:
```javascript
const tableNames = {
  1: 'A석 (2인)',
  2: 'B석 (2인)',
  3: 'C석 (4인 소파)',
  4: 'D석 (4인 소파)',
  5: 'E석 (6인 창가)'
};
```

### 매장 정보 데이터

**영업시간**:

| 요일 | 시간 |
|------|------|
| 월 ~ 금 | 10:00 - 22:00 |
| 토요일 | 11:00 - 22:00 |
| 일요일 · 공휴일 | 11:00 - 21:00 |
| 비고 | * 라스트 오더는 마감 1시간 전 |

**찾아오시는 길**:
- 주소: 서울시 마포구 연남동 123-45, 2층
- 교통: 홍대입구역 3번 출구에서 도보 7분
- 주차: 건물 뒤편 주차 2대 가능 (선착순)

**연락처**:
- 전화: 02-123-4567 (`tel:02-123-4567` 링크)
- 카카오톡: @우리동네카페
- 인스타그램: @uri_cafe_official

### 모달 콘텐츠

**확인 모달 헤더**:
- 아이콘: ✅
- 제목: "예약이 완료되었습니다!"
- 부제: "카카오톡으로 확인 메시지가 발송됩니다"

**안내사항**:
- 예약 시간 10분 전까지 방문해주세요
- 15분 이상 지연 시 자동 취소될 수 있습니다
- 변경/취소는 전화로 연락해주세요

**모달 확인 버튼**: "확인"

### 푸터 텍스트

- 저작권: "&copy; 2026 우리동네 카페. 초보 레벨 데모."

---

## 5. 기능 명세

### 폼 검증 로직

폼에 `novalidate` 속성이 설정되어 있으며, 모든 검증은 JavaScript에서 처리합니다.

검증 순서: `date` → `time` → `table` → `guests` → `name` → `phone`

| 필드 | 조건 | 에러 메시지 |
|------|------|------------|
| date | 빈값 | "날짜를 선택해주세요." |
| date | 오늘 이전 | "지난 날짜는 선택할 수 없습니다." |
| time | 빈값 | "시간대를 선택해주세요." |
| table | 빈값 (hidden input) | "테이블을 선택해주세요." |
| guests | 빈값 | "인원을 선택해주세요." |
| name | 빈값 (trim) | "이름을 입력해주세요." |
| name | 2자 미만 (trim) | "이름은 2자 이상 입력해주세요." |
| phone | 빈값 | "연락처를 입력해주세요." |
| phone | 정규식 `/^01[016789]\d{7,8}$/` 불일치 (숫자만 추출 후 검증) | "올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)" |

검증 실패 시 첫 번째 에러 요소로 `scrollIntoView({ behavior: 'smooth', block: 'center' })` 실행.

에러 표시 방식: 각 필드 아래 `<p id="[필드]-error">` 요소의 `hidden` 클래스 토글 + `textContent` 설정.

### 날짜 제한 규칙

```javascript
// min: 오늘 날짜 (YYYY-MM-DD)
dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);

// max: 오늘로부터 30일 뒤
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 30);
dateInput.setAttribute('max', `${maxYyyy}-${maxMm}-${maxDd}`);
```

### 시간대별 가용성 Mock 데이터

날짜 문자열을 해시로 변환하여 결정론적으로 비가용 시간대를 생성합니다.

```javascript
function getUnavailableForDate(dateStr) {
  // dateStr의 각 문자 charCode로 해시 생성
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  // 전체 11개 슬롯 중 (hash + idx * 7) % 5 === 0인 것을 차단
  const slots = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
  const blocked = [];
  slots.forEach((slot, idx) => {
    if ((hash + idx * 7) % 5 === 0) blocked.push(slot);
  });
  return blocked;
}
```

**동작**:
- 날짜 변경 시 `<select>` 옵션에 `disabled` 속성 추가 + 텍스트에 " (마감)" 접미사
- 현재 선택된 시간이 차단 목록에 포함되면 선택 초기화
- 가용성 텍스트 표시: `"잔여 시간대: N개 / 전체 11개"`
- 잔여 3개 이하: `text-red-500`, 그 외: `text-mocha-500`
- 결과는 `unavailableSlots` 객체에 캐시

### 전화번호 자동 포맷 로직

```javascript
phoneInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/[^0-9]/g, '');  // 숫자만 추출
  if (val.length > 11) val = val.slice(0, 11);       // 최대 11자리
  if (val.length >= 8) {
    val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);  // 000-0000-0000
  } else if (val.length >= 4) {
    val = val.slice(0, 3) + '-' + val.slice(3);  // 000-0000
  }
  e.target.value = val;
});
```

포맷 결과: `010-1234-5678` 형식으로 자동 변환.

### 예약 확인 모달 동작

**모달 열기**:
1. 폼 제출 (`submit` 이벤트) → `e.preventDefault()`
2. `validateForm()` 통과 시 예약 데이터 객체 생성
3. `saveBooking(booking)` — LocalStorage에 저장
4. `booking-summary` 영역에 예약 요약 HTML 렌더링 (그리드 레이아웃)
5. `confirm-modal`의 `hidden` 클래스 제거
6. `document.body.style.overflow = 'hidden'` — 배경 스크롤 차단

**모달 닫기** (3가지 방법):
1. "확인" 버튼 클릭 (`#modal-close`)
2. 배경(backdrop) 클릭 (`#modal-backdrop`)
3. ESC 키 누르기

**닫기 후 처리**:
- `modal.classList.add('hidden')`
- `document.body.style.overflow = ''`
- `form.reset()` — 폼 초기화
- 테이블 선택 초기화 (`.table-btn` 선택 해제, hidden input 빈값)
- 시간대 가용성 표시 숨기기
- 모든 time 옵션 disabled 해제 + " (마감)" 텍스트 제거
- `renderRecentBookings()` — 최근 예약 내역 갱신

**예약 요약 표시 항목**:
- 날짜 (formatDate 적용)
- 시간 (시작 - 종료, 종료는 시작+1시간)
- 테이블 (tableName)
- 인원 (N명)
- 예약자 (이름)
- 연락처
- 요청사항 (있을 때만, escapeHtml 적용)

### LocalStorage 저장 구조

**키**: `cafe_bookings`

**값**: JSON 배열 (최대 5개, 최근순)

```javascript
[
  {
    "date": "2026-03-15",
    "time": "14:00",
    "table": "3",
    "tableName": "C석 (4인 소파)",
    "guests": "4",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "request": "생일 파티 준비 부탁드립니다",
    "createdAt": "2026-03-11T10:30:00.000Z"
  }
]
```

- 새 예약은 `unshift`로 배열 앞에 추가
- 5개 초과 시 `bookings.length = 5`로 절단
- `try/catch`로 감싸서 localStorage 접근 실패 시 무시

**최근 예약 내역 표시** (`#recent-bookings-section`):
- 예약이 1개 이상이면 표시, 0개면 `hidden`
- 각 항목: `날짜 | 시간 | 테이블명` + 오른쪽에 예약자 이름

### 스크롤 애니메이션 동작

`IntersectionObserver` 사용:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
```

- `.fade-in` 클래스를 가진 모든 요소를 관찰
- 뷰포트 진입 시 `.visible` 추가 (한 번만, 제거하지 않음)
- 효과: `opacity: 0 → 1`, `translateY(24px) → 0`, `0.7s ease`

### 네비게이션 스크롤 그림자

```javascript
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('shadow-md');
  } else {
    navbar.classList.remove('shadow-md');
  }
});
```

### 햄버거 메뉴 동작

**토글**:
1. `#hamburger` 클릭 → `menuOpen` 상태 반전
2. `#mobile-menu`의 `hidden` 클래스 토글
3. `#hamburger`의 `hamburger-open` 클래스 토글 (3줄 → X 애니메이션)
4. `aria-label` 변경: "메뉴 열기" ↔ "메뉴 닫기"

**링크 클릭 시 닫기**:
- `.mobile-link` 클릭 → 메뉴 숨기기 + hamburger-open 제거 + menuOpen = false

### 유틸리티 함수

**formatDate(dateStr)**:
```javascript
// "2026-03-15" → "2026년 3월 15일 (일)"
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const days = ['일','월','화','수','목','금','토'];
  const dt = new Date(dateStr + 'T00:00:00');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${days[dt.getDay()]})`;
}
```

**escapeHtml(str)**:
```javascript
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

---

## 6. 반응형 규칙

### 브레이크포인트별 레이아웃

Tailwind 기본 브레이크포인트 사용:

| 브레이크포인트 | 적용 변경사항 |
|----------------|--------------|
| **기본 (mobile)** | 단일 컬럼, 햄버거 메뉴, 히어로 이미지 숨김 |
| **sm (640px)** | 메뉴 카드 2열, 폼 필드 2열 그리드, 인원 셀렉트 `w-48`, 히어로 타이틀 `text-5xl` |
| **md (768px)** | 데스크톱 네비 표시 + 햄버거 숨김, 히어로 2열 그리드 (이미지 표시), 매장정보 2열, 푸터 가로 배치, 테이블 그리드 5열 |
| **lg (1024px)** | 메뉴 카드 3열, 히어로 타이틀 `text-6xl` |

### 세부 반응형 클래스

**네비게이션**:
- 데스크톱 메뉴: `hidden md:flex`
- 햄버거: `md:hidden`
- 모바일 메뉴: `md:hidden hidden` (기본 숨김)

**히어로**:
- 그리드: `grid md:grid-cols-2`
- 이미지 영역: `hidden md:block`
- 타이틀: `text-4xl sm:text-5xl lg:text-6xl`

**메뉴 그리드**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`

**예약 폼**:
- 컨테이너: `max-w-4xl`
- 날짜/시간: `grid sm:grid-cols-2 gap-5`
- 이름/연락처: `grid sm:grid-cols-2 gap-5`
- 테이블 그리드: `grid grid-cols-3 sm:grid-cols-5 gap-3`
- 인원 셀렉트: `w-full sm:w-48`
- 폼 내부 패딩: `p-6 sm:p-8`

**매장정보**: `grid md:grid-cols-2 gap-8`

**푸터**: `flex flex-col md:flex-row justify-between items-center gap-6`

---

## 7. 수정 가이드

### 메뉴 아이템 추가/변경 방법

`#menu` 섹션 내 `.grid` 컨테이너에 다음 템플릿을 복사하여 추가합니다:

```html
<div class="fade-in bg-white rounded-2xl p-6 border border-coffee-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
  <div class="bg-gradient-to-br from-coffee-100 to-cream-200 rounded-xl h-48 flex items-center justify-center mb-5 group-hover:scale-[1.02] transition-transform">
    <span class="text-6xl">[이모지]</span>
  </div>
  <div class="flex justify-between items-start mb-2">
    <h3 class="font-bold text-lg text-mocha-800">[메뉴명]</h3>
    <span class="text-coffee-600 font-bold">₩[가격]</span>
  </div>
  <p class="text-mocha-500 text-sm leading-relaxed">[설명]</p>
  <div class="flex gap-2 mt-4">
    <!-- 일반 태그 -->
    <span class="bg-coffee-50 text-coffee-600 text-xs px-2.5 py-1 rounded-full font-medium">[태그]</span>
    <!-- 강조 태그 (BEST, NEW, 한정 등) -->
    <span class="bg-cream-400/30 text-coffee-700 text-xs px-2.5 py-1 rounded-full font-medium">[태그]</span>
  </div>
</div>
```

- 일반 태그 (HOT, ICE, DECAF): `bg-coffee-50 text-coffee-600`
- 강조 태그 (BEST, NEW, 한정): `bg-cream-400/30 text-coffee-700`
- 그리드가 자동 배치하므로 순서만 맞추면 됩니다.

### 색상 테마 변경 방법

`<script>` 태그 내 `tailwind.config`의 `colors` 객체를 수정합니다.

- `coffee`: 주요 강조 색상 (CTA, 히어로, 푸터)
- `cream`: 배경 색상
- `mocha`: 텍스트/중립 색상

각 색상 계열의 50~950 값을 일괄 교체하세요. 사이트 전체에서 Tailwind 유틸리티 클래스로 참조되므로 config만 바꾸면 자동 반영됩니다.

**주의**: 커스텀 CSS의 하드코딩 값도 함께 변경해야 합니다:
- `.table-btn.selected`: `background-color: #d4802e` (coffee-500), `border-color: #b86424` (coffee-600)
- `.table-btn.selected:hover`: `background-color: #b86424` (coffee-600)
- `input:focus` box-shadow: `rgba(222, 154, 75, 0.35)` (coffee-400 계열)

### 시간대 가용성 데이터 변경 방법

`getUnavailableForDate` 함수를 수정합니다.

**방법 1 — 특정 날짜 고정 차단**:
```javascript
const unavailableSlots = {
  '2026-03-15': ['12:00', '13:00', '14:00'],
  '2026-03-16': ['10:00', '20:00'],
};
```
`unavailableSlots` 객체에 날짜-시간 매핑을 직접 작성하면 해당 날짜는 고정 데이터를 사용합니다.

**방법 2 — 해시 알고리즘 변경**:
`(hash + idx * 7) % 5 === 0` 조건을 조정하여 차단 빈도를 변경합니다.
- 나누는 수를 늘리면 차단 슬롯 감소 (예: `% 7`)
- 나누는 수를 줄이면 차단 슬롯 증가 (예: `% 3`)

**시간대 슬롯 추가/제거**:
1. `<select id="time">` 내 `<option>` 태그 추가/제거
2. `getUnavailableForDate` 내 `slots` 배열 동기화
3. 가용성 표시의 "전체 11개" 숫자 수정 (`const available = [총개수] - blocked.length`)

### 폼 필드 추가/제거 방법

**필드 추가 절차**:

1. `<form id="booking-form">` 내에 HTML 추가 (기존 필드 스타일 참고)
2. 에러 표시용 `<p id="[필드ID]-error" class="text-red-500 text-xs mt-1.5 hidden"></p>` 추가
3. `validateForm()` 함수에 검증 로직 추가:
   - `hideError` 배열에 필드 ID 추가
   - 검증 조건과 에러 메시지 추가
4. 폼 제출 핸들러의 `booking` 객체에 해당 필드 값 추가
5. 모달의 `summary.innerHTML` 템플릿에 표시 항목 추가

**필드 제거 절차**:
1. HTML에서 해당 필드 블록 삭제
2. `validateForm()`에서 관련 검증 코드 제거
3. `hideError` 배열에서 필드 ID 제거
4. `booking` 객체에서 해당 속성 제거
5. 모달 요약에서 해당 항목 제거

### 테이블 추가/제거 방법

1. `#table-grid` 내에 버튼 추가/제거:
```html
<button type="button" data-table="[번호]" class="table-btn border-2 border-coffee-200 rounded-xl p-4 text-center hover:border-coffee-400 hover:bg-coffee-50 focus:border-coffee-400 transition-all">
  <span class="block text-2xl mb-1">[아이콘]</span>
  <span class="block text-xs font-semibold text-mocha-700">[석 이름]</span>
  <span class="block text-xs text-mocha-400">[수용인원]</span>
</button>
```
2. JS의 `tableNames` 객체에 매핑 추가/제거:
```javascript
const tableNames = { ..., [번호]: '[석 이름] ([수용인원])' };
```
