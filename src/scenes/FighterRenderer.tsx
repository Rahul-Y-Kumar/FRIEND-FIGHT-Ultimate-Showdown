import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { FighterState, Character } from '../types/game';
import { getCharacterById } from '../data/characters';

interface Props {
  fighter: FighterState;
}

export const FighterRenderer: React.FC<Props> = ({ fighter }) => {
  const character: Character = useMemo(() => getCharacterById(fighter.characterId), [fighter.characterId]);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Load transparent PNG cutout
  const texture = useLoader(THREE.TextureLoader, character.fighterImage);
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  const baseHeight = 2.4;
  const baseWidth = baseHeight * character.aspectRatio;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Position group at fighter world position
    groupRef.current.position.x = fighter.x;
    groupRef.current.position.y = fighter.y;
    groupRef.current.position.z = 0;

    // 2. Compute facing sign
    const facingSign = fighter.facing === 'right' ? 1 : -1;

    // 3. Procedural animation parameters
    let animOffsetX = 0;
    let animOffsetY = baseHeight / 2;
    let animRotZ = 0;
    let scaleX = baseWidth * facingSign;
    let scaleY = baseHeight;
    let emissiveColor = new THREE.Color('#000000');
    let emissiveIntensity = 0;

    const anim = fighter.animState;

    switch (anim) {
      case 'IDLE': {
        const breath = Math.sin(time * 5);
        animOffsetY += breath * 0.03;
        scaleY += breath * 0.04;
        break;
      }

      case 'WALK': {
        const step = Math.sin(time * 10);
        animOffsetY += Math.abs(step) * 0.06;
        animRotZ = -facingSign * step * 0.05;
        break;
      }

      case 'RUN': {
        animRotZ = -facingSign * 0.18;
        scaleY = baseHeight * 0.95;
        scaleX = baseWidth * facingSign * 1.05;
        break;
      }

      case 'JUMP': {
        scaleY = baseHeight * 1.12;
        scaleX = baseWidth * facingSign * 0.9;
        animRotZ = -facingSign * 0.08;
        break;
      }

      case 'CROUCH': {
        scaleY = baseHeight * 0.68;
        animOffsetY -= 0.35;
        break;
      }

      case 'PUNCH': {
        animOffsetX = facingSign * 0.3;
        animRotZ = -facingSign * 0.1;
        scaleX = baseWidth * facingSign * 1.1;
        break;
      }

      case 'HEAVY_PUNCH': {
        animOffsetX = facingSign * 0.5;
        animRotZ = -facingSign * 0.15;
        scaleX = baseWidth * facingSign * 1.15;
        emissiveColor = new THREE.Color('#FF8533');
        emissiveIntensity = 0.4;
        break;
      }

      case 'KICK': {
        animOffsetX = facingSign * 0.35;
        animRotZ = facingSign * 0.18; // lean back to kick high
        scaleY = baseHeight * 1.05;
        break;
      }

      case 'BLOCK': {
        animOffsetX = -facingSign * 0.15;
        scaleX = baseWidth * facingSign * 0.95;
        emissiveColor = new THREE.Color('#00F0FF');
        emissiveIntensity = 0.5;
        break;
      }

      case 'SPECIAL_ATTACK': {
        animOffsetX = facingSign * 0.45;
        animOffsetY += Math.sin(time * 15) * 0.05;
        scaleX = baseWidth * facingSign * 1.2;
        scaleY = baseHeight * 1.15;
        emissiveColor = new THREE.Color(character.themeColor.primary);
        emissiveIntensity = 0.9;
        break;
      }

      case 'HIT': {
        // Red hit flash & violent jitter
        animOffsetX = -facingSign * 0.2 + (Math.random() - 0.5) * 0.08;
        animRotZ = facingSign * 0.2;
        emissiveColor = new THREE.Color('#FF1744');
        emissiveIntensity = 0.85;
        break;
      }

      case 'KNOCKBACK': {
        animOffsetX = -facingSign * 0.4;
        animRotZ = facingSign * 0.35;
        emissiveColor = new THREE.Color('#FF1744');
        emissiveIntensity = 0.5;
        break;
      }

      case 'VICTORY': {
        const victoryHop = Math.abs(Math.sin(time * 4)) * 0.25;
        animOffsetY += victoryHop;
        emissiveColor = new THREE.Color('#FFD700');
        emissiveIntensity = 0.4;
        break;
      }

      case 'DEFEAT': {
        animOffsetY -= 0.6;
        animRotZ = -facingSign * 0.8;
        scaleY = baseHeight * 0.75;
        break;
      }
    }

    // Apply invulnerability flash if active
    if (fighter.invulnerableTimer > 0) {
      if (Math.floor(time * 30) % 2 === 0) {
        materialRef.current.opacity = 0.35;
      } else {
        materialRef.current.opacity = 0.9;
      }
    } else {
      materialRef.current.opacity = 1.0;
    }

    // Smooth transform updates
    meshRef.current.position.x = animOffsetX;
    meshRef.current.position.y = animOffsetY;
    meshRef.current.rotation.z = animRotZ;
    meshRef.current.scale.set(scaleX, scaleY, 1);

    materialRef.current.emissive = emissiveColor;
    materialRef.current.emissiveIntensity = emissiveIntensity;

    // 4. Update shadow under fighter
    if (shadowRef.current) {
      shadowRef.current.position.x = fighter.x;
      // Shadow stays glued to ground y=0.01 regardless of fighter jump height
      const shadowScale = Math.max(0.2, 1 - fighter.y * 0.3);
      shadowRef.current.scale.set(baseWidth * 0.8 * shadowScale, 0.4 * shadowScale, 1);
      (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.1, 0.55 - fighter.y * 0.2);
    }
  });

  return (
    <>
      {/* Dynamic Ground Contact Shadow */}
      <mesh ref={shadowRef} position={[fighter.x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* 2.5D Animated Fighter Plane */}
      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            ref={materialRef}
            map={texture}
            transparent
            alphaTest={0.05}
            roughness={0.4}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Blocking Energy Shield Overlay */}
        {fighter.isBlocking && (
          <mesh position={[fighter.facing === 'right' ? 0.6 : -0.6, baseHeight / 2, 0.1]}>
            <ringGeometry args={[0.6, 0.95, 24]} />
            <meshBasicMaterial
              color="#00F0FF"
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </>
  );
};
