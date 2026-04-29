import { useState, type FormEvent } from 'react';

interface Props {
  onAdd: (description: string) => Promise<void>;
  loading?: boolean;
}

export function TodoForm({ onAdd, loading }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Description cannot be empty');
      return;
    }
    setError('');
    try {
      await onAdd(trimmed);
      setValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full" aria-label="Add todo form">
      <div className="flex gap-2">
        <label htmlFor="todo-input" className="sr-only">New todo description</label>
        <input
          id="todo-input"
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          placeholder="What needs to be done?"
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          aria-describedby={error ? 'todo-input-error' : undefined}
          aria-invalid={!!error}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 min-w-[80px]"
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
      </div>
      {error && (
        <p id="todo-input-error" role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </form>
  );
}
