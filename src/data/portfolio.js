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
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Systems' },
  { id: 'contact', label: 'Contact' },
]

export const profile = {
  name: 'AJan',
  title: 'AIGC Video Director / AI Short-Drama Workflow Designer',
  headline:
    'I turn AI-generated shots into finished short-drama reels with clear hooks, consistent characters and platform-ready pacing.',
  aboutColumns: [
    'I am AJan, an AIGC video director focused on AI short drama, vertical reels and commercial concept trailers. My work is not a pile of generated frames. I shape hooks, characters, shot rhythm, sound and delivery into finished pieces that can be watched, judged and shipped.',
    'The workflow is built for teams that need to test overseas short-drama ideas, brand visual samples and fast concept packaging before committing to a full production pipeline. The goal is simple: make the story feel real enough to evaluate quickly.',
    'I work across prompt systems, character continuity, AI video generation, editing and color, with a strong bias toward finished reels instead of isolated experiments.',
  ],
  principles: [
    { label: 'Hook', text: 'The first three seconds need a clear emotional trigger.' },
    { label: 'Continuity', text: 'Characters, wardrobe, light and scene DNA must survive across shots.' },
    { label: 'Delivery', text: 'Every reel is packaged for vertical viewing, review and iteration.' },
  ],
  signature: 'AJan',
}

export const categories = [
  { id: 'all', label: 'All Videos', labelZh: 'All Videos', accent: '#f7f2e8' },
  { id: 'ai-drama', label: 'AI Drama', labelZh: 'AI Drama', accent: '#ff4f3e' },
]

export const projects = [
  {
    id: '01',
    slug: 'dreams-lead-to-my-alpha',
    category: 'ai-drama',
    type: 'Vertical AI Drama',
    titleZh: 'Dreams Lead to My Alpha',
    titleEn: 'Dreams Lead to My Alpha',
    introZh: 'A wolf-romance opener built around fate, desire and escape.',
    introEn: 'A wolf-romance opener built around fate, desire and escape.',
    hook: 'Fate-driven wolf romance',
    value: 'Fast emotional hook',
    challenge:
      'The opening needs to translate a very abstract feeling of fate into frames that make the audience stop, understand the relationship and want the next beat.',
    approach:
      'I compressed the first act into a rhythm of close-ups, low light, body language and vertical framing so the romance premise lands before the lore expands.',
    outcome:
      'A repeatable first-look template for vertical AI romance reels with a clear emotional entry point.',
    cover: v1Cover,
    video: v1Video,
    fullVideo: v1FullVideo,
    duration: '0:52',
    year: '2026',
    role: 'AI Director / Workflow Designer',
    tools: ['SDXL', 'ComfyUI', 'LoRA', 'Runway', 'DaVinci Resolve'],
    tags: ['AI drama', 'Wolf romance', 'Vertical reel'],
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
    titleZh: 'Betrayed by the Wolf, Claimed by the Alpha',
    titleEn: 'Betrayed by the Wolf, Claimed by the Alpha',
    introZh: 'A high-emotion drama test for betrayal, possession and continuity.',
    introEn: 'A high-emotion drama test for betrayal, possession and continuity.',
    hook: 'Betrayal to possession',
    value: 'High-emotion continuity',
    challenge:
      'Short drama depends on immediate betrayal, pressure and attraction, while generated faces and micro-expressions can easily break the emotional line.',
    approach:
      'I used composition, posture, lighting and sound design to hold emotional pressure even when individual generated moments needed cleanup.',
    outcome:
      'A controlled atmosphere method for high-emotion AI short-drama scenes.',
    cover: betrayalCover,
    video: betrayalVideo,
    duration: '2:24',
    year: '2026',
    role: 'AI Drama Visual Direction',
    tools: ['SDXL', 'RealisticVision', 'ControlNet', 'Sound Design'],
    tags: ['Betrayal', 'Character continuity', 'Overseas drama'],
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
    titleZh: "Mated to the Alpha's Curse",
    titleEn: "Mated to the Alpha's Curse",
    introZh: 'A supernatural romance reel about curse, intimacy and shot continuity.',
    introEn: 'A supernatural romance reel about curse, intimacy and shot continuity.',
    hook: 'Curse-led intimacy',
    value: 'Consistent scene DNA',
    challenge:
      'Multiple generated shots need to feel like they belong to the same film, not a set of similar posters.',
    approach:
      'I locked color, light source, wardrobe logic and scene rules, then edited around the strongest continuity anchors.',
    outcome:
      'A scene-DNA rule set for moody supernatural romance packaging.',
    cover: curseCover,
    video: curseVideo,
    duration: '1:39',
    year: '2026',
    role: 'Continuity Workflow',
    tools: ['SDXL', 'ControlNet', 'Img2Img', 'Prompt System'],
    tags: ['Supernatural romance', 'Continuity', 'Scene DNA'],
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
    titleZh: "Reborn This Time I Choose My Killer's Uncle",
    titleEn: "Reborn This Time I Choose My Killer's Uncle",
    introZh: 'A revenge-romance concept shaped through noir pacing and live-action framing.',
    introEn: 'A revenge-romance concept shaped through noir pacing and live-action framing.',
    hook: 'Revenge romance switch',
    value: 'Noir trailer pacing',
    challenge:
      'The rebirth revenge premise needs identity, danger and choice to become readable fast without becoming only mood imagery.',
    approach:
      'I used blocking, contrast, edit rhythm and noir color to separate power positions and make the relationship stakes legible.',
    outcome:
      'A compact noir-romance trailer system for AI-generated drama concepts.',
    cover: rebornCover,
    video: rebornVideo,
    duration: '1:24',
    year: '2026',
    role: 'AI Short Drama Packaging',
    tools: ['ComfyUI', 'LoRA', 'Kling', 'DaVinci Resolve'],
    tags: ['Rebirth revenge', 'Noir romance', 'English short drama'],
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
    titleZh: 'Picking Up a Governor from the Street',
    titleEn: 'Picking Up a Governor from the Street',
    introZh: 'A power-reversal concept mixing street realism and absurd identity contrast.',
    introEn: 'A power-reversal concept mixing street realism and absurd identity contrast.',
    hook: 'Street-level power reversal',
    value: 'Concept trailer clarity',
    challenge:
      'The absurd premise can float away unless the street realism and the identity reversal feel grounded at the same time.',
    approach:
      'I kept the environment tactile and the costume hierarchy clear, using contrast as the engine of the concept.',
    outcome:
      'A grounded high-concept test for short-drama pitch reels.',
    cover: pickingCover,
    video: pickingVideo,
    duration: '1:46',
    year: '2026',
    role: 'Concept Trailer Direction',
    tools: ['SDXL', 'Video Generation', 'Editing', 'Color Grade'],
    tags: ['Absurd premise', 'Power reversal', 'Concept trailer'],
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
    summary: 'Topic selection, hook design, shot structure and platform rhythm.',
    items: ['Short-drama hooks', 'Opening conflict', 'Shot rhythm', 'Visual packaging'],
  },
  {
    title: 'AI Production',
    summary: 'Character, style and batch-generation systems for usable footage.',
    items: ['ComfyUI', 'SDXL / LoRA', 'ControlNet', 'Video generation'],
  },
  {
    title: 'Post Production',
    summary: 'From generated assets to watchable reels with edit, grade and sound.',
    items: ['Editing', 'Color grade', 'Subtitles', 'Sound design'],
  },
  {
    title: 'Commercial Delivery',
    summary: 'Organized outputs for review, iteration and release workflows.',
    items: ['AI live-action drama', 'Vertical trailer', 'English drama packaging', 'Portfolio curation'],
  },
]

export const executionStandards = [
  { label: 'Visual-first', text: 'Covers and moving images carry the first read. Explanations stay short.' },
  { label: 'Fast path', text: 'The first screen is readable and every project can be opened in two steps.' },
  { label: 'Responsive', text: 'Desktop, tablet and mobile use separate interaction rules.' },
  { label: 'Media-aware', text: 'Video waits for intent. Covers load first and preserve motion performance.' },
]

export const contact = {
  email: '1248567324@qq.com',
  availability: [
    'AIGC portfolio curation',
    'AI live-action short-drama direction',
    'Character-continuity workflow',
    'Vertical trailer packaging',
  ],
  socials: [
    { label: 'Bilibili', href: '#' },
    { label: 'Xiaohongshu', href: '#' },
    { label: 'Vimeo', href: '#' },
  ],
}
