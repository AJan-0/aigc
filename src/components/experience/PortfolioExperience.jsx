import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/jetbrains-mono/700.css'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'
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

const playfulTitleRows = ['AIGC', 'Design', 'Portfolio']

gsap.registerPlugin(ScrollTrigger)

const carouselSpring = {
  type: 'spring',
  stiffness: 145,
  damping: 32,
  mass: 0.92,
}

export default function PortfolioExperience() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const pageRef = useRef(null)
  const sectionIds = useMemo(() => navigation.map(item => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  })

  const videoProjects = useMemo(() => projects.filter(project => Boolean(project.video)), [])

  useLenisSmoothScroll()
  usePortfolioGsap(pageRef)

  return (
    <main className="portfolio-page" ref={pageRef}>
      <LoadingCurtain />
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

function useLenisSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.08,
    })
    window.__portfolioLenis = lenis

    const updateScrollTrigger = time => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(updateScrollTrigger)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateScrollTrigger)
      if (window.__portfolioLenis === lenis) delete window.__portfolioLenis
      lenis.destroy()
    }
  }, [])
}

function usePortfolioGsap(pageRef) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const page = pageRef.current
    if (!page) return undefined

    const splitInstances = []
    const ctx = gsap.context(() => {
      if (shouldReduceMotion) {
        gsap.set('[data-loader]', { display: 'none' })
        gsap.set('[data-animate]', { opacity: 1, y: 0, clearProps: 'clipPath,filter,scale' })
        return
      }

      const heroTitle = page.querySelector('.vector-title')
      const loader = page.querySelector('[data-loader]')
      const loaderLogo = page.querySelector('[data-loader-logo]')

      gsap.set(loader, { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.set(loaderLogo, { scale: 0.78, opacity: 1, filter: 'blur(0px)' })
      gsap.set(gsap.utils.toArray('.vector-letter', page), {
        y: 42,
        scale: 0.82,
        rotate: index => [-6, 4, -3, 5][index] || 0,
        transformOrigin: '50% 100%',
        opacity: 0,
      })
      gsap.set(gsap.utils.toArray('.hero-title-word', page), { yPercent: 115, opacity: 0 })
      gsap.set(gsap.utils.toArray('[data-animate="image"]', page), { clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(14px)' })
      gsap.set(gsap.utils.toArray('[data-animate="card"]', page), { y: 100, opacity: 0 })

      const loadTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
      loadTimeline
        .to(loaderLogo, { scale: 1.18, opacity: 0, filter: 'blur(12px)', duration: 0.72, delay: 0.18 })
        .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.86 }, '-=0.22')
        .to(gsap.utils.toArray('.vector-letter', page), {
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.92,
          stagger: 0.08,
        }, '-=0.26')
        .to(gsap.utils.toArray('.hero-title-word', page), {
          yPercent: 0,
          opacity: 1,
          duration: 0.86,
          stagger: 0.08,
        }, '-=0.5')

      page.querySelectorAll('[data-split-lines]').forEach(element => {
        const split = new SplitType(element, { types: 'lines, words, chars', lineClass: 'split-line' })
        splitInstances.push(split)
        gsap.from(split.lines, {
          y: 50,
          opacity: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            once: true,
          },
        })
      })

      page.querySelectorAll('[data-animate="image"]').forEach(element => {
        gsap.to(element, {
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 78%',
            once: true,
          },
        })
      })

      gsap.utils.toArray('[data-card-group]', page).forEach(group => {
        gsap.to(group.querySelectorAll('[data-animate="card"]'), {
          y: 0,
          opacity: 1,
          duration: 0.78,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
            once: true,
          },
        })
      })

      gsap.to(gsap.utils.toArray('[data-parallax="background"]', page), {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(gsap.utils.toArray('[data-parallax="foreground"]', page), {
        yPercent: -55,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(heroTitle, {
        '--title-weight': 900,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, page)

    return () => {
      splitInstances.forEach(split => split.revert())
      ctx.revert()
    }
  }, [pageRef, shouldReduceMotion])
}

function LoadingCurtain() {
  return (
    <div className="loading-curtain" data-loader aria-hidden="true">
      <span data-loader-logo>AIGC</span>
    </div>
  )
}

function SiteHeader({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = id => {
    setIsOpen(false)
    const target = document.getElementById(id)
    if (target && window.__portfolioLenis) {
      window.__portfolioLenis.scrollTo(target, { duration: 1.2 })
    } else {
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
  const titleY = useTransform(scrollYProgress, [0, 1], ['0rem', '-1.35rem'])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.96])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.42])

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
      aria-label="AIGC Design Portfolio intro"
      onPointerMove={handlePointerMove}
    >
      <div className="hero-paper-grid" data-parallax="background" aria-hidden="true" />
      <div className="hero-doodle-field" data-parallax="foreground" aria-hidden="true">
        <span className="hero-doodle is-loop" />
        <span className="hero-doodle is-strike" />
        <span className="hero-doodle is-corner" />
        <span className="hero-doodle is-spark" />
        <span className="hero-doodle is-wave" />
      </div>

      <motion.div
        className="hero-design-stage"
        style={{
          y: shouldReduceMotion ? 0 : titleY,
          scale: shouldReduceMotion ? 1 : titleScale,
          opacity: titleOpacity,
        }}
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <VectorPortfolioTitle rows={playfulTitleRows} />
      </motion.div>

      <button
        className="hero-scroll-cue"
        type="button"
        onClick={() => {
          const target = document.getElementById('profile')
          if (target && window.__portfolioLenis) {
            window.__portfolioLenis.scrollTo(target, { duration: 1.2 })
          } else {
            target?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        aria-label="Scroll to profile"
      >
        <span />
      </button>
    </section>
  )
}

function VectorPortfolioTitle({ rows }) {
  const label = rows.join(' ')
  const [, ...wordRows] = rows

  return (
    <h1 className="vector-title" aria-label={label}>
      <span className="vector-aigc-wrap" aria-hidden="true">
        <AigcVectorLogo />
      </span>
      <span className="hero-word-stack" aria-hidden="true">
        {wordRows.map((row, index) => (
          <span className="hero-title-line" key={row}>
            <span className="hero-title-word" style={{ '--line-index': index }}>{row}</span>
          </span>
        ))}
      </span>
    </h1>
  )
}

function AigcVectorLogo() {
  return (
    <svg className="aigc-vector-logo" viewBox="0 0 900 278" role="img" aria-label="AIGC">
      <defs>
        <linearGradient id="aigc-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff392b" />
          <stop offset="58%" stopColor="#ff1f19" />
          <stop offset="100%" stopColor="#9e0a07" />
        </linearGradient>
        <linearGradient id="aigc-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a86cff" />
          <stop offset="60%" stopColor="#6e32e8" />
          <stop offset="100%" stopColor="#2b106c" />
        </linearGradient>
        <linearGradient id="aigc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffdf43" />
          <stop offset="60%" stopColor="#ffb000" />
          <stop offset="100%" stopColor="#936000" />
        </linearGradient>
        <linearGradient id="aigc-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff72db" />
          <stop offset="62%" stopColor="#f044bd" />
          <stop offset="100%" stopColor="#8d1b6a" />
        </linearGradient>
        <filter id="soft-vector-shadow" x="-10%" y="-18%" width="120%" height="138%">
          <feDropShadow dx="0" dy="9" stdDeviation="6" floodColor="#000000" floodOpacity="0.36" />
        </filter>
      </defs>

      <g className="vector-letter vector-letter-a" filter="url(#soft-vector-shadow)">
        <path d="M57 242C89 150 117 80 154 31c11-14 35-13 46 1 39 51 69 124 97 210h-64l-18-55h-83l-18 55H57Z" fill="url(#aigc-red)" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
        <path d="M151 138h45l-21-66-24 66Z" fill="#080808" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
        <path d="M109 73c25-24 62-33 95-17" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity="0.86" />
        <path d="M93 120c-10 22-16 45-18 68" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" opacity="0.78" />
      </g>

      <g className="vector-letter vector-letter-i" filter="url(#soft-vector-shadow)">
        <path d="M327 42h126v45h-34v111h39v45H319v-45h39V87h-31V42Z" fill="url(#aigc-purple)" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
        <path d="M346 60h88" stroke="#d9c5ff" strokeWidth="9" strokeLinecap="round" opacity="0.5" />
        <path d="M378 90v101" stroke="#32106e" strokeWidth="12" opacity="0.34" />
      </g>

      <g className="vector-letter vector-letter-g" filter="url(#soft-vector-shadow)">
        <path d="M508 69c32-31 99-41 151-13 24 13 42 31 52 56l-55 25c-10-22-31-34-65-34-46 0-76 29-76 70 0 45 31 73 80 73 30 0 53-9 66-27v-24h-69v-48h131v116h-47l-8-28c-20 22-48 34-85 34-81 0-137-53-137-129 0-31 11-56 32-71Z" fill="url(#aigc-gold)" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
        <circle cx="653" cy="75" r="12" fill="#fff" stroke="#141414" strokeWidth="5" />
        <path d="M648 70l10 10M658 70l-10 10" stroke="#141414" strokeWidth="4" strokeLinecap="round" />
        <circle cx="693" cy="229" r="12" fill="#fff" stroke="#141414" strokeWidth="5" />
        <path d="M688 224l10 10M698 224l-10 10" stroke="#141414" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g className="vector-letter vector-letter-c" filter="url(#soft-vector-shadow)">
        <path d="M780 83c41-56 121-57 164-11 24 26 33 63 20 98-14 38-50 60-94 60-34 0-63-14-81-40l46-35c8 12 20 19 34 19 21 0 36-16 36-37s-15-38-38-38c-23 0-39 14-49 41l-55-25c4-12 10-23 17-32Z" fill="url(#aigc-pink)" stroke="#fff" strokeWidth="9" strokeLinejoin="round" transform="translate(-92 4)" />
        <circle cx="747" cy="98" r="14" fill="#fff" stroke="#111" strokeWidth="5" />
        <circle cx="785" cy="98" r="14" fill="#fff" stroke="#111" strokeWidth="5" />
        <circle cx="750" cy="100" r="5" fill="#111" />
        <circle cx="788" cy="100" r="5" fill="#111" />
        <path d="M749 156c22 19 52 19 75 0" fill="none" stroke="#111" strokeWidth="7" strokeLinecap="round" />
        <path d="M711 66c-3-18 4-31 18-40M748 56c-1-16 7-26 22-31M789 58c4-15 15-23 31-23" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      </g>

      <g className="vector-doodles" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" aria-hidden="true">
        <path d="M62 23l-28-25M92 11l-4-37M124 16l16-27" />
        <path d="M353 20c-22-21 29-24 10-43-12-12-31 0-24 16" />
        <path d="M626 8l-6-35M655 20l17-29M681 38l34-11" />
      </g>
    </svg>
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
            data-split-lines
            initial={{ opacity: 0, y: 118, scaleY: 1.18, filter: 'blur(18px)', clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
          >
            About
          </motion.span>

          <motion.div
            className="profile-portrait"
            data-animate="image"
            initial={{ opacity: 0, y: 126, scale: 0.88, filter: 'blur(18px) brightness(0.42)', clipPath: 'inset(42% 0 0 0)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)', clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, amount: 0.34 }}
            transition={{ duration: 1.18, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
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
              data-split-lines
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
    <div className="work-stats" data-card-group aria-label="Video archive statistics">
      <span data-animate="card">
        <strong>{visibleProjects.length}</strong>
        <small>Video works</small>
      </span>
      <span data-animate="card">
        <strong>{minutes}:{seconds}</strong>
        <small>Total runtime</small>
      </span>
      <span data-animate="card">
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

      <div className="work-index-list" data-card-group aria-label="Finished video list">
        {indexedProjects.map((project, index) => (
          <motion.button
            key={project.slug}
            type="button"
            className="work-index-row"
            data-animate="card"
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
        <h3 data-split-lines>
          <WordArtText text={activeProject.titleEn} />
        </h3>
        <p data-split-lines>{activeProject.value}</p>
        <div className="carousel-meta">
          <span>{activeProject.id}</span>
          <span>{activeProject.type}</span>
          <span>{activeProject.year}</span>
        </div>
      </div>

      <motion.div
        className="carousel-stage"
        data-card-group
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
              data-animate="card"
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
          <motion.h2 variants={fadeUp} data-split-lines>Frame, rhythm, delivery.</motion.h2>
        </motion.div>

        <motion.div
          className="standards-list"
          data-card-group
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
          variants={stagger}
        >
          {executionStandards.map((item, index) => (
            <motion.article key={item.label} className="standard-row" data-animate="card" variants={fadeUp}>
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
        data-card-group
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        {skillGroups.map(group => (
          <motion.article key={group.title} data-animate="card" variants={fadeUp}>
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
          <h2 data-split-lines>Start with a story hook.</h2>
          <p data-split-lines>For AIGC short-drama concepts, character-continuity tests and finished vertical video packaging.</p>
        </motion.div>
        <motion.a href={`mailto:${contact.email}`} className="contact-mail" variants={fadeUp}>
          <span>Email me</span>
          <strong>{contact.email}</strong>
        </motion.a>
        <motion.div className="contact-value-list" data-card-group variants={stagger}>
          <motion.span data-animate="card" variants={fadeUp}>Finished reels</motion.span>
          <motion.span data-animate="card" variants={fadeUp}>AI drama visual direction</motion.span>
          <motion.span data-animate="card" variants={fadeUp}>Delivery-ready packaging</motion.span>
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
      <h2 data-split-lines>{title}</h2>
      <p data-split-lines>{intro}</p>
    </motion.div>
  )
}
