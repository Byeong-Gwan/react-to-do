import React from 'react'
import { useState } from 'react'

export default function TodoForm({ onAdd }) {
    const [text, setText] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();
        if (!text.trim()) {
            return;
        }
        onAdd(text);
        setText('');
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") onSubmit(e);
      };

  return (
    <div className="flex gap-3">
    <input
      className="input"
      placeholder="할 일을 입력"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={onKeyDown}
    />
    <button type="button" className="btn btn-primary px-5" onClick={onSubmit}>
      추가
    </button>
  </div>
);
}


