import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../../src/components/TodoForm';

describe('TodoForm', () => {
  it('renders input and button', () => {
    render(<TodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows validation error for empty submission', async () => {
    render(<TodoForm onAdd={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('calls onAdd with trimmed description and clears input', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={onAdd} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '  Buy milk  ');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith('Buy milk');
    });
    expect(input).toHaveValue('');
  });

  it('disables controls when loading', () => {
    render(<TodoForm onAdd={vi.fn()} loading={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
