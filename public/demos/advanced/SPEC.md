# 우리동네 카페 — 고급 레벨 데모 사이트 기획서

이 문서는 `index.html` 단일 파일로 구성된 카페 예약 관리 데모 사이트의 완전한 설계 명세다. Claude에게 이 문서를 주면 사이트를 처음부터 재현하거나 정확히 수정할 수 있어야 한다.

---

## 1. 프로젝트 개요

- **사이트 이름**: 우리동네 카페
- **HTML title**: `우리동네 카페 — 고급 레벨 데모`
- **버전**: v2.1.3
- **목적**: Claude Code 고급 레벨 사용법을 보여주는 인터랙티브 데모. 모듈 패턴, 이벤트 버스, 실시간 시뮬레이션 등 고급 아키텍처 패턴을 단일 HTML 파일로 구현한다.
- **타겟 레벨**: 고급 (Advanced)
- **언어**: 한국어 (`<html lang="ko">`)

### 기술 스택
- **단일 HTML 파일** (외부 파일 없음)
- **Tailwind CSS v3** — CDN (`https://cdn.tailwindcss.com`), 런타임 설정
- **Noto Sans KR** (본문) + **JetBrains Mono** (코드/모노) — Google Fonts
- **순수 JavaScript** (ES6+, 프레임워크 없음)

### 아키텍처 패턴
- **모듈 패턴 (IIFE + 네임스페이스)**: `CafeApp` 전역 객체 하나에 모든 모듈 캡슐화
- **이벤트 버스**: `EventBus.on/off/emit`으로 모듈 간 느슨한 결합
- **해시 라우터**: `location.hash` 기반 SPA 라우팅
- **Mock WebSocket**: `setInterval` (5초)로 실시간 데이터 변동 시뮬레이션
- **상태 객체**: `State` 단일 객체에 모든 앱 상태 집중

---

## 2. 디자인 시스템

### 색상 팔레트 (Tailwind config `theme.extend.colors`)

```javascript
brand: {
  50: '#fdf8f0', 100: '#f9eddb', 200: '#f2d7b0', 300: '#e9bc7e',
  400: '#de9a4b', 500: '#d4802a', 600: '#b8641f', 700: '#994c1c',
  800: '#7d3e1e', 900: '#67341c', 950: '#38190c',
},
surface: {
  50: '#faf9f7', 100: '#f3f1ec', 200: '#e6e1d8', 300: '#d4cdbf',
  400: '#bfb5a2', 500: '#af9f89', 600: '#9e8b74', 700: '#857462',
  800: '#6d6053', 900: '#5a5045', 950: '#2f2a24',
},
accent: {
  50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
  400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
  800: '#166534', 900: '#14532d',
},
danger: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
warn:   { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
info:   { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
```

### 다크 모드 설정

Tailwind `darkMode: 'selector'` — `<html data-theme="dark">` + `class="dark"` 동시 적용.

| 요소 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| body 배경 | `#faf9f7` | `#1a1714` |
| body 텍스트 | `#2f2a24` | `#e6e1d8` |
| .card 배경 | `#ffffff` | `#2a2520` |
| .card 테두리 | `#e6e1d8` | `#3d362e` |
| .sidebar 배경 | `#ffffff` | `#221e1a` |
| .sidebar 테두리 | `#e6e1d8` | `#3d362e` |
| .topbar 배경 | `#ffffff` | `#221e1a` |
| .topbar 테두리 | `#e6e1d8` | `#3d362e` |
| input/select/textarea 배경 | 기본 | `#2a2520` |
| input/select/textarea 테두리 | 기본 | `#3d362e` |
| .table-row:hover | `#fdf8f0` | `#332e28` |
| .modal-overlay | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.7)` |

### 폰트 설정
- **기본 폰트**: `'Noto Sans KR', sans-serif` — `*` 셀렉터로 전역 적용
- **코드/모노**: `'JetBrains Mono', monospace` — `code`, `.mono` 클래스
- **폰트 웨이트**: Noto Sans KR `300,400,500,600,700` / JetBrains Mono `400,500`
- **Google Fonts URL**: `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`

### 레이아웃 규칙
- **전체 구조**: `flex flex-col min-h-screen`
  - 상단 배너 (brand-600 배경, 흰색 텍스트)
  - 상단 바 (sticky top-0 z-30, border-b)
  - 본문 영역: `flex flex-1 overflow-hidden`
    - 사이드바 (왼쪽, w-56, border-r)
    - 메인 콘텐츠 (flex-1, p-4 md:p-6)

### 사이드바 규칙
- 너비: `w-56` (14rem)
- 접기/펼치기: `.collapsed` 클래스 → `transform: translateX(-100%); width: 0; overflow: hidden`
- 전환 애니메이션: `transition: transform 0.3s ease, width 0.3s ease`
- 모바일 (max-width: 768px): `position: fixed; z-index: 40; height: 100vh`
- 하단 고정 영역: 버전 표기 `v2.1.3 · Advanced Demo`

### 애니메이션
- `.fade-in`: `fadeIn 0.3s ease` (opacity 0→1, translateY 8px→0)
- `.pulse-dot`: `pulse-dot 1.5s ease-in-out infinite` (opacity 1→0.4→1)
- `.chart-bar`: `transition: height 0.6s ease`

### 컴포넌트 스타일
- **카드**: `.card` + `border rounded-xl` + 패딩은 용도별 상이 (p-5, p-6, p-8)
- **상태 뱃지**: `.status-badge` — `padding: 2px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500`
- **KPI 카드**: `.kpi-card` — 오른쪽 상단 장식 원 (::after, w-80px h-80px, opacity 0.08)
- **스크롤바**: `.scrollbar-thin` — webkit 6px, thumb `#bfb5a2`, radius 3px
- **툴팁**: `.tooltip` — `::after`에 `data-tip` attr, bottom:100%, 호버 시 opacity 1, bg `#2f2a24`

---

## 3. 라우팅 구조

해시 기반 SPA 라우팅. `hashchange` 이벤트 리스닝.

| 해시 | 뷰 ID | 메뉴 이름 | 단축키 | 아이콘 (SVG path) |
|------|--------|----------|--------|------------------|
| `#booking` | `view-booking` | 고객 예약 | Ctrl+1 | 캘린더 (rect+path) |
| `#admin` | `view-admin` | 관리자 | Ctrl+2 | 막대 차트 (path) |
| `#devops` | `view-devops` | DevOps 모니터 | Ctrl+3 | 하트비트 라인 (path) |
| `#devtools` | `view-devtools` | 개발도구 | Ctrl+4 | 코드 괄호 `</>` (path) |

기본 뷰: `booking` (해시 없을 때)

### 사이드바 메뉴 구조
```
메뉴 (섹션 헤더)
  ├─ 고객 예약     [1]
  ├─ 관리자        [2]
  ├─ DevOps 모니터  [3]
  └─ 개발도구       [4]
빠른 작업 (섹션 헤더)
  └─ CSV 내보내기
─────────────────
v2.1.3 · Advanced Demo
```

### 네비게이션 활성 스타일
활성 메뉴에 추가되는 클래스: `bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 font-medium border-r-2 border-brand-500`

---

## 4. 고객 예약 뷰 (`view-booking`)

### 헤더
- 제목: "예약하기"
- 부제: "원하시는 날짜와 시간에 자리를 예약하세요"
- 오른쪽 버튼: "내 예약 보기"

### 3단계 위저드

위저드 인디케이터: 3개의 pill 형태 + 사이에 구분선 (`h-px bg-surface-200`)

| 단계 | 라벨 | 내용 |
|------|------|------|
| 1 | 날짜 선택 | 날짜 input (date), 인원수 select (1~6명, 기본 2명), 시간대 그리드 (grid-cols-4 sm:grid-cols-6) |
| 2 | 좌석 선택 | 좌석 맵 (grid-cols-3 sm:grid-cols-4), 범례 3가지 |
| 3 | 확인 | 이름 input, 연락처 input, 예약 요약, 요청 사항 textarea |

#### 위저드 인디케이터 스타일
- 활성 (현재 + 이전): `bg-brand-500 text-white`
- 비활성: `bg-surface-200 text-surface-500 dark:bg-surface-800`
- 번호 원: `w-5 h-5 rounded-full`, 활성 시 `bg-white/20`, 비활성 시 `bg-surface-300 dark:bg-surface-700`

#### 1단계 — 날짜 선택
- 날짜 기본값: 오늘
- 인원수 옵션: `1명, 2명(selected), 3명, 4명, 5명, 6명 (단체석)`
- 시간 그리드: 09:00~21:00 (30분 간격, 총 25개 슬롯)
- 예약된 시간: `line-through`, `cursor-not-allowed`, `bg-surface-100`
- 선택된 시간: `bg-brand-500 text-white border-brand-500`
- 유효성: 시간 미선택 시 "시간을 선택해주세요" 토스트

#### 2단계 — 좌석 맵
- 범례: 예약 가능 (accent-200 + accent-400 테두리), 예약 완료 (danger-400), 선택됨 (brand-500)
- 좌석 카드: `p-4 rounded-xl border-2`, 테이블 ID + 이름 + 인원 표시
- 예약됨: `bg-danger-50 border-danger-300 opacity-60 cursor-not-allowed`
- 용량 부족: `bg-surface-100 border-surface-200 opacity-50 cursor-not-allowed`
- 선택 가능: `bg-accent-50 border-accent-200 hover:border-brand-500`
- 선택됨: `bg-brand-500 text-white border-brand-600`
- 유효성: 좌석 미선택 시 "좌석을 선택해주세요" 토스트

#### 3단계 — 확인
- 이름: placeholder "홍길동"
- 연락처: placeholder "010-1234-5678", type="tel"
- 예약 요약: 날짜, 시간, 좌석, 인원 4줄
- 요청 사항: placeholder "창가석 선호, 유아 의자 필요 등", rows="2"
- 확정 버튼: `bg-accent-600 text-white hover:bg-accent-700`
- 유효성: 이름/연락처 비어있으면 토스트 경고

### 예약 완료 모달 (`booking-success-modal`)
- 체크 아이콘 (accent-100 원형 배경)
- 제목: "예약이 완료되었습니다!"
- 부제: "확인 이메일이 발송되었습니다 (모의)"
- 상세 정보: 예약번호, 이름, 날짜/시간, 좌석, 인원
- Mock QR 코드: 8x8 그리드, 랜덤 셀 채움 (`bg-surface-900` or transparent)
- 확인 후: 위저드 1단계로 리셋, 입력 필드 초기화
- 1.5초 후 추가 토스트: "확인 이메일이 발송되었습니다 (모의)"

### 내 예약 모달 (`my-reservations-modal`)
- `isMyBooking: true`인 예약만 필터
- 각 예약 카드: 예약번호, 상태 뱃지, 날짜/시간, 좌석/인원
- 미니 QR 코드 (w-16 h-16)
- 예약 없으면: "예약 내역이 없습니다"

---

## 5. 관리자 대시보드 뷰 (`view-admin`)

### 로그인 게이트 (`admin-login`)
- 자물쇠 아이콘 (brand-100 원형 배경)
- 제목: "관리자 로그인"
- 안내 텍스트: "데모 비밀번호: `admin1234`"
- 비밀번호: `admin1234`
- 실패 시: "비밀번호가 올바르지 않습니다" (2초 후 숨김)
- Enter 키 로그인 지원

### 대시보드 헤더
- 제목: "관리자 대시보드"
- 부제: "오늘의 카페 운영 현황을 한눈에 확인하세요"
- 오른쪽 버튼 2개: "선택 확인" (accent 계열), "선택 취소" (danger 계열)

### KPI 카드 (grid-cols-2 lg:grid-cols-4)

| 카드 | 라벨 | ID | 하단 텍스트 |
|------|------|----|------------|
| 오늘 예약 | 오늘 예약 | `kpi-today` | `+N vs 어제` (랜덤 1~5) |
| 이번 주 | 이번 주 | `kpi-week` | 총 예약 건수 |
| 이용률 | 이용률 | `kpi-usage` | 현재 좌석 기준 |
| 매출 추정 | 매출 추정 | `kpi-revenue` | 인당 ₩8,500 기준 |

이용률 계산: `Math.min(100, Math.round((activeToday.length / (tables.length * 2)) * 100))`
매출 계산: `weekRes.reduce((s,r) => s + r.guests * 8500, 0)`

### CSS 차트 (grid lg:grid-cols-3)

#### 일별 예약 추이 (7일)
- 세로 막대 차트, `h-36`
- 요일 라벨: 일,월,화,수,목,금,토
- 바 색상: `bg-brand-400 dark:bg-brand-600`
- 툴팁: `N건`
- 높이: 최대값 대비 퍼센트

#### 시간대별 인기도
- 세로 막대 차트, `h-36`
- 시간 범위: 9시~21시
- 색상 조건: >70% → `bg-danger-400`, >40% → `bg-warn-400`, 나머지 → `bg-accent-400`
- 하단 라벨: `9시, 12시, 15시, 18시, 21시`
- 툴팁: `N시: N건`

#### 테이블별 이용률
- 수평 진행 바, 상위 6개 테이블만 표시
- 색상 조건: >70% → `bg-danger-400`, >40% → `bg-brand-400`, 나머지 → `bg-accent-400`
- 각 바: `h-2 rounded-full`, 배경 `bg-surface-200 dark:bg-surface-800`

### 예약 관리 테이블

#### 필터
- 상태 필터 select: 전체, 대기, 확인, 입장, 완료, 취소

#### 테이블 컬럼
| 컬럼 | 내용 |
|------|------|
| 체크박스 | 전체 선택/해제 (admin-check-all) |
| 예약번호 | `#ID` (mono) |
| 이름 | |
| 날짜 | |
| 시간 | |
| 테이블 | tableId |
| 인원 | `N명` |
| 상태 | 상태 뱃지 |
| 작업 | 다음 상태 버튼 |

표시 제한: 최대 30건 (`filtered.slice(0, 30)`)

#### 상태 워크플로우
```
대기 → 확인 → 입장 → 완료
```
- 각 단계에서 다음 상태로 진행하는 버튼만 표시
- `완료` 상태면 작업란에 `-`

#### 상태 뱃지 색상
| 상태 | 라이트 | 다크 |
|------|--------|------|
| 대기 | `bg-warn-100 text-warn-600` | `bg-yellow-900 text-warn-400` |
| 확인 | `bg-info-100 text-info-600` | `bg-blue-900 text-info-400` |
| 입장 | `bg-accent-100 text-accent-700` | `bg-accent-900 text-accent-300` |
| 완료 | `bg-surface-200 text-surface-600` | `bg-surface-800 text-surface-400` |
| 취소 | `bg-danger-100 text-danger-600` | `bg-red-900 text-danger-400` |

#### Bulk Actions
- "선택 확인": 체크된 예약 중 `대기` → `확인`으로 변경
- "선택 취소": 체크된 예약 모두 `취소`로 변경
- 선택 없으면: "선택된 예약이 없습니다" 토스트

---

## 6. DevOps 모니터 뷰 (`view-devops`)

### 헤더
- 제목: "DevOps 모니터"
- 부제: "CI/CD 파이프라인과 시스템 상태를 모니터링합니다"

### CI/CD 파이프라인
3단계 가로 배열 (`flex flex-wrap gap-4`), 단계 사이 화살표 (`→`)

| 단계 | 상태 | 상세 | 추가 정보 |
|------|------|------|----------|
| Build | Passed (체크마크) | 2분 30초 | commit: a3f7c2d |
| Test | Passed (체크마크) | 47/47 passed | coverage: 94.2% |
| Deploy | Passed (체크마크) | Production (v2.1.3) | region: ap-northeast-2 |

각 단계 스타일: `border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-950`, `min-w-[200px]`

### 시스템 메트릭스 (grid md:grid-cols-3)

| 메트릭 | ID | 초기값 | 단위 | 진행바 % |
|--------|-----|--------|------|---------|
| API Response Time | `metric-response` | 142 | ms avg | 28% |
| Error Rate | `metric-error` | 0.02 | % | 2% |
| Uptime | `metric-uptime` | 99.97 | % | 99.97% |

- Response Time, Error Rate은 실시간 시뮬레이션으로 5초마다 변동
  - Response: `130 + Math.floor(Math.random() * 40)` (130~169)
  - Error: `(Math.random() * 0.05).toFixed(2)` (0.00~0.05)
- 진행바: `h-1 rounded-full`, 배경 `bg-surface-200 dark:bg-surface-800`, 바 `bg-accent-500`

### 배포 히스토리 테이블

컬럼: 버전, 상태, 시간, 배포자

#### 배포 데이터 (deployHistory)
```javascript
[
  { version: 'v2.1.3', status: 'success', time: '14:25', deployer: 'CI/CD Bot' },
  { version: 'v2.1.2', status: 'success', time: '어제 18:40', deployer: 'kim.dev' },
  { version: 'v2.1.1', status: 'rollback', time: '어제 17:55', deployer: 'kim.dev' },
  { version: 'v2.1.0', status: 'success', time: '3일 전', deployer: 'CI/CD Bot' },
  { version: 'v2.0.9', status: 'success', time: '5일 전', deployer: 'park.dev' },
  { version: 'v2.0.8', status: 'failed', time: '6일 전', deployer: 'CI/CD Bot' },
]
```

상태 뱃지 색상:
- success: `bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300`
- rollback: `bg-warn-100 text-warn-600 dark:bg-yellow-900 dark:text-warn-400`
- failed: `bg-danger-100 text-danger-600 dark:bg-red-900 dark:text-danger-400`

### 에러 로그 뷰어

필터: 전체, Error, Warning, Info

#### 에러 데이터 (errorLogs)
```javascript
[
  { severity: 'error', time: '14:22:03', message: 'PaymentService timeout — Retry 3/3 실패', source: 'payment.ts:142' },
  { severity: 'warn',  time: '14:18:55', message: 'Slow query detected: SELECT * FROM reservations (420ms)', source: 'db.ts:89' },
  { severity: 'info',  time: '14:15:22', message: 'Cache invalidated: reservation_list', source: 'cache.ts:34' },
  { severity: 'warn',  time: '14:10:01', message: 'Rate limit approaching: 85/100 requests per minute', source: 'middleware.ts:22' },
  { severity: 'info',  time: '14:05:33', message: 'Health check passed: all services operational', source: 'health.ts:8' },
  { severity: 'error', time: '13:58:12', message: 'Supabase Realtime reconnect — channel: reservation_updates', source: 'realtime.ts:67' },
  { severity: 'info',  time: '13:50:00', message: 'Scheduled backup completed (2.3GB)', source: 'cron.ts:15' },
  { severity: 'warn',  time: '13:42:18', message: 'Memory usage: 78% (threshold: 80%)', source: 'monitor.ts:44' },
]
```

severity 아이콘: 색상 원 (`●`) — error: `text-danger-500`, warn: `text-warn-500`, info: `text-info-500`

---

## 7. 개발도구 뷰 (`view-devtools`)

### 헤더
- 제목: "개발도구"
- 부제: "MCP 서버, Hook 실행, 에이전트 팀 상태를 관리합니다"

### MCP Server 연결 패널 (정적 HTML)

| 서버 | 주소 | 상태 | 인디케이터 색상 |
|------|------|------|----------------|
| Supabase | `mcp://supabase:5432` | Connected | accent-500 (pulse) |
| Playwright | `mcp://playwright:9222` | Connected | accent-500 (pulse) |
| Sentry | `mcp://sentry:443` | Degraded | warn-500 (pulse) |

Connected 뱃지: `bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300`
Degraded 뱃지: `bg-warn-100 text-warn-600 dark:bg-yellow-900 dark:text-warn-400`

### Agent Team 상태 (정적 HTML)

| 에이전트 | 아바타 | 역할 | 상태 | 아바타 스타일 |
|---------|--------|------|------|-------------|
| Leader | L | 전체 조율 | Active | `bg-brand-100 text-brand-600 dark:bg-brand-900` |
| Developer 1 | D1 | API 개발 | Complete | `bg-info-100 text-info-600 dark:bg-blue-900` |
| Developer 2 | D2 | UI 개발 | In Progress | `bg-info-100 text-info-600 dark:bg-blue-900` |
| QA | QA | 테스트 | Waiting | `bg-warn-100 text-warn-600 dark:bg-yellow-900` |

아바타: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold`

상태 뱃지 스타일:
- Active: `bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300`
- Complete: `bg-surface-200 text-surface-600 dark:bg-surface-800 dark:text-surface-400`
- In Progress: `bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300`
- Waiting: `bg-surface-100 text-surface-500 dark:bg-surface-900 dark:text-surface-500`

### Hook 실행 로그 (정적 HTML, max-h-64)

| 시간 | 상태 | Hook | 설명 |
|------|------|------|------|
| 14:32:01 | ✓ (accent-600) | pre-commit | ESLint + Prettier 검사 통과 (0.8s) |
| 14:31:58 | ✓ (accent-600) | pre-push | 타입 체크 통과 (2.1s) |
| 14:30:22 | ⚠ (warn-500) | post-checkout | .env 파일 변경 감지, 확인 필요 |
| 14:28:15 | ✓ (accent-600) | commit-msg | Conventional Commits 형식 확인 통과 |
| 14:25:03 | ✗ (danger-500) | pre-commit | 미사용 import 발견 (src/utils.ts:14) → 자동 수정됨 |

### 슬래시 명령어 목록 (정적 HTML, max-h-64)

| 명령어 | 설명 | 상태 |
|--------|------|------|
| `/deploy` | 프로덕션 배포 실행 | Active |
| `/test` | 전체 테스트 스위트 실행 | Active |
| `/db-migrate` | 데이터베이스 마이그레이션 | Active |
| `/rollback` | 이전 버전으로 롤백 | Caution (warn 계열) |
| `/monitor` | 시스템 메트릭 대시보드 열기 | Active |
| `/review` | 코드 리뷰 요청 생성 | Active |

명령어 코드 스타일: `text-brand-600 dark:text-brand-400 font-medium`

### CLAUDE.md 뷰어
- 파일 아이콘 + "CLAUDE.md" 제목
- 오른쪽: "마지막 수정: 2분 전" (정적)
- 내용 영역: `mono leading-relaxed max-h-64 bg-surface-50 dark:bg-surface-950`, `<pre>` 태그

내용 원본:
```
# 우리동네 카페 프로젝트

## Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth + Realtime)
- Tailwind CSS v3

## Conventions
- 커밋 메시지: Conventional Commits (한국어 본문 허용)
- 브랜치: feature/, fix/, chore/
- PR 리뷰 필수 (최소 1명)

## Environment
- Node.js 20+
- pnpm (npm/yarn 사용 금지)
- .env.local에 SUPABASE_URL, SUPABASE_ANON_KEY 필요

## Testing
- Vitest (단위 테스트)
- Playwright (E2E 테스트)
- 커버리지 목표: 90% 이상

## Deploy
- Vercel (자동 배포)
- Preview: PR 생성 시 자동
- Production: main 브랜치 머지 시

## Rules
- 컴포넌트는 src/components/ 하위에
- API 라우트는 src/app/api/ 하위에
- 공용 유틸은 src/lib/ 하위에
- 타입 정의는 src/types/ 하위에
```

---

## 8. 콘텐츠 원본

### 상단 배너
- 텍스트: `🌳 고급 레벨 데모 — CI/CD, 모니터링, 에이전트 팀 대시보드`

### 상단 바
- 로고: ☕ (&#9749;)
- 사이트명: "우리동네 카페"
- 실시간 인디케이터: 초록 pulse-dot + "실시간 연결" (sm 이상에서만 보임)
- 시계: `HH:MM:SS` (mono, sm 이상에서만 보임)
- 단축키 힌트: `Ctrl+1~4` (lg 이상에서만 보임)

### 고객 이름 목록 (Mock)
```javascript
['김민수','이서연','박지훈','최유진','정현우','강소희','조태양','윤하늘','임도윤','한서준','오채원','신우진','배수아','류건호','문지아']
```

### 테이블 데이터 (Mock)
```javascript
[
  { id: 'A1', name: '창가 1인석', capacity: 1, type: '1인' },
  { id: 'A2', name: '창가 2인석', capacity: 2, type: '2인' },
  { id: 'B1', name: '소파 2인석', capacity: 2, type: '2인' },
  { id: 'B2', name: '소파 4인석', capacity: 4, type: '4인' },
  { id: 'C1', name: '중앙 2인석', capacity: 2, type: '2인' },
  { id: 'C2', name: '중앙 4인석', capacity: 4, type: '4인' },
  { id: 'D1', name: '테라스 2인석', capacity: 2, type: '2인' },
  { id: 'D2', name: '테라스 4인석', capacity: 4, type: '4인' },
  { id: 'E1', name: '단체석 A', capacity: 6, type: '단체' },
  { id: 'E2', name: '단체석 B', capacity: 6, type: '단체' },
  { id: 'F1', name: '바 카운터 1', capacity: 1, type: '1인' },
  { id: 'F2', name: '바 카운터 2', capacity: 1, type: '1인' },
]
```

### 시간 슬롯 (Mock)
```javascript
['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00']
```

### 예약 상태 목록
```javascript
['대기','확인','입장','완료']
```
(초기 생성 시 오늘 예약은 랜덤, 과거 예약은 모두 '완료')

### 초기 예약 생성 규칙
- 최근 7일간 데이터 생성
- 각 날짜별 `5 + Math.floor(Math.random() * 10)` 건 (5~14건)
- 오늘 예약은 랜덤 상태, 과거 예약은 '완료'
- 예약 ID 시작: 1001

### 토스트 메시지 색상
```javascript
{ info: 'bg-info-500', success: 'bg-accent-600', error: 'bg-danger-500', warn: 'bg-warn-500' }
```
- 표시 시간: 3초
- 페이드아웃: 0.3초
- 위치: 우하단 (`fixed bottom-4 right-4 z-50`)

---

## 9. 기능 명세

### 모듈 패턴 구조

```
CafeApp (IIFE → 전역 객체)
├── EventBus (IIFE) — on, off, emit
├── State (객체) — currentView, theme, adminLoggedIn, sidebarOpen, bookingStep, selectedTime, selectedTable, reservations, nextId
├── Data (IIFE) — names, tables, times, todayStr, pastDateStr, generateInitialReservations, deployHistory, errorLogs, randomPick
├── Utils (객체) — $, $$, formatNum, toast, generateQR
├── Router (IIFE) — navigate, init
├── Theme (IIFE) — apply, toggle
├── Booking (IIFE) — goStep, renderTimeGrid, renderTableMap, confirmBooking, showMyReservations, init
├── Admin (IIFE) — login, renderDashboard, renderTable, advanceStatus, toggleAll, bulkAction
├── DevOps (IIFE) — renderDeployHistory, renderErrors, init
├── Realtime (IIFE) — start, stop
├── updateClock (함수)
├── statusColor (함수) — window.statusColor로도 전역 노출
├── exportCSV (함수)
├── initShortcuts (함수)
└── initSidebar (함수)
```

### Public API (return 객체)
```javascript
{ init, Booking, Admin, DevOps, EventBus, exportCSV, Router, Theme, State }
```

### 이벤트 버스 이벤트

| 이벤트명 | 발행 시점 | 구독자 |
|---------|----------|--------|
| `viewChanged` | Router.navigate() 호출 시 | admin 뷰 전환 시 대시보드 렌더링 |
| `reservationAdded` | 예약 생성 / 실시간 시뮬레이션 | booking 뷰에서 시간 그리드 갱신 |
| `statusChanged` | Admin.advanceStatus() 호출 시 | (현재 구독자 없음, 확장용) |

### Mock WebSocket (Realtime 모듈)
- `setInterval` 5초 간격
- API Response Time: 130~169 랜덤 변동
- Error Rate: 0.00~0.05 랜덤 변동
- 15% 확률로 새 예약 자동 생성 (`Math.random() > 0.85`)
- admin 뷰 + 로그인 상태면 대시보드 자동 갱신

### 테마 토글
- `localStorage` 키: `cafe-theme`
- 기본값: `light`
- 적용 방식: `data-theme` 속성 + `dark` 클래스 동시 설정/해제
- 아이콘 전환: 라이트 → 태양 SVG, 다크 → 달 SVG

### 키보드 단축키

| 단축키 | 동작 | 조건 |
|--------|------|------|
| `Ctrl+1` | 고객 예약 뷰 | Ctrl only (Shift/Alt 없이) |
| `Ctrl+2` | 관리자 뷰 | Ctrl only |
| `Ctrl+3` | DevOps 모니터 뷰 | Ctrl only |
| `Ctrl+4` | 개발도구 뷰 | Ctrl only |
| `Enter` | 관리자 로그인 | admin-pw input 포커스 시 |

단축키 동작: `location.hash` 변경 → `hashchange` 이벤트 → `Router.navigate()`

### CSV 내보내기
- 파일명: `우리동네카페_예약_YYYY-MM-DD.csv`
- BOM 추가: `\uFEFF` (한글 Excel 호환)
- 헤더: `예약번호,이름,전화번호,날짜,시간,테이블,인원,상태,메모`
- 전체 예약 데이터 포함
- Blob → `URL.createObjectURL` → `<a>` 클릭 → 다운로드

### 시계
- 1초 간격 `setInterval`
- 형식: `HH:MM:SS` (24시간제, 0 패딩)
- 위치: 상단 바 오른쪽, `sm:block` (모바일에서 숨김)

### Mock QR 코드
- 8x8 그리드 (64셀)
- 각 셀 55% 확률로 채움 (`Math.random() > 0.45`)
- 채움: `bg-surface-900 dark:bg-surface-100 rounded-sm`
- 빈칸: `bg-transparent`

### 초기화 순서 (`CafeApp.init`)
1. `Theme.apply(State.theme)` — 저장된 테마 적용
2. `State.reservations = Data.generateInitialReservations()` — 초기 데이터 생성
3. `Router.init()` — 라우터 시작
4. `Booking.init()` — 예약 뷰 초기화
5. `DevOps.init()` — DevOps 뷰 초기화
6. `initShortcuts()` — 키보드 단축키 등록
7. `initSidebar()` — 사이드바 토글 이벤트 등록
8. `Realtime.start()` — 실시간 시뮬레이션 시작
9. `setInterval(updateClock, 1000)` + `updateClock()` — 시계 시작
10. 테마 토글 이벤트 등록
11. admin-pw Enter 키 이벤트 등록
12. EventBus 구독 등록
13. 콘솔 로고 출력

### 콘솔 로고
```javascript
console.log('%c우리동네 카페 v2.1.3', 'color:#d4802a;font-size:16px;font-weight:bold');
console.log('%cAdvanced Demo — Module Pattern, Event Bus, Mock WebSocket', 'color:#af9f89');
```

---

## 10. 반응형 규칙

| 브레이크포인트 | 변경 사항 |
|--------------|----------|
| `max-width: 768px` | 사이드바: `position: fixed; z-index: 40; height: 100vh` |
| `sm:` (640px+) | "실시간 연결" 텍스트 표시, 시계 표시, 시간 그리드 6열 (`sm:grid-cols-6`), 좌석 맵 4열 (`sm:grid-cols-4`) |
| `md:` (768px+) | 메인 콘텐츠 패딩 `md:p-6`, 날짜/인원 2열 (`md:grid-cols-2`), 시스템 메트릭 3열 (`md:grid-cols-3`) |
| `lg:` (1024px+) | KPI 4열 (`lg:grid-cols-4`), 차트 3열 (`lg:grid-cols-3`), DevOps 배포/에러 2열 (`lg:grid-cols-2`), 개발도구 패널 2열 (`lg:grid-cols-2`), 단축키 힌트 kbd 표시, 사이드바 kbd 표시 |

기본 (모바일):
- 시간 그리드: 4열
- 좌석 맵: 3열
- KPI: 2열
- 차트: 1열 (세로 스택)
- "실시간 연결" 텍스트 숨김
- 시계 숨김
- 단축키 힌트 숨김

---

## 11. 수정 가이드

### 뷰 추가
1. `<main>` 안에 새 `<div id="view-새뷰이름" class="view hidden fade-in">` 추가
2. 사이드바에 `<a class="nav-link" data-view="새뷰이름">` 항목 추가
3. `initShortcuts()`의 `viewMap` 객체에 단축키 매핑 추가 (예: `'5': '새뷰이름'`)
4. 상단 바의 `kbd` 힌트 텍스트 업데이트

### 뷰 제거
1. 해당 `<div id="view-xxx">` 블록 삭제
2. 사이드바의 해당 `<a>` 삭제
3. `viewMap`에서 해당 키 제거
4. 관련 모듈 (IIFE) 및 Public API return 객체에서 제거

### Mock 데이터 변경
- **고객 이름**: `Data` 모듈의 `names` 배열 수정
- **테이블 목록**: `Data.tables` 배열 수정 (id, name, capacity, type 필수)
- **시간 슬롯**: `Data.times` 배열 수정
- **배포 이력**: `Data.deployHistory` 배열 수정 (version, status, time, deployer 필수)
- **에러 로그**: `Data.errorLogs` 배열 수정 (severity, time, message, source 필수)
- **초기 예약 건수**: `generateInitialReservations()`의 `5 + Math.floor(Math.random() * 10)` 조정
- **예약 ID 시작**: `State.nextId` 값 변경 (기본 1001)

### 테마 색상 변경
1. `<script>` 내 `tailwind.config.theme.extend.colors` 객체 수정
2. `<style>` 내 `[data-theme="dark"]` / `[data-theme="light"]` 규칙 수정
3. `statusColor()` 함수의 색상 매핑 수정
4. 토스트 색상: `Utils.toast`의 `colors` 객체 수정

### 키보드 단축키 변경
- `initShortcuts()`의 `viewMap` 객체 수정
- 조건: `e.ctrlKey && !e.shiftKey && !e.altKey` — 수정자 키 조합 변경 가능
- 사이드바 및 상단 바의 `kbd` 요소 텍스트도 함께 업데이트

### MCP 서버 목록 변경
- `view-devtools` 내 `#mcp-servers` div 안의 HTML 직접 수정 (정적 HTML)
- 각 서버 구조:
  ```html
  <div class="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
    <div class="flex items-center gap-3">
      <span class="w-2 h-2 rounded-full bg-[상태색]-500 pulse-dot"></span>
      <div>
        <div class="text-sm font-medium">[서버 이름]</div>
        <div class="text-[10px] text-surface-400 mono">[주소]</div>
      </div>
    </div>
    <span class="status-badge [뱃지 스타일]">[상태]</span>
  </div>
  ```

### Agent Team 변경
- `#agent-team` div 안의 HTML 직접 수정 (정적 HTML)
- 아바타 색상/글자, 이름, 역할, 상태 뱃지를 원하는 대로 조정

### 매출 계산 기준 변경
- `Admin.renderDashboard()`의 `r.guests * 8500` 부분에서 `8500` 값 변경
- KPI 카드의 하단 텍스트 "인당 ₩8,500 기준"도 함께 수정

### 실시간 시뮬레이션 조정
- 갱신 주기: `Realtime.start()`의 `setInterval` 두 번째 인자 (기본 5000ms)
- 새 예약 생성 확률: `Math.random() > 0.85`의 0.85 값 조정 (높을수록 낮은 확률)
- 메트릭 범위: Response `130 + Math.floor(Math.random() * 40)`, Error `Math.random() * 0.05`
