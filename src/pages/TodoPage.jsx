import React, { useMemo, useState, useEffect } from 'react'
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/todo/TodoForm';
import TodoList from '../components/todo/TodoList';
import TodoFilter from '../components/todo/TodoFilter';
import LoginPage from './LoginPage';
import { supabase } from '../lib/supabaseClient';

function TodoPage() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const { todos, addTodo, deleteTodo, updateTodo, toggleTodo, clearCompleted } = useTodos();
    const [filter, setFilter] = useState("all"); // all | active | completed

    useEffect (() => {
        // 최초 1회: 현재 로그인 유저 확인
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user ?? null);
            setAuthLoading(false);
        });

        // 로그인/ 로그아웃 변화 감지
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

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

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <LoginPage />;
    }
    return (
        <div className="min-h-screen flex justify-center px-4 py-14">
            <div className="w-full max-w-xl">
                <h1 className="text-center text-5xl font-extrabold tracking-tight mb-10">
                    Todo List
                </h1>
        
                <div className="card p-5">
                    <div className='flex items-center justify-between mb-4'>
                        <p className='text-xs text-zinc-400'>로그인: {user.email}</p>
                        <button className='btn' onClick={() => supabase.auth.signOut()}>로그아웃</button>
                    </div>
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