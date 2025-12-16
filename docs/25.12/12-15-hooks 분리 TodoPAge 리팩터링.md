### TodoPage 리팩터링 기록: Hook 분리 과정 + 에러 해결
1. 목표
    - TodoList(추후 이름 변경) 프로젝트를 진행하면서 컴포넌트에 몰려 있던 로직을 `custom hook`으로 분리해 구조를 단순화하고, 새로고침 시 데이터 유지(`LocalStorage`)를 포함한 "서비스처럼 동작"하는 형태로 개선 (아직 미흡)

2. 리팩터링 전 구조 (문제점)
    - TodoPage에 로직이 몰림
        - `todos` 상태 관리
        - `add`/ `delete`/ `toggle` 함수
        - `localStorage` 저장/ 로드 `useEffect`
        - UI 렌더링
        결과: 파일이 커지고, 역할이 섞여서 읽기 어렵고, 재사용성이 떠러짐

3. 리팩토링 목표 구조 (아키텍처)
    - 책임 분리
        - TodoPage (UI): 화면만 담당
        - useTodos (로직/ 상태): `todos` 상태/ `CRUD`/ `localStorage` 담당
        - TodoInput (UI 컴포넌트): 체크박스 UI 및 토글 이벤트만 처리
    - 컴포넌트 관계 (개념)

    ```css
       TodoPage
        ├─ input + add 버튼 (텍스트 입력 UI)
        └─ ul
            └─ li * N
                ├─ TodoInput (checkbox)
                ├─ text
                └─ delete button

    ```

4. 최종 폴더 구조
```css
    src/
    ├─ pages/
    │   └─ TodoPage.jsx
    ├─ hooks/
    │   └─ useTodos.jsx
    └─ components/
        └─ TodoInput.jsx

```

5. useTodos hook 구현 내용 (핵심 기능)
    - 초기값: LocalStorage 에서 로드
        - 앱 진입 시 `localStorage.getItem('todos')`를 읽어 초기 `todos`를 세팅
        - 데이터가 없으면 빈 배열로 시작
    - CRUD + 토글
        - `addTodo(text)`
        - `deleteTodo(id)`
        - `toggleTodo(id)`
    - 변경될 때마다 자동 저장
        - `todos`가 바뀔 때마다 `localStorage.setItem`으로 저장

6. Hook 분리 중 겪은 주요 에러 & 해결 과정
    - `text.trim is not a function`
        - 에러 
        ```vbnet
         Uncaught TypeError: text.trim is not a function 
        ```
        - 원인
            - `addTodo(text)`의 `text`가 문자열이 아니라 이벤트 객체(MouseEvent)로 케이스가 있었음
            - 예: 버튼에 `onClick={addTodo}` 처럼 직접 연결하면, React가 `addTodo(event)`로 호출함
        - 해결: `onAdd`같은 래퍼 함수를 만들어서 항상 문자열을 넘기도록 변경 
        - 배운점:
            이벤트 헨들러에 함수를 그대로 넘기면 React가 이벤트 객체를 넣어 호출할 수 있다. 
            인자를 넘겨야 하면 `() => 함수(인자)` 형태로 래핑해야 안정하다.

    - `toggleTodo is not a function
        - 에러
        ```javascript
         TodoInput.jsx:9 Uncaught TypeError: toggleTodo is not a function
        ```
        - 원인: 부모가 내려주는 `props` 이름과 자식이 받는 `props`이름이 불일치
        - 예)
            부모: `<TodoInput item={item} onToggle={toggleTodo} />`
            자식: `function TodoInput({ item, toggleTodo }) { ... }`
            즉 자식이 기대한 `toggleTodo`는 `undefined` -> 함수 호출 시 에러 발생
        - 해결 
            - props 이름을 통일 (둘 중 하나로 확정)
            ```jsx
             // TodoPage
             <TodoInput item={item} toggleTodo={toggleTodo} />
            ```
            ```jsx
             // TodoInput
             function TodoInput({ item, toggleTodo }) {
                return (
                    <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTodo(item.id)}
                    />
                );
             }
            ```
        - 배운점:
            컴포넌트 분리 시, 자식은 부모의 함수/ 변수에 접근할 수 없고 `props`로 전달받아야 한다.
            `props` 이름이 조금이라도 다르면 `undefined`가 된다. (이 부분이 자주 실수한 내용)

    - `map` 렌더링이 안 보이던 문제 (초기 경험)
        - 증상: 콘솔에는 값이 찍히는데 화면에 리스트가 안 보임
    - 원인: `todos.map(item => { ... })` 현태에서 중괄호 `{}`를 썼는데 `return`이 빠져서 `JSX`가 반환되지 않음
    - 해결
        - 소괄호 `()`로 `JSX`를 반환하도록 수정
        ```jsx
         {todos.map(item => (
            <li key={item.id}>...</li>
         ))}
        ```
    - 배운점
        `{}` 사용 -> `return` 필수
        `()` 사용 -> `return` 생략 가능

7. 최종 코드 요약 (현재 구조)
    - TodoPage.jsx 역할
        - `inputValue` 상태(텍스트 입력)만 관리
        - `hook`에서 받은 함수로 CRUD 실행
        - 리스트 렌더링
    - TodoInput.jsx 역할
        - 체크박스 UI
        - `toggle`이벤트 호출만 담당
    - useTodo.jsx 역할
        - `todos`상태의 "유일한 진실(Single Source of Truth)"
        - `add`/ `delete`/ `toggle` 로직
        - `localStorage` 저장/ 복원

8. 지금 시점에서 얻은 핵심 정리
    - Hook 분리는 코드 줄이기가 아니라 역할 분리다.
    - UI 컴포넌트는 보여주는 것 에 집중하고, 비즈니스 로직(상태/ 저장/ 데이터 처리)은 hook으로 빼면 유지보수가 쉬워진다.
    - 가장 많이 터지는 실수는 props 이름 불일치 와 이벤트 객체 전달 이다.