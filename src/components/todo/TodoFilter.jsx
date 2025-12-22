import React from 'react'

function TodoFilter({ filter, onChange, leftCount, onClearCompleted, hasCompleted }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
        <strong>남은 할 일: {leftCount}</strong>

        <div style={{ display: "flex",  gap: 6, marginLeft: 12 }}>
            <button type="button" onClick={() => onChange("all")} disabled={filter === "all"}>All</button>        
            <button type="button" onClick={() => onChange("active")} disabled={filter === "active"}>Active</button>        
            <button type="button" onClick={() => onChange("completed")} disabled={filter === "completed"}>Completed</button>
        </div>

        <button 
            type="button" 
            onClick={onClearCompleted} 
            disabled={!hasCompleted}
            style={{ marginLeft: "auto" }}
        >
            완료 삭제
        </button>
    </div>
  );
}

export default TodoFilter
