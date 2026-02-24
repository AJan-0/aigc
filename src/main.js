const I18N = {
  zh: {
    navProjects: "项目",
    navAbout: "关于",
    navContact: "联系",
    heroEyebrow: "AI CREATIVE PORTFOLIO",
    heroTitle: "电影级视觉表达，服务商业叙事",
    heroSub: "聚焦建筑可视化、动画短片与品牌视频，用 AIGC 提升速度、质感与转化效率。",
    heroCtaPrimary: "查看项目",
    heroCtaSecondary: "联系合作",
    projectsTitle: "精选项目",
    projectsSub: "Bento Grid + 分类筛选，快速查看不同类型产出。",
    filterAll: "全部",
    filterArchitecture: "建筑可视化",
    filterAnimation: "动画短片",
    filterVideo: "品牌视频",
    aboutTitle: "方法论",
    aboutItem1Title: "叙事优先",
    aboutItem1Text: "先定义商业目标与受众情绪，再构建镜头语言与视觉层次。",
    aboutItem2Title: "流程复用",
    aboutItem2Text: "将 AI 生成、合成、调色流程模块化，提升跨项目交付速度。",
    aboutItem3Title: "结果导向",
    aboutItem3Text: "以传播效果和业务转化为标准，持续优化内容表现力。",
    contactTitle: "联系我",
    contactSub: "可直接接入 Formspree / EmailJS，无需后端。",
    formName: "姓名",
    formEmail: "邮箱",
    formMessage: "需求内容",
    formNamePh: "你的名字",
    formEmailPh: "your@email.com",
    formMessagePh: "项目背景、预算和周期",
    formSubmit: "发送消息",
    footerTagline: "AI 驱动视觉叙事，直接服务商业结果。",
    preview: "预览",
    detail: "查看详情",
    formNeedConfig: "请先配置 Formspree action 或 EmailJS 参数。",
    formSending: "发送中...",
    formSent: "发送成功，我会尽快回复你。",
    formError: "发送失败，请稍后重试或直接邮件联系。"
  },
  en: {
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",
    heroEyebrow: "AI CREATIVE PORTFOLIO",
    heroTitle: "Cinematic visuals for business storytelling",
    heroSub: "Focused on architecture visualization, animation shorts, and brand videos powered by AIGC workflows.",
    heroCtaPrimary: "View Projects",
    heroCtaSecondary: "Get in Touch",
    projectsTitle: "Featured Projects",
    projectsSub: "Bento Grid with animated filters for fast content discovery.",
    filterAll: "All",
    filterArchitecture: "Architecture",
    filterAnimation: "Animation",
    filterVideo: "Brand Video",
    aboutTitle: "Methodology",
    aboutItem1Title: "Narrative First",
    aboutItem1Text: "Define business goal and audience emotion before visual execution.",
    aboutItem2Title: "Reusable Pipeline",
    aboutItem2Text: "Modularize generation, compositing and grading for faster delivery.",
    aboutItem3Title: "Outcome Driven",
    aboutItem3Text: "Optimize for communication impact and business conversion.",
    contactTitle: "Contact",
    contactSub: "Use Formspree or EmailJS with no backend service.",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Project Brief",
    formNamePh: "Your name",
    formEmailPh: "your@email.com",
    formMessagePh: "Background, budget and timeline",
    formSubmit: "Send",
    footerTagline: "AI-powered visual storytelling for real business outcomes.",
    preview: "Preview",
    detail: "Open Detail",
    formNeedConfig: "Please configure Formspree action or EmailJS settings.",
    formSending: "Sending...",
    formSent: "Message sent. I will reply soon.",
    formError: "Failed to send. Please retry or email directly."
  }
};

const PROJECTS = [
  {
    id: "architecture",
    category: "architecture",
    span: "wide tall",
    href: "architecture-detail.html",
    webp: "./images/architecture-showcase.webp",
    jpg: "./images/architecture-showcase.jpg",
    title: {
      zh: "黄洞水库全龄友好游客空间设计",
      en: "Huangdong Reservoir Visitor Space"
    },
    kicker: {
      zh: "建筑可视化",
      en: "Architecture Visualization"
    },
    desc: {
      zh: "3 天内完成高保真建筑可视化交付，支持投融资沟通与品牌呈现。",
      en: "High-fidelity architectural visualization delivered in 3 days for investor and brand communication."
    }
  },
  {
    id: "animation",
    category: "animation",
    span: "tall",
    href: "animation-detail-updated.html",
    webp: "./images/animation-showcase.webp",
    jpg: "./images/animation-showcase.jpg",
    title: {
      zh: "PUAN 动画短片",
      en: "PUAN Animation Short"
    },
    kicker: {
      zh: "动画短片",
      en: "Animation Short"
    },
    desc: {
      zh: "AIGC + 动画流程融合，10 小时完成实验性叙事短片。",
      en: "AIGC and animation pipeline merged to deliver a stylized short in 10 hours."
    }
  },
  {
    id: "video",
    category: "video",
    span: "",
    href: "bilibili-video-detail.html",
    webp: "./images/bilibili-showcase.webp",
    jpg: "./images/bilibili-showcase.jpg",
    title: {
      zh: "AIGC F1 宣传片",
      en: "AIGC F1 Promo Video"
    },
    kicker: {
      zh: "品牌视频",
      en: "Brand Video"
    },
    desc: {
      zh: "速度与科技主题品牌视频，支持多平台传播与营销转化。",
      en: "A high-intensity brand video themed around speed and technology."
    }
  }
];

let currentLang = "zh";
let currentFilter = "all";
let lightboxIndex = 0;
let eventsBound = false;

const grid = document.getElementById("projectGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const langToggle = document.getElementById("langToggle");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const EMAILJS_CDN = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
let emailJsReadyPromise = null;

function t(key) {
  return I18N[currentLang][key] || key;
}

function renderProjects() {
  grid.innerHTML = PROJECTS.map((p, idx) => {
    const hidden = currentFilter !== "all" && p.category !== currentFilter;
    return `
      <article class="bento-card ${p.span} ${hidden ? "is-hidden" : ""}" data-category="${p.category}" data-index="${idx}">
        <div class="card-media">
          <picture>
            <source srcset="${p.webp}" type="image/webp" />
            <img src="${p.jpg}" alt="${p.title[currentLang]}" loading="lazy" decoding="async" />
          </picture>
        </div>
        <div class="card-content">
          <span class="card-kicker">${p.kicker[currentLang]}</span>
          <h3 class="card-title">${p.title[currentLang]}</h3>
          <p class="card-desc">${p.desc[currentLang]}</p>
          <div class="card-actions">
            <button type="button" class="preview-btn" data-preview-index="${idx}">${t("preview")}</button>
            <a href="${p.href}">${t("detail")}</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function applyLanguage() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  langToggle.textContent = currentLang === "zh" ? "EN" : "中";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.setAttribute("placeholder", t(key));
  });

  renderProjects();
}

function openLightbox(index) {
  lightboxIndex = index;
  const p = PROJECTS[lightboxIndex];
  lightboxImage.src = p.jpg;
  lightboxCaption.textContent = `${p.kicker[currentLang]} · ${p.title[currentLang]}`;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

function stepLightbox(offset) {
  lightboxIndex = (lightboxIndex + offset + PROJECTS.length) % PROJECTS.length;
  openLightbox(lightboxIndex);
}

function hasEmailJsConfig() {
  return Boolean(
    form &&
    form.dataset.emailjsService &&
    form.dataset.emailjsTemplate &&
    form.dataset.emailjsPublicKey
  );
}

function getEmailJsConfig() {
  return {
    serviceId: form.dataset.emailjsService,
    templateId: form.dataset.emailjsTemplate,
    publicKey: form.dataset.emailjsPublicKey
  };
}

function loadEmailJs() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (emailJsReadyPromise) return emailJsReadyPromise;

  emailJsReadyPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = EMAILJS_CDN;
    script.async = true;
    script.onload = () => {
      if (window.emailjs) {
        resolve(window.emailjs);
      } else {
        reject(new Error("EmailJS failed to initialize."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load EmailJS script."));
    document.head.appendChild(script);
  });

  return emailJsReadyPromise;
}

function bindEvents() {
  if (eventsBound) return;
  eventsBound = true;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".bento-card").forEach((card) => {
        const cat = card.dataset.category;
        const shouldHide = currentFilter !== "all" && currentFilter !== cat;
        card.classList.toggle("is-hidden", shouldHide);
      });
    });
  });

  grid.addEventListener("click", (e) => {
    const preview = e.target.closest(".preview-btn");
    if (!preview) return;
    openLightbox(Number(preview.dataset.previewIndex));
  });

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    applyLanguage();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
      closeLightbox();
    }
    if (e.target.classList.contains("prev")) stepLightbox(-1);
    if (e.target.classList.contains("next")) stepLightbox(1);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = t("formSending");

    const formData = new FormData(form);
    const useEmailJs = hasEmailJsConfig();
    const useFormspree = Boolean(form.action) && !form.action.includes("yourFormId");

    if (!useEmailJs && !useFormspree) {
      formStatus.textContent = t("formNeedConfig");
      return;
    }

    try {
      if (useEmailJs) {
        const emailjs = await loadEmailJs();
        const { serviceId, templateId, publicKey } = getEmailJsConfig();

        await emailjs.send(serviceId, templateId, {
          name: formData.get("name") || "",
          email: formData.get("email") || "",
          message: formData.get("message") || ""
        }, { publicKey });
      } else {
        const res = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Formspree submission failed.");
      }

      form.reset();
      formStatus.textContent = t("formSent");
    } catch (_err) {
      formStatus.textContent = t("formError");
    }
  });
}

function init() {
  document.getElementById("year").textContent = String(new Date().getFullYear());
  applyLanguage();
  bindEvents();
}

init();
