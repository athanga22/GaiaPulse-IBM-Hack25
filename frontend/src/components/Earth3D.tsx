import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Text, Float, Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'

interface Earth3DProps {
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

export function Earth3D({ mood, environmentalData }: Earth3DProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [distortionIntensity, setDistortionIntensity] = useState(0.3)


  // Create realistic Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Create base ocean color
    ctx.fillStyle = '#1e40af'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add continents with realistic shapes
    const continents = [
      { x: 0.2, y: 0.3, width: 0.15, height: 0.2, color: '#22c55e' }, // North America
      { x: 0.4, y: 0.4, width: 0.12, height: 0.15, color: '#16a34a' }, // South America
      { x: 0.6, y: 0.35, width: 0.18, height: 0.25, color: '#15803d' }, // Europe/Asia
      { x: 0.8, y: 0.45, width: 0.1, height: 0.12, color: '#166534' },  // Australia
      { x: 0.1, y: 0.7, width: 0.08, height: 0.1, color: '#14532d' },   // Antarctica
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
    
    // Add some texture variation
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 1,
        Math.random() * 2 + 1
      )
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Create cloud texture


  // Dynamic effects based on mood and environmental data
  useEffect(() => {
    if (mood?.mood === 'critical') {
      setDistortionIntensity(0.8)

    } else if (mood?.mood === 'stressed') {
      setDistortionIntensity(0.5)

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
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.2
    }
    
    // Dynamic camera movement
    camera.position.x = Math.sin(time * 0.1) * 8
    camera.position.z = Math.cos(time * 0.1) * 8
    camera.lookAt(0, 0, 0)
  })

  // Generate cloud instances
  const cloudInstances = useMemo(() => {
    const instances = []
    for (let i = 0; i < 50; i++) {
      instances.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ] as [number, number, number],
        scale: Math.random() * 0.5 + 0.5,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ] as [number, number, number]
      })
    }
    return instances
  }, [])

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
      
      {/* Cloud layer */}
      <group ref={cloudsRef}>
        {cloudInstances.map((instance, i) => (
          <Cloud
            key={i}
            position={instance.position}
            scale={instance.scale}
            rotation={instance.rotation}
            speed={0.4}


            segments={20}

            opacity={0.6}
          />
        ))}
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
        <Noise 
          premultiply 
          blendFunction={THREE.AdditiveBlending}
          opacity={mood?.mood === 'critical' ? 0.1 : 0.05}
        />
      </EffectComposer>
    </>
  )
}
