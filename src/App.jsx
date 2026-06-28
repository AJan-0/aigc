/**
 * ============================================
 * 主应用组件
 * ============================================
 */

import { Suspense, lazy } from 'react'
import Navbar from './components/navigation/Navbar'
import LoadingScreen from './components/ui/LoadingScreen'
import CustomCursor from './components/ui/CustomCursor'
import ScrollProgress from './components/ui/ScrollProgress'

// 懒加载组件以优化性能
const HeroRefined = lazy(() => import('./components/hero/HeroRefined'))
const ProfileRefined = lazy(() => import('./components/profile/ProfileRefined'))
const PortfolioRefined = lazy(() => import('./components/portfolio/PortfolioRefined'))
const MethodologyRefined = lazy(() => import('./components/methodology/MethodologyRefined'))
const FooterRefined = lazy(() => import('./components/footer/FooterRefined'))

export default function App() {
  return (
    <>
      {/* 加载屏幕 */}
      <LoadingScreen />

      {/* 滚动进度条 */}
      <ScrollProgress />

      {/* 自定义光标 */}
      <CustomCursor />

      {/* 噪点叠加层 */}
      <div className="noise-overlay"></div>

      {/* 无障碍跳转链接 */}
      <a href="#projects" className="skip-link">
        跳转到内容
      </a>

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容 */}
      <main>
        <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
          {/* 英雄区 */}
          <HeroRefined />

          {/* 个人简介区 */}
          <ProfileRefined />

          {/* 作品集区 */}
          <PortfolioRefined />

          {/* 工作方法区 */}
          <MethodologyRefined />

          {/* 页脚 */}
          <FooterRefined />
        </Suspense>
      </main>
    </>
  )
}
