import { useState, useEffect, useCallback, useRef } from 'react';
import { loadTodos, saveTodos } from '../repositories/todoRepository';

export function useTodos(userId) {
  // ✅ 로드/저장 타이밍 꼬임 방지용 플래그
  const isHydratingRef = useRef(false);

  // 1. 상태 초기화 (초기 렌더에서 바로 로드 시도)
  const [todos, setTodos] = useState(() => loadTodos(userId));
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. 사용자 ID가 변경될 때마다 할 일 목록 로드
  useEffect(() => {
    let isMounted = true;

    console.log("[LOAD EFFECT] userId =", userId);

    const loadUserTodos = () => {
      // userId 없으면 빈 배열로 보여주고 종료
      if (!userId) {
        console.log("[LOAD EFFECT] no userId → setTodos([])");
        if (isMounted) {
          setTodos([]);
          setIsInitialized(true);
        }
        return;
      }

      try {
        // ✅ 로드 중에는 저장 effect가 동작하지 않게 막기
        isHydratingRef.current = true;

        const userTodos = loadTodos(userId);
        console.log("[LOAD EFFECT] loaded from storage =", userTodos);

        if (isMounted) {
          setTodos(userTodos);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('[LOAD EFFECT] 할 일 목록 로드 오류:', error);
        if (isMounted) {
          setTodos([]);
          setIsInitialized(true);
        }
      } finally {
        // ✅ 로드 끝
        isHydratingRef.current = false;
      }
    };

    // 유저 바뀔 때마다 초기화 상태 리셋 (안전)
    setIsInitialized(false);
    loadUserTodos();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // 3. 할 일 목록이 변경될 때마다 저장
  useEffect(() => {
    console.log(
      "[SAVE EFFECT]",
      "userId =", userId,
      "isInitialized =", isInitialized,
      "isHydrating =", isHydratingRef.current,
      "todos =", todos
    );

    if (!isInitialized || !userId) {
      console.log("[SAVE EFFECT] skip (not initialized or no userId)");
      return;
    }

    // ✅ 핵심: 로드 직후/로드 중엔 저장 금지 (덮어쓰기 방지)
    if (isHydratingRef.current) {
      console.log("[SAVE EFFECT] skip (hydrating)");
      return;
    }

    try {
      saveTodos(userId, todos);
      console.log("[SAVE EFFECT] saved ✅");
    } catch (error) {
      console.error('[SAVE EFFECT] 할 일 목록 저장 오류:', error);
    }
  }, [todos, userId, isInitialized]);

  // 할 일 추가
  const addTodo = useCallback((text) => {
    const trimmedText = String(text ?? "").trim();
    if (!trimmedText) return;

    const newTodo = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      text: trimmedText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos(prev => [...prev, newTodo]);
  }, []);

  // 할 일 삭제
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // 할 일 수정
  const updateTodo = useCallback((id, nextText) => {
    const value = String(nextText ?? "").trim();
    if (!value) return false;

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, text: value, updatedAt: new Date().toISOString() }
          : todo
      )
    );
    return true;
  }, []);

  // 할 일 완료 상태 토글
  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date().toISOString() : undefined
            }
          : todo
      )
    );
  }, []);

  // 완료된 할 일 모두 삭제
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  return {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    clearCompleted,
    isInitialized
  };
}
