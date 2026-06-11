// ============================================
// AIGC CMS - Admin Panel (Supabase)
// ============================================

let currentSession = null;
let projects = [];
let editingId = null;
let tags = [];

const sb = window.supabaseClient;

// ─── Init ───
document.addEventListener('DOMContentLoaded', async () => {
  if (!sb) {
    document.querySelector('.login-card').innerHTML =
      '<h2>⚠️ 未配置</h2><p style="color:#f87171;margin:1rem 0">请先设置 src/config.js 中的 Supabase 凭证</p>';
    return;
  }

  const { data: { session } } = await sb.auth.getSession();
  if (session) { currentSession = session; showDashboard(); }

  // Event bindings
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('addProjectBtn').addEventListener('click', openCreateModal);
  document.getElementById('closeEditor').addEventListener('click', closeModal);
  document.getElementById('cancelEditor').addEventListener('click', closeModal);
  document.getElementById('saveProject').addEventListener('click', saveProject);
  document.getElementById('closeDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDelete').addEventListener('click', doDelete);
  document.getElementById('tagInput').addEventListener('keydown', handleTagInput);

  // File inputs
  document.getElementById('coverFileInput').addEventListener('change', handleCoverSelect);
  document.getElementById('videoFileInput').addEventListener('change', handleVideoSelect);
  document.getElementById('removeCover').addEventListener('click', () => {
    document.getElementById('coverFileInput').value = '';
    document.getElementById('coverFileInfo').style.display = 'none';
  });
  document.getElementById('removeVideo').addEventListener('click', () => {
    document.getElementById('videoFileInput').value = '';
    document.getElementById('videoFileInfo').style.display = 'none';
    document.getElementById('videoProgress').style.display = 'none';
  });

  // Drag & drop for upload areas
  setupDragDrop('coverUploadArea', 'coverFileInput');
  setupDragDrop('videoUploadArea', 'videoFileInput');
});

function setupDragDrop(areaId, inputId) {
  const area = document.getElementById(areaId);
  if (!area) return;
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault(); area.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      document.getElementById(inputId).files = e.dataTransfer.files;
      document.getElementById(inputId).dispatchEvent(new Event('change'));
    }
  });
}

// ─── Auth ───
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentSession = data.session;
    showDashboard();
    showToast('登录成功');
  } catch (err) {
    errEl.textContent = '登录失败: ' + err.message;
    errEl.style.display = 'block';
  }
}

async function handleLogout() {
  await sb.auth.signOut();
  currentSession = null;
  document.getElementById('dashboardView').style.display = 'none';
  document.getElementById('loginView').style.display = 'flex';
}

// ─── Views ───
function showDashboard() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';
  loadProjects();
}

// ─── Projects ───
async function loadProjects() {
  try {
    const { data, error } = await sb.from('projects').select('*').order('sort_order');
    if (error) throw error;
    projects = data || [];
    renderProjectList();
    document.getElementById('projectCount').textContent = projects.length;
  } catch (err) {
    showToast('加载失败: ' + err.message, 'error');
  }
}

function renderProjectList() {
  const container = document.getElementById('projectList');
  if (!projects.length) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📂</div><p>还没有作品，点击上方按钮添加第一个</p></div>';
    return;
  }
  container.innerHTML = projects.map(p => {
    const t = parseTags(p.tags);
    return `
      <div class="project-item" data-id="${p.id}">
        <div class="project-thumb">
          ${p.cover_url ? `<img src="${p.cover_url}" alt="">` : '<div class="no-thumb">🎬</div>'}
        </div>
        <div class="project-info">
          <h3>${esc(p.title_zh)}</h3>
          <span class="project-cat">${p.category}</span>
          ${t.map(x => `<span class="tag">${esc(x)}</span>`).join('')}
          ${!p.is_published ? '<span class="draft-badge">草稿</span>' : ''}
        </div>
        <div class="project-actions">
          <button class="btn-icon" onclick="editProject(${p.id})" title="编辑">✏️</button>
          <button class="btn-icon btn-danger" onclick="confirmDeleteProject(${p.id})" title="删除">🗑️</button>
        </div>
      </div>`;
  }).join('');
}

// ─── Modal ───
function openCreateModal() {
  editingId = null;
  tags = [];
  document.getElementById('editorTitle').textContent = '新建作品';
  document.getElementById('projectForm').reset();
  renderTags();
  clearFilePreviews();
  document.getElementById('editorModal').style.display = 'flex';
}

async function editProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('editorTitle').textContent = '编辑作品';
  document.getElementById('fTitleZh').value = p.title_zh || '';
  document.getElementById('fTitleEn').value = p.title_en || '';
  document.getElementById('fCategory').value = p.category || 'video';
  document.getElementById('fDuration').value = p.duration || '';
  document.getElementById('fDescription').value = p.description || '';
  document.getElementById('fPublished').checked = p.is_published;
  document.getElementById('fFeatured').checked = p.is_featured;
  tags = parseTags(p.tags);
  renderTags();
  clearFilePreviews();
  if (p.cover_url) document.getElementById('coverFileName').textContent = '当前: ' + p.cover_url.split('/').pop();
  if (p.video_url) document.getElementById('videoFileName').textContent = '当前: ' + p.video_url.split('/').pop();
  document.getElementById('editorModal').style.display = 'flex';
}

function closeModal() { document.getElementById('editorModal').style.display = 'none'; editingId = null; }

function clearFilePreviews() {
  ['coverFileInfo', 'videoFileInfo'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('videoProgress').style.display = 'none';
  document.getElementById('coverFileInput').value = '';
  document.getElementById('videoFileInput').value = '';
}

// ─── Tags ───
function handleTagInput(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const val = e.target.value.trim();
  if (val && !tags.includes(val)) { tags.push(val); renderTags(); }
  e.target.value = '';
}

function renderTags() {
  const container = document.getElementById('tagsContainer');
  const input = document.getElementById('tagInput');
  container.querySelectorAll('.tag-chip').forEach(el => el.remove());
  tags.forEach((t, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${esc(t)} <span onclick="removeTag(${i})">&times;</span>`;
    container.insertBefore(chip, input);
  });
}

function removeTag(i) { tags.splice(i, 1); renderTags(); }

// ─── File Select ───
function handleCoverSelect(e) {
  if (e.target.files[0]) {
    document.getElementById('coverFileName').textContent = e.target.files[0].name;
    document.getElementById('coverFileInfo').style.display = 'flex';
  }
}

function handleVideoSelect(e) {
  if (e.target.files[0]) {
    document.getElementById('videoFileName').textContent = e.target.files[0].name;
    document.getElementById('videoFileInfo').style.display = 'flex';
  }
}

// ─── Save ───
async function saveProject() {
  const titleZh = document.getElementById('fTitleZh').value.trim();
  if (!titleZh) { showToast('请输入中文标题', 'error'); return; }

  const data = {
    title_zh: titleZh,
    title_en: document.getElementById('fTitleEn').value.trim() || null,
    category: document.getElementById('fCategory').value,
    description: document.getElementById('fDescription').value.trim() || null,
    duration: document.getElementById('fDuration').value.trim() || null,
    tags: JSON.stringify(tags),
    is_published: document.getElementById('fPublished').checked,
    is_featured: document.getElementById('fFeatured').checked,
    updated_at: new Date().toISOString()
  };

  // Upload cover
  const coverFile = document.getElementById('coverFileInput').files[0];
  if (coverFile) {
    try { data.cover_url = await uploadFile('covers', coverFile); }
    catch (err) { showToast('封面上传失败: ' + err.message, 'error'); return; }
  }

  // Upload video
  const videoFile = document.getElementById('videoFileInput').files[0];
  if (videoFile) {
    try {
      showToast('正在上传视频...', 'info');
      document.getElementById('videoProgress').style.display = 'block';
      data.video_url = await uploadFile('videos', videoFile, (pct) => {
        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('progressText').textContent = pct + '%';
      });
      data.video_type = videoFile.name.endsWith('.webm') ? 'webm' : 'mp4';
    } catch (err) {
      showToast('视频上传失败: ' + err.message, 'error');
      return;
    }
  }

  try {
    if (editingId) {
      const { error } = await sb.from('projects').update(data).eq('id', editingId);
      if (error) throw error;
      showToast('已更新');
    } else {
      data.sort_order = projects.length;
      data.created_at = new Date().toISOString();
      const { error } = await sb.from('projects').insert(data);
      if (error) throw error;
      showToast('已创建');
    }
    closeModal();
    loadProjects();
  } catch (err) {
    showToast('保存失败: ' + err.message, 'error');
  }
}

async function uploadFile(bucket, file, onProgress) {
  const name = `${Date.now()}-${file.name}`;
  const { error } = await sb.storage.from(bucket).upload(name, file, {
    onUploadProgress: onProgress ? (ev) => onProgress(Math.round(ev.loaded / ev.total * 100)) : undefined
  });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}

// ─── Delete ───
let deleteTargetId = null;

function confirmDeleteProject(id) {
  deleteTargetId = id;
  const p = projects.find(x => x.id === id);
  document.getElementById('deleteProjectName').textContent = p ? p.title_zh : '';
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() { document.getElementById('deleteModal').style.display = 'none'; deleteTargetId = null; }

async function doDelete() {
  if (!deleteTargetId) return;
  try {
    const { error } = await sb.from('projects').delete().eq('id', deleteTargetId);
    if (error) throw error;
    showToast('已删除');
    closeDeleteModal();
    loadProjects();
  } catch (err) {
    showToast('删除失败: ' + err.message, 'error');
  }
}

// ─── Utils ───
function parseTags(t) { return Array.isArray(t) ? t : (typeof t === 'string' ? (() => { try { return JSON.parse(t); } catch { return []; } })() : []); }
function esc(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
