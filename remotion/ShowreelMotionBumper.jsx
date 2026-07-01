import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const palette = {
  black: '#030304',
  white: '#fffdf7',
  paper: '#f5efe2',
  ink: '#101010',
  cyan: '#00d5ff',
  blue: '#1b64ff',
  magenta: '#ff2aa8',
  red: '#ff3b30',
  yellow: '#ffe23f',
  green: '#25e66a',
  orange: '#ff8a00',
  violet: '#9b5cff',
}

const chroma = [
  palette.cyan,
  palette.magenta,
  palette.yellow,
  palette.blue,
  palette.red,
  palette.green,
  palette.orange,
  palette.violet,
]

const collisions = [
  { frame: 18, a: palette.magenta, b: palette.cyan, c: palette.yellow, axis: 'x', size: 500 },
  { frame: 76, a: palette.yellow, b: palette.blue, c: palette.red, axis: 'y', size: 430 },
  { frame: 132, a: palette.green, b: palette.magenta, c: palette.white, axis: 'diag', size: 560 },
  { frame: 214, a: palette.red, b: palette.cyan, c: palette.violet, axis: 'x', size: 620 },
  { frame: 292, a: palette.orange, b: palette.blue, c: palette.green, axis: 'diag', size: 520 },
  { frame: 372, a: palette.white, b: palette.magenta, c: palette.yellow, axis: 'y', size: 600 },
]

const typeCuts = [
  { frame: 42, label: 'CHROMA', sub: 'collision / 01', x: 112, y: 126, align: 'left', tone: 'dark' },
  { frame: 112, label: 'POP FIELD', sub: 'hard cut geometry', x: 960, y: 640, align: 'center', tone: 'light' },
  { frame: 198, label: 'IMPACT', sub: 'shape against shape', x: 1540, y: 172, align: 'right', tone: 'dark' },
  { frame: 272, label: 'COLOR MASS', sub: 'clean burst system', x: 126, y: 736, align: 'left', tone: 'light' },
  { frame: 338, label: 'KINETIC POP', sub: 'fast graphic rhythm', x: 960, y: 150, align: 'center', tone: 'dark' },
]

export const showreelMotionDefaults = {
  title: 'AIGC',
  subtitle: 'Color Motion System',
}

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function ease(frame, range, values, easing = Easing.bezier(0.16, 1, 0.3, 1)) {
  return interpolate(frame, range, values, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function progress(frame, start, duration) {
  return clamp((frame - start) / duration)
}

function hit(frame, point, radius = 8) {
  return clamp(1 - Math.abs(frame - point) / radius)
}

function sceneInOut(frame, start, hold, enter = 8, exit = 8) {
  const enterValue = ease(frame, [start, start + enter], [0, 1])
  const exitValue = ease(frame, [start + hold, start + hold + exit], [0, 1], Easing.in(Easing.cubic))
  return clamp(enterValue - exitValue)
}

function wave(frame, speed = 0.04, offset = 0) {
  return Math.sin(frame * speed + offset)
}

export function ShowreelMotionBumper({
  title = showreelMotionDefaults.title,
  subtitle = showreelMotionDefaults.subtitle,
} = {}) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const impact = collisions.reduce((amount, item) => Math.max(amount, hit(frame, item.frame, 6)), 0)
  const final = sceneInOut(frame, 350, durationInFrames - 370, 18, 20)

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: palette.black,
        color: palette.white,
        fontFamily: '"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <SnapBackground frame={frame} impact={impact} />
      <HalftonePlates frame={frame} />
      <StripeWipes frame={frame} />
      <CollisionField frame={frame} />
      <PopGeometry frame={frame} />
      <TypeCuts frame={frame} />
      <FinalLock frame={frame} title={title} subtitle={subtitle} opacity={final} />
      <CutFlash frame={frame} impact={impact} />
      <FilmSurface frame={frame} />
    </AbsoluteFill>
  )
}

function SnapBackground({ frame, impact }) {
  const stage = Math.floor(frame / 56)
  const isPaper = stage % 2 === 1
  const wipe = progress(frame % 56, 0, 12)

  return (
    <AbsoluteFill
      style={{
        background: isPaper ? palette.paper : palette.black,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: stage % 3 === 0
            ? `linear-gradient(135deg, ${palette.black} 0%, #090909 50%, #151515 100%)`
            : `linear-gradient(135deg, ${palette.paper} 0%, ${palette.white} 52%, #efe3cf 100%)`,
          opacity: isPaper ? 0.76 : 0.62,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${chroma[stage % chroma.length]}, ${chroma[(stage + 2) % chroma.length]})`,
          clipPath: `inset(0 ${100 - wipe * 100}% 0 0)`,
          opacity: 0.18 + impact * 0.18,
          mixBlendMode: isPaper ? 'multiply' : 'screen',
        }}
      />
    </AbsoluteFill>
  )
}

function HalftonePlates({ frame }) {
  return (
    <AbsoluteFill>
      {[
        { start: 54, x: 1160, y: 60, size: 520, color: palette.magenta, rotate: -8 },
        { start: 122, x: 90, y: 530, size: 460, color: palette.blue, rotate: 12 },
        { start: 246, x: 1110, y: 520, size: 560, color: palette.yellow, rotate: -16 },
        { start: 310, x: 140, y: 80, size: 390, color: palette.green, rotate: 18 },
      ].map((plate, index) => {
        const p = sceneInOut(frame, plate.start, 78, 10, 10)
        const scale = ease(p, [0, 1], [0.72, 1])

        return (
          <div
            key={plate.start}
            style={{
              position: 'absolute',
              left: plate.x,
              top: plate.y,
              width: plate.size,
              height: plate.size,
              opacity: p * 0.72,
              borderRadius: index % 2 === 0 ? '50%' : 34,
              backgroundColor: plate.color,
              backgroundImage: `radial-gradient(${index % 2 ? palette.white : palette.black} 0 5px, transparent 6px)`,
              backgroundSize: '28px 28px',
              mixBlendMode: index % 2 ? 'screen' : 'multiply',
              transform: `translate(${ease(p, [0, 1], [120, 0])}px, ${ease(p, [0, 1], [40, 0])}px) rotate(${plate.rotate + frame * 0.04}deg) scale(${scale})`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function StripeWipes({ frame }) {
  return (
    <AbsoluteFill>
      {[
        { start: 86, color: palette.red, y: 90, height: 76, rotate: -10, dir: 1 },
        { start: 164, color: palette.cyan, y: 820, height: 58, rotate: 8, dir: -1 },
        { start: 236, color: palette.yellow, y: 448, height: 96, rotate: -16, dir: 1 },
        { start: 326, color: palette.violet, y: 260, height: 68, rotate: 12, dir: -1 },
      ].map(stripe => {
        const p = sceneInOut(frame, stripe.start, 42, 6, 10)
        const x = ease(p, [0, 1], [stripe.dir * -820, 0], Easing.bezier(0.2, 0.95, 0.14, 1))

        return (
          <div
            key={stripe.start}
            style={{
              position: 'absolute',
              left: -180,
              top: stripe.y,
              width: 2280,
              height: stripe.height,
              opacity: p,
              background: `repeating-linear-gradient(90deg, ${stripe.color} 0 54px, ${palette.white} 54px 86px, ${palette.black} 86px 100px)`,
              transform: `translateX(${x}px) rotate(${stripe.rotate}deg)`,
              mixBlendMode: 'normal',
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function CollisionField({ frame }) {
  return (
    <AbsoluteFill>
      {collisions.map((collision, index) => (
        <Collision key={collision.frame} frame={frame} collision={collision} index={index} />
      ))}
    </AbsoluteFill>
  )
}

function Collision({ frame, collision, index }) {
  const p = progress(frame, collision.frame - 22, 78)
  if (p <= 0 || p >= 1) return null

  const arrive = ease(p, [0, 0.42], [0, 1], Easing.bezier(0.18, 0.9, 0.14, 1))
  const burst = ease(p, [0.34, 1], [0, 1], Easing.out(Easing.cubic))
  const snap = hit(frame, collision.frame, 6)
  const centerX = 960 + wave(frame, 0.026, index) * 40
  const centerY = 540 + wave(frame, 0.03, index + 2) * 34
  const offset = ease(arrive, [0, 1], [820, 0])
  const burstScale = 1 + snap * 0.18 + burst * 0.34
  const width = collision.size * (1.04 + burst * 0.18)
  const height = collision.size * (0.72 + snap * 0.2)
  const aTransform = movement(collision.axis, centerX, centerY, -offset, index)
  const bTransform = movement(collision.axis, centerX, centerY, offset, index + 1)

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <ShapeBlock
        color={collision.a}
        width={width}
        height={height}
        radius={index % 2 === 0 ? '50%' : 38}
        transform={`${aTransform} rotate(${-12 + index * 9 + snap * 4}deg) scale(${burstScale})`}
        opacity={clamp(1 - burst * 0.38)}
      />
      <ShapeBlock
        color={collision.b}
        width={width * 0.92}
        height={height * 1.1}
        radius={index % 2 === 0 ? 44 : '50%'}
        transform={`${bTransform} rotate(${16 - index * 8 - snap * 6}deg) scale(${burstScale})`}
        opacity={clamp(1 - burst * 0.38)}
      />
      <div
        style={{
          position: 'absolute',
          left: centerX,
          top: centerY,
          width: 0,
          height: 0,
          opacity: clamp((1 - burst) * 1.2),
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -collision.size * (0.38 + burst * 0.82),
            top: -collision.size * (0.38 + burst * 0.82),
            width: collision.size * (0.76 + burst * 1.64),
            height: collision.size * (0.76 + burst * 1.64),
            borderRadius: '50%',
            border: `${18 - burst * 12}px solid ${collision.c}`,
            transform: `rotate(${frame * 0.8}deg)`,
            mixBlendMode: 'screen',
          }}
        />
        {[0, 1, 2, 3, 4, 5].map(bar => {
          const angle = (Math.PI * 2 * bar) / 6 + index * 0.34
          const distance = ease(burst, [0, 1], [40, 530], Easing.out(Easing.cubic))
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance * 0.68

          return (
            <div
              key={bar}
              style={{
                position: 'absolute',
                left: x - 74,
                top: y - 13,
                width: 148,
                height: 26,
                background: chroma[(bar + index) % chroma.length],
                borderRadius: 999,
                opacity: clamp(0.9 - burst * 0.72),
                transform: `rotate(${angle}rad) scaleX(${1 + burst * 1.7})`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function movement(axis, centerX, centerY, offset, seed) {
  if (axis === 'y') {
    return `translate(${centerX - 260 + seed * 42}px, ${centerY - 210 + offset}px)`
  }

  if (axis === 'diag') {
    return `translate(${centerX - 250 + offset * 0.8}px, ${centerY - 210 + offset * 0.44}px)`
  }

  return `translate(${centerX - 260 + offset}px, ${centerY - 210 + seed * 22}px)`
}

function ShapeBlock({ color, width, height, radius, transform, opacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: radius,
        background: color,
        boxShadow: `0 0 0 12px rgba(255,255,255,0.92) inset`,
        opacity,
        transform,
        mixBlendMode: 'normal',
      }}
    />
  )
}

function PopGeometry({ frame }) {
  return (
    <AbsoluteFill>
      <CornerRings frame={frame} />
      <ModularTiles frame={frame} />
      <RadialSlices frame={frame} />
    </AbsoluteFill>
  )
}

function CornerRings({ frame }) {
  return (
    <>
      {[
        { start: 16, x: -120, y: 650, size: 460, color: palette.yellow },
        { start: 150, x: 1390, y: -140, size: 520, color: palette.cyan },
        { start: 278, x: 1340, y: 710, size: 430, color: palette.magenta },
      ].map((ring, index) => {
        const p = sceneInOut(frame, ring.start, 128, 12, 12)

        return (
          <div
            key={ring.start}
            style={{
              position: 'absolute',
              left: ring.x,
              top: ring.y,
              width: ring.size,
              height: ring.size,
              borderRadius: '50%',
              border: `${34 + index * 8}px solid ${ring.color}`,
              opacity: p * 0.88,
              transform: `scale(${ease(p, [0, 1], [0.68, 1])}) rotate(${frame * (0.18 + index * 0.08)}deg)`,
              background: `conic-gradient(from ${frame * 1.2}deg, transparent 0 18deg, rgba(255,255,255,0.72) 18deg 32deg, transparent 32deg 58deg)`,
              mixBlendMode: 'screen',
            }}
          />
        )
      })}
    </>
  )
}

function ModularTiles({ frame }) {
  const p = sceneInOut(frame, 90, 200, 12, 18)
  const columns = 5
  const rows = 3

  return (
    <div
      style={{
        position: 'absolute',
        left: 390,
        top: 248,
        width: 1160,
        height: 560,
        opacity: p * 0.78,
        transform: `translateY(${ease(p, [0, 1], [60, 0])}px) rotate(${-2 + wave(frame, 0.012) * 1.4}deg)`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        const local = ease(frame, [100 + index * 2, 132 + index * 2], [0, 1], Easing.bezier(0.2, 1, 0.18, 1))
        const color = chroma[(index + row) % chroma.length]
        const isRound = (index + row) % 3 === 0

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: col * 230,
              top: row * 178,
              width: 178,
              height: 134,
              borderRadius: isRound ? 999 : 22,
              background: color,
              opacity: p,
              transform: `translateY(${(1 - local) * 68}px) scale(${0.74 + local * 0.26}) rotate(${(col - row) * 6 + frame * 0.08}deg)`,
              boxShadow: `0 0 0 11px ${palette.white} inset`,
            }}
          />
        )
      })}
    </div>
  )
}

function RadialSlices({ frame }) {
  const p = sceneInOut(frame, 230, 132, 10, 12)

  return (
    <div
      style={{
        position: 'absolute',
        left: 530,
        top: 156,
        width: 860,
        height: 860,
        opacity: p,
        borderRadius: '50%',
        background: `conic-gradient(from ${frame * 3.2}deg, ${palette.cyan} 0 32deg, ${palette.black} 32deg 48deg, ${palette.yellow} 48deg 86deg, ${palette.magenta} 86deg 138deg, ${palette.white} 138deg 162deg, ${palette.blue} 162deg 220deg, ${palette.red} 220deg 292deg, ${palette.green} 292deg 360deg)`,
        transform: `scale(${ease(p, [0, 1], [0.34, 1.1])}) rotate(${frame * -0.32}deg)`,
        boxShadow: `0 0 0 28px ${palette.white} inset, 0 0 0 54px ${palette.black} inset`,
        mixBlendMode: 'normal',
      }}
    />
  )
}

function TypeCuts({ frame }) {
  return (
    <AbsoluteFill>
      {typeCuts.map((cut, index) => {
        const p = sceneInOut(frame, cut.frame, 36, 5, 8)
        const textColor = cut.tone === 'light' ? palette.ink : palette.white
        const subColor = cut.tone === 'light' ? 'rgba(16,16,16,0.62)' : 'rgba(255,253,247,0.62)'

        return (
          <div
            key={cut.label}
            style={{
              position: 'absolute',
              left: cut.x,
              top: cut.y,
              width: 760,
              opacity: p,
              textAlign: cut.align,
              color: textColor,
              transform: `translate(${cut.align === 'center' ? '-50%' : cut.align === 'right' ? '-100%' : '0'}, ${ease(p, [0, 1], [38, 0])}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px 18px 12px',
                background: cut.tone === 'light' ? palette.white : palette.black,
                color: textColor,
                fontSize: 92,
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: 0,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                border: `4px solid ${textColor}`,
                transform: `skewX(${(index % 2 === 0 ? -1 : 1) * 5}deg) scaleX(${1 + hit(frame, cut.frame, 5) * 0.04})`,
              }}
            >
              {cut.label}
            </div>
            <div
              style={{
                marginTop: 12,
                color: subColor,
                fontSize: 24,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: 0,
                textTransform: 'uppercase',
              }}
            >
              {cut.sub}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function FinalLock({ frame, title, subtitle, opacity }) {
  const snap = Math.max(hit(frame, 372, 8), hit(frame, 410, 10))
  const exit = ease(frame, [430, 450], [0, 1], Easing.in(Easing.cubic))

  return (
    <AbsoluteFill
      style={{
        opacity: clamp(opacity - exit),
        background: palette.black,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
          background: `radial-gradient(circle at ${50 + wave(frame, 0.04) * 10}% 50%, rgba(255,255,255,0.13), transparent 25%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 180,
          right: 180,
          top: 220,
          height: 506,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          background: palette.white,
          color: palette.black,
          transform: `translateY(${ease(opacity, [0, 1], [80, 0])}px) scale(${1 + snap * 0.018})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.98,
            background: `linear-gradient(90deg, ${palette.cyan} 0 18%, ${palette.yellow} 18% 34%, ${palette.magenta} 34% 52%, ${palette.green} 52% 66%, ${palette.blue} 66% 83%, ${palette.red} 83% 100%)`,
            clipPath: `polygon(0 ${52 + wave(frame, 0.05) * 5}%, 100% ${38 + wave(frame, 0.06, 2) * 6}%, 100% 100%, 0% 100%)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            transform: `translateY(${-18 + snap * -8}px)`,
          }}
        >
          <div
            style={{
              fontSize: 178,
              fontWeight: 950,
              lineHeight: 0.86,
              letterSpacing: 0,
              color: palette.black,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 0,
              textTransform: 'uppercase',
              color: palette.black,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

function CutFlash({ frame, impact }) {
  const cutFlash = [56, 112, 168, 224, 280, 336, 392].reduce((amount, point) => Math.max(amount, hit(frame, point, 3)), 0)
  const amount = Math.max(impact, cutFlash)

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: palette.white,
        opacity: amount * 0.24,
        mixBlendMode: 'screen',
      }}
    />
  )
}

function FilmSurface({ frame }) {
  const flicker = frame % 7 < 2 ? 0.06 : 0.035

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: flicker,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
        `,
        backgroundSize: '42px 42px, 42px 42px',
        transform: `translate(${-(frame % 42)}px, ${-(frame % 21)}px)`,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
