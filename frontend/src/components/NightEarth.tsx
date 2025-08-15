import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Line,
  Points,
  PointMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, BrightnessContrast } from '@react-three/postprocessing'

interface NightEarthProps {
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

export function NightEarth({ mood }: NightEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cityLightsRef = useRef<THREE.Points>(null)
  const dataLinesRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [atmosphereIntensity, setAtmosphereIntensity] = useState(1.0)

  // Create night Earth texture with city lights
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Create dark ocean background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add continents in light blue/cyan
    const continents = [
      {
        name: 'Asia',
        points: [
          [0.60, 0.30], [0.65, 0.28], [0.70, 0.30], [0.75, 0.32], [0.80, 0.35],
          [0.85, 0.40], [0.80, 0.45], [0.75, 0.50], [0.70, 0.45], [0.65, 0.40],
          [0.60, 0.35], [0.60, 0.30]
        ]
      },
      {
        name: 'Australia',
        points: [
          [0.75, 0.55], [0.78, 0.52], [0.80, 0.55], [0.78, 0.58], [0.75, 0.60],
          [0.72, 0.58], [0.75, 0.55]
        ]
      },
      {
        name: 'Africa',
        points: [
          [0.45, 0.45], [0.47, 0.42], [0.50, 0.40], [0.53, 0.42], [0.55, 0.45],
          [0.53, 0.50], [0.50, 0.55], [0.47, 0.60], [0.45, 0.65], [0.43, 0.60],
          [0.45, 0.55], [0.45, 0.45]
        ]
      },
      {
        name: 'Europe',
        points: [
          [0.40, 0.30], [0.45, 0.28], [0.50, 0.30], [0.45, 0.35], [0.40, 0.35],
          [0.40, 0.30]
        ]
      }
    ]
    
    // Draw continents in light blue/cyan
    continents.forEach(continent => {
      ctx.fillStyle = '#00ffff'
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.moveTo(continent.points[0][0] * canvas.width, continent.points[0][1] * canvas.height)
      
      for (let i = 1; i < continent.points.length; i++) {
        const point = continent.points[i]
        ctx.lineTo(point[0] * canvas.width, point[1] * canvas.height)
      }
      
      ctx.closePath()
      ctx.fill()
    })
    
    // Add city lights as bright white dots
    ctx.globalAlpha = 1.0
    const cityRegions = [
      // East Asia (China, Japan, Korea)
      { x: 0.7, y: 0.35, count: 200, intensity: 1.0 },
      // South Asia (India)
      { x: 0.55, y: 0.45, count: 150, intensity: 0.9 },
      // Southeast Asia
      { x: 0.65, y: 0.5, count: 100, intensity: 0.8 },
      // Australia
      { x: 0.75, y: 0.55, count: 50, intensity: 0.7 },
      // Europe
      { x: 0.45, y: 0.32, count: 80, intensity: 0.8 },
      // Africa
      { x: 0.5, y: 0.5, count: 60, intensity: 0.6 }
    ]
    
    cityRegions.forEach(region => {
      for (let i = 0; i < region.count; i++) {
        const x = (region.x + (Math.random() - 0.5) * 0.2) * canvas.width
        const y = (region.y + (Math.random() - 0.5) * 0.2) * canvas.height
        const size = Math.random() * 3 + 1
        const alpha = Math.random() * 0.5 + 0.5 * region.intensity
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Create city lights as 3D points
  const cityLights = useMemo(() => {
    const points: number[] = []
    const cityRegions = [
      // East Asia
      { center: [0.7, 0.35], count: 300, radius: 0.1 },
      // South Asia
      { center: [0.55, 0.45], count: 250, radius: 0.08 },
      // Southeast Asia
      { center: [0.65, 0.5], count: 150, radius: 0.06 },
      // Australia
      { center: [0.75, 0.55], count: 100, radius: 0.05 },
      // Europe
      { center: [0.45, 0.32], count: 120, radius: 0.04 },
      // Africa
      { center: [0.5, 0.5], count: 80, radius: 0.05 }
    ]
    
    cityRegions.forEach(region => {
      for (let i = 0; i < region.count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 1.01 + Math.random() * 0.02
        
        // Convert to spherical coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        
        points.push(x, y, z)
      }
    })
    
    return new Float32Array(points)
  }, [])

  // Create data flow lines
  const dataLines = useMemo(() => {
    const lines: number[] = []
    
    // Major data flow routes
    const routes = [
      // East Asia to Europe
      [
        [0.7, 0.35], [0.65, 0.4], [0.6, 0.35], [0.55, 0.32], [0.5, 0.3], [0.45, 0.32]
      ],
      // Asia to Australia
      [
        [0.7, 0.35], [0.72, 0.4], [0.75, 0.45], [0.75, 0.5], [0.75, 0.55]
      ],
      // Southeast Asia connections
      [
        [0.65, 0.5], [0.7, 0.45], [0.75, 0.4], [0.8, 0.35]
      ],
      // India to Middle East
      [
        [0.55, 0.45], [0.5, 0.4], [0.45, 0.35]
      ]
    ]
    
    routes.forEach(route => {
      const points = route.map(point => {
        const theta = point[0] * Math.PI * 2
        const phi = point[1] * Math.PI
        const radius = 1.02
        
        return [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ]
      })
      
      lines.push(...points.flat())
    })
    
    return lines
  }, [])

  // Dynamic effects based on mood
  useEffect(() => {
    if (mood?.mood === 'critical') {
      setAtmosphereIntensity(2.0)
    } else if (mood?.mood === 'stressed') {
      setAtmosphereIntensity(1.5)
    } else {
      setAtmosphereIntensity(1.0)
    }
  }, [mood])

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime)
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.08
    }
    
    if (cityLightsRef.current) {
      cityLightsRef.current.rotation.y = time * 0.05
    }
    
    if (dataLinesRef.current) {
      dataLinesRef.current.rotation.y = time * 0.05
    }
    
    // Dynamic camera movement
    const targetX = Math.sin(time * 0.05) * 12
    const targetZ = Math.cos(time * 0.05) * 12
    const targetY = Math.sin(time * 0.03) * 3
    
    camera.position.x += (targetX - camera.position.x) * 0.01
    camera.position.y += (targetY - camera.position.y) * 0.01
    camera.position.z += (targetZ - camera.position.z) * 0.01
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Enhanced stars background */}
      <Stars 
        radius={300} 
        depth={150} 
        count={15000} 
        factor={8} 
        saturation={0.1} 
        fade 
        speed={0.5}
      />
      
      {/* Earth Core */}
      <group>
        {/* Main Earth sphere */}
        <Sphere ref={earthRef} args={[1, 128, 128]}>
          <meshStandardMaterial 
            map={earthTexture}
            roughness={0.8}
            metalness={0.1}
            emissive="#001122"
            emissiveIntensity={0.1}
          />
        </Sphere>
        
        {/* Atmospheric glow */}
        <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#ff4444' : mood?.mood === 'stressed' ? '#ff8844' : '#4488ff'}
            transparent
            opacity={0.2 * atmosphereIntensity}
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.9}
          />
        </Sphere>
        
        {/* Outer atmosphere */}
        <Sphere args={[1.15, 64, 64]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#ff2222' : mood?.mood === 'stressed' ? '#ff6622' : '#2266ff'}
            transparent
            opacity={0.1 * atmosphereIntensity}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
      
      {/* City lights as 3D points */}
      <Points ref={cityLightsRef} positions={cityLights}>
        <PointMaterial
          transparent
          vertexColors
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={mood?.mood === 'critical' ? '#ff6666' : mood?.mood === 'stressed' ? '#ffaa66' : '#66aaff'}
          opacity={0.8}
        />
      </Points>
      
      {/* Data flow lines */}
      <group ref={dataLinesRef}>
        {dataLines.map((_, i) => (
          <Line
            key={i}
            points={[[0, 0, 0], [1, 1, 1]]}
            color={mood?.mood === 'critical' ? '#ff4444' : mood?.mood === 'stressed' ? '#ff8844' : '#ffaa44'}
            lineWidth={2}
            transparent
            opacity={0.8}
          />
        ))}
      </group>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={mood?.mood === 'critical' ? 4 : mood?.mood === 'stressed' ? 3 : 2}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={mood?.mood === 'critical' ? [0.002, 0.002] : [0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.5} 
          offset={0.7} 
        />
        <BrightnessContrast 
          brightness={0.1}
          contrast={0.2}
        />
      </EffectComposer>
    </>
  )
}
