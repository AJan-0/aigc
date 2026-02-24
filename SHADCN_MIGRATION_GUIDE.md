# shadcn + Tailwind + TypeScript Integration Guide

This repo is currently a static Vite site (`vite` only) and does not yet have a full React + TypeScript + Tailwind + shadcn runtime.

## Current paths in this repo

- Components path in use: `components/ui`
- Global styles path in use: `src/styles.css` (plus inline `<style>` in detail pages)

## Recommended target paths for shadcn

- Reusable UI components: `components/ui` or `src/components/ui`
- App-level styles: `src/index.css` (or keep `src/styles.css` and import it from `main.tsx`)

`components/ui` matters because it gives a stable, shared location for design-system primitives (accordion, dialog, button), avoids scattered component files, and matches shadcn conventions used by most examples and team workflows.

## Minimal migration steps (inside this project)

1. Install React + TypeScript toolchain:
   ```bash
   npm install react react-dom
   npm install -D typescript @types/react @types/react-dom
   ```
2. Add Tailwind:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Configure Tailwind `content` globs (`./index.html`, `./src/**/*.{ts,tsx,js,jsx}`, `./components/**/*.{ts,tsx}`) and add Tailwind directives in `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Create `tsconfig.json` and migrate entry to `src/main.tsx`.
5. Initialize shadcn:
   ```bash
   npx shadcn@latest init
   ```
6. During `shadcn init`:
   - Framework: `Vite`
   - Style: `Tailwind CSS`
   - Base color: your choice
   - Components path: `components`
   - Utils path: `lib/utils.ts`
7. Keep UI atoms under `components/ui`.

## Component integrated in this turn

- `components/ui/accordion-1.tsx`
- `components/ui/demo.tsx` now renders `BasicAccordion`

Required dependencies already installed:

- `@ark-ui/react`
- `lucide-react`
