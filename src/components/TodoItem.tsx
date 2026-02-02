import { useState, useRef, useEffect } from 'react';
import { HiCheck, HiPencil, HiTrash } from 'react-icons/hi2';
import { PriorityBadge } from './PriorityBadge';
import type { Todo, TodoPriority } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<Todo, 'title' | 'priority'>>
  ) => void;
  onDelete: (id: string) => void;
}

const PRIORITIES: TodoPriority[] = ['high', 'medium', 'low'];

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    } else {
      setEditTitle(todo.title);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <li
      className={`flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white px-4 py-3.5 shadow-soft transition hover:shadow-soft-lg ${
        todo.completed ? 'opacity-80' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition ${
          todo.completed
            ? 'border-brand bg-brand text-white'
            : 'border-stone-300 text-stone-400 hover:border-brand-light hover:text-brand'
        }`}
        aria-label={todo.completed ? 'Unmark as complete' : 'Mark as complete'}
      >
        {todo.completed && <HiCheck className="size-6" strokeWidth={2.5} />}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            maxLength={500}
            className="w-full rounded-xl border-2 border-surface-200 bg-surface-50 px-3 py-2 text-stone-800 outline-none focus:border-brand focus:shadow-glow"
          />
        ) : (
          <span
            className={`block truncate text-base font-medium ${
              todo.completed
                ? 'text-stone-500 line-through decoration-stone-400'
                : 'text-stone-800'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {editing ? (
          <select
            value={todo.priority}
            onChange={(e) =>
              onUpdate(todo.id, { priority: e.target.value as TodoPriority })
            }
            className="rounded-xl border-2 border-surface-200 bg-surface-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 outline-none focus:border-brand"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low'}
              </option>
            ))}
          </select>
        ) : (
          <PriorityBadge priority={todo.priority} size="sm" />
        )}
        {!editing && (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl p-2.5 text-stone-400 transition hover:bg-brand-tint hover:text-brand"
              aria-label="Edit"
            >
              <HiPencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="rounded-xl p-2.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete"
            >
              <HiTrash className="size-4" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
