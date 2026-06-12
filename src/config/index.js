/**
 * ============================================
 * 配置入口文件
 * ============================================
 * 统一导出所有配置模块
 */

export { config, supabaseConfig, apiConfig, emailjsConfig, gaConfig, umamiConfig } from './env.js';
export { I18N, translate } from './i18n.js';
export { PROJECTS, LANGUAGES, DEFAULT_LANGUAGE, FILTER_CATEGORIES, EMAILJS_CDN, API_ENDPOINTS, getProjectsByCategory, getProjectById } from './constants.js';

export default {
  env: () => import('./env.js'),
  i18n: () => import('./i18n.js'),
  constants: () => import('./constants.js'),
};
