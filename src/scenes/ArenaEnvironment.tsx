import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Arena } from '../types/game';

interface Props {
  arena: Arena;
}

export const ArenaEnvironment: React.FC<Props> = ({ arena }) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Background particles depending on arena theme
  const particleCount = arena.theme === 'dojo' ? 120 : arena.theme === 'rooftop' ? 90 : 150;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color(arena.accentColor);
    const c2 = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

      const mixed = c1.clone().lerp(c2, Math.random() * 0.5);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [particleCount, arena.accentColor]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      if (arena.theme === 'dojo') {
        // Falling sakura petals
        pos[idx + 1] -= delta * 0.8;
        pos[idx] += Math.sin(pos[idx + 1] * 2) * delta * 0.3;
        if (pos[idx + 1] < 0) pos[idx + 1] = 8;
      } else if (arena.theme === 'rooftop') {
        // Wind blown dusk particles
        pos[idx] += delta * 1.2;
        pos[idx + 1] += Math.sin(pos[idx]) * delta * 0.2;
        if (pos[idx] > 12) pos[idx] = -12;
      } else {
        // Floating cyber sparks rising
        pos[idx + 1] += delta * 0.7;
        if (pos[idx + 1] > 8) pos[idx + 1] = 0;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Dynamic Arena Lighting */}
      <ambientLight intensity={arena.lightIntensity * 0.6} color={arena.ambientColor} />
      <directionalLight
        position={[0, 10, 8]}
        intensity={arena.lightIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color={arena.theme === 'dojo' ? '#fff1e0' : arena.theme === 'rooftop' ? '#ffd4b2' : '#d0f0ff'}
      />
      <pointLight position={[-5, 4, 2]} intensity={0.9} color={arena.accentColor} distance={12} />
      <pointLight position={[5, 4, 2]} intensity={0.9} color={arena.accentColor} distance={12} />

      {/* Floating Arena Atmospheric Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Arena Stage Specific Architecture */}
      {arena.theme === 'dojo' && <DojoStage />}
      {arena.theme === 'rooftop' && <RooftopStage />}
      {arena.theme === 'neon' && <NeonStage />}
    </group>
  );
};

// --- DOJO STAGE ---
const DojoStage: React.FC = () => {
  return (
    <group>
      {/* Polished Wooden Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial color="#4a2e18" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wooden Stage Border Trim */}
      <mesh position={[0, 0.02, -3.8]}>
        <boxGeometry args={[22, 0.15, 0.3]} />
        <meshStandardMaterial color="#2c1a0c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 3.8]}>
        <boxGeometry args={[22, 0.15, 0.3]} />
        <meshStandardMaterial color="#2c1a0c" roughness={0.6} />
      </mesh>

      {/* Traditional Wooden Pillars */}
      {[-7, -3.5, 3.5, 7].map((x, i) => (
        <group key={i} position={[x, 3, -3.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.28, 6.2, 16]} />
            <meshStandardMaterial color="#3d1e10" roughness={0.5} />
          </mesh>
          {/* Lantern */}
          <mesh position={[0, 1.2, 0.4]}>
            <boxGeometry args={[0.35, 0.6, 0.35]} />
            <meshStandardMaterial color="#ff5722" emissive="#ff6f00" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Japanese Pagoda Back Wall and Paper Screen Lattice */}
      <mesh position={[0, 3.2, -4.5]} receiveShadow>
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial color="#20150e" roughness={0.9} />
      </mesh>
      {/* Decorative Gold Crest */}
      <mesh position={[0, 4.2, -4.4]}>
        <ringGeometry args={[0.7, 1.1, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} emissive="#ffb300" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

// --- ROOFTOP STAGE ---
const RooftopStage: React.FC = () => {
  return (
    <group>
      {/* Concrete Helipad Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial color="#212529" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Helipad Yellow Target Circle */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.7, 48]} />
        <meshBasicMaterial color="#ffc107" />
      </mesh>
      {/* Helipad 'H' letter center */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 2.0]} />
        <meshBasicMaterial color="#ffc107" />
      </mesh>

      {/* Rooftop Edge Railing & Warning Lights */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <group key={i} position={[x, 0.7, -3.5]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
            <meshStandardMaterial color="#495057" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#e53935" />
          </mesh>
        </group>
      ))}

      {/* Distant City Skyline Silhouettes */}
      {[-10, -7, -4, -1, 2, 5, 8, 11].map((x, i) => {
        const height = 4 + (i % 3) * 2.5;
        const width = 2.2 + (i % 2) * 0.8;
        return (
          <mesh key={i} position={[x * 1.2, height / 2, -7]}>
            <boxGeometry args={[width, height, 1.5]} />
            <meshStandardMaterial color="#0c0717" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};

// --- NEON UNDERGROUND STAGE ---
const NeonStage: React.FC = () => {
  return (
    <group>
      {/* Dark Metallic Grid Platform */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Neon Cyber Glow Lines */}
      {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
        <mesh key={i} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 9]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00f0ff' : '#ff007f'} />
        </mesh>
      ))}

      {/* Glowing Neon Cyber Columns */}
      {[-7.5, -4.5, 4.5, 7.5].map((x, i) => (
        <group key={i} position={[x, 2.8, -3.2]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 5.8, 16]} />
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <planeGeometry args={[0.08, 5.5]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00f0ff' : '#ff007f'} />
          </mesh>
        </group>
      ))}

      {/* Cyberpunk Holographic Back Billboard */}
      <mesh position={[0, 3.8, -4.5]}>
        <planeGeometry args={[12, 3.2]} />
        <meshStandardMaterial
          color="#060c18"
          emissive="#00f0ff"
          emissiveIntensity={0.15}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};
