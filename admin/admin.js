// ─── AIGC CMS Admin Panel ───
(function () {
  'use strict';

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://localhost:3001/api`
    : `/api`;

  // ─── State ───
  let token = localStorage.getItem('aigc_token') || null;
  let projects = [];
  let editingId = null;
  let deleteId = null;
  let currentTags = [];
  let coverFile = null;
  let videoFile = null;
  let coverPath = null;
  let videoPath = null;
  let isUploading = false;

  // ─── DOM refs ───
  const $ = (sel) => document.querySelector(sel);
  const loginView = $('#loginView');
  const dashboardView = $('#dashboardView');
  const loginForm = $('#loginForm');
  const loginError = $('#loginError');
  const projectList = $('#projectList');
  const projectCount = $('#projectCount');
  const editorModal = $('#editorModal');
  const deleteModal = $('#deleteModal');
  const projectForm = $('#projectForm');
  const toastContainer = $('#toastContainer');

  // ─── Toast ───
  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => { el.remove(); }, 3000);
  }

  // ─── API Helper ───
  async function api(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        token = null;
        localStorage.removeItem('aigc_token');
        showLogin();
      }
      throw new Error(data.error || '请求失败');
    }
    return data;
  }

  // ─── Auth ───
  async function login(username, password) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    token = data.token;
    localStorage.setItem('aigc_token', token);
    showDashboard();
  }

  function logout() {
    token = null;
    localStorage.removeItem('aigc_token');
    showLogin();
  }

  function showLogin() {
    loginView.style.display = 'flex';
    dashboardView.style.display = 'none';
  }

  async function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    await loadProjects();
  }

  // ─── Projects CRUD ───
  async function loadProjects() {
    try {
      projects = await api('/projects/admin/all');
      renderProjectList();
    } catch (e) {
      toast('加载项目失败: ' + e.message, 'error');
    }
  }

  function renderProjectList() {
    projectCount.textContent = projects.length;

    if (projects.length === 0) {
      projectList.innerHTML = `
        <div class="empty-state">
          <div class="icon">📂</div>
          <p>还没有作品，点击上方按钮添加第一个</p>
        </div>`;
      return;
    }

    projectList.innerHTML = projects.map((p, idx) => `
      <div class="project-item" draggable="true" data-id="${p.id}" data-index="${idx}">
        <div class="drag-handle" title="拖拽排序">⋮⋮</div>
        <div class="project-thumb">
          ${p.cover_path
            ? `<img src="${API_BASE.replace('/api','')}/${p.cover_path}" alt="${p.title_zh}">`
            : '🎬'}
        </div>
        <div class="project-info">
          <h3>${escapeHtml(p.title_zh)}</h3>
          <div class="meta">
            <span class="badge badge-${p.is_published ? 'published' : 'draft'}">${p.is_published ? '已发布' : '草稿'}</span>
            ${p.is_featured ? '<span class="badge badge-featured">精选</span>' : ''}
            <span>${escapeHtml(p.category)}</span>
            ${p.duration ? `<span>⏱ ${escapeHtml(p.duration)}</span>` : ''}
            ${p.video_path ? '<span>🎬 含视频</span>' : ''}
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-sm btn-secondary" onclick="adminApp.editProject(${p.id})">编辑</button>
          <button class="btn btn-sm btn-danger" onclick="adminApp.confirmDelete(${p.id}, '${escapeHtml(p.title_zh)}')">删除</button>
        </div>
      </div>
    `).join('');

    initDragAndDrop();
  }

  // ─── Drag & Drop Sort ───
  function initDragAndDrop() {
    const items = projectList.querySelectorAll('.project-item');
    let dragEl = null;

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        dragEl = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.id);
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        dragEl = null;
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      item.addEventListener('drop', async (e) => {
        e.preventDefault();
        if (!dragEl || dragEl === item) return;

        const fromId = parseInt(dragEl.dataset.id);
        const toIdx = parseInt(item.dataset.index);
        const fromIdx = parseInt(dragEl.dataset.index);

        // Reorder in local array
        const [moved] = projects.splice(fromIdx, 1);
        projects.splice(toIdx, 0, moved);

        // Send new order to server
        const order = projects.map((p, i) => ({ id: p.id, sort_order: i }));
        try {
          await api('/projects/reorder', {
            method: 'POST',
            body: JSON.stringify({ order })
          });
          renderProjectList();
          toast('排序已更新', 'success');
        } catch (e) {
          toast('排序更新失败: ' + e.message, 'error');
          await loadProjects();
        }
      });
    });
  }

  // ─── Editor Modal ───
  function openEditor(project = null) {
    editingId = project ? project.id : null;
    currentTags = project ? [...(project.tags || [])] : [];
    coverFile = null;
    videoFile = null;
    coverPath = project?.cover_path || null;
    videoPath = project?.video_path || null;

    $('#editorTitle').textContent = project ? '编辑作品' : '新建作品';
    $('#editProjectId').value = project?.id || '';
    $('#fTitleZh').value = project?.title_zh || '';
    $('#fTitleEn').value = project?.title_en || '';
    $('#fCategory').value = project?.category || 'video';
    $('#fDuration').value = project?.duration || '';
    $('#fDescription').value = project?.description || '';
    $('#fPublished').checked = project ? !!project.is_published : true;
    $('#fFeatured').checked = project ? !!project.is_featured : false;

    renderTags();
    updateCoverPreview();
    updateVideoPreview();

    // Reset upload progress
    $('#videoProgress').classList.remove('active');
    $('#progressFill').style.width = '0%';

    editorModal.classList.add('active');
  }

  function closeEditorModal() {
    editorModal.classList.remove('active');
    editingId = null;
  }

  function renderTags() {
    const container = $('#tagsContainer');
    const input = $('#tagInput');
    container.innerHTML = '';
    currentTags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${escapeHtml(tag)} <span class="remove" data-index="${i}">×</span>`;
      container.appendChild(chip);
    });
    container.appendChild(input);
  }

  function updateCoverPreview() {
    const fileInfo = $('#coverFileInfo');
    const fileName = $('#coverFileName');
    if (coverFile) {
      fileInfo.classList.add('active');
      fileName.textContent = `📎 ${coverFile.name} (${formatSize(coverFile.size)})`;
    } else if (coverPath) {
      fileInfo.classList.add('active');
      fileName.textContent = `✅ 已上传: ${coverPath.split('/').pop()}`;
    } else {
      fileInfo.classList.remove('active');
    }
  }

  function updateVideoPreview() {
    const fileInfo = $('#videoFileInfo');
    const fileName = $('#videoFileName');
    if (videoFile) {
      fileInfo.classList.add('active');
      fileName.textContent = `📎 ${videoFile.name} (${formatSize(videoFile.size)})`;
    } else if (videoPath) {
      fileInfo.classList.add('active');
      fileName.textContent = `✅ 已上传: ${videoPath.split('/').pop()}`;
    } else {
      fileInfo.classList.remove('active');
    }
  }

  // ─── File Upload Handlers ───
  function handleCoverSelect(file) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast('封面图不能超过 15MB', 'error');
      return;
    }
    coverFile = file;
    updateCoverPreview();
  }

  function handleVideoSelect(file) {
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      toast('视频不能超过 500MB', 'error');
      return;
    }
    videoFile = file;
    updateVideoPreview();
  }

  // ─── Chunked Video Upload ───
  async function uploadVideo(file) {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // Step 1: Init upload
    const initData = await api('/upload/init', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        totalChunks,
        totalSize: file.size
      })
    });

    const { uploadId } = initData;
    const progressEl = $('#videoProgress');
    const progressFill = $('#progressFill');
    const progressText = $('#progressText');

    progressEl.classList.add('active');
    isUploading = true;

    // Step 2: Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk, `chunk_${i}`);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());

      const res = await fetch(`${API_BASE}/upload/chunk`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `分块 ${i} 上传失败`);
      }

      const pct = Math.round(((i + 1) / totalChunks) * 100);
      progressFill.style.width = `${pct}%`;
      progressText.textContent = `上传中... ${pct}% (${i + 1}/${totalChunks})`;
    }

    // Step 3: Complete upload
    progressText.textContent = '合并文件中...';
    const completeData = await api('/upload/complete', {
      method: 'POST',
      body: JSON.stringify({
        uploadId,
        filename: file.name,
        totalChunks
      })
    });

    isUploading = false;
    progressText.textContent = '上传完成!';
    setTimeout(() => progressEl.classList.remove('active'), 2000);

    return completeData.path;
  }

  // ─── Cover Upload (simple) ───
  async function uploadCover(file) {
    const formData = new FormData();
    formData.append('cover', file);

    const res = await fetch(`${API_BASE}/upload/cover`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '封面上传失败');
    }

    return (await res.json()).path;
  }

  // ─── Save Project ───
  async function saveProject() {
    const titleZh = $('#fTitleZh').value.trim();
    if (!titleZh) {
      toast('标题不能为空', 'error');
      return;
    }

    if (isUploading) {
      toast('视频正在上传中，请等待完成', 'error');
      return;
    }

    try {
      // Upload files if new ones selected
      if (coverFile) {
        toast('上传封面中...', 'info');
        coverPath = await uploadCover(coverFile);
      }
      if (videoFile) {
        toast('开始上传视频...', 'info');
        videoPath = await uploadVideo(videoFile);
      }

      const payload = {
        title_zh: titleZh,
        title_en: $('#fTitleEn').value.trim() || null,
        category: $('#fCategory').value,
        description: $('#fDescription').value.trim() || null,
        duration: $('#fDuration').value.trim() || null,
        tags: currentTags,
        cover_path: coverPath,
        video_path: videoPath,
        video_type: videoFile ? videoFile.name.split('.').pop() : 'mp4',
        is_published: $('#fPublished').checked ? 1 : 0,
        is_featured: $('#fFeatured').checked ? 1 : 0,
        sort_order: editingId ? projects.find(p => p.id === editingId)?.sort_order ?? 0 : projects.length
      };

      if (editingId) {
        await api(`/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast('作品已更新', 'success');
      } else {
        await api('/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('作品已创建', 'success');
      }

      closeEditorModal();
      await loadProjects();
    } catch (e) {
      toast('保存失败: ' + e.message, 'error');
    }
  }

  // ─── Delete Project ───
  function confirmDelete(id, name) {
    deleteId = id;
    $('#deleteProjectName').textContent = name;
    deleteModal.classList.add('active');
  }

  async function doDelete() {
    if (!deleteId) return;
    try {
      await api(`/projects/${deleteId}`, { method: 'DELETE' });
      toast('已删除', 'success');
      deleteModal.classList.remove('active');
      deleteId = null;
      await loadProjects();
    } catch (e) {
      toast('删除失败: ' + e.message, 'error');
    }
  }

  // ─── Helpers ───
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }

  // ─── Event Bindings ───
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    try {
      await login($('#loginUsername').value, $('#loginPassword').value);
    } catch (err) {
      loginError.textContent = err.message;
      loginError.style.display = 'block';
    }
  });

  $('#logoutBtn').addEventListener('click', logout);
  $('#addProjectBtn').addEventListener('click', () => openEditor());
  $('#closeEditor').addEventListener('click', closeEditorModal);
  $('#cancelEditor').addEventListener('click', closeEditorModal);
  $('#saveProject').addEventListener('click', saveProject);
  $('#closeDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
  $('#cancelDelete').addEventListener('click', () => deleteModal.classList.remove('active'));
  $('#confirmDelete').addEventListener('click', doDelete);

  // Tags input
  $('#tagInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !currentTags.includes(val)) {
        currentTags.push(val);
        renderTags();
        e.target.value = '';
      }
    }
  });

  $('#tagsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
      const idx = parseInt(e.target.dataset.index);
      currentTags.splice(idx, 1);
      renderTags();
    }
  });

  // File inputs
  $('#coverFileInput').addEventListener('change', (e) => handleCoverSelect(e.target.files[0]));
  $('#videoFileInput').addEventListener('change', (e) => handleVideoSelect(e.target.files[0]));

  // Drag & drop on upload areas
  ['coverUploadArea', 'videoUploadArea'].forEach(id => {
    const area = $(`#${id}`);
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (id === 'coverUploadArea') handleCoverSelect(file);
      else handleVideoSelect(file);
    });
  });

  // Remove file buttons
  $('#removeCover').addEventListener('click', () => {
    coverFile = null;
    coverPath = null;
    $('#coverFileInput').value = '';
    updateCoverPreview();
  });

  $('#removeVideo').addEventListener('click', () => {
    videoFile = null;
    videoPath = null;
    $('#videoFileInput').value = '';
    updateVideoPreview();
  });

  // Close modals on overlay click
  [editorModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      editorModal.classList.remove('active');
      deleteModal.classList.remove('active');
    }
  });

  // ─── Expose for inline onclick handlers ───
  window.adminApp = {
    editProject: async (id) => {
      try {
        const project = await api(`/projects/${id}`);
        openEditor(project);
      } catch (e) {
        toast('加载项目失败: ' + e.message, 'error');
      }
    },
    confirmDelete
  };

  // ─── Init ───
  if (token) {
    api('/auth/verify').then(() => showDashboard()).catch(() => showLogin());
  } else {
    showLogin();
  }

})();
