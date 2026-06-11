import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import uploadRoutes from './routes/upload.js';
import { authMiddleware } from './middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static file serving for uploads ───
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  maxAge: '30d',
  immutable: true,
  setHeaders: (res, path) => {
    // Enable range requests for video streaming
    if (path.endsWith('.mp4') || path.endsWith('.webm')) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── Error handling ───
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: '文件大小超过限制' });
  }
  res.status(500).json({ error: '服务器内部错误' });
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`[AIGC CMS] Server running on http://localhost:${PORT}`);
  console.log(`[AIGC CMS] Admin panel: POST /api/auth/login`);
  console.log(`[AIGC CMS] Projects API: GET /api/projects`);
});
