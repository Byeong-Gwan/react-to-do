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
        <div className="min-h-screen flex justify-center px-4 py-14">
        <div className="w-full max-w-xl">
          <h1 className="text-center text-5xl font-extrabold tracking-tight mb-10">
            Todo List
          </h1>
  
          <div className="card p-5">
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
  
          <p className="text-center text-xs text-zinc-500 mt-6">
            LocalStorage 기반 Todo · 다음 단계: 로그인/서버 연동(Supabase)
          </p>
        </div>
      </div>
    );
}

export default TodoPage