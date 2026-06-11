import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { unlinkSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

// ─── Public: Get all published projects ───
router.get('/', (req, res) => {
  const { category, featured } = req.query;
  let sql = 'SELECT * FROM projects WHERE is_published = 1';
  const params = [];

  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (featured === '1') {
    sql += ' AND is_featured = 1';
  }
  sql += ' ORDER BY sort_order ASC, created_at DESC';

  const rows = db.prepare(sql).all(...params);
  // Parse tags JSON for each row
  const projects = rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags || '[]')
  }));
  res.json(projects);
});

// ─── Public: Get single project by ID ───
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: '项目不存在' });
  row.tags = JSON.parse(row.tags || '[]');
  res.json(row);
});

// ─── Admin: Get ALL projects (including drafts) ───
router.get('/admin/all', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();
  const projects = rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags || '[]')
  }));
  res.json(projects);
});

// ─── Admin: Create project ───
router.post('/', authMiddleware, (req, res) => {
  const {
    title_zh, title_en, category, description,
    cover_path, video_path, video_type, tags,
    sort_order, is_published, is_featured, duration
  } = req.body;

  if (!title_zh) return res.status(400).json({ error: '标题不能为空' });

  const result = db.prepare(`
    INSERT INTO projects (title_zh, title_en, category, description, cover_path, video_path, video_type, tags, sort_order, is_published, is_featured, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title_zh,
    title_en || null,
    category || 'video',
    description || null,
    cover_path || null,
    video_path || null,
    video_type || 'mp4',
    JSON.stringify(tags || []),
    sort_order ?? 0,
    is_published ?? 1,
    is_featured ?? 0,
    duration || null
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  project.tags = JSON.parse(project.tags || '[]');
  res.status(201).json(project);
});

// ─── Admin: Update project ───
router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '项目不存在' });

  const {
    title_zh = existing.title_zh,
    title_en = existing.title_en,
    category = existing.category,
    description = existing.description,
    cover_path = existing.cover_path,
    video_path = existing.video_path,
    video_type = existing.video_type,
    tags,
    sort_order = existing.sort_order,
    is_published = existing.is_published,
    is_featured = existing.is_featured,
    duration = existing.duration
  } = req.body;

  // If new cover/video uploaded, delete old file
  if (cover_path && cover_path !== existing.cover_path && existing.cover_path) {
    const oldPath = join(__dirname, '..', existing.cover_path);
    if (existsSync(oldPath)) { try { unlinkSync(oldPath); } catch {} }
  }
  if (video_path && video_path !== existing.video_path && existing.video_path) {
    const oldPath = join(__dirname, '..', existing.video_path);
    if (existsSync(oldPath)) { try { unlinkSync(oldPath); } catch {} }
  }

  db.prepare(`
    UPDATE projects SET
      title_zh = ?, title_en = ?, category = ?, description = ?,
      cover_path = ?, video_path = ?, video_type = ?, tags = ?,
      sort_order = ?, is_published = ?, is_featured = ?, duration = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title_zh, title_en, category, description,
    cover_path, video_path, video_type,
    JSON.stringify(tags ?? JSON.parse(existing.tags || '[]')),
    sort_order, is_published, is_featured, duration,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  updated.tags = JSON.parse(updated.tags || '[]');
  res.json(updated);
});

// ─── Admin: Delete project ───
router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '项目不存在' });

  // Delete associated files
  if (existing.cover_path) {
    const p = join(__dirname, '..', existing.cover_path);
    if (existsSync(p)) { try { unlinkSync(p); } catch {} }
  }
  if (existing.video_path) {
    const p = join(__dirname, '..', existing.video_path);
    if (existsSync(p)) { try { unlinkSync(p); } catch {} }
  }

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── Admin: Reorder projects ───
router.post('/reorder', authMiddleware, (req, res) => {
  const { order } = req.body; // [{ id: 1, sort_order: 0 }, ...]
  if (!Array.isArray(order)) return res.status(400).json({ error: 'Invalid order data' });

  const update = db.prepare('UPDATE projects SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  const transaction = db.transaction((items) => {
    for (const item of items) {
      update.run(item.sort_order, item.id);
    }
  });
  transaction(order);

  res.json({ success: true });
});

export default router;
