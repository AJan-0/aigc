import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import CanvasHeroTitle from './CanvasHeroTitle'
import v1Video from '../../../v1_mobile.mp4'
import v1Cover from '../../../v1_cover.jpg'
import betrayalVideo from '../../../429.mp4'
import betrayalCover from '../../../429_cover.jpg'
import curseVideo from '../../../795.mp4'
import curseCover from '../../../795_cover.jpg'
import rebornVideo from '../../../reborn.mp4'
import rebornCover from '../../../reborn_cover.jpg'
import pickingVideo from '../../../picking.mp4'
import pickingCover from '../../../picking_cover.jpg'

const navItems = [
  { id: 'home', label: 'home', shortLabel: 'h' },
  { id: 'work', label: 'work', shortLabel: 'w' },
  { id: 'about', label: 'about', shortLabel: 'a' },
  { id: 'contact', label: 'contact', shortLabel: 'c' },
]

const tickerItems = ['aigc visual', 'ajan studio', 'ai drama', 'motion system', 'vertical reels']
const brandItems = [
  { label: 'COMFYUI', role: 'node graph / shot DNA', accent: '#bfff00', span: 'wide' },
  { label: 'RUNWAY', role: 'motion draft', accent: '#fa340c' },
  { label: 'KLING', role: 'video generation', accent: '#f7e40f' },
  { label: 'SDXL', role: 'character base', accent: '#b39fe3' },
  { label: 'DAVINCI', role: 'grade / final edit', accent: '#fffdfa', span: 'tall' },
  { label: 'LORA', role: 'identity lock', accent: '#fa7575' },
  { label: 'CONTROLNET', role: 'pose / framing', accent: '#9b30ff', span: 'wide' },
  { label: 'AIGC', role: 'portfolio system', accent: '#bfff00' },
]
const contactEmail = '1248567324@qq.com'
const riveHeroSrc = '/rive/hero-title.riv'
const isRiveHeroEnabled = import.meta.env.VITE_ENABLE_RIVE_HERO === 'true'
const showreelBumperVideo = '/motion/showreel-motion-bumper.mp4'
const showreelBumperPoster = '/motion/showreel-motion-bumper-poster.png'
const RiveHeroTitle = lazy(() => import('./RiveHeroTitle'))
const optionalRiveAssetCache = new Map()

const heroTitleLines = [
  [
    ['A', 'balloon balloon-red mc-glyph-a'],
    ['I', 'balloon balloon-violet mc-glyph-i'],
    ['G', 'balloon balloon-yellow mc-glyph-g'],
    ['C', 'balloon balloon-pink mc-glyph-c'],
  ],
  [
    ['D', 'solid word-white mc-glyph-d'],
    ['e', 'solid word-white mc-glyph-e'],
    ['s', 'solid word-white mc-glyph-s'],
    ['i', 'solid word-white mc-glyph-i-small'],
    ['g', 'solid word-white mc-glyph-g-small'],
    ['n', 'solid mc-glyph-n'],
  ],
  [
    ['P', 'solid word-white mc-glyph-p'],
    ['o', 'solid word-white mc-glyph-o-face'],
    ['r', 'solid word-white mc-glyph-r'],
    ['t', 'solid word-white mc-glyph-t'],
    ['f', 'solid word-white mc-glyph-f'],
    ['o', 'solid word-white mc-glyph-o-cube'],
    ['l', 'solid word-white mc-glyph-l'],
    ['i', 'solid word-white mc-glyph-i-tail'],
    ['o', 'solid word-white mc-glyph-o-last'],
  ],
]

const motionProjects = [
  {
    id: '01',
    slug: 'dreams-lead-to-my-alpha',
    type: 'Vertical AI Drama',
    titleEn: 'Dreams Lead to My Alpha',
    introEn: 'A wolf-romance opener built around fate, desire and escape.',
    cover: v1Cover,
    video: v1Video,
    duration: '0:52',
    tools: ['SDXL', 'ComfyUI', 'LoRA', 'Runway', 'DaVinci Resolve'],
  },
  {
    id: '02',
    slug: 'betrayed-by-the-wolf',
    type: 'AI Short Drama',
    titleEn: 'Betrayed by the Wolf, Claimed by the Alpha',
    introEn: 'A high-emotion drama test for betrayal, possession and continuity.',
    cover: betrayalCover,
    video: betrayalVideo,
    duration: '2:24',
    tools: ['SDXL', 'RealisticVision', 'ControlNet', 'Sound Design'],
  },
  {
    id: '03',
    slug: 'mated-to-the-alpha-curse',
    type: 'Supernatural Romance',
    titleEn: "Mated to the Alpha's Curse",
    introEn: 'A supernatural romance reel about curse, intimacy and shot continuity.',
    cover: curseCover,
    video: curseVideo,
    duration: '1:39',
    tools: ['SDXL', 'ControlNet', 'Img2Img', 'Prompt System'],
  },
  {
    id: '04',
    slug: 'reborn-killers-uncle',
    type: 'AI Romance Drama',
    titleEn: "Reborn This Time I Choose My Killer's Uncle",
    introEn: 'A revenge-romance concept shaped through noir pacing and live-action framing.',
    cover: rebornCover,
    video: rebornVideo,
    duration: '1:24',
    tools: ['ComfyUI', 'LoRA', 'Kling', 'DaVinci Resolve'],
  },
  {
    id: '05',
    slug: 'picking-up-governor',
    type: 'Absurd Drama Concept',
    titleEn: 'Picking Up a Governor from the Street',
    introEn: 'A power-reversal concept mixing street realism and absurd identity contrast.',
    cover: pickingCover,
    video: pickingVideo,
    duration: '1:46',
    tools: ['SDXL', 'Video Generation', 'Editing', 'Color Grade'],
  },
]

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
}

const heroReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.42, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
}

export default function MotionCloneExperience() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [isPageReady, setIsPageReady] = useState(false)
  const pageRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    restDelta: 0.001,
  })

  const videoProjects = useMemo(() => motionProjects, [])
  const activeProject = videoProjects[activeProjectIndex] ?? videoProjects[0]

  useLenis()
  useActiveSectionObserver(setActiveSection)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsPageReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const goToSection = useCallback(id => {
    const target = document.getElementById(id)
    if (!target) return

    if (window.__motionCloneLenis) {
      window.__motionCloneLenis.scrollTo(target, { duration: 1.08, offset: -12 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const moveProject = useCallback(offset => {
    if (videoProjects.length <= 1) return
    setActiveProjectIndex(index => wrap(index + offset, videoProjects.length))
  }, [videoProjects.length])

  return (
    <main className={isPageReady ? 'motion-clone-page is-ready' : 'motion-clone-page'} ref={pageRef}>
      <motion.div className="mc-progress" style={{ scaleX: progressScaleX }} aria-hidden="true" />
      <NoiseLayer />
      <MotionNav activeSection={activeSection} onNavigate={goToSection} />

      <section className="mc-hero" id="home" aria-label="AIGC Design Portfolio hero">
        <div className={shouldReduceMotion ? 'mc-hero-stage' : 'mc-hero-stage has-entry-motion'}>
          <HeroExperience shouldReduceMotion={shouldReduceMotion} scrollYProgress={scrollYProgress} />
        </div>
      </section>

      <HeroTicker />

      <ShowreelSection />

      <WorkSection
        projects={videoProjects}
        activeIndex={activeProjectIndex}
        activeProject={activeProject}
        onActiveIndexChange={setActiveProjectIndex}
        onMoveProject={moveProject}
        onOpenProject={setSelectedProject}
      />

      <AboutSection />
      <BrandSection />
      <ContactSection />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  )
}

function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const html = document.documentElement
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)')
    const mobileWidthQuery = window.matchMedia('(max-width: 808px)')
    let lenis = null
    let frameId = 0

    const shouldUseNativeScroll = () => coarsePointerQuery.matches || mobileWidthQuery.matches

    const destroyLenis = () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }

      if (lenis) {
        if (window.__motionCloneLenis === lenis) delete window.__motionCloneLenis
        lenis.destroy()
        lenis = null
      }

      html.classList.add('mc-native-scroll')
    }

    const startLenis = () => {
      if (lenis || shouldUseNativeScroll()) {
        if (shouldUseNativeScroll()) destroyLenis()
        return
      }

      html.classList.remove('mc-native-scroll')
      lenis = new Lenis({
        duration: 1.06,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.92,
      })

      window.__motionCloneLenis = lenis

      const raf = time => {
        lenis?.raf(time)
        frameId = requestAnimationFrame(raf)
      }

      frameId = requestAnimationFrame(raf)
    }

    const syncScrollMode = () => {
      if (shouldUseNativeScroll()) {
        destroyLenis()
      } else {
        startLenis()
      }
    }

    syncScrollMode()
    coarsePointerQuery.addEventListener('change', syncScrollMode)
    mobileWidthQuery.addEventListener('change', syncScrollMode)

    return () => {
      coarsePointerQuery.removeEventListener('change', syncScrollMode)
      mobileWidthQuery.removeEventListener('change', syncScrollMode)
      destroyLenis()
      html.classList.remove('mc-native-scroll')
    }
  }, [])
}

function useActiveSectionObserver(onChange) {
  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visible?.target?.id) onChange(visible.target.id)
    }, {
      rootMargin: '-22% 0px -58% 0px',
      threshold: [0.08, 0.26, 0.5],
    })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [onChange])
}

function MotionNav({ activeSection, onNavigate }) {
  return (
    <header className="mc-nav">
      <button className="mc-nav-logo" type="button" onClick={() => onNavigate('home')} aria-label="Go to home">
        <LogoMark />
      </button>

      <nav className="mc-nav-links" aria-label="Primary navigation">
        {navItems.slice(1).map(item => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? 'is-active' : ''}
            data-short={item.shortLabel}
            onClick={() => onNavigate(item.id)}
          >
            <NavWord label={item.label} active={activeSection === item.id} />
          </button>
        ))}
      </nav>
    </header>
  )
}

function LogoMark() {
  return (
    <span className="mc-logo-mark" aria-hidden="true">
      <span className="mc-logo-dot is-one" />
      <span className="mc-logo-dot is-two" />
      <span className="mc-logo-stem" />
      <span className="mc-logo-cut is-top" />
      <span className="mc-logo-cut is-bottom" />
    </span>
  )
}

function NavWord({ label, active }) {
  return (
    <span className={active ? 'mc-nav-word is-active' : 'mc-nav-word'}>
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </span>
  )
}

function HeroExperience({ shouldReduceMotion, scrollYProgress }) {
  const assetStatus = useOptionalRiveAsset(riveHeroSrc, isRiveHeroEnabled)
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false)

  useEffect(() => {
    setRuntimeUnavailable(false)
  }, [assetStatus])

  if (shouldReduceMotion) {
    return <HeroMark />
  }

  if (assetStatus !== 'available' || runtimeUnavailable) {
    return <CanvasHeroTitle scrollYProgress={scrollYProgress} />
  }

  return (
    <Suspense fallback={<HeroMark />}>
      <RiveHeroTitle
        src={riveHeroSrc}
        scrollYProgress={scrollYProgress}
        onUnavailable={() => setRuntimeUnavailable(true)}
      />
    </Suspense>
  )
}

function useOptionalRiveAsset(src, enabled) {
  const [status, setStatus] = useState(() => (
    enabled ? optionalRiveAssetCache.get(src)?.status ?? 'checking' : 'unavailable'
  ))

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setStatus('unavailable')
      return undefined
    }

    let isActive = true
    let assetEntry = optionalRiveAssetCache.get(src)

    if (assetEntry?.status && assetEntry.status !== 'checking') {
      setStatus(assetEntry.status)
      return () => {
        isActive = false
      }
    }

    if (!assetEntry?.promise) {
      const promise = fetch(src, {
        method: 'HEAD',
        cache: 'no-store',
        headers: {
          Accept: 'application/octet-stream',
        },
      }).then(response => (
        isRiveAssetResponse(response) ? 'available' : 'unavailable'
      )).catch(() => (
        'unavailable'
      )).then(nextStatus => {
        optionalRiveAssetCache.set(src, { status: nextStatus })
        return nextStatus
      })

      assetEntry = { status: 'checking', promise }
      optionalRiveAssetCache.set(src, assetEntry)
    }

    setStatus('checking')

    assetEntry.promise.then(nextStatus => {
      if (isActive) setStatus(nextStatus)
    })

    return () => {
      isActive = false
    }
  }, [enabled, src])

  return status
}

function isRiveAssetResponse(response) {
  if (!response.ok) return false

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  return !contentType.includes('text/html')
}

function HeroMark() {
  const [burstId, setBurstId] = useState(0)
  const [isBursting, setIsBursting] = useState(false)
  const [isPointerActive, setIsPointerActive] = useState(false)
  const markRef = useRef(null)
  const lastBurstRef = useRef(0)
  const lastTouchBurstRef = useRef(0)
  const pointerFrameRef = useRef(0)
  const pendingPointerRef = useRef(null)

  const triggerBurst = useCallback((force = false) => {
    const now = window.performance?.now?.() ?? Date.now()
    if (!force && now - lastBurstRef.current < 260) return

    lastBurstRef.current = now
    setIsBursting(true)
    setBurstId(value => (value + 1) % 997)
  }, [])

  useEffect(() => {
    if (!isBursting) return undefined

    const timeoutId = window.setTimeout(() => {
      setIsBursting(false)
    }, 1260)

    return () => window.clearTimeout(timeoutId)
  }, [burstId, isBursting])

  useEffect(() => () => {
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current)
  }, [])

  const commitPointerVars = useCallback(() => {
    pointerFrameRef.current = 0

    const mark = markRef.current
    const nextPointer = pendingPointerRef.current
    if (!mark || !nextPointer) return

    mark.style.setProperty('--title-x', `${nextPointer.titleX}px`)
    mark.style.setProperty('--title-y', `${nextPointer.titleY}px`)
    mark.style.setProperty('--tilt-x', `${nextPointer.tiltX}deg`)
    mark.style.setProperty('--tilt-y', `${nextPointer.tiltY}deg`)
    mark.style.setProperty('--spot-x', `${nextPointer.spotX}%`)
    mark.style.setProperty('--spot-y', `${nextPointer.spotY}%`)
    mark.style.setProperty('--drift-x-pointer', `${nextPointer.driftX}px`)
    mark.style.setProperty('--drift-y-pointer', `${nextPointer.driftY}px`)
  }, [])

  const updatePointerVars = useCallback(event => {
    const mark = markRef.current
    if (!mark) return

    const rect = mark.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1)
    const y = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1)

    pendingPointerRef.current = {
      titleX: Math.round(x * 18),
      titleY: Math.round(y * 12),
      tiltX: Number((-y * 1.8).toFixed(2)),
      tiltY: Number((x * 2.4).toFixed(2)),
      spotX: Number((50 + x * 18).toFixed(2)),
      spotY: Number((48 + y * 16).toFixed(2)),
      driftX: Math.round(x * -16),
      driftY: Math.round(y * -12),
    }

    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(commitPointerVars)
    }
  }, [commitPointerVars])

  const resetPointerVars = useCallback(() => {
    const mark = markRef.current
    if (!mark) return

    mark.style.setProperty('--title-x', '0px')
    mark.style.setProperty('--title-y', '0px')
    mark.style.setProperty('--tilt-x', '0deg')
    mark.style.setProperty('--tilt-y', '0deg')
    mark.style.setProperty('--spot-x', '50%')
    mark.style.setProperty('--spot-y', '48%')
    mark.style.setProperty('--drift-x-pointer', '0px')
    mark.style.setProperty('--drift-y-pointer', '0px')
  }, [])

  const handlePointerEnter = event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setIsPointerActive(true)
      updatePointerVars(event)
      triggerBurst(true)
    }
  }

  const handlePointerMove = event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') updatePointerVars(event)
  }

  const handlePointerLeave = () => {
    setIsPointerActive(false)
    pendingPointerRef.current = null
    resetPointerVars()
  }

  const handlePointerDown = event => {
    if (event.pointerType === 'mouse') return

    lastTouchBurstRef.current = window.performance?.now?.() ?? Date.now()
    triggerBurst(true)
  }

  const handleClick = () => {
    const now = window.performance?.now?.() ?? Date.now()
    if (now - lastTouchBurstRef.current < 420) return

    triggerBurst(true)
  }

  const handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    triggerBurst(true)
  }

  const markClassName = [
    'mc-hero-mark',
    isBursting ? `is-chaos-${burstId % 2 === 0 ? 'a' : 'b'}` : '',
    isPointerActive ? 'is-pointer-active' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={markRef}
      className={markClassName}
      aria-label="AIGC Design Portfolio"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <h1 className="mc-hero-title" aria-label="AIGC Design Portfolio">
        {heroTitleLines.map((line, lineIndex) => (
          <span
            className={lineIndex === 0 ? `mc-hero-line mc-hero-line-${lineIndex + 1}` : `mc-hero-line mc-hero-line-${lineIndex + 1} mc-hero-plain-line`}
            aria-hidden="true"
            key={`line-${lineIndex}`}
          >
            {lineIndex > 0 ? line.map(([letter]) => letter).join('') : line.map(([letter, variant], letterIndex) => {
              const glyphIndex = heroTitleLines
                .slice(0, lineIndex)
                .reduce((count, currentLine) => count + currentLine.length, 0) + letterIndex
              const lineDelay = [60, 180, 270][lineIndex] ?? 0
              const lineCenter = (line.length - 1) / 2
              const fromCenter = letterIndex - lineCenter
              const scatterScale = lineIndex === 0 ? 24 : lineIndex === 1 ? 15 : 11
              const phaseX = Math.round(fromCenter * scatterScale + ((glyphIndex % 3) - 1) * 10)
              const phaseY = Math.round((glyphIndex % 2 === 0 ? -1 : 1) * (lineIndex === 0 ? 24 : 15) + (lineIndex - 1) * 8)
              const gatherX = Math.round(-fromCenter * (lineIndex === 0 ? 11 : 8))
              const gatherY = Math.round((1 - lineIndex) * 10)
              const phaseRotation = ((glyphIndex % 5) - 2) * (lineIndex === 0 ? 7 : 3)
              const phaseRotationSoft = Number((phaseRotation * 0.55).toFixed(2))
              const phaseRotationCounter = Number((phaseRotation * -0.24).toFixed(2))
              const counterX = Math.round(phaseX * -0.24)
              const counterY = Math.round(phaseY * -0.18)
              const settleX = Math.round(phaseX * -0.16)
              const settleY = Math.round(phaseY * -0.16)
              const phaseScale = lineIndex === 0 ? 1.08 : lineIndex === 1 ? 1.035 : 1.025
              const randomUnit = salt => {
                const raw = Math.sin((burstId + 1) * (glyphIndex + 2) * (salt + 3.73)) * 10000
                return raw - Math.floor(raw)
              }
              const jumpRange = lineIndex === 0 ? 46 : 30
              const jumpX = Math.round((randomUnit(1) - 0.5) * jumpRange)
              const jumpY = Math.round((randomUnit(2) - 0.58) * (lineIndex === 0 ? 58 : 34))
              const jumpRotation = Math.round((randomUnit(3) - 0.5) * (lineIndex === 0 ? 28 : 16))
              const jumpSkew = Math.round((randomUnit(4) - 0.5) * 14)
              const jumpScaleX = Number((0.88 + randomUnit(5) * 0.34).toFixed(2))
              const jumpScaleY = Number((0.88 + randomUnit(6) * 0.38).toFixed(2))
              const twitchX = Math.round((randomUnit(7) - 0.5) * 14)
              const twitchY = Math.round((randomUnit(8) - 0.5) * 16)
              const phaseXReverse = Math.round(phaseX * -0.18)
              const phaseRotationInverse = Number((phaseRotationSoft * -1).toFixed(2))
              const phaseRotationRise = Number((phaseRotationSoft * -0.65).toFixed(2))
              const phaseRotationSnap = Number((phaseRotationSoft * 1.4).toFixed(2))
              const jumpXSnap = Math.round(jumpX * -0.2)
              const jumpXReverse = Math.round(jumpX * -0.72)
              const jumpYPop = Math.round(jumpY - 12)
              const jumpYSoft = Math.round(jumpY * 0.42)
              const jumpRotationSnap = Number((jumpRotation * -0.32).toFixed(2))
              const jumpRotationReturn = Number((jumpRotation * -0.46).toFixed(2))
              const jumpRotationLean = Number((jumpRotation * 0.7).toFixed(2))
              const jumpRotationBounce = Number((jumpRotation * -0.52).toFixed(2))
              const jumpSkewSoft = Number((jumpSkew * 0.42).toFixed(2))
              const jumpSkewReverse = Number((jumpSkew * -0.5).toFixed(2))
              const jumpSkewWideReverse = Number((jumpSkew * -0.7).toFixed(2))
              const jumpSkewHalf = Number((jumpSkew * 0.5).toFixed(2))
              const twitchYDrop = Math.round(twitchY + 16)
              const settleXWide = Math.round(settleX * 1.3)
              const settleYUp = Math.round(settleY - 4)
              const settleYLand = Math.round(settleY + 8)

              return (
                <span
                  className={`mc-hero-glyph mc-glyph-${variant}`}
                  data-letter={letter}
                  key={`${lineIndex}-${letter}-${letterIndex}`}
                  style={{
                    '--glyph-delay': `${lineDelay + letterIndex * 24}ms`,
                    '--glyph-loop-delay': `${1080 + glyphIndex * 72}ms`,
                    '--phase-delay': `${glyphIndex * 86}ms`,
                    '--phase-x': `${phaseX}px`,
                    '--phase-y': `${phaseY}px`,
                    '--phase-rotation': `${phaseRotation}deg`,
                    '--phase-rotation-soft': `${phaseRotationSoft}deg`,
                    '--phase-rotation-counter': `${phaseRotationCounter}deg`,
                    '--phase-x-reverse': `${phaseXReverse}px`,
                    '--phase-rotation-inverse': `${phaseRotationInverse}deg`,
                    '--phase-rotation-rise': `${phaseRotationRise}deg`,
                    '--phase-rotation-snap': `${phaseRotationSnap}deg`,
                    '--phase-scale': phaseScale,
                    '--gather-x': `${gatherX}px`,
                    '--gather-y': `${gatherY}px`,
                    '--counter-x': `${counterX}px`,
                    '--counter-y': `${counterY}px`,
                    '--settle-x': `${settleX}px`,
                    '--settle-y': `${settleY}px`,
                    '--jump-x': `${jumpX}px`,
                    '--jump-y': `${jumpY}px`,
                    '--jump-x-snap': `${jumpXSnap}px`,
                    '--jump-x-reverse': `${jumpXReverse}px`,
                    '--jump-y-pop': `${jumpYPop}px`,
                    '--jump-y-soft': `${jumpYSoft}px`,
                    '--jump-rotation': `${jumpRotation}deg`,
                    '--jump-rotation-snap': `${jumpRotationSnap}deg`,
                    '--jump-rotation-return': `${jumpRotationReturn}deg`,
                    '--jump-rotation-lean': `${jumpRotationLean}deg`,
                    '--jump-rotation-bounce': `${jumpRotationBounce}deg`,
                    '--jump-skew': `${jumpSkew}deg`,
                    '--jump-skew-soft': `${jumpSkewSoft}deg`,
                    '--jump-skew-reverse': `${jumpSkewReverse}deg`,
                    '--jump-skew-wide-reverse': `${jumpSkewWideReverse}deg`,
                    '--jump-skew-half': `${jumpSkewHalf}deg`,
                    '--jump-scale-x': jumpScaleX,
                    '--jump-scale-y': jumpScaleY,
                    '--twitch-x': `${twitchX}px`,
                    '--twitch-y': `${twitchY}px`,
                    '--twitch-y-drop': `${twitchYDrop}px`,
                    '--settle-x-wide': `${settleXWide}px`,
                    '--settle-y-up': `${settleYUp}px`,
                    '--settle-y-land': `${settleYLand}px`,
                    '--pop-delay': `${glyphIndex * 18}ms`,
                  }}
                >
                  {letter}
                </span>
              )
            })}
          </span>
        ))}
      </h1>
      <div className="mc-hero-drifters" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <p className="mc-hero-caption">
        AIGC Design Portfolio. AI film direction, short drama hooks and finished motion packaging.
      </p>
      <div className="mc-hero-signal" aria-hidden="true">
        <span>ai film direction</span>
        <span>scene systems</span>
        <span>motion packaging</span>
      </div>
    </div>
  )
}

function HeroTicker() {
  const content = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <div className="mc-ticker" aria-hidden="true">
      <div className="mc-ticker-track">
        {content.map((item, index) => (
          <span className="mc-ticker-item" key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function ShowreelSection() {
  const videoRef = useAutoplayVideo('showreel-motion-bumper')

  return (
    <section className="mc-showreel mc-section" id="showreel" aria-label="AIGC motion bumper loop">
      <motion.div
        className="mc-video-shell"
        initial={{ opacity: 0, y: 60, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      >
        <img className="mc-video-poster" src={showreelBumperPoster} alt="" aria-hidden="true" loading="eager" decoding="async" />
        <video
          ref={videoRef}
          src={showreelBumperVideo}
          poster={showreelBumperPoster}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          aria-label="AIGC visual studio motion bumper"
        />
      </motion.div>
    </section>
  )
}

function WorkSection({ projects: workProjects, activeIndex, activeProject, onActiveIndexChange, onMoveProject, onOpenProject }) {
  const progress = workProjects.length ? ((activeIndex + 1) / workProjects.length) * 100 : 0
  const listRef = useRef(null)
  const rowRefs = useRef([])
  const scrollFrameRef = useRef(0)
  const programmaticScrollRef = useRef(0)
  const wasDraggingPreviewRef = useRef(false)
  const previewPointerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 808px)').matches) return

    const list = listRef.current
    const row = rowRefs.current[activeIndex]
    if (!list || !row) return

    const targetLeft = row.offsetLeft - (list.clientWidth - row.clientWidth) / 2
    programmaticScrollRef.current += 1
    list.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })

    const timeoutId = window.setTimeout(() => {
      programmaticScrollRef.current = Math.max(0, programmaticScrollRef.current - 1)
    }, 520)

    return () => window.clearTimeout(timeoutId)
  }, [activeIndex])

  useEffect(() => () => {
    if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current)
  }, [])

  const syncActiveProjectFromScroll = () => {
    if (programmaticScrollRef.current > 0) return
    if (scrollFrameRef.current) return

    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = 0

      const list = listRef.current
      if (!list || !window.matchMedia('(max-width: 808px)').matches) return

      const listRect = list.getBoundingClientRect()
      const listCenter = listRect.left + listRect.width / 2
      let closestIndex = activeIndex
      let closestDistance = Number.POSITIVE_INFINITY

      rowRefs.current.forEach((row, index) => {
        if (!row) return
        const rowRect = row.getBoundingClientRect()
        const rowCenter = rowRect.left + rowRect.width / 2
        const distance = Math.abs(rowCenter - listCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex !== activeIndex) onActiveIndexChange(closestIndex)
    })
  }

  const handlePreviewPointerDown = event => {
    previewPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: window.performance.now(),
    }
    wasDraggingPreviewRef.current = false
  }

  const handlePreviewPointerMove = event => {
    const start = previewPointerRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (Math.abs(deltaX) > 16 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      wasDraggingPreviewRef.current = true
    }
  }

  const handlePreviewPointerUp = event => {
    const start = previewPointerRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const elapsed = Math.max(1, window.performance.now() - start.time)
    const velocityX = Math.abs(deltaX) / elapsed
    const shouldMove = Math.abs(deltaX) > 72 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35

    if (shouldMove || (Math.abs(deltaX) > 42 && velocityX > 0.55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2)) {
      onMoveProject(deltaX < 0 ? 1 : -1)
      wasDraggingPreviewRef.current = true
      window.setTimeout(() => {
        wasDraggingPreviewRef.current = false
      }, 90)
    }

    previewPointerRef.current = null
  }

  const handlePreviewPointerCancel = () => {
    previewPointerRef.current = null
    window.setTimeout(() => {
      wasDraggingPreviewRef.current = false
    }, 90)
  }

  const handleRowAction = (project, index) => {
    if (index !== activeIndex) {
      onActiveIndexChange(index)
      return
    }

    onOpenProject(project)
  }

  if (!workProjects.length) return null

  return (
    <section className="mc-work mc-section" id="work" aria-label="Selected AIGC work">
      <div className="mc-work-inner">
        <motion.div
          className="mc-work-heading"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.55 }}
        >
          <p className="mc-kicker">work</p>
          <h2>Work shaped for motion.</h2>
        </motion.div>

        <div className="mc-work-layout">
          <motion.div
            className="mc-work-preview"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-work-preview-top">
              <span className="mc-work-count">{activeProject.id} / {String(workProjects.length).padStart(2, '0')}</span>
              <div className="mc-work-controls">
                <button type="button" onClick={() => onMoveProject(-1)} aria-label="Previous reel">
                  <span aria-hidden="true" />
                </button>
                <div aria-hidden="true">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <button type="button" onClick={() => onMoveProject(1)} aria-label="Next reel">
                  <span aria-hidden="true" />
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.button
                type="button"
                key={activeProject.slug}
                className="mc-cover-card"
                onClick={() => {
                  if (wasDraggingPreviewRef.current) return
                  onOpenProject(activeProject)
                }}
                onPointerDown={handlePreviewPointerDown}
                onPointerMove={handlePreviewPointerMove}
                onPointerUp={handlePreviewPointerUp}
                onPointerCancel={handlePreviewPointerCancel}
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.985 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                <img className="mc-cover-fallback" src={activeProject.cover} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <PreviewVideo project={activeProject} />
                <span>{activeProject.id}</span>
              </motion.button>
            </AnimatePresence>
          </motion.div>

          <div className="mc-work-content">
            <div
              className="mc-work-list"
              role="listbox"
              aria-label="AIGC reel list"
              ref={listRef}
              onScroll={syncActiveProjectFromScroll}
            >
              {workProjects.map((project, index) => (
                <motion.button
                  ref={node => {
                    rowRefs.current[index] = node
                  }}
                  key={project.slug}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  aria-label={`${index === activeIndex ? 'Open' : 'Select'} ${project.titleEn}`}
                  className={index === activeIndex ? 'mc-work-row is-active' : 'mc-work-row'}
                  onMouseEnter={() => onActiveIndexChange(index)}
                  onFocus={() => onActiveIndexChange(index)}
                  onClick={() => handleRowAction(project, index)}
                  onKeyDown={event => {
                    if (event.key === 'ArrowLeft') {
                      event.preventDefault()
                      onMoveProject(-1)
                    }

                    if (event.key === 'ArrowRight') {
                      event.preventDefault()
                      onMoveProject(1)
                    }
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.42, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mc-work-row-index">{project.id}</span>
                  <strong className="mc-work-title" data-title={project.titleEn}>
                    <span>{project.titleEn}</span>
                  </strong>
                  <small className="mc-work-meta">
                    <span>{project.type} / {project.duration}</span>
                    <em aria-hidden="true">{index === activeIndex ? 'open reel' : 'select reel'}</em>
                  </small>
                  <i aria-hidden="true" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PreviewVideo({ project }) {
  const videoRef = useAutoplayVideo(project.slug)

  return (
    <video
      ref={videoRef}
      src={project.video}
      poster={project.cover}
      muted
      loop
      autoPlay
      playsInline
      preload="metadata"
      webkit-playsinline="true"
      x5-playsinline="true"
      x5-video-player-type="h5"
      x5-video-player-fullscreen="false"
      aria-label={`${project.titleEn} preview`}
    />
  )
}

function useAutoplayVideo(resetKey) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let disposed = false
    let retryTimer = 0

    const playMuted = () => {
      if (disposed || !video) return

      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      video.playsInline = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('x5-playsinline', 'true')
      video.setAttribute('x5-video-player-type', 'h5')
      video.setAttribute('x5-video-player-fullscreen', 'false')
      video.preload = 'auto'

      const playPromise = video.play()
      if (playPromise?.catch) {
        playPromise.catch(() => {
          if (disposed) return
          retryTimer = window.setTimeout(() => {
            if (!disposed) video.play().catch(() => {})
          }, 220)
        })
      }
    }

    const handleReady = () => playMuted()
    const handleVisibility = () => {
      if (!document.hidden) playMuted()
    }

    if (video.readyState >= 2) {
      playMuted()
    } else {
      video.load()
      playMuted()
    }

    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('canplay', handleReady)
    video.addEventListener('error', handleReady)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      disposed = true
      if (retryTimer) window.clearTimeout(retryTimer)
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('error', handleReady)
      document.removeEventListener('visibilitychange', handleVisibility)
      video.pause()
    }
  }, [resetKey])

  return videoRef
}

function AboutSection() {
  const principles = [
    ['Hook', 'Compress story intent into a visual first impression.'],
    ['Continuity', 'Keep character, costume, lighting and scene DNA aligned.'],
    ['Delivery', 'Package the reel for platform pacing and review.'],
  ]

  return (
    <section className="mc-about mc-section" id="about" aria-label="About AJan">
      <motion.div
        className="mc-about-copy"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.42 }}
      >
        <p className="mc-kicker">about</p>
        <h2>Not generated shots. A working motion system.</h2>
        <p>
          AJan builds AIGC short-drama reels around hooks, scene rules, character consistency and final packaging.
          The page mirrors that process with fixed motion navigation, kinetic type, auto-playing previews and fast project switching.
        </p>
      </motion.div>

      <motion.div
        className="mc-principles"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {principles.map(([title, body]) => (
          <motion.article key={title} variants={reveal} whileHover={{ y: -8 }}>
            <SimpleBadge label={title} />
            <p>{body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

function BrandSection() {
  return (
    <section className="mc-brands mc-section" aria-label="Workflow tools and brand grid">
      <motion.div
        className="mc-brand-heading"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="mc-kicker">system</p>
        <h2>Tools, models and delivery marks.</h2>
      </motion.div>
      <motion.div
        className="mc-brand-grid"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        {brandItems.map((brand, index) => (
          <motion.article
            className={brand.span ? `mc-brand-tile is-${brand.span}` : 'mc-brand-tile'}
            key={brand.label}
            variants={reveal}
            style={{
              '--tile-accent': brand.accent,
              '--tile-delay': `${index * 0.12}s`,
            }}
          >
            <span className="mc-brand-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{brand.label}</strong>
            <small>{brand.role}</small>
            <i aria-hidden="true" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="mc-contact mc-section" id="contact" aria-label="Contact">
      <motion.div
        className="mc-contact-panel"
        initial={{ opacity: 0, y: 38, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mc-kicker">contact</p>
        <h2>Let&apos;s shape an AI reel that feels finished.</h2>
        <a href={`mailto:${contactEmail}`}><span>{contactEmail}</span></a>
      </motion.div>
    </section>
  )
}

function SimpleBadge({ label }) {
  return (
    <span className="mc-simple-badge">
      <span aria-hidden="true" />
      {label}
    </span>
  )
}

function ProjectModal({ project, onClose }) {
  const videoRef = useAutoplayVideo(project?.slug)

  useEffect(() => {
    if (!project) return undefined
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [onClose, project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="mc-modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="mc-modal-scrim" type="button" onClick={onClose} aria-label="Close project details" />
          <motion.article
            className="mc-project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.titleEn}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="mc-modal-close" type="button" onClick={onClose} aria-label="Close project details">
              <span aria-hidden="true" />
            </button>
            <div className="mc-modal-media">
              <video
                ref={videoRef}
                src={project.video}
                poster={project.cover}
                muted
                controls
                autoPlay
                playsInline
                preload="auto"
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
                onClick={event => toggleInlineVideo(event.currentTarget)}
              />
            </div>
            <div className="mc-modal-copy">
              <p className="mc-kicker">{project.type}</p>
              <h2>{project.titleEn}</h2>
              <p>{project.introEn}</p>
              <div>
                {project.tools.map(tool => <span key={tool}>{tool}</span>)}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NoiseLayer() {
  return <div className="mc-noise" aria-hidden="true" />
}

function wrap(value, length) {
  return ((value % length) + length) % length
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function toggleInlineVideo(video) {
  if (!video) return

  if (video.paused || video.ended) {
    if (video.ended) video.currentTime = 0
    video.play().catch(() => {})
    return
  }

  video.pause()
}
