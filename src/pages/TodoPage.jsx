import React from 'react'
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/todo/TodoForm';
import TodoList from '../components/todo/TodoList';

function TodoPage() {
    const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();
    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm onAdd={addTodo} />
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    )
}

export default TodoPage