import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Text, 
  Float, 
  Stars
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

interface SimpleEarthProps {
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

export function SimpleEarth({ mood, environmentalData }: SimpleEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [distortionIntensity, setDistortionIntensity] = useState(0.3)

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
        count={3000} 
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
            color={mood?.mood === 'critical' ? '#dc2626' : mood?.mood === 'stressed' ? '#ea580c' : '#3b82f6'}
            roughness={0.8}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Atmospheric glow */}
        <Sphere ref={atmosphereRef} args={[1.1, 32, 32]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#ef4444' : mood?.mood === 'stressed' ? '#f59e0b' : '#6366f1'}
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
            color={mood?.mood === 'critical' ? '#b91c1c' : mood?.mood === 'stressed' ? '#d97706' : '#1d4ed8'}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
      
      {/* Environmental data indicators */}
      {environmentalData && (
        <group>
          {/* Temperature indicator */}
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[2, 1, 0]}
              fontSize={0.3}
              color={environmentalData.temperature > 15 ? '#ef4444' : '#3b82f6'}
              anchorX="center"
              anchorY="middle"
            >
              {environmentalData.temperature}°C
            </Text>
          </Float>
          
          {/* CO2 indicator */}
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[-2, 1, 0]}
              fontSize={0.3}
              color={environmentalData.co2_levels > 400 ? '#ef4444' : '#22c55e'}
              anchorX="center"
              anchorY="middle"
            >
              CO₂: {environmentalData.co2_levels}ppm
            </Text>
          </Float>
        </group>
      )}
      
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
