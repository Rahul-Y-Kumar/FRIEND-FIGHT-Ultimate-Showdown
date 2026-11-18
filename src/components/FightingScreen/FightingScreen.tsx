import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { GameEngine, GameEngineState } from '../../game/engine/GameEngine';
import { FightingArena } from '../../scenes/FightingArena';
import { GameHUD } from '../GameHUD/GameHUD';
import { MobileControls } from '../MobileControls/MobileControls';
import { getArenaById } from '../../data/arenas';
import { audioManager } from '../../game/effects/AudioManager';

export const FightingScreen: React.FC = () => {
  const { p1CharacterId, p2CharacterId, arenaId, recordMatchResult, setScreen } = useGameStore();
  const { difficulty, aiPersonality } = useSettingsStore();
  const arena = getArenaById(arenaId);

  const engineRef = useRef<GameEngine | null>(null);
  const [engineState, setEngineState] = useState<GameEngineState | null>(null);

  useEffect(() => {
    // Start background music
    audioManager.startBGM();

    // Instantiate game simulation engine
    const engine = new GameEngine(
      p1CharacterId,
      p2CharacterId,
      difficulty,
      aiPersonality === 'CHARACTER_DEFAULT' ? 'BALANCED' : aiPersonality
    );
    engineRef.current = engine;

    const unsubscribe = engine.subscribe((state) => {
      setEngineState({ ...state });
    });

    engine.setOnMatchFinished((match) => {
      setTimeout(() => {
        recordMatchResult(match);
      }, 1500);
    });

    engine.start();

    return () => {
      unsubscribe();
      engine.stop();
      audioManager.stopBGM();
    };
  }, [p1CharacterId, p2CharacterId, difficulty, aiPersonality, recordMatchResult]);

  if (!engineState || !engineRef.current) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white font-cinzel text-xl">
        LOADING BATTLEGROUND...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden select-none">
      {/* 3D Three.js Arena and Fighters */}
      <FightingArena
        p1={engineState.p1}
        p2={engineState.p2}
        arena={arena}
      />

      {/* Arcade Fighting Game HUD */}
      <GameHUD
        p1={engineState.p1}
        p2={engineState.p2}
        match={engineState.match}
        arena={arena}
        isPaused={engineState.isPaused}
        onTogglePause={() => engineRef.current?.togglePause()}
        onRestart={() => engineRef.current?.restartMatch()}
        onExit={() => setScreen('MAIN_MENU')}
      />

      {/* Touch / Virtual Mobile Controls */}
      <MobileControls inputController={engineRef.current.input} />
    </div>
  );
};
