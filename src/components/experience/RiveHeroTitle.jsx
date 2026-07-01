import { useCallback, useEffect, useRef } from 'react'
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceBoolean,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
} from '@rive-app/react-webgl2'

const heroStateMachine = 'HeroSM'
const heroLayout = new Layout({
  fit: Fit.Contain,
  alignment: Alignment.Center,
})

export default function RiveHeroTitle({ src, scrollYProgress, onUnavailable }) {
  const pointerFrameRef = useRef(0)
  const pendingPointerRef = useRef(null)
  const lastTouchBurstRef = useRef(0)

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: heroStateMachine,
    autoplay: true,
    autoBind: true,
    layout: heroLayout,
    automaticallyHandleEvents: false,
    onLoadError: onUnavailable,
  }, {
    shouldResizeCanvasToContainer: true,
  })

  const viewModel = useViewModel(rive, { useDefault: true })
  const viewModelInstance = useViewModelInstance(viewModel, { useDefault: true, rive })
  const pointerX = useViewModelInstanceNumber('pointerX', viewModelInstance)
  const pointerY = useViewModelInstanceNumber('pointerY', viewModelInstance)
  const scrollProgress = useViewModelInstanceNumber('scrollProgress', viewModelInstance)
  const hovered = useViewModelInstanceBoolean('hovered', viewModelInstance)
  const burst = useViewModelInstanceTrigger('burst', viewModelInstance)

  const fireBurst = useCallback(() => {
    burst.trigger()
  }, [burst])

  const commitPointer = useCallback(() => {
    pointerFrameRef.current = 0

    const nextPointer = pendingPointerRef.current
    if (!nextPointer) return

    pointerX.setValue(nextPointer.x)
    pointerY.setValue(nextPointer.y)
  }, [pointerX, pointerY])

  const updatePointer = useCallback(event => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1)
    const y = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1)

    pendingPointerRef.current = { x, y }

    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(commitPointer)
    }
  }, [commitPointer])

  useEffect(() => () => {
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current)
  }, [])

  useEffect(() => {
    if (!scrollYProgress) return undefined

    const unsubscribe = scrollYProgress.on('change', value => {
      scrollProgress.setValue(value)
    })

    scrollProgress.setValue(scrollYProgress.get())
    return unsubscribe
  }, [scrollProgress, scrollYProgress])

  const handlePointerEnter = event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return

    hovered.setValue(true)
    updatePointer(event)
  }

  const handlePointerMove = event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') updatePointer(event)
  }

  const handlePointerLeave = () => {
    hovered.setValue(false)
    pendingPointerRef.current = { x: 0, y: 0 }
    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(commitPointer)
    }
  }

  const handlePointerDown = event => {
    if (event.pointerType === 'mouse') return

    lastTouchBurstRef.current = window.performance?.now?.() ?? Date.now()
    fireBurst()
  }

  const handleClick = () => {
    const now = window.performance?.now?.() ?? Date.now()
    if (now - lastTouchBurstRef.current < 420) return

    fireBurst()
  }

  const handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    fireBurst()
  }

  return (
    <div
      className="mc-hero-mark mc-rive-hero-mark"
      aria-label="AIGC Design Portfolio"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <RiveComponent className="mc-rive-hero-canvas" aria-hidden="true" />
      <h1 className="mc-screen-reader-only">AIGC Design Portfolio</h1>
      <p className="mc-hero-caption">
        AIGC Design Portfolio. AI film direction, short drama hooks and finished motion packaging.
      </p>
      <div className="mc-hero-signal" aria-hidden="true">
        <span>ai film direction</span>
        <span>scene systems</span>
        <span>motion packaging</span>
      </div>
    </div>
  )
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
