import React from 'react'
import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  return (
    <div>
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
