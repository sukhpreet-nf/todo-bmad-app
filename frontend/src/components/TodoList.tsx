import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRetry: () => void;
}

export function TodoList({ todos, loading, error, onToggle, onDelete, onRetry }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-label="Loading todos">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading todos…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center text-gray-500">
        <p className="text-lg font-medium">No todos yet!</p>
        <p className="text-sm">Add your first task above to get started.</p>
      </div>
    );
  }

  const active = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  return (
    <div className="flex flex-col gap-4">
      {active.length > 0 && (
        <section aria-labelledby="active-heading">
          <h2 id="active-heading" className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Active ({active.length})
          </h2>
          <ul className="flex flex-col gap-2" aria-label="Active todos">
            {active.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      )}
      {completed.length > 0 && (
        <section aria-labelledby="completed-heading">
          <h2 id="completed-heading" className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Completed ({completed.length})
          </h2>
          <ul className="flex flex-col gap-2" aria-label="Completed todos">
            {completed.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
