import { useState, useEffect } from 'react'
import { loadTodos, saveTodos } from '../repositories/todoRepository';
export function useTodos() {

    const [todos, setTodos] = useState(() => loadTodos());

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    // 추가
    const addTodo = (text) => {
        if (!text.trim()) {
            return;
        }

        setTodos(prev => [
            ...prev,
            {
                // timestamp + random 충돌 방지
                id: Date.now() + Math.random(),
                text,
                completed: false
            }
        ]);
    };

    // 삭제
    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    // 수정 
    const updateTodo = (id, nextText) => {
        const value = String(nextText ?? "").trim();
        if (!value) {
            return false;
        }

        setTodos((prev) => 
            prev.map((todo) => (todo.id === id ? {...todo, text: value} : todo))
        );
        return true;
    }

    const toggleTodo = (id) => {
        setTodos(prev => 
            prev.map(todo => 
                todo.id === id ? {...todo, completed: !todo.completed} : todo
            )
        );
    };

    // filter 기능
    const clearCompleted = () => {
        setTodos((prev) => prev.filter((todo) => !todo.completed));
    };

  return {
      todos,
      addTodo,
      deleteTodo,
      updateTodo,
      toggleTodo,
      clearCompleted
  };
}
