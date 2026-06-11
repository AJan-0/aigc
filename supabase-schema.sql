-- ============================================
-- AIGC Portfolio - Supabase Schema
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title_zh TEXT NOT NULL,
  title_en TEXT,
  category TEXT NOT NULL DEFAULT 'video',
  description TEXT,
  cover_url TEXT,
  video_url TEXT,
  video_type TEXT DEFAULT 'mp4',
  tags JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 公开读取已发布项目
CREATE POLICY "Public read published" ON projects
  FOR SELECT USING (is_published = true);

-- 认证用户可以管理所有项目
CREATE POLICY "Auth full access" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- 初始数据
INSERT INTO projects (title_zh, title_en, category, description, tags, sort_order, is_published, is_featured)
VALUES 
  ('惠州黄洞水库全龄友好游客空间设计', 'Huangdong Reservoir Visitor Space Design', 'architecture', 
   '3天交付 | 8K 输出 | 一稿通过率 92% | 效率提升 43% | 支持投融资决策与高端品牌呈现', 
   '["SketchUp", "V-Ray", "3ds Max", "AI 增强"]', 1, true, true),
  ('PUAN 动画短片', 'PUAN Animation Short', 'animation', 
   'AIGC + 动画流程融合 | 10 小时完成实验性叙事短片 | 风格化视觉表达', 
   '["Stable Diffusion", "After Effects", "Runway"]', 2, true, true),
  ('AIGC F1 宣传片', 'AIGC F1 Promo Video', 'video', 
   '12h 制作成本降低 70% | 传播广度提升 40%+ | 体育营销创新方案与品牌形象升级的完整展示', 
   '["Google Gemini", "Nano Banana Pro", "Veo3"]', 3, true, true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Public read videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Auth upload videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Public read covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Auth upload covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
