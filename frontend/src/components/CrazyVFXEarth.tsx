import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Text, 
  Float, 
  Stars, 
 
  Points,
  PointMaterial,

} from '@react-three/drei'
import * as THREE from 'three'
import { Vector2 } from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, BrightnessContrast, Glitch } from '@react-three/postprocessing'

interface CrazyVFXEarthProps {
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

export function CrazyVFXEarth({ mood, environmentalData }: CrazyVFXEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Group>(null)
  const lightningRef = useRef<THREE.Points>(null)
  const energyFieldRef = useRef<THREE.Points>(null)
  const disasterParticlesRef = useRef<THREE.Points>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [distortionIntensity, setDistortionIntensity] = useState(0.3)

  const [lightningIntensity, setLightningIntensity] = useState(0)
  const [disasterLevel, setDisasterLevel] = useState(0)

  // Create ultra-detailed Earth texture with environmental damage
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4096
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!
    
    // Create apocalyptic ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    if (mood?.mood === 'critical') {
      gradient.addColorStop(0, '#1a0000')   // Dark red ocean
      gradient.addColorStop(0.3, '#330000') // Blood red
      gradient.addColorStop(0.7, '#660000') // Bright red
      gradient.addColorStop(1, '#990000')   // Fire red
    } else {
      gradient.addColorStop(0, '#1e3a8a')   // Deep ocean
      gradient.addColorStop(0.3, '#1e40af') // Medium ocean
      gradient.addColorStop(0.7, '#3b82f6') // Shallow ocean
      gradient.addColorStop(1, '#60a5fa')   // Coastal waters
    }
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add continents with environmental damage
    const continents = [
      {
        name: 'North America',
        points: [
          [0.15, 0.25], [0.18, 0.22], [0.22, 0.20], [0.25, 0.18], [0.28, 0.20],
          [0.30, 0.25], [0.32, 0.30], [0.30, 0.35], [0.28, 0.40], [0.25, 0.42],
          [0.22, 0.40], [0.20, 0.35], [0.18, 0.30], [0.15, 0.25]
        ],
        color: mood?.mood === 'critical' ? '#dc2626' : '#22c55e'
      },
      {
        name: 'South America',
        points: [
          [0.35, 0.35], [0.38, 0.32], [0.40, 0.30], [0.42, 0.35], [0.40, 0.40],
          [0.38, 0.45], [0.35, 0.50], [0.32, 0.55], [0.30, 0.60], [0.28, 0.65],
          [0.25, 0.60], [0.28, 0.55], [0.30, 0.50], [0.32, 0.45], [0.35, 0.35]
        ],
        color: mood?.mood === 'critical' ? '#b91c1c' : '#16a34a'
      },
      {
        name: 'Europe/Asia',
        points: [
          [0.55, 0.30], [0.60, 0.28], [0.65, 0.30], [0.70, 0.32], [0.75, 0.35],
          [0.80, 0.40], [0.75, 0.45], [0.70, 0.50], [0.65, 0.45], [0.60, 0.40],
          [0.55, 0.35], [0.55, 0.30]
        ],
        color: mood?.mood === 'critical' ? '#991b1b' : '#15803d'
      }
    ]
    
    // Draw continents with damage effects
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
      
      // Add damage cracks for critical mood
      if (mood?.mood === 'critical') {
        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }
    })
    
    // Add environmental disaster effects
    if (mood?.mood === 'critical') {
      // Fire effects
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 5 + 2
        
        ctx.fillStyle = `rgba(255, ${Math.random() * 100}, 0, ${Math.random() * 0.8 + 0.2})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Pollution clouds
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 20 + 10
        
        ctx.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.6 + 0.2})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [mood])

  // Create lightning effect particles
  const lightningPoints = useMemo(() => {
    const points = []
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 1.5 + Math.random() * 0.5
      
      points.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }
    return new Float32Array(points)
  }, [])

  // Create energy field particles
  const energyFieldPoints = useMemo(() => {
    const points = []
    for (let i = 0; i < 3000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2 + Math.random() * 1
      
      points.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }
    return new Float32Array(points)
  }, [])

  // Create disaster particles
  const disasterParticles = useMemo(() => {
    const points = []
    for (let i = 0; i < 5000; i++) {
      points.push(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      )
    }
    return new Float32Array(points)
  }, [])

  // Dynamic effects based on mood and environmental data
  useEffect(() => {
    if (mood?.mood === 'critical') {
      setDistortionIntensity(2.0)

      setLightningIntensity(1.0)
      setDisasterLevel(1.0)
    } else if (mood?.mood === 'stressed') {
      setDistortionIntensity(1.2)

      setLightningIntensity(0.6)
      setDisasterLevel(0.6)
    } else {
      setDistortionIntensity(0.5)

      setLightningIntensity(0.2)
      setDisasterLevel(0.2)
    }
  }, [mood])

  // Animation loop with crazy effects
  useFrame((state) => {
    setTime(state.clock.elapsedTime)
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.1
      earthRef.current.rotation.x = Math.sin(time * 0.05) * 0.2
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.15
      atmosphereRef.current.rotation.x = Math.sin(time * 0.08) * 0.3
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.2
      cloudsRef.current.rotation.x = Math.sin(time * 0.1) * 0.4
    }
    
    // Lightning effect animation
    if (lightningRef.current) {
      lightningRef.current.rotation.y = time * 0.5
      lightningRef.current.rotation.x = Math.sin(time * 0.3) * 0.5
    }
    
    // Energy field animation
    if (energyFieldRef.current) {
      energyFieldRef.current.rotation.y = time * 0.3
      energyFieldRef.current.rotation.x = Math.sin(time * 0.2) * 0.2
    }
    
    // Disaster particles animation
    if (disasterParticlesRef.current) {
      disasterParticlesRef.current.rotation.y = time * 0.4
      disasterParticlesRef.current.rotation.x = Math.sin(time * 0.15) * 0.3
    }
    
    // Crazy camera movement
    const targetX = Math.sin(time * 0.1) * 15
    const targetZ = Math.cos(time * 0.1) * 15
    const targetY = Math.sin(time * 0.05) * 5
    
    camera.position.x += (targetX - camera.position.x) * 0.02
    camera.position.y += (targetY - camera.position.y) * 0.02
    camera.position.z += (targetZ - camera.position.z) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Enhanced stars with crazy movement */}
      <Stars 
        radius={300} 
        depth={150} 
        count={15000} 
        factor={8} 
        saturation={0.2} 
        fade 
        speed={1}
      />
      
      {/* Earth Core with multiple crazy layers */}
      <group>
        {/* Main Earth sphere */}
        <Sphere ref={earthRef} args={[1, 128, 128]}>
          <meshStandardMaterial 
            map={earthTexture}
            roughness={0.6}
            metalness={0.2}
            normalScale={[1, 1]}
          />
        </Sphere>
        
        {/* Crazy atmospheric distortion */}
        <Sphere ref={atmosphereRef} args={[1.1, 64, 64]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#ff0000' : mood?.mood === 'stressed' ? '#ff6600' : '#0066ff'}
            transparent
            opacity={0.6}
            distort={distortionIntensity}
            speed={5}
            roughness={0}
            metalness={1}
          />
        </Sphere>
        
        {/* Multiple atmosphere layers */}
        <Sphere args={[1.2, 64, 64]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#cc0000' : mood?.mood === 'stressed' ? '#cc4400' : '#0044cc'}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <Sphere args={[1.4, 64, 64]}>
          <meshStandardMaterial
            color={mood?.mood === 'critical' ? '#990000' : mood?.mood === 'stressed' ? '#992200' : '#002299'}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
      
      {/* Lightning effect */}
      <Points ref={lightningRef} positions={lightningPoints}>
        <PointMaterial
          transparent
          vertexColors
          size={3}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={mood?.mood === 'critical' ? '#ffff00' : mood?.mood === 'stressed' ? '#ffaa00' : '#00aaff'}
          opacity={lightningIntensity}
        />
      </Points>
      
      {/* Energy field */}
      <Points ref={energyFieldRef} positions={energyFieldPoints}>
        <PointMaterial
          transparent
          vertexColors
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={mood?.mood === 'critical' ? '#ff00ff' : mood?.mood === 'stressed' ? '#ff0088' : '#0088ff'}
          opacity={0.3}
        />
      </Points>
      
      {/* Disaster particles */}
      <Points ref={disasterParticlesRef} positions={disasterParticles}>
        <PointMaterial
          transparent
          vertexColors
          size={1}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={mood?.mood === 'critical' ? '#ff0000' : mood?.mood === 'stressed' ? '#ff4400' : '#0044ff'}
          opacity={disasterLevel * 0.5}
        />
      </Points>
      
      {/* Environmental data holograms with crazy effects */}
      {environmentalData && (
        <group>
          <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                         <Text
               position={[4, 3, 0]}
               fontSize={0.5}
               color={environmentalData.temperature > 15 ? '#ff0000' : '#00ff00'}
               anchorX="center"
               anchorY="middle"
             >
               {environmentalData.temperature}°C
             </Text>
          </Float>
          
          <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                         <Text
               position={[-4, 3, 0]}
               fontSize={0.5}
               color={environmentalData.co2_levels > 400 ? '#ff0000' : '#00ff00'}
               anchorX="center"
               anchorY="middle"
             >
               CO₂: {environmentalData.co2_levels}ppm
             </Text>
          </Float>
        </group>
      )}
      
      {/* Ultra-crazy post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={mood?.mood === 'critical' ? 5 : mood?.mood === 'stressed' ? 3 : 2}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={mood?.mood === 'critical' ? [0.005, 0.005] : mood?.mood === 'stressed' ? [0.003, 0.003] : [0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.6} 
          offset={0.8} 
        />
        <Noise 
          premultiply 
          blendFunction={THREE.AdditiveBlending}
          opacity={mood?.mood === 'critical' ? 0.3 : mood?.mood === 'stressed' ? 0.2 : 0.1}
        />
        <BrightnessContrast 
          brightness={mood?.mood === 'critical' ? 0.2 : mood?.mood === 'stressed' ? 0.1 : 0}
          contrast={mood?.mood === 'critical' ? 0.4 : mood?.mood === 'stressed' ? 0.2 : 0.1}
        />
        <Glitch 
          delay={mood?.mood === 'critical' ? new Vector2(0.5, 1.0) : mood?.mood === 'stressed' ? new Vector2(1.0, 2.0) : new Vector2(2.0, 5.0)}
          duration={mood?.mood === 'critical' ? new Vector2(0.1, 0.3) : mood?.mood === 'stressed' ? new Vector2(0.2, 0.4) : new Vector2(0.3, 0.6)}
          strength={mood?.mood === 'critical' ? new Vector2(0.3, 0.6) : mood?.mood === 'stressed' ? new Vector2(0.2, 0.4) : new Vector2(0.1, 0.2)}
        />
      </EffectComposer>
    </>
  )
}
