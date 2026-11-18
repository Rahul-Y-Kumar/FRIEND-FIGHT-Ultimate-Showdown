import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { effectsManager, Particle, FloatingText } from '../game/effects/EffectsManager';

export const ParticleRenderer: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!pointsRef.current) return;
    const count = effectsManager.particles.length;
    if (count === 0) {
      pointsRef.current.visible = false;
      return;
    }

    pointsRef.current.visible = true;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const p: Particle = effectsManager.particles[i];
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = 0.2; // slightly in front

      const c = new THREE.Color(p.color);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    pointsRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(pos, 3)
    );
    pointsRef.current.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(col, 3)
    );
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
