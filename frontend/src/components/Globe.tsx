import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LOOK } from './animationConfig';
import type { AppState } from './animationConfig';

const frag = `
uniform float uTime, uGlow, uPulse, uNoise;
uniform vec3 uBase;
varying vec3 vPos;
float hash(vec3 p){ return fract(sin(dot(p, vec3(17.1,113.2,51.7)))*43758.5453); }
void main(){
  float n = uNoise * hash(normalize(vPos)*floor(uTime*2.0));
  float pulse = 0.5 + 0.5*sin(uTime*uPulse);
  float glow  = uGlow * pow(1.0 - abs(normalize(vPos).z), 3.0);
  vec3 col = uBase*(0.6+0.4*pulse) + vec3(glow+n)*0.6;
  gl_FragColor = vec4(col, 1.0);
}`.trim();

const vert = `
varying vec3 vPos;
void main(){
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`.trim();

export function Globe({ appState }: { appState: AppState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const target = LOOK[appState];

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime();
      materialRef.current.uniforms.uTime.value = time;
      
      // Smoothly update uniforms based on state
      const currentGlow = materialRef.current.uniforms.uGlow.value;
      const targetGlow = target.halo;
      materialRef.current.uniforms.uGlow.value += (targetGlow - currentGlow) * 0.05;
      
      const currentPulse = materialRef.current.uniforms.uPulse.value;
      const targetPulse = target.pulse;
      materialRef.current.uniforms.uPulse.value += (targetPulse - currentPulse) * 0.05;
      
      const currentNoise = materialRef.current.uniforms.uNoise.value;
      const targetNoise = target.particle * 0.5; // Use particle speed as noise factor
      materialRef.current.uniforms.uNoise.value += (targetNoise - currentNoise) * 0.05;
      
      // Update color
      const currentColor = materialRef.current.uniforms.uBase.value;
      const targetColor = new THREE.Color(target.base);
      currentColor.lerp(targetColor, 0.05);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={{
            uTime: { value: 0 },
            uGlow: { value: target.halo },
            uPulse: { value: target.pulse },
            uNoise: { value: target.particle * 0.5 },
            uBase: { value: new THREE.Color(target.base) }
          }}
        />
      </mesh>
      <OrbitControls enablePan={false} />
    </>
  );
}
