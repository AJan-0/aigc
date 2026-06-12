/**
 * ============================================
 * Supabase 配置（从环境变量加载）
 * ============================================
 * 
 * 现在从 .env 文件加载配置（见 src/config/env.js）
 * 这个文件保留用于向后兼容性和全局初始化
 * 
 * 📝 注意：敏感配置已移至 .env 文件
 * 不再在源代码中硬编码凭证
 */

import { supabaseConfig } from './config/env.js';

// 初始化 Supabase 客户端
window.supabaseClient = null;

try {
  if (supabaseConfig.isConfigured()) {
    window.SUPABASE_URL = supabaseConfig.url;
    window.SUPABASE_ANON_KEY = supabaseConfig.anonKey;
    
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      window.supabaseClient = window.supabase.createClient(
        supabaseConfig.url,
        supabaseConfig.anonKey
      );
      console.log('[Supabase] Initialized successfully');
    } else {
      console.warn('[Supabase] Supabase library not loaded yet');
    }
  } else {
    console.warn('[Supabase] Configuration incomplete - using fallback data');
  }
} catch (error) {
  console.error('[Supabase] Initialization error:', error);
}
