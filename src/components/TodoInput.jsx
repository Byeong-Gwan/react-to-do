import React from 'react'

function TodoInput({item, toggleTodo}) {
  return (
    <div>
        <input 
            type='checkbox' 
            checked={item.completed} 
            onChange={() => toggleTodo(item.id)}
        />
    </div>
  )
}

export default TodoInput
