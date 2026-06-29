import { useEffect, useMemo, useRef, useState } from 'react'
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
        .from(gsap.utils.toArray('.vector-pop-detail', page), {
          scale: 0.2,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 0.58,
          stagger: 0.045,
          ease: 'back.out(2.1)',
        }, '-=0.34')
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
      <div className="hero-kinetic-strip" aria-hidden="true">
        <span>AIGC DESIGN PORTFOLIO</span>
        <span>AIGC DESIGN PORTFOLIO</span>
        <span>AIGC DESIGN PORTFOLIO</span>
      </div>
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
          <span className="hero-title-line" key={row} data-word={row} style={{ '--line-index': index }}>
            <span className="hero-title-word" style={{ '--line-index': index }}>{row}</span>
          </span>
        ))}
      </span>
    </h1>
  )
}

function AigcVectorLogo() {
  return (
    <svg className="aigc-vector-logo" viewBox="0 0 1040 310" role="img" aria-label="AIGC">
      <defs>
        <linearGradient id="aigc-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6a54" />
          <stop offset="46%" stopColor="#ff2621" />
          <stop offset="100%" stopColor="#bd0908" />
        </linearGradient>
        <linearGradient id="aigc-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bc8dff" />
          <stop offset="54%" stopColor="#7a35ee" />
          <stop offset="100%" stopColor="#3f1397" />
        </linearGradient>
        <linearGradient id="aigc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd94b" />
          <stop offset="54%" stopColor="#ffb20b" />
          <stop offset="100%" stopColor="#d18100" />
        </linearGradient>
        <linearGradient id="aigc-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff82e4" />
          <stop offset="58%" stopColor="#f146c6" />
          <stop offset="100%" stopColor="#c02794" />
        </linearGradient>
        <filter id="soft-vector-shadow" x="-14%" y="-22%" width="128%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="7" floodColor="#000000" floodOpacity="0.42" />
        </filter>
      </defs>

      <g className="vector-letter vector-letter-a" filter="url(#soft-vector-shadow)">
        <path d="M40 250C54 135 98 42 176 35c69-6 108 83 138 215h-72l-14-58h-89l-20 58H40Z" fill="url(#aigc-red)" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
        <path d="M155 139c7-32 21-61 31-61 11 0 20 31 27 61 3 14-5 24-19 24h-23c-14 0-19-9-16-24Z" fill="#070707" stroke="#fff" strokeWidth="8" strokeLinejoin="round" />
        <path className="vector-pop-detail" d="M78 54l-29-26M104 42l-5-36M135 44l18-28" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
        <path className="vector-pop-detail" d="M83 104c28-31 82-45 121-19" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" opacity="0.9" />
        <path className="vector-pop-detail" d="M67 143c-9 28-13 58-9 85" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity="0.82" />
        <path className="vector-pop-detail" d="M49 241c-16 12-30 7-33-10M55 51c-17-12-18-27-3-43" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      </g>

      <g className="vector-letter vector-letter-i" filter="url(#soft-vector-shadow)">
        <path d="M335 62l126-16 34 26-4 179H328l4-50 33-5 2-92-34 2 2-44Z" fill="url(#aigc-purple)" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
        <path d="M361 79l87-10" stroke="#dcc9ff" strokeWidth="11" strokeLinecap="round" opacity="0.52" />
        <path d="M408 92l-3 101" stroke="#3a0f8c" strokeWidth="14" opacity="0.34" />
        <path d="M459 46c-17-21 28-25 12-45-11-14-32-2-27 15" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </g>

      <g className="vector-letter vector-letter-g" filter="url(#soft-vector-shadow)">
        <path d="M548 44h118l6 38h46v47h-42c11 21 10 57-5 79-18 27-50 42-91 42-75 0-128-44-128-108 0-34 16-61 42-82h54V44Zm28 80c-23 0-38 14-38 34 0 21 17 35 43 35 16 0 30-5 39-15v-16h-49v-38h5Z" fill="url(#aigc-gold)" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
        <circle className="vector-pop-detail" cx="666" cy="94" r="10" fill="#fff" stroke="#141414" strokeWidth="4" />
        <path className="vector-pop-detail" d="M661 89l10 10M671 89l-10 10" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" />
        <circle className="vector-pop-detail" cx="626" cy="226" r="10" fill="#fff" stroke="#141414" strokeWidth="4" />
        <path className="vector-pop-detail" d="M621 221l10 10M631 221l-10 10" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" />
        <circle className="vector-pop-detail" cx="714" cy="219" r="10" fill="#fff" stroke="#141414" strokeWidth="4" />
        <path className="vector-pop-detail" d="M709 214l10 10M719 214l-10 10" stroke="#141414" strokeWidth="3.5" strokeLinecap="round" />
        <path className="vector-pop-detail" d="M706 63h30M715 75h22M679 251c20 18 42 16 58-8M520 247c-1 27 11 45 33 53" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </g>

      <g className="vector-letter vector-letter-c" filter="url(#soft-vector-shadow)">
        <path d="M925 78C884 31 810 38 773 91C733 148 766 220 835 238C885 251 932 229 955 191" fill="none" stroke="#fff" strokeWidth="98" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M925 78C884 31 810 38 773 91C733 148 766 220 835 238C885 251 932 229 955 191" fill="none" stroke="url(#aigc-pink)" strokeWidth="78" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="859" cy="145" rx="58" ry="42" fill="#070707" />
        <path className="vector-pop-detail" d="M825 112c22-22 68-21 91 1" fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" opacity="0.5" />
        <circle className="vector-pop-detail" cx="842" cy="101" r="15" fill="#fff" stroke="#111" strokeWidth="5" />
        <circle className="vector-pop-detail" cx="881" cy="103" r="15" fill="#fff" stroke="#111" strokeWidth="5" />
        <circle className="vector-pop-detail" cx="845" cy="103" r="5" fill="#111" />
        <circle className="vector-pop-detail" cx="884" cy="105" r="5" fill="#111" />
        <path className="vector-pop-detail" d="M827 134c6 10 16 17 29 20 18 4 38-1 54-13" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path className="vector-pop-detail" d="M823 73c-4-18 4-32 19-41M858 60c0-16 10-27 27-31M901 64c7-15 21-22 38-18" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path className="vector-pop-detail" d="M777 124c-8 4-17 4-25-1M792 150c-10 5-20 5-28-1M812 96c-5-7-10-13-16-17" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      </g>

      <g className="vector-doodles vector-pop-detail" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" aria-hidden="true">
        <path d="M644 21l-7-35M674 28l16-30M699 48l35-9" />
        <path d="M757 230l-10 42M776 231l5 38M798 226l20 31" />
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

        <motion.div className="profile-principles" data-card-group variants={stagger}>
          {profile.principles.map(principle => (
            <motion.article
              key={principle.label}
              data-animate="card"
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{principle.label}</span>
              <p>{principle.text}</p>
            </motion.article>
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
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)

  return (
    <section className="work-section page-section" id="work" aria-label="Video archive">
      <div className="work-heading-row">
        <SectionHeader
          kicker="Selected Work"
          title="AIGC Reels"
          intro="Five finished AI drama reels shaped as delivery-ready tests for hooks, character continuity, shot rhythm and platform pacing."
        />
        <WorkStats projects={videoProjects} />
      </div>
      <ProjectCarousel
        projects={videoProjects}
        activeIndex={activeWorkIndex}
        onActiveIndexChange={setActiveWorkIndex}
        onOpenProject={onOpenProject}
      />
      <WorkIndex
        projects={videoProjects}
        activeIndex={activeWorkIndex}
        onSelectIndex={setActiveWorkIndex}
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
        <small>Story systems</small>
      </span>
    </div>
  )
}

function WorkIndex({ projects: indexedProjects, activeIndex, onSelectIndex, onOpenProject }) {
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
        <h3>{reelLabel}. Built for delivery.</h3>
      </motion.div>

      <div className="work-index-list" data-card-group aria-label="Finished video list">
        {indexedProjects.map((project, index) => (
          <motion.button
            key={project.slug}
            type="button"
            className={index === activeIndex ? 'work-index-row is-active' : 'work-index-row'}
            data-animate="card"
            variants={fadeUp}
            onPointerEnter={() => onSelectIndex(index)}
            onFocus={() => onSelectIndex(index)}
            onClick={() => onOpenProject(project)}
          >
            <span className="work-index-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="work-index-title">
              <strong>{project.titleZh}</strong>
              <small>{project.titleEn}</small>
            </span>
            <span className="work-index-meta">
              <small>{project.type}</small>
              <small>{project.duration}</small>
              <small>{project.year}</small>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ProjectCarousel({ projects: carouselProjects, activeIndex, onActiveIndexChange, onOpenProject }) {
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const carouselLength = carouselProjects.length

  useEffect(() => {
    onActiveIndexChange(0)
  }, [carouselProjects, onActiveIndexChange])

  useEffect(() => {
    if (shouldReduceMotion || isPaused || carouselLength <= 1) return undefined

    const timer = window.setInterval(() => {
      onActiveIndexChange(index => wrapIndex(index + 1, carouselLength))
    }, 5200)

    return () => window.clearInterval(timer)
  }, [carouselLength, isPaused, onActiveIndexChange, shouldReduceMotion])

  const moveCarousel = offset => {
    if (carouselLength <= 1) return
    onActiveIndexChange(index => wrapIndex(index + offset, carouselLength))
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
        <div>
          <span className="section-kicker">Showreel Loop</span>
          <h3>
            <WordArtText text={activeProject.titleEn} />
          </h3>
        </div>
        <div className="carousel-copy-detail">
          <p>{activeProject.introEn}</p>
          <div className="carousel-meta">
            <span>{activeProject.id}</span>
            <span>{activeProject.type}</span>
            <span>{activeProject.duration}</span>
            <span>{activeProject.year}</span>
          </div>
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
        <div className="carousel-stage-light" aria-hidden="true" />
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
                opacity: isVisible ? (isActive ? 1 : Math.max(0.28, 0.62 - distance * 0.16)) : 0,
                x: `calc(-50% + (${offset} * min(28vw, 21rem)))`,
                y: `calc(-50% + ${isActive ? 0 : distance * 22}px)`,
                scale: isActive ? 1 : 0.68 - Math.min(distance, 2) * 0.055,
                rotateY: offset * -8,
                rotateZ: isActive ? 0 : offset * -1.4,
                zIndex: 30 - distance,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              transition={carouselSpring}
              onPointerEnter={() => !isActive && onActiveIndexChange(projectIndex)}
              onFocus={() => !isActive && onActiveIndexChange(projectIndex)}
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
                {isActive && <p>{project.introEn}</p>}
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
            onClick={() => onActiveIndexChange(index)}
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
    <span className="word-art" aria-label={text}>
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
