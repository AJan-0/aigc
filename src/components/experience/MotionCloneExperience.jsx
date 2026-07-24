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
  { label: 'COMFYUI', role: '节点工作流 / 视觉生产管线', accent: '#bfff00', span: 'wide' },
  { label: 'SEEDANCE 2.0', role: '电影感视频生成 / 动态设计', accent: '#fa340c' },
  { label: 'GPT IMAGE', role: '概念视觉 / 图像精修', accent: '#f7e40f' },
  { label: 'STORYBOARD SYSTEM', role: '镜头规划 / 场景拆解', accent: '#b39fe3', span: 'wide' },
  { label: 'LORA TRAINING', role: '角色一致性 / 定制风格模型', accent: '#fa75f0' },
  { label: 'VIBE CODING', role: 'AI 辅助工具与界面原型', accent: '#9b30ff' },
  { label: 'POST-PRODUCTION PIPELINE', role: '剪辑 / 声音 / 调色 / 交付', accent: '#fffdfa', span: 'wide' },
  { label: 'ASSET SYSTEM', role: '可复用 IP 素材 / 生产资源库', accent: '#bfff00', span: 'wide' },
]
const contactEmail = '1248567324@qq.com'
const riveHeroSrc = '/rive/hero-title.riv'
const isRiveHeroEnabled = import.meta.env.VITE_ENABLE_RIVE_HERO === 'true'
const showreelBumperVersion = '20260702-fluid-rhythm'
const showreelBumperVideo = `/motion/showreel-motion-bumper.mp4?v=${showreelBumperVersion}`
const showreelBumperPoster = `/motion/showreel-motion-bumper-poster.png?v=${showreelBumperVersion}`
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
    type: '竖屏 AI 短剧',
    titleEn: 'Dreams Lead to My Alpha',
    introZh: '以命运、欲望与逃离为核心的狼人爱情短剧开场。',
    cover: v1Cover,
    video: v1Video,
    duration: '0:52',
    year: '2026',
    role: 'AI 导演 / 工作流设计',
    tools: ['SDXL', 'ComfyUI', 'LoRA', 'Runway', 'DaVinci Resolve'],
    tags: ['AI 短剧', '狼人爱情', '竖屏叙事'],
    hook: '命运驱动的狼人爱情',
    value: '快速建立情绪钩子',
    challenge:
      '开场需要把抽象的“命运感”转化为清晰的镜头，让观众停下来、理解人物关系，并期待下一段剧情。',
    approach:
      '我用近景、低照度、肢体语言和竖屏构图压缩第一幕节奏，让爱情关系先于世界观信息被观众理解。',
    outcome:
      '形成了一套可复用的竖屏 AI 爱情短剧开场模板，能够快速建立明确的情绪入口。',
    metrics: [
      { label: '镜头数', value: '42' },
      { label: '迭代次数', value: '237' },
      { label: '画幅', value: '9:16' },
    ],
  },
  {
    id: '02',
    slug: 'betrayed-by-the-wolf',
    type: 'AI 真人短剧',
    titleEn: 'Betrayed by the Wolf, Claimed by the Alpha',
    introZh: '围绕背叛、占有与角色连续性展开的高情绪短剧测试。',
    cover: betrayalCover,
    video: betrayalVideo,
    duration: '2:24',
    year: '2026',
    role: 'AI 短剧视觉导演',
    tools: ['SDXL', 'RealisticVision', 'ControlNet', 'Sound Design'],
    tags: ['背叛冲突', '角色连续性', '海外短剧'],
    hook: '从背叛到占有的关系转折',
    value: '保持高情绪连续性',
    challenge:
      '短剧需要迅速建立背叛、压迫与吸引力，但生成式人脸和微表情的不稳定很容易中断情绪线。',
    approach:
      '我通过构图、姿态、光线与声音设计维持情绪压力，并用后期处理修正不稳定的生成片段。',
    outcome:
      '沉淀出一套通过氛围控制高情绪 AI 短剧场景的方法。',
    metrics: [
      { label: '镜头数', value: '38' },
      { label: '时长', value: '2:24' },
      { label: '核心情绪', value: '背叛' },
    ],
  },
  {
    id: '03',
    slug: 'mated-to-the-alpha-curse',
    type: '超自然爱情短剧',
    titleEn: "Mated to the Alpha's Curse",
    introZh: '围绕诅咒、亲密关系与镜头连续性的超自然爱情短片。',
    cover: curseCover,
    video: curseVideo,
    duration: '1:39',
    year: '2026',
    role: '角色与场景连续性工作流',
    tools: ['SDXL', 'ControlNet', 'Img2Img', 'Prompt System'],
    tags: ['超自然爱情', '连续性控制', '场景 DNA'],
    hook: '由诅咒推动的亲密关系',
    value: '统一的场景 DNA',
    challenge:
      '多个独立生成的镜头需要呈现为同一部影片，而不是一组风格相近但彼此割裂的海报。',
    approach:
      '我锁定色彩、光源、服装逻辑和场景规则，再围绕最稳定的连续性锚点完成剪辑。',
    outcome:
      '建立了一套适用于暗调超自然爱情题材的“场景 DNA”规则。',
    metrics: [
      { label: '镜头数', value: '56' },
      { label: '时长', value: '1:39' },
      { label: '系统', value: 'DNA' },
    ],
  },
  {
    id: '04',
    slug: 'reborn-killers-uncle',
    type: 'AI 复仇爱情短剧',
    titleEn: "Reborn This Time I Choose My Killer's Uncle",
    introZh: '通过黑色电影节奏与真人影视构图呈现的重生复仇爱情概念。',
    cover: rebornCover,
    video: rebornVideo,
    duration: '1:24',
    year: '2026',
    role: 'AI 短剧视觉包装',
    tools: ['ComfyUI', 'LoRA', 'Kling', 'DaVinci Resolve'],
    tags: ['重生复仇', '黑色爱情', '海外短剧'],
    hook: '重生后的关系选择',
    value: '黑色预告片节奏',
    challenge:
      '重生复仇的设定需要在短时间内交代身份、危险与选择，避免影片只剩氛围而缺少清晰叙事。',
    approach:
      '我利用人物调度、明暗对比、剪辑节奏和黑色电影调色区分权力位置，让关系代价更容易被理解。',
    outcome:
      '形成了一套紧凑的黑色爱情预告片结构，用于包装 AI 生成短剧概念。',
    metrics: [
      { label: '时长', value: '1:24' },
      { label: '影调', value: 'Noir' },
      { label: '类型', value: '短剧' },
    ],
  },
  {
    id: '05',
    slug: 'picking-up-governor',
    type: '荒诞题材概念片',
    titleEn: 'Picking Up a Governor from the Street',
    introZh: '将街头现实感与身份反差结合的权力逆转概念短片。',
    cover: pickingCover,
    video: pickingVideo,
    duration: '1:46',
    year: '2026',
    role: '概念预告片导演',
    tools: ['SDXL', 'Video Generation', 'Editing', 'Color Grade'],
    tags: ['荒诞设定', '权力逆转', '概念预告片'],
    hook: '街头语境中的权力逆转',
    value: '清晰传达高概念设定',
    challenge:
      '荒诞设定如果缺少现实支点，很容易失去可信度，因此街头质感与身份反转必须同时成立。',
    approach:
      '我保留环境的真实触感，并明确服装与身份层级，用视觉反差推动核心概念。',
    outcome:
      '完成了一次具有现实质感的高概念短剧提案测试。',
    metrics: [
      { label: '时长', value: '1:46' },
      { label: '钩子', value: '权力反转' },
      { label: '风格', value: '街头现实' },
    ],
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

      <section className="mc-hero" id="home" aria-label="AIGC 设计作品集首页">
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
      <button className="mc-nav-logo" type="button" onClick={() => onNavigate('home')} aria-label="返回首页">
        <LogoMark />
      </button>

      <nav className="mc-nav-links" aria-label="主导航">
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
  const [showVideoPlayPrompt, setShowVideoPlayPrompt] = useState(true)

  const playShowreelVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    requestInlineVideoPlay(video)
      .then(played => setShowVideoPlayPrompt(!played))
      .catch(() => setShowVideoPlayPrompt(true))
  }, [videoRef])

  return (
    <section className="mc-showreel mc-section" id="showreel" aria-label="AIGC 动态视觉片头">
      <motion.div
        className={showVideoPlayPrompt ? 'mc-video-shell has-play-prompt' : 'mc-video-shell is-playing'}
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
          onCanPlay={playShowreelVideo}
          onLoadedData={playShowreelVideo}
          onPause={() => setShowVideoPlayPrompt(true)}
          onPlay={() => setShowVideoPlayPrompt(false)}
          onPlaying={() => setShowVideoPlayPrompt(false)}
          aria-label="AIGC 视觉工作室动态片头"
        />
        {showVideoPlayPrompt && (
          <button
            className="mc-video-play"
            type="button"
            onClick={playShowreelVideo}
            onPointerDown={playShowreelVideo}
            aria-label="播放动态片头"
          >
            <span aria-hidden="true" />
          </button>
        )}
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
    }

    onOpenProject(project)
  }

  if (!workProjects.length) return null

  return (
    <section className="mc-work mc-section" id="work" aria-label="AIGC 精选作品">
      <div className="mc-work-inner">
        <motion.div
          className="mc-work-heading"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.55 }}
        >
          <p className="mc-kicker mc-kicker--section">Work</p>
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
                <button type="button" onClick={() => onMoveProject(-1)} aria-label="上一个作品">
                  <span aria-hidden="true" />
                </button>
                <div aria-hidden="true">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <button type="button" onClick={() => onMoveProject(1)} aria-label="下一个作品">
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
              aria-label="AIGC 作品列表"
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
                  aria-label={`查看作品：${project.titleEn}，时长 ${project.duration}`}
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
                  <strong className="mc-work-title" data-title={project.titleEn}>
                    <span>{project.titleEn}</span>
                  </strong>
                  <small className="mc-work-meta">
                    <span>{project.duration}</span>
                    <em lang="zh-CN">查看详情</em>
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
      aria-label={`${project.titleEn} 作品预览`}
    />
  )
}

function useAutoplayVideo(resetKey) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let disposed = false

    const playMuted = () => {
      if (disposed || !video) return

      requestInlineVideoPlay(video).catch(() => {})
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

    video.addEventListener('loadedmetadata', handleReady)
    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('canplay', handleReady)
    video.addEventListener('canplaythrough', handleReady)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      disposed = true
      video.removeEventListener('loadedmetadata', handleReady)
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('canplaythrough', handleReady)
      document.removeEventListener('visibilitychange', handleVisibility)
      video.pause()
    }
  }, [resetKey])

  return videoRef
}

function AboutSection() {
  const [activePrinciple, setActivePrinciple] = useState(0)
  const aboutTitleWords = ['Quiet', 'observer.', 'Relentless', 'maker.']
  const principles = [
    {
      title: 'Observation',
      body: '在生成第一帧前，先捕捉人物情绪、视觉张力与故事信号。',
      signal: 'INFJ 视角',
      accent: 'var(--mc-lavender)',
    },
    {
      title: 'Drive',
      body: '从好奇出发，通过持续测试，把想法推进为可观看、可交付的 AI 视频成片。',
      signal: '自驱型',
      accent: 'var(--mc-acid)',
    },
    {
      title: 'Continuity',
      body: '让角色、场景、风格和节奏在连续生成镜头中保持统一。',
      signal: '角色锁定',
      accent: 'var(--mc-pink)',
    },
    {
      title: 'Pipeline',
      body: '把提示词、模型、剪辑与素材沉淀为可复用的生产系统。',
      signal: 'AIGC 系统',
      accent: 'var(--mc-red)',
    },
  ]
  const active = principles[activePrinciple]

  return (
    <section className="mc-about mc-section" id="about" aria-label="关于 AJan">
      <motion.div
        className="mc-about-main"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.42 }}
      >
        <div className="mc-about-copy">
          <p className="mc-kicker mc-kicker--section">About me</p>
          <h2 className="mc-about-title" aria-label="Quiet observer. Relentless maker." tabIndex={0}>
            {aboutTitleWords.map((word, index) => (
              <span
                className="mc-about-word"
                data-word={word}
                aria-hidden="true"
                key={word + '-' + index}
                style={{ '--word-index': index }}
              >
                {word}
              </span>
            ))}
          </h2>
          <p lang="zh-CN">
            我是 2026 届毕业生，专注于 AIGC 视频与海外短剧制作。我的工作覆盖故事钩子、视觉方向、模型工作流、
            角色一致性、动态生成与后期制作，并将这些环节整理为可复用的创作流程。
          </p>
        </div>

        <motion.div
          className="mc-principles"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          aria-label="创作能力"
        >
          {principles.map((item, index) => (
            <motion.button
              type="button"
              className={`mc-principle-card${activePrinciple === index ? ' is-active' : ''}`}
              key={item.title}
              variants={reveal}
              whileHover={{ y: -8 }}
              whileFocus={{ y: -8 }}
              onClick={() => setActivePrinciple(index)}
              onFocus={() => setActivePrinciple(index)}
              onMouseEnter={() => setActivePrinciple(index)}
              aria-pressed={activePrinciple === index}
              aria-controls="about-portrait-note"
              style={{ '--principle-accent': item.accent }}
            >
              <span className="mc-principle-index">{String(index + 1).padStart(2, '0')}</span>
              <SimpleBadge label={item.title} />
              <p lang="zh-CN">{item.body}</p>
              <small lang="zh-CN">{item.signal}</small>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <motion.figure
        className="mc-about-portrait"
        style={{ '--portrait-accent': active.accent }}
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <img src="/ajan-about-portrait.jpg" alt="AJan 个人照片" loading="lazy" />
        <div className="mc-about-portrait-meta" aria-hidden="true">
          <span lang="zh-CN">2026 应届生</span>
          <span>INFJ</span>
          <span lang="zh-CN">自驱型</span>
        </div>
        <figcaption id="about-portrait-note">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <span lang="zh-CN">{active.signal}</span>
              <strong>{active.title}</strong>
              <p lang="zh-CN">{active.body}</p>
            </motion.div>
          </AnimatePresence>
        </figcaption>
      </motion.figure>
    </section>
  )
}

function BrandSection() {
  return (
    <section className="mc-brands mc-section" aria-label="AI 工作流与能力系统">
      <motion.div
        className="mc-brand-heading"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="mc-kicker mc-kicker--section">Capabilities</p>
        <h2>AI production stack and asset pipeline.</h2>
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
            <small lang="zh-CN">{brand.role}</small>
            <i aria-hidden="true" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="mc-contact mc-section" id="contact" aria-label="联系 AJan">
      <motion.div
        className="mc-contact-panel"
        initial={{ opacity: 0, y: 38, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mc-kicker mc-kicker--section">Contact</p>
        <h2 lang="zh-CN">一起把 AI 影像做到真正可交付。</h2>
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
  const videoRef = useRef(null)
  const playRequestIdRef = useRef(0)
  const userPausedRef = useRef(false)
  const controlsHideTimerRef = useRef(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoWaiting, setIsVideoWaiting] = useState(false)
  const [isVideoControlsVisible, setIsVideoControlsVisible] = useState(false)
  const metaItems = [
    ['职责', project?.role],
    ['时长', project?.duration],
    ['年份', project?.year],
    ['叙事钩子', project?.hook],
    ['项目价值', project?.value],
  ].filter(([, value]) => Boolean(value))
  const detailSections = [
    ['项目挑战', project?.challenge],
    ['解决思路', project?.approach],
    ['最终产出', project?.outcome],
  ].filter(([, value]) => Boolean(value))
  const metrics = Array.isArray(project?.metrics) ? project.metrics : []

  const syncVideoState = useCallback(video => {
    if (!video) return
    setIsVideoPlaying(!video.paused && !video.ended)
    setIsVideoWaiting(video.readyState < 3 && !video.paused && !video.ended)
  }, [])

  const clearVideoControlsTimer = useCallback(() => {
    if (!controlsHideTimerRef.current) return
    window.clearTimeout(controlsHideTimerRef.current)
    controlsHideTimerRef.current = 0
  }, [])

  const showVideoControls = useCallback(({ autoHide = false } = {}) => {
    clearVideoControlsTimer()
    setIsVideoControlsVisible(true)

    if (!autoHide) return

    controlsHideTimerRef.current = window.setTimeout(() => {
      setIsVideoControlsVisible(false)
      controlsHideTimerRef.current = 0
    }, 900)
  }, [clearVideoControlsTimer])

  const hideVideoControls = useCallback(() => {
    clearVideoControlsTimer()
    setIsVideoControlsVisible(false)
  }, [clearVideoControlsTimer])

  const playModalVideo = useCallback((video, { force = false } = {}) => {
    if (!video) return Promise.resolve(false)

    if (force) userPausedRef.current = false
    if (userPausedRef.current) {
      syncVideoState(video)
      showVideoControls()
      return Promise.resolve(false)
    }

    if (!video.paused && !video.ended) {
      syncVideoState(video)
      hideVideoControls()
      return Promise.resolve(true)
    }

    const requestId = playRequestIdRef.current + 1
    playRequestIdRef.current = requestId
    setIsVideoWaiting(true)
    showVideoControls()

    const canContinue = () => (
      playRequestIdRef.current === requestId
      && !userPausedRef.current
      && videoRef.current === video
    )

    return requestInlineVideoPlay(video, canContinue)
      .then(played => {
        if (!canContinue()) {
          if (userPausedRef.current && !video.paused) video.pause()
          return false
        }

        syncVideoState(video)
        if (played) {
          hideVideoControls()
        } else {
          setIsVideoWaiting(false)
          showVideoControls()
        }
        return played
      })
      .catch(() => {
        if (canContinue()) {
          setIsVideoWaiting(false)
          showVideoControls()
        }
        return false
      })
  }, [hideVideoControls, showVideoControls, syncVideoState])

  const handleVideoToggle = useCallback(event => {
    event.preventDefault()
    event.stopPropagation()

    const video = videoRef.current
    if (!video) return

    if (!video.paused && !video.ended) {
      userPausedRef.current = true
      playRequestIdRef.current += 1
      setIsVideoWaiting(false)
      video.pause()
      syncVideoState(video)
      showVideoControls()
      return
    }

    userPausedRef.current = false
    if (video.ended) video.currentTime = 0
    showVideoControls()
    playModalVideo(video, { force: true })
  }, [playModalVideo, showVideoControls, syncVideoState])
  const handleVideoControlReveal = useCallback(() => {
    const video = videoRef.current
    if (!video || video.paused || video.ended) return

    showVideoControls({ autoHide: true })
  }, [showVideoControls])


  const handleVideoFullscreen = useCallback(event => {
    event.preventDefault()
    event.stopPropagation()

    const video = videoRef.current
    if (!video) return

    userPausedRef.current = false
    playRequestIdRef.current += 1
    requestInlineVideoFullscreen(video)
    syncVideoState(video)
  }, [syncVideoState])

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

  useEffect(() => {
    userPausedRef.current = false
    playRequestIdRef.current += 1
    setIsVideoPlaying(false)
    setIsVideoWaiting(false)
    setIsVideoControlsVisible(false)

    const video = videoRef.current
    if (!project || !video) return undefined

    const playWhenReady = () => {
      if (userPausedRef.current) return
      playModalVideo(video)
    }

    if (video.readyState < 1) {
      try {
        video.load()
      } catch {}
    }
    playWhenReady()

    const handleVisibility = () => {
      if (!document.hidden && video.paused && !userPausedRef.current) playWhenReady()
    }

    video.addEventListener('loadedmetadata', playWhenReady)
    video.addEventListener('loadeddata', playWhenReady)
    video.addEventListener('canplay', playWhenReady)
    video.addEventListener('canplaythrough', playWhenReady)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      userPausedRef.current = true
      playRequestIdRef.current += 1
      video.removeEventListener('loadedmetadata', playWhenReady)
      video.removeEventListener('loadeddata', playWhenReady)
      video.removeEventListener('canplay', playWhenReady)
      video.removeEventListener('canplaythrough', playWhenReady)
      document.removeEventListener('visibilitychange', handleVisibility)
      clearVideoControlsTimer()
      video.pause()
    }
  }, [clearVideoControlsTimer, playModalVideo, project])

  const isVideoControlButtonVisible = isVideoWaiting || !isVideoPlaying || isVideoControlsVisible
  const modalMediaClassName = [
    'mc-modal-media',
    isVideoPlaying ? 'is-playing' : 'is-paused',
    isVideoWaiting ? 'is-waiting' : '',
    isVideoControlButtonVisible ? 'is-controls-visible' : '',
  ].filter(Boolean).join(' ')

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="mc-modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="mc-modal-scrim" type="button" onClick={onClose} aria-label="关闭项目详情" />
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
            <button className="mc-modal-close" type="button" onClick={onClose} aria-label="关闭项目详情">
              <span aria-hidden="true" />
            </button>
            <div className={modalMediaClassName} onPointerMove={handleVideoControlReveal}>
              <video
                ref={videoRef}
                src={project.video}
                poster={project.cover}
                muted
                autoPlay
                playsInline
                preload="auto"
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
                aria-label={`${project.titleEn} 项目视频`}
                onLoadedData={event => syncVideoState(event.currentTarget)}
                onCanPlay={event => {
                  syncVideoState(event.currentTarget)
                  if (!event.currentTarget.paused && !event.currentTarget.ended) hideVideoControls()
                }}
                onCanPlayThrough={event => {
                  syncVideoState(event.currentTarget)
                  if (!event.currentTarget.paused && !event.currentTarget.ended) hideVideoControls()
                }}
                onPlay={event => {
                  syncVideoState(event.currentTarget)
                  hideVideoControls()
                }}
                onPlaying={event => {
                  syncVideoState(event.currentTarget)
                  hideVideoControls()
                }}
                onPause={event => {
                  syncVideoState(event.currentTarget)
                  showVideoControls()
                }}
                onEnded={event => {
                  syncVideoState(event.currentTarget)
                  showVideoControls()
                }}
                onWaiting={event => {
                  syncVideoState(event.currentTarget)
                  setIsVideoWaiting(true)
                  showVideoControls()
                }}
              />
              <button
                className="mc-modal-video-surface"
                type="button"
                onClick={handleVideoToggle}
                onPointerDown={handleVideoControlReveal}
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                className={[
                  'mc-modal-video-toggle',
                  isVideoPlaying ? 'is-playing' : 'is-paused',
                  isVideoWaiting ? 'is-waiting' : '',
                ].filter(Boolean).join(' ')}
                type="button"
                onClick={handleVideoToggle}
                aria-label={isVideoPlaying ? '暂停视频' : '播放视频'}
                tabIndex={isVideoControlButtonVisible ? 0 : -1}
                aria-hidden={isVideoControlButtonVisible ? undefined : true}
              >
                <span aria-hidden="true" />
              </button>
              <button
                className="mc-modal-video-fullscreen"
                type="button"
                onClick={handleVideoFullscreen}
                aria-label="全屏播放视频"
              >
                <span aria-hidden="true" />
              </button>
            </div>
            <div className="mc-modal-copy" tabIndex={0} aria-label={`${project.titleEn} 项目详情`}>
              <header className="mc-modal-copy-head">
                <p className="mc-kicker" lang="zh-CN">{project.type}</p>
                <h2>{project.titleEn}</h2>
                <p className="mc-modal-summary" lang="zh-CN">{project.introZh}</p>
              </header>

              {metaItems.length > 0 && (
                <dl className="mc-modal-meta" aria-label="项目元数据">
                  {metaItems.map(([label, value]) => (
                    <div key={label}>
                      <dt lang="zh-CN">{label}</dt>
                      <dd lang="zh-CN">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {metrics.length > 0 && (
                <div className="mc-modal-metrics" aria-label="项目数据">
                  {metrics.map(metric => (
                    <div key={metric.label}>
                      <span lang="zh-CN">{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {detailSections.length > 0 && (
                <div className="mc-modal-sections">
                  {detailSections.map(([label, value]) => (
                    <section key={label}>
                      <h3 lang="zh-CN">{label}</h3>
                      <p lang="zh-CN">{value}</p>
                    </section>
                  ))}
                </div>
              )}

              {project.tags?.length > 0 && (
                <div className="mc-modal-tags" aria-label="项目标签">
                  {project.tags.map(tag => <span lang="zh-CN" key={tag}>{tag}</span>)}
                </div>
              )}

              <div className="mc-modal-tools" aria-label="项目工具">
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

function requestInlineVideoPlay(video, shouldContinue = () => true) {
  if (!video || !shouldContinue()) return Promise.resolve(false)

  prepareInlineVideo(video)
  if (!shouldContinue()) return Promise.resolve(false)

  if (video.ended) video.currentTime = 0
  if (video.readyState < 1 && shouldContinue()) {
    try {
      video.load()
    } catch {}
  }

  const attemptPlay = () => {
    if (!shouldContinue()) return Promise.resolve(false)

    try {
      const playPromise = video.play()
      if (playPromise?.then) {
        return playPromise.then(() => shouldContinue()).catch(() => false)
      }
      return Promise.resolve(!video.paused && shouldContinue())
    } catch {
      return Promise.resolve(false)
    }
  }

  return attemptPlay().then(played => {
    if (played || !shouldContinue()) return played && shouldContinue()

    return new Promise(resolve => {
      let settled = false
      let retryTimer = 0

      const finish = played => {
        if (settled) return
        settled = true
        if (retryTimer) window.clearTimeout(retryTimer)
        video.removeEventListener('loadedmetadata', retry)
        video.removeEventListener('loadeddata', retry)
        video.removeEventListener('canplay', retry)
        video.removeEventListener('canplaythrough', retry)
        resolve(played)
      }

      const retry = () => {
        if (!shouldContinue()) {
          finish(false)
          return
        }

        attemptPlay().then(ok => {
          if (!shouldContinue()) {
            if (!video.paused) video.pause()
            finish(false)
            return
          }

          if (ok) finish(true)
        })
      }

      video.addEventListener('loadedmetadata', retry, { once: true })
      video.addEventListener('loadeddata', retry, { once: true })
      video.addEventListener('canplay', retry, { once: true })
      video.addEventListener('canplaythrough', retry, { once: true })

      retryTimer = window.setTimeout(() => {
        attemptPlay().then(ok => {
          finish(ok && shouldContinue())
        })
      }, 300)
    })
  })
}

function requestInlineVideoFullscreen(video) {
  if (!video) return

  prepareInlineVideo(video)

  const requestFullscreen = video.requestFullscreen
    || video.webkitRequestFullscreen
    || video.webkitEnterFullscreen
    || video.msRequestFullscreen

  requestInlineVideoPlay(video).finally(() => {
    if (!requestFullscreen) return

    try {
      requestFullscreen.call(video)
    } catch {}
  })
}

function prepareInlineVideo(video) {
  video.muted = true
  video.defaultMuted = true
  video.volume = 0
  video.playsInline = true
  video.preload = 'auto'
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('x5-playsinline', 'true')
  video.setAttribute('x5-video-player-type', 'h5')
  video.setAttribute('x5-video-player-fullscreen', 'false')
}
