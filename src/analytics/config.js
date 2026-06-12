/**
 * ============================================
 * Analytics 配置
 * ============================================
 * 从环境变量加载 Analytics 配置
 */

import { gaConfig, umamiConfig } from '../config/env.js';

/**
 * Analytics 配置对象
 * 支持 Google Analytics 和 Umami Analytics
 */
export const analyticsConfig = {
  ga: {
    measurementId: gaConfig.measurementId,
    isConfigured: () => gaConfig.isConfigured(),
  },
  umami: {
    websiteId: umamiConfig.websiteId,
    scriptUrl: umamiConfig.scriptUrl,
    isConfigured: () => umamiConfig.isConfigured(),
  },
};

// 向后兼容性 - 设置 window 全局对象
window.SITE_ANALYTICS = {
  gaMeasurementId: analyticsConfig.ga.measurementId,
  umamiWebsiteId: analyticsConfig.umami.websiteId,
  umamiScriptUrl: analyticsConfig.umami.scriptUrl,
};

export default analyticsConfig;
