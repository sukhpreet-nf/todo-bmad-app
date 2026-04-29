import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../../src/components/TodoList';
import type { Todo } from '../../src/types';

const todos: Todo[] = [
  { id: '1', description: 'Active task', completed: false, createdAt: new Date().toISOString() },
  { id: '2', description: 'Done task', completed: true, createdAt: new Date().toISOString() },
];

describe('TodoList', () => {
  it('shows loading spinner', () => {
    render(<TodoList todos={[]} loading={true} error={null} onToggle={vi.fn()} onDelete={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message and retry button', () => {
    const onRetry = vi.fn();
    render(<TodoList todos={[]} loading={false} error="Network error" onToggle={vi.fn()} onDelete={vi.fn()} onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows empty state when no todos', () => {
    render(<TodoList todos={[]} loading={false} error={null} onToggle={vi.fn()} onDelete={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders todos split into active and completed', () => {
    render(<TodoList todos={todos} loading={false} error={null} onToggle={vi.fn()} onDelete={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
    expect(screen.getByText(/^active \(1\)$/i)).toBeInTheDocument();
    expect(screen.getByText(/^completed \(1\)$/i)).toBeInTheDocument();
  });
});
