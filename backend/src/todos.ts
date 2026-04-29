import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';

const router = Router();

interface TodoRow {
  id: string;
  description: string;
  completed: number;
  created_at: string;
}

function rowToTodo(row: TodoRow) {
  return {
    id: row.id,
    description: row.description,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

// GET /api/todos
router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM todos ORDER BY created_at ASC').all() as TodoRow[];
    res.json(rows.map(rowToTodo));
  } catch (err) {
    next(err);
  }
});

// POST /api/todos
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body as { description?: string };
    if (!description || typeof description !== 'string' || description.trim() === '') {
      res.status(400).json({ error: 'description is required and must be non-empty' });
      return;
    }
    const db = getDb();
    const todo = {
      id: uuidv4(),
      description: description.trim(),
      completed: 0,
      created_at: new Date().toISOString(),
    };
    db.prepare(
      'INSERT INTO todos (id, description, completed, created_at) VALUES (?, ?, ?, ?)'
    ).run(todo.id, todo.description, todo.completed, todo.created_at);
    res.status(201).json(rowToTodo(todo));
  } catch (err) {
    next(err);
  }
});

// PUT /api/todos/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as TodoRow | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    const { description, completed } = req.body as { description?: string; completed?: boolean };
    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
      res.status(400).json({ error: 'description must be non-empty if provided' });
      return;
    }
    const newDesc = description !== undefined ? description.trim() : existing.description;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
    db.prepare('UPDATE todos SET description = ?, completed = ? WHERE id = ?').run(
      newDesc, newCompleted, id
    );
    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as TodoRow;
    res.json(rowToTodo(updated));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
