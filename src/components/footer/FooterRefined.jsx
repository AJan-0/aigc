/**
 * ============================================
 * 页脚 - 重构版
 *
 * 设计理念：
 * - 极简主义（去掉多余装饰）
 * - 信息层级（联系方式优先）
 * - 精致排版（字距、行高）
 * - 微妙交互（悬停状态）
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'

export default function FooterRefined() {
  const { ref, isInView } = useScrollReveal({ amount: 0.3 })

  const currentYear = new Date().getFullYear()

  const contacts = [
    {
      label: '邮箱',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com'
    },
    {
      label: '微信',
      value: 'WeChat_ID',
      href: null
    },
  ]

  const social = [
    { name: 'Behance', href: '#' },
    { name: 'Vimeo', href: '#' },
    { name: '小红书', href: '#' },
    { name: 'B站', href: '#' },
  ]

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-[var(--color-ghost)] border-opacity-20"
      style={{ background: 'var(--color-void)' }}
    >
      <div className="container-wide py-[var(--space-3xl)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-[var(--space-3xl)] mb-[var(--space-3xl)]">

          {/* 左侧：联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="title-section mb-[var(--space-xl)]">
              开始对话
            </h2>

            <div className="space-y-[var(--space-lg)]">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  <p className="label mb-[var(--space-xs)]">{contact.label}</p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="body-large text-[var(--color-ember)] hover:text-[var(--text-primary)]
                               transition-colors duration-300"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="body-large text-[var(--text-tertiary)]">
                      {contact.value}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧：社交链接 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="title-card mb-[var(--space-lg)] text-[var(--color-frost)]">
              作品平台
            </h3>

            <ul className="space-y-[var(--space-sm)]">
              {social.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-2 text-[var(--text-tertiary)]
                             hover:text-[var(--text-primary)] transition-colors duration-300
                             group"
                  >
                    <span>{link.name}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <path
                        d="M1 11L11 1M11 1H1M11 1V11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-between items-center gap-4 pt-[var(--space-xl)]
                   border-t border-[var(--color-ghost)] border-opacity-10"
        >
          <p className="text-[var(--text-quinary)] text-[var(--text-sm)]">
            © {currentYear} Poetfolio. 在概率中寻找确定性。
          </p>

          <div className="flex gap-[var(--space-lg)] text-[var(--text-sm)]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[var(--text-quaternary)] hover:text-[var(--color-ember)]
                       transition-colors duration-300"
            >
              回到顶部 ↑
            </button>
          </div>
        </motion.div>
      </div>

      {/* 微妙的背景装饰 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-ember), var(--color-frost), transparent)'
        }}
      />
    </footer>
  )
}
