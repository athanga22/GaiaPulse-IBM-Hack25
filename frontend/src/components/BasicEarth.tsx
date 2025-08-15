import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface BasicEarthProps {
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

export function BasicEarth({ mood }: BasicEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)

  // Simple animation
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  // Get color based on mood
  const getEarthColor = () => {
    if (mood?.mood === 'critical') return '#ff4444'
    if (mood?.mood === 'stressed') return '#ff8844'
    if (mood?.mood === 'healing') return '#44ff44'
    return '#4488ff' // neutral
  }

  return (
    <>
      {/* Simple Earth sphere */}
      <Sphere ref={earthRef} args={[1, 32, 32]}>
        <meshStandardMaterial 
          color={getEarthColor()}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
    </>
  )
}
