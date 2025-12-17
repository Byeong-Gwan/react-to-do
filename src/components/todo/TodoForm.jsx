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

  return (
    <form onSubmit={onSubmit}>
        <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder='할 일을 입력'
        />
        <button type='submit'>추가</button>
    </form>
  )
}


