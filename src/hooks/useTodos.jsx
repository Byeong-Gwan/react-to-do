import React from 'react'
import { useState, useEffect } from 'react'
export function useTodos() {

    const [todos, setTodos] = useState(() => {
        try {
            const raw = localStorage.getItem('todos');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // 추가
    const addTodo = (text) => {
        if (!text.trim()) {
            return;
        }

        setTodos(prev => [
            ...prev,
            {
                id: Date.now(),
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

  return {
      todos,
      addTodo,
      deleteTodo,
      updateTodo,
      toggleTodo
  };
}
