/**
 * ============================================
 * 作品集区组件 - 带 3D 倾斜效果
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'
import { useCardTilt, usePointerTracking } from '../../hooks/useCardTilt'

export default function PortfolioSection() {
  const { ref, isInView } = useScrollReveal()

  const projects = [
    {
      id: '01',
      title: '梦把我带向那只 Alpha',
      titleEn: 'Dreams Lead to My Alpha',
      mood: '欲望 / 逃离 / 命运感',
      video: '/v1_mobile.mp4',
      cover: '/v1_cover.jpg',
    },
    {
      id: '02',
      title: '背叛之后，被 Alpha 认领',
      titleEn: 'Betrayed by the Wolf, Claimed by the Alpha',
      mood: '背叛 / 占有 / 强情绪',
      video: '/429.mp4',
      cover: '/429_cover.jpg',
    },
    {
      id: '03',
      title: '与 Alpha 的诅咒结契',
      titleEn: "Mated to the Alpha's Curse",
      mood: '诅咒 / 亲密 / 危险',
      video: '/795.mp4',
      cover: '/795_cover.jpg',
    },
  ]

  return (
    <section id="projects" className="portfolio-reel-section" ref={ref}>
      <div className="portfolio-reel-inner">
        {/* 标题 */}
        <motion.div
          className="reel-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="reel-heading">作品卷轴</h2>
          <p className="reel-intro">
            AI 真人短剧的影像探索，从角色一致性到可交付工作流。
          </p>
        </motion.div>

        {/* 作品列表 */}
        <div className="space-y-16 mt-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const tiltProps = useCardTilt({ maxTilt: 5, scale: 1.02 })
  const pointerProps = usePointerTracking()

  return (
    <motion.div
      className="reel-project"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* 元数据 */}
      <div className="reel-project-meta">
        <div className="reel-project-number">{project.id}</div>
        <div className="text-xs">{project.mood}</div>
      </div>

      {/* 主体 */}
      <div className="reel-project-body">
        {/* 视频/封面 */}
        <div
          className="reel-project-frame glass cursor-pointer"
          {...tiltProps}
          {...pointerProps}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img src={project.cover} alt={project.title} />

          {/* 交互光效 */}
          <div className="interaction-light"></div>

          {/* 播放标记 */}
          <div className="reel-play-mark">
            <span>点击播放</span>
            <span>▶</span>
          </div>
        </div>

        {/* 标题 */}
        <div className="reel-caption">
          <div>
            <h3 className="project-cn-title">{project.title}</h3>
            <p className="project-original-title">{project.titleEn}</p>
          </div>
          <div className="reel-caption-meta">作品 {project.id}</div>
        </div>
      </div>
    </motion.div>
  )
}
