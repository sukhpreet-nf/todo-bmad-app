import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server';
import { closeDb, getDb } from '../../src/db';

process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';

beforeEach(() => {
  closeDb();
  // Re-init DB (getDb will recreate)
  getDb();
});

afterAll(() => {
  closeDb();
});

describe('GET /healthz', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('GET /api/todos', () => {
  it('returns empty array initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo with valid description', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ description: 'Buy groceries' });
    expect(res.status).toBe(201);
    expect(res.body.description).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('rejects empty description', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ description: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejects missing description', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/todos/:id', () => {
  it('updates a todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ description: 'Task' });
    const id = created.body.id;
    const res = await request(app)
      .put(`/api/todos/${id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .put('/api/todos/non-existent-id')
      .send({ completed: true });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ description: 'Delete me' });
    const id = created.body.id;
    const del = await request(app).delete(`/api/todos/${id}`);
    expect(del.status).toBe(200);
    expect(del.body.ok).toBe(true);
    // Verify gone
    const list = await request(app).get('/api/todos');
    expect(list.body.find((t: { id: string }) => t.id === id)).toBeUndefined();
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/todos/non-existent-id');
    expect(res.status).toBe(404);
  });
});
