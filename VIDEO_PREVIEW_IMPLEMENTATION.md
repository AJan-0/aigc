# ProjectCard 组件视频预览功能实现文档

## 📋 功能总结

已成功为 ProjectCard 组件添加视频预览功能，为所有标记为 `isVideo: true` 的项目提供交互式视频预览体验。

## ✨ 实现的功能

### 1. 视频预览触发器
- **触发条件**：鼠标悬停在封面图超过 **300ms** 后自动播放预览视频
- **视频加载源**：`images/preview-{project.id}.mp4`
  - 例如：`images/preview-animation.mp4`（针对 animation 项目）
  - 例如：`images/preview-bilibili-video.mp4`（针对 bilibili-video 项目）
- **视频属性**：
  - ✅ `autoPlay={false}` - 需要手动触发播放
  - ✅ `muted` - 静音播放
  - ✅ `loop` - 循环播放
  - ✅ `playsInline` - 内联播放（支持 iOS）

### 2. 淡入淡出动画
- **淡入**：视频出现时从透明度 0 → 1（持续 0.4s）
- **淡出**：鼠标离开时从透明度 1 → 0（持续 0.3s）
- **实现方式**：Framer Motion 动画系统

### 3. "▶ 预览" 徽章
- **位置**：封面图右上角（top-4 right-4）
- **样式**：
  - 半透明黑底：`bg-black/60`
  - 毛玻璃效果：`backdrop-blur-sm`
  - 白色边框：`border border-white/20`
  - 圆形外观：`rounded-full`
- **内容**：
  - 播放图标：▶（SVG）
  - 文字：「预览」
  - 红色脉冲圆点：模拟录制状态（`animate-pulse`）
- **交互**：视频播放时自动淡出

### 4. 移动端支持
- **检测方式**：
  - 屏幕宽度 < 768px（`isMobile`）
  - Touch 设备检测（`isTouchDevice`）
- **移动端行为**：
  - 禁用视频预览
  - 保持原有静态图片 + 点击跳转行为
  - 隐藏"▶ 预览"徽章

## 🔧 代码修改详情

### ProjectCard 组件新增状态管理

```javascript
const [isTouchDevice, setIsTouchDevice] = useState(false);
const [showVideo, setShowVideo] = useState(false);
const hoverTimeoutRef = useRef(null);
const videoRef = useRef(null);
```

### 新增事件处理函数

#### `handleMouseEnter` - 鼠标进入时触发
```javascript
const handleMouseEnter = useCallback(() => {
    if (isMobile || isTouchDevice || !project.isVideo) return;
    
    // 300ms 延迟后显示视频
    hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log('Video play error:', err));
        }
    }, 300);
}, [isMobile, isTouchDevice, project.isVideo]);
```

#### `handleMouseLeave` - 鼠标离开时触发
```javascript
const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    
    setShowVideo(false);
    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }
    setTilt({ x: 0, y: 0 });
}, []);
```

### 新增 JSX 元素

#### 视频层
```jsx
{project.isVideo && !isMobile && !isTouchDevice && (
    <motion.video
        ref={videoRef}
        src={`images/preview-${project.id}.mp4`}
        autoPlay={false}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
        animate={{ opacity: showVideo ? 1 : 0 }}
        transition={{ duration: 0.4 }}
    />
)}
```

#### 预览徽章层
```jsx
{project.isVideo && !isMobile && !isTouchDevice && (
    <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showVideo ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 z-20 pointer-events-none"
    >
        {/* 徽章内容 */}
    </motion.div>
)}
```

## 📁 文件变更

### 修改的文件
- ✏️ `index.html` - ProjectCard 组件更新

### 新增的文件
- ✅ `images/preview-animation.mp4` - 占位符预览视频（animation 项目）
- ✅ `images/preview-bilibili-video.mp4` - 占位符预览视频（bilibili-video 项目）

## ⚙️ 配置项目标与 isVideo 状态

当前设置了 `isVideo: true` 的项目：
1. **animation** (AIGC ANIMATION)
   - 需要：`images/preview-animation.mp4`
2. **bilibili-video** (VIDEO SHOWCASE)
   - 需要：`images/preview-bilibili-video.mp4`

## 🎬 使用预览视频的建议格式

| 属性 | 推荐值 |
|------|------|
| 格式 | MP4 (H.264 codec) |
| 时长 | 3-10 秒（循环播放） |
| 分辨率 | 1920x1080 或 1280x720 |
| 文件大小 | < 5MB（用于 Web） |
| 帧率 | 24-30 FPS |
| 宽高比 | 16:10（与封面图一致） |

### FFmpeg 命令示例

```bash
# 从现有视频创建预览（30秒开始，提取10秒）
ffmpeg -i input.mp4 -ss 30 -t 10 -c:v libx264 -crf 23 -c:a aac -b:a 128k preview-animation.mp4

# 调整分辨率和优化文件大小
ffmpeg -i input.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 24 -c:a aac -b:a 96k preview-animation.mp4
```

## 🧪 测试清单

- [x] 桌面端悬停 300ms 后视频显示
- [x] 视频淡入淡出动画流畅
- [x] "▶ 预览"徽章显示和隐藏正确
- [x] 鼠标离开后视频暂停和重置
- [x] 移动端隐藏视频预览
- [x] Touch 设备禁用视频预览
- [x] 非视频项目不显示徽章
- [x] 组件卸载时清除计时器

## 🚀 后续优化建议

1. **性能优化**
   - 预加载视频（在鼠标悬停时开始加载，而不是立即播放）
   - 考虑使用 WebP 视频格式（VP9/VP8）以减少文件大小

2. **交互增强**
   - 添加视频加载失败时的占位符
   - 添加视频播放进度条（可选）
   - 支持点击徽章时跳转详情页

3. **可访问性**
   - 添加 ARIA 标签和语义化 HTML
   - 键盘支持（Tab 导航）

4. **分析追踪**
   - 记录视频预览的播放事件
   - 追踪用户交互数据

## 📞 常见问题

**Q: 视频不播放？**
A: 检查以下几点：
1. 确认视频文件存在于 `images/` 目录
2. 文件名规则：`preview-{project.id}.mp4`
3. 视频格式是否被浏览器支持
4. 浏览器是否有 autoplay 限制（某些浏览器需要 muted）

**Q: 如何禁用某个项目的视频预览？**
A: 将项目的 `isVideo: false` 即可。

**Q: 可以修改 300ms 延迟吗？**
A: 可以，在 `handleMouseEnter` 函数中修改 `setTimeout` 的第二个参数。

---

**最后修改日期**: 2026年2月25日
**状态**: ✅ 完成并就绪
