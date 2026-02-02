import { useState } from 'react';
import type { FormEvent } from 'react';
import { HiPlus } from 'react-icons/hi2';
import type { TodoPriority } from '../types/todo';

const PRIORITIES: TodoPriority[] = ['high', 'medium', 'low'];

interface TodoFormProps {
  onSubmit: (title: string, priority: TodoPriority) => void;
  disabled?: boolean;
}

export function TodoForm({ onSubmit, disabled }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed, priority);
    setTitle('');
    setPriority('medium');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-soft-lg sm:flex-row sm:items-center"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new task"
        maxLength={500}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-2xl border-2 border-surface-200 bg-surface-50 px-4 py-3.5 text-base text-stone-800 placeholder-stone-400 outline-none transition focus:border-brand focus:bg-white focus:shadow-glow disabled:opacity-60"
        aria-label="Task content"
      />
      <div className="flex items-center gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority)}
          disabled={disabled}
          className="rounded-2xl border-2 border-surface-200 bg-surface-50 px-4 py-3 text-sm font-medium text-stone-700 outline-none focus:border-brand focus:shadow-glow disabled:opacity-60"
          aria-label="우선순위"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low'}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!title.trim() || disabled}
          className="flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-5 py-3.5 font-semibold text-white shadow-soft transition hover:bg-brand-dark disabled:opacity-50"
          aria-label="Add task"
        >
          <HiPlus className="size-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </form>
  );
}
