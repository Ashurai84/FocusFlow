import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ThreeDDiagramProps {
  type: 'heart' | 'atom' | 'dna' | 'calculator' | 'brain' | 'lungs' | 'eye' | 'molecule';
}

function HeartModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Heart chambers */}
      <Sphere args={[0.8, 32, 32]} position={[-0.4, 0.2, 0]}>
        <meshStandardMaterial color="#ff4757" />
      </Sphere>
      <Sphere args={[0.8, 32, 32]} position={[0.4, 0.2, 0]}>
        <meshStandardMaterial color="#ff3742" />
      </Sphere>
      {/* Heart bottom */}
      <Cylinder args={[0.6, 0.1, 1.5]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#ff2f3a" />
      </Cylinder>
      {/* Arteries */}
      <Cylinder args={[0.1, 0.1, 1]} position={[-0.6, 1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#ff6b9d" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 1]} position={[0.6, 1, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#ff6b9d" />
      </Cylinder>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Human Heart
      </Text>
    </group>
  );
}

function AtomModel() {
  const meshRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    
    // Animate electrons
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const angle = state.clock.elapsedTime * (2 + i * 0.5);
        const radius = 1.5 + i * 0.3;
        electron.position.x = Math.cos(angle) * radius;
        electron.position.z = Math.sin(angle) * radius;
        electron.position.y = Math.sin(angle * 2) * 0.2;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {/* Nucleus */}
      <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffa502" />
      </Sphere>
      
      {/* Electron orbits */}
      {[0, 1, 2].map((i) => (
        <Torus key={i} args={[1.5 + i * 0.3, 0.02, 8, 32]} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
          <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
        </Torus>
      ))}
      
      {/* Electrons */}
      {[0, 1, 2].map((i) => (
        <Sphere 
          key={i}
          ref={(el) => electronRefs.current[i] = el!}
          args={[0.08, 8, 8]} 
          position={[1.5 + i * 0.3, 0, 0]}
        >
          <meshStandardMaterial color="#3742fa" />
        </Sphere>
      ))}
      
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Atomic Structure
      </Text>
    </group>
  );
}

function DNAModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={i} position={[0, i * 0.2 - 2, 0]} rotation={[0, i * 0.3, 0]}>
          {/* Base pairs */}
          <Cylinder args={[0.03, 0.03, 1.8]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#2ed573" />
          </Cylinder>
          {/* Nucleotides */}
          <Sphere args={[0.08, 8, 8]} position={[-0.9, 0, 0]}>
            <meshStandardMaterial color="#ff4757" />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={[0.9, 0, 0]}>
            <meshStandardMaterial color="#5352ed" />
          </Sphere>
          {/* Sugar-phosphate backbone */}
          <Cylinder args={[0.05, 0.05, 0.2]} position={[-1.1, 0, 0]}>
            <meshStandardMaterial color="#ffa502" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.2]} position={[1.1, 0, 0]}>
            <meshStandardMaterial color="#ffa502" />
          </Cylinder>
        </group>
      ))}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DNA Double Helix
      </Text>
    </group>
  );
}

function BrainModel() {
  const meshRef = useRef<THREE.Group>(null);
  const neuronRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
    
    // Animate neurons
    neuronRefs.current.forEach((neuron, i) => {
      if (neuron) {
        neuron.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {/* Brain hemispheres */}
      <Sphere args={[1.2, 32, 32]} position={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#ff6b9d" wireframe opacity={0.7} transparent />
      </Sphere>
      <Sphere args={[1.2, 32, 32]} position={[0.3, 0, 0]}>
        <meshStandardMaterial color="#ff6b9d" wireframe opacity={0.7} transparent />
      </Sphere>
      
      {/* Neural connections */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Sphere 
          key={i} 
          ref={(el) => neuronRefs.current[i] = el!}
          args={[0.05, 8, 8]} 
          position={[
            Math.cos(i * 0.8) * 1.3,
            Math.sin(i * 0.6) * 1.3,
            Math.cos(i * 1.2) * 0.5
          ]}
        >
          <meshStandardMaterial color="#ffa502" transparent />
        </Sphere>
      ))}
      
      {/* Connecting lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Cylinder 
          key={i}
          args={[0.01, 0.01, 0.5]}
          position={[
            Math.cos(i * 0.6) * 0.8,
            Math.sin(i * 0.4) * 0.8,
            0
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
        >
          <meshStandardMaterial color="#00d2d3" opacity={0.6} transparent />
        </Cylinder>
      ))}
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Neural Network
      </Text>
    </group>
  );
}

function LungsModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      // Breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Left lung */}
      <Sphere args={[0.8, 16, 16]} position={[-0.6, 0, 0]}>
        <meshStandardMaterial color="#ff9ff3" opacity={0.8} transparent />
      </Sphere>
      {/* Right lung */}
      <Sphere args={[0.8, 16, 16]} position={[0.6, 0, 0]}>
        <meshStandardMaterial color="#ff9ff3" opacity={0.8} transparent />
      </Sphere>
      {/* Trachea */}
      <Cylinder args={[0.1, 0.1, 1.5]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#54a0ff" />
      </Cylinder>
      {/* Bronchi */}
      <Cylinder args={[0.08, 0.08, 0.8]} position={[-0.3, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#54a0ff" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.8]} position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#54a0ff" />
      </Cylinder>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Respiratory System
      </Text>
    </group>
  );
}

function CalculatorModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Calculator body */}
      <Box args={[2, 3, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2c2c54" />
      </Box>
      {/* Display */}
      <Box args={[1.8, 0.5, 0.1]} position={[0, 1, 0.15]}>
        <meshStandardMaterial color="#40407a" />
      </Box>
      {/* Buttons */}
      {Array.from({ length: 16 }).map((_, i) => (
        <Box key={i} args={[0.3, 0.3, 0.1]} position={[
          -0.6 + (i % 4) * 0.4,
          0.3 - Math.floor(i / 4) * 0.4,
          0.15
        ]}>
          <meshStandardMaterial color="#706fd3" />
        </Box>
      ))}
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Calculator
      </Text>
    </group>
  );
}

function EyeModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Eyeball */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      {/* Iris */}
      <Sphere args={[0.4, 32, 32]} position={[0, 0, 0.9]}>
        <meshStandardMaterial color="#3742fa" />
      </Sphere>
      {/* Pupil */}
      <Sphere args={[0.2, 32, 32]} position={[0, 0, 0.95]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      {/* Optic nerve */}
      <Cylinder args={[0.2, 0.2, 1]} position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffa502" />
      </Cylinder>
      
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Human Eye
      </Text>
    </group>
  );
}

function MoleculeModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Water molecule H2O */}
      {/* Oxygen */}
      <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff4757" />
      </Sphere>
      {/* Hydrogen atoms */}
      <Sphere args={[0.15, 16, 16]} position={[-0.8, 0.6, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.8, 0.6, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      {/* Bonds */}
      <Cylinder args={[0.03, 0.03, 0.8]} position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#2ed573" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.8]} position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#2ed573" />
      </Cylinder>
      
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        H₂O Molecule
      </Text>
    </group>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function ThreeDDiagram({ type }: ThreeDDiagramProps) {
  const renderModel = () => {
    switch (type) {
      case 'heart':
        return <HeartModel />;
      case 'atom':
        return <AtomModel />;
      case 'dna':
        return <DNAModel />;
      case 'brain':
        return <BrainModel />;
      case 'calculator':
        return <CalculatorModel />;
      case 'lungs':
        return <LungsModel />;
      case 'eye':
        return <EyeModel />;
      case 'molecule':
        return <MoleculeModel />;
      default:
        return <AtomModel />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden"
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#ff4757" intensity={0.3} />
          <pointLight position={[0, 10, -10]} color="#3742fa" intensity={0.3} />
          {renderModel()}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            maxDistance={8}
            minDistance={3}
          />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}