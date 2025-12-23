## 1. 프로젝트 개요

- 목적: React 기본 흐름(상태, 이벤트, 리스트 렌더링, 컴포넌트 분리) 학습 + 이후 학습관리 앱의 1차 MVP(개인 투두) 기반 만들기

## 2. 기술 스택
- Framework / Library

- React: v19.2.5 

- Build Tool: Vite v7.2.4

- Language: JavaScript(현재) → 추후 TypeScript 전환 예정

- Runtime / Package Manager

- Node.js: v22.14.0

- npm: v10.9.2

## 3. 폴더 구조 (현재) // version up 0.0.1 (2025.12.16)
``` css
    src/
    ├─ components/
    │   └─ todo/
    │       └─ TodoFilter.jsx     // 필터 추가
    │       └─ TodoForm.jsx     // 입력 + 추가
    │       └─ TodoItem.jsx     // map 렌더링
    │       └─ TodoList.jsx     // checkbox + text + edit + delete
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

