## Tailwind CSS 도입 및 UI 문제 해결 정리 문서
1. Tailwind CSS를 도입한 이유
- 기존 CSS(inline style/ 일반 CSS)로 UI를 구성하면서 한계를 느낌.
    - 컴포넌트가 늘어날수록 스타일 관리가 어려움
    - 버튼, `input`, 카드 등 공통 UI 요소의 일관성 유지가 힘듦.
    - 배포 전 빠르게 UI를 다듬기엔 생산성이 낮음 
-> 이에 따라 유틸리티 기반으로 빠르게 UI를 구성할 수 있고, 컴포넌트 단위 설계와 잘 어울리는 Tailwind CSS를 도입하기로 결정

2. Tailwind CSS 설치 과정
- 공식문서 (https://tailwindcss.com/docs/installation/using-vite)

- 기본 설치(Vite + React)
    ```bash
        npm instaill -D tailwindcss postcss autoprefixer
    ```
- 초기 설정 파일 생성
    ```bash
        npx tailwindcss init -p
    ```
- Tailwind v4 관련 PostCSS 이슈
    - 설치 후 에러 발생
    ```bash
        [plugin:vite:css] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
    ```
    - 원인 
        - Tailwind CSS v4부터 PostCSS 플러그인이 분리
        - 기존 방식(`tailwindcss` 직접 사용)이 더 이상 동작하지 않음
    - 해결 방법
        - PostCSS 플러그인을 별도로 설치
        ```bash
            npm install -D @tailwindcss/postcss
        ```
        - `postcss.config.js` 수정
        ```javascript
            module.exports = {
                plugins: {
                    "@tailwindcss/postcss": {},
                    autoprefixer: {},
                },
            };
        ```
        - 만약 이 단계에서 `node_modules`가 꼬여 있으면 
        ``` rm -rf node_modules package-lock.json && npm install` 로 초기화 필요

3. 공통 `Input`스타일 정의와 문제 발생
- 공통 `.input` 클래스 정의
    - Tailwind의 `@apply`를 사용해 공통 `input`스타일을 정의
    ```css
        .input {
            @apply w-full min-w-0 rounded-lg border border-zinc-700
            bg-zinc-100 text-zinc-100
            px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-500;
        }
    ```

    - 문제 발생
        - 입력 시 글자가 보이지 않음
        - `Todo` 추가 `input`, 수정(`input`) 모두 동일 문제 발생

    - 원인
        - `bg-zinc-100` (밝은 배경)
        - `text-zinc-100` (밝은 글자)
    -> 밝은 배경 + 밝은 글자 로 인해 문제 일단 각각의 클래스 네임에 대한 의미 이해 부족으로 발생

4. 수정 모드(`input`)에서 글자가 안 보이던 문제
- 문제 현상
    - 일반 추가 `input`은 정상
    - `Todo` 수정 시 인라인 `input`만 글자가 안 보임

- 원인
    - 수정 `input`에 기존 `.input` 스타일 외에
        - `text-zinc-100`
        - 상위 컴포넌트의 text color가 덮어씌워짐

- 해결
    - 수정 `input`에는 명시적으로 색상을 고정
    ```jsx
        <input
            className="input !bg-zinc-900 !text-zinc-100 placeholder:!text-zinc-500"
        />
    ```
    - `!`는 Tailwind에서 우선순위 강제를 의미

5. 긴 텍스트로 인한 레이아웃 깨짐 문제
- 문제 현상
    - `Todo` 텍스트가 길어지면 버튼 영역 침범/ 다른 항목과 겹침

- 원인 
    - 텍스트 영역에 width 제한 없음
    - 줄바꿈(`wrap`) 미허용
    - 가운데 정렬(`text-center`)

- 해결
    - `TodoItem`을 3영역 구조로 분리
        - 체크박스 (왼쪽 고정)
        - 텍스트 영역 (줄바꿈 허용)
        - 버튼 영역 (오른쪽 고정)
        ```jsx
            <div className="flex items-start gap-3">
                <input type="checkbox" className="shrink-0 mt-1" />

                <div className="flex-1 min-w-0">
                    <p className="witespace-pre-wrap break-words text-left leading-6>
                        {todo.text}
                    </p>
                </div>

                <div className="ml-auto flex gap-2 shrink-0">
                    <button className="btn">수정</button>
                    <button className="btn">삭제</button>
                </div>
            </div>
        ```
        - 핵심 포인트
            - `flex-1 min-w-0`
            - `whitespace-pre-wrap`
            - `break-woeds`
            - `text-left`

6. `Todo` 항목 구분이 안되던 문제
- 문제
    - 리스트가 하나의 덩어리처럼 보여 어디까지가 하나의 `Todo`인지 구분이 어려움

- 해결 (카드형 스타일)
    - 각 `TodoItem`에 연한 테두리와 배경 적용
    ```jsx
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-2 hover:bg-zinc-900/50 tranxition">
            ...
        </div>
    ```

7. 완료 상태 취소선(`line-throungh`)이 적용되지 않던 문제
- 원인
    - `line-through`를 부모 `div`에 적용
    - 레이아웃 변경 후 상속이 깨짐

- 해결 
    - 텍스트 요소(`p`)에 직접 적용
    ```jsx
        <p
            className={`text-sm whitespace-pre-wrap break-words text-left leading-6 ${todo.completed ? "line-through text-zinc-500" : "text-zinc-100" }`}
        >
            {todo.text}
        </p>
    ```

8. 배운점
- Tailwind CSS는 빠르지만 공통 스타일 정의를 잘못하면 전역 문제가 발생
- `@apply`로 만든 공통 클래스는 배경/ 글자색 조합을 특히 주의해야 함
- 긴 텍스트 UI는 반드시 `min-w-0`/ 줄바꿈 처리/ 버튼 영역 분리 가 필요
- 취소선, 색상 등 시각적 표현은 텍스트 요소에 직접 적용하는 것이 가장 안전

9. 결론
- TailWind CSS 도입 과정에서 단순히 스타일 문제가 아니라 레이아웃 설계, 공통 스타일 전략, 우선 순위 제어까지 함께 학습할 수 있었음

- 현제 UI
    - 배포 가능한 수준의 가독성(내 생각)
    - 확장 가능한 구조 (이또한 내 생각)
    - 컴포넌트 재사용에 적합한 스타일 체계(이하동문)
을 가춘 상태이며, 이후 배포 -> 인증(Supabase) -> 서버 연동 단계로 자연스럽게 확장할 수 있는 기반이 마련(목표)