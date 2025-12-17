import React from 'react'

export default function TodoItem({ item, onToggle, onDelete }) {

  return (
    <li style={{ display: "flex", alignItems: "center", gap: 8}}>
        <input 
            type='checkbox' 
            checked={!!item.completed} 
            onChange={() => onToggle(item.id)}
        />
        <span style={{ textDecoration: item.completed ? "line-through" : "none"}}>
            {item.text}
        </span>
        
        <button onClick={() => onDelete(item.id)}>삭제</button>
    </li>
  )
}
