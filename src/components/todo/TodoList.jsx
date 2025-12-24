import React from 'react'
import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  return (
    <div className="mt-4 space-y-2">
      {todos.map((item) => (
        <TodoItem 
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}

export default TodoList
