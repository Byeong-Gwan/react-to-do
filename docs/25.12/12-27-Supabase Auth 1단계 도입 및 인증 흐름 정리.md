## Supabase Auth 1단계 도입 및 인증 흐름 정리
1. Supabase Auth를 도입한 이유
- 기존 Todo 앱은 LocalStorage 기반으로만 동작하며, 사용자 개념이 없는 상태
    - 누가 사용하는 앱인지 구분 불가
    - 로그인/ 로그아웃 개념 없음
    - 이후 서버 연동 시 사용자 기준 데이터 분리가 불가능
-> 이에 따라 서버(DB) 연동에 앞서, 가장 작은 단위의 사용자 개념(Auth 1단계)를 먼저 도입

2. Supabase Auth 도입 범위 (명확화)
- 목표
    - 적용 범위
        - 로그인/ 로그아웃 기능
        - 로그인 상태에 따른 화면 분기
    
    - 추후 예정
        - 사용자별 Todo 데이터 분리
        - Supabase DB 연동
        - RLS 정책 설정 (정확한 의미에 대해 공부 필요)
-> Auth 만 단독으로 검증하는 1단계

3. Supabase 프로젝트 생성 및 환경 설정
- Supabase 프로젝트 생성
    - Supabase Dashboard에서 신규 프로젝트 생성
    - Region: Asia(Seoul)
    - Database는 이번 단계에서 사용하지 않음

- API Key 확인
    - Project URL
    - Publishable key (기존 anon public key)
    service_role/ secret key는 Front-End 에서 사용하지 않음

- 환경 변수 설정 (`.env`)
```env 
    VITE_SUPABASE_URL=프로젝트_URL
    VITE_SUPABASE_ANON_KEY=Publishable_key
```
- Vite 환경 변수 규칙에 따라 `VITE_~` prefix 사용
- 설정 후 `dev` 서버 재시작 필요

4. Supabase Client 구성
- `supbaseClient.js` 생성
```javascript
    import { createClient } from "@supabase/supabase-js";

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    export const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey
    );
```
- Client 생성 및 `export`
- 이후 Auth 관련 로직에서 공통 사용

5. 로그인 페이지(LoginPage) 구현 
- 로그인 방식
    - Email Magic Link (OTP)
    - 비밀번호 관리 없이 로그인 가능
    - 초기 Auth 도입 단계에 적합한 방식

- 구현 내용
    - 이메일 입력
    - 로그인 버튼 클릭 시 Supabase로 로그인 요청
    - 이메일 형식 검증 및 공백 제거 처리
    ```jsx
        supabase.auth.signInWithOtp({ email });
    ```

6. 로그인 후 인증 상태 처리
- 핵심 문제
    - 로그인 요청만 보내면 로그인된 것처럼 보이지 않음
    - 로그인 완료 여부를 앱에서 직접 확인해야 함

- 해결
    - Supabase 세션 기반 인증 상태 확인
    - 최초 1회 + 상태 변경 방식 사용 
    ```js
        supabase.auth.getUser();
        supabase.auth.onAuthStateChange();
    ```

7. TodoPage에서 로그인 가드 처리
- 설계 방식
    - TodoPage 진입 시 인증 상태 확인
    - 로그인되지 않은 경우 LoginPage 표시
    - 로그인된 경우 기존 Todo UI 표시

- 특징 
    - 기존 Todo 로직(useTodos, 필터, UI)은 전혀 수정하지 않음
    - 인증 로직만 상단에 가드 형태로 추가
-> Auth 와 비즈니스 로직 분리를 유지