/**
 * ============================================
 * 项目常量配置
 * ============================================
 * 项目数据和常量定义
 */

/**
 * 项目列表
 * @type {Array}
 */
export const PROJECTS = [
  {
    id: "architecture",
    category: "architecture",
    span: "wide tall",
    href: "architecture-detail.html",
    webp: "./images/architecture-showcase.webp",
    jpg: "./images/architecture-showcase.jpg",
    title: {
      zh: "黄洞水库全龄友好游客空间设计",
      en: "Huangdong Reservoir Visitor Space"
    },
    kicker: {
      zh: "建筑可视化",
      en: "Architecture Visualization"
    },
    desc: {
      zh: "3 天内完成高保真建筑可视化交付，支持投融资沟通与品牌呈现。",
      en: "High-fidelity architectural visualization delivered in 3 days for investor and brand communication."
    }
  },
  {
    id: "animation",
    category: "animation",
    span: "tall",
    href: "animation-detail-updated.html",
    webp: "./images/animation-showcase.webp",
    jpg: "./images/animation-showcase.jpg",
    title: {
      zh: "PUAN 动画短片",
      en: "PUAN Animation Short"
    },
    kicker: {
      zh: "动画短片",
      en: "Animation Short"
    },
    desc: {
      zh: "AIGC + 动画流程融合，10 小时完成实验性叙事短片。",
      en: "AIGC and animation pipeline merged to deliver a stylized short in 10 hours."
    }
  },
  {
    id: "video",
    category: "video",
    span: "",
    href: "bilibili-video-detail.html",
    webp: "./images/bilibili-showcase.webp",
    jpg: "./images/bilibili-showcase.jpg",
    title: {
      zh: "AIGC F1 宣传片",
      en: "AIGC F1 Promo Video"
    },
    kicker: {
      zh: "品牌视频",
      en: "Brand Video"
    },
    desc: {
      zh: "速度与科技主题品牌视频，支持多平台传播与营销转化。",
      en: "A high-intensity brand video themed around speed and technology."
    }
  }
];

/**
 * 支持的语言
 * @type {Object}
 */
export const LANGUAGES = {
  ZH: 'zh',
  EN: 'en',
};

/**
 * 默认语言
 * @type {string}
 */
export const DEFAULT_LANGUAGE = LANGUAGES.ZH;

/**
 * 支持的过滤类别
 * @type {Array}
 */
export const FILTER_CATEGORIES = [
  { value: 'all', label: { zh: '全部', en: 'All' } },
  { value: 'architecture', label: { zh: '建筑可视化', en: 'Architecture' } },
  { value: 'animation', label: { zh: '动画短片', en: 'Animation' } },
  { value: 'video', label: { zh: '品牌视频', en: 'Brand Video' } },
];

/**
 * EmailJS CDN 地址
 * @type {string}
 */
export const EMAILJS_CDN = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

/**
 * API 端点
 * @type {Object}
 */
export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  PROJECT: (id) => `/projects/${id}`,
};

/**
 * 获取项目按类别
 * @param {string} category - 类别
 * @returns {Array} 过滤后的项目列表
 */
export function getProjectsByCategory(category) {
  if (category === 'all') {
    return PROJECTS;
  }
  return PROJECTS.filter(p => p.category === category);
}

/**
 * 获取项目详情
 * @param {string} id - 项目 ID
 * @returns {Object|null} 项目对象或 null
 */
export function getProjectById(id) {
  return PROJECTS.find(p => p.id === id) ?? null;
}

export default {
  PROJECTS,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  FILTER_CATEGORIES,
  EMAILJS_CDN,
  API_ENDPOINTS,
  getProjectsByCategory,
  getProjectById,
};
