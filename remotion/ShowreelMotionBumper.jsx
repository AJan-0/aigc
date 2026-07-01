import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const palette = {
  black: '#020204',
  ink: '#f8f7f2',
  muted: 'rgba(248,247,242,0.56)',
  hairline: 'rgba(248,247,242,0.12)',
  red: '#ff493f',
  violet: '#8e56ff',
  gold: '#f3bf38',
  pink: '#f286d7',
  blue: '#77c8ff',
  acid: '#bfff00',
}

const chroma = [palette.red, palette.violet, palette.gold, palette.blue, palette.pink, palette.acid]
const tickerItems = ['color burst', 'light collision', 'chroma bloom', 'aigc visual', 'motion rhythm']
const sceneWords = [
  { frame: 52, title: 'COLOR BURST', meta: 'spectrum impact' },
  { frame: 134, title: 'LIGHT COLLISION', meta: 'fast chroma bloom' },
  { frame: 224, title: 'RADIANT FIELD', meta: 'clean motion surface' },
  { frame: 314, title: 'AIGC VISUAL', meta: 'directed generative color' },
]
const impacts = [
  { frame: 34, x: 0.34, y: 0.42, colorA: palette.red, colorB: palette.violet, size: 1.08 },
  { frame: 86, x: 0.62, y: 0.36, colorA: palette.gold, colorB: palette.blue, size: 0.94 },
  { frame: 144, x: 0.5, y: 0.55, colorA: palette.pink, colorB: palette.acid, size: 1.2 },
  { frame: 214, x: 0.38, y: 0.48, colorA: palette.blue, colorB: palette.violet, size: 1.05 },
  { frame: 286, x: 0.66, y: 0.44, colorA: palette.red, colorB: palette.gold, size: 1.1 },
  { frame: 356, x: 0.5, y: 0.5, colorA: palette.ink, colorB: palette.acid, size: 1.28 },
]

export const showreelMotionDefaults = {
  title: 'AIGC',
  subtitle: 'Design Portfolio',
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

function hit(frame, point, radius = 8) {
  return clamp(1 - Math.abs(frame - point) / radius)
}

function phase(frame, start, duration) {
  return clamp((frame - start) / duration)
}

function inOut(frame, start, hold, enter = 14, exit = 12) {
  const enterValue = ease(frame, [start, start + enter], [0, 1])
  const exitValue = ease(frame, [start + hold, start + hold + exit], [0, 1], Easing.in(Easing.cubic))
  return clamp(enterValue - exitValue)
}

function wave(frame, speed = 0.025, offset = 0) {
  return Math.sin(frame * speed + offset)
}

export function ShowreelMotionBumper({
  title = showreelMotionDefaults.title,
  subtitle = showreelMotionDefaults.subtitle,
} = {}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const seconds = frame / fps
  const flash = impacts.reduce((amount, impact) => Math.max(amount, hit(frame, impact.frame, 7)), 0)

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: palette.black,
        color: palette.ink,
        fontFamily: "'Arial Black', Impact, sans-serif",
      }}
    >
      <Backdrop frame={frame} flash={flash} />
      <RibbonField frame={frame} flash={flash} />
      <ImpactField frame={frame} />
      <ParticleField frame={frame} seconds={seconds} />
      <KineticTitle frame={frame} title={title} subtitle={subtitle} />
      <SceneWords frame={frame} />
      <FinalLock frame={frame} title={title} subtitle={subtitle} />
      <Chrome frame={frame} />
      <Grain frame={frame} />
    </AbsoluteFill>
  )
}

function Backdrop({ frame, flash }) {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at ${50 + wave(frame, 0.01) * 6}% ${42 + wave(frame, 0.012, 2) * 5}%, rgba(255,255,255,${0.04 + flash * 0.08}), transparent 24%),
          radial-gradient(circle at ${24 + wave(frame, 0.009, 1) * 9}% ${24 + wave(frame, 0.011, 3) * 7}%, rgba(142,86,255,0.16), transparent 28%),
          radial-gradient(circle at ${76 + wave(frame, 0.011, 4) * 8}% ${70 + wave(frame, 0.01, 5) * 7}%, rgba(255,73,63,0.12), transparent 26%),
          linear-gradient(180deg, #08080b 0%, #010102 76%)
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16 + flash * 0.12,
          backgroundImage: `
            linear-gradient(rgba(248,247,242,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,247,242,0.028) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px',
          transform: `translate(${-(frame % 96)}px, ${-(frame % 48)}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(248,247,242,${flash * 0.08})`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  )
}

function RibbonField({ frame, flash }) {
  return (
    <AbsoluteFill>
      {Array.from({ length: 9 }).map((_, index) => {
        const color = chroma[index % chroma.length]
        const y = 150 + index * 88 + wave(frame, 0.015 + index * 0.002, index) * 34
        const travel = (frame * (9 + index * 0.8) + index * 170) % 2500
        const x = travel - 420
        const width = 420 + (index % 3) * 180
        const opacity = 0.15 + hit(frame, 40 + index * 39, 28) * 0.38 + flash * 0.08

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width,
              height: 22 + (index % 4) * 7,
              borderRadius: 999,
              opacity,
              background: `linear-gradient(90deg, transparent, ${color}, rgba(248,247,242,0.88), transparent)`,
              filter: `blur(${index % 2 === 0 ? 9 : 15}px) saturate(${1.14 + flash * 0.3})`,
              mixBlendMode: 'screen',
              transform: `rotate(${-18 + index * 4 + wave(frame, 0.01, index) * 3}deg) scaleX(${1 + flash * 0.16})`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function ImpactField({ frame }) {
  return (
    <AbsoluteFill>
      {impacts.map((impact, index) => (
        <ImpactBurst frame={frame} impact={impact} index={index} key={impact.frame} />
      ))}
    </AbsoluteFill>
  )
}

function ImpactBurst({ frame, impact, index }) {
  const p = phase(frame, impact.frame, 74)
  const active = frame >= impact.frame - 4 && frame <= impact.frame + 86
  if (!active) return null

  const snap = hit(frame, impact.frame, 5)
  const ring = ease(p, [0, 1], [80, 940 * impact.size], Easing.out(Easing.cubic))
  const bloom = Math.sin(p * Math.PI)
  const x = impact.x * 1920
  const y = impact.y * 1080

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        opacity: clamp((1 - p) * 1.2),
        mixBlendMode: 'screen',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -ring / 2,
          top: -ring / 2,
          width: ring,
          height: ring,
          borderRadius: '50%',
          border: `${Math.max(3, 18 * (1 - p))}px solid ${impact.colorA}`,
          opacity: 0.56 + snap * 0.34,
          filter: `blur(${6 + p * 16}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -ring * 0.35,
          top: -ring * 0.35,
          width: ring * 0.7,
          height: ring * 0.7,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(248,247,242,0.95), ${impact.colorB} 28%, transparent 68%)`,
          opacity: bloom,
          filter: `blur(${16 + p * 30}px)`,
          transform: `scale(${0.32 + p * 1.35})`,
        }}
      />
      {Array.from({ length: 18 }).map((_, particle) => {
        const angle = (Math.PI * 2 * particle) / 18 + index * 0.33
        const distance = ease(p, [0, 1], [10, 520 + (particle % 5) * 76], Easing.out(Easing.cubic))
        const px = Math.cos(angle) * distance
        const py = Math.sin(angle) * distance * 0.62
        const color = particle % 2 === 0 ? impact.colorA : impact.colorB

        return (
          <div
            key={particle}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: 54 - p * 32,
              height: 10 + (particle % 3) * 6,
              borderRadius: 999,
              background: color,
              opacity: clamp((1 - p) * (0.88 + snap * 0.4)),
              filter: 'blur(4px)',
              transform: `rotate(${angle}rad) scaleX(${1 + p * 1.8})`,
            }}
          />
        )
      })}
    </div>
  )
}

function ParticleField({ frame, seconds }) {
  return (
    <AbsoluteFill>
      {Array.from({ length: 48 }).map((_, index) => {
        const loop = ((frame + index * 17) % 150) / 150
        const drift = ease(loop, [0, 1], [0, 1], Easing.linear)
        const baseX = ((index * 137) % 1920) + wave(frame, 0.007, index) * 60
        const baseY = ((index * 83) % 900) + 80
        const x = baseX + Math.cos(index * 1.7) * drift * 140
        const y = baseY - drift * 90 + Math.sin(seconds * 1.8 + index) * 22
        const size = 5 + (index % 7) * 3

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: index % 3 === 0 ? 2 : 999,
              background: chroma[index % chroma.length],
              opacity: 0.12 + (1 - drift) * 0.34,
              filter: 'blur(0.4px)',
              mixBlendMode: 'screen',
              transform: `rotate(${index * 21 + frame * 1.2}deg)`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function KineticTitle({ frame, title, subtitle }) {
  const p = inOut(frame, 0, 120, 22, 16)
  const burst = Math.max(hit(frame, 34, 10), hit(frame, 86, 8))
  const y = ease(p, [0, 1], [90, 0])

  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 220 + y,
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          transform: `translateY(${burst * -18}px) scale(${0.92 + p * 0.08 + burst * 0.02})`,
        }}
      >
        {title.split('').map((letter, index) => (
          <HeroLetter key={`${letter}-${index}`} letter={letter} index={index} frame={frame} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 554 + y * 0.24,
          textAlign: 'center',
          color: palette.ink,
          fontSize: 84,
          lineHeight: 1,
          letterSpacing: 0,
          transform: `translateY(${burst * -8}px)`,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 678,
          textAlign: 'center',
          color: palette.muted,
          fontSize: 22,
          lineHeight: 1,
          letterSpacing: 0,
          textTransform: 'lowercase',
        }}
      >
        color systems in motion
      </div>
    </AbsoluteFill>
  )
}

function HeroLetter({ letter, index, frame }) {
  const p = ease(frame, [index * 6, index * 6 + 24], [0, 1], Easing.bezier(0.2, 1, 0.22, 1))
  const impact = Math.max(hit(frame, 34 + index * 8, 8), hit(frame, 86 - index * 4, 8))
  const color = chroma[index % chroma.length]

  return (
    <div
      style={{
        position: 'relative',
        width: index === 1 ? 128 : 186,
        height: 202,
        display: 'grid',
        placeItems: 'center',
        color: index === 2 ? palette.black : palette.ink,
        background: `linear-gradient(145deg, ${color}, rgba(248,247,242,0.92))`,
        border: `5px solid rgba(248,247,242,${0.82 + impact * 0.12})`,
        borderRadius: [42, 10, 18, 90][index],
        fontSize: 168,
        lineHeight: 1,
        letterSpacing: 0,
        overflow: 'hidden',
        transform: `translateY(${ease(p, [0, 1], [130, 0]) + wave(frame, 0.06, index) * 3 - impact * 18}px) rotate(${[-5, 0, -1, 6][index]}deg) scale(${0.76 + p * 0.24 + impact * 0.035})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -60,
          opacity: 0.36 + impact * 0.28,
          background: `radial-gradient(circle at ${40 + wave(frame, 0.03, index) * 28}% 42%, rgba(255,255,255,0.9), transparent 18%)`,
          mixBlendMode: 'screen',
        }}
      />
      <span style={{ position: 'relative' }}>{letter}</span>
    </div>
  )
}

function SceneWords({ frame }) {
  return (
    <AbsoluteFill>
      {sceneWords.map((word, index) => {
        const p = inOut(frame, word.frame, 46, 8, 10)
        const accent = chroma[index % chroma.length]
        const scan = ease(frame, [word.frame, word.frame + 48], [-260, 260], Easing.out(Easing.cubic))

        return (
          <div
            key={word.title}
            style={{
              position: 'absolute',
              left: 132,
              top: 168 + index * 126,
              width: 760,
              height: 108,
              overflow: 'hidden',
              opacity: p,
              transform: `translateX(${ease(p, [0, 1], [-60, 0])}px)`,
            }}
          >
            <div
              style={{
                color: palette.ink,
                fontSize: 62,
                lineHeight: 0.94,
                letterSpacing: 0,
                textTransform: 'uppercase',
              }}
            >
              {word.title}
            </div>
            <div
              style={{
                marginTop: 14,
                color: palette.muted,
                fontSize: 22,
                lineHeight: 1,
                letterSpacing: 0,
                textTransform: 'lowercase',
              }}
            >
              {word.meta}
            </div>
            <div
              style={{
                position: 'absolute',
                left: scan,
                top: 0,
                width: 150,
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                opacity: 0.64,
                filter: 'blur(10px)',
                transform: 'skewX(-18deg)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function FinalLock({ frame, title, subtitle }) {
  const p = inOut(frame, 348, 88, 18, 14)
  const split = Math.max(hit(frame, 356, 11), hit(frame, 398, 10))

  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 292,
          textAlign: 'center',
          color: palette.ink,
          fontSize: 178,
          lineHeight: 0.85,
          letterSpacing: 0,
          transform: `translateY(${ease(p, [0, 1], [72, 0])}px) scale(${1 + split * 0.018})`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            color: palette.ink,
            WebkitTextStroke: `2px rgba(248,247,242,${0.28 + split * 0.42})`,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 476,
          textAlign: 'center',
          color: palette.ink,
          fontSize: 76,
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 642,
          width: 420,
          height: 92,
          display: 'grid',
          placeItems: 'center',
          color: palette.black,
          background: palette.ink,
          fontSize: 40,
          lineHeight: 1,
          letterSpacing: 0,
          whiteSpace: 'nowrap',
          transform: `translateX(-50%) translateY(${ease(p, [0, 1], [38, 0])}px)`,
        }}
      >
        play the color
      </div>
    </AbsoluteFill>
  )
}

function Chrome({ frame }) {
  const navIn = ease(frame, [0, 24], [0, 1])
  const tickerX = -((frame * 5.8) % 760)

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 46,
          width: 52,
          height: 52,
          opacity: navIn,
          transform: `translateY(${ease(navIn, [0, 1], [-18, 0])}px)`,
        }}
      >
        <LogoMark />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 74,
          top: 56,
          display: 'flex',
          gap: 42,
          opacity: navIn,
          color: palette.ink,
          fontSize: 25,
          lineHeight: 1,
          letterSpacing: 0,
          textTransform: 'lowercase',
        }}
      >
        <span>work</span>
        <span>about</span>
        <span>contact</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 118,
          height: 100,
          overflow: 'hidden',
          borderTop: `1px solid ${palette.hairline}`,
          borderBottom: `1px solid ${palette.hairline}`,
          background: 'rgba(2,2,4,0.62)',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 52,
            color: palette.ink,
            fontSize: 36,
            lineHeight: 1.12,
            letterSpacing: 0,
            transform: `translateX(${tickerX}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {Array.from({ length: 5 }).flatMap(() => tickerItems).map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
              <span style={{ color: index % 3 === 0 ? 'rgba(248,247,242,0.68)' : palette.ink }}>{item}</span>
              <span
                style={{
                  width: 12,
                  height: 12,
                  display: 'inline-block',
                  background: chroma[index % chroma.length],
                  transform: 'rotate(45deg)',
                }}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}

function LogoMark() {
  return (
    <div style={{ position: 'relative', width: 52, height: 52 }}>
      {[0, 1, 2].map(index => (
        <span
          key={index}
          style={{
            position: 'absolute',
            left: 0,
            top: 4 + index * 17,
            width: 14,
            height: 14,
            background: palette.ink,
            borderRadius: index === 1 ? 0 : 7,
          }}
        />
      ))}
      <span
        style={{
          position: 'absolute',
          right: 0,
          top: 4,
          width: 32,
          height: 18,
          background: palette.ink,
          borderRadius: '14px 2px 2px 14px',
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 0,
          bottom: 4,
          width: 32,
          height: 18,
          background: palette.ink,
          borderRadius: '14px 2px 2px 14px',
        }}
      />
    </div>
  )
}

function Grain({ frame }) {
  const flicker = frame % 5 < 2 ? 0.1 : 0.055
  return (
    <AbsoluteFill
      style={{
        opacity: flicker,
        pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(circle at ${(frame * 13) % 100}% ${(frame * 29) % 100}%, rgba(255,255,255,0.15) 0 1px, transparent 1px),
          radial-gradient(circle at ${(frame * 31) % 100}% ${(frame * 17) % 100}%, rgba(255,255,255,0.1) 0 1px, transparent 1px)
        `,
        backgroundSize: '34px 34px, 57px 57px',
        mixBlendMode: 'screen',
      }}
    />
  )
}
