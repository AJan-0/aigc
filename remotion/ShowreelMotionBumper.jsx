import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const palette = {
  bg: '#020203',
  ink: '#fffdf7',
  acid: '#bfff00',
  red: '#fa340c',
  yellow: '#f7e40f',
  violet: '#9b30ff',
  lavender: '#b39fe3',
  black: '#050506',
}

const majorWords = ['AIGC', 'AJAN STUDIO', 'AI DRAMA', 'MOTION SYSTEM', 'SHORT DRAMA', 'GEN IMAGE']
const chips = ['AIGC', 'AJAN', 'AI DRAMA', 'MOTION', 'SHORT DRAMA', 'GEN IMAGE']
const notes = ['SHOT DNA', 'HOOK BUILD', 'SCENE SYSTEM', 'VERTICAL REEL', 'MOTION PACK']
const colors = [palette.acid, palette.red, palette.yellow, palette.violet, palette.lavender, palette.ink]

export const showreelMotionDefaults = {
  mediaSlots: [
    { id: 'frame-001', src: '', label: 'FRAME 001' },
    { id: 'shot-system', src: '', label: 'SHOT SYSTEM' },
    { id: 'visual-dna', src: '', label: 'VISUAL DNA' },
    { id: 'vertical-cut', src: '', label: 'VERTICAL CUT' },
    { id: 'ai-drama', src: '', label: 'AI DRAMA' },
  ],
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function wave(frame, speed = 1, phase = 0) {
  return (Math.sin(frame * speed + phase) + 1) / 2
}

function pulse(frame, start, duration, easing = Easing.bezier(0.16, 1, 0.3, 1)) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function windowProgress(frame, start, hold, exit = 12) {
  const enter = pulse(frame, start, 12)
  const leave = pulse(frame, start + hold, exit, Easing.in(Easing.cubic))
  return clamp(enter - leave, 0, 1)
}

function mediaSource(src) {
  if (!src) return null
  if (/^(https?:|data:|blob:)/.test(src)) return src
  return staticFile(src.replace(/^\/+/, ''))
}

export function ShowreelMotionBumper({ mediaSlots = showreelMotionDefaults.mediaSlots } = {}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const seconds = frame / fps
  const wordIndex = Math.floor(frame / 32) % majorWords.length
  const altWordIndex = Math.floor((frame + 14) / 30) % majorWords.length
  const flash = frame % 16 < 2 ? 1 : frame % 48 < 3 ? 0.55 : 0
  const snap = frame % 20 < 5 ? 1 : 0

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: 'hidden', fontFamily: "'Arial Black', Impact, sans-serif" }}>
      <Backdrop frame={frame} flash={flash} />
      <ColorCrash frame={frame} />
      <SweepPanels frame={frame} />
      <PhotoStrip frame={frame} mediaSlots={mediaSlots} />
      <PortfolioWindows frame={frame} mediaSlots={mediaSlots} />
      <CutLabels frame={frame} />
      <KineticWord frame={frame} word={majorWords[wordIndex]} color={colors[wordIndex]} secondary={majorWords[altWordIndex]} />
      <DataLayer frame={frame} seconds={seconds} />
      <BeatBars frame={frame} snap={snap} />
      <AigcLetters frame={frame} />
      <CornerMarks frame={frame} />
      <FinalLockup frame={frame} />
    </AbsoluteFill>
  )
}

function ColorCrash({ frame }) {
  const loop = frame % 240
  const blocks = [
    { start: 0, x: -80, y: 232, w: 1020, h: 172, color: palette.acid, rotate: -4 },
    { start: 16, x: 860, y: 96, w: 980, h: 118, color: palette.red, rotate: 3 },
    { start: 48, x: 142, y: 708, w: 820, h: 120, color: palette.violet, rotate: -2 },
    { start: 82, x: 1040, y: 508, w: 720, h: 164, color: palette.yellow, rotate: 4 },
    { start: 126, x: 412, y: 76, w: 660, h: 96, color: palette.lavender, rotate: -6 },
    { start: 178, x: 0, y: 396, w: 1920, h: 86, color: palette.red, rotate: 0 },
    { start: 214, x: 1180, y: 764, w: 860, h: 142, color: palette.acid, rotate: -5 },
  ]

  return (
    <AbsoluteFill>
      {blocks.map((block, index) => {
        const p = windowProgress(loop, block.start, 13, 7)
        const x = block.x + interpolate(p, [0, 1], [index % 2 === 0 ? -340 : 340, 0])
        return (
          <div
            key={`${block.color}-${block.start}`}
            style={{
              position: 'absolute',
              left: x,
              top: block.y,
              width: block.w,
              height: block.h,
              background: block.color,
              opacity: p * 0.34,
              mixBlendMode: index % 2 === 0 ? 'screen' : 'normal',
              transform: `skewX(-16deg) rotate(${block.rotate}deg) scaleX(${0.82 + p * 0.18})`,
              transformOrigin: '50% 50%',
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function Backdrop({ frame, flash }) {
  const sweep = interpolate(frame % 96, [0, 96], [-22, 122])
  const spin = frame * 0.12
  const scale = 1 + wave(frame, 0.035) * 0.05

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at ${44 + wave(frame, 0.025) * 18}% ${38 + wave(frame, 0.02, 2) * 20}%, rgba(191,255,0,0.18), transparent 24%),
          radial-gradient(circle at ${72 - wave(frame, 0.028) * 18}% ${46 + wave(frame, 0.033) * 18}%, rgba(250,52,12,0.16), transparent 26%),
          linear-gradient(180deg, #040405 0%, #09080b 58%, #020203 100%)
        `,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${105 + spin}deg, transparent 0%, rgba(255,253,247,0.07) 45%, transparent 52%)`,
          transform: `translateX(${sweep - 50}%)`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,253,247,0.06) 1px, transparent 1px)',
          backgroundSize: '100% 26px',
          opacity: 0.16 + flash * 0.16,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: palette.ink,
          opacity: flash * 0.08,
        }}
      />
    </AbsoluteFill>
  )
}

function SweepPanels({ frame }) {
  return (
    <AbsoluteFill>
      {Array.from({ length: 8 }).map((_, index) => {
        const start = index * 13
        const p = pulse((frame + index * 6) % 128, start % 52, 18)
        const y = 70 + index * 116
        const width = 280 + index * 88
        const x = interpolate(p, [0, 1], [-520 - index * 40, 2100], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width,
              height: index % 3 === 0 ? 22 : 12,
              background: colors[index % colors.length],
              opacity: 0.28 + (index % 2) * 0.24,
              transform: `skewX(-18deg) rotate(${index % 2 === 0 ? -2 : 2}deg)`,
              boxShadow: `0 0 30px ${colors[index % colors.length]}`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

function PhotoStrip({ frame, mediaSlots }) {
  const reveal = windowProgress(frame % 240, 22, 174, 10)
  const items = [
    { x: 1280, y: 78, w: 318, h: 498, rotate: -4, assetIndex: 0 },
    { x: 1456, y: 246, w: 302, h: 520, rotate: 5, assetIndex: 1 },
    { x: 1120, y: 436, w: 312, h: 468, rotate: -2, assetIndex: 2 },
  ]

  return (
    <AbsoluteFill>
      {items.map((item, index) => {
        const src = mediaSource(mediaSlots?.[item.assetIndex]?.src)
        const scan = ((frame * (4 + index) + index * 120) % item.h) - 80
        return (
          <div
            key={item.assetIndex}
            style={{
              position: 'absolute',
              left: item.x + interpolate(reveal, [0, 1], [220, 0]),
              top: item.y + (frame % 12 < 2 ? 10 : 0),
              width: item.w,
              height: item.h,
              overflow: 'hidden',
              opacity: reveal * 0.82,
              border: `3px solid ${colors[(index + 2) % colors.length]}`,
              background: '#08080a',
              boxShadow: `18px 18px 0 rgba(0,0,0,0.44), 0 0 26px ${colors[(index + 2) % colors.length]}66`,
              transform: `rotate(${item.rotate}deg) skewY(${index % 2 === 0 ? -1.5 : 1.5}deg)`,
            }}
          >
            {src ? (
              <Img
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(1.22) contrast(1.1)',
                  transform: `scale(${1.08 + wave(frame, 0.035, index) * 0.06})`,
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(circle at ${40 + wave(frame, 0.04, index) * 32}% ${42 + wave(frame, 0.03, index + 3) * 34}%, ${colors[(index + 2) % colors.length]}77, transparent 25%),
                    linear-gradient(135deg, rgba(255,253,247,0.16), transparent 45%),
                    repeating-linear-gradient(90deg, rgba(255,253,247,0.08) 0 3px, transparent 3px 48px),
                    #08080a
                  `,
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: scan,
                height: 72,
                background: 'rgba(255,253,247,0.24)',
                mixBlendMode: 'screen',
                transform: 'skewY(-8deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                bottom: 18,
                color: palette.ink,
                fontSize: 24,
                lineHeight: 0.9,
                WebkitTextStroke: '1px rgba(0,0,0,0.45)',
              }}
            >
              {mediaSlots?.[item.assetIndex]?.label || `PHOTO SLOT ${index + 1}`}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function PortfolioWindows({ frame, mediaSlots }) {
  const specs = [
    { x: 118, y: 146, w: 520, h: 324, start: 12, color: palette.red, label: 'FRAME 001', assetIndex: 0 },
    { x: 710, y: 94, w: 462, h: 270, start: 42, color: palette.violet, label: 'SHOT SYSTEM', assetIndex: 1 },
    { x: 1190, y: 214, w: 574, h: 344, start: 72, color: palette.acid, label: 'VISUAL DNA', assetIndex: 2 },
    { x: 414, y: 590, w: 660, h: 304, start: 104, color: palette.yellow, label: 'VERTICAL CUT', assetIndex: 3 },
    { x: 1092, y: 634, w: 560, h: 250, start: 142, color: palette.lavender, label: 'AI DRAMA', assetIndex: 4 },
  ]

  return (
    <AbsoluteFill>
      {specs.map((spec, index) => {
        const p = windowProgress(frame, spec.start, 78)
        const jitter = (frame % 7 < 2 ? 8 : 0) * p
        return (
          <div
            key={spec.label}
            style={{
              position: 'absolute',
              left: spec.x + interpolate(p, [0, 1], [index % 2 === 0 ? -90 : 90, 0]),
              top: spec.y + jitter,
              width: spec.w,
              height: spec.h,
              opacity: p,
              overflow: 'hidden',
              border: `2px solid ${spec.color}`,
              background: `linear-gradient(135deg, rgba(255,253,247,0.06), rgba(255,253,247,0.01)), #08080a`,
              boxShadow: `0 0 46px rgba(0,0,0,0.62), 0 0 28px ${spec.color}55`,
              transform: `rotate(${(index - 2) * 1.1}deg) scale(${0.9 + p * 0.1})`,
            }}
          >
            <PlaceholderFrame
              frame={frame}
              color={spec.color}
              index={index}
              label={mediaSlots?.[spec.assetIndex]?.label || spec.label}
              mediaSlot={mediaSlots?.[spec.assetIndex]}
            />
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function PlaceholderFrame({ frame, color, index, label, mediaSlot }) {
  const bar = ((frame * (3 + index) + index * 70) % 720) - 200
  const zoom = 1 + wave(frame, 0.05, index) * 0.07
  const src = mediaSource(mediaSlot?.src)

  return (
    <>
      {src ? (
        <Img
          src={src}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(1.18) contrast(1.08)',
            transform: `scale(${zoom})`,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at ${35 + wave(frame, 0.04, index) * 36}% ${38 + wave(frame, 0.035, index + 2) * 40}%, ${color}66, transparent 24%),
              linear-gradient(125deg, rgba(255,253,247,0.14), transparent 42%),
              repeating-linear-gradient(90deg, rgba(255,253,247,0.08) 0 2px, transparent 2px 42px)
            `,
            transform: `scale(${zoom})`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(0deg, rgba(2,2,3,0.1), rgba(2,2,3,0.4)), linear-gradient(120deg, transparent, ${color}22 58%, transparent)`,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: bar,
          top: 0,
          width: 84,
          height: '100%',
          background: 'rgba(255,253,247,0.18)',
          transform: 'skewX(-18deg)',
          filter: 'blur(1px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 22,
          color: palette.ink,
          fontSize: 24,
          lineHeight: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 24,
          bottom: 22,
          display: 'flex',
          gap: 10,
        }}
      >
        {[0, 1, 2].map(item => (
          <span
            key={item}
            style={{
              width: 44 + item * 16,
              height: 8,
              background: item === 1 ? color : palette.ink,
              opacity: 0.78,
            }}
          />
        ))}
      </div>
    </>
  )
}

function CutLabels({ frame }) {
  const loop = frame % 240
  const rows = [
    { start: 4, text: '短剧视觉', sub: 'AI DRAMA', x: 78, y: 230, color: palette.acid },
    { start: 38, text: '生成式影像', sub: 'GEN IMAGE', x: 1038, y: 116, color: palette.red },
    { start: 78, text: 'MOTION SYSTEM', sub: 'AJAN STUDIO', x: 126, y: 716, color: palette.violet },
    { start: 128, text: 'SHOT DNA', sub: 'AIGC VISUAL', x: 856, y: 742, color: palette.yellow },
    { start: 184, text: 'LOOP CUT', sub: '08 SECOND BUMPER', x: 1010, y: 372, color: palette.lavender },
  ]

  return (
    <AbsoluteFill>
      {rows.map((row, index) => {
        const p = windowProgress(loop, row.start, 26, 6)
        const skew = index % 2 === 0 ? -7 : 7
        return (
          <div
            key={row.text}
            style={{
              position: 'absolute',
              left: row.x + interpolate(p, [0, 1], [index % 2 === 0 ? -120 : 120, 0]),
              top: row.y + (frame % 8 < 2 ? 8 : 0),
              opacity: p,
              color: row.color,
              textTransform: 'uppercase',
              transform: `skewX(${skew}deg) scale(${0.92 + p * 0.08})`,
              transformOrigin: '0 50%',
              textShadow: '8px 8px 0 rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontSize: 52, lineHeight: 0.84, WebkitTextStroke: `1px ${palette.ink}` }}>
              {row.text}
            </div>
            <div style={{ marginTop: 8, color: palette.ink, fontSize: 20, lineHeight: 1 }}>
              {row.sub}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

function KineticWord({ frame, word, color, secondary }) {
  const scene = Math.floor(frame / 28)
  const local = frame % 28
  const enter = pulse(local, 0, 10, Easing.bezier(0.34, 1.56, 0.64, 1))
  const wipe = pulse(local, 7, 12)
  const exitKick = pulse(local, 21, 7, Easing.in(Easing.cubic))
  const scale = 0.78 + enter * 0.34 - exitKick * 0.12
  const x = interpolate(enter - exitKick, [-1, 0, 1], [220, -120, 0])
  const y = 430 + Math.sin(frame * 0.14) * 10

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 154 + x,
          top: y,
          color: palette.ink,
          fontSize: word.length > 11 ? 128 : word.length > 6 ? 156 : 228,
          lineHeight: 0.82,
          textTransform: 'uppercase',
          opacity: 0.93,
          transform: `scale(${scale}, ${1 + wipe * 0.12}) skewX(${scene % 2 === 0 ? -5 : 5}deg)`,
          WebkitTextStroke: `3px ${color}`,
          textShadow: `10px 12px 0 rgba(0,0,0,0.52), 0 0 38px ${color}77`,
        }}
      >
        {word}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 166 + x + (frame % 6 < 2 ? 18 : -12),
          top: y + 18,
          color,
          fontSize: word.length > 11 ? 128 : word.length > 6 ? 156 : 228,
          lineHeight: 0.82,
          textTransform: 'uppercase',
          opacity: 0.24 + wipe * 0.18,
          transform: `scale(${scale}) skewX(${scene % 2 === 0 ? -5 : 5}deg)`,
          mixBlendMode: 'screen',
        }}
      >
        {word}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 118,
          top: 126,
          width: 530,
          color: 'transparent',
          fontSize: 70,
          lineHeight: 0.9,
          textAlign: 'right',
          textTransform: 'uppercase',
          WebkitTextStroke: `2px ${palette.ink}`,
          opacity: 0.16 + wipe * 0.18,
          transform: `translateX(${interpolate(wipe, [0, 1], [80, 0])}px)`,
        }}
      >
        {secondary}
      </div>
    </AbsoluteFill>
  )
}

function DataLayer({ frame, seconds }) {
  const cursor = Math.floor(frame / 3) % notes.length

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 62,
          color: palette.ink,
          fontSize: 32,
          lineHeight: 1,
        }}
      >
        AJAN STUDIO / AIGC VISUAL ENGINE
      </div>
      <div
        style={{
          position: 'absolute',
          top: 52,
          right: 64,
          color: palette.acid,
          fontSize: 26,
          lineHeight: 1,
        }}
      >
        TC {seconds.toFixed(2).padStart(5, '0')} / 08.00
      </div>
      <div
        style={{
          position: 'absolute',
          left: 64,
          bottom: 68,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {chips.map((chip, index) => (
          <span
            key={chip}
            style={{
              color: index === cursor ? palette.black : palette.ink,
              background: index === cursor ? colors[index] : 'rgba(255,253,247,0.08)',
              border: `1px solid ${index === cursor ? colors[index] : 'rgba(255,253,247,0.22)'}`,
              padding: '12px 16px',
              fontSize: 22,
              lineHeight: 1,
              transform: `translateY(${index === cursor ? -8 : 0}px)`,
            }}
          >
            {chip}
          </span>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 70,
          bottom: 66,
          color: palette.ink,
          fontSize: 42,
          lineHeight: 0.94,
          textAlign: 'right',
        }}
      >
        {notes[(cursor + 1) % notes.length]}
        <br />
        <span style={{ color: colors[cursor], fontSize: 32 }}>{notes[cursor]}</span>
      </div>
    </AbsoluteFill>
  )
}

function BeatBars({ frame, snap }) {
  return (
    <AbsoluteFill>
      {Array.from({ length: 14 }).map((_, index) => {
        const hit = ((frame + index * 3) % 30) < 4
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 0,
              top: 88 + index * 64,
              width: hit ? '100%' : '24%',
              height: hit ? 4 : 2,
              background: colors[index % colors.length],
              opacity: hit ? 0.58 : 0.12,
              transform: `translateX(${hit ? 0 : (frame * (index + 1) * 2) % 1920}px)`,
            }}
          />
        )
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${snap ? 10 : 1}px solid ${snap ? palette.acid : 'rgba(255,253,247,0.12)'}`,
          opacity: snap ? 0.34 : 0.8,
        }}
      />
    </AbsoluteFill>
  )
}

function AigcLetters({ frame }) {
  const letters = [
    ['A', palette.red, 590, 184],
    ['I', palette.violet, 746, 178],
    ['G', palette.yellow, 862, 188],
    ['C', palette.acid, 1022, 184],
  ]
  const reveal = pulse(frame, 168, 22)
  const leave = pulse(frame, 224, 10, Easing.in(Easing.cubic))
  const p = clamp(reveal - leave, 0, 1)

  return (
    <AbsoluteFill>
      {letters.map(([letter, color, x, y], index) => (
        <div
          key={letter}
          style={{
            position: 'absolute',
            left: x,
            top: y + Math.sin(frame * 0.16 + index) * 8,
            color,
            fontSize: 118,
            lineHeight: 1,
            opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) rotate(${(index - 1.5) * 6 + frame * 0.08}deg) scale(${0.7 + p * 0.3})`,
            WebkitTextStroke: `5px ${palette.ink}`,
            textShadow: '10px 10px 0 rgba(0,0,0,0.42)',
          }}
        >
          {letter}
        </div>
      ))}
    </AbsoluteFill>
  )
}

function CornerMarks({ frame }) {
  const pulseAlpha = 0.42 + wave(frame, 0.12) * 0.28
  const markStyle = {
    position: 'absolute',
    width: 126,
    height: 82,
    borderColor: palette.ink,
    opacity: pulseAlpha,
  }

  return (
    <AbsoluteFill>
      <div style={{ ...markStyle, left: 48, top: 42, borderLeft: '4px solid', borderTop: '4px solid' }} />
      <div style={{ ...markStyle, right: 48, top: 42, borderRight: '4px solid', borderTop: '4px solid' }} />
      <div style={{ ...markStyle, left: 48, bottom: 42, borderLeft: '4px solid', borderBottom: '4px solid' }} />
      <div style={{ ...markStyle, right: 48, bottom: 42, borderRight: '4px solid', borderBottom: '4px solid' }} />
    </AbsoluteFill>
  )
}

function FinalLockup({ frame }) {
  const p = pulse(frame, 210, 20, Easing.bezier(0.16, 1, 0.3, 1))
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        background: `radial-gradient(circle at 50% 52%, rgba(191,255,0,${0.14 * p}), transparent 28%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 398,
          color: palette.ink,
          fontSize: 112,
          lineHeight: 0.9,
          textAlign: 'center',
          transform: `translateY(${interpolate(p, [0, 1], [56, 0])}px) scale(${0.9 + p * 0.1})`,
          WebkitTextStroke: `2px ${palette.acid}`,
          textShadow: '0 18px 0 rgba(0,0,0,0.48)',
        }}
      >
        AIGC VISUAL STUDIO
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 528,
          color: palette.lavender,
          fontSize: 40,
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        FAST CUT / SCENE DNA / MOTION PACKAGING
      </div>
    </AbsoluteFill>
  )
}
