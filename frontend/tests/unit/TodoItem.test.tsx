import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../../src/components/TodoItem';
import type { Todo } from '../../src/types';

const mockTodo: Todo = {
  id: '1',
  description: 'Test todo',
  completed: false,
  createdAt: new Date().toISOString(),
};

describe('TodoItem', () => {
  it('renders todo description', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('shows checkbox unchecked for incomplete todo', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('shows checkbox checked for completed todo', () => {
    render(<TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1', true);
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('applies line-through styling for completed todo', () => {
    render(<TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const label = screen.getByText('Test todo');
    expect(label).toHaveClass('line-through');
  });
});
