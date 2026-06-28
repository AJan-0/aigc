/**
 * ============================================
 * 视频模态框 Hook - 高级交互
 * ============================================
 */

import { useState, useRef, useEffect, useCallback } from 'react'

export function useVideoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(false)

  const videoRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  // 打开模态框
  const openModal = useCallback((videoUrl) => {
    setCurrentVideo(videoUrl)
    setIsOpen(true)
    setCurrentTime(0)
    setIsPlaying(false)
    document.body.style.overflow = 'hidden'
  }, [])

  // 关闭模态框
  const closeModal = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsOpen(false)
    setCurrentVideo(null)
    setIsPlaying(false)
    document.body.style.overflow = ''
  }, [])

  // 播放/暂停
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  // 跳转到指定时间
  const seekTo = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // 设置音量
  const handleVolumeChange = useCallback((newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }, [])

  // 切换倍速
  const togglePlaybackRate = useCallback(() => {
    const rates = [1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]

    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate
      setPlaybackRate(nextRate)
    }
  }, [playbackRate])

  // 显示控制栏
  const showControlsBar = useCallback(() => {
    setShowControls(true)

    // 清除之前的定时器
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    // 3秒后隐藏控制栏（仅在播放时）
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [isPlaying])

  // 视频事件监听
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBuffered((bufferedEnd / video.duration) * 100)
      }
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // 键盘快捷键
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seekTo(Math.max(0, currentTime - 5))
          break
        case 'ArrowRight':
          e.preventDefault()
          seekTo(Math.min(duration, currentTime + 5))
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange(Math.max(0, volume - 0.1))
          break
        case 'f':
          e.preventDefault()
          if (videoRef.current) {
            if (document.fullscreenElement) {
              document.exitFullscreen()
            } else {
              videoRef.current.requestFullscreen()
            }
          }
          break
        case 'Escape':
          closeModal()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isPlaying, currentTime, duration, volume, togglePlay, seekTo, handleVolumeChange, closeModal])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  return {
    // 状态
    isOpen,
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    playbackRate,
    showControls,
    videoRef,

    // 方法
    openModal,
    closeModal,
    togglePlay,
    seekTo,
    handleVolumeChange,
    togglePlaybackRate,
    showControlsBar,
  }
}
