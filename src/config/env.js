/**
 * ============================================
 * 环境配置 - 统一管理所有环境变量
 * ============================================
 * 
 * 通过 import.meta.env 访问，确保安全性
 * 只在 .env 中暴露公开的 VITE_ 前缀变量
 */

/**
 * 获取环境变量值，支持默认值
 * @param {string} key - 环境变量名（不需要 VITE_ 前缀）
 * @param {*} defaultValue - 默认值
 * @returns {*} 环境变量值或默认值
 */
function getEnv(key, defaultValue = undefined) {
  const value = import.meta.env[`VITE_${key}`];
  return value !== undefined ? value : defaultValue;
}

/**
 * Supabase 配置
 */
export const supabaseConfig = {
  url: getEnv('SUPABASE_URL'),
  anonKey: getEnv('SUPABASE_ANON_KEY'),
  
  isConfigured: () => {
    return !!(supabaseConfig.url && supabaseConfig.anonKey);
  },
  
  validate: () => {
    if (!supabaseConfig.url) {
      console.warn('[Config] Supabase URL not configured');
    }
    if (!supabaseConfig.anonKey) {
      console.warn('[Config] Supabase ANON_KEY not configured');
    }
  },
};

/**
 * API 配置
 */
export const apiConfig = {
  baseUrl: getEnv('API_BASE_URL', '/api'),
  timeout: parseInt(getEnv('API_TIMEOUT', '5000'), 10),
  
  /**
   * 获取完整 API 地址
   * @param {string} endpoint - API 端点
   * @returns {string} 完整 URL
   */
  getUrl: (endpoint) => {
    const base = apiConfig.baseUrl.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  },
};

/**
 * EmailJS 配置（表单提交）
 */
export const emailjsConfig = {
  serviceId: getEnv('EMAILJS_SERVICE_ID'),
  templateId: getEnv('EMAILJS_TEMPLATE_ID'),
  publicKey: getEnv('EMAILJS_PUBLIC_KEY'),
  
  isConfigured: () => {
    return !!(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey);
  },
  
  validate: () => {
    if (!emailjsConfig.serviceId) {
      console.warn('[Config] EmailJS serviceId not configured');
    }
    if (!emailjsConfig.templateId) {
      console.warn('[Config] EmailJS templateId not configured');
    }
    if (!emailjsConfig.publicKey) {
      console.warn('[Config] EmailJS publicKey not configured');
    }
  },
};

/**
 * Google Analytics 配置
 */
export const gaConfig = {
  measurementId: getEnv('GA_MEASUREMENT_ID'),
  
  isConfigured: () => {
    return !!gaConfig.measurementId;
  },
};

/**
 * Umami Analytics 配置
 */
export const umamiConfig = {
  websiteId: getEnv('UMAMI_WEBSITE_ID'),
  scriptUrl: getEnv('UMAMI_SCRIPT_URL'),
  
  isConfigured: () => {
    return !!(umamiConfig.websiteId && umamiConfig.scriptUrl);
  },
};

/**
 * 合并导出所有配置
 */
export const config = {
  supabase: supabaseConfig,
  api: apiConfig,
  emailjs: emailjsConfig,
  analytics: {
    ga: gaConfig,
    umami: umamiConfig,
  },
  
  /**
   * 验证所有配置
   */
  validate: () => {
    console.log('[Config] Validating environment configuration...');
    supabaseConfig.validate();
    emailjsConfig.validate();
    console.log('[Config] Validation complete');
  },
};

export default config;
