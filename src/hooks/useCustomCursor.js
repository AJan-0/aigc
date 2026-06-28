/**
 * ============================================
 * 自定义 Hooks - 高级光标交互
 * ============================================
 */

import { useEffect, useRef } from 'react'
import { isMobile, lerp } from '../utils/helpers'

/**
 * 磁性光标效果 Hook
 * 光标会被按钮吸引，创造高级交互感
 */
export function useCustomCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const isMoving = useRef(false)
  const magneticTarget = useRef(null)

  useEffect(() => {
    // 移动设备不显示自定义光标
    if (isMobile()) return

    const cursor = document.querySelector('.cursor')
    const cursorDot = document.querySelector('.cursor-dot')

    if (!cursor || !cursorDot) return

    cursorRef.current = cursor
    cursorDotRef.current = cursorDot

    // 动画循环
    const animate = () => {
      if (isMoving.current) {
        // 磁性效果
        let targetX = mousePos.current.x
        let targetY = mousePos.current.y

        if (magneticTarget.current) {
          const rect = magneticTarget.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distance = Math.hypot(targetX - centerX, targetY - centerY)
          const magnetStrength = Math.max(0, 1 - distance / 100)

          targetX = lerp(targetX, centerX, magnetStrength * 0.5)
          targetY = lerp(targetY, centerY, magnetStrength * 0.5)
        }

        // 平滑跟随
        cursorPos.current.x += (targetX - cursorPos.current.x) * 0.15
        cursorPos.current.y += (targetY - cursorPos.current.y) * 0.15
        dotPos.current.x += (targetX - dotPos.current.x) * 0.25
        dotPos.current.y += (targetY - dotPos.current.y) * 0.25

        cursor.style.left = cursorPos.current.x + 'px'
        cursor.style.top = cursorPos.current.y + 'px'
        cursorDot.style.left = dotPos.current.x + 'px'
        cursorDot.style.top = dotPos.current.y + 'px'

        isMoving.current = false
      }
      requestAnimationFrame(animate)
    }

    animate()

    // 鼠标移动处理
    const handleMouseMove = (e) => {
      cursor.classList.add('active')
      cursorDot.classList.add('active')
      mousePos.current = { x: e.clientX, y: e.clientY }
      isMoving.current = true
    }

    // 悬停处理 - 磁性效果
    const handleMouseEnter = (e) => {
      cursor.classList.add('hover')

      // 检查是否是磁性元素
      if (e.target.classList.contains('magnetic') ||
          e.target.closest('.magnetic')) {
        magneticTarget.current = e.target.classList.contains('magnetic')
          ? e.target
          : e.target.closest('.magnetic')
        cursor.classList.add('magnetic')
      }
    }

    const handleMouseLeave = () => {
      cursor.classList.remove('hover', 'magnetic')
      magneticTarget.current = null
    }

    // 绑定事件
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const hoverElements = document.querySelectorAll('a, button, .hoverable, .magnetic')
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    // 清理
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])
}

/**
 * 滚动进度 Hook
 */
export function useScrollProgress() {
  useEffect(() => {
    const progressBar = document.getElementById('scrollProgress')
    if (!progressBar) return

    let ticking = false

    const updateProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrolled = window.scrollY
          const progress = (scrolled / scrollHeight) * 100
          progressBar.style.width = progress + '%'
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])
}

/**
 * 页面加载 Hook
 */
export function usePageLoading() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen')
      if (loadingScreen) {
        loadingScreen.classList.add('hidden')
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [])
}
