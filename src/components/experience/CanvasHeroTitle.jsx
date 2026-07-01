import { useCallback, useEffect, useRef } from 'react'

const glyphs = [
  { char: 'A', fill: ['#ff463f', '#ff8a72'], stroke: '#fff3ee', rotate: -6, width: 0.88, seed: 0.12 },
  { char: 'I', fill: ['#8a3dff', '#d783ff'], stroke: '#4b2fd2', rotate: 0, width: 0.46, seed: 0.32 },
  { char: 'G', fill: ['#ffbf27', '#ffe36b'], stroke: '#141414', rotate: -1, width: 0.86, seed: 0.54 },
  { char: 'C', fill: ['#ff74db', '#bfff00'], stroke: '#f6fff0', rotate: 7, width: 0.9, seed: 0.78 },
]

const signals = ['ai film direction', 'scene systems', 'motion packaging']
const heroLabel = 'AIGC Design Portfolio'

export default function CanvasHeroTitle({ scrollYProgress }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const frameRef = useRef(0)
  const lastTouchBurstRef = useRef(0)
  const stateRef = useRef({
    startedAt: 0,
    burstAt: -9999,
    burstSeed: 1,
    pointer: { x: 0, y: 0 },
    targetPointer: { x: 0, y: 0 },
    hover: 0,
    targetHover: 0,
    scroll: 0,
    size: { width: 0, height: 0, dpr: 1 },
  })

  const draw = useCallback(time => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const state = stateRef.current
    state.pointer.x = damp(state.pointer.x, state.targetPointer.x, 0.12)
    state.pointer.y = damp(state.pointer.y, state.targetPointer.y, 0.12)
    state.hover = damp(state.hover, state.targetHover, 0.1)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, dpr } = state.size
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    renderHero(ctx, state, time)

    frameRef.current = requestAnimationFrame(draw)
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    stateRef.current.size = { width, height, dpr }
  }, [])

  const updatePointer = useCallback(event => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    stateRef.current.targetPointer = {
      x: clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1),
      y: clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1),
    }
  }, [])

  const triggerBurst = useCallback(() => {
    stateRef.current.burstAt = window.performance?.now?.() ?? Date.now()
    stateRef.current.burstSeed += 1
  }, [])

  useEffect(() => {
    resize()
    stateRef.current.startedAt = window.performance?.now?.() ?? Date.now()
    frameRef.current = requestAnimationFrame(draw)

    const container = containerRef.current
    const observer = typeof ResizeObserver !== 'undefined' && container
      ? new ResizeObserver(resize)
      : null

    observer?.observe(container)
    window.addEventListener('resize', resize)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [draw, resize])

  useEffect(() => {
    if (!scrollYProgress) return undefined

    stateRef.current.scroll = scrollYProgress.get()
    return scrollYProgress.on('change', value => {
      stateRef.current.scroll = value
    })
  }, [scrollYProgress])

  useEffect(() => {
    if (!document.fonts?.ready) return undefined

    let active = true
    document.fonts.ready.then(() => {
      if (active) resize()
    })

    return () => {
      active = false
    }
  }, [resize])

  const handlePointerEnter = event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return

    stateRef.current.targetHover = 1
    updatePointer(event)
  }

  const handlePointerMove = event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') updatePointer(event)
  }

  const handlePointerLeave = () => {
    stateRef.current.targetHover = 0
    stateRef.current.targetPointer = { x: 0, y: 0 }
  }

  const handlePointerDown = event => {
    if (event.pointerType === 'mouse') return

    lastTouchBurstRef.current = window.performance?.now?.() ?? Date.now()
    triggerBurst()
  }

  const handleClick = () => {
    const now = window.performance?.now?.() ?? Date.now()
    if (now - lastTouchBurstRef.current < 420) return

    triggerBurst()
  }

  const handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    triggerBurst()
  }

  return (
    <div
      ref={containerRef}
      className="mc-hero-mark mc-canvas-hero-mark"
      aria-label={heroLabel}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <canvas className="mc-canvas-hero-canvas" ref={canvasRef} aria-hidden="true" />
      <h1 className="mc-screen-reader-only">{heroLabel}</h1>
      <p className="mc-hero-caption">
        AIGC Design Portfolio. AI film direction, short drama hooks and finished motion packaging.
      </p>
      <div className="mc-hero-signal" aria-hidden="true">
        {signals.map(signal => <span key={signal}>{signal}</span>)}
      </div>
    </div>
  )
}

function renderHero(ctx, state, time) {
  const { width, height } = state.size
  if (!width || !height) return

  const elapsed = time - state.startedAt
  const scroll = clamp(state.scroll, 0, 1)
  const pointer = state.pointer
  const hover = state.hover
  const burstAge = time - state.burstAt
  const burstProgress = clamp(burstAge / 1120, 0, 1)
  const burst = burstAge >= 0 && burstAge <= 1120 ? Math.sin(burstProgress * Math.PI) * (1 - burstProgress * 0.12) : 0
  const unit = clamp(Math.min(width / 1120, height / 530), 0.36, 1.05)
  const topSize = clamp(width * 0.178, 72, 184) * (width < 520 ? 0.95 : 1)
  const designSize = topSize * (width < 520 ? 0.78 : 0.72)
  const portfolioSize = topSize * (width < 520 ? 0.5 : 0.45)
  const centerX = width / 2
  const centerY = height * (width < 520 ? 0.43 : 0.45)
  const scrollLift = scroll * height * 0.08
  const compress = 1 - scroll * 0.1
  const idle = Math.sin(time / 1160)
  const idleSoft = Math.sin(time / 1680 + 0.8)

  drawAmbient(ctx, width, height, pointer, hover, burst)

  ctx.save()
  ctx.translate(pointer.x * hover * 11, pointer.y * hover * 7 - scrollLift)
  ctx.scale(1 + hover * 0.008 - scroll * 0.012, compress)

  const topY = centerY - topSize * 0.82
  drawAigcLine(ctx, {
    burst,
    centerX,
    elapsed,
    hover,
    idle,
    pointer,
    seed: state.burstSeed,
    size: topSize,
    time,
    topY,
    unit,
  })

  drawWord(ctx, 'Design', {
    alpha: easeOutCubic(clamp((elapsed - 420) / 820, 0, 1)),
    baseline: centerY + designSize * 0.08 + idleSoft * unit * 3,
    burst,
    centerX: centerX + pointer.x * hover * -8,
    color: '#fffdf7',
    fontSize: designSize,
    scaleX: width < 520 ? 1.02 : 1.06,
    seed: state.burstSeed + 11,
    shadow: topSize * 0.055,
  })

  drawWord(ctx, 'Portfolio', {
    alpha: easeOutCubic(clamp((elapsed - 620) / 860, 0, 1)),
    baseline: centerY + designSize * 0.78 + portfolioSize * 0.48 + idle * unit * 2,
    burst: burst * 0.55,
    centerX: centerX + pointer.x * hover * 5,
    color: '#fffdf7',
    fontSize: portfolioSize,
    scaleX: width < 520 ? 0.9 : 0.86,
    seed: state.burstSeed + 19,
    shadow: topSize * 0.036,
  })

  ctx.restore()
}

function drawAmbient(ctx, width, height, pointer, hover, burst) {
  ctx.save()
  ctx.globalAlpha = 0.3 + hover * 0.26 + burst * 0.16
  const gradient = ctx.createRadialGradient(
    width * (0.5 + pointer.x * 0.12),
    height * (0.42 + pointer.y * 0.08),
    0,
    width * 0.5,
    height * 0.44,
    Math.max(width, height) * 0.52,
  )
  gradient.addColorStop(0, 'rgba(191, 255, 0, 0.13)')
  gradient.addColorStop(0.3, 'rgba(255, 70, 63, 0.08)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}

function drawAigcLine(ctx, props) {
  const { centerX, size } = props
  const totalWidth = glyphs.reduce((sum, glyph) => sum + size * glyph.width, 0) + size * 0.06 * (glyphs.length - 1)
  let x = centerX - totalWidth / 2

  glyphs.forEach((glyph, index) => {
    const glyphWidth = size * glyph.width
    drawGlyph(ctx, glyph, {
      ...props,
      homeX: x + glyphWidth / 2,
      index,
    })
    x += glyphWidth + size * 0.06
  })
}

function drawGlyph(ctx, glyph, props) {
  const { burst, elapsed, hover, homeX, index, pointer, seed, size, time, topY, unit } = props
  const localIntro = easeOutBack(clamp((elapsed - index * 105) / 980, 0, 1))
  const scatterX = (index - 1.5) * size * 0.52 + (noise(seed, index + 1) - 0.5) * size * 0.5
  const scatterY = -size * (0.84 + noise(seed, index + 5) * 0.52)
  const introX = mix(scatterX, 0, localIntro)
  const introY = mix(scatterY, 0, localIntro)
  const overshoot = Math.sin(localIntro * Math.PI) * (1 - localIntro) * size * 0.08
  const idleY = Math.sin(time / 720 + glyph.seed * 12) * unit * 5
  const idleRotate = Math.sin(time / 1320 + glyph.seed * 9) * 2.1
  const burstKick = burst * size * 0.35
  const burstX = (noise(seed, index + 21) - 0.5) * burstKick
  const burstY = -(0.25 + noise(seed, index + 31)) * burstKick
  const burstRotate = (noise(seed, index + 41) - 0.5) * burst * 28
  const x = homeX + introX + pointer.x * hover * unit * (index - 1.5) * 8 + burstX
  const y = topY + introY + idleY - overshoot + pointer.y * hover * unit * 9 + burstY
  const scale = mix(0.58, 1, localIntro) + Math.sin(time / 840 + index) * 0.012 + burst * 0.12
  const alpha = clamp(localIntro * 1.25, 0, 1)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(toRadians(glyph.rotate + idleRotate + burstRotate))
  ctx.scale(scale * (1 + hover * 0.018), scale * (1 - burst * 0.035))
  ctx.globalAlpha = alpha
  drawPlayfulLetter(ctx, glyph, size)
  ctx.restore()
}

function drawPlayfulLetter(ctx, glyph, size) {
  const font = `900 ${size}px 'Arial Black', 'Neue Regrade Extrabold', Impact, sans-serif`
  const gradient = ctx.createLinearGradient(-size * 0.42, -size * 0.55, size * 0.42, size * 0.48)
  gradient.addColorStop(0, glyph.fill[0])
  gradient.addColorStop(1, glyph.fill[1])

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = font
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2

  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
  ctx.fillText(glyph.char, 0, size * 0.1)

  ctx.lineWidth = size * 0.08
  ctx.strokeStyle = glyph.stroke
  ctx.strokeText(glyph.char, 0, 0)

  ctx.fillStyle = gradient
  ctx.fillText(glyph.char, 0, 0)

  drawLetterHighlights(ctx, glyph.char, size)

  if (glyph.char === 'C') drawFace(ctx, size)
  ctx.restore()
}

function drawLetterHighlights(ctx, char, size) {
  const highlights = {
    A: [[-0.08, -0.34, 0.06, 0.022, -0.38], [0.16, -0.31, 0.045, 0.02, 0.48]],
    G: [[-0.2, -0.31, 0.055, 0.023, -0.32], [0.08, -0.29, 0.047, 0.02, 0.38]],
    C: [[-0.13, -0.32, 0.057, 0.023, -0.22], [0.18, -0.3, 0.046, 0.019, 0.42]],
  }[char]

  if (!highlights) return

  ctx.save()
  ctx.globalAlpha = 0.9
  ctx.fillStyle = 'rgba(255, 255, 255, 0.86)'
  highlights.forEach(([x, y, rx, ry, rotation]) => {
    ctx.beginPath()
    ctx.ellipse(size * x, size * y, size * rx, size * ry, rotation, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawFace(ctx, size) {
  ctx.save()
  ctx.translate(size * 0.05, -size * 0.05)
  ctx.fillStyle = '#171719'
  ctx.strokeStyle = '#171719'
  ctx.lineWidth = size * 0.025
  ctx.beginPath()
  ctx.arc(-size * 0.08, -size * 0.06, size * 0.026, 0, Math.PI * 2)
  ctx.arc(size * 0.08, -size * 0.06, size * 0.026, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, size * 0.04, size * 0.11, 0.08 * Math.PI, 0.92 * Math.PI)
  ctx.stroke()
  ctx.restore()
}

function drawWord(ctx, text, options) {
  const {
    alpha,
    baseline,
    burst,
    centerX,
    color,
    fontSize,
    scaleX,
    seed,
    shadow,
  } = options
  const scatter = (1 - alpha) * fontSize * 0.34
  const burstX = (noise(seed, 8) - 0.5) * burst * fontSize * 0.18
  const burstY = -burst * fontSize * (0.18 + noise(seed, 4) * 0.12)

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(centerX + burstX, baseline + scatter + burstY)
  ctx.scale(scaleX + burst * 0.025, 0.95 - burst * 0.015)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 ${fontSize}px 'Neue Regrade Extrabold', 'Arial Black', Impact, sans-serif`
  ctx.lineJoin = 'round'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.44)'
  ctx.fillText(text, 0, shadow)
  ctx.lineWidth = Math.max(2, fontSize * 0.018)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.strokeText(text, 0, 0)
  ctx.fillStyle = color
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function damp(current, target, amount) {
  return current + (target - current) * amount
}

function easeOutCubic(value) {
  const t = clamp(value, 0, 1)
  return 1 - Math.pow(1 - t, 3)
}

function easeOutBack(value) {
  const t = clamp(value, 0, 1)
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function mix(from, to, amount) {
  return from + (to - from) * amount
}

function noise(seed, salt) {
  const raw = Math.sin((seed + 1.618) * (salt + 2.414) * 97.13) * 10000
  return raw - Math.floor(raw)
}

function toRadians(degrees) {
  return degrees * Math.PI / 180
}
