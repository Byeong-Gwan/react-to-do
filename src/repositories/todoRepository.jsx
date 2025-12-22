const STORAGE_KEY = "todos";

/**
 * LocalStorage에서 Todo리스트를 로드
 * - JSON 파싱 실패, 데이터 타입 이상, localStorage 접근 실패 등을 방어
 */
export function loadTodos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

/**
 * LocalStorage에 Todo리스트를 저장
 * - 직렬화 실패/ 접근 실패 방어
 */
export function saveTodos(todos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) { /* 저장 실패해도 앱이 죽지 않게 무시 */ }
}

/**
 * 저장소 초기화 필요시 사용
 */
export function clearTodos() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
}