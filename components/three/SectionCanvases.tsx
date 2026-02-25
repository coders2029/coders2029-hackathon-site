"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Floating Wireframe Shapes (About backdrop) ─── */
function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.1;
    ref.current.rotation.z += delta * 0.15;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={[3, 0.5, -1]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          opacity={0.15}
          transparent
        />
      </mesh>
    </Float>
  );
}

function FloatingDodecahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.x -= delta * 0.06;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh ref={ref} position={[-3, -0.5, -2]}>
        <dodecahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          opacity={0.12}
          transparent
        />
      </mesh>
    </Float>
  );
}

function MiniParticles({ count = 120 }) {
  const points = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.025}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export function AboutCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <FloatingOctahedron />
        <FloatingDodecahedron />
        <MiniParticles />
      </Canvas>
    </div>
  );
}

/* ─── Orbiting Rings (Hackathon backdrop) ─── */
function OrbitRing({
  radius,
  speed,
  tilt,
  color,
  opacity,
}: {
  radius: number;
  speed: number;
  tilt: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.z = tilt;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function PulsingCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    ref.current.scale.setScalar(scale);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.2} />
    </mesh>
  );
}

function DataStreams({ count = 80 }) {
  const points = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.5 + Math.random() * 2;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a855f7"
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export function HackathonCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <OrbitRing
          radius={2.2}
          speed={0.3}
          tilt={0.4}
          color="#00f0ff"
          opacity={0.2}
        />
        <OrbitRing
          radius={2.8}
          speed={-0.2}
          tilt={-0.6}
          color="#a855f7"
          opacity={0.15}
        />
        <OrbitRing
          radius={3.4}
          speed={0.15}
          tilt={0.8}
          color="#00f0ff"
          opacity={0.1}
        />
        <PulsingCore />
        <DataStreams />
      </Canvas>
    </div>
  );
}

/* ─── Connected Nodes graph (Footer backdrop) ─── */
function NodeGraph({ count = 30 }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { positions, linePositions } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const lines: number[] = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 4,
      ]);
    }
    // Connect nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i][0] - pos[j][0];
        const dy = pos[i][1] - pos[j][1];
        const dz = pos[i][2] - pos[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          lines.push(...pos[i], ...pos[j]);
        }
      }
    }
    return { positions: pos, linePositions: new Float32Array(lines) };
  }, [count]);

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={`node-${p[0].toFixed(4)}-${p[1].toFixed(4)}`} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.5} />
        </mesh>
      ))}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
              count={linePositions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.08} />
        </lineSegments>
      )}
    </group>
  );
}

export function FooterCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <NodeGraph />
      </Canvas>
    </div>
  );
}
