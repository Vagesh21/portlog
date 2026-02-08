import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingIcon({ position, color, icon }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} ref={meshRef}>
        <Sphere args={[0.5, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </group>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        
        <ParticleField />
        
        {/* Floating Cyber Security Icons */}
        <FloatingIcon position={[-2, 1, 0]} color="#00d4ff" icon="shield" />
        <FloatingIcon position={[2, -1, 0]} color="#06b6d4" icon="lock" />
        <FloatingIcon position={[0, 2, -2]} color="#10b981" icon="network" />
        <FloatingIcon position={[-3, -2, -1]} color="#0ea5e9" icon="key" />
        <FloatingIcon position={[3, 1, -1]} color="#f59e0b" icon="server" />
      </Canvas>
    </div>
  );
};

export default Hero3D;