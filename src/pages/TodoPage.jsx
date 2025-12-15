import React, { useEffect } from 'react'
import { useState } from 'react'
import TodoInput from '../components/TodoInput';
import { useTodos } from '../hooks/useTodos';

function TodoPage() {
    const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();
    const [inputValue, setInputValue] = useState('');

    const onAdd = () => {
        addTodo(inputValue);
        setInputValue('');
    };
    return (
        <div>
            <h1>Todo List</h1>

            <input 
                type='text' 
                placeholder='할 일을 입력하세요.' 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
            />
            <button onClick={onAdd}>추가</button>

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

                        <TodoInput item={item} toggleTodo={toggleTodo} />

                        {item.text}

                        <button onClick={() => deleteTodo(item.id)}>삭제</button>
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}

export default TodoPage