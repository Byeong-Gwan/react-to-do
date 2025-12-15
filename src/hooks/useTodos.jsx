import React from 'react'
import { useState, useEffect } from 'react'
export function useTodos() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });

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

    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const toggleTodo = (id) => {
        setTodos(prev => 
            prev.map(todo => 
                todo.id === id ? {...todo, completed: !todo.completed} : todo
            )
        );
    };

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
  return {
      todos,
      addTodo,
      deleteTodo,
      toggleTodo
  };
}
