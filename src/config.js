// ============================================
// Supabase 配置
// 替换为你自己的 Supabase 项目信息
// ============================================

// 从 Supabase Dashboard → Settings → API 获取
window.SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// 初始化 Supabase 客户端
window.supabaseClient = null;
if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && 
    !window.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
    window.supabaseClient = window.supabase.createClient(
        window.SUPABASE_URL, 
        window.SUPABASE_ANON_KEY
    );
    console.log('[Supabase] Initialized:', window.SUPABASE_URL);
} else {
    console.warn('[Supabase] Not configured — using fallback data');
}
