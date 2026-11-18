import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FighterState, Arena } from '../types/game';
import { ArenaEnvironment } from './ArenaEnvironment';
import { FighterRenderer } from './FighterRenderer';
import { ParticleRenderer } from './ParticleRenderer';
import { effectsManager } from '../game/effects/EffectsManager';
import { useSettingsStore } from '../store/settingsStore';

interface Props {
  p1: FighterState;
  p2: FighterState;
  arena: Arena;
}

const DynamicCameraController: React.FC<{ p1: FighterState; p2: FighterState }> = ({ p1, p2 }) => {
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const screenShakeEnabled = useSettingsStore((s) => s.screenShake);

  useFrame((state) => {
    // 1. Calculate midpoint of fighters
    const midX = (p1.x + p2.x) / 2;
    const distance = Math.abs(p1.x - p2.x);

    // 2. Compute camera target positions
    const targetX = midX * 0.65; // subtle parallax follow
    const targetZ = Math.max(6.2, 4.6 + distance * 0.65);
    const targetY = 1.6 + Math.max(0, (p1.y + p2.y) * 0.2);

    // 3. Screen shake calculation
    let shakeX = 0;
    let shakeY = 0;
    if (screenShakeEnabled && effectsManager.screenShake > 0) {
      const shakeMag = effectsManager.screenShake * 0.012;
      shakeX = (Math.random() - 0.5) * shakeMag;
      shakeY = (Math.random() - 0.5) * shakeMag;
    }

    // 4. Smooth camera interpolation
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX + shakeX, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + shakeY, 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);

    targetLookAt.current.x = THREE.MathUtils.lerp(targetLookAt.current.x, targetX, 0.1);
    targetLookAt.current.y = 1.3;
    targetLookAt.current.z = 0;
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
};

export const FightingArena: React.FC<Props> = ({ p1, p2, arena }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.8, 6.8], fov: 48 }}
        style={{ width: '100%', height: '100%', background: arena.bgColor }}
      >
        <Suspense fallback={null}>
          <DynamicCameraController p1={p1} p2={p2} />
          <ArenaEnvironment arena={arena} />
          <FighterRenderer fighter={p1} />
          <FighterRenderer fighter={p2} />
          <ParticleRenderer />
        </Suspense>
      </Canvas>
    </div>
  );
};
