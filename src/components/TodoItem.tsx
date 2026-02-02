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
    <div
      className={`flex items-center gap-2 rounded-lg border border-stone-200/60 bg-white px-2 py-2 shadow-sm transition hover:shadow-md ${
        todo.completed ? 'opacity-70' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`w-5 h-5 flex shrink-0 items-center justify-center rounded border transition ${
          todo.completed
            ? 'border-brand bg-brand text-white'
            : 'border-stone-300 text-stone-400 hover:border-brand-light hover:text-brand'
        }`}
        aria-label={todo.completed ? 'Unmark as complete' : 'Mark as complete'}
      >
        {todo.completed && <HiCheck className="w-2.5 h-2.5" strokeWidth={3.5} />}
      </button>

      <div className="min-w-0 flex-1 overflow-hidden">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            maxLength={500}
            className="w-full rounded-md border border-surface-200 bg-surface-50 px-2 py-1 text-xs text-stone-800 outline-none focus:border-brand focus:shadow-glow"
          />
        ) : (
          <span
            className={`block text-xs font-medium leading-tight line-clamp-2 ${
              todo.completed
                ? 'text-stone-500 line-through decoration-stone-400'
                : 'text-stone-800'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <select
            value={todo.priority}
            onChange={(e) =>
              onUpdate(todo.id, { priority: e.target.value as TodoPriority })
            }
            className="rounded border border-surface-200 bg-surface-50 px-1 py-0.5 text-xs text-stone-700 outline-none focus:border-brand"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'high' ? 'H' : p === 'medium' ? 'M' : 'L'}
              </option>
            ))}
          </select>
        ) : (
          <PriorityBadge priority={todo.priority} size="xs" />
        )}
        {!editing && (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded p-0.5 text-stone-400 transition hover:bg-brand-tint hover:text-brand"
              aria-label="Edit"
            >
              <HiPencil className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="rounded p-0.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete"
            >
              <HiTrash className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
