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

  return {
      todos,
      addTodo,
      deleteTodo,
      toggleTodo
  };
}
