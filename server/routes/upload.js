import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';
import { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync, rmdirSync } from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'uploads');
const tempDir = join(uploadsDir, 'temp');
const videosDir = join(uploadsDir, 'videos');
const coversDir = join(uploadsDir, 'covers');

// Ensure directories exist
[tempDir, videosDir, coversDir].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// Multer config for chunk uploads
const chunkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const chunkDir = join(tempDir, req.body.uploadId || 'unknown');
    if (!existsSync(chunkDir)) mkdirSync(chunkDir, { recursive: true });
    cb(null, chunkDir);
  },
  filename: (req, file, cb) => {
    cb(null, `chunk_${req.body.chunkIndex || 0}`);
  }
});

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, coversDir),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname) || '.jpg';
    cb(null, `${uuidv4()}${ext}`);
  }
});

const chunkUpload = multer({
  storage: chunkStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per chunk
});

const coverUpload = multer({
  storage: coverStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('不支持的图片格式'));
  }
});

const router = Router();

// ─── Initialize chunked upload ───
router.post('/init', authMiddleware, (req, res) => {
  const { filename, totalChunks, totalSize } = req.body;
  if (!filename || !totalChunks) {
    return res.status(400).json({ error: '缺少 filename 或 totalChunks' });
  }

  const uploadId = uuidv4();
  const ext = extname(filename).toLowerCase();
  const allowedVideoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

  if (!allowedVideoExts.includes(ext)) {
    return res.status(400).json({ error: '不支持的视频格式' });
  }

  if (totalSize > 500 * 1024 * 1024) {
    return res.status(400).json({ error: '文件大小超过 500MB 限制' });
  }

  const chunkDir = join(tempDir, uploadId);
  if (!existsSync(chunkDir)) mkdirSync(chunkDir, { recursive: true });

  res.json({ uploadId, chunkSize: 5 * 1024 * 1024, totalChunks });
});

// ─── Upload a single chunk ───
router.post('/chunk', chunkUpload.single('chunk'), (req, res) => {
  const { uploadId, chunkIndex, totalChunks } = req.body;
  if (!uploadId || chunkIndex === undefined || !totalChunks) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const chunkDir = join(tempDir, uploadId);
  if (!existsSync(chunkDir)) {
    return res.status(400).json({ error: '上传会话不存在' });
  }

  res.json({ success: true, chunkIndex: parseInt(chunkIndex), received: true });
});

// ─── Complete chunked upload — merge all chunks ───
router.post('/complete', authMiddleware, (req, res) => {
  const { uploadId, filename, totalChunks } = req.body;
  if (!uploadId || !filename || !totalChunks) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const chunkDir = join(tempDir, uploadId);
  if (!existsSync(chunkDir)) {
    return res.status(400).json({ error: '上传会话不存在' });
  }

  // Verify all chunks exist
  for (let i = 0; i < totalChunks; i++) {
    if (!existsSync(join(chunkDir, `chunk_${i}`))) {
      return res.status(400).json({ error: `缺少分块 ${i}` });
    }
  }

  // Merge chunks into final file
  const ext = extname(filename).toLowerCase();
  const finalName = `${uuidv4()}${ext}`;
  const finalPath = join(videosDir, finalName);
  const writeStream = createWriteStream(finalPath);

  writeStream.on('finish', () => {
    // Cleanup temp chunks
    try {
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(chunkDir, `chunk_${i}`);
        if (existsSync(chunkPath)) unlinkSync(chunkPath);
      }
      if (existsSync(chunkDir)) rmdirSync(chunkDir);
    } catch (e) {
      console.error('[Upload] Cleanup error:', e.message);
    }

    res.json({
      success: true,
      path: `uploads/videos/${finalName}`,
      filename: finalName
    });
  });

  writeStream.on('error', (err) => {
    console.error('[Upload] Merge error:', err.message);
    res.status(500).json({ error: '文件合并失败' });
  });

  // Write chunks sequentially
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = join(chunkDir, `chunk_${i}`);
    const data = readFileSync(chunkPath);
    writeStream.write(data);
  }
  writeStream.end();
});

// ─── Upload cover image ───
router.post('/cover', authMiddleware, coverUpload.single('cover'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未上传文件' });
  res.json({
    success: true,
    path: `uploads/covers/${req.file.filename}`,
    filename: req.file.filename
  });
});

export default router;
