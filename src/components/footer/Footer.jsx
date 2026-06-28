/**
 * ============================================
 * 页脚组件
 * ============================================
 */

import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollAnimations'

export default function Footer() {
  const { ref, isInView } = useScrollReveal()

  return (
    <footer id="contact" className="editorial-footer" ref={ref}>
      <motion.div
        className="editorial-footer-inner glass"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="footer-wordmark">Poetfolio</div>
        <div className="footer-contact">
          <span>联系方式</span>
          <a href="mailto:contact@poetfolio.com" className="magnetic">
            contact@poetfolio.com
          </a>
          <div className="mt-4 text-xs">
            © 2026 AJan. AI 影像作品集
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
