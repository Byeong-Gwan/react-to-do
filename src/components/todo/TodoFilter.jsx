import React from "react";

function TodoFilter({ filter, onChange, leftCount, onClearCompleted, hasCompleted }) {
  const tabBase =
    "btn";
  const tabActive =
    "bg-zinc-700 hover:bg-zinc-700";

  return (
    <div className="flex items-center gap-3 my-5">
      <strong className="text-sm text-zinc-200">남은 할 일: {leftCount}</strong>

      <div className="flex gap-2 ml-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`${tabBase} ${filter === "all" ? tabActive : ""}`}
          aria-pressed={filter === "all"}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onChange("active")}
          className={`${tabBase} ${filter === "active" ? tabActive : ""}`}
          aria-pressed={filter === "active"}
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => onChange("completed")}
          className={`${tabBase} ${filter === "completed" ? tabActive : ""}`}
          aria-pressed={filter === "completed"}
        >
          Completed
        </button>
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
        className="btn ml-auto"
      >
        완료 삭제
      </button>
    </div>
  );
}

export default TodoFilter;
