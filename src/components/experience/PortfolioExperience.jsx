import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import profilePhoto from '../../../profile-photo-optimized.jpg'
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
      <SectionHeader
        kicker="Profile"
        title="AJan"
        intro="AIGC 影像创作者。关注角色、镜头、节奏和交付。"
      />

      <div className="profile-layout">
        <motion.div
          className="profile-portrait"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={profilePhoto}
            alt={profile.name}
            width="900"
            height="1363"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <motion.div
          className="profile-body"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.span className="section-kicker" variants={fadeUp}>{profile.title}</motion.span>
          <motion.h2 variants={fadeUp}>{profile.name}</motion.h2>
          <TextReveal text={profile.headline} className="profile-headline" />
          {profile.bio.map(paragraph => (
            <motion.p key={paragraph} variants={fadeUp}>{paragraph}</motion.p>
          ))}
        </motion.div>

        <motion.div
          className="principle-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          {profile.principles.map((item, index) => (
            <motion.article key={item.label} variants={fadeUp}>
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

function WorkArchiveSection({ projects: videoProjects, onOpenProject }) {
  const [activeSlug, setActiveSlug] = useState(videoProjects[0]?.slug ?? '')
  const activeProject = videoProjects.find(project => project.slug === activeSlug) ?? videoProjects[0]

  useEffect(() => {
    setActiveSlug(videoProjects[0]?.slug ?? '')
  }, [videoProjects])

  if (!activeProject) return null

  return (
    <section className="work-section page-section" id="work" aria-label="Video archive">
      <div className="work-heading-row">
        <SectionHeader
          kicker="Selected Work"
          title="Video Archive"
          intro="Five finished AIGC video reels, organized as an editorial index instead of repeated placeholder cards."
        />
        <WorkStats projects={videoProjects} />
      </div>
      <ArchiveShowcase
        projects={videoProjects}
        activeProject={activeProject}
        activeSlug={activeProject.slug}
        onActivate={setActiveSlug}
        onOpenProject={onOpenProject}
      />
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

function ArchiveShowcase({ projects: archiveProjects, activeProject, activeSlug, onActivate, onOpenProject }) {
  return (
    <motion.div
      className="archive-showcase"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={stagger}
    >
      <motion.div className="archive-preview" variants={fadeUp}>
        <AnimatePresence mode="wait">
          <motion.button
            key={activeProject.slug}
            type="button"
            className="archive-preview-media"
            onClick={() => onOpenProject(activeProject)}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            aria-label={'Open ' + activeProject.titleEn}
          >
            <img src={activeProject.cover} alt={activeProject.titleEn} loading="eager" decoding="async" />
            <video
              src={activeProject.video}
              poster={activeProject.cover}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <span>{activeProject.id}</span>
          </motion.button>
        </AnimatePresence>

        <div className="archive-preview-copy">
          <span className="section-kicker">Active reel</span>
          <h3>
            <WordArtText text={activeProject.titleEn} />
          </h3>
          <p>{activeProject.introEn}</p>
          <div className="archive-preview-meta">
            <span>{activeProject.type}</span>
            <span>{activeProject.duration}</span>
            <span>{activeProject.year}</span>
          </div>
        </div>
      </motion.div>

      <div className="archive-index" aria-label="Finished video list">
        {archiveProjects.map((project, index) => {
          const isActive = project.slug === activeSlug

          return (
            <motion.button
              key={project.slug}
              type="button"
              className={isActive ? 'archive-row is-active' : 'archive-row'}
              variants={fadeUp}
              onPointerEnter={() => onActivate(project.slug)}
              onFocus={() => onActivate(project.slug)}
              onClick={() => onOpenProject(project)}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="archive-row-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="archive-row-title">
                <strong>{project.titleEn}</strong>
                <small>{project.introEn}</small>
              </span>
              <span className="archive-row-meta">
                <small>{project.type}</small>
                <small>{project.duration}</small>
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
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
    <section className="contact-section page-section" id="contact" aria-label="联系我">
      <div className="contact-panel">
        <SectionHeader
          kicker="Contact"
          title="联系"
          intro="AIGC 影像、AI 真人短剧视觉方案与短剧预告包装合作。"
        />

        <div className="contact-grid">
          <a href={`mailto:${contact.email}`} className="contact-mail">
            {contact.email}
          </a>
          <div className="contact-list">
            {contact.availability.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>
      </div>
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
        <span className="kinetic-title-line" key={line} aria-hidden="true" style={{ '--line-index': lineIndex }}>
          <span>
            {line.split('').map((letter, letterIndex) => (
              <span
                className="kinetic-title-letter"
                style={{ '--letter-index': letterIndex }}
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
