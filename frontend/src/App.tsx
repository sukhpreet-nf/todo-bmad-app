import { useState, useEffect, useCallback } from 'react';
import type { Todo } from './types';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      setError('Could not load todos. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  async function handleAdd(description: string) {
    setAdding(true);
    try {
      const todo = await createTodo(description);
      setTodos(prev => [...prev, todo]);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    const updated = await updateTodo(id, { completed });
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <main className="max-w-lg mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your tasks, simply.</p>
        </header>
        <div className="mb-6">
          <TodoForm onAdd={handleAdd} loading={adding} />
        </div>
        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onRetry={loadTodos}
        />
      </main>
    </div>
  );
}
