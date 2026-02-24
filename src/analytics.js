(function initAnalytics() {
  const cfg = window.SITE_ANALYTICS || {};

  if (cfg.gaMeasurementId) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.gaMeasurementId}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", cfg.gaMeasurementId);
  }

  if (cfg.umamiWebsiteId && cfg.umamiScriptUrl) {
    const umami = document.createElement("script");
    umami.defer = true;
    umami.src = cfg.umamiScriptUrl;
    umami.setAttribute("data-website-id", cfg.umamiWebsiteId);
    document.head.appendChild(umami);
  }
})();
