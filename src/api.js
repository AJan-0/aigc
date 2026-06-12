/**
 * ============================================
 * AIGC Portfolio API Client
 * ============================================
 * 改进的 API 客户端，使用统一的错误处理和数据转换
 */

import { apiConfig } from './config/env.js';
import { transformProjectData, transformProjectList } from './utils/transformers.js';
import { APIError, NetworkError } from './utils/errors.js';
import { ResponseCache } from './utils/response.js';

/**
 * API 基础 URL
 * 优先从环境变量读取，降级到代码中的配置
 */
const API_BASE = (() => {
  if (apiConfig.baseUrl && apiConfig.baseUrl !== '/api') {
    return apiConfig.baseUrl;
  }
  
  // 开发环境：Vite 代理到 localhost:3001
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  
  // 生产环境：使用环境变量或 API URL
  return '/api';
})();

/**
 * 响应缓存 - 用于缓存 API 响应，避免重复请求
 * TTL: 5 分钟（300000 毫秒）
 */
const cache = new ResponseCache(5 * 60 * 1000);

/**
 * 获取项目列表
 * @param {Object} options - 查询选项
 * @param {string} options.category - 类别过滤
 * @param {boolean} options.featured - 仅显示精选项目
 * @param {boolean} options.force - 强制刷新（忽略缓存）
 * @returns {Promise<Array>} 项目列表或空数组（出错时）
 */
export async function fetchProjects(options = {}) {
  const { category, featured, force = false } = options;

  // 生成缓存键
  const cacheKey = `projects:${category || 'all'}:${featured ? 'featured' : 'all'}`;

  // 检查缓存（如果不是强制刷新）
  if (!force) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('[API] Returning cached projects:', cacheKey);
      return cached;
    }
  }

  try {
    let url = `${API_BASE}/projects`;
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (featured) params.set('featured', '1');
    if (params.toString()) url += `?${params.toString()}`;

    console.log('[API] Fetching projects:', url);
    
    const res = await fetch(url, {
      signal: AbortSignal.timeout(apiConfig.timeout),
    });

    if (!res.ok) {
      throw new APIError(
        `Failed to fetch projects (${res.status})`,
        res.status,
        { endpoint: url }
      );
    }

    const projects = await res.json();

    // 使用统一的数据转换函数
    const transformed = transformProjectList(projects);

    // 缓存结果
    cache.set(cacheKey, transformed);

    console.log('[API] Successfully fetched projects:', transformed.length);
    return transformed;
  } catch (err) {
    // 转换为统一的错误类
    if (err instanceof APIError) {
      console.error('[API] API Error:', err.toJSON());
    } else if (err instanceof TypeError && err.message.includes('fetch')) {
      console.error('[API] Network Error:', err.message);
    } else {
      console.error('[API] Unknown Error:', err);
    }
    
    // 出错时返回空数组，前端应该优雅降级
    return [];
  }
}

/**
 * 获取单个项目详情
 * @param {string|number} id - 项目 ID
 * @returns {Promise<Object|null>} 项目对象或 null（出错时）
 */
export async function fetchProject(id) {
  if (!id) {
    console.warn('[API] Missing project ID');
    return null;
  }

  // 生成缓存键
  const cacheKey = `project:${id}`;

  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('[API] Returning cached project:', id);
    return cached;
  }

  try {
    const url = `${API_BASE}/projects/${id}`;
    
    console.log('[API] Fetching project:', url);
    
    const res = await fetch(url, {
      signal: AbortSignal.timeout(apiConfig.timeout),
    });

    if (!res.ok) {
      throw new APIError(
        `Failed to fetch project (${res.status})`,
        res.status,
        { endpoint: url, projectId: id }
      );
    }

    const rawProject = await res.json();

    // 使用统一的数据转换函数
    const transformed = transformProjectData(rawProject);

    // 缓存结果
    cache.set(cacheKey, transformed);

    console.log('[API] Successfully fetched project:', id);
    return transformed;
  } catch (err) {
    if (err instanceof APIError) {
      console.error('[API] API Error:', err.toJSON());
    } else {
      console.error('[API] Failed to fetch project:', id, err);
    }
    
    // 出错时返回 null，前端应该显示错误页面
    return null;
  }
}

/**
 * 清除缓存
 * @param {string} type - 缓存类型 (projects, project, all)
 */
export function clearCache(type = 'all') {
  if (type === 'all') {
    cache.clear();
    console.log('[API] Cache cleared');
  } else if (type === 'projects') {
    // 清除所有项目列表缓存
    for (const key of ['projects:all:all', 'projects:all:featured']) {
      cache.delete(key);
    }
    console.log('[API] Projects cache cleared');
  } else {
    cache.delete(`project:${type}`);
    console.log('[API] Project cache cleared:', type);
  }
}

/**
 * 获取缓存统计信息（仅用于调试）
 * @returns {Object} 缓存统计
 */
export function getCacheStats() {
  return {
    size: cache.size(),
    ttl: cache.ttl,
  };
}
