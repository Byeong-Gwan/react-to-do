import React, { useState, useRef, useEffect} from 'react'

export default function TodoItem({ item, onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(item.text);

    const inputRef = useRef(null);

    useEffect(() => {
        // 외부에서 text가 바뀌면 동기화
        setDraft(item.text);
    }, [item.text]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);


    const startEdit = () => {
        setIsEditing(true);
        setDraft(item.text);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setDraft(item.text);
    };

    const saveEdit = () => {
        const isUpdated = onUpdate(item.id, draft);
        if (!isUpdated) {
            return; // 빈 문자열이면 저장 안 함
        }
        setIsEditing(false);
    };

    const onkeyDown = (event) => {
        console.log(event);
        if (event.key === "Enter") {
            saveEdit();
        } 
        if (event.key === "Escape") {
            cancelEdit();
        }
    };

    return (
        <li style={{ display: "flex", alignItems: "center", gap: 8}}>
            <input 
                type='checkbox' 
                checked={!!item.completed} 
                onChange={() => onToggle(item.id)}
                disabled={isEditing}
            />

            {isEditing ? (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={onkeyDown}
                />
            ) : (
                <span style={{ textDecoration: item.completed ? "line-through" : "none"}}>
                    {item.text}
                </span>
            )}

            {isEditing ? (
                <>
                    <button onClick={saveEdit}>저장</button>
                    <button onClick={cancelEdit}>삭제</button>
                </>
            ) : (
                <>
                    <button onClick={startEdit}>수정</button>
                    <button onClick={() => onDelete(item.id)}>삭제</button>
                </>
            )}
        </li>
    );
}
