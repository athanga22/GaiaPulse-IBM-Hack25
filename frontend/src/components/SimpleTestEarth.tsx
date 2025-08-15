
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { LOOK } from './animationConfig';
import type { AppState } from './animationConfig';

function SimpleEarth({ state }: { state: AppState }) {
  const color = LOOK[state].base;
  
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 2]} intensity={1.2} />
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

export { SimpleEarth };
