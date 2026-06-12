/**
 * ============================================
 * 主应用程序入口
 * ============================================
 * 从 src/config/ 导入配置，替代硬编码的配置
 */

// 导入配置
import { I18N } from './config/i18n.js';
import { PROJECTS, EMAILJS_CDN } from './config/constants.js';
import { emailjsConfig } from './config/env.js';
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
  // 优先从环境变量读取配置
  if (emailjsConfig.isConfigured()) {
    return true;
  }
  
  // 降级到 HTML data-attributes（向后兼容）
  return Boolean(
    form &&
    form.dataset.emailjsService &&
    form.dataset.emailjsTemplate &&
    form.dataset.emailjsPublicKey
  );
}

function getEmailJsConfig() {
  // 优先从环境变量读取配置
  if (emailjsConfig.isConfigured()) {
    return {
      serviceId: emailjsConfig.serviceId,
      templateId: emailjsConfig.templateId,
      publicKey: emailjsConfig.publicKey
    };
  }
  
  // 降级到 HTML data-attributes（向后兼容）
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
