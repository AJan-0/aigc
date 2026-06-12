/**
 * ============================================
 * Analytics 配置加载器
 * ============================================
 * 
 * 从 src/analytics/config.js 动态导入配置
 * 这里保留用于向后兼容性
 */

// 尝试从模块导入配置（如果支持 ES6 modules）
try {
  // 注意：这里的导入在 HTML 中作为模块脚本时有效
  // 对于传统脚本标签，使用 window.SITE_ANALYTICS 的降级配置
  import('./analytics/config.js').catch(() => {
    // 降级方案：使用空配置
    window.SITE_ANALYTICS = window.SITE_ANALYTICS || {
      gaMeasurementId: "",
      umamiWebsiteId: "",
      umamiScriptUrl: ""
    };
  });
} catch (_e) {
  // 降级方案：使用空配置
  window.SITE_ANALYTICS = window.SITE_ANALYTICS || {
    gaMeasurementId: "",
    umamiWebsiteId: "",
    umamiScriptUrl: ""
  };
}
