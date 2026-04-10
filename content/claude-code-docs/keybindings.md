---
title: "키보드 단축키 가이드: 나만의 단축키로 Claude Code 더 빠르게"
source: "https://code.claude.com/docs/en/keybindings"
order: 14
tags: ["설정", "단축키", "Keybindings"]
---

# 키보드 단축키 가이드: 나만의 단축키로 Claude Code 더 빠르게

Claude Code의 키보드 단축키를 원하는 대로 바꿀 수 있습니다. 마치 자동차 시트와 거울 위치를 내 몸에 맞게 조정하는 것처럼요. 단축키 설정 파일을 수정하면 파일을 저장하는 즉시 적용됩니다. 재시작 필요 없습니다!

---

## 단축키 파일 열기

```
/keybindings
```

이 명령어를 실행하면 `~/.claude/keybindings.json` 파일이 생성되거나 열립니다.

---

## 기본 단축키 모음

### 전역 단축키 (어디서나 사용)

| 단축키 | 기능 |
|--------|------|
| `Ctrl+C` | 현재 작업 취소 |
| `Ctrl+D` | Claude Code 종료 |
| `Ctrl+T` | 작업 목록 표시/숨기기 |
| `Ctrl+O` | 상세 대화 기록 보기 |

### 채팅 입력창 단축키

| 단축키 | 기능 |
|--------|------|
| `Enter` | 메시지 전송 |
| `Escape` | 입력 취소 |
| `Shift+Tab` | 권한 모드 순환 |
| `Cmd+P` / `Meta+P` | 모델 선택기 열기 |
| `Cmd+T` / `Meta+T` | 확장 사고 켜기/끄기 |
| `Ctrl+R` | 이전 명령어 검색 |
| `Up/Down` | 이전/다음 명령어 기록 |
| `Ctrl+G` | 외부 편집기에서 열기 |
| `Ctrl+S` | 현재 입력 임시 저장 |
| `Ctrl+V` | 이미지 붙여넣기 (Windows: `Alt+V`) |

### 자동완성 단축키

| 단축키 | 기능 |
|--------|------|
| `Tab` | 제안 수락 |
| `Escape` | 메뉴 닫기 |
| `Up/Down` | 이전/다음 제안 |

### 확인(Confirmation) 대화상자

| 단축키 | 기능 |
|--------|------|
| `Y` 또는 `Enter` | 확인 |
| `N` 또는 `Escape` | 거절 |
| `Ctrl+E` | 권한 설명 보기/숨기기 |

### 작업 실행 중

| 단축키 | 기능 |
|--------|------|
| `Ctrl+B` | 작업을 백그라운드로 보내기 |

---

## 단축키 변경하기

설정 파일 형식:

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

- 단축키에 액션을 지정하면 해당 단축키로 그 액션을 실행합니다.
- `null`로 설정하면 기본 단축키를 제거합니다.

---

## 컨텍스트(Context): 어디서 적용되는 단축키인가요?

단축키는 상황(컨텍스트)에 따라 다르게 적용됩니다.

| 컨텍스트 | 설명 |
|---------|------|
| `Global` | 어디서나 |
| `Chat` | 채팅 입력창 |
| `Autocomplete` | 자동완성 메뉴가 열렸을 때 |
| `Confirmation` | 권한 확인 대화상자 |
| `Task` | 백그라운드 작업 실행 중 |
| `HistorySearch` | 이전 명령어 검색 중 |
| `Transcript` | 대화 기록 보기 |
| `ModelPicker` | 모델 선택기 |
| `Plugin` | 플러그인 대화상자 |

---

## 단축키 작성 문법

### 수정키 조합

```
ctrl+k          Ctrl + K
shift+tab       Shift + Tab
meta+p          Command/Meta + P
ctrl+shift+c    여러 수정키 조합
```

| 키워드 | 의미 |
|--------|------|
| `ctrl` 또는 `control` | Control 키 |
| `alt`, `opt`, `option` | Alt/Option 키 |
| `shift` | Shift 키 |
| `meta`, `cmd`, `command` | Command/Meta 키 |

### 특수 키 이름

| 키워드 | 키 |
|--------|---|
| `escape` 또는 `esc` | Escape |
| `enter` 또는 `return` | Enter |
| `tab` | Tab |
| `space` | 스페이스바 |
| `up`, `down`, `left`, `right` | 방향키 |
| `backspace`, `delete` | 삭제 키 |

### 대문자 = Shift

혼자 쓰인 대문자는 Shift를 의미합니다.
- `K` = `shift+k`
- `ctrl+K` = `ctrl+k` (수정키와 함께 쓰인 대문자는 Shift 미포함)

### 연속 단축키 (Chord)

스페이스로 구분된 단축키를 순서대로 누릅니다:
```
ctrl+k ctrl+s   → Ctrl+K를 누른 후 Ctrl+S
```

---

## 변경 불가 단축키

| 단축키 | 이유 |
|--------|------|
| `Ctrl+C` | 시스템 수준 취소 키 |
| `Ctrl+D` | 시스템 수준 종료 키 |

---

## 터미널 충돌 주의

| 단축키 | 충돌 가능 프로그램 |
|--------|----------------|
| `Ctrl+B` | tmux 접두어 (두 번 눌러야 Claude에 전달) |
| `Ctrl+A` | GNU screen 접두어 |
| `Ctrl+Z` | Unix 프로세스 일시 정지 |

---

## 단축키 오류 확인

```
/doctor
```

설정 파일에 오류가 있으면 경고를 보여줍니다.

---

## 예시 케이스

<div class="example-case">
<strong>상황 1: 편집기 단축키를 Claude에서도 쓰고 싶은 개발자</strong>

VS Code에서 `Ctrl+E`로 파일을 열던 개발자 한편집 씨는 Claude Code에서도 같은 단축키로 외부 편집기를 열고 싶습니다. `/keybindings`를 실행해 파일을 열고, `Chat` 컨텍스트에 `"ctrl+e": "chat:externalEditor"`를 추가했습니다. 이제 Claude 채팅창에서도 `Ctrl+E`로 편집기가 열립니다.

</div>

<div class="example-case">
<strong>상황 2: 잘못된 단축키를 지우고 싶은 사용자</strong>

`Ctrl+S`가 자꾸 실수로 눌려서 입력 내용이 임시 저장되는 게 불편한 박불편 씨. `"ctrl+s": null`을 설정해서 이 단축키를 비활성화했습니다.

</div>

<div class="example-case">
<strong>상황 3: Vim 모드와 단축키를 함께 사용하는 개발자</strong>

Vim 모드를 켠 상태에서 단축키도 커스터마이즈하고 싶은 김빔 씨. Vim 모드는 텍스트 편집 수준에서, 단축키는 UI 컴포넌트 수준에서 독립적으로 동작합니다. Escape 키는 Vim에서 INSERT→NORMAL 모드 전환에만 사용되고, 다른 `Ctrl+`조합은 단축키 시스템으로 정상 전달됩니다.

</div>

<div class="example-case">
<strong>상황 4: 모델을 빠르게 바꾸고 싶은 사용자</strong>

자주 모델을 바꾸는 이모델 씨는 `Cmd+P`(모델 선택기 열기)를 자주 씁니다. 이미 기본 단축키로 설정되어 있으니 별도 설정 없이 바로 사용 가능합니다. 모델 선택기에서 화살표 키로 노력 수준도 조절합니다.

</div>
