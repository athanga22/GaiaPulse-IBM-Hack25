import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Sphere, 
  Stars,

  Points,
  PointMaterial
} from '@react-three/drei'
import { a } from '@react-spring/three'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { LOOK } from './animationConfig'

interface ShaderEarthProps {
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

// GLSL Shader for Earth surface
const earthVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const earthFragmentShader = `
uniform float uTime;
uniform float uGlow;
uniform float uPulse;
uniform float uNoise;
uniform vec3 uBase;
uniform vec3 uAtmosphere;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

// Noise function
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(17.1, 113.2, 51.7))) * 43758.5453);
}

// Simplex noise
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float n = i.x + i.y * 157.0 + 113.0 * i.z;
  return mix(mix(mix(hash(vec3(n + 0.0, 0.0, 0.0)), hash(vec3(n + 1.0, 0.0, 0.0)), f.x),
                   mix(hash(vec3(n + 0.0, 1.0, 0.0)), hash(vec3(n + 1.0, 1.0, 0.0)), f.x), f.y),
               mix(mix(hash(vec3(n + 0.0, 0.0, 1.0)), hash(vec3(n + 1.0, 0.0, 1.0)), f.x),
                   mix(hash(vec3(n + 0.0, 1.0, 1.0)), hash(vec3(n + 1.0, 1.0, 1.0)), f.x), f.y), f.z);
}

void main() {
  // Base color with noise
  float n = uNoise * noise(vPosition * 5.0 + uTime * 0.1);
  
  // Pulse effect
  float pulse = 0.5 + 0.5 * sin(uTime * uPulse);
  
  // Atmospheric glow
  float atmosphere = uGlow * pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  
  // Continent simulation
  float continent = noise(vPosition * 3.0) * 0.5 + 0.5;
  continent = smoothstep(0.4, 0.6, continent);
  
  // Ocean depth
  float oceanDepth = 1.0 - continent;
  vec3 oceanColor = mix(uBase * 0.3, uBase, oceanDepth);
  
  // Final color
  vec3 color = mix(oceanColor, uBase * 0.8, continent);
  color += atmosphere * uAtmosphere;
  color += n * 0.1;
  color *= 0.8 + 0.2 * pulse;
  
  gl_FragColor = vec4(color, 1.0);
}
`

// Atmosphere shader
const atmosphereVertexShader = `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
uniform float uTime;
uniform float uIntensity;
uniform vec3 uColor;
uniform float uDistortion;

varying vec3 vPosition;

void main() {
  float dist = length(vPosition);
  float alpha = 1.0 - smoothstep(1.0, 1.1, dist);
  alpha *= uIntensity;
  
  // Distortion effect
  float distortion = sin(uTime * 2.0 + dist * 10.0) * uDistortion;
  alpha += distortion * 0.1;
  
  gl_FragColor = vec4(uColor, alpha);
}
`

export function ShaderEarth({ mood }: ShaderEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)


  // Convert mood to AppState
  const appState = useMemo(() => {
    if (mood?.mood === 'critical') return 'critical'
    if (mood?.mood === 'stressed') return 'stressed'
    if (mood?.mood === 'healing') return 'healing'
    return 'neutral'
  }, [mood])

  const target = LOOK[appState]

  // Spring animations for smooth transitions


  // Create particle system for sparks
  const particles = useMemo(() => {
    const points = []
    for (let i = 0; i < 1000; i++) {
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

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.08
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1
    }
    
    // Update shader uniforms
    if (earthRef.current?.material) {
      const material = earthRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }
    
    if (atmosphereRef.current?.material) {
      const material = atmosphereRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
    }
  })

  return (
    <>
      {/* Stars background */}
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
        {/* Main Earth sphere with custom shader */}
        <Sphere ref={earthRef} args={[1, 128, 128]}>
          <a.shaderMaterial
            vertexShader={earthVertexShader}
            fragmentShader={earthFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uGlow: { value: target.halo },
              uPulse: { value: target.pulse },
              uNoise: { value: 0.5 },
              uBase: { value: new THREE.Color(target.base) },
              uAtmosphere: { value: new THREE.Color(0x4488ff) }
            }}
          />
        </Sphere>
        
        {/* Atmospheric glow with custom shader */}
        <Sphere ref={atmosphereRef} args={[1.1, 64, 64]}>
          <a.shaderMaterial
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            transparent
            blending={THREE.AdditiveBlending}
            uniforms={{
              uTime: { value: 0 },
              uIntensity: { value: target.halo },
              uColor: { value: new THREE.Color(target.base) },
              uDistortion: { value: 0.3 }
            }}
          />
        </Sphere>
      </group>
      
      {/* Particle system for sparks */}
      <Points ref={particlesRef} positions={particles}>
        <PointMaterial
          transparent
          vertexColors
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={target.base}
          opacity={0.6}
        />
      </Points>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={target.halo}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={[0.001, 0.001]} 
        />
        <Vignette 
          darkness={0.4} 
          offset={0.6} 
        />
      </EffectComposer>
    </>
  )
}
