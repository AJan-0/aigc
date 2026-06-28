/**
 * ============================================
 * 工作方法区组件
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'

export default function MethodSection() {
  const { ref, isInView } = useScrollReveal()

  const methods = [
    {
      num: '01',
      title: '创意策略与分镜',
      desc: '用 LLM 辅助拆解卖点、情绪曲线和镜头脚本',
    },
    {
      num: '02',
      title: '角色资产与控制',
      desc: '建立角色一致性方案，处理表演状态和镜头衔接',
    },
    {
      num: '03',
      title: '批量生成与迭代',
      desc: '通过 ComfyUI 工作流实现批处理和版本管理',
    },
    {
      num: '04',
      title: '后期与交付',
      desc: '剪辑、调色、字幕包装，服务真实发布场景',
    },
  ]

  return (
    <section className="method-section" ref={ref}>
      <div className="method-inner">
        {/* 标题 */}
        <motion.div
          className="method-title"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">工作方法</span>
          <h2>从灵感到交付</h2>
        </motion.div>

        {/* 方法列表 */}
        <div className="method-lines">
          {methods.map((method, i) => (
            <motion.div
              key={method.num}
              className="method-line glass"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="num">{method.num}</div>
              <div>
                <h3>{method.title}</h3>
                <p>{method.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
