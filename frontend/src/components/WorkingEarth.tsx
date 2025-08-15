import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Stars
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

interface WorkingEarthProps {
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

export function WorkingEarth({ mood }: WorkingEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [distortionIntensity, setDistortionIntensity] = useState(0.3)

  // Create a simple Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create ocean background
    ctx.fillStyle = '#1e40af'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add simple continents
    const continents = [
      { x: 0.2, y: 0.3, width: 0.15, height: 0.2, color: '#22c55e' }, // North America
      { x: 0.4, y: 0.4, width: 0.12, height: 0.15, color: '#16a34a' }, // South America
      { x: 0.6, y: 0.35, width: 0.18, height: 0.25, color: '#15803d' }, // Europe/Asia
      { x: 0.8, y: 0.45, width: 0.1, height: 0.12, color: '#166534' },  // Australia
    ]
    
    continents.forEach(continent => {
      ctx.fillStyle = continent.color
      ctx.beginPath()
      ctx.ellipse(
        continent.x * canvas.width,
        continent.y * canvas.height,
        continent.width * canvas.width * 0.5,
        continent.height * canvas.height * 0.5,
        0, 0, Math.PI * 2
      )
      ctx.fill()
    })
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Dynamic effects based on mood
  useEffect(() => {
    if (mood?.mood === 'critical') {
      setDistortionIntensity(1.0)
    } else if (mood?.mood === 'stressed') {
      setDistortionIntensity(0.6)
    } else {
      setDistortionIntensity(0.3)
    }
  }, [mood])

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime)
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.1
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.15
    }
    
    // Simple camera movement
    camera.position.x = Math.sin(time * 0.1) * 8
    camera.position.z = Math.cos(time * 0.1) * 8
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Earth Core */}
      <group>
        {/* Main Earth sphere */}
        <Sphere ref={earthRef} args={[1, 64, 64]}>
          <meshStandardMaterial 
            map={earthTexture}
            roughness={0.8}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Atmospheric glow */}
        <Sphere ref={atmosphereRef} args={[1.1, 32, 32]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#ef4444' : mood?.mood === 'stressed' ? '#f59e0b' : '#3b82f6'}
            transparent
            opacity={0.3}
            distort={distortionIntensity}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Outer atmosphere */}
        <Sphere args={[1.3, 32, 32]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#dc2626' : mood?.mood === 'stressed' ? '#d97706' : '#2563eb'}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={mood?.mood === 'critical' ? 2 : mood?.mood === 'stressed' ? 1.5 : 1}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration 
          offset={mood?.mood === 'critical' ? [0.002, 0.002] : [0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.3} 
          offset={0.5} 
        />
      </EffectComposer>
    </>
  )
}
