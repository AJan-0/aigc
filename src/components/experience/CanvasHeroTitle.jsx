import { useCallback, useEffect, useRef } from 'react'

const glyphs = [
  { char: 'A', fill: ['#ff463f', '#ff8a72'], stroke: '#fff3ee', rotate: -6, width: 0.88, seed: 0.12 },
  { char: 'I', fill: ['#8a3dff', '#d783ff'], stroke: '#4b2fd2', rotate: 0, width: 0.46, seed: 0.32 },
  { char: 'G', fill: ['#ffbf27', '#ffe36b'], stroke: '#141414', rotate: -1, width: 0.86, seed: 0.54 },
  { char: 'C', fill: ['#ff74db', '#bfff00'], stroke: '#f6fff0', rotate: 7, width: 0.9, seed: 0.78 },
]

const signals = ['ai film direction', 'scene systems', 'motion packaging']
const heroLabel = 'AIGC Design Portfolio'
const mobileHeroMaxWidth = 560

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

  const isMobile = width < mobileHeroMaxWidth
  const elapsed = time - state.startedAt
  const scroll = clamp(state.scroll, 0, 1)
  const pointer = state.pointer
  const pointerCanvas = {
    x: width * (0.5 + pointer.x * 0.5),
    y: height * (0.5 + pointer.y * 0.5),
  }
  const hover = state.hover
  const burstAge = time - state.burstAt
  const burstProgress = clamp(burstAge / 1240, 0, 1)
  const burst = burstAge >= 0 && burstAge <= 1120 ? Math.sin(burstProgress * Math.PI) * (1 - burstProgress * 0.12) : 0
  const unit = clamp(Math.min(width / 1120, height / 530), 0.36, 1.05)
  const topSize = isMobile ? clamp(width * 0.225, 76, 106) : clamp(width * 0.178, 72, 194)
  const designSize = topSize * (isMobile ? 0.5 : 0.7)
  const portfolioSize = topSize * (isMobile ? 0.32 : 0.43)
  const centerX = width / 2
  const centerY = height * (isMobile ? 0.39 : 0.45)
  const scrollLift = scroll * height * (isMobile ? 0.06 : 0.08)
  const compress = 1 - scroll * 0.1
  const idle = Math.sin(time / 1160)
  const idleSoft = Math.sin(time / 1680 + 0.8)

  drawAmbient(ctx, width, height, pointer, hover, burst)

  ctx.save()
  ctx.translate(pointer.x * hover * 11, pointer.y * hover * 7 - scrollLift)
  ctx.scale(1 + hover * 0.008 - scroll * 0.012, compress)

  const topY = centerY - topSize * (isMobile ? 0.7 : 0.82)
  drawRigPieces(ctx, {
    burst,
    centerX,
    elapsed,
    hover,
    isMobile,
    pointer,
    seed: state.burstSeed,
    size: topSize,
    time,
    topY,
    unit,
  })

  drawAigcLine(ctx, {
    burst,
    centerX,
    elapsed,
    hover,
    idle,
    isMobile,
    pointer,
    pointerCanvas,
    seed: state.burstSeed,
    size: topSize,
    time,
    topY,
    unit,
  })

  drawWord(ctx, 'Design', {
    alpha: easeOutCubic(clamp((elapsed - (isMobile ? 780 : 520)) / (isMobile ? 920 : 980), 0, 1)),
    baseline: isMobile ? centerY + topSize * 0.56 + idleSoft * unit * 2 : centerY + designSize * 0.08 + idleSoft * unit * 3,
    burst: burst * (isMobile ? 0.72 : 1),
    centerX: centerX + pointer.x * hover * -8,
    color: '#fffdf7',
    fontSize: designSize,
    scaleX: isMobile ? 1.02 : 1.06,
    seed: state.burstSeed + 11,
    shadow: topSize * 0.055,
  })

  drawWord(ctx, 'Portfolio', {
    alpha: easeOutCubic(clamp((elapsed - (isMobile ? 1080 : 820)) / (isMobile ? 960 : 1040), 0, 1)),
    baseline: isMobile ? centerY + topSize * 1.08 + idle * unit * 1.5 : centerY + designSize * 0.78 + portfolioSize * 0.48 + idle * unit * 2,
    burst: burst * 0.55,
    centerX: centerX + pointer.x * hover * 5,
    color: '#fffdf7',
    fontSize: portfolioSize,
    scaleX: isMobile ? 0.88 : 0.86,
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

function drawRigPieces(ctx, props) {
  const { burst, centerX, elapsed, hover, isMobile, pointer, seed, size, time, topY, unit } = props
  const alpha = easeOutCubic(clamp((elapsed - 180) / 960, 0, 1))
  if (!alpha) return

  const rigAlpha = alpha * (isMobile ? 0.54 : 0.8)
  const driftX = pointer.x * hover * unit * 11
  const driftY = pointer.y * hover * unit * 7
  const pulse = Math.sin(time / 680)
  const burstSpread = burst * size * 0.12

  ctx.save()
  ctx.globalAlpha = rigAlpha

  drawTileStrip(ctx, {
    alpha,
    cols: isMobile ? 4 : 5,
    height: size * (isMobile ? 0.13 : 0.15),
    rotation: toRadians(-0.4 + pulse * 0.7 + burst * 2.2),
    tile: size * (isMobile ? 0.16 : 0.15),
    x: centerX + size * (isMobile ? 0.78 : 0.82) + driftX * 0.42 + burstSpread,
    y: topY - size * (isMobile ? 0.43 : 0.46) + driftY * 0.2,
  })

  drawFloatingBlock(ctx, {
    alpha,
    color: '#ffc529',
    height: size * 0.24,
    rotation: toRadians(-1.5 + burst * 8),
    width: size * 0.44,
    x: centerX + size * (isMobile ? 1.07 : 1.22) + driftX * 0.32,
    y: topY + size * (isMobile ? 0.27 : 0.34) + driftY * 0.26 - burstSpread * 0.4,
  })

  drawSpringCord(ctx, {
    alpha,
    burst,
    hover,
    isMobile,
    pointer,
    size,
    time,
    x: centerX + size * (isMobile ? 1.62 : 1.7) + driftX * 0.26,
    y: topY - size * 0.05 + driftY * 0.14,
  })

  drawRigNodes(ctx, {
    alpha,
    burst,
    centerX,
    hover,
    isMobile,
    pointer,
    seed,
    size,
    time,
    topY,
  })

  ctx.restore()
}

function drawTileStrip(ctx, options) {
  const { alpha, cols, height, rotation, tile, x, y } = options

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha *= alpha

  for (let i = 0; i < cols; i += 1) {
    const offset = i * tile
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 197, 41, 0.5)' : 'rgba(255, 220, 72, 0.34)'
    ctx.strokeStyle = 'rgba(255, 253, 250, 0.14)'
    ctx.lineWidth = Math.max(1, tile * 0.035)
    drawRoundedRect(ctx, offset, 0, tile * 0.95, height, tile * 0.04)
    ctx.fill()
    ctx.stroke()
  }

  ctx.restore()
}

function drawFloatingBlock(ctx, options) {
  const { alpha, color, height, rotation, width, x, y } = options

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha *= alpha
  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)'
  drawRoundedRect(ctx, width * 0.08, height * 0.12, width, height, height * 0.08)
  ctx.fill()
  ctx.fillStyle = color
  drawRoundedRect(ctx, 0, 0, width, height, height * 0.08)
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  drawRoundedRect(ctx, 0, 0, width * 0.48, height, height * 0.08)
  ctx.fill()
  ctx.restore()
}

function drawSpringCord(ctx, options) {
  const { alpha, burst, hover, isMobile, pointer, size, time, x, y } = options
  const cordLength = size * (isMobile ? 0.62 : 0.78)
  const wave = Math.sin(time / 520) * size * 0.035

  ctx.save()
  ctx.translate(x, y)
  ctx.globalAlpha *= alpha * (0.78 + hover * 0.18)
  ctx.strokeStyle = '#bfff00'
  ctx.lineWidth = size * (isMobile ? 0.046 : 0.04)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.12)
  ctx.bezierCurveTo(
    cordLength * 0.22 + pointer.x * hover * size * 0.05,
    -size * 0.46 + wave,
    cordLength * 0.44,
    size * (0.34 + burst * 0.08),
    cordLength * 0.7,
    size * 0.02 - wave,
  )
  ctx.bezierCurveTo(
    cordLength * 0.86,
    -size * 0.18,
    cordLength * 0.92 + pointer.y * hover * size * 0.08,
    size * 0.35,
    cordLength,
    size * (0.12 - burst * 0.12),
  )
  ctx.stroke()
  ctx.restore()
}

function drawRigNodes(ctx, options) {
  const { alpha, burst, centerX, hover, isMobile, pointer, seed, size, time, topY } = options
  const nodes = [
    [-1.18, -0.52, 0.04],
    [-0.56, 0.46, 0.032],
    [0.18, -0.62, 0.028],
    [1.36, 0.56, 0.035],
  ]

  ctx.save()
  ctx.globalAlpha *= alpha * (isMobile ? 0.52 : 0.68)
  nodes.forEach(([x, y, radius], index) => {
    const jitter = (noise(seed, index + 70) - 0.5) * burst * size * 0.24
    const orbit = Math.sin(time / (760 + index * 70) + index) * size * 0.018
    const px = centerX + x * size + pointer.x * hover * size * 0.035 + jitter
    const py = topY + y * size + pointer.y * hover * size * 0.025 + orbit - jitter * 0.4

    ctx.fillStyle = index % 2 === 0 ? 'rgba(255, 253, 250, 0.86)' : 'rgba(191, 255, 0, 0.75)'
    ctx.beginPath()
    ctx.arc(px, py, size * radius * (1 + burst * 0.34), 0, Math.PI * 2)
    ctx.fill()
  })
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
  const { burst, elapsed, hover, homeX, index, isMobile, pointer, pointerCanvas, seed, size, time, topY, unit } = props
  const localIntro = easeOutBack(clamp((elapsed - index * (isMobile ? 118 : 112)) / (isMobile ? 1160 : 1080), 0, 1))
  const localDistance = Math.hypot((pointerCanvas.x - homeX) / (size * 0.78), (pointerCanvas.y - topY) / (size * 0.72))
  const localHover = hover * clamp(1 - localDistance, 0, 1)
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
  const x = homeX + introX + pointer.x * hover * unit * (index - 1.5) * 8 + pointer.x * localHover * unit * 12 + burstX
  const y = topY + introY + idleY - overshoot + pointer.y * hover * unit * 9 - localHover * unit * 10 + burstY
  const scale = mix(0.58, 1, localIntro) + Math.sin(time / 840 + index) * 0.012 + burst * 0.12 + localHover * 0.055
  const alpha = clamp(localIntro * 1.25, 0, 1)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(toRadians(glyph.rotate + idleRotate + burstRotate + localHover * (index - 1.5) * 3.4))
  ctx.scale(scale * (1 + hover * 0.018), scale * (1 - burst * 0.035 + localHover * 0.018))
  ctx.globalAlpha = alpha
  drawPlayfulLetter(ctx, glyph, size, { burst, localHover, pointer, time })
  ctx.restore()
}

function drawPlayfulLetter(ctx, glyph, size, motion) {
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

  drawLetterHighlights(ctx, glyph.char, size, motion)

  if (glyph.char === 'C') drawFace(ctx, size, motion)
  if (glyph.char === 'I') drawIAccent(ctx, size, motion)
  if (glyph.char === 'G') drawGAccent(ctx, size, motion)
  ctx.restore()
}

function drawLetterHighlights(ctx, char, size, motion) {
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
    const shimmer = Math.sin(motion.time / 520 + x * 8) * motion.localHover * size * 0.006
    ctx.beginPath()
    ctx.ellipse(size * x + shimmer, size * y - shimmer, size * rx, size * ry, rotation, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawFace(ctx, size, motion) {
  ctx.save()
  ctx.translate(size * 0.05, -size * 0.05)
  ctx.fillStyle = '#171719'
  ctx.strokeStyle = '#171719'
  ctx.lineWidth = size * 0.025
  const lookX = motion.pointer.x * motion.localHover * size * 0.018
  const lookY = motion.pointer.y * motion.localHover * size * 0.014
  ctx.beginPath()
  ctx.arc(-size * 0.08 + lookX, -size * 0.06 + lookY, size * 0.026, 0, Math.PI * 2)
  ctx.arc(size * 0.08 + lookX, -size * 0.06 + lookY, size * 0.026, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, size * (0.04 + motion.burst * 0.015), size * (0.11 + motion.localHover * 0.015), 0.08 * Math.PI, 0.92 * Math.PI)
  ctx.stroke()
  ctx.restore()
}

function drawIAccent(ctx, size, motion) {
  ctx.save()
  ctx.globalAlpha = 0.52 + motion.localHover * 0.22
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)'
  ctx.lineWidth = size * 0.018
  ctx.beginPath()
  ctx.moveTo(-size * 0.03, -size * 0.42)
  ctx.lineTo(size * (0.02 + motion.localHover * 0.05), size * 0.42)
  ctx.stroke()
  ctx.restore()
}

function drawGAccent(ctx, size, motion) {
  ctx.save()
  ctx.globalAlpha = 0.45 + motion.localHover * 0.28
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.52)'
  ctx.lineWidth = size * (0.022 + motion.localHover * 0.008)
  ctx.beginPath()
  ctx.moveTo(size * 0.1, -size * 0.04)
  ctx.quadraticCurveTo(size * 0.26, -size * 0.02, size * 0.31, size * 0.08)
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

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function toRadians(degrees) {
  return degrees * Math.PI / 180
}
