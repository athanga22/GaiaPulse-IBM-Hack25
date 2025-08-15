import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import { LOOK } from './animationConfig';
import type { AppState } from './animationConfig';

function Atmosphere({ halo, color }: any) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    uniforms: { 
      uStrength: { value: 1 }, 
      uColor: { value: new THREE.Color(color) } 
    },
    vertexShader: `
      varying vec3 vN; 
      void main() { 
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
      }
    `,
    fragmentShader: `
      varying vec3 vN; 
      uniform float uStrength; 
      uniform vec3 uColor;
      void main() { 
        float a = pow(1.0 - max(vN.z, 0.0), 3.0) * uStrength; 
        gl_FragColor = vec4(uColor, a); 
      }
    `
  }), []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uStrength.value = halo.get();
      materialRef.current.uniforms.uColor.value.set(color.get());
    }
  });

  return (
    <a.mesh scale={1.03}>
      <sphereGeometry args={[1, 128, 128]} />
      <primitive object={material} ref={materialRef} />
    </a.mesh>
  );
}

function EarthSurface({ baseColor }: any) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Create realistic Earth textures
  const dayTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Ocean background
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Continents with realistic shapes
    ctx.fillStyle = '#059669';
    
    // North America
    ctx.beginPath();
    ctx.ellipse(400, 300, 200, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.ellipse(500, 700, 150, 300, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(1000, 250, 80, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Africa
    ctx.beginPath();
    ctx.ellipse(1100, 500, 120, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(1400, 300, 300, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(1600, 700, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  const nightTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // City lights
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const size = Math.random() * 4 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  const normalTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Simple normal map
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 512, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.emissive.set(baseColor.get());
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        ref={materialRef}
        map={dayTexture}
        normalMap={normalTexture}
        emissiveMap={nightTexture}
        emissiveIntensity={1.2}
        emissive={new THREE.Color(baseColor.get())}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}

function ArcsAndParticles({ speed, color }: any) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Major city coordinates (lat/lon converted to 3D)
  const cities = useMemo(() => [
    { name: 'NYC', pos: [0.5, 0.3, 0.8] },
    { name: 'London', pos: [0.8, 0.2, 0.6] },
    { name: 'Tokyo', pos: [0.9, 0.3, 0.3] },
    { name: 'LA', pos: [0.3, 0.6, 0.7] },
    { name: 'Sydney', pos: [0.2, 0.7, 0.7] },
    { name: 'Mumbai', pos: [0.7, 0.4, 0.6] },
    { name: 'Beijing', pos: [0.8, 0.4, 0.4] },
    { name: 'Moscow', pos: [0.6, 0.2, 0.8] }
  ], []);

  // Generate arcs between cities
  const arcs = useMemo(() => {
    const arcList = [];
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        arcList.push({
          start: cities[i].pos,
          end: cities[j].pos
        });
      }
    }
    return arcList;
  }, [cities]);

  // Create particles
  const particleCount = 2000;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const currentSpeed = speed.get();

    
    // Animate particles along arcs
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const arcIndex = Math.floor(i / (particleCount / arcs.length));
        const arc = arcs[arcIndex % arcs.length];
        const progress = (time * currentSpeed + i * 0.005) % 1;
        
        // Interpolate along arc
        positions[i * 3] = arc.start[0] + (arc.end[0] - arc.start[0]) * progress;
        positions[i * 3 + 1] = arc.start[1] + (arc.end[1] - arc.start[1]) * progress;
        positions[i * 3 + 2] = arc.start[2] + (arc.end[2] - arc.start[2]) * progress;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Arc lines */}
      {arcs.map((arc, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                ...arc.start,
                ...arc.end
              ]), 3]}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color.get()} transparent opacity={0.2} />
        </line>
      ))}
      
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color={color.get()}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function SceneController() {
  // Slow spin
  useFrame(({ scene }, d) => {
    scene.rotation.y += d * 0.03;
  });
  return null;
}

export function LiveEarth({ state }: { state: AppState }) {
  const t = LOOK[state];
  const { baseColor, halo, speed, density } = useSpring({
    baseColor: t.base,
    halo: t.halo,
    speed: t.particle,
    density: t.arcDensity,
    config: { tension: 120, friction: 18 }
  });

  return (
    <div style={{ width: '100%', height: '60vh', minHeight: '500px' }}>
      <Canvas camera={{ position: [0, 0, 2.2] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 3, 2]} intensity={1.2} />
        <EarthSurface baseColor={baseColor} />
        <Atmosphere halo={halo} color={baseColor} />
        <ArcsAndParticles density={density} speed={speed} color={baseColor} />
        <OrbitControls enablePan={false} />
        <SceneController />
      </Canvas>
    </div>
  );
}
