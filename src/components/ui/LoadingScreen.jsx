/**
 * ============================================
 * 加载屏幕组件 - 电影胶片风格
 * ============================================
 */

import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`loading-screen editorial-loader ${hidden ? 'hidden' : ''}`}
      id="loadingScreen"
      role="status"
      aria-live="polite"
    >
      <div className="loader-frame">
        <div className="loader-topline">
          <span>AJan / AI 影像</span>
          <span>画面 0001</span>
        </div>
        <div className="loader-title">Poetfolio</div>
        <div className="loader-bottomline">
          <span>加载作品卷轴</span>
          <div className="loader-progress" aria-hidden="true">
            <span></span>
          </div>
          <span>2026</span>
        </div>
      </div>
    </div>
  )
}
