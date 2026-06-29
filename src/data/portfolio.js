import v1Video from '../../v1_mobile.mp4'
import v1FullVideo from '../../v1.mp4'
import v1Cover from '../../v1_cover.jpg'
import betrayalVideo from '../../429.mp4'
import betrayalCover from '../../429_cover.jpg'
import curseVideo from '../../795.mp4'
import curseCover from '../../795_cover.jpg'
import rebornVideo from '../../reborn.mp4'
import rebornCover from '../../reborn_cover.jpg'
import pickingVideo from '../../picking.mp4'
import pickingCover from '../../picking_cover.jpg'

export const navigation = [
  { id: 'home', label: '首页' },
  { id: 'profile', label: '简介' },
  { id: 'work', label: '作品' },
  { id: 'skills', label: '技能' },
  { id: 'contact', label: '联系' },
]

export const profile = {
  name: 'AJan',
  title: 'AIGC Video Director / AI Short-Drama Workflow Designer',
  headline: 'I turn AI-generated shots into finished short-drama reels with clear hooks, consistent characters and platform-ready pacing.',
  aboutColumns: [
    '我是 AJan，专注 AIGC 短剧与商业预告影像。我的工作不是堆生成画面，而是把钩子、角色连续性、镜头节奏和后期包装整理成能被观看、能被判断、能被交付的成片流程。',
    '适合需要快速验证海外短剧题材、品牌视觉样片和竖屏内容方向的团队。用更低试错成本，提前看到故事气质、人物关系和平台播放节奏是否成立。',
  ],
  bio: [
    '我的工作不是堆素材，而是把剧本钩子、角色一致性、镜头节奏和后期包装连成一条可交付流程。',
    '适合需要快速验证短剧概念、海外题材预告、AIGC 视觉方案和成片包装的团队。',
  ],
  principles: [
    { label: 'Hook', text: '前 3 秒先建立情绪和冲突。' },
    { label: 'Continuity', text: '角色、服装、光线和场景保持同一套视觉 DNA。' },
    { label: 'Delivery', text: '按竖屏短剧、预告和社媒播放场景完成包装。' },
  ],
  signature: 'AJan',
}

export const categories = [
  { id: 'all', label: 'All Videos', labelZh: '公开视频', accent: '#f2d06b' },
  { id: 'ai-drama', label: 'AI Drama', labelZh: '海外真人 AI 剧', accent: '#ff6a3d' },
]

export const projects = [
  {
    id: '01',
    slug: 'dreams-lead-to-my-alpha',
    category: 'ai-drama',
    type: 'Vertical AI Drama',
    titleZh: '梦把我带向那只 Alpha',
    titleEn: 'Dreams Lead to My Alpha',
    introZh: '命运感、逃离欲和竖屏开场钩子。',
    introEn: 'A wolf-romance opener built around fate, desire and escape.',
    hook: 'Fate-driven wolf romance',
    value: 'Fast emotional hook',
    challenge: '如何让 AI 理解“命运感”这种抽象情绪，并转化为观众愿意停留的镜头氛围。',
    approach: '用光线、姿态和剪辑节奏压缩开场信息。',
    outcome: '形成竖屏 AI 真人剧的第一眼模板。',
    cover: v1Cover,
    video: v1Video,
    fullVideo: v1FullVideo,
    duration: '0:52',
    year: '2026',
    role: 'AI Director / Workflow Designer',
    tools: ['SDXL', 'ComfyUI', 'LoRA', 'Runway', 'DaVinci Resolve'],
    tags: ['AI 真人短剧', '狼人题材', '竖屏叙事'],
    metrics: [
      { label: 'Shots', value: '42' },
      { label: 'Iterations', value: '237' },
      { label: 'Format', value: '9:16' },
    ],
    featured: true,
  },
  {
    id: '02',
    slug: 'betrayed-by-the-wolf',
    category: 'ai-drama',
    type: 'AI Short Drama',
    titleZh: '背叛之后，被 Alpha 认领',
    titleEn: 'Betrayed by the Wolf, Claimed by the Alpha',
    introZh: '背叛、占有和强情绪压力测试。',
    introEn: 'A high-emotion drama test for betrayal, possession and continuity.',
    hook: 'Betrayal to possession',
    value: 'High-emotion continuity',
    challenge: '短剧需要迅速建立背叛、占有和情绪冲突，但 AI 生成的人脸与微表情容易失焦。',
    approach: '用构图、肢体和灯光补足微表情的不稳定。',
    outcome: '建立强情绪短剧的氛围控制方法。',
    cover: betrayalCover,
    video: betrayalVideo,
    duration: '2:24',
    year: '2026',
    role: 'AI Drama Visual Direction',
    tools: ['SDXL', 'RealisticVision', 'ControlNet', 'Sound Design'],
    tags: ['强情绪', '角色一致性', '海外短剧'],
    metrics: [
      { label: 'Shots', value: '38' },
      { label: 'Duration', value: '2:24' },
      { label: 'Mood', value: 'Betrayal' },
    ],
    featured: true,
  },
  {
    id: '03',
    slug: 'mated-to-the-alpha-curse',
    category: 'ai-drama',
    type: 'Supernatural Romance',
    titleZh: '与 Alpha 的诅咒结契',
    titleEn: "Mated to the Alpha's Curse",
    introZh: '诅咒、亲密关系和镜头连续性。',
    introEn: 'A supernatural romance reel about curse, intimacy and shot continuity.',
    hook: 'Curse-led intimacy',
    value: 'Consistent scene DNA',
    challenge: '多个独立生成镜头需要看起来属于同一部电影，而不是一组风格相近的海报。',
    approach: '固定色彩、光源、服装和景别规律。',
    outcome: '沉淀奇幻爱情题材的连续性规则。',
    cover: curseCover,
    video: curseVideo,
    duration: '1:39',
    year: '2026',
    role: 'Continuity Workflow',
    tools: ['SDXL', 'ControlNet', 'Img2Img', 'Prompt System'],
    tags: ['奇幻爱情', '镜头连续性', '场景 DNA'],
    metrics: [
      { label: 'Shots', value: '56' },
      { label: 'Duration', value: '1:39' },
      { label: 'System', value: 'DNA' },
    ],
  },
  {
    id: '04',
    slug: 'reborn-killers-uncle',
    category: 'ai-drama',
    type: 'AI Romance Drama',
    titleZh: '重生后，我选择凶手的叔叔',
    titleEn: "Reborn This Time I Choose My Killer's Uncle",
    introZh: '重生复仇题材的黑色浪漫包装。',
    introEn: 'A revenge-romance concept shaped through noir pacing and live-action framing.',
    hook: 'Revenge romance switch',
    value: 'Noir trailer pacing',
    challenge: '重生复仇题材需要快速建立身份、权力关系和选择冲突，画面不能只停留在氛围。',
    approach: '用站位、景别和转场分出危险关系。',
    outcome: '验证黑色浪漫短剧的包装潜力。',
    cover: rebornCover,
    video: rebornVideo,
    duration: '1:24',
    year: '2026',
    role: 'AI Short Drama Packaging',
    tools: ['ComfyUI', 'LoRA', 'Kling', 'DaVinci Resolve'],
    tags: ['重生复仇', '黑色浪漫', '英文短剧'],
    metrics: [
      { label: 'Duration', value: '1:24' },
      { label: 'Tone', value: 'Noir' },
      { label: 'Format', value: 'Drama' },
    ],
  },
  {
    id: '05',
    slug: 'picking-up-governor',
    category: 'ai-drama',
    type: 'Absurd Drama Concept',
    titleZh: '街头捡到一位州长',
    titleEn: 'Picking Up a Governor from the Street',
    introZh: '街头现实感与权力反差。',
    introEn: 'A power-reversal concept mixing street realism and absurd identity contrast.',
    hook: 'Street-level power reversal',
    value: 'Concept trailer clarity',
    challenge: '荒诞设定容易显得悬浮，需要让街头真实感和身份反差同时成立。',
    approach: '用环境细节和服装层级控制反差。',
    outcome: '形成现实场景加高概念剧情的方向。',
    cover: pickingCover,
    video: pickingVideo,
    duration: '1:46',
    year: '2026',
    role: 'Concept Trailer Direction',
    tools: ['SDXL', 'Video Generation', 'Editing', 'Color Grade'],
    tags: ['荒诞设定', '权力反差', '剧情预告'],
    metrics: [
      { label: 'Duration', value: '1:46' },
      { label: 'Hook', value: 'Power' },
      { label: 'Style', value: 'Street' },
    ],
  },
]

export const skillGroups = [
  {
    title: 'Creative Direction',
    summary: '选题、钩子、分镜和节奏。',
    items: ['短剧钩子', '情绪开场', '分镜节奏', '社媒包装'],
  },
  {
    title: 'AI Production',
    summary: '角色、风格和批量生成。',
    items: ['ComfyUI', 'SDXL / LoRA', 'ControlNet', '视频模型'],
  },
  {
    title: 'Post Production',
    summary: '从素材到可发布成片。',
    items: ['剪辑', '调色', '字幕', '交付规格'],
  },
  {
    title: 'Commercial Delivery',
    summary: '按成片和平台需求组织交付。',
    items: ['AI 真人短剧', '竖屏预告', '英文短剧包装', '作品集精修'],
  },
]

export const executionStandards = [
  { label: 'Visual-first', text: '作品封面优先，说明只保留必要信息。' },
  { label: 'Fast path', text: '首屏可读，作品两步内打开。' },
  { label: 'Responsive', text: '桌面、平板、移动端独立校准。' },
  { label: 'Media-aware', text: '视频按需加载，封面先行。' },
]

export const contact = {
  email: '1248567324@qq.com',
  availability: ['AIGC 作品集合作', 'AI 真人短剧视觉方案', '角色一致性工作流', '短剧预告包装'],
}
