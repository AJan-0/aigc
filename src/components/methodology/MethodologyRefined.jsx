/**
 * ============================================
 * 工作方法区 - 重构版
 *
 * 设计理念：
 * - 流程可视化（数据驱动的叙事）
 * - 时间轴设计（垂直流动）
 * - 数据点强调（3847 次实验的意义）
 * - 交互式揭示（滚动触发）
 * ============================================
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollAnimations'
import content from '../../content'

export default function MethodologyRefined() {
  const sectionRef = useRef(null)
  const { ref, isInView } = useScrollReveal({ amount: 0.15 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      id="methodology"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-void) 0%, var(--color-abyss) 50%, var(--color-void) 100%)'
      }}
    >
      {/* 装饰线 - 时间轴视觉隐喻 */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-[1px] opacity-10"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-ember), var(--color-frost), transparent)'
        }}
      />

      <div className="container-reading relative z-10" ref={ref}>
        {/* 标题区 */}
        <div className="text-center mb-[var(--space-4xl)] max-w-[800px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label mb-[var(--space-lg)] block"
          >
            {content.methodology.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="title-section mb-[var(--space-lg)]"
          >
            {content.methodology.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="body-large"
          >
            {content.methodology.intro}
          </motion.p>
        </div>

        {/* 核心数据 - 视觉焦点 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mb-[var(--space-4xl)]"
        >
          <div className="max-w-[600px] mx-auto text-center p-[var(--space-2xl)]
                         border border-[var(--color-ember)] border-opacity-30
                         bg-[var(--color-slate)] bg-opacity-20 backdrop-blur-sm">
            <div className="mb-[var(--space-md)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-[var(--color-ember)]"
                style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1 }}
              >
                {content.methodology.coreMetric.value}
              </motion.div>
            </div>
            <p className="body-regular text-[var(--text-tertiary)]">
              {content.methodology.coreMetric.label}
            </p>
          </div>
        </motion.div>

        {/* 流程步骤 - 垂直时间轴 */}
        <div className="space-y-[var(--space-3xl)] max-w-[900px] mx-auto">
          {content.methodology.workflow.map((step, index) => (
            <WorkflowStep
              key={step.stage}
              step={step}
              index={index}
              isInView={isInView}
              y={y}
            />
          ))}
        </div>

        {/* 底部结语 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-[var(--space-4xl)] max-w-[700px] mx-auto"
        >
          <p className="body-regular text-[var(--color-frost)] italic">
            每一帧都是概率的结晶，<br />
            每一个镜头都是算法与直觉的对话。
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function WorkflowStep({ step, index, isInView, y }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
      className={`grid lg:grid-cols-[1fr_auto_1fr] gap-[var(--space-xl)] items-center
                  ${isEven ? '' : 'lg:[direction:rtl]'}`}
    >
      {/* 内容区 */}
      <div className={`${isEven ? 'lg:text-right' : 'lg:text-left [direction:ltr]'}`}>
        <div className="inline-block text-left">
          <span className="label text-[var(--color-ember)] mb-[var(--space-sm)] block">
            {step.stage}
          </span>

          <h3 className="title-card mb-[var(--space-md)]">
            {step.title}
          </h3>

          <p className="body-regular mb-[var(--space-lg)] max-w-[400px]">
            {step.description}
          </p>

          {/* 技术点 */}
          <ul className="space-y-[var(--space-xs)] text-[var(--text-sm)]">
            {step.techniques.map((tech, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[var(--text-tertiary)]"
              >
                <span className="text-[var(--color-frost)] opacity-60 mt-1">•</span>
                <span>{tech}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 中心节点 */}
      <div className="hidden lg:flex flex-col items-center [direction:ltr]">
        <motion.div
          style={{ y }}
          className="relative w-4 h-4 rounded-full bg-[var(--color-ember)]
                     shadow-[0_0_20px_rgba(212,165,116,0.5)]"
        >
          {/* 脉冲动画 */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--color-ember)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3
            }}
          />
        </motion.div>
      </div>

      {/* 占位区（用于网格对齐） */}
      <div className="hidden lg:block" />
    </motion.div>
  )
}
