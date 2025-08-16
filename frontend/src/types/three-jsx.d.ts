import { ReactThreeFiber } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js elements
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
      pointLight: ReactThreeFiber.LightNode<THREE.PointLight, typeof THREE.PointLight>
      
      // Geometries
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>
      boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>
      planeGeometry: ReactThreeFiber.BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>
      bufferGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>
      
      // Materials
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
      meshPhysicalMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial>
      meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>
      shaderMaterial: ReactThreeFiber.ShaderMaterialNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial>
      lineBasicMaterial: ReactThreeFiber.MaterialNode<THREE.LineBasicMaterial, typeof THREE.LineBasicMaterial>
      pointsMaterial: ReactThreeFiber.MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>
      
      // Other elements
      points: ReactThreeFiber.Object3DNode<THREE.Points, typeof THREE.Points>
      line: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
      primitive: ReactThreeFiber.Object3DNode<THREE.Object3D, typeof THREE.Object3D>
      
      // Buffer attributes
      bufferAttribute: ReactThreeFiber.BufferAttributeNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>
    }
  }
}
