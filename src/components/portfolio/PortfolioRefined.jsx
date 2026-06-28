/**
 * ============================================
 * 作品集区 - 重构版
 *
 * 设计理念：
 * - 杂志式布局（非对称、大图）
 * - 深度内容（技术 + 商业 + 艺术）
 * - 细腻的交互（悬停展开详情）
 * - 呼吸感的间距
 * ============================================
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollAnimations'
import { usePointerTracking } from '../../hooks/useCardTilt'
import content from '../../content'

export default function PortfolioRefined() {
  const { ref, isInView } = useScrollReveal({ amount: 0.1 })
  const [expandedProject, setExpandedProject] = useState(null)

  return (
    <section
      id="portfolio"
      ref={ref}
      className="section-padding relative"
      style={{
        background: 'linear-gradient(180deg, var(--color-abyss) 0%, var(--color-void) 100%)'
      }}
    >
      <div className="container-wide">
        {/* 标题区 */}
        <div className="mb-[var(--space-3xl)] max-w-[900px]">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="title-section mb-[var(--space-lg)]"
          >
            {content.portfolio.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="body-large"
          >
            {content.portfolio.intro}
          </motion.p>
        </div>

        {/* 作品列表 */}
        <div className="space-y-[var(--space-3xl)]">
          {content.portfolio.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isExpanded={expandedProject === project.id}
              onToggle={() => setExpandedProject(
                expandedProject === project.id ? null : project.id
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index, isExpanded, onToggle }) {
  const pointerProps = usePointerTracking()

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative"
    >
      {/* 主卡片 */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-[var(--space-2xl)] items-start">

        {/* 左侧：图片/视频 */}
        <div
          className="relative aspect-[16/9] overflow-hidden cursor-pointer"
          {...pointerProps}
          onClick={onToggle}
        >
          {/* 占位图 */}
          <div className="absolute inset-0 bg-[var(--color-slate)]">
            <img
              src={project.cover || `/api/placeholder/1200/675`}
              alt={project.titleCN}
              className="w-full h-full object-cover transition-transform duration-700
                         group-hover:scale-105"
            />
          </div>

          {/* 悬停光效 */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                       pointer-events-none"
            style={{
              background: `radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
                          rgba(212,165,116,0.15) 0%, transparent 50%)`
            }}
          />

          {/* 项目编号 */}
          <div className="absolute top-[var(--space-lg)] left-[var(--space-lg)]">
            <span className="label text-[var(--color-ember)]">
              {project.id}
            </span>
          </div>

          {/* 播放提示 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-ember)] bg-opacity-90
                          flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* 右侧：内容 */}
        <div className="space-y-[var(--space-lg)]">
          {/* 标题 */}
          <div>
            <h3 className="title-card mb-[var(--space-sm)]">
              {project.titleCN}
            </h3>
            <p className="text-[var(--text-quaternary)] text-[var(--text-sm)] italic">
              {project.titleEN}
            </p>
          </div>

          {/* 诗意描述 */}
          <p className="body-regular text-[var(--color-frost)]">
            {project.poetic}
          </p>

          {/* 展开/收起按钮 */}
          <button
            onClick={onToggle}
            className="group/btn flex items-center gap-2 text-[var(--text-sm)]
                       text-[var(--color-ember)] hover:text-[var(--text-primary)]
                       transition-colors duration-300"
          >
            <span>{isExpanded ? '收起详情' : '展开详情'}</span>
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>

          {/* 快速指标 */}
          <div className="flex flex-wrap gap-[var(--space-md)] pt-[var(--space-md)]
                         border-t border-[var(--color-ghost)] border-opacity-20">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-[var(--color-ember)] font-semibold mb-1">
                  {value}
                </div>
                <div className="text-[var(--text-quinary)] text-[var(--text-xs)] uppercase">
                  {key === 'iterations' ? '迭代' :
                   key === 'successRate' ? '成功率' :
                   key === 'timeline' ? '周期' : '镜头'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 展开的详细内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-[var(--space-2xl)] grid lg:grid-cols-2 gap-[var(--space-2xl)]">

              {/* 技术挑战 & 解决方案 */}
              <div className="space-y-[var(--space-lg)]">
                <div>
                  <p className="label mb-[var(--space-sm)]">技术挑战</p>
                  <p className="body-regular">{project.challenge}</p>
                </div>

                <div>
                  <p className="label mb-[var(--space-sm)] text-[var(--color-ember)]">解决方案</p>
                  <p className="body-regular">{project.solution}</p>
                </div>
              </div>

              {/* 技术栈 & 商业价值 */}
              <div className="space-y-[var(--space-lg)]">
                <div>
                  <p className="label mb-[var(--space-sm)]">技术栈</p>
                  <ul className="space-y-[var(--space-xs)] text-[var(--text-sm)]">
                    {Object.entries(project.tech).map(([key, value]) => (
                      <li key={key} className="flex gap-2">
                        <span className="text-[var(--text-quaternary)] min-w-[100px]">
                          {key === 'model' ? '模型' :
                           key === 'lora' ? 'LoRA' :
                           key === 'controlnet' ? 'ControlNet' :
                           key === 'postProcessing' ? '后期' : '创新'}:
                        </span>
                        <span className="text-[var(--text-tertiary)]">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-[var(--space-lg)] bg-[var(--color-slate)] bg-opacity-30
                               border-l-2 border-[var(--color-ember)]">
                  <p className="label mb-[var(--space-sm)] text-[var(--color-ember)]">商业价值</p>
                  <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
                    {project.business}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
