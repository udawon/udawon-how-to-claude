# TODOS

## TODO-001: Korean Overrides Phase 2 (한국어 설명 추가)

**What:** `data/korean-overrides.json` 파일을 만들어 상위 도구들에 한국어 설명을 수동으로 추가한다.

**Why:** vibeindex.ai와의 차별화 포인트. GitHub `description` 필드는 영어만 있거나 없는 경우가 많아 한국어 사용자가 도구를 이해하기 어렵다. 한국어 설명이 있으면 비개발자도 바로 가치를 파악할 수 있다.

**Pros:** 검색 노출 개선, 한국어 사용자 경험 차별화, vibeindex.ai 대비 명확한 가치 추가.

**Cons:** 수동 작업 필요 (상위 10–20개 기준), 주기적 업데이트가 필요할 수 있음.

**Context:** `/discover` 페이지 런치 시에는 GitHub `description` 필드 원문 그대로 표시한다. Phase 2에서 `data/korean-overrides.json`을 추가하면 `getRankings()` 함수가 자동으로 병합한다. 스키마: `{ "owner/repo": { "koreanDesc": "초보자를 위한 한국어 설명" } }`

**Depends on:** `/discover` 페이지 구현 완료 (TODO-002보다 나중)

---

## TODO-002: 홈페이지에 /discover 링크 추가

**What:** 메인 홈페이지에 "Claude Code 도구 탐색기" 링크 또는 배너를 추가하여 `/discover` 페이지로 유도한다.

**Why:** `/discover`가 완성되어도 사용자가 URL을 직접 알지 못하면 접근할 수 없다. 홈페이지 진입점이 있어야 신규 방문자가 발견할 수 있다.

**Pros:** 발견 가능성(discoverability) 대폭 향상, 사이트 체류 시간 증가.

**Cons:** 홈페이지 레이아웃 변경 필요 (소규모).

**Context:** `/discover` 구현 및 배포 완료 후 별도 작업으로 진행. 홈페이지 섹션 하단 또는 네비게이션 메뉴에 "🔍 도구 탐색기" 항목 추가 검토.

**Depends on:** `/discover` 구현 완료 및 Vercel 배포 확인
