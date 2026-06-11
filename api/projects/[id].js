// Vercel Serverless Function: GET /api/projects/:id
const projects = [
  {
    id: 1,
    title_zh: "惠州黄洞水库全龄友好游客空间设计",
    title_en: "Huangdong Reservoir Visitor Space Design",
    category: "architecture",
    description: "3天交付 | 8K 输出 | 一稿通过率 92% | 效率提升 43% | 支持投融资决策与高端品牌呈现",
    cover_path: "images/architecture-showcase.jpg",
    video_path: null,
    video_type: "mp4",
    tags: ["SketchUp", "V-Ray", "3ds Max", "AI 增强"],
    sort_order: 1,
    is_published: 1,
    is_featured: 1,
    duration: null,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: 2,
    title_zh: "PUAN 动画短片",
    title_en: "PUAN Animation Short",
    category: "animation",
    description: "AIGC + 动画流程融合 | 10 小时完成实验性叙事短片 | 风格化视觉表达",
    cover_path: "images/animation-showcase.jpg",
    video_path: null,
    video_type: "mp4",
    tags: ["Stable Diffusion", "After Effects", "Runway"],
    sort_order: 2,
    is_published: 1,
    is_featured: 1,
    duration: null,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  },
  {
    id: 3,
    title_zh: "AIGC F1 宣传片",
    title_en: "AIGC F1 Promo Video",
    category: "video",
    description: "12h 制作成本降低 70% | 传播广度提升 40%+ | 体育营销创新方案与品牌形象升级的完整展示",
    cover_path: "images/bilibili-showcase.jpg",
    video_path: null,
    video_type: "mp4",
    tags: ["Google Gemini", "Nano Banana Pro", "Veo3"],
    sort_order: 3,
    is_published: 1,
    is_featured: 1,
    duration: null,
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { id } = req.query;
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  return res.status(200).json(project);
}
