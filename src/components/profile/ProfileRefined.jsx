/**
 * ============================================
 * 个人简介区 - 重构版
 *
 * 设计理念：
 * - 不对称布局（打破常规）
 * - 大量留白（呼吸感）
 * - 文艺的叙事（哲学性）
 * - 数据可视化（技术深度）
 * ============================================
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollAnimations'
import content from '../../content'

export default function ProfileRefined() {
  const sectionRef = useRef(null)
  const { ref, isInView } = useScrollReveal({ amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--color-abyss)' }}
    >
      {/* 装饰性网格 - 极其微妙 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--color-ember) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-ember) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container-reading relative z-10" ref={ref}>
        {/* 顶部标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-[var(--space-2xl)]"
        >
          <span className="label">{content.profile.eyebrow}</span>
        </motion.div>

        {/* 主内容区 - 不对称网格 */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-[var(--space-3xl)] items-start">

          {/* 左侧：文字内容 */}
          <div>
            {/* 名字 */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="title-section mb-[var(--space-sm)]"
            >
              {content.profile.name}
            </motion.h2>

            {/* 标题 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[var(--color-frost)] mb-[var(--space-2xl)]"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {content.profile.title}
            </motion.p>

            {/* 简介段落 */}
            <div className="space-y-[var(--space-lg)] mb-[var(--space-3xl)]">
              {content.profile.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="body-regular"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* 创作哲学 - 引用块样式 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative pl-[var(--space-xl)] py-[var(--space-lg)]
                         border-l-2 border-[var(--color-ember)]"
            >
              <p className="label mb-[var(--space-sm)] text-[var(--color-ember)]">
                {content.profile.philosophy.title}
              </p>
              <p className="body-regular italic">
                {content.profile.philosophy.content}
              </p>
            </motion.div>
          </div>

          {/* 右侧：能力矩阵 */}
          <motion.div
            style={{ y }}
            className="space-y-[var(--space-2xl)]"
          >
            {content.profile.capabilities.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + catIndex * 0.2 }}
              >
                <h3 className="title-card mb-[var(--space-md)] text-[var(--color-ember)]">
                  {category.title}
                </h3>

                <ul className="space-y-[var(--space-sm)]">
                  {category.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: 10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + catIndex * 0.2 + itemIndex * 0.05 }}
                      className="flex items-start gap-[var(--space-sm)]
                                 text-[var(--text-tertiary)] text-[var(--text-sm)]"
                    >
                      <span className="text-[var(--color-ember)] opacity-50 mt-1">→</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 响应式优化 */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }
        }

        @media (max-width: 768px) {
          .pl-\\[var\\(--space-xl\\)\\] {
            padding-left: var(--space-lg);
          }

          .title-card {
            font-size: var(--text-lg);
          }
        }
      `}</style>
    </section>
  )
}
