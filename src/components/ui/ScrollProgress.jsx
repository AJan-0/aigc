/**
 * ============================================
 * 滚动进度指示器组件
 * ============================================
 */

import { useScrollProgress } from '../../hooks/useCustomCursor'

export default function ScrollProgress() {
  useScrollProgress()

  return <div className="scroll-progress" id="scrollProgress"></div>
}
