import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import content from '../../content'
import v1Video from '../../../v1_mobile.mp4'
import v1FullVideo from '../../../v1.mp4'
import v1Cover from '../../../v1_cover.jpg'
import betrayalVideo from '../../../429.mp4'
import betrayalCover from '../../../429_cover.jpg'
import curseVideo from '../../../795.mp4'
import curseCover from '../../../795_cover.jpg'
import rebornVideo from '../../../reborn.mp4'
import rebornCover from '../../../reborn_cover.jpg'
import pickingVideo from '../../../picking.mp4'
import pickingCover from '../../../picking_cover.jpg'
import profilePhoto from '../../../profile-photo.png'

const VIDEO_PROJECTS = [
  {
    id: '01',
    title: 'Dreams Lead to My Alpha',
    titleZh: '梦把我带向那只 Alpha',
    mood: '欲望 / 逃离 / 命运感',
    description: '把狼人短剧里最俗的命运感，做成观众愿意点开的第一眼。',
    cover: v1Cover,
    video: v1Video,
    fullVideo: v1FullVideo,
    duration: '0:52',
  },
  {
    id: '02',
    title: 'Betrayed by the Wolf, Claimed by the Alpha',
    titleZh: '背叛之后，被 Alpha 认领',
    mood: '背叛 / 占有 / 强情绪',
    description: '用短剧的强钩子做压力测试：角色要稳定，情绪要先于技术出现。',
    cover: betrayalCover,
    video: betrayalVideo,
    duration: '2:24',
  },
  {
    id: '03',
    title: "Mated to the Alpha's Curse",
    titleZh: '与 Alpha 的诅咒结契',
    mood: '诅咒 / 亲密 / 危险',
    description: '在类型片语法里处理人物连续性，让 AI 画面不只像预告片，也能进入剪辑。',
    cover: curseCover,
    video: curseVideo,
    duration: '1:39',
  },
  {
    id: '04',
    title: "Reborn This Time I Choose My Killer's Uncle",
    titleZh: '重生后，我选择凶手的叔叔',
    mood: '复仇 / 选择 / 黑色浪漫',
    description: '把夸张标题里的戏剧性压进镜头节奏，测试英文短剧的画面可信度。',
    cover: rebornCover,
    video: rebornVideo,
    duration: '1:24',
  },
  {
    id: '05',
    title: 'Picking Up a Governor from the Street',
    titleZh: '街头捡到一位州长',
    mood: '荒诞 / 权力 / 反差',
    description: '从荒诞设定开始，观察 AI 如何处理场景切换、人物身份和叙事反差。',
    cover: pickingCover,
    video: pickingVideo,
    duration: '1:46',
  },
]

const insightTabs = [
  { id: 'story', label: '叙事' },
  { id: 'build', label: '制作' },
  { id: 'profile', label: '作者' },
]

export default function PortfolioExperience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('story')
  const [isMuted, setIsMuted] = useState(true)
  const [isCinemaOpen, setIsCinemaOpen] = useState(false)
  const stageVideoRef = useRef(null)
  const activeProject = VIDEO_PROJECTS[activeIndex]
  const relatedCase = useMemo(() => {
    const portfolioCases = content.portfolio?.projects ?? []
    return portfolioCases[activeIndex % Math.max(portfolioCases.length, 1)] ?? {}
  }, [activeIndex])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        setActiveIndex(index => (index + 1) % VIDEO_PROJECTS.length)
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        setActiveIndex(index => (index - 1 + VIDEO_PROJECTS.length) % VIDEO_PROJECTS.length)
      }
      if (event.key === 'Escape') {
        setIsCinemaOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (stageVideoRef.current) {
      stageVideoRef.current.muted = isMuted
      stageVideoRef.current.play().catch(() => {})
    }
  }, [activeIndex, isMuted])

  return (
    <main className="studio-page">
      <header className="studio-topbar">
        <a className="studio-brand" href="#reel" aria-label="Poetfolio 首页">
          <span>Poetfolio</span>
          <small>AI moving image</small>
        </a>
        <nav className="studio-nav" aria-label="页面导航">
          <a href="#reel">作品</a>
          <a href="#profile">作者</a>
          <a href="#system">方法</a>
        </nav>
      </header>

      <section className="studio-workbench" id="reel" aria-label="作品放映台">
        <aside className="project-rail" aria-label="作品列表">
          {VIDEO_PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-current={index === activeIndex}
            >
              <span>{project.id}</span>
              <strong>{project.titleZh}</strong>
              <small>{project.duration}</small>
            </button>
          ))}
        </aside>

        <section className="screen-stage" aria-label={activeProject.titleZh}>
          <div className="screen-meta">
            <span>{activeProject.id} / {VIDEO_PROJECTS.length.toString().padStart(2, '0')}</span>
            <span>{activeProject.mood}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              className="video-shell"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <video
                ref={stageVideoRef}
                src={activeProject.video}
                poster={activeProject.cover}
                muted={isMuted}
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            </motion.div>
          </AnimatePresence>

          <div className="stage-actions" aria-label="视频操作">
            <button
              type="button"
              onClick={() => setIsMuted(value => !value)}
              aria-label={isMuted ? '打开声音' : '关闭声音'}
            >
              {isMuted ? '♪' : '×'}
            </button>
            <button
              type="button"
              onClick={() => setIsCinemaOpen(true)}
              aria-label="全屏查看当前作品"
            >
              ⛶
            </button>
          </div>

          <div className="stage-caption">
            <p>Now playing</p>
            <h1>{activeProject.titleZh}</h1>
            <span>{activeProject.title}</span>
          </div>

          <div className="mobile-reel-switcher" aria-label="移动端作品切换">
            {VIDEO_PROJECTS.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => setActiveIndex(index)}
                aria-label={`切换到${project.titleZh}`}
              >
                {project.id}
              </button>
            ))}
          </div>
        </section>

        <aside className="insight-panel" aria-label="当前作品信息">
          <div className="tab-strip" role="tablist" aria-label="信息切换">
            {insightTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeProject.id}-${activeTab}`}
              className="insight-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'story' && (
                <StoryPanel project={activeProject} caseData={relatedCase} />
              )}
              {activeTab === 'build' && (
                <BuildPanel caseData={relatedCase} />
              )}
              {activeTab === 'profile' && (
                <ProfilePanel compact />
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </section>

      <ProjectIndex projects={VIDEO_PROJECTS} activeIndex={activeIndex} onSelect={setActiveIndex} />
      <ProfileSection />
      <MethodSection />

      <CinemaModal
        project={activeProject}
        isOpen={isCinemaOpen}
        isMuted={isMuted}
        onClose={() => setIsCinemaOpen(false)}
        onMuteChange={setIsMuted}
      />
    </main>
  )
}

function StoryPanel({ project, caseData }) {
  return (
    <>
      <span className="panel-kicker">Current tension</span>
      <h2>{project.titleZh}</h2>
      <p>{project.description}</p>
      {caseData?.poetic && <blockquote>{caseData.poetic}</blockquote>}
      <dl className="metric-grid">
        {Object.entries(caseData?.metrics ?? {}).map(([key, value]) => (
          <div key={key}>
            <dt>{metricLabel(key)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function BuildPanel({ caseData }) {
  const techEntries = Object.entries(caseData?.tech ?? {})

  return (
    <>
      <span className="panel-kicker">Making logic</span>
      <h2>{caseData?.titleCN ?? '影像生成链路'}</h2>
      <p>{caseData?.challenge ?? '围绕角色一致性、镜头欲望和短剧钩子建立制作判断。'}</p>
      <ul className="build-list">
        {techEntries.map(([key, value]) => (
          <li key={key}>
            <span>{techLabel(key)}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
    </>
  )
}

function ProfilePanel({ compact = false }) {
  const profile = content.profile

  return (
    <div className={compact ? 'profile-panel is-compact' : 'profile-panel'}>
      <span className="panel-kicker">{profile.eyebrow}</span>
      <h2>{profile.name}</h2>
      <p className="profile-title">{profile.title}</p>
      <div className="profile-copy">
        {profile.bio.map(paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {!compact && (
        <blockquote>
          <strong>{profile.philosophy.title}</strong>
          {profile.philosophy.content}
        </blockquote>
      )}
    </div>
  )
}

function ProjectIndex({ projects, activeIndex, onSelect }) {
  return (
    <section className="project-index" aria-label="作品索引">
      <div className="section-heading">
        <span>Selected video data</span>
        <h2>五条作品，直接进入画面</h2>
      </div>
      <div className="index-list">
        {projects.map((project, index) => (
          <button
            type="button"
            key={project.id}
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => {
              onSelect(index)
              document.getElementById('reel')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <img src={project.cover} alt="" loading="lazy" />
            <span>{project.id}</span>
            <strong>{project.titleZh}</strong>
            <small>{project.mood}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function ProfileSection() {
  const profile = content.profile

  return (
    <section className="creator-section" id="profile" aria-label="创作者信息">
      <div className="creator-portrait">
        <img src={profilePhoto} alt={profile.name} loading="lazy" />
      </div>
      <div className="creator-copy">
        <ProfilePanel />
      </div>
      <div className="capability-columns">
        {profile.capabilities.map(group => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

function MethodSection() {
  const stages = content.methodology?.stages ?? []

  return (
    <section className="method-board" id="system" aria-label="制作方法">
      <div className="section-heading">
        <span>Production system</span>
        <h2>{content.methodology?.title ?? '工作流'}</h2>
        <p>{content.methodology?.subtitle}</p>
      </div>
      <div className="method-steps">
        {stages.map(stage => (
          <article key={stage.stage}>
            <span>{stage.stage}</span>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
            <strong>{stage.output}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

function CinemaModal({ project, isOpen, isMuted, onClose, onMuteChange }) {
  if (!isOpen) return null

  return (
    <div className="cinema-modal" role="dialog" aria-modal="true" aria-label={project.titleZh}>
      <button type="button" className="cinema-close" onClick={onClose} aria-label="关闭">
        ×
      </button>
      <video
        src={project.fullVideo ?? project.video}
        poster={project.cover}
        muted={isMuted}
        autoPlay
        controls
        playsInline
      />
      <div className="cinema-meta">
        <div>
          <span>{project.id}</span>
          <h2>{project.titleZh}</h2>
          <p>{project.title}</p>
        </div>
        <button type="button" onClick={() => onMuteChange(value => !value)}>
          {isMuted ? '打开声音' : '关闭声音'}
        </button>
      </div>
    </div>
  )
}

function metricLabel(key) {
  return {
    iterations: '迭代',
    successRate: '留存',
    timeline: '周期',
    finalShots: '镜头',
  }[key] ?? key
}

function techLabel(key) {
  return {
    model: '模型',
    lora: '角色',
    controlnet: '控制',
    postProcessing: '后期',
    innovation: '方法',
  }[key] ?? key
}
