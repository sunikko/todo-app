import { useState, useMemo } from 'react';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { FilterTabs, type FilterType } from '../components/FilterTabs';
import { useTodos } from '../hooks/useTodos';

export function Home() {
  const [filter, setFilter] = useState<FilterType>('all');
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    isConfigured,
  } = useTodos();

  // Note: Kanban shows all tasks; filters control other list views if used elsewhere

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Todo List
          </h1>
          <p className="mt-3 text-lg text-stone-600">
            Write down your tasks for today and complete them one by one.
          </p>
          {!isConfigured && (
            <p className="mt-3 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              Local mode · Resets on refresh
            </p>
          )}
        </header>

        <section className="mb-8">
          <TodoForm onSubmit={addTodo} disabled={loading} />
        </section>

        {todos.length > 0 && (
          <section className="mb-6">
            <FilterTabs value={filter} onChange={setFilter} counts={counts} />
          </section>
        )}

        <section>
          <TodoList
            todos={todos}
            totalCount={todos.length}
            loading={loading}
            error={error}
            onToggle={toggleComplete}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </section>
      </div>
    </div>
  );
}
