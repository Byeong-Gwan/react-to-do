## Todo update 기능

1. Todo 수정(Edit) 기능 추가
- 추가 위치
    - TodoItem.jsx
    - useTodos.jsx

- 기능 구성
    - Todo 한 줄 단위에서 수정 기능 제공
    - 수정 모드/ 보기 모드로 UI 분기

- 동작
    - '수정' 버튼 클릭 -> 수정 모드 진입
    - input 자동 포커스
    - Enter / 저장 버튼 -> 수정 내용 반영
    - ESC / 취소 버튼 -> 수정 취소
    - 포커스 아웃(blur) 시 자동 저장
    - 수정 중에는 완료 체크박스 비활성화
    - 빈 문자열은 저장되지 않음

2. Todo 텍스트 업데이트 로직 추가
- useTodos에 함수 추가
```javascript
    updateTodo(id, text)
```

- 동작
    - 특정 Todo의 `text`만 업데이트
    - 다른 Todo 상태에는 영향 없음

3. `props` 전달 구조 보안
- 추가/ 변경된 `props`
    - `onUpdate` 추가
    - `TodoPage` -> `TodoList` -> `TodoItem`으로 전달

- 목적: `Todo` 수정 로직을 `TodoItem` 단위에서 처리