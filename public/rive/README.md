# Hero Rive Asset Contract

Place the production hero asset at:

```text
public/rive/hero-title.riv
```

The site will automatically use this file when it exists. If the file is absent
or fails to load, the DOM/CSS hero remains the fallback.

## Rive Setup

- Artboard: use the default artboard, sized around a 16:9 desktop hero.
- State machine: `HeroSM`.
- View model: default view model and default instance.

## Data Binding Properties

Create these properties on the default view model:

```text
pointerX        Number   range -1..1, default 0
pointerY        Number   range -1..1, default 0
scrollProgress  Number   range 0..1, default 0
hovered         Boolean  default false
burst           Trigger
```

## Recommended Animation States

- Intro: initial glyph assembly and overshoot.
- Idle: slow breathing loop after intro.
- Hover: subtle parallax and stronger highlights when `hovered` is true.
- Burst: short click/tap pop driven by the `burst` trigger.
- Scroll: compress or soften the title as `scrollProgress` increases.

Keep the file small by embedding only vector text/shapes needed for the hero.
Avoid bitmap textures unless they are essential to the lettering.
