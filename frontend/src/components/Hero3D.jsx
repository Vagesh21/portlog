import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingIcon({ position, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.2}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function ParticleField() {
  const particlesRef = useRef();
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
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
        <FloatingIcon position={[-2, 1, 0]} color="#00d4ff" />
        <FloatingIcon position={[2, -1, 0]} color="#06b6d4" />
        <FloatingIcon position={[0, 2, -2]} color="#10b981" />
        <FloatingIcon position={[-3, -2, -1]} color="#0ea5e9" />
        <FloatingIcon position={[3, 1, -1]} color="#f59e0b" />
      </Canvas>
    </div>
  );
};

export default Hero3D;