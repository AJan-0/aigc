import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const palette = {
  black: '#030305',
  ink: '#f7f6f0',
  muted: 'rgba(247,246,240,0.56)',
  hairline: 'rgba(247,246,240,0.12)',
  red: '#ff493f',
  violet: '#8e56ff',
  gold: '#f3bf38',
  pink: '#f286d7',
  blue: '#77c8ff',
}

const workItems = [
  ['AI DRAMA', 'vertical reel system'],
  ['GEN IMAGE', 'prompt-to-shot packaging'],
  ['MOTION SYSTEM', 'brand bumper language'],
  ['SHORT DRAMA', 'hook / scene / rhythm'],
  ['AJAN STUDIO', 'aigc visual direction'],
]

const tickerItems = ['aigc visual', 'ajan studio', 'motion design', 'short drama', 'generated image']

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

function inOut(frame, start, hold, enter = 14, exit = 12) {
  const enterValue = ease(frame, [start, start + enter], [0, 1])
  const exitValue = ease(frame, [start + hold, start + hold + exit], [0, 1], Easing.in(Easing.cubic))
  return clamp(enterValue - exitValue)
}

function hit(frame, point, radius = 6) {
  return clamp(1 - Math.abs(frame - point) / radius)
}

function wave(frame, speed = 0.025, phase = 0) {
  return Math.sin(frame * speed + phase)
}

export function ShowreelMotionBumper({ title = showreelMotionDefaults.title, subtitle = showreelMotionDefaults.subtitle } = {}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const seconds = frame / fps
  const flash = Math.max(hit(frame, 84), hit(frame, 132), hit(frame, 206), hit(frame, 288), hit(frame, 366))
  const roughStep = Math.floor(frame / 3) % 2

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: palette.black,
        color: palette.ink,
        fontFamily: "'Arial Black', Impact, sans-serif",
      }}
    >
      <Backdrop frame={frame} flash={flash} roughStep={roughStep} />
      <Chrome frame={frame} />
      <HeroMark frame={frame} title={title} subtitle={subtitle} />
      <PlayMoment frame={frame} />
      <WorkIndex frame={frame} />
      <PreviewStack frame={frame} />
      <FinalLock frame={frame} title={title} subtitle={subtitle} />
      <Grain frame={frame} seconds={seconds} />
    </AbsoluteFill>
  )
}

function Backdrop({ frame, flash, roughStep }) {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at ${44 + wave(frame, 0.012) * 8}% ${36 + wave(frame, 0.014, 2) * 6}%, rgba(142,86,255,0.12), transparent 24%),
          radial-gradient(circle at ${68 + wave(frame, 0.011, 1) * 10}% ${68 + wave(frame, 0.013, 3) * 7}%, rgba(243,191,56,0.08), transparent 22%),
          linear-gradient(180deg, #040406 0%, #020203 100%)
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08 + flash * 0.08,
          backgroundImage: `radial-gradient(circle at ${roughStep ? 24 : 74}% ${roughStep ? 32 : 70}%, rgba(255,255,255,0.25) 0 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(247,246,240,${flash * 0.07})`,
        }}
      />
    </AbsoluteFill>
  )
}

function Chrome({ frame }) {
  const tickerX = -((frame * 5) % 620)
  const navIn = ease(frame, [0, 24], [0, 1])

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
          transform: `translateY(${ease(navIn, [0, 1], [-20, 0])}px)`,
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
          bottom: 132,
          height: 88,
          overflow: 'hidden',
          borderTop: `1px solid ${palette.hairline}`,
          borderBottom: `1px solid ${palette.hairline}`,
          opacity: 0.98,
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 52,
            color: palette.ink,
            fontSize: 38,
            lineHeight: 1,
            transform: `translateX(${tickerX}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {Array.from({ length: 5 }).flatMap(() => tickerItems).map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
              <span style={{ opacity: index % 3 === 0 ? 0.62 : 1 }}>{item}</span>
              <span style={{ color: [palette.violet, palette.gold, palette.blue, palette.pink][index % 4] }}>◆</span>
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

function HeroMark({ frame, title, subtitle }) {
  const p = inOut(frame, 0, 118, 24, 18)
  const pop = Math.max(hit(frame, 34, 10), hit(frame, 84, 8))
  const y = ease(p, [0, 1], [88, 0])
  const rotate = wave(frame, 0.018) * 1.5 + pop * -2

  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 246 + y,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 18,
          transform: `rotate(${rotate}deg) scale(${0.9 + p * 0.1 + pop * 0.04})`,
        }}
      >
        {title.split('').map((letter, index) => (
          <HeroLetter key={letter} letter={letter} index={index} frame={frame} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 552 + y * 0.3,
          textAlign: 'center',
          color: palette.ink,
          fontSize: 88,
          lineHeight: 0.92,
          textTransform: 'none',
          transform: `translateY(${pop * -8}px) rotate(${wave(frame, 0.02, 2) * -1.8}deg)`,
          textShadow: '0 8px 0 rgba(0,0,0,0.5)',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  )
}

function HeroLetter({ letter, index, frame }) {
  const colors = [palette.red, palette.violet, palette.gold, palette.pink]
  const delays = [0, 7, 12, 17]
  const p = ease(frame, [delays[index], delays[index] + 22], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1))
  const wobble = wave(frame, 0.06, index) * 4
  const styles = [
    { borderRadius: '44% 56% 42% 58%', skew: -4 },
    { borderRadius: 8, skew: 0 },
    { borderRadius: 0, skew: 0 },
    { borderRadius: '50%', skew: 6 },
  ]

  return (
    <div
      style={{
        width: index === 1 ? 136 : 182,
        height: 196,
        display: 'grid',
        placeItems: 'center',
        color: index === 2 ? palette.black : palette.ink,
        background: colors[index % colors.length],
        borderRadius: styles[index]?.borderRadius,
        border: `6px solid ${palette.ink}`,
        fontSize: 168,
        lineHeight: 1,
        transform: `translateY(${ease(p, [0, 1], [180, 0]) + wobble}px) rotate(${[-8, 0, 0, 7][index]}deg) skewX(${styles[index]?.skew || 0}deg) scale(${0.72 + p * 0.28})`,
        boxShadow: '16px 18px 0 rgba(0,0,0,0.44)',
      }}
    >
      {letter}
    </div>
  )
}

function PlayMoment({ frame }) {
  const p = inOut(frame, 76, 74, 10, 10)
  const ring = ease((frame - 76) % 46, [0, 46], [0, 1], Easing.linear)

  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 666,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 138 + ring * 110,
            height: 138 + ring * 110,
            borderRadius: '50%',
            border: `6px solid rgba(247,246,240,${0.34 - ring * 0.3})`,
          }}
        />
        <div
          style={{
            width: 128,
            height: 84,
            display: 'grid',
            placeItems: 'center',
            color: palette.black,
            background: palette.ink,
            fontSize: 54,
            lineHeight: 1,
            transform: `translateY(${ease(p, [0, 1], [38, 0])}px) rotate(${hit(frame, 112, 8) * -4}deg)`,
            boxShadow: '10px 12px 0 rgba(0,0,0,0.42)',
          }}
        >
          play
        </div>
      </div>
    </AbsoluteFill>
  )
}

function WorkIndex({ frame }) {
  const p = inOut(frame, 132, 160, 12, 14)
  const active = Math.floor(ease(frame, [142, 270], [0, workItems.length - 0.001], Easing.linear))

  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 142,
          top: 86,
          color: palette.ink,
          fontSize: 92,
          lineHeight: 0.88,
          filter: 'blur(1.5px)',
          transform: `translateY(${ease(p, [0, 1], [64, 0])}px)`,
        }}
      >
        work
      </div>
      <div
        style={{
          position: 'absolute',
          left: 180,
          right: 180,
          top: 248,
          borderTop: `1px solid ${palette.hairline}`,
        }}
      >
        {workItems.map(([name, meta], index) => {
          const isActive = active === index
          const rowHit = hit(frame, 150 + index * 29, 8)
          return (
            <div
              key={name}
              style={{
                position: 'relative',
                height: 116,
                display: 'grid',
                gridTemplateColumns: '1fr 150px',
                alignItems: 'center',
                borderBottom: `1px solid ${palette.hairline}`,
                transform: `translateX(${isActive ? 24 : 0}px)`,
                opacity: isActive ? 1 : 0.62,
              }}
            >
              <div
                style={{
                  color: palette.ink,
                  fontSize: isActive ? 60 : 50,
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  textShadow: isActive ? `8px 0 0 ${[palette.red, palette.violet, palette.gold, palette.blue, palette.pink][index]}55` : 'none',
                  transform: `translateY(${rowHit * -7}px)`,
                }}
              >
                {name}
                <span
                  style={{
                    marginLeft: 28,
                    color: palette.muted,
                    fontSize: 18,
                    textTransform: 'lowercase',
                  }}
                >
                  {meta}
                </span>
              </div>
              <div
                style={{
                  justifySelf: 'end',
                  width: 82,
                  height: 82,
                  display: 'grid',
                  placeItems: 'center',
                  borderLeft: `1px solid ${palette.hairline}`,
                  color: isActive ? palette.black : palette.ink,
                  background: isActive ? palette.ink : 'transparent',
                  fontSize: 62,
                  lineHeight: 1,
                }}
              >
                ↖
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

function PreviewStack({ frame }) {
  const p = inOut(frame, 268, 112, 16, 12)
  const cards = [
    { x: 174, y: 186, w: 500, h: 310, color: palette.red, label: 'AI DRAMA' },
    { x: 700, y: 262, w: 540, h: 340, color: palette.violet, label: 'GEN IMAGE' },
    { x: 1128, y: 164, w: 500, h: 410, color: palette.gold, label: 'MOTION' },
    { x: 438, y: 606, w: 680, h: 250, color: palette.blue, label: 'SHORT DRAMA' },
  ]

  return (
    <AbsoluteFill style={{ opacity: p }}>
      {cards.map((card, index) => {
        const enter = ease(frame, [270 + index * 10, 292 + index * 10], [0, 1])
        const drift = wave(frame, 0.025, index) * 14
        return (
          <div
            key={card.label}
            style={{
              position: 'absolute',
              left: card.x + drift,
              top: card.y - drift * 0.4,
              width: card.w,
              height: card.h,
              overflow: 'hidden',
              background: '#060609',
              border: `1px solid rgba(247,246,240,0.13)`,
              opacity: enter,
              transform: `translateY(${ease(enter, [0, 1], [88, 0])}px) rotate(${[-3, 2, -2, 1][index]}deg) scale(${0.94 + enter * 0.06})`,
              boxShadow: '0 34px 90px rgba(0,0,0,0.58)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(circle at ${36 + wave(frame, 0.035, index) * 18}% ${42 + wave(frame, 0.03, index) * 16}%, ${card.color}88, transparent 22%),
                  linear-gradient(130deg, rgba(247,246,240,0.16), transparent 44%),
                  #060609
                `,
                filter: 'saturate(1.08)',
                transform: `scale(${1.04 + wave(frame, 0.02, index) * 0.04})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -80 + ((frame * (5 + index)) % (card.w + 180)),
                top: 0,
                width: 92,
                height: '100%',
                background: 'rgba(247,246,240,0.18)',
                transform: 'skewX(-18deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 26,
                bottom: 24,
                color: palette.ink,
                fontSize: 34,
                lineHeight: 0.9,
              }}
            >
              {card.label}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function FinalLock({ frame, title, subtitle }) {
  const p = inOut(frame, 360, 96, 18, 16)
  const split = hit(frame, 392, 12)

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
          transform: `translateY(${ease(p, [0, 1], [72, 0])}px) rotate(${split * -1.5}deg)`,
          textShadow: `${split * 18}px 0 0 ${palette.violet}77, ${-split * 14}px 0 0 ${palette.red}66, 0 12px 0 rgba(0,0,0,0.5)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 476,
          textAlign: 'center',
          color: palette.ink,
          fontSize: 78,
          lineHeight: 1,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 660,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            width: 286,
            height: 90,
            display: 'grid',
            placeItems: 'center',
            color: palette.black,
            background: palette.ink,
            fontSize: 42,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          play work
        </div>
      </div>
    </AbsoluteFill>
  )
}

function Grain({ frame }) {
  const flicker = frame % 5 < 2 ? 0.14 : 0.08
  return (
    <AbsoluteFill
      style={{
        opacity: flicker,
        pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(circle at ${(frame * 13) % 100}% ${(frame * 29) % 100}%, rgba(255,255,255,0.18) 0 1px, transparent 1px),
          radial-gradient(circle at ${(frame * 31) % 100}% ${(frame * 17) % 100}%, rgba(255,255,255,0.12) 0 1px, transparent 1px)
        `,
        backgroundSize: '34px 34px, 57px 57px',
        mixBlendMode: 'screen',
      }}
    />
  )
}
