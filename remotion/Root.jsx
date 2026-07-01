import { Composition } from 'remotion'
import { ShowreelMotionBumper, showreelMotionDefaults } from './ShowreelMotionBumper.jsx'

export const showreelMotionConfig = {
  id: 'ShowreelMotionBumper',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
}

export function RemotionRoot() {
  return (
    <Composition
      id={showreelMotionConfig.id}
      component={ShowreelMotionBumper}
      durationInFrames={showreelMotionConfig.durationInFrames}
      fps={showreelMotionConfig.fps}
      width={showreelMotionConfig.width}
      height={showreelMotionConfig.height}
      defaultProps={showreelMotionDefaults}
    />
  )
}
