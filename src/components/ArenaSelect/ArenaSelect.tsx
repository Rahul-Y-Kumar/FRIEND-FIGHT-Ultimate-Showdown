import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ARENAS, getArenaById } from '../../data/arenas';
import { Arena } from '../../types/game';
import { audioManager } from '../../game/effects/AudioManager';
import { ArrowLeft, Swords, MapPin, CheckCircle2, Sparkles, Sun, Sunset, Zap } from 'lucide-react';

export const ArenaSelect: React.FC = () => {
  const { arenaId, setArena, setScreen, p1CharacterId, p2CharacterId } = useGameStore();
  const selectedArena = getArenaById(arenaId);

  const handleSelectArena = (arena: Arena) => {
    audioManager.playLightPunch();
    setArena(arena.id);
  };

  const handleStartBattle = () => {
    audioManager.playHeavyPunch();
    setScreen('FIGHT_PREPARATION');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow tailored to active arena */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${selectedArena.accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('CHARACTER_SELECT');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-850 hover:bg-dark-800 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs sm:text-sm font-rajdhani font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>FIGHTERS</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">
            SELECT <span className="text-arcade-orange">ARENA</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-zinc-400">
            CHOOSE THE BATTLEGROUND FOR ROUND 1
          </p>
        </div>

        <div className="w-20" />
      </header>

      {/* --- 3 ARENA CARDS GRID --- */}
      <main className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {ARENAS.map((arena) => {
          const isSelected = arenaId === arena.id;

          return (
            <div
              key={arena.id}
              onClick={() => handleSelectArena(arena)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-dark-900 border-2 transition-all duration-300 p-5 flex flex-col justify-between ${
                isSelected
                  ? 'border-arcade-orange shadow-[0_0_30px_rgba(255,133,51,0.5)] transform -translate-y-2 bg-dark-850'
                  : 'border-zinc-800 hover:border-zinc-600 hover:-translate-y-1'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-arcade-orange text-white text-[11px] font-black font-rajdhani rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACTIVE ARENA</span>
                </div>
              )}

              {/* Arena Visual Thumbnail */}
              <div
                className="relative w-full h-48 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 shadow-inner"
                style={{ backgroundColor: arena.bgColor }}
              >
                {arena.theme === 'dojo' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-950/70 via-black/40 to-black">
                    <Sun className="w-12 h-12 text-amber-400 mb-2 drop-shadow-[0_0_15px_#f59e0b]" />
                    <span className="font-cinzel text-xl font-black text-amber-300 tracking-widest">
                      THE DOJO
                    </span>
                    <span className="text-[10px] font-rajdhani text-amber-500 font-bold uppercase tracking-wider mt-1">
                      CHERRY BLOSSOM TWILIGHT
                    </span>
                  </div>
                )}
                {arena.theme === 'rooftop' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-950/70 via-black/40 to-black">
                    <Sunset className="w-12 h-12 text-orange-400 mb-2 drop-shadow-[0_0_15px_#f97316]" />
                    <span className="font-cinzel text-xl font-black text-orange-300 tracking-widest">
                      ROOFTOP RUMBLE
                    </span>
                    <span className="text-[10px] font-rajdhani text-orange-400 font-bold uppercase tracking-wider mt-1">
                      SKYSCRAPER HELIPAD
                    </span>
                  </div>
                )}
                {arena.theme === 'neon' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cyan-950/70 via-black/40 to-black">
                    <Zap className="w-12 h-12 text-cyan-400 mb-2 drop-shadow-[0_0_15px_#00f0ff]" />
                    <span className="font-cinzel text-xl font-black text-cyan-300 tracking-widest">
                      NEON UNDERGROUND
                    </span>
                    <span className="text-[10px] font-rajdhani text-cyan-400 font-bold uppercase tracking-wider mt-1">
                      CYBERPUNK SUB-LEVEL 9
                    </span>
                  </div>
                )}
              </div>

              {/* Arena Details */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-arcade-orange font-rajdhani uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{arena.subtitle}</span>
                  </div>
                  <h3 className="font-cinzel text-2xl font-black text-white mt-1">
                    {arena.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {arena.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-rajdhani">
                  <span className="uppercase text-zinc-500">ATMOSPHERE: {arena.theme}</span>
                  <span className="font-bold text-arcade-orange">3D ENVIRONMENT READY</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* --- BOTTOM CONFIRMATION BAR --- */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div>
          <span className="text-xs text-zinc-400 font-rajdhani block">SELECTED ARENA:</span>
          <span className="font-cinzel text-lg font-bold text-white">
            {selectedArena.name} — <span className="text-arcade-orange">{selectedArena.subtitle}</span>
          </span>
        </div>

        <button
          onClick={handleStartBattle}
          className="w-full sm:w-auto py-3.5 px-10 bg-gradient-to-r from-arcade-red via-red-600 to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white font-cinzel font-black text-base sm:text-lg rounded-xl shadow-arcade-red transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
        >
          <Swords className="w-5 h-5" />
          <span>FIGHT PREPARATION</span>
        </button>
      </footer>
    </div>
  );
};
