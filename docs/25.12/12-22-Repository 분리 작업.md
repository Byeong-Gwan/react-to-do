## Todo Repository 분리 작업
1. Repository 작업을 진행한 이유
- 기존 구조에서 `useTodos`가 다음 역할을 담당하고 있었음
    - Todo 상태 관리
    - Todo CRUD 비즈니스 로직
    - LocalStorage 접근 및 저장 방식 처리

- 이 구조는 기능 구현에는 문제가 없지만, 저장소(LocalStorage)가 변경될 경우(useTodos 전체 수정)가 필요

- 해당 프로젝트는 향후 Supabase 연동, 로그인, 사용자별 Todo 관리 등으로 확장될 예정이기 때문에 저장 방식 변경에 유연한 구조로 정의
-> 이를 위해 저장소 접근 로직을 분리하는 Repository 레이어를 도입함.

2. Repository의 역할 정의
- Repository는 데이터를 저장하는 공간 자체가 아니라, 데이터 저장 방식(LocalStorage, Supabase 등)을 감싸는 중간 레이어.
    - useTodos는 어디에 저장되는지를 알 필요 없음
    - 단순히 불러오기 / 저장하기만 요청
    - 저장 방식 변경 시 Repository만 교체
-> Repository의 목적은 저장소 교체가 비즈니스 로직에 영향을 주지 않게 하는 것

3. 파일 구조 변경
- 추가 파일
```css
    src/
    └─ repositories/
        └─ todoRepository.js

```

- 변경 파일
``` src/hooks/useTodos.jsx```

4. todoRepository 구성
- 추가된 함수
    - `loadTodos()`
        - `LocalStorage`에서 `Todo` 목록 로드
        - `JSON` 파싱 오류, 데이터 타입 오류 방어
        - 항상 배열 형태 반환
    
    - `saveTodos(todos)`
        - `Todo`목록을 `LocalStorage`에 저장
        - 저장 실패 시에도 앱이 중단되지 않도록 예외 처리

    - `clearTodos()`
        - 저장소 초기화용 유틸 함수

- 설계 포인트
    - `LocalStorage` 직접 접근을 Repository 내부로 한정
    - `useTodos`에서는 `LocalStorage API`를 완전히 제거

5. `useTodos` 변경 내용
- 변경 전 
    - `useTodos` 내부에서 `localStorage.getItem / setItem` 직접 사용
    - 저장 방식이 `useTodos`로직에 강하게 결합됨

- 변경 후
    - 초기 데이터 로딩: `loadTodos()` 사용
    - `todos` 변경 감지 시: `saveTodos(todos)` 호출
    - `useTodos`는 다음 책임만 유지
        - `Todo` 상태 관리
        - CRUD 비즈니스 로직
        ```javascript
            const [todos, setTodos] = useState(() => loadTodos());

            useEffect(() => {
                saveTodos(todos);
            }, [todos]);
        ```
        -> `useTodos`는 저장 방식을 모르는 순수 로직 계층이 됨.

6. 장점
- 저장소 교체 용이
    - `LocalStorage` -> Supabase 전환 시 `todoRepository`만 교체하면 됨

- 역할 분리 명확
    - `Repository`: 저장 방식 책임
    - `useTodos`: 상태 및 비즈니스 로직 책임
    - UI 컴포넌트: 화면 렌더링 책임

- 테스트 용이성 
    - `Repository`를 mock 처리해 `useTodos` 테스트 가능
    - 저장 방식과 무관한 로직 테스트 구조 확보

7. Supabase 연동과의 연결 지점
- `Repository` 구조를 도입함으로써, 향후 다음 작업이 자연스럽게 이어질 수 있다.
    - Supabase기반 `todoRepostiory` 구현
    - `LocalStorage Repostiory` 와 교체 또는 환경별 분기
    - `useTodos` / UI 코드 변경 최소화
    - 서버 상태 관리(React Query) 도입 기반 마련
-> `Repository` 작업은 Supabase 연동을 위한 사전 구조 작업임.

8. 요약
- `Repository`는 데이터를 저장하는 공간이 아니라 데이터 저장 방식을 추상화하는 레이어
- 저장소 변경(`LocalStorage` -> Supabase)을 대비한 구조 개선
- `useTodos`를 저장 방식으로부터 분리해 확장 가능성 확보
- 본 프로젝트를 단순 Todo App에서 서비스 확장 가능한 구조로 전환하는 첫 단계(포부만..)