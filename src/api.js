// ─── AIGC Portfolio API Client ───
// Fetches project data from the CMS backend

const API_BASE = (() => {
  // In production, API is on a separate server
  // In dev, Vite proxies to localhost:3001
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  // Production: set your backend URL here or use environment variable
  return window.API_URL || '/api';
})();

let cachedProjects = null;

export async function fetchProjects(options = {}) {
  const { category, featured, force = false } = options;

  if (cachedProjects && !force && !category && !featured) {
    return cachedProjects;
  }

  try {
    let url = `${API_BASE}/projects`;
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (featured) params.set('featured', '1');
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const projects = await res.json();

    // Transform for frontend compatibility
    const transformed = projects.map(p => ({
      id: p.id.toString(),
      title: p.title_zh,
      titleEn: p.title_en,
      category: getCategoryLabel(p.category),
      categoryKey: p.category,
      description: p.description || '',
      image: p.cover_path ? `/${p.cover_path}` : null,
      videoUrl: p.video_path ? `/${p.video_path}` : null,
      videoType: p.video_type || 'mp4',
      isVideo: !!p.video_path,
      tags: p.tags || [],
      link: `/project.html?id=${p.id}`,
      duration: p.duration,
      isFeatured: !!p.is_featured
    }));

    if (!category && !featured) {
      cachedProjects = transformed;
    }

    return transformed;
  } catch (err) {
    console.error('[API] Failed to fetch projects:', err);
    // Return empty array on error, frontend should handle gracefully
    return [];
  }
}

export async function fetchProject(id) {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const p = await res.json();

    return {
      id: p.id.toString(),
      title: p.title_zh,
      titleEn: p.title_en,
      category: getCategoryLabel(p.category),
      categoryKey: p.category,
      description: p.description || '',
      image: p.cover_path ? `/${p.cover_path}` : null,
      videoUrl: p.video_path ? `/${p.video_path}` : null,
      videoType: p.video_type || 'mp4',
      isVideo: !!p.video_path,
      tags: p.tags || [],
      duration: p.duration,
      isFeatured: !!p.is_featured
    };
  } catch (err) {
    console.error('[API] Failed to fetch project:', err);
    return null;
  }
}

function getCategoryLabel(key) {
  const labels = {
    architecture: 'ARCHITECTURE VISUALIZATION',
    animation: 'ANIMATION',
    video: 'VIDEO SHOWCASE'
  };
  return labels[key] || key.toUpperCase();
}

export function clearCache() {
  cachedProjects = null;
}
