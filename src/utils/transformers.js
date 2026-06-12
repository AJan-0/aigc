/**
 * ============================================
 * API 数据转换工具
 * ============================================
 * 统一处理 API 响应数据转换，避免代码重复
 */

/**
 * 转换项目数据
 * 将服务器返回的原始数据转换为前端使用的格式
 * 
 * @param {Object} rawProject - 服务器返回的原始项目数据
 * @returns {Object} 转换后的项目对象
 * 
 * @example
 * const raw = { id: 1, title_zh: "项目", category: "arch" };
 * const transformed = transformProjectData(raw);
 * // => { id: "1", title: "项目", category: "ARCHITECTURE VISUALIZATION", ... }
 */
export function transformProjectData(rawProject) {
  if (!rawProject) {
    return null;
  }

  return {
    id: String(rawProject.id),
    title: rawProject.title_zh || '',
    titleEn: rawProject.title_en || '',
    category: getCategoryLabel(rawProject.category),
    categoryKey: rawProject.category || '',
    description: rawProject.description || '',
    image: rawProject.cover_path ? `/${rawProject.cover_path}` : null,
    videoUrl: rawProject.video_path ? `/${rawProject.video_path}` : null,
    videoType: rawProject.video_type || 'mp4',
    isVideo: !!rawProject.video_path,
    tags: Array.isArray(rawProject.tags) ? rawProject.tags : [],
    duration: rawProject.duration || null,
    isFeatured: !!rawProject.is_featured,
  };
}

/**
 * 获取类别标签
 * 将类别键转换为可读的标签文本
 * 
 * @param {string} key - 类别键 (architecture, animation, video)
 * @returns {string} 英文类别标签
 */
function getCategoryLabel(key) {
  const labels = {
    architecture: 'ARCHITECTURE VISUALIZATION',
    animation: 'ANIMATION',
    video: 'VIDEO SHOWCASE',
  };
  return labels[key] || (key ? key.toUpperCase() : '');
}

/**
 * 批量转换项目列表
 * 
 * @param {Array} projects - 原始项目数组
 * @returns {Array} 转换后的项目数组
 */
export function transformProjectList(projects) {
  if (!Array.isArray(projects)) {
    return [];
  }
  return projects.map(transformProjectData).filter(Boolean);
}

/**
 * 验证转换后的数据
 * 确保转换后的数据有必需的字段
 * 
 * @param {Object} project - 转换后的项目对象
 * @returns {boolean} 是否有效
 */
export function isValidProject(project) {
  return !!(
    project &&
    project.id &&
    project.title &&
    project.categoryKey
  );
}

/**
 * 按类别过滤项目
 * 
 * @param {Array} projects - 项目数组
 * @param {string} category - 类别键
 * @returns {Array} 过滤后的项目数组
 */
export function filterProjectsByCategory(projects, category) {
  if (!Array.isArray(projects)) {
    return [];
  }
  
  if (category === 'all') {
    return projects;
  }
  
  return projects.filter(p => p.categoryKey === category);
}

/**
 * 排序项目
 * 
 * @param {Array} projects - 项目数组
 * @param {string} sortBy - 排序字段 (id, title, featured)
 * @param {string} order - 排序顺序 (asc, desc)
 * @returns {Array} 排序后的项目数组
 */
export function sortProjects(projects, sortBy = 'id', order = 'asc') {
  if (!Array.isArray(projects)) {
    return [];
  }
  
  const sorted = [...projects];
  const multiplier = order === 'asc' ? 1 : -1;
  
  sorted.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * multiplier;
    }
    
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * multiplier;
  });
  
  return sorted;
}

export default {
  transformProjectData,
  transformProjectList,
  getCategoryLabel,
  isValidProject,
  filterProjectsByCategory,
  sortProjects,
};
