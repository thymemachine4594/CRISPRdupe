import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'


function Helix({ position, rotationSpeed = 0.01 }) {
const group = useRef()


const points = []
const radius = 1
const height = 16
const turns = 60


for (let i = 0; i < turns; i++) {
const angle = i * 0.35
const y = (i / turns) * height - height / 2


points.push({
x: Math.cos(angle) * radius,
z: Math.sin(angle) * radius,
y,
phase: angle,
})
}


useFrame(() => {
group.current.rotation.y += rotationSpeed
group.current.position.x += Math.sin(Date.now() * 0.0002) * 0.001
group.current.position.z += Math.cos(Date.now() * 0.0002) * 0.001
})


return (
<group ref={group} position={position}>
{points.map((p, i) => {
const depthFactor = (Math.sin(p.phase + Date.now() * 0.002) + 1) / 2
const scale = 0.08 + depthFactor * 0.08
const color = new THREE.Color().lerpColors(
new THREE.Color('#6a00ff'),
new THREE.Color('#00eaff'),
depthFactor
)


return (
<mesh key={i} position={[p.x, p.y, p.z]} scale={scale}>
<sphereGeometry args={[1, 16, 16]} />
<meshStandardMaterial
color={color}
emissive={color}
emissiveIntensity={0.8}
/>
</mesh>
)
})}
</group>
)
}


export default function DNAHelixScene() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      inset: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,          // KEY FIX
      pointerEvents: "none" // Prevent blocking clicks
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <Helix position={[-3, 0, 0]} rotationSpeed={0.008} />
        <Helix position={[3, 0, 0]} rotationSpeed={0.008} />
        <Helix position={[-3, 0, 0]} rotationSpeed={0.012} />
        <Helix position={[3, 0.1, 0]} rotationSpeed={0.012} />
      </Canvas>
    </div>
  )
}