import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Cloud
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, BrightnessContrast } from '@react-three/postprocessing'

interface RealisticEarthProps {
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

export function RealisticEarth({ mood }: RealisticEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [distortionIntensity, setDistortionIntensity] = useState(0.3)


  // Create ultra-realistic Earth texture with actual continents
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Create realistic ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    if (mood?.mood === 'critical') {
      gradient.addColorStop(0, '#1a0000')   // Dark red ocean
      gradient.addColorStop(0.3, '#330000') // Blood red
      gradient.addColorStop(0.7, '#660000') // Bright red
      gradient.addColorStop(1, '#990000')   // Fire red
    } else {
      gradient.addColorStop(0, '#0c1445')   // Deep ocean blue
      gradient.addColorStop(0.3, '#1e3a8a') // Medium ocean
      gradient.addColorStop(0.7, '#3b82f6') // Shallow ocean
      gradient.addColorStop(1, '#60a5fa')   // Coastal waters
    }
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add realistic continents with actual shapes
    const continents = [
      {
        name: 'North America',
        points: [
          [0.12, 0.25], [0.15, 0.22], [0.18, 0.20], [0.22, 0.18], [0.25, 0.20],
          [0.28, 0.25], [0.30, 0.30], [0.28, 0.35], [0.25, 0.38], [0.22, 0.40],
          [0.18, 0.38], [0.15, 0.35], [0.12, 0.30], [0.12, 0.25]
        ],
        color: mood?.mood === 'critical' ? '#8b0000' : '#228b22'
      },
      {
        name: 'South America',
        points: [
          [0.30, 0.35], [0.32, 0.32], [0.35, 0.30], [0.38, 0.35], [0.35, 0.40],
          [0.32, 0.45], [0.30, 0.50], [0.28, 0.55], [0.25, 0.60], [0.22, 0.65],
          [0.20, 0.60], [0.22, 0.55], [0.25, 0.50], [0.28, 0.45], [0.30, 0.35]
        ],
        color: mood?.mood === 'critical' ? '#8b0000' : '#228b22'
      },
      {
        name: 'Europe/Asia',
        points: [
          [0.50, 0.30], [0.55, 0.28], [0.60, 0.30], [0.65, 0.32], [0.70, 0.35],
          [0.75, 0.40], [0.70, 0.45], [0.65, 0.50], [0.60, 0.45], [0.55, 0.40],
          [0.50, 0.35], [0.50, 0.30]
        ],
        color: mood?.mood === 'critical' ? '#8b0000' : '#228b22'
      },
      {
        name: 'Africa',
        points: [
          [0.45, 0.45], [0.47, 0.42], [0.50, 0.40], [0.53, 0.42], [0.55, 0.45],
          [0.53, 0.50], [0.50, 0.55], [0.47, 0.60], [0.45, 0.65], [0.43, 0.60],
          [0.45, 0.55], [0.45, 0.45]
        ],
        color: mood?.mood === 'critical' ? '#8b0000' : '#228b22'
      },
      {
        name: 'Australia',
        points: [
          [0.70, 0.55], [0.73, 0.52], [0.75, 0.55], [0.73, 0.58], [0.70, 0.60],
          [0.67, 0.58], [0.70, 0.55]
        ],
        color: mood?.mood === 'critical' ? '#8b0000' : '#228b22'
      }
    ]
    
    // Draw continents with realistic shapes
    continents.forEach(continent => {
      ctx.fillStyle = continent.color
      ctx.beginPath()
      ctx.moveTo(continent.points[0][0] * canvas.width, continent.points[0][1] * canvas.height)
      
      for (let i = 1; i < continent.points.length; i++) {
        const point = continent.points[i]
        ctx.lineTo(point[0] * canvas.width, point[1] * canvas.height)
      }
      
      ctx.closePath()
      ctx.fill()
      
      // Add coastline detail
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1
      ctx.stroke()
    })
    
    // Add mountain ranges and terrain variation
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 1
      const alpha = Math.random() * 0.2 + 0.1
      
      ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`
      ctx.fillRect(x, y, size, size)
    }
    
    // Add ice caps
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.5, canvas.height * 0.05, canvas.width * 0.12, canvas.height * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.5, canvas.height * 0.95, canvas.width * 0.10, canvas.height * 0.05, 0, 0, Math.PI * 2)
    ctx.fill()
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [mood])

  // Create realistic cloud texture


  // Dynamic effects based on mood and environmental data
  useEffect(() => {
    if (mood?.mood === 'critical') {
      setDistortionIntensity(1.2)

    } else if (mood?.mood === 'stressed') {
      setDistortionIntensity(0.8)

    } else {
      setDistortionIntensity(0.4)

    }
  }, [mood])

  // Animation loop with complex movements
  useFrame((state) => {
    setTime(state.clock.elapsedTime)
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05
      earthRef.current.rotation.x = Math.sin(time * 0.02) * 0.1
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.08
      atmosphereRef.current.rotation.x = Math.sin(time * 0.03) * 0.15
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.12
      cloudsRef.current.rotation.x = Math.sin(time * 0.04) * 0.2
    }
    
    // Dynamic camera movement with smooth interpolation
    const targetX = Math.sin(time * 0.05) * 10
    const targetZ = Math.cos(time * 0.05) * 10
    const targetY = Math.sin(time * 0.03) * 2
    
    camera.position.x += (targetX - camera.position.x) * 0.01
    camera.position.y += (targetY - camera.position.y) * 0.01
    camera.position.z += (targetZ - camera.position.z) * 0.01
    camera.lookAt(0, 0, 0)
  })

  // Generate cloud formations
  const cloudFormations = useMemo(() => {
    const formations = []
    for (let i = 0; i < 50; i++) {
      formations.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ] as [number, number, number],
        scale: Math.random() * 1.5 + 0.5,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ] as [number, number, number],
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.3
      })
    }
    return formations
  }, [])

  return (
    <>
      {/* Enhanced stars background */}
      <Stars 
        radius={200} 
        depth={100} 
        count={10000} 
        factor={6} 
        saturation={0.1} 
        fade 
        speed={0.5}
      />
      
      {/* Earth Core with multiple layers */}
      <group>
        {/* Main Earth sphere with realistic material */}
        <Sphere ref={earthRef} args={[1, 128, 128]}>
          <meshStandardMaterial 
            map={earthTexture}
            roughness={0.7}
            metalness={0.1}
            normalScale={[0.5, 0.5]}
          />
        </Sphere>
        
        {/* Inner atmospheric glow */}
        <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#dc2626' : mood?.mood === 'stressed' ? '#ea580c' : '#2563eb'}
            transparent
            opacity={0.4}
            distort={distortionIntensity}
            speed={3}
            roughness={0}
            metalness={0.9}
          />
        </Sphere>
        
        {/* Middle atmosphere layer */}
        <Sphere args={[1.15, 64, 64]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#b91c1c' : mood?.mood === 'stressed' ? '#c2410c' : '#1d4ed8'}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {/* Outer atmosphere */}
        <Sphere args={[1.25, 64, 64]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#991b1b' : mood?.mood === 'stressed' ? '#9a3412' : '#1e3a8a'}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
      
      {/* Cloud formations */}
      <group ref={cloudsRef}>
        {cloudFormations.map((formation, i) => (
          <Cloud
            key={i}
            position={formation.position}
            scale={formation.scale}
            rotation={formation.rotation}
            speed={formation.speed}


            segments={30}

            opacity={formation.opacity}
          />
        ))}
      </group>
      
      {/* Advanced post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={mood?.mood === 'critical' ? 3 : mood?.mood === 'stressed' ? 2 : 1.5}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={mood?.mood === 'critical' ? [0.003, 0.003] : mood?.mood === 'stressed' ? [0.002, 0.002] : [0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.4} 
          offset={0.6} 
        />
        <Noise 
          premultiply 
          blendFunction={THREE.AdditiveBlending}
          opacity={mood?.mood === 'critical' ? 0.15 : mood?.mood === 'stressed' ? 0.1 : 0.05}
        />
        <BrightnessContrast 
          brightness={mood?.mood === 'critical' ? 0.1 : mood?.mood === 'stressed' ? 0.05 : 0}
          contrast={mood?.mood === 'critical' ? 0.2 : mood?.mood === 'stressed' ? 0.1 : 0.05}
        />
      </EffectComposer>
    </>
  )
}
