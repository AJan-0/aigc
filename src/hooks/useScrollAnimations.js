/**
 * ============================================
 * 滚动动画 Hooks
 * ============================================
 */

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * 滚动揭示动画 Hook
 * 元素进入视口时触发动画
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
    ...options
  })

  return { ref, isInView }
}

/**
 * 视差滚动 Hook
 * 创建多层次视差效果
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect()
          const scrolled = window.scrollY
          const elementTop = rect.top + scrolled
          const windowHeight = window.innerHeight

          // 只在元素在视口附近时计算
          if (elementTop < scrolled + windowHeight && elementTop + rect.height > scrolled) {
            const offset = (scrolled - elementTop + windowHeight) * speed
            element.style.transform = `translateY(${offset}px)`
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化位置

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}

/**
 * 滚动触发计数动画 Hook
 */
export function useCountUp(end, duration = 2000) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const countRef = useRef(0)

  useEffect(() => {
    if (!isInView) return

    const element = ref.current
    if (!element) return

    const start = 0
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // 缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      countRef.current = Math.floor(start + (end - start) * easeOutQuart)

      element.textContent = countRef.current

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.textContent = end
      }
    }

    animate()
  }, [isInView, end, duration])

  return ref
}

/**
 * 滚动进度跟踪 Hook
 * 返回当前滚动进度 (0-1)
 */
export function useScrollProgress() {
  const progressRef = useRef(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrolled = window.scrollY
          progressRef.current = scrollHeight > 0 ? scrolled / scrollHeight : 0
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progressRef
}
