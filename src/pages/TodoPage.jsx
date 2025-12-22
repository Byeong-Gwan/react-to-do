import React, { useMemo, useState } from 'react'
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/todo/TodoForm';
import TodoList from '../components/todo/TodoList';
import TodoFilter from '../components/todo/TodoFilter';

function TodoPage() {
    const { todos, addTodo, deleteTodo, updateTodo, toggleTodo, clearCompleted } = useTodos();
    const [filter, setFilter] = useState("all"); // all | active | completed

    // useMemo는 성능 향상을 위해 사용 
    // 불필요한 리렌더링 이나 useEffect 불필요하게 호출되는걸 막기위해
    // 중복 계산이 발생하지 않게하기 위해
    // useMemo 개념 확인해야됨
    const filteredTodos = useMemo(() =>{
        if (filter === "active") {
            return todos.filter((todo) => !todo.completed);
        }

        if (filter === "completed") {
            return todos.filter((todo) => todo.completed);
        }

        return todos;
    }, [todos, filter]);

    const leftCount = useMemo(() => (
        todos.filter((todo) => !todo.completed)
    ).length, [todos]);

    const hasCompleted = useMemo(() => (
        todos.some((todo) => todo.completed)
    ), [todos]);
    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm onAdd={addTodo} />

            <TodoFilter 
                filter={filter}
                onChange={setFilter}
                leftCount={leftCount}
                hasCompleted={hasCompleted}
                onClearCompleted={clearCompleted}
            />

            <TodoList 
                todos={filteredTodos} 
                onToggle={toggleTodo} 
                onDelete={deleteTodo} 
                onUpdate={updateTodo} 
            />
        </div>
    )
}

export default TodoPage