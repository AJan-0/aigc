/**
 * Safari iPhone 视频播放修复
 * 使用方法: 在 HTML 中引入此脚本
 * <script src="safari-video-fix.js"></script>
 */

(function() {
    'use strict';
    
    // 检测环境
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isWechat = /MicroMessenger/.test(navigator.userAgent);
    
    // 如果不是 iOS Safari，不应用修复
    if (!isIOS && !isSafari) {
        console.log('[SafariFix] 非 iOS Safari，跳过修复');
        return;
    }
    
    console.log('[SafariFix] 应用 iOS Safari 视频修复');
    
    /**
     * 修复单个视频元素
     */
    function fixVideoElement(video) {
        // 如果已经处理过，跳过
        if (video.dataset.safariFixed) return;
        video.dataset.safariFixed = 'true';
        
        console.log('[SafariFix] 修复视频元素:', video.id || 'unnamed');
        
        // 1. 强制设置 playsinline 属性
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x5-playsinline', '');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'false');
        
        // 2. 禁用默认控件（使用自定义）
        video.removeAttribute('controls');
        
        // 3. 初始静音（满足自动播放策略）
        video.muted = true;
        video.volume = 1;
        video.setAttribute('muted', '');
        
        // 4. 预加载元数据
        video.setAttribute('preload', 'metadata');
        
        // 5. 创建自定义播放界面
        createCustomControls(video);
        
        // 6. 添加事件监听
        setupVideoEvents(video);
    }
    
    /**
     * 创建自定义控制界面
     */
    function createCustomControls(video) {
        const wrapper = video.parentElement;
        if (!wrapper || wrapper.classList.contains('video-fixed-wrapper')) return;
        
        wrapper.classList.add('video-fixed-wrapper');
        wrapper.style.cssText = `
            position: relative;
            overflow: hidden;
            -webkit-transform: translateZ(0);
        `;
        
        // 播放按钮
        const playButton = document.createElement('div');
        playButton.className = 'safari-play-button';
        playButton.innerHTML = `
            <div class="safari-play-icon">
                <svg viewBox="0 0 64 64" width="64" height="64">
                    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.95)"/>
                    <path d="M24 18L48 32L24 46V18Z" fill="#000"/>
                </svg>
            </div>
        `;
        playButton.style.cssText = `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 10;
            transition: opacity 0.3s;
        `;
        
        // 音频提示
        const audioHint = document.createElement('div');
        audioHint.className = 'safari-audio-hint';
        audioHint.innerHTML = '🔇 点击开启声音';
        audioHint.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 20;
            display: none;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        // 底部控制栏
        const controlsBar = document.createElement('div');
        controlsBar.className = 'safari-controls-bar';
        controlsBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            padding: 20px 12px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 15;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        
        controlsBar.innerHTML = `
            <button class="safari-btn-play" style="
                width: 32px;
                height: 32px;
                border: none;
                background: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                pointer-events: auto;
            ">▶</button>
            <div class="safari-progress" style="
                flex: 1;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                position: relative;
                pointer-events: auto;
            ">
                <div class="safari-progress-bar" style="
                    height: 100%;
                    background: #3b82f6;
                    border-radius: 2px;
                    width: 0%;
                    transition: width 0.1s;
                "></div>
            </div>
            <button class="safari-btn-mute" style="
                width: 32px;
                height: 32px;
                border: none;
                background: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
                pointer-events: auto;
            ">🔇</button>
            <button class="safari-btn-fullscreen" style="
                width: 32px;
                height: 32px;
                border: none;
                background: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
                pointer-events: auto;
            ">⛶</button>
        `;
        
        wrapper.appendChild(playButton);
        wrapper.appendChild(audioHint);
        wrapper.appendChild(controlsBar);
        
        // 点击播放
        playButton.addEventListener('click', async () => {
            try {
                // iOS 需要用户交互后才能取消静音
                video.muted = false;
                await video.play();
                
                playButton.style.opacity = '0';
                playButton.style.pointerEvents = 'none';
                controlsBar.style.opacity = '1';
                controlsBar.style.pointerEvents = 'auto';
                
            } catch (err) {
                console.error('[SafariFix] 播放失败:', err);
                
                // 降级：静音播放
                video.muted = true;
                try {
                    await video.play();
                    playButton.style.opacity = '0';
                    playButton.style.pointerEvents = 'none';
                    audioHint.style.display = 'block';
                    controlsBar.style.opacity = '1';
                    controlsBar.style.pointerEvents = 'auto';
                } catch (err2) {
                    alert('无法播放视频');
                }
            }
        });
        
        // 音频提示点击
        audioHint.addEventListener('click', async () => {
            video.muted = false;
            try {
                await video.play();
                audioHint.style.display = 'none';
            } catch (err) {
                console.error('[SafariFix] 无法开启声音:', err);
            }
        });
        
        // 控制栏按钮
        const btnPlay = controlsBar.querySelector('.safari-btn-play');
        const btnMute = controlsBar.querySelector('.safari-btn-mute');
        const btnFullscreen = controlsBar.querySelector('.safari-btn-fullscreen');
        const progressBar = controlsBar.querySelector('.safari-progress-bar');
        
        btnPlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                btnPlay.textContent = '⏸';
            } else {
                video.pause();
                btnPlay.textContent = '▶';
            }
        });
        
        btnMute.addEventListener('click', () => {
            video.muted = !video.muted;
            btnMute.textContent = video.muted ? '🔇' : '🔊';
        });
        
        btnFullscreen.addEventListener('click', () => {
            if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        });
        
        // 进度更新
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = progress + '%';
        });
        
        // 显示/隐藏控制栏
        let controlsTimeout;
        wrapper.addEventListener('click', () => {
            controlsBar.style.opacity = '1';
            controlsBar.style.pointerEvents = 'auto';
            
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (!video.paused) {
                    controlsBar.style.opacity = '0';
                    controlsBar.style.pointerEvents = 'none';
                }
            }, 3000);
        });
    }
    
    /**
     * 设置视频事件
     */
    function setupVideoEvents(video) {
        // 加载错误重试
        video.addEventListener('error', () => {
            console.error('[SafariFix] 视频错误:', video.error);
            
            if (video.error && video.error.code === 4) {
                // 格式不支持，尝试重新加载
                setTimeout(() => {
                    console.log('[SafariFix] 尝试重新加载');
                    video.load();
                }, 1000);
            }
        });
        
        // iOS 全屏事件
        video.addEventListener('webkitbeginfullscreen', () => {
            console.log('[SafariFix] 进入全屏');
        });
        
        video.addEventListener('webkitendfullscreen', () => {
            console.log('[SafariFix] 退出全屏');
            // 退出全屏后暂停
            video.pause();
            
            // 显示播放按钮
            const wrapper = video.parentElement;
            const playButton = wrapper?.querySelector('.safari-play-button');
            if (playButton) {
                playButton.style.opacity = '1';
                playButton.style.pointerEvents = 'auto';
            }
        });
        
        // 暂停时显示播放按钮
        video.addEventListener('pause', () => {
            const wrapper = video.parentElement;
            const playButton = wrapper?.querySelector('.safari-play-button');
            if (playButton && !video.ended) {
                playButton.style.opacity = '1';
                playButton.style.pointerEvents = 'auto';
            }
        });
    }
    
    /**
     * 初始化所有视频
     */
    function init() {
        // 处理现有视频
        document.querySelectorAll('video').forEach(fixVideoElement);
        
        // 监听动态添加的视频
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        fixVideoElement(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(fixVideoElement);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[SafariFix] 初始化完成');
    }
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
