/**
 * ============================================
 * 导航栏组件 - 电影风格
 * ============================================
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { smoothScrollTo } from '../../utils/helpers'

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 滚动监听
  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setScrolled(currentScrollY > 100)

      // 向下滚动时隐藏，向上滚动时显示
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 移动端自动关闭菜单
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false)
    }
  }, [isMobile])

  const navItems = [
    { name: '作品', href: '#projects' },
    { name: '关于', href: '#profile' },
    { name: '联系', href: '#contact' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    smoothScrollTo(href)
    setIsMobileOpen(false)
  }

  return (
    <motion.nav
      role="navigation"
      aria-label="主导航"
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`editorial-nav fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/55 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          whileHover={!isMobile ? { scale: 1.05 } : {}}
          whileTap={{ scale: 0.95 }}
          className="nav-wordmark hoverable magnetic min-h-12 flex items-center px-2 text-2xl md:text-3xl font-bold"
        >
          Poetfolio
        </motion.a>

        {/* 桌面导航 */}
        {!isMobile ? (
          <div className="flex gap-6 md:gap-8 lg:gap-12">
            {navItems.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                whileHover={{ y: -2 }}
                className="nav-link-editorial relative hoverable magnetic group min-h-12 flex items-center px-2"
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-orange-500 to-cyan-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        ) : (
          /* 移动端汉堡菜单 */
          <motion.button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 hover:bg-white/10 transition-colors min-h-12 min-w-12 flex items-center justify-center rounded-lg"
            whileTap={{ scale: 0.9 }}
            aria-label="切换菜单"
            aria-expanded={isMobileOpen}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        )}
      </div>

      {/* 移动端菜单 */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 overflow-hidden ${
            isMobileOpen ? 'block' : 'pointer-events-none'
          }`}
        >
          <div className="flex flex-col divide-y divide-white/10">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-6 py-4 min-h-12 flex items-center nav-link-editorial hover:bg-white/5 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
