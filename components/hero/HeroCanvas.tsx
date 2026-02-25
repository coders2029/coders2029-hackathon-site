"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─── Wireframe Icosahedron ─── */
function WireIcosahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[-3, 1, -2]}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          opacity={0.35}
          transparent
        />
      </mesh>
    </Float>
  );
}

/* ─── Wireframe Torus Knot ─── */
function WireTorusKnot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x -= delta * 0.08;
    ref.current.rotation.z += delta * 0.14;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={[3.5, -0.5, -3]}>
        <torusKnotGeometry args={[1.1, 0.35, 100, 16]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>
    </Float>
  );
}

/* ─── Floating Particles ─── */
function ParticleField({ count = 400 }) {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.02;
    points.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Orbiting Ring ─── */
function HeroRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x =
      Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, 0, -4]}>
      <torusGeometry args={[3.2, 0.012, 16, 120]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
    </mesh>
  );
}

/* ─── Subtle Grid Plane ─── */
function GridFloor() {
  return (
    <gridHelper
      args={[40, 40, "#00f0ff", "#1e293b"]}
      position={[0, -4, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

/* ─── Exported Canvas Component ─── */
export default function HeroCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00f0ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#a855f7" />

        <WireIcosahedron />
        <WireTorusKnot />
        <HeroRing />
        <ParticleField />
        <GridFloor />
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={3}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
}
