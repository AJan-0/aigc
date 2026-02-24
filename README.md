# AIGC Visual Studio Portfolio

## Tech Stack
- Static HTML + CSS + vanilla JS modules
- Vite (dev/build/preview)

## Local Development
```bash
npm install
npm run dev
```

## Completed in this version
- Removed `@babel/standalone` and all inline JSX runtime usage.
- Rebuilt homepage with module architecture (`src/main.js`, `src/styles.css`).
- Fixed double-render issue by removing duplicated React bootstrapping path.
- Added complete SEO metadata:
  - `description`, `keywords`, `robots`, `canonical`
  - OpenGraph (`og:*`)
  - Twitter Card (`twitter:*`)
  - JSON-LD structured data
- Added Bento Grid project layout.
- Added category filter animation (`all / architecture / animation / video`).
- Added reusable Lightbox preview (keyboard + click controls).
- Added bilingual switch (`中文 / English`).
- Added enhanced footer (social links + quick nav).
- Added contact form (Formspree-ready, no backend required).
- Added analytics hooks for Google Analytics or Umami.
- Added WebP + lazy loading support via `<picture>` and `loading="lazy"`.

## Analytics setup
Edit `src/analytics-config.js` (shared by homepage + detail pages):

```js
window.SITE_ANALYTICS = window.SITE_ANALYTICS || {
  gaMeasurementId: "G-XXXXXXXXXX",
  umamiWebsiteId: "",
  umamiScriptUrl: ""
};
```

Use either GA or Umami, or both.

## Contact form setup
Use one of the following in `index.html`:

```html
<form action="https://formspree.io/f/yourFormId" method="POST">
```

Replace `yourFormId` with your real Formspree form ID.

Or configure EmailJS in the same form:

```html
<form
  data-emailjs-service="service_xxx"
  data-emailjs-template="template_xxx"
  data-emailjs-public-key="public_xxx"
>
```

## Deploy

### Vercel
1. Import this project in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. `vercel.json` is included.

### Cloudflare Pages
1. Create a new Pages project connected to this repo.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. `_headers` and `_redirects` are included for Pages.

## Custom domain + HTTPS
Current domain file: `CNAME` -> `ajan03.xyz`.

### Vercel
1. Project Settings -> Domains -> add `ajan03.xyz` and `www.ajan03.xyz`.
2. Configure DNS records at your DNS provider as prompted.
3. SSL is auto-issued by Vercel.

### Cloudflare Pages
1. Pages project -> Custom domains -> add `ajan03.xyz`.
2. Ensure DNS in Cloudflare points to the Pages project.
3. SSL/TLS mode: `Full` (or `Full (strict)` if origin cert is valid).

