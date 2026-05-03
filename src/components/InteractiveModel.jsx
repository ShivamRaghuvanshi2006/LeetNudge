import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'

export default function InteractiveModel() {
  const groupRef = useRef(null)
  const outerRef = useRef(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.2
      groupRef.current.rotation.y += delta * 0.3
      // Floating effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1
      outerRef.current.rotation.z += delta * 0.4
    }
  })

  // Neo-Brutalist 3D Object
  // Flat colors, hard wireframes
  return (
    <group ref={groupRef} scale={1.8}>
      {/* Core AI Block */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#000000" />
        <Edges scale={1.05} threshold={15} color="#FFD93D" />
      </mesh>

      {/* Floating internal sphere */}
      <mesh scale={0.6}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#FF6B6B" wireframe />
      </mesh>

      {/* Outer bounding chaos box */}
      <mesh ref={outerRef} scale={1.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#4ade80" wireframe />
      </mesh>

      {/* Accent blocks floating nearby */}
      <mesh position={[1.5, 1, 0]} scale={0.3}>
        <boxGeometry />
        <meshBasicMaterial color="#fff" />
        <Edges scale={1.05} threshold={15} color="#000" />
      </mesh>
      
      <mesh position={[-1.2, -1, 0]} scale={0.4}>
        <boxGeometry />
        <meshBasicMaterial color="#8B5CF6" />
        <Edges scale={1.05} threshold={15} color="#000" />
      </mesh>
    </group>
  )
}
