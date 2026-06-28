/**
 * ============================================
 * 英雄区组件 - 电影风格首屏
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'

export default function EditorialHero() {
  const { ref: heroRef, isInView } = useScrollReveal()

  const projects = [
    { idx: '01', name: '梦把我带向那只 Alpha', cue: '观看' },
    { idx: '02', name: '背叛之后，被 Alpha 认领', cue: '观看' },
    { idx: '03', name: '与 Alpha 的诅咒结契', cue: '观看' },
    { idx: '04', name: '重生后，我选择凶手的叔叔', cue: '观看' },
    { idx: '05', name: '街头捡到一位州长', cue: '观看' },
  ]

  const handleProjectClick = (index) => {
    // 滚动到对应作品
    const projectSection = document.querySelector('#projects')
    if (projectSection) {
      projectSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="editorial-hero" ref={heroRef}>
      <div className="editorial-hero-inner">
        {/* 顶部标识 */}
        <motion.div
          className="hero-ledger"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span>AI 影像作品集</span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          className="editorial-hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Poetfolio
        </motion.h1>

        {/* 底部内容 */}
        <div className="editorial-hero-lower">
          {/* 说明文字 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="hero-statement">
              将 <strong>AI 真人短剧</strong>、角色一致性与可交付影像工作流结合，
              把单次灵感沉淀成可迭代的制作系统。
            </p>
          </motion.div>

          {/* 作品索引 */}
          <motion.div
            className="hero-reel-index"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {projects.map((project, index) => (
              <motion.button
                key={project.idx}
                onClick={() => handleProjectClick(index)}
                className="magnetic"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                <span className="idx">{project.idx}</span>
                <span className="name">{project.name}</span>
                <span className="cue">{project.cue}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 滚动提示 */}
      <motion.div
        className="editorial-scroll-cue"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        向下滚动
      </motion.div>
    </section>
  )
}
