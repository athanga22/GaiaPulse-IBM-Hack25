import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  useTexture,
  Line,
  Points,
  PointMaterial,
  Text,
  Float
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, BrightnessContrast } from '@react-three/postprocessing'

interface ProfessionalEarthProps {
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

export function ProfessionalEarth({ mood, environmentalData }: ProfessionalEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cityLightsRef = useRef<THREE.Points>(null)
  const { camera } = useThree()
  const [time, setTime] = useState(0)
  const [atmosphereIntensity, setAtmosphereIntensity] = useState(1.0)

  // Use high-quality Earth textures
  const earthTextures = useTexture({
    map: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    bumpMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    specularMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    cloudsMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  })

  // Create city lights data
  const cityLights = useMemo(() => {
    const points: number[] = []
    const cityData = [
      // Major cities with their coordinates and intensity
      { lat: 35.6762, lng: 139.6503, intensity: 1.0 }, // Tokyo
      { lat: 39.9042, lng: 116.4074, intensity: 0.9 }, // Beijing
      { lat: 31.2304, lng: 121.4737, intensity: 0.9 }, // Shanghai
      { lat: 19.0760, lng: 72.8777, intensity: 0.8 },  // Mumbai
      { lat: 28.6139, lng: 77.2090, intensity: 0.8 },  // New Delhi
      { lat: 40.7128, lng: -74.0060, intensity: 0.9 }, // New York
      { lat: 34.0522, lng: -118.2437, intensity: 0.8 }, // Los Angeles
      { lat: 51.5074, lng: -0.1278, intensity: 0.8 },   // London
      { lat: 48.8566, lng: 2.3522, intensity: 0.7 },    // Paris
      { lat: 52.5200, lng: 13.4050, intensity: 0.7 },   // Berlin
      { lat: 55.7558, lng: 37.6176, intensity: 0.7 },   // Moscow
      { lat: -33.8688, lng: 151.2093, intensity: 0.6 }, // Sydney
      { lat: -25.7461, lng: 28.1881, intensity: 0.6 },  // Johannesburg
      { lat: -23.5505, lng: -46.6333, intensity: 0.7 }, // São Paulo
      { lat: 19.4326, lng: -99.1332, intensity: 0.7 },  // Mexico City
    ]

    cityData.forEach(city => {
      // Convert lat/lng to 3D coordinates
      const phi = (90 - city.lat) * (Math.PI / 180)
      const theta = (city.lng + 180) * (Math.PI / 180)
      const radius = 1.01

      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = (radius * Math.sin(phi) * Math.sin(theta))
      const y = (radius * Math.cos(phi))

      points.push(x, y, z)
    })

    return new Float32Array(points)
  }, [])

  // Create data flow lines between major cities
  const dataLines = useMemo(() => {
    const lines: number[] = []
    const connections = [
      // Major global connections
      [[35.6762, 139.6503], [40.7128, -74.0060]], // Tokyo to New York
      [[35.6762, 139.6503], [51.5074, -0.1278]],  // Tokyo to London
      [[39.9042, 116.4074], [40.7128, -74.0060]], // Beijing to New York
      [[19.0760, 72.8777], [51.5074, -0.1278]],   // Mumbai to London
      [[-33.8688, 151.2093], [35.6762, 139.6503]], // Sydney to Tokyo
      [[55.7558, 37.6176], [51.5074, -0.1278]],   // Moscow to London
    ]

    connections.forEach(connection => {
      const points = connection.map(([lat, lng]) => {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        const radius = 1.02

        const x = -(radius * Math.sin(phi) * Math.cos(theta))
        const z = (radius * Math.sin(phi) * Math.sin(theta))
        const y = (radius * Math.cos(phi))

        return [x, y, z]
      })

      // Create curved line between points
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(...points[0]),
        new THREE.Vector3(
          (points[0][0] + points[1][0]) / 2 + (Math.random() - 0.5) * 0.5,
          (points[0][1] + points[1][1]) / 2 + 0.3,
          (points[0][2] + points[1][2]) / 2 + (Math.random() - 0.5) * 0.5
        ),
        new THREE.Vector3(
          (points[0][0] + points[1][0]) / 2 + (Math.random() - 0.5) * 0.5,
          (points[0][1] + points[1][1]) / 2 + 0.3,
          (points[0][2] + points[1][2]) / 2 + (Math.random() - 0.5) * 0.5
        ),
        new THREE.Vector3(...points[1])
      )

      const curvePoints = curve.getPoints(50)
      lines.push(...curvePoints.map(p => [p.x, p.y, p.z]).flat())
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
    
    // Smooth camera movement
    const targetX = Math.sin(time * 0.05) * 10
    const targetZ = Math.cos(time * 0.05) * 10
    const targetY = Math.sin(time * 0.03) * 2
    
    camera.position.x += (targetX - camera.position.x) * 0.01
    camera.position.y += (targetY - camera.position.y) * 0.01
    camera.position.z += (targetZ - camera.position.z) * 0.01
    camera.lookAt(0, 0, 0)
  })

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
      
      {/* Earth Core */}
      <group>
        {/* Main Earth sphere with realistic textures */}
        <Sphere ref={earthRef} args={[1, 128, 128]}>
          <meshStandardMaterial 
            map={earthTextures.map}
            bumpMap={earthTextures.bumpMap}
            bumpScale={0.05}


            roughness={0.8}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Cloud layer */}
        <Sphere args={[1.01, 128, 128]}>
          <meshStandardMaterial 
            map={earthTextures.cloudsMap}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
        
        {/* Atmospheric glow */}
        <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
          <MeshDistortMaterial
            color={mood?.mood === 'critical' ? '#ff4444' : mood?.mood === 'stressed' ? '#ff8844' : '#4488ff'}
            transparent
            opacity={0.3 * atmosphereIntensity}
            distort={0.4}
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
          size={3}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={mood?.mood === 'critical' ? '#ff6666' : mood?.mood === 'stressed' ? '#ffaa66' : '#66aaff'}
          opacity={0.8}
        />
      </Points>
      
      {/* Data flow lines */}
      <group>
        {dataLines.map((_, i) => (
          <Line
            key={i}
            points={[[0, 0, 0], [1, 1, 1]]}
            color={mood?.mood === 'critical' ? '#ff4444' : mood?.mood === 'stressed' ? '#ff8844' : '#ffaa44'}
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        ))}
      </group>
      
      {/* Environmental data indicators */}
      {environmentalData && (
        <group>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Text
              position={[3, 2, 0]}
              fontSize={0.3}
              color={environmentalData.temperature > 15 ? '#ef4444' : '#3b82f6'}
              anchorX="center"
              anchorY="middle"
            >
              {environmentalData.temperature}°C
            </Text>
          </Float>
          
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Text
              position={[-3, 2, 0]}
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
          intensity={mood?.mood === 'critical' ? 3 : mood?.mood === 'stressed' ? 2 : 1.5}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={mood?.mood === 'critical' ? [0.002, 0.002] : [0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.4} 
          offset={0.6} 
        />
        <BrightnessContrast 
          brightness={0.05}
          contrast={0.1}
        />
      </EffectComposer>
    </>
  )
}
