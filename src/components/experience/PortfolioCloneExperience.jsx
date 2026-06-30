import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Lenis from 'lenis'
import profileCutout from '../../../profile-photo-cutout.webp'
import {
  contact,
  executionStandards,
  navigation,
  profile,
  projects,
  skillGroups,
} from '../../data/portfolio'

const easeOut = [0.16, 1, 0.3, 1]
const heroWords = ['AIGC', 'motion', 'director']
const marqueeItems = ['ajan', 'aigc reels', 'ai drama', 'vertical cinema', 'story hooks']

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

export default function PortfolioCloneExperience() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const sectionIds = useMemo(() => navigation.map(item => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const videoProjects = useMemo(() => projects.filter(project => Boolean(project.video)), [])
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  useLenisSmoothScroll()

  return (
    <main className="clone-page">
      <motion.div className="clone-scroll-progress" style={{ scaleX: progressScaleX }} aria-hidden="true" />
      <LoadingCurtain />
      <SiteHeader activeSection={activeSection} />
      <HeroSection />
      <WorkSection projects={videoProjects} onOpenProject={setSelectedProject} />
      <AboutSection />
      <SystemsSection />
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

function useLenisSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.12,
    })
    window.__portfolioLenis = lenis

    let frame = 0
    const raf = time => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      if (window.__portfolioLenis === lenis) delete window.__portfolioLenis
      lenis.destroy()
    }
  }, [])
}

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(ids[0] ?? 'home')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const marker = window.scrollY + window.innerHeight * 0.32
      let current = ids[0] ?? 'home'

      ids.forEach(id => {
        const element = document.getElementById(id)
        if (element && element.offsetTop <= marker) current = id
      })

      setActiveSection(previous => (previous === current ? previous : current))
    }

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('portfolio:navigation', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('portfolio:navigation', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])

  return activeSection
}

function LoadingCurtain() {
  return (
    <motion.div
      className="clone-loader"
      initial={{ clipPath: 'inset(0 0 0 0)' }}
      animate={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1.08, delay: 0.26, ease: easeOut }}
      aria-hidden="true"
    >
      <motion.span
        initial={{ y: 22, opacity: 0, scale: 0.86 }}
        animate={{ y: 0, opacity: [0, 1, 0], scale: [0.86, 1, 1.14] }}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        AJan
      </motion.span>
    </motion.div>
  )
}

function SiteHeader({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = id => {
    setIsOpen(false)
    const target = document.getElementById(id)
    if (!target) return

    if (window.__portfolioLenis) {
      window.__portfolioLenis.scrollTo(target, { duration: 1.05 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.setTimeout(() => window.dispatchEvent(new Event('portfolio:navigation')), 120)
  }

  return (
    <header className="clone-header">
      <button className="clone-brand" type="button" onClick={() => handleNavigate('home')} aria-label="Back to home">
        <span className="clone-brand-mark" aria-hidden="true">
          <b />
          <b />
          <b />
          <b />
        </span>
        <span className="clone-brand-word">AJan</span>
      </button>

      <button
        className={isOpen ? 'clone-nav-toggle is-open' : 'clone-nav-toggle'}
        type="button"
        onClick={() => setIsOpen(value => !value)}
        aria-expanded={isOpen}
        aria-controls="clone-nav"
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>

      <nav id="clone-nav" className={isOpen ? 'clone-nav is-open' : 'clone-nav'} aria-label="Page navigation">
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

function HeroSection() {
  const sectionRef = useRef(null)
  const pointerFrame = useRef(0)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0rem', '-5rem'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.18])

  const handlePointerMove = event => {
    if (event.pointerType === 'touch') return
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = `${((event.clientX - rect.left) / rect.width) * 100}%`
    const yPos = `${((event.clientY - rect.top) / rect.height) * 100}%`

    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current)
    pointerFrame.current = requestAnimationFrame(() => {
      target.style.setProperty('--hero-x', x)
      target.style.setProperty('--hero-y', yPos)
      pointerFrame.current = 0
    })
  }

  useEffect(() => () => {
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="clone-hero"
      id="home"
      aria-label="AJan AIGC motion portfolio"
      onPointerMove={handlePointerMove}
    >
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-orbit-field" aria-hidden="true">
        <span className="orbit-dot orbit-dot-a" />
        <span className="orbit-dot orbit-dot-b" />
        <span className="orbit-line orbit-line-a" />
        <span className="orbit-line orbit-line-b" />
      </div>

      <motion.div
        className="hero-stage"
        style={{
          y: shouldReduceMotion ? 0 : y,
          scale: shouldReduceMotion ? 1 : scale,
          opacity,
        }}
      >
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.72, delay: 0.9, ease: easeOut }}
        >
          ai short drama / generated footage / final edit
        </motion.p>
        <KineticHeroTitle words={heroWords} />
      </motion.div>

      <motion.div
        className="hero-meta-left"
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.25, ease: easeOut }}
        aria-hidden="true"
      >
        <span>01</span>
        <strong>story hook first</strong>
      </motion.div>
      <motion.div
        className="hero-meta-right"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.35, ease: easeOut }}
        aria-hidden="true"
      >
        <span>05 reels</span>
        <strong>ready to review</strong>
      </motion.div>

      <HeroMarquee />
    </section>
  )
}

function KineticHeroTitle({ words }) {
  return (
    <h1 className="hero-kinetic-title" aria-label={words.join(' ')}>
      <span className="hero-aigc-word" aria-hidden="true">
        {'AIGC'.split('').map((letter, index) => (
          <span className={`hero-glyph hero-glyph-${letter.toLowerCase()}`} key={letter} style={{ '--i': index }}>
            <span className="glyph-face">{letter}</span>
            <span className="glyph-gloss" />
          </span>
        ))}
      </span>
      {words.slice(1).map((word, lineIndex) => (
        <span className="hero-type-line" key={word} data-word={word} aria-hidden="true">
          {word.split('').map((letter, index) => (
            <span className="hero-type-letter" key={`${word}-${letter}-${index}`} style={{ '--i': index, '--line': lineIndex }}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function HeroMarquee() {
  return (
    <div className="hero-marquee" aria-hidden="true">
      {[0, 1].map(loop => (
        <span key={loop}>
          {marqueeItems.map((item, index) => (
            <b key={`${loop}-${item}`}>
              {index % 2 === 1 && <i />}
              {item}
            </b>
          ))}
        </span>
      ))}
    </div>
  )
}

function WorkSection({ projects: showcaseProjects, onOpenProject }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const length = showcaseProjects.length
  const activeProject = showcaseProjects[activeIndex]

  const moveProject = useCallback(offset => {
    if (length <= 1) return
    setActiveIndex(index => wrapIndex(index + offset, length))
  }, [length])

  const selectProject = useCallback(index => {
    setActiveIndex(index)
  }, [])

  const handleKeyDown = useCallback(event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveProject(1)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveProject(-1)
    }

    if (event.key === 'Enter' && activeProject) {
      event.preventDefault()
      onOpenProject(activeProject)
    }
  }, [activeProject, moveProject, onOpenProject])

  if (!activeProject) return null

  return (
    <section className="clone-section clone-work" id="work" aria-label="Selected AIGC work">
      <motion.div
        className="work-heading"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.28 }}
        variants={stagger}
      >
        <motion.span className="section-kicker" variants={fadeUp}>Selected Work</motion.span>
        <motion.h2 variants={fadeUp}>AIGC Reels</motion.h2>
        <motion.p variants={fadeUp}>
          Five finished AI drama reels shaped for hooks, character continuity, edit rhythm and platform pacing.
        </motion.p>
      </motion.div>

      <motion.div
        className="work-carousel"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.72, ease: easeOut }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Project carousel"
      >
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`Project ${activeIndex + 1} of ${length}: ${activeProject.titleEn}`}
        </p>

        <motion.div
          className="work-card-track"
          drag={length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -72) moveProject(1)
            if (info.offset.x > 72) moveProject(-1)
          }}
        >
          {showcaseProjects.map((project, index) => {
            const offset = getLoopOffset(index, activeIndex, length)
            const slot = Math.max(-2, Math.min(2, offset))

            return (
              <motion.button
                type="button"
                className={index === activeIndex ? 'work-card is-active' : 'work-card'}
                key={project.slug}
                data-slot={slot}
                aria-label={`Open ${project.titleEn}`}
                aria-hidden={Math.abs(offset) > 2}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => (index === activeIndex ? onOpenProject(project) : selectProject(index))}
                style={{ '--slot': slot, '--slot-abs': Math.min(Math.abs(slot), 2) }}
              >
                <img src={project.cover} alt="" loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'} decoding="async" />
                <span className="work-card-id">{project.id}</span>
                <span className="work-card-title">{project.titleEn}</span>
                <span className="work-card-meta">{project.type} / {project.duration}</span>
              </motion.button>
            )
          })}
        </motion.div>

        <div className="work-active-copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.28, ease: easeOut }}
            >
              <span>{activeProject.hook}</span>
              <h3>{activeProject.titleEn}</h3>
              <p>{activeProject.introEn}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="work-controls">
          <button type="button" onClick={() => moveProject(-1)} aria-label="Previous project">
            <span />
          </button>
          <div className="work-progress" aria-hidden="true">
            <span style={{ width: `${((activeIndex + 1) / length) * 100}%` }} />
          </div>
          <button type="button" onClick={() => moveProject(1)} aria-label="Next project">
            <span />
          </button>
        </div>
      </motion.div>

      <motion.div
        className="work-archive"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        role="listbox"
        aria-label="Project archive"
      >
        {showcaseProjects.map((project, index) => (
          <motion.button
            type="button"
            key={project.slug}
            className={index === activeIndex ? 'archive-row is-active' : 'archive-row'}
            onMouseEnter={() => selectProject(index)}
            onFocus={() => selectProject(index)}
            onClick={() => onOpenProject(project)}
            role="option"
            aria-selected={index === activeIndex}
            variants={fadeUp}
          >
            <span>{project.id}</span>
            <strong>{project.titleEn}</strong>
            <em>{project.type}</em>
            <i aria-hidden="true" />
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="clone-section clone-about" id="about" aria-label="About AJan">
      <motion.div
        className="about-layout"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={stagger}
      >
        <motion.div className="about-title-stage" variants={fadeUp}>
          <span className="section-kicker">About</span>
          <h2>About</h2>
          <div className="about-portrait" aria-hidden="true">
            <img src={profileCutout} alt="" width="780" height="1033" loading="lazy" decoding="async" />
          </div>
        </motion.div>

        <motion.div className="about-copy" variants={stagger}>
          {profile.aboutColumns.map(paragraph => (
            <motion.p key={paragraph} variants={fadeUp}>{paragraph}</motion.p>
          ))}
          <motion.div className="about-principles" variants={stagger}>
            {profile.principles.map(principle => (
              <motion.article key={principle.label} variants={fadeUp}>
                <span>{principle.label}</span>
                <p>{principle.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function SystemsSection() {
  const gridItems = [
    ...skillGroups.map(group => ({ type: 'skill', ...group })),
    ...executionStandards.map(item => ({ type: 'standard', title: item.label, summary: item.text, items: [] })),
  ]

  return (
    <section className="clone-section clone-systems" id="skills" aria-label="Production systems">
      <motion.div
        className="systems-heading"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.28 }}
        variants={stagger}
      >
        <motion.span className="section-kicker" variants={fadeUp}>Systems</motion.span>
        <motion.h2 variants={fadeUp}>Frame, rhythm, delivery.</motion.h2>
      </motion.div>

      <motion.div
        className="systems-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        {gridItems.map(item => (
          <motion.article className={item.type === 'standard' ? 'system-tile is-standard' : 'system-tile'} key={item.title} variants={fadeUp}>
            <span>{item.title}</span>
            <p>{item.summary}</p>
            {item.items.length > 0 && (
              <ul>
                {item.items.map(child => <li key={child}>{child}</li>)}
              </ul>
            )}
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

function ContactSection() {
  const [mailName, mailDomain = ''] = contact.email.split('@')
  const [domainName = mailDomain, ...suffixParts] = mailDomain.split('.')
  const domainSuffix = suffixParts.length ? `.${suffixParts.join('.')}` : ''

  return (
    <section className="clone-section clone-contact" id="contact" aria-label="Contact">
      <motion.div
        className="contact-layout"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.span className="section-kicker" variants={fadeUp}>Contact</motion.span>
        <motion.h2 variants={fadeUp}>Start with a story hook.</motion.h2>
        <motion.a href={`mailto:${contact.email}`} className="giant-email" variants={fadeUp}>
          <span>{mailName}</span>
          <span className="email-at">@</span>
          <span>{domainName}</span>
          <span className="email-domain">{domainSuffix}</span>
        </motion.a>
        <motion.div className="contact-footer-row" variants={fadeUp}>
          <p>{profile.headline}</p>
          <div>
            {contact.availability.map(item => <span key={item}>{item}</span>)}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ProjectModal({ project, isMuted, onClose, onMuteChange }) {
  const dialogRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!project) return undefined
    previousFocus.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => dialogRef.current?.focus(), 0)

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
        <motion.div className="clone-modal-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="clone-modal-scrim" type="button" onClick={onClose} aria-label="Close project details" />
          <motion.article
            ref={dialogRef}
            className="clone-project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.titleEn}
            tabIndex={-1}
            initial={{ y: 28, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <button className="clone-modal-close" type="button" onClick={onClose} aria-label="Close">
              ×
            </button>
            <div className="clone-modal-media">
              <video src={project.fullVideo ?? project.video} poster={project.cover} muted={isMuted} controls autoPlay playsInline />
            </div>
            <div className="clone-modal-content">
              <span className="section-kicker">{project.type}</span>
              <h2>{project.titleEn}</h2>
              <p>{project.introEn}</p>
              <dl>
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{project.duration}</dd>
                </div>
              </dl>
              <div className="clone-modal-tools">
                {project.tools.map(tool => <span key={tool}>{tool}</span>)}
              </div>
              <button type="button" onClick={() => onMuteChange(value => !value)}>
                {isMuted ? 'Unmute video' : 'Mute video'}
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
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
