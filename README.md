## 1. 프로젝트 개요 (수정: 2025.12.25 v0.0.1)

- 목적: React 기본 흐름(상태, 이벤트, 리스트 렌더링, 컴포넌트 분리) 학습 + 이후 학습관리 앱의 1차 MVP(개인 투두) 기반 만들기

## 2. 기술 스택
- Framework / 
    - React: v19.2.3
    - React DOM: v19.2.3
    
- Bulid Tool
    - Vite v7.2.4
    - `@vitejs/plugin-react`: v5.1.1

- Styling
    - TailWind CSS: v3.4.19
    - PostCSS: v8.5.6
    - Autoprefixer: v10.4.23

- Lint
    - ESLint: v9.39.1
    - eslint-plugin-react-hooks: v7.0.1
    - eslint-plugin-react-refresh: v0.4.24

- Language
    - JavaScript (현재)
    - TypeScript (추후 전환 예정 / 타입 패키지는 일부 포함)
        - `@types/react`: v19.2.5
        - `@types/react-dom`: v19.2.3

- Runtime / Package Manager
    - Node.js: v22.14.0
    - npm: v10.9.2

## 3. 폴더 구조 (현재) // version up 0.0.1 (2025.12.16)
``` css
    src/
    ├─ components/
    │   └─ todo/
    │       └─ TodoFilter.jsx   // 필터 변경 + 남은 개수 + 완료 삭제
    │       └─ TodoForm.jsx     // 입력 + 추가 (Enter)
    │       └─ TodoItem.jsx     // 단일 Todo: 체크/수정/삭제 + edit UX
    │       └─ TodoList.jsx     // todos map 렌더링(list)
    │   
    ├─ hooks/
    │   └─ useTodos.jsx         // todos 상태 + CRUD
    │   
    ├─ pages/
    │   └─ TodoPage.jsx         // 페이지 조립 + 필터 상태
    │
    ├─ repositories/
    │   └─ todoRepository.jsx         // LocalStorage 로직 분리 -> Supabase 교체 예정
    │   
    ├─ App.jsx
    └─ main.jsx
 ```

### 2025.12.25 까지 설계 포인트
1. 설계 포인트
- 상태 설계
    - 원본 상태
        - `todos`
        - `filter`
    - 파생 상태(derived state)
        - `filteredTodos`
        - `leftCount`
        - `hasCompleted`
    - 파생 값은 `useMemo`로 계산하여 불필요한 재계산을 줄임

- 로직 분리 (Custom Hook)
    - `useTodos`는 UI와 분리된 순수 로직 계층
    - 컴포넌트는 `props` 계약 기반으로 동작

- Repository 도입
    - `LocalStorage` 접근을 Repository로 분리
    - 향후 Supabase 도입 시, 저장소 구현만 교체하여 확장 가능하도록 설계

2. 향후 계획 (2025.12.25 기준)
- Phase 4: 배포(신규 앱)
- Phase 5: Supabase Auth(로그인/로그아웃)
- Phase 6: Supabase DB 연동(사용자별 Todo)
- Phase 7: 서버 상태 관리(React Query)
- Phase 8: AI 분석/피드백 기능
- Phase 9: 킴/스터디 기능 확장