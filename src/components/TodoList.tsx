import { HiClipboardDocumentList } from 'react-icons/hi2';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<Todo, 'title' | 'priority'>>
  ) => void;
  onDelete: (id: string) => void;
}

export function TodoList({
  todos,
  totalCount,
  loading,
  error,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        <p className="font-semibold">{error}</p>
        <p className="mt-1 text-sm">
          Add Firebase settings to the .env file and try again.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-surface-200/60"
          />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    const isFilteredEmpty = totalCount > 0;
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-200 bg-white py-20">
        <HiClipboardDocumentList className="size-20 text-surface-200" />
        <p className="mt-5 text-lg font-semibold text-stone-600">
          {isFilteredEmpty ? 'No matching tasks found' : 'No tasks yet'}
        </p>
        <p className="mt-1 text-sm text-stone-500">
          {isFilteredEmpty
            ? 'Try selecting a different filter'
            : 'Add a new task above'}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
