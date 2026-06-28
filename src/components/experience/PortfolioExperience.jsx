import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import profilePhoto from '../../../profile-photo.png'
import {
  categories,
  contact,
  navigation,
  profile,
  projects,
  skillGroups,
} from '../../data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function PortfolioExperience() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMuted, setIsMuted] = useState(true)

  const featuredProjects = useMemo(() => projects.filter(project => project.featured), [])
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects
    return projects.filter(project => project.category === activeCategory)
  }, [activeCategory])

  return (
    <main className="portfolio-page">
      <SiteHeader />
      <HeroSection featuredProjects={featuredProjects} onOpenProject={setSelectedProject} />
      <ProfileSection />
      <WorkSection
        activeCategory={activeCategory}
        filteredProjects={filteredProjects}
        onCategoryChange={setActiveCategory}
        onOpenProject={setSelectedProject}
      />
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

function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = id => {
    setIsOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          <button key={item.id} type="button" onClick={() => handleNavigate(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function HeroSection({ featuredProjects, onOpenProject }) {
  const leadProject = featuredProjects[0] ?? projects[0]

  return (
    <section className="hero-section" id="home" aria-label="我的作品集">
      <div className="hero-backdrop" aria-hidden="true">
        <img src={leadProject.cover} alt="" />
      </div>

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.span className="section-kicker" variants={fadeUp}>
            AIGC Creative Portfolio
          </motion.span>
          <motion.h1 variants={fadeUp}>
            AIGC Moving Image Archive
          </motion.h1>
          <motion.p variants={fadeUp}>
            海外真人 AI 剧、3C 创意短片、动画短片与实验视觉。
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp}>
            <button type="button" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
              查看作品
            </button>
            <button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              联系合作
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-showcase"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
        >
          <button type="button" className="hero-feature-card" onClick={() => onOpenProject(leadProject)}>
            <img src={leadProject.cover} alt={leadProject.titleZh} />
            <span>{leadProject.type}</span>
            <strong>{leadProject.titleEn}</strong>
            <small>{leadProject.titleZh}</small>
          </button>

          <div className="hero-index" aria-label="精选作品">
            {featuredProjects.map(project => (
              <button key={project.id} type="button" onClick={() => onOpenProject(project)}>
                <span>{project.id}</span>
                <strong>{project.titleEn}</strong>
                <small>{project.type}</small>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="category-strip" aria-label="内容方向">
        {categories.filter(category => category.id !== 'all').map(category => (
          <span key={category.id} style={{ '--accent': category.accent }}>
            {category.labelZh}
          </span>
        ))}
      </div>
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
          <img src={profilePhoto} alt={profile.name} loading="lazy" />
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
          <motion.p className="profile-headline" variants={fadeUp}>{profile.headline}</motion.p>
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

function WorkSection({ activeCategory, filteredProjects, onCategoryChange, onOpenProject }) {
  return (
    <section className="work-section page-section" id="work" aria-label="作品">
      <SectionHeader
        kicker="Selected Work"
        title="作品"
        intro="以作品为主轴，按内容方向浏览。"
      />

      <CategoryFilter activeCategory={activeCategory} onChange={onCategoryChange} />

      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map(project => (
            <ProjectCard key={project.slug} project={project} onOpen={onOpenProject} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="category-filter" role="tablist" aria-label="作品分类">
      {categories.map(category => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={activeCategory === category.id}
          className={activeCategory === category.id ? 'is-active' : ''}
          style={{ '--accent': category.accent }}
          onClick={() => onChange(category.id)}
        >
          <span>{category.label}</span>
          <small>{category.labelZh}</small>
        </button>
      ))}
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    if (isPreviewing) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isPreviewing])

  return (
    <motion.article
      layout
      className={project.featured ? 'project-card is-featured' : 'project-card'}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.32 }}
    >
      <button
        type="button"
        className="project-media"
        onClick={() => onOpen(project)}
        onMouseEnter={() => setIsPreviewing(true)}
        onMouseLeave={() => setIsPreviewing(false)}
        onFocus={() => setIsPreviewing(true)}
        onBlur={() => setIsPreviewing(false)}
        aria-label={`查看作品 ${project.titleEn}`}
      >
        <img src={project.cover} alt={project.titleZh} loading="lazy" />
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        <span className="media-badge">{project.video ? project.duration : 'Still'}</span>
        <div className="project-overlay">
          <span>{project.type}</span>
          <h3>{project.titleEn}</h3>
          <strong>{project.titleZh}</strong>
        </div>
      </button>

      <div className="project-copy">
        <div className="project-meta">
          <span>{project.id}</span>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </div>
        <p>{project.introEn}</p>
        <div className="tag-row">
          {project.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </motion.article>
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
          intro="AIGC 影像、短剧视觉、产品短片与动画原型合作。"
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
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28 }}
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
                <img src={project.cover} alt={project.titleZh} />
              )}
            </div>

            <div className="modal-content">
              <span className="section-kicker">{project.type}</span>
              <h2>{project.titleEn}</h2>
              <strong>{project.titleZh}</strong>
              <p>{project.introEn}</p>

              <div className="modal-detail-grid">
                <DetailBlock title="Challenge" text={project.challenge} />
                <DetailBlock title="Approach" text={project.approach} />
                <DetailBlock title="Outcome" text={project.outcome} />
              </div>

              <div className="modal-footer-row">
                <div className="modal-tools">
                  {project.tools.map(tool => <span key={tool}>{tool}</span>)}
                </div>
                {project.video && (
                  <button type="button" onClick={() => onMuteChange(value => !value)}>
                    {isMuted ? '打开声音' : '关闭声音'}
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

function SectionHeader({ kicker, title, intro }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.62 }}
    >
      <span className="section-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{intro}</p>
    </motion.div>
  )
}
