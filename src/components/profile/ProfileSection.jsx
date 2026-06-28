/**
 * ============================================
 * 个人简介区组件
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'

export default function ProfileSection() {
  const { ref, isInView } = useScrollReveal()

  const capabilities = [
    { num: '01', title: '可复用制作系统', desc: '把单次灵感沉淀成可迭代的工作流' },
    { num: '02', title: '角色与镜头控制', desc: '围绕人物一致性建立控制策略' },
    { num: '03', title: 'AI 视频到成片', desc: '接入剪辑、调色、字幕和包装流程' },
  ]

  return (
    <section id="profile" className="editorial-profile" ref={ref}>
      <div className="editorial-profile-inner">
        {/* 左侧介绍 */}
        <motion.div
          className="profile-nameplate"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">关于创作者</span>
          <h2>AJan</h2>
          <p>
            探索 AI 影像在真人短剧场景下的可交付性，
            从视觉实验到工业化工作流的实践者。
          </p>
        </motion.div>

        {/* 中间照片 */}
        <motion.div
          className="profile-photo-plate glass"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/profile-photo.png" alt="AJan" />
        </motion.div>

        {/* 右侧能力 */}
        <motion.ul
          className="profile-capability"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {capabilities.map((item, i) => (
            <motion.li
              key={item.num}
              className="glass"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <div className="num">{item.num}</div>
              <div>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
