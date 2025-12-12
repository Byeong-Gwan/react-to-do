import React, { useEffect } from 'react'
import { useState } from 'react'
import TodoInput from '../components/TodoInput';

function TodoPage() {
    const [todos, setTodo] = useState(() => {
        try {
          const raw = localStorage.getItem('todos');
          if (!raw) return [];
          const saved = JSON.parse(raw);
          return Array.isArray(saved) ? saved : [];
        } catch {
          return [];
        }
      });
    const [inputValue, setInputValue] = useState('');

    const addTodo = () => {
        console.log('입력값:', inputValue);
        if (!inputValue.trim()) {
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false
        };

        setTodo([...todos, newTodo]);
        setInputValue(''); // 입력창 초기화
        
    }

    const deleteTodo = (id) => {
        setTodo(todos.filter(todo => todo.id !== id));
    }

    const toggleTodo = (id) => {
        setTodo(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo));
    }

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]);
      
    return (
        <div>
            <h1>Todo List</h1>

            <input 
                type='text' 
                placeholder='할 일을 입력하세요.' 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
            />
            <button onClick={addTodo}>추가</button>

            <ul style={{ listStyle: "none", padding: 0 }} >
                {todos.map(item => (
                    <li
                        key={item.id}
                        style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textDecoration: item.completed ? "line-through" : "none" }
                        }
                    >

                        <TodoInput item={item} onToggle={toggleTodo} />

                        {item.text}

                        <button onClick={() => deleteTodo(item.id)}>삭제</button>
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}

export default TodoPage