import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'aigc.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title_zh      TEXT NOT NULL,
    title_en      TEXT,
    category      TEXT NOT NULL DEFAULT 'video',
    description   TEXT,
    cover_path    TEXT,
    video_path    TEXT,
    video_type    TEXT DEFAULT 'mp4',
    tags          TEXT DEFAULT '[]',
    sort_order    INTEGER DEFAULT 0,
    is_published  INTEGER DEFAULT 1,
    is_featured   INTEGER DEFAULT 0,
    duration      TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
  CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
  CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
`);

// Seed with existing data if table is empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM projects').get();
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (title_zh, title_en, category, description, tags, sort_order, is_published, is_featured)
    VALUES (@title_zh, @title_en, @category, @description, @tags, @sort_order, @is_published, @is_featured)
  `);

  const seedData = [
    {
      title_zh: '惠州黄洞水库全龄友好游客空间设计',
      title_en: 'Huangdong Reservoir Visitor Space Design',
      category: 'architecture',
      description: '3天交付 | 8K 输出 | 一稿通过率 92% | 效率提升 43% | 支持投融资决策与高端品牌呈现',
      tags: JSON.stringify(['SketchUp', 'V-Ray', '3ds Max', 'AI 增强']),
      sort_order: 1,
      is_published: 1,
      is_featured: 1
    },
    {
      title_zh: 'PUAN 动画短片',
      title_en: 'PUAN Animation Short',
      category: 'animation',
      description: 'AIGC + 动画流程融合 | 10 小时完成实验性叙事短片 | 风格化视觉表达',
      tags: JSON.stringify(['Stable Diffusion', 'After Effects', 'Runway']),
      sort_order: 2,
      is_published: 1,
      is_featured: 1
    },
    {
      title_zh: 'AIGC F1 宣传片',
      title_en: 'AIGC F1 Promo Video',
      category: 'video',
      description: '12h 制作成本降低 70% | 传播广度提升 40%+ | 体育营销创新方案与品牌形象升级的完整展示',
      tags: JSON.stringify(['Google Gemini', 'Nano Banana Pro', 'Veo3']),
      sort_order: 3,
      is_published: 1,
      is_featured: 1
    }
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });
  insertMany(seedData);
  console.log('[DB] Seeded 3 initial projects');
}

export default db;
