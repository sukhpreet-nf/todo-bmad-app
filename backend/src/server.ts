import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import todosRouter from './todos';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

const allowedOrigin = process.env.CORS_ORIGIN;
app.use(cors({ origin: allowedOrigin && allowedOrigin !== '*' ? allowedOrigin : false }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/todos', apiLimiter, todosRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

export default app;
