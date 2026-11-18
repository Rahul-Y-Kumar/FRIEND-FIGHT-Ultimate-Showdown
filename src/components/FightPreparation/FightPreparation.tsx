import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { getCharacterById } from '../../data/characters';
import { getArenaById } from '../../data/arenas';
import { audioManager } from '../../game/effects/AudioManager';
import { Swords, Play, ArrowLeft, Shield, Zap, Sparkles } from 'lucide-react';

export const FightPreparation: React.FC = () => {
  const { p1CharacterId, p2CharacterId, arenaId, setScreen } = useGameStore();

  const p1 = getCharacterById(p1CharacterId);
  const p2 = getCharacterById(p2CharacterId);
  const arena = getArenaById(arenaId);

  const handleStartFight = () => {
    audioManager.playCountdown(0);
    setScreen('FIGHTING');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,57,53,0.18)_0%,rgba(8,8,8,0.98)_80%)] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('ARENA_SELECT');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-850 hover:bg-dark-800 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs sm:text-sm font-rajdhani font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ARENAS</span>
        </button>

        <div className="text-center">
          <div className="font-rajdhani text-xs tracking-widest text-arcade-orange font-bold uppercase">
            STAGE: {arena.name.toUpperCase()}
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
            FACE OFF
          </h1>
        </div>

        <div className="w-20" />
      </header>

      {/* Center Cinematic Faceoff Stage */}
      <main className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-auto py-4">
        {/* P1 Card (Left) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="relative w-48 h-64 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-4 border-arcade-red shadow-[0_0_35px_rgba(229,57,53,0.5)] bg-dark-900 p-2 flex items-center justify-center">
            <img
              src={p1.fighterImage}
              alt={p1.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
            />
            <div className="absolute top-3 left-3 bg-arcade-red px-3 py-1 rounded-full text-white font-cinzel font-black text-xs shadow-md">
              PLAYER 1 (YOU)
            </div>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-white mt-4 uppercase">
            {p1.name}
          </h2>
          <p className="font-rajdhani text-sm text-arcade-red font-bold uppercase">
            "{p1.nickname}"
          </p>
          <p className="italic text-xs text-zinc-400 mt-2 max-w-xs font-rajdhani">
            "{p1.voiceLines.intro}"
          </p>
        </div>

        {/* VS Emblem & Match Specs Center */}
        <div className="flex flex-col items-center justify-center my-4 animate-pulse-glow">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-black via-dark-850 to-black border-2 border-arcade-orange shadow-arcade-orange flex items-center justify-center">
            <Swords className="w-10 h-10 sm:w-14 sm:h-14 text-arcade-red" />
          </div>
          <span className="font-cinzel text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 mt-2 tracking-widest">
            VS
          </span>
          <div className="mt-3 px-4 py-1.5 bg-dark-850/90 rounded-full border border-zinc-800 text-xs font-rajdhani text-zinc-300 uppercase tracking-widest shadow-md">
            BEST OF 3 ROUNDS • 90S • 1000 HP
          </div>
        </div>

        {/* P2 Card (Right) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="relative w-48 h-64 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-4 border-arcade-orange shadow-[0_0_35px_rgba(255,133,51,0.5)] bg-dark-900 p-2 flex items-center justify-center">
            <img
              src={p2.fighterImage}
              alt={p2.name}
              className="max-h-full max-w-full object-contain -scale-x-100 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
            />
            <div className="absolute top-3 right-3 bg-arcade-orange px-3 py-1 rounded-full text-white font-cinzel font-black text-xs shadow-md">
              PLAYER 2 (CPU)
            </div>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-white mt-4 uppercase">
            {p2.name}
          </h2>
          <p className="font-rajdhani text-sm text-arcade-orange font-bold uppercase">
            "{p2.nickname}"
          </p>
          <p className="italic text-xs text-zinc-400 mt-2 max-w-xs font-rajdhani">
            "{p2.voiceLines.intro}"
          </p>
        </div>
      </main>

      {/* Start Button */}
      <footer className="relative z-10 max-w-md mx-auto w-full pb-4">
        <button
          onClick={handleStartFight}
          className="w-full py-4 px-8 bg-gradient-to-r from-arcade-red via-red-600 to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white font-cinzel font-black text-xl rounded-2xl shadow-arcade-red transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>ENTER THE ARENA</span>
        </button>
      </footer>
    </div>
  );
};
