# DESIGN.md: Tigran-Inspired Motion Portfolio

## Source
- URL: https://tigranz.com/
- Capture date: 2026-06-30
- Evidence: browser screenshot, DOM snapshot, manual visual inspection, asset counts from the live page.

## Reference Screenshot
Local capture path used during implementation: `./.firecrawl/tigranz-home.png`.

The capture is intentionally kept out of the public repo because it contains third-party artwork. Use it only as a local visual reference for layout hierarchy, motion density and the black-stage editorial feel. The implementation below recreates the interaction language with original AIGC content and project assets, not copied third-party artwork.

## Design Summary
The reference site is a motion-designer portfolio built as a black theatrical stage. The first viewport is dominated by a huge kinetic wordmark and illustrated letterforms. Navigation is light and fixed, the work section is simple and list-led, the about section is editorial text, and contact is oversized typography. The site feels animated because the type and media are always moving slightly, but the layout itself stays minimal.

## Design Tokens

### Colors
- Background: `#08090a`, near-black.
- Main text: `#f7f2e8`, warm off-white.
- Muted text: `rgba(247,242,232,0.58)`.
- Red accent: `#ff4f3e`, used for active arrows and warm hero glyphs.
- Purple accent: `#9b5cff`, used for character shapes and the email `@`.
- Yellow accent: `#ffcc32`, used for geometric bars and markers.
- Neon green accent: `#b5ff00`, used for active work rows and the email domain suffix.
- Borders: `rgba(247,242,232,0.12)`.

### Typography
- Display: heavy rounded grotesk look, approximated with local `Syne`.
- Body: neutral sans, local `Manrope`.
- Meta labels: compact monospace, system `Consolas`.
- Headings use tight line-height from `0.72` to `0.92`, no negative letter-spacing.

### Spacing And Layout
- Page background stays black with subtle grain, not card surfaces.
- Sections use full-width bands with constrained internal content.
- Hero stage is intentionally oversized and cropped horizontally on desktop.
- Work is centered around a large active card with smaller neighboring cards and a list/archive control below.
- About text is narrow editorial copy, not a bio card.
- Contact gives the email one full visual moment.

## Components
- Header: fixed, minimal, no pill shell. Small logo left, text nav right.
- Hero: large animated vector-letter scene, moving ticker, small metadata notes.
- Work: carousel with one central active media card, side cards peeking left/right, fast transform-only transitions, list rows for direct selection.
- About: huge “About” display word, portrait/cutout as a floating element, short paragraphs.
- Systems: compact capability/logo-style grid rather than stacked cards.
- Contact: enormous email typography with colored `@` and domain suffix.

## Page Patterns
1. Hero kinetic stage.
2. Selected work carousel/archive.
3. Editorial about.
4. Systems/capability grid.
5. Contact typography footer.

## Motion And Interaction
- Hero load sequence uses staggered letter entrance, blur-to-sharp, scale, scanline and drift.
- Pointer motion shifts the hero spotlight with CSS variables.
- Work carousel changes via transform and opacity only, avoiding heavy re-layout.
- Desktop supports hover/focus row selection and arrow controls.
- Mobile uses swipe drag and visible side-card peeks.
- Scroll reveals are short and editorial, not card-heavy.

## Agent Build Instructions
- Do not copy the reference site's logo, illustrations, brand copy or trademarks.
- Keep the portfolio content AJan/AIGC specific.
- Prefer transform, opacity and CSS variables for animation performance.
- Avoid nested cards, decorative blobs and dashboard-style panels.
- Verify both desktop and mobile for text clipping, horizontal overflow and interaction smoothness.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://tigranz.com/
target_stack: React + Vite + Framer Motion + GSAP
output: DESIGN.md
