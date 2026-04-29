import { describe, it, expect, afterEach } from 'vitest';
import { getDb, closeDb } from '../../src/db';

// Use in-memory DB for tests
process.env.DB_PATH = ':memory:';

describe('DB module', () => {
  afterEach(() => {
    closeDb();
  });

  it('should create todos table on first call', () => {
    const db = getDb();
    expect(db).toBeDefined();
    const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'").get();
    expect(row).toBeTruthy();
  });

  it('should insert and retrieve a todo', () => {
    const db = getDb();
    db.prepare(
      'INSERT INTO todos (id, description, completed, created_at) VALUES (?, ?, ?, ?)'
    ).run('test-id', 'Test task', 0, new Date().toISOString());
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get('test-id') as { description: string };
    expect(row.description).toBe('Test task');
  });
});
