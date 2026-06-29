import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import profileCutout from '../../../profile-photo-cutout.webp'
import {
  contact,
  executionStandards,
  navigation,
  profile,
  projects,
  skillGroups,
} from '../../data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const heroMethods = [
  {
    step: '01',
    title: 'Hook first',
    text: 'Open with the emotional turn, not a generic mood board.',
  },
  {
    step: '02',
    title: 'Character DNA',
    text: 'Keep face, costume, light and relation cues consistent across shots.',
  },
  {
    step: '03',
    title: 'Shot rhythm',
    text: 'Build short-form pacing through cut points, silence and reveal timing.',
  },
  {
    step: '04',
    title: 'Delivery frame',
    text: 'Finish every piece around platform format, runtime and playback clarity.',
  },
]

const heroMarqueeItems = [
  'Watch intro',
  'Scroll to discover',
  'AIGC short drama',
  'Character continuity',
  'Playable archive',
  'Finished reels only',
]

const carouselSpring = {
  type: 'spring',
  stiffness: 145,
  damping: 32,
  mass: 0.92,
}

export default function PortfolioExperience() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const sectionIds = useMemo(() => navigation.map(item => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  })

  const videoProjects = useMemo(() => projects.filter(project => Boolean(project.video)), [])

  return (
    <main className="portfolio-page">
      <motion.div className="scroll-progress" style={{ scaleX: progressScaleX }} aria-hidden="true" />
      <SiteHeader activeSection={activeSection} />
      <HeroIntroSection />
      <ProfileSection />
      <WorkArchiveSection
        projects={videoProjects}
        onOpenProject={setSelectedProject}
      />
      <StandardsSection />
      <SkillsSection />
      <ContactSection />
      <ProjectModal
        project={selectedProject}
        isMuted={isMuted}
        onClose={() => setSelectedProject(null)}
        onMuteChange={setIsMuted}
      />
    </main>
  )
}

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(ids[0] ?? 'home')

  useEffect(() => {
    let animationFrame = 0

    const updateActiveSection = () => {
      animationFrame = 0
      const marker = window.scrollY + window.innerHeight * 0.34
      let currentId = ids[0] ?? 'home'

      ids.forEach(id => {
        const element = document.getElementById(id)
        if (!element) return
        if (element.offsetTop <= marker) {
          currentId = id
        }
      })

      setActiveSection(currentId)
    }

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateActiveSection)
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('portfolio:navigation', requestUpdate)
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('portfolio:navigation', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [ids])

  return activeSection
}

function SiteHeader({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = id => {
    setIsOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => window.dispatchEvent(new Event('portfolio:navigation')), 120)
  }

  return (
    <header className="portfolio-header">
      <a className="portfolio-brand" href="#home" aria-label="回到首页">
        <span>AJan</span>
        <small>AIGC Portfolio</small>
      </a>

      <button
        className="nav-toggle"
        type="button"
        onClick={() => setIsOpen(value => !value)}
        aria-expanded={isOpen}
        aria-controls="site-nav"
      >
        <span />
        <span />
      </button>

      <nav id="site-nav" className={isOpen ? 'site-nav is-open' : 'site-nav'} aria-label="页面导航">
        {navigation.map(item => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? 'is-active' : ''}
            onClick={() => handleNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function HeroIntroSection() {
  const sectionRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const fieldY = useTransform(scrollYProgress, [0, 1], ['0rem', '2.6rem'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0rem', '1.5rem'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.68])

  const handlePointerMove = event => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    event.currentTarget.style.setProperty('--hero-x', x + '%')
    event.currentTarget.style.setProperty('--hero-y', y + '%')
  }

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      id="home"
      aria-label="AIGC moving image intro"
      onPointerMove={handlePointerMove}
    >
      <motion.div className="hero-type-field" aria-hidden="true" style={{ y: shouldReduceMotion ? 0 : fieldY }}>
        <span>AI</span>
        <span>Moving Image</span>
        <span>Short Drama</span>
        <span>Delivery System</span>
      </motion.div>
      <div className="hero-depth-lines" aria-hidden="true" />

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          style={{
            y: shouldReduceMotion ? 0 : copyY,
            opacity: copyOpacity,
          }}
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div className="hero-topline" variants={fadeUp}>
            <span className="section-kicker">AIGC Creative Portfolio</span>
            <span>2026 / Finished video archive</span>
          </motion.div>
          <KineticTitle lines={['AI', 'Moving', 'Image', 'System']} />
          <TextReveal
            text="A focused AIGC video portfolio: short-drama hooks, character continuity, shot rhythm and delivery-ready reels."
            className="hero-lede"
          />

          <motion.div className="hero-actions" variants={fadeUp}>
            <MagneticButton type="button" className="is-primary" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
              Watch archive
            </MagneticButton>
            <MagneticButton type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Start a brief
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-methods"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          aria-label="AIGC production method"
        >
          <span className="section-kicker">Method lines</span>
          {heroMethods.map(item => (
            <article className="hero-method-row" key={item.step}>
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </motion.div>
      </div>

      <KineticMarquee items={heroMarqueeItems} />

      <button
        className="hero-scroll-cue"
        type="button"
        onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to profile"
      >
        <span />
      </button>
    </section>
  )
}

function ProfileSection() {
  return (
    <section className="profile-section page-section" id="profile" aria-label="个人简介">
      <motion.div
        className="profile-stage"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={stagger}
      >
        <h2 className="sr-only">About {profile.name}</h2>

        <motion.div className="profile-hero" variants={fadeUp}>
          <motion.span
            className="profile-giant-word"
            aria-hidden="true"
            initial={{ opacity: 0, y: 118, scaleY: 1.12, filter: 'blur(16px)' }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            About
          </motion.span>

          <motion.div
            className="profile-portrait"
            initial={{ opacity: 0, y: 82, scale: 0.92, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.34 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <img
              src={profileCutout}
              alt={profile.name}
              width="780"
              height="1033"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </motion.div>

        <motion.div className="profile-copy-grid" variants={stagger}>
          {profile.aboutColumns.map(paragraph => (
            <motion.p
              key={paragraph}
              variants={fadeUp}
              whileHover={{ y: -3, color: 'rgba(247,239,226,0.98)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        <motion.p
          className="profile-signature"
          variants={fadeUp}
          initial={{ opacity: 0, y: 18, rotate: -9 }}
          whileInView={{ opacity: 1, y: 0, rotate: -5 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {profile.signature}
        </motion.p>
      </motion.div>
    </section>
  )
}

function WorkArchiveSection({ projects: videoProjects, onOpenProject }) {
  return (
    <section className="work-section page-section" id="work" aria-label="Video archive">
      <div className="work-heading-row">
        <SectionHeader
          kicker="Selected Work"
          title="Video Archive"
          intro="Five finished AIGC reels. Each one tests a hook, a visual system and a delivery format."
        />
        <WorkStats projects={videoProjects} />
      </div>
      <ProjectCarousel projects={videoProjects} onOpenProject={onOpenProject} />
      <WorkIndex projects={videoProjects} onOpenProject={onOpenProject} />
    </section>
  )
}

function WorkStats({ projects: visibleProjects }) {
  const totalDurationSeconds = visibleProjects.reduce((total, project) => {
    const [minutes, seconds] = project.duration.split(':').map(Number)
    return total + (Number.isFinite(minutes) ? minutes * 60 : 0) + (Number.isFinite(seconds) ? seconds : 0)
  }, 0)
  const minutes = Math.floor(totalDurationSeconds / 60)
  const seconds = String(totalDurationSeconds % 60).padStart(2, '0')
  const projectTypes = new Set(visibleProjects.map(project => project.type)).size

  return (
    <div className="work-stats" aria-label="Video archive statistics">
      <span>
        <strong>{visibleProjects.length}</strong>
        <small>Video works</small>
      </span>
      <span>
        <strong>{minutes}:{seconds}</strong>
        <small>Total runtime</small>
      </span>
      <span>
        <strong>{projectTypes}</strong>
        <small>Story types</small>
      </span>
    </div>
  )
}

function WorkIndex({ projects: indexedProjects, onOpenProject }) {
  const reelLabel = indexedProjects.length === 1
    ? 'One finished reel'
    : `${indexedProjects.length} finished reels`

  return (
    <motion.div
      className="work-index"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={stagger}
    >
      <motion.div className="work-index-copy" variants={fadeUp}>
        <span className="section-kicker">Video Index</span>
        <h3>{reelLabel}, one delivery system.</h3>
      </motion.div>

      <div className="work-index-list" aria-label="Finished video list">
        {indexedProjects.map((project, index) => (
          <motion.button
            key={project.slug}
            type="button"
            className="work-index-row"
            variants={fadeUp}
            onClick={() => onOpenProject(project)}
          >
            <span className="work-index-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="work-index-title">
              <strong>{project.titleEn}</strong>
              <small>{project.type}</small>
            </span>
            <span className="work-index-meta">
              <small>{project.duration}</small>
              <small>{project.year}</small>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ProjectCarousel({ projects: carouselProjects, onOpenProject }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const carouselLength = carouselProjects.length

  useEffect(() => {
    setActiveIndex(0)
  }, [carouselProjects])

  useEffect(() => {
    if (shouldReduceMotion || isPaused || carouselLength <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex(index => wrapIndex(index + 1, carouselLength))
    }, 5200)

    return () => window.clearInterval(timer)
  }, [carouselLength, isPaused, shouldReduceMotion])

  const moveCarousel = offset => {
    if (carouselLength <= 1) return
    setActiveIndex(index => wrapIndex(index + offset, carouselLength))
  }

  const jumpToOffset = offset => {
    if (offset === 0 || carouselLength <= 1) return
    moveCarousel(offset)
  }

  const handleKeyDown = event => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveCarousel(1)
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveCarousel(-1)
    }

    if (event.key === 'Enter' && event.target === event.currentTarget) {
      event.preventDefault()
      onOpenProject(carouselProjects[activeIndex])
    }
  }

  if (!carouselLength) return null

  const activeProject = carouselProjects[activeIndex]
  const progress = ((activeIndex + 1) / carouselLength) * 100

  return (
    <motion.div
      className="project-carousel"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Finished video carousel"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Project ${activeIndex + 1} of ${carouselLength}: ${activeProject.titleEn}`}
      </p>

      <div className="carousel-copy">
        <span className="section-kicker">Showreel Loop</span>
        <h3>
          <WordArtText text={activeProject.titleEn} />
        </h3>
        <p>{activeProject.value}</p>
        <div className="carousel-meta">
          <span>{activeProject.id}</span>
          <span>{activeProject.type}</span>
          <span>{activeProject.year}</span>
        </div>
      </div>

      <motion.div
        className="carousel-stage"
        drag={carouselLength > 1 ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (info.offset.x < -64) moveCarousel(1)
          if (info.offset.x > 64) moveCarousel(-1)
        }}
      >
        {carouselProjects.map((project, projectIndex) => {
          const offset = getLoopOffset(projectIndex, activeIndex, carouselLength)
          const isActive = offset === 0
          const distance = Math.abs(offset)
          const isVisible = distance <= 2

          return (
            <motion.button
              key={project.slug}
              type="button"
              className={isActive ? 'carousel-card is-active' : 'carousel-card'}
              style={{ '--slot': offset }}
              initial={false}
              animate={{
                opacity: isVisible ? (isActive ? 1 : Math.max(0.22, 0.6 - distance * 0.15)) : 0,
                x: `calc(${offset} * min(22vw, 14rem))`,
                y: distance * 8,
                scale: isActive ? 1 : 0.88 - Math.min(distance, 2) * 0.045,
                rotateY: offset * -5,
                zIndex: 20 - distance,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              transition={carouselSpring}
              onClick={() => (isActive ? onOpenProject(project) : jumpToOffset(offset))}
              aria-label={isActive ? `Open ${project.titleEn}` : `Show ${project.titleEn}`}
              aria-hidden={!isVisible}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={isVisible ? 0 : -1}
            >
              <img
                src={project.cover}
                alt={project.titleEn}
                loading={isActive ? 'eager' : 'lazy'}
                decoding="async"
              />
              {isActive && project.video && (
                <video
                  src={project.video}
                  poster={project.cover}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              )}
              <span className="carousel-card-index">{project.id}</span>
              <div className="carousel-card-copy">
                <span>{project.type}</span>
                <h4>
                  {project.titleEn}
                </h4>
                <div className="carousel-card-meta">
                  <small>{project.hook}</small>
                  <small>{project.duration}</small>
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => moveCarousel(-1)}
          disabled={carouselLength <= 1}
          aria-label="Previous project"
        >
          ←
        </button>
        <div className="carousel-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => moveCarousel(1)}
          disabled={carouselLength <= 1}
          aria-label="Next project"
        >
          →
        </button>
      </div>

      <div className="carousel-dots" aria-label="Project shortcuts">
        {carouselProjects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${project.titleEn}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </motion.div>
  )
}

function wrapIndex(index, length) {
  return ((index % length) + length) % length
}

function getLoopOffset(index, activeIndex, length) {
  let offset = index - activeIndex
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

function StandardsSection() {
  return (
    <section className="standards-section page-section" aria-label="执行标准">
      <div className="standards-layout">
        <motion.div
          className="standards-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.span className="section-kicker" variants={fadeUp}>Execution Standard</motion.span>
          <motion.h2 variants={fadeUp}>Frame, rhythm, delivery.</motion.h2>
        </motion.div>

        <motion.div
          className="standards-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
          variants={stagger}
        >
          {executionStandards.map((item, index) => (
            <motion.article key={item.label} className="standard-row" variants={fadeUp}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section className="skills-section page-section" id="skills" aria-label="技能展示">
      <SectionHeader
        kicker="Capability"
        title="技能"
        intro="围绕真实项目链路组织能力。"
      />

      <motion.div
        className="skill-matrix"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        {skillGroups.map(group => (
          <motion.article key={group.title} variants={fadeUp}>
            <h3>{group.title}</h3>
            <p>{group.summary}</p>
            <ul>
              {group.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section page-section" id="contact" aria-label="Contact">
      <motion.div
        className="contact-panel"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.24 }}
        variants={stagger}
      >
        <motion.span className="contact-glow-word" aria-hidden="true" variants={fadeUp}>
          Brief
        </motion.span>
        <motion.div className="contact-copy" variants={fadeUp}>
          <span className="section-kicker">Contact</span>
          <h2>Start with a story hook.</h2>
          <p>For AIGC short-drama concepts, character-continuity tests and finished vertical video packaging.</p>
        </motion.div>
        <motion.a href={`mailto:${contact.email}`} className="contact-mail" variants={fadeUp}>
          <span>Email me</span>
          <strong>{contact.email}</strong>
        </motion.a>
        <motion.div className="contact-value-list" variants={stagger}>
          <motion.span variants={fadeUp}>Finished reels</motion.span>
          <motion.span variants={fadeUp}>AI drama visual direction</motion.span>
          <motion.span variants={fadeUp}>Delivery-ready packaging</motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ProjectModal({ project, isMuted, onClose, onMuteChange }) {
  const modalRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!project) return
    previousFocus.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => modalRef.current?.focus(), 0)

    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previousFocus.current?.focus?.()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="modal-scrim" onClick={onClose} aria-label="关闭作品详情" />
          <motion.article
            ref={modalRef}
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.titleEn}
            tabIndex={-1}
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
              ×
            </button>

            <div className="modal-media">
              {project.video ? (
                <video
                  src={project.fullVideo ?? project.video}
                  poster={project.cover}
                  muted={isMuted}
                  autoPlay
                  controls
                  playsInline
                />
              ) : (
                <img src={project.cover} alt={project.titleEn} />
              )}
            </div>

            <div className="modal-content">
              <span className="section-kicker">{project.type}</span>
              <h2>{project.titleEn}</h2>
              <p>{project.introEn}</p>

              <div className="modal-detail-grid">
                <DetailBlock title="Role" text={project.role} />
                <DetailBlock title="Year" text={project.year} />
                <DetailBlock title="Format" text={project.duration} />
              </div>

              {project.metrics?.length > 0 && (
                <div className="modal-metrics" aria-label="Project metrics">
                  {project.metrics.map(metric => (
                    <span key={`${metric.label}-${metric.value}`}>
                      <strong>{metric.value}</strong>
                      <small>{metric.label}</small>
                    </span>
                  ))}
                </div>
              )}

              <div className="modal-footer-row">
                <div className="modal-tools">
                  {project.tools.map(tool => <span key={tool}>{tool}</span>)}
                </div>
                {project.video && (
                  <button type="button" onClick={() => onMuteChange(value => !value)}>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                )}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DetailBlock({ title, text }) {
  return (
    <section>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  )
}

function KineticTitle({ lines }) {
  const label = lines.join(' ')

  return (
    <motion.h1 className="kinetic-title" variants={fadeUp} aria-label={label}>
      {lines.map((line, lineIndex) => (
        <span
          className="kinetic-title-line"
          key={line}
          aria-hidden="true"
          data-word={line}
          style={{ '--line-index': lineIndex }}
        >
          <span className="kinetic-title-word">
            {line.split('').map((letter, letterIndex) => (
              <span
                className="kinetic-title-letter"
                style={{ '--letter-index': letterIndex, '--line-index': lineIndex }}
                key={line + '-' + letter + '-' + letterIndex}
              >
                {letter}
              </span>
            ))}
          </span>
        </span>
      ))}
    </motion.h1>
  )
}

function WordArtText({ text }) {
  return (
    <span className="word-art">
      <span className="word-art-readable">{text}</span>
      {text.split(' ').map((word, wordIndex) => (
        <span className="word-art-word" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {word.split('').map((letter, letterIndex) => (
            <span
              className="word-art-letter"
              style={{ '--letter-index': letterIndex, '--word-index': wordIndex }}
              key={`${word}-${letter}-${letterIndex}`}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

function TextReveal({ text, className = '' }) {
  return (
    <motion.p className={`text-reveal ${className}`} variants={fadeUp} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="text-reveal-word"
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.38, delay: index * 0.024, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

function MagneticButton({ children, className = '', ...props }) {
  const buttonRef = useRef(null)

  const handlePointerMove = event => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const moveX = (x - rect.width / 2) * 0.12
    const moveY = (y - rect.height / 2) * 0.18

    buttonRef.current?.style.setProperty('--magnet-x', `${moveX}px`)
    buttonRef.current?.style.setProperty('--magnet-y', `${moveY}px`)
    buttonRef.current?.style.setProperty('--magnet-glow-x', `${(x / rect.width) * 100}%`)
    buttonRef.current?.style.setProperty('--magnet-glow-y', `${(y / rect.height) * 100}%`)
  }

  const resetPointer = () => {
    buttonRef.current?.style.setProperty('--magnet-x', '0px')
    buttonRef.current?.style.setProperty('--magnet-y', '0px')
    buttonRef.current?.style.setProperty('--magnet-glow-x', '50%')
    buttonRef.current?.style.setProperty('--magnet-glow-y', '50%')
  }

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
}

function KineticMarquee({ items }) {
  const trackItems = [...items, ...items]

  return (
    <div className="kinetic-marquee" aria-hidden="true">
      <div className="kinetic-marquee-track">
        {trackItems.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ kicker, title, intro }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="section-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{intro}</p>
    </motion.div>
  )
}
