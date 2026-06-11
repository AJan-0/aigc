import { Router } from 'express';
import { generateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    const token = generateToken({ username, role: 'admin' });
    return res.json({ token, username });
  }

  return res.status(401).json({ error: '用户名或密码错误' });
});

router.get('/verify', (req, res) => {
  // This endpoint is protected by auth middleware in the route setup
  res.json({ valid: true, admin: req.admin });
});

export default router;
