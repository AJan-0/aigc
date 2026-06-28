/**
 * ============================================
 * 自定义光标组件 - 磁性交互
 * ============================================
 */

import { useEffect } from 'react'
import { useCustomCursor } from '../../hooks/useCustomCursor'

export default function CustomCursor() {
  useCustomCursor()

  return (
    <>
      <div className="cursor hidden md:block"></div>
      <div className="cursor-dot hidden md:block"></div>
    </>
  )
}
