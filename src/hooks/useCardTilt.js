/**
 * ============================================
 * 3D 卡片倾斜效果 Hook
 * ============================================
 */

import { useRef, useCallback } from 'react'
import { isMobile } from '../utils/helpers'

/**
 * 3D 倾斜效果 Hook
 * 根据鼠标位置创建卡片 3D 旋转效果
 */
export function useCardTilt(options = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = false,
    glareMaxOpacity = 0.7,
  } = options

  const ref = useRef(null)
  const rafId = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (isMobile() || !ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()

    // 计算鼠标相对于卡片中心的位置 (-1 到 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

    // 计算旋转角度
    const rotateX = -y * maxTilt
    const rotateY = x * maxTilt

    // 取消之前的 RAF
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    // 应用变换
    rafId.current = requestAnimationFrame(() => {
      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `

      // 发光效果
      if (glare) {
        const glareElement = element.querySelector('.tilt-glare')
        if (glareElement) {
          const glareX = (x + 1) * 50 // 0-100%
          const glareY = (y + 1) * 50 // 0-100%
          glareElement.style.background = `
            radial-gradient(circle at ${glareX}% ${glareY}%,
            rgba(255, 255, 255, ${glareMaxOpacity}) 0%,
            transparent 50%)
          `
        }
      }
    })
  }, [maxTilt, perspective, scale, glare, glareMaxOpacity])

  const handleMouseEnter = useCallback(() => {
    if (isMobile() || !ref.current) return

    const element = ref.current
    element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`

    // 添加发光层
    if (glare && !element.querySelector('.tilt-glare')) {
      const glareElement = document.createElement('div')
      glareElement.className = 'tilt-glare'
      glareElement.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
        mix-blend-mode: overlay;
        transition: opacity ${speed}ms ease;
      `
      element.appendChild(glareElement)
    }
  }, [speed, glare])

  const handleMouseLeave = useCallback(() => {
    if (isMobile() || !ref.current) return

    const element = ref.current

    // 取消 RAF
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    // 重置变换
    rafId.current = requestAnimationFrame(() => {
      element.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `

      // 隐藏发光层
      if (glare) {
        const glareElement = element.querySelector('.tilt-glare')
        if (glareElement) {
          glareElement.style.opacity = '0'
        }
      }
    })
  }, [perspective, glare])

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }
}

/**
 * 交互式光标跟踪 Hook
 * 为元素添加光标位置跟踪，用于创建交互光效
 */
export function usePointerTracking() {
  const ref = useRef(null)

  const handlePointerMove = useCallback((e) => {
    if (!ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()

    // 计算相对位置（百分比）
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // 设置 CSS 变量，可以在样式中使用
    element.style.setProperty('--pointer-x', `${x}%`)
    element.style.setProperty('--pointer-y', `${y}%`)

    // 添加 hover 类
    if (!element.classList.contains('is-hovering')) {
      element.classList.add('is-hovering')
    }
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.classList.remove('is-hovering')
  }, [])

  return {
    ref,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  }
}

/**
 * 按压反馈 Hook
 * 为按钮/卡片添加按压时的缩放反馈
 */
export function usePressEffect(scale = 0.95, duration = 150) {
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  const handlePointerDown = useCallback(() => {
    if (!ref.current) return

    const element = ref.current
    element.style.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    element.style.transform = `scale(${scale})`

    // 添加按压类
    element.classList.add('is-pressed')
  }, [scale, duration])

  const handlePointerUp = useCallback(() => {
    if (!ref.current) return

    const element = ref.current
    element.style.transform = 'scale(1)'

    // 延迟移除按压类
    timeoutRef.current = setTimeout(() => {
      element.classList.remove('is-pressed')
    }, duration)
  }, [duration])

  return {
    ref,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerUp, // 离开时也重置
  }
}
