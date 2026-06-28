# Poetfolio - AI 影像作品集

现代化、高性能的 AI 影像作品集网站，采用模块化架构和高级交互设计。

## ✨ 特性

### 🎨 视觉设计
- **电影风格美学**：受胶片摄影启发的暗色调设计
- **高级排版系统**：8 级层次结构，优化可读性
- **玻璃拟态效果**：现代 UI 元素与深度感
- **动态背景**：环境光效和视差效果

### 🎯 交互体验
- **磁性光标**：光标被交互元素吸引，增强反馈
- **3D 卡片倾斜**：根据鼠标位置的实时 3D 旋转
- **滚动动画**：平滑的视差和揭示效果
- **响应式设计**：桌面和移动端优化

### ⚡ 性能优化
- **代码分割**：按需加载组件
- **懒加载**：图片和组件延迟加载
- **GPU 加速**：CSS 变换优化
- **Bundle 优化**：独立的 vendor chunks

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── navigation/     # 导航栏
│   ├── hero/           # 英雄区
│   ├── portfolio/      # 作品集展示
│   ├── profile/        # 个人简介
│   ├── method/         # 工作方法
│   ├── footer/         # 页脚
│   └── ui/             # UI 组件（加载屏幕、光标等）
├── hooks/              # 自定义 React Hooks
│   ├── useCustomCursor.js      # 磁性光标
│   ├── useScrollAnimations.js  # 滚动动画
│   ├── useVideoModal.js        # 视频模态框
│   └── useCardTilt.js          # 3D 卡片倾斜
├── styles/             # CSS 模块
│   ├── base.css               # 基础样式
│   ├── typography.css         # 排版系统
│   ├── animations.css         # 动画效果
│   ├── index.css              # 主样式入口
│   └── components/            # 组件样式
├── utils/              # 工具函数
│   └── helpers.js             # 辅助函数
├── App.jsx             # 根组件
└── main.jsx            # 应用入口
```

## 🎨 设计系统

### 颜色
- **Flame Orange**: `#ff4d00` - 主要强调色
- **Ice Cyan**: `#00f0ff` - 次要强调色
- **Gold**: `#ffd700` - 装饰色
- **暗色背景**: 渐变从 `#050505` 到 `#080711`

### 排版
- **Display 字体**: Syne - 用于标题
- **Body 字体**: Manrope - 用于正文
- **8 级层次**: 从 Hero Mega 到 Caption

### 间距
- 基于 8px 网格系统
- 使用 clamp() 实现响应式间距

## 🔧 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Framer Motion** - 动画库
- **Tailwind CSS** - 样式框架
- **PostCSS** - CSS 处理

## 📱 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 🎯 交互特性

### 磁性光标
光标会被标记为 `.magnetic` 的元素吸引，创造流畅的交互体验。

### 3D 卡片效果
作品卡片根据鼠标位置进行 3D 旋转，增强深度感。

### 滚动揭示
元素在进入视口时触发动画，使用 Intersection Observer 优化性能。

### 视差效果
多层元素以不同速度滚动，创造立体感。

## 📝 待办事项

- [ ] 添加视频模态框组件
- [ ] 实现完整的作品详情页
- [ ] 添加深色/浅色主题切换
- [ ] 优化移动端交互体验
- [ ] 添加更多作品展示

## 📄 License

MIT License

---

**创建者**: AJan  
**更新时间**: 2026-06-29
