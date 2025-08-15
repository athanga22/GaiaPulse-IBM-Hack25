import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Globe } from './Globe'

interface EarthSceneProps {
  mood?: {
    mood: string
    confidence: number
    timestamp: string
  }
  environmentalData?: {
    temperature: number
    co2_levels: number
    forest_cover: number
    ocean_health: number
  }
}

export function EarthScene({ mood }: EarthSceneProps) {
  return (
    <div className="earth-scene-container" style={{ 
      width: '100%', 
      height: '600px', 
      position: 'relative'
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        
        {/* Simple lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        
        {/* Main Earth component */}
        <Suspense fallback={null}>
          <Globe appState={mood?.mood === 'critical' ? 'critical' : 
                          mood?.mood === 'stressed' ? 'stressed' : 
                          mood?.mood === 'healing' ? 'healing' : 'neutral'} />
        </Suspense>
        

      </Canvas>
      
      {/* Overlay information */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'monospace'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Earth Status: {mood?.mood || 'Unknown'}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          Confidence: {(mood?.confidence || 0) * 100}%
        </div>
      </div>
      
      {/* Interactive controls info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '10px 15px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: '12px',
        opacity: 0.8
      }}>
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>🔄 Auto-rotating</div>
      </div>
    </div>
  )
}
