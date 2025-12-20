## Todo Filter 기능
1. 필터(filter) 기능 추가
- 추가 위치
    - `TodoPage.jsx`
    - `TodoFilter.jsx`

- 기능 구성
    - `All`/ `Action`/ `Completed` 3가지 보기 모드 제공
    - 필터는 데이터를 바꾸지 않고, 화면에 보여줄 목록만 바꾸는 기능
    - 선택된 필터는 버튼 `disabled`처리로 명확히 표시

- 동작
    - `All` 선택 -> 전체 `todo` 표시
    - `Active` 선택 -> `completed === false` 만 표시
    - `Completed` 선택 -> `completed === true` 만 표시
    - 현재 선택된 필터 버튼은 비활성화(`disabled`)
    - 필터 변경은 `TodoFilter` 에서 이벤트만 발생시키고, 실제 필터 상태는 `TodoPage`에서 관리

2. 필터링 파생 상태(`derived state`) 계산 추가
- 추가 내용
    - `filteredTodos` 계산 로직 추가
    ```javascript
        const filterdTodos = useMemo(() => {
            if (filter === "active") {
                return todos.filter((todo) => !todo.completed);
            }

            if (filter === "completed") {
                return todos.filter((todo) => todo.completed);
            }

            return todos;
        }, [todos, filter]);
    ```

- 설계 의도
    - `filteredTodos`는 새로운 `state`가 아니라 `todos` + `filter`로 부터 계산되는 파생 상태(derived state)
    - 상태를 늘리지 않고 원본 상태를 기준으로 화면을 계산 하는 구조를 유지
    - `useMemo`를 통해 `todos`또는 `filter`가 바뀔 때만 재계산되도록 최적화

3. 남은 할 일/ 완료 여부 계산 로직 추가
- 추가 위치
    - `TodoPage.jsx`

- 추가된 파생 값
    - `leftCount`: 남은 할 일 개수
    - `hasCompleted`: 완료된 할 일이 하나라도 있는지 여부
    ```javascript
        const leftCount = useMemo(() => (
            todos.filter((todo) => !todo.completed).length
        ), [todos]);

        const hasCompleted = useMemo(() => (
            todos.some((todo) => todo.completed)
        ), [todos]);
    ```

- 목적
    - 남은 할 일 개수를 화면에 표시하기 위함
    - 완료된 항목이 없을 때 완전 삭제 버튼을 비활성화하기 위함
    - 모두 `todos`에서 파생된 값이므로 별도 상태로 저장하지 않음

4. 완료된 `Todo` 전체 삭제 기능 연결
- 추가 위치
    - `useTodos.jsx`
    - `TodoFilter.jsx`
    - `TodoPage.jsx`(`props` 전달)

- `useTodos`에 함수 추가
```javascript
    clearCompleted();
```

- 동작
    - 완료된 `todo(completed === true)`만 제거
    - 완료된 항목이 없으면 버튼 비활성화(`disable={!hasCompleted}`)
- `props` 전달 구조
    - `TodoPage`에서 `clearCompleted` 를 받아
    - `TodoFilter`에 `onClearCompleted`로 전달
    ```jsx
        <TodoFilter
            filter={filter}
            onChange={setFilter}
            leftCount={leftCount}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
        />
    ```

- 목적
    - 삭제 로직은 `useTodos`가 담당(로직 계층)
    - `TodoFilter`는 UI에서 삭제 트리거 버튼 만 담당(UI 계층)
    - UI <-> 로직 분리 원칙 유지

- 요약
    - 필터 기능은 `todos` 데이터를 복제/ 변경하지 않고 화면에 보여줄 목록을 파생 계산으로 만들어내는 구조로 구현
    - `TodoFilter`는 UI만 담당하고, 필터링 계산 및 파생 상태 계산은 `TodoPage`에서 책임진다.
    - `clearCompleted`는 `useTodos`에 위치시켜 비즈니스 로직은 hook에서 관리하는 구조를 유지.

## 공부 내용
### useMemo
1. `useMemo`란?
- `useMemo`는 값을 <strong>기억(memoization)</strong> 해두었다가, 
의존성 값이 바뀌지 않으면 이전 계산 결과를 재사용하는 React Hook이다.
```javascript
    const memoizedValue = useMemo(() => {
        return 계산 결과;
    }, [의존성]);
```
- 첫 렌더링: 콜백 함수 실행 -> 결과 저장
- 이후 렌더링:
    - 의존성이 바뀌면 -> 다시 계산
    - 의존성이 안바뀌면 -> 이전 값 그대로 재사용

2. React 렌더링과 `useMemo`가 필요한 이유
- React 컴포넌트는 상태(`state`)나 `props`가 바뀔 때마다 전체 함수가 다시 실행된다.
```javascript
    function TodoPage() {
        // state 변경 시 이 함수 전체가 다시 실행함
    }
```
``` todos.filter(...) ```
- 렌더링 때마다 반복 실행됨
- `Todo` 개수가 많아질 수록 필터링 / 카운터 / (`some`/ `map`/ `filter`)같은 연산 전부 매 렌더링마다 다시 실행된다.

-> `useMemo`는 이 계산 결과는 필요할 때만 다시 계산한다. 불필요한 렌더링을 막아줌