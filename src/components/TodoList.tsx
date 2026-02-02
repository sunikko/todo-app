import { HiClipboardDocumentList } from 'react-icons/hi2';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

interface TodoListProps {
  todos: Todo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<Todo, 'title' | 'priority' | 'completed' | 'status'>>
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
  // Use the todos passed from parent directly so updates always reflect current data
  const todosWithStatus = todos.map((todo) => ({
    ...todo,
    status: (todo.status || (todo.completed ? 'done' : 'todo')) as 'todo' | 'in-progress' | 'done',
  }));

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'done';

    // Persist the status change via onUpdate (hook will update and re-render parent)
    onUpdate(draggableId, { status: newStatus } as any);
  };

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

  if (todosWithStatus.length === 0) {
    const isFilteredEmpty = totalCount > 0;
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-200 bg-white py-20">
      <HiClipboardDocumentList className="w-20 h-20 text-surface-200" />
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 h-full">
          {['todo', 'in-progress', 'done'].map((status) => {
            const statusTodos = todosWithStatus.filter((todo) => todo.status === status);
            const statusConfig: Record<string, { icon: string; title: string; color: string; bgColor: string }> = {
              'todo': {
                icon: '📝',
                title: 'To Do',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
              },
              'in-progress': {
                icon: '🚧',
                title: 'In Progress',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
              },
              'done': {
                icon: '✅',
                title: 'Done',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
              },
            };

            const config = statusConfig[status];

            return (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-3xl ${config.bgColor} p-6 shadow-lg border-2 ${
                      snapshot.isDraggingOver ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                    } transition-all duration-200 min-h-[600px] flex flex-col`}
                  >
                    <div className="mb-6">
                      <h2 className={`text-2xl font-bold ${config.color}`}>
                        {config.icon} {config.title}
                      </h2>
                      <p className="text-sm text-gray-600 font-medium mt-1">{statusTodos.length} tasks</p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                      {statusTodos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-12 text-center h-full">
                          <p className="text-gray-400 text-sm">No tasks yet</p>
                        </div>
                      ) : (
                        statusTodos.map((todo, index) => (
                          <Draggable key={todo.id} draggableId={todo.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`rounded-xl bg-white p-4 shadow-md transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? 'shadow-2xl scale-105 opacity-75'
                                    : 'hover:shadow-lg hover:scale-102'
                                }`}
                              >
                                <TodoItem
                                  todo={todo}
                                  onToggle={onToggle}
                                  onUpdate={onUpdate}
                                  onDelete={onDelete}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}
