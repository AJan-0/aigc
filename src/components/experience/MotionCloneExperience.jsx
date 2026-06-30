import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
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
  { id: 'home', label: 'home' },
  { id: 'work', label: 'work', shortLabel: 'w' },
  { id: 'about', label: 'about', shortLabel: 'a' },
  { id: 'contact', label: 'contact', shortLabel: 'c' },
]

const tickerItems = ['aigc visual', 'ajan studio', 'ai drama', 'motion system', 'vertical reels']
const brandItems = ['COMFYUI', 'RUNWAY', 'KLING', 'SDXL', 'DAVINCI', 'LORA', 'CONTROLNET', 'AIGC']
const contactEmail = '1248567324@qq.com'

const heroTitleLines = [
  [
    ['A', 'sticker mc-glyph-a'],
    ['I', 'pencil mc-glyph-i'],
    ['G', 'cube mc-glyph-g'],
    ['C', 'neon mc-glyph-c'],
  ],
  [
    ['D', 'ink mc-glyph-d'],
    ['e', 'bubble mc-glyph-e'],
    ['s', 'outline mc-glyph-s'],
    ['i', 'spark mc-glyph-i-small'],
    ['g', 'blob mc-glyph-g-small'],
    ['n', 'neon mc-glyph-n'],
  ],
  [
    ['P', 'slab mc-glyph-p'],
    ['o', 'face mc-glyph-o-face'],
    ['r', 'ink mc-glyph-r'],
    ['t', 'plus mc-glyph-t'],
    ['f', 'outline mc-glyph-f'],
    ['o', 'cube mc-glyph-o-cube'],
    ['l', 'stroke mc-glyph-l'],
    ['i', 'spark mc-glyph-i-tail'],
    ['o', 'bubble mc-glyph-o-last'],
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
          <HeroMark />
        </div>
      </section>

      <HeroTicker />

      <ShowreelSection activeProject={activeProject} />

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

function HeroMark() {
  return (
    <div
      className="mc-hero-mark"
      aria-label="AIGC Design Portfolio"
    >
      <h1 className="mc-hero-title" aria-label="AIGC Design Portfolio">
        {heroTitleLines.map((line, lineIndex) => (
          <span
            className={`mc-hero-line mc-hero-line-${lineIndex + 1}`}
            aria-hidden="true"
            key={`line-${lineIndex}`}
          >
            {line.map(([letter, variant], letterIndex) => {
              const glyphIndex = lineIndex * 9 + letterIndex

              return (
                <span
                  className={`mc-hero-glyph mc-glyph-${variant}`}
                  data-letter={letter}
                  key={`${lineIndex}-${letter}-${letterIndex}`}
                  style={{
                    '--glyph-delay': `${glyphIndex * 18}ms`,
                    '--glyph-loop-delay': `-${glyphIndex * 120}ms`,
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
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="mc-hero-caption">
        AIGC Design Portfolio. AI film direction, short drama hooks and finished motion packaging.
      </p>
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

function ShowreelSection({ activeProject }) {
  const videoRef = useAutoplayVideo(activeProject?.slug)

  return (
    <section className="mc-showreel mc-section" id="showreel" aria-label="Showreel">
      <motion.div
        className="mc-video-shell"
        initial={{ opacity: 0, y: 60, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      >
        <img className="mc-video-poster" src={activeProject?.cover} alt="" aria-hidden="true" loading="eager" decoding="async" />
        <video ref={videoRef} src={activeProject?.video ?? v1Video} poster={activeProject?.cover} muted loop autoPlay playsInline preload="auto" />
        <div className="mc-video-overlay">
          <span className="mc-play-badge">play</span>
          <span>showreel / muted loop</span>
        </div>
      </motion.div>
    </section>
  )
}

function WorkSection({ projects: workProjects, activeIndex, activeProject, onActiveIndexChange, onMoveProject, onOpenProject }) {
  const progress = workProjects.length ? ((activeIndex + 1) / workProjects.length) * 100 : 0

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
            <AnimatePresence mode="wait">
              <motion.button
                type="button"
                key={activeProject.slug}
                className="mc-cover-card"
                onClick={() => onOpenProject(activeProject)}
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
            <div className="mc-work-list" role="listbox" aria-label="AIGC reel list">
              {workProjects.map((project, index) => (
                <motion.button
                  key={project.slug}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? 'mc-work-row is-active' : 'mc-work-row'}
                  onMouseEnter={() => onActiveIndexChange(index)}
                  onFocus={() => onActiveIndexChange(index)}
                  onClick={() => onOpenProject(project)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.42, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span>{project.id}</span>
                  <strong>{project.titleEn}</strong>
                  <small>{project.type} / {project.duration}</small>
                  <i aria-hidden="true" />
                </motion.button>
              ))}
            </div>

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
      aria-label={`${project.titleEn} preview`}
    />
  )
}

function useAutoplayVideo(resetKey) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.currentTime = 0
    const playPromise = video.play()
    if (playPromise?.catch) playPromise.catch(() => {})
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
          <motion.div className="mc-brand-tile" key={brand} variants={reveal}>
            <span>{brand}</span>
            <i style={{ animationDelay: `${index * 0.18}s` }} aria-hidden="true" />
          </motion.div>
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
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
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
              <video src={project.video} poster={project.cover} muted controls playsInline preload="metadata" />
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
