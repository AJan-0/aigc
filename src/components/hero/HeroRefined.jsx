/**
 * ============================================
 * 英雄区 - 专业级重构版本
 *
 * 设计理念：
 * - 克制的排版（大量留白）
 * - 渐进式揭示（分层动画）
 * - 呼吸感（间距基于黄金比例）
 * - 文艺的叙事（诗意的文案）
 * ============================================
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import content from '../../content'

export default function HeroRefined() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // 视差效果 - 微妙的深度
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-void) 0%, var(--color-abyss) 100%)'
      }}
    >
      {/* 微妙的背景纹理 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--text-primary) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 渐变光晕 - 极其克制 */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
        animate={{
          background: [
            'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(156,168,184,0.06) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-wide relative z-10">
        <motion.div
          style={{ opacity }}
          className="max-w-[1400px] mx-auto"
        >
          {/* 顶部标签 - 微妙的引入 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-[var(--space-2xl)]"
          >
            <span className="label inline-flex items-center gap-3">
              <span className="w-8 h-[1px] bg-current opacity-30" />
              {content.hero.kicker}
            </span>
          </motion.div>

          {/* 主标题 - 渐进式出现，保持优雅 */}
          <div className="mb-[var(--space-2xl)]">
            {content.hero.title.split('\n').map((line, index) => (
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.4 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="title-hero"
                style={{
                  marginBottom: index === 0 ? 'var(--space-md)' : 0
                }}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {/* 副标题 - 呼吸般的节奏 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mb-[var(--space-3xl)]"
          >
            <p className="body-large max-w-[42rem]">
              {content.hero.subtitle}
            </p>
          </motion.div>

          {/* CTA - 克制的交互 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-[var(--space-md)]"
          >
            <a
              href="#portfolio"
              className="group relative px-[var(--space-lg)] py-[var(--space-md)]
                       bg-transparent border border-[var(--color-ember)]
                       text-[var(--color-ember)] font-medium
                       overflow-hidden transition-colors duration-300
                       hover:text-[var(--color-void)]"
            >
              <span className="relative z-10">{content.hero.cta.primary}</span>
              <motion.span
                className="absolute inset-0 bg-[var(--color-ember)]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </a>

            <a
              href="#methodology"
              className="px-[var(--space-lg)] py-[var(--space-md)]
                       text-[var(--text-tertiary)] font-medium
                       border border-[var(--text-quaternary)] border-opacity-30
                       transition-all duration-300
                       hover:border-opacity-60 hover:text-[var(--text-secondary)]"
            >
              {content.hero.cta.secondary}
            </a>
          </motion.div>

          {/* 滚动提示 - 极简 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="absolute bottom-[var(--space-2xl)] left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[var(--text-quinary)] text-[var(--text-xs)] tracking-wider">
                向下探索
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-[var(--text-quinary)]">
                <path
                  d="M8 3v10m0 0l-4-4m4 4l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 响应式优化 - 移动端完全不同的体验 */}
      <style jsx>{`
        @media (max-width: 768px) {
          .title-hero {
            font-size: clamp(2rem, 8vw, 3rem);
            line-height: 1.15;
            letter-spacing: -0.01em;
          }

          .body-large {
            font-size: var(--text-base);
            line-height: 1.75;
          }

          .container-wide {
            padding-top: var(--space-3xl);
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .title-hero {
            font-size: clamp(3rem, 6vw, 4rem);
          }
        }
      `}</style>
    </section>
  )
}
