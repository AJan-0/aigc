/**
 * ============================================
 * 国际化配置和翻译
 * ============================================
 * 集中管理所有 i18n 翻译文本
 */

export const I18N = {
  zh: {
    // 导航
    navProjects: "项目",
    navAbout: "关于",
    navContact: "联系",
    
    // Hero 部分
    heroEyebrow: "AI CREATIVE PORTFOLIO",
    heroTitle: "电影级视觉表达，服务商业叙事",
    heroSub: "聚焦建筑可视化、动画短片与品牌视频，用 AIGC 提升速度、质感与转化效率。",
    heroCtaPrimary: "查看项目",
    heroCtaSecondary: "联系合作",
    
    // 项目部分
    projectsTitle: "精选项目",
    projectsSub: "Bento Grid + 分类筛选，快速查看不同类型产出。",
    filterAll: "全部",
    filterArchitecture: "建筑可视化",
    filterAnimation: "动画短片",
    filterVideo: "品牌视频",
    
    // 方法论部分
    aboutTitle: "方法论",
    aboutItem1Title: "叙事优先",
    aboutItem1Text: "先定义商业目标与受众情绪，再构建镜头语言与视觉层次。",
    aboutItem2Title: "流程复用",
    aboutItem2Text: "将 AI 生成、合成、调色流程模块化，提升跨项目交付速度。",
    aboutItem3Title: "结果导向",
    aboutItem3Text: "以传播效果和业务转化为标准，持续优化内容表现力。",
    
    // 联系部分
    contactTitle: "联系我",
    contactSub: "可直接接入 Formspree / EmailJS，无需后端。",
    formName: "姓名",
    formEmail: "邮箱",
    formMessage: "需求内容",
    formNamePh: "你的名字",
    formEmailPh: "your@email.com",
    formMessagePh: "项目背景、预算和周期",
    formSubmit: "发送消息",
    
    // 页脚
    footerTagline: "AI 驱动视觉叙事，直接服务商业结果。",
    
    // 预览和详情
    preview: "预览",
    detail: "查看详情",
    
    // 表单反馈
    formNeedConfig: "请先配置 Formspree action 或 EmailJS 参数。",
    formSending: "发送中...",
    formSent: "发送成功，我会尽快回复你。",
    formError: "发送失败，请稍后重试或直接邮件联系。"
  },
  
  en: {
    // Navigation
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",
    
    // Hero Section
    heroEyebrow: "AI CREATIVE PORTFOLIO",
    heroTitle: "Cinematic visuals for business storytelling",
    heroSub: "Focused on architecture visualization, animation shorts, and brand videos powered by AIGC workflows.",
    heroCtaPrimary: "View Projects",
    heroCtaSecondary: "Get in Touch",
    
    // Projects Section
    projectsTitle: "Featured Projects",
    projectsSub: "Bento Grid with animated filters for fast content discovery.",
    filterAll: "All",
    filterArchitecture: "Architecture",
    filterAnimation: "Animation",
    filterVideo: "Brand Video",
    
    // Methodology Section
    aboutTitle: "Methodology",
    aboutItem1Title: "Narrative First",
    aboutItem1Text: "Define business goal and audience emotion before visual execution.",
    aboutItem2Title: "Reusable Pipeline",
    aboutItem2Text: "Modularize generation, compositing and grading for faster delivery.",
    aboutItem3Title: "Outcome Driven",
    aboutItem3Text: "Optimize for communication impact and business conversion.",
    
    // Contact Section
    contactTitle: "Contact",
    contactSub: "Use Formspree or EmailJS with no backend service.",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Project Brief",
    formNamePh: "Your name",
    formEmailPh: "your@email.com",
    formMessagePh: "Background, budget and timeline",
    formSubmit: "Send",
    
    // Footer
    footerTagline: "AI-powered visual storytelling for real business outcomes.",
    
    // Preview and Details
    preview: "Preview",
    detail: "Open Detail",
    
    // Form Feedback
    formNeedConfig: "Please configure Formspree action or EmailJS settings.",
    formSending: "Sending...",
    formSent: "Message sent. I will reply soon.",
    formError: "Failed to send. Please retry or email directly."
  }
};

/**
 * 翻译 helper 函数
 * @param {string} currentLang - 当前语言
 * @param {string} key - 翻译键
 * @returns {string} 翻译文本或键本身
 */
export function translate(currentLang, key) {
  return I18N[currentLang]?.[key] ?? key;
}

export default I18N;
