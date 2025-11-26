const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDb } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = Array.from(
  new Set(
    defaultOrigins.concat(
      (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
  )
);

app.use(
  cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        console.error(`CORS blocked request from origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/entries', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, content, created_at FROM entries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const content = (req.body?.content || '').trim();
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const {
      rows: [entry],
    } = await pool.query('INSERT INTO entries (content) VALUES ($1) RETURNING id, content, created_at', [content]);

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
});

async function bootstrap() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

module.exports = { app, bootstrap };
