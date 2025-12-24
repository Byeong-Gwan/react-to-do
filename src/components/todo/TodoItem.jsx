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
        if (event.key === "Enter") {
            saveEdit();
        } 
        if (event.key === "Escape") {
            cancelEdit();
        }
    };

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-2 hover:bg-zinc-900/50 transition">
            <div className="flex items-center gap-3">
                <input 
                    type='checkbox' 
                    className="mt-1 h-4 w-4 shrink-0" 
                    checked={!!item.completed} 
                    onChange={() => onToggle(item.id)}
                    disabled={isEditing}
                />
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        
                        <input
                            ref={inputRef}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={onkeyDown}
                            className="input !bg-zinc-900 !text-zinc-100 placeholder:!text-zinc-500"
                        />
                    ) : (
                        <p className={[
                            "text-sm whitespace-pre-wrap break-words text-left leading-6",
                            item.completed ? "line-through text-zinc-500" : "text-zinc-100",
                            ].join(" ")}
                        >

                            {item.text}
                        </p>
                    )}
                </div>
                <div className="ml-auto flex gap-2 shrink-0">
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
                </div>
            </div>
        </div>
    );
}
