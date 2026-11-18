import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getCharacterById } from '../../data/characters';
import { audioManager } from '../../game/effects/AudioManager';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Users, MapPin, Home, Zap, Shield, Flame, Award } from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const { lastMatch, p1CharacterId, p2CharacterId, setScreen } = useGameStore();

  const p1 = getCharacterById(p1CharacterId);
  const p2 = getCharacterById(p2CharacterId);

  const isP1Winner = lastMatch?.matchWinner === 'p1';
  const winner = isP1Winner ? p1 : p2;
  const loser = isP1Winner ? p2 : p1;

  useEffect(() => {
    if (isP1Winner) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 110,
          origin: { y: 0.5 },
        });
      }, 350);
    }
  }, [isP1Winner]);

  const stats = lastMatch?.stats || {
    p1DamageDealt: 0,
    p2DamageDealt: 0,
    p1MaxCombo: 0,
    p2MaxCombo: 0,
    p1SpecialsUsed: 0,
    p2SpecialsUsed: 0,
    p1Blocks: 0,
    p2Blocks: 0,
    matchDurationSeconds: 0,
  };

  const getVictoryQuote = () => {
    if (isP1Winner) {
      return winner.voiceLines.victory || "Bro needs a software update!";
    } else {
      return winner.voiceLines.victory || "That wasn't even close!";
    }
  };

  const handleRematch = () => {
    audioManager.playHeavyPunch();
    setScreen('FIGHTING');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${
            isP1Winner ? '#FFD700' : '#E53935'
          } 0%, transparent 75%)`,
        }}
      />

      {/* --- TOP BANNER --- */}
      <header className="relative z-10 text-center max-w-4xl mx-auto w-full pt-2">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
          <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-bounce" />
          <span className="font-rajdhani text-xs font-bold tracking-[0.25em] text-zinc-300 uppercase">
            MATCH CONCLUSION
          </span>
        </div>

        <h1
          className={`font-cinzel text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-wider drop-shadow-[0_0_40px_rgba(255,215,0,0.4)] ${
            isP1Winner
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-600'
          }`}
        >
          {isP1Winner ? 'VICTORY' : 'DEFEAT'}
        </h1>

        <div className="font-teko text-2xl sm:text-3xl text-zinc-300 tracking-wider mt-1">
          {winner.name} CONQUERS THE SHOWDOWN!
        </div>
      </header>

      {/* --- CENTER SECTION: WINNER CARD & STATS --- */}
      <main className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-center my-4">
        {/* Winner Showcase Card */}
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_35px_rgba(255,215,0,0.5)] bg-dark-900 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 bg-yellow-500 text-black text-[10px] font-black rounded-full font-cinzel">
                CHAMPION
              </span>
              <Award className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>

            <div className="relative flex-1 flex items-center justify-center my-1">
              <img
                src={winner.fighterImage}
                alt={winner.name}
                className="max-h-56 max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)]"
              />
            </div>

            <div className="text-center bg-black/80 backdrop-blur-sm py-1.5 rounded-xl border border-white/5">
              <span className="font-cinzel font-black text-xl text-yellow-400 tracking-wider block">
                {winner.name}
              </span>
              <p className="text-[11px] font-rajdhani text-zinc-400">"{winner.nickname}"</p>
            </div>
          </div>

          {/* Humorous Trash Talk Quote */}
          <div className="mt-4 p-3.5 bg-dark-900/90 rounded-2xl border border-yellow-500/30 text-center max-w-xs shadow-lg">
            <span className="text-[10px] text-zinc-500 font-bold font-rajdhani block uppercase tracking-wider mb-1">
              POST-FIGHT BANTER
            </span>
            <p className="font-cinzel font-bold text-xs sm:text-sm text-yellow-300 italic">
              "{getVictoryQuote()}"
            </p>
          </div>
        </div>

        {/* Match Statistics Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-cinzel font-black text-lg sm:text-xl text-white tracking-wider">
              COMBAT PERFORMANCE
            </h3>
            <span className="px-3 py-1 rounded-full bg-dark-850 text-arcade-orange text-xs font-bold font-rajdhani border border-zinc-700">
              FINAL SCORE: {lastMatch?.p1RoundsWon ?? 0} - {lastMatch?.p2RoundsWon ?? 0}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm font-rajdhani">
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">P1 DAMAGE DEALT</span>
              <span className="font-teko text-3xl sm:text-4xl font-bold text-arcade-red leading-none">
                {stats.p1DamageDealt} <span className="text-lg">HP</span>
              </span>
            </div>

            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">CPU DAMAGE DEALT</span>
              <span className="font-teko text-3xl sm:text-4xl font-bold text-arcade-orange leading-none">
                {stats.p2DamageDealt} <span className="text-lg">HP</span>
              </span>
            </div>

            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">MAX COMBO STREAK</span>
              <span className="font-teko text-3xl sm:text-4xl font-bold text-yellow-400 leading-none">
                {stats.p1MaxCombo} <span className="text-lg">HITS</span>
              </span>
            </div>

            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">SPECIAL ATTACKS</span>
              <span className="font-teko text-3xl sm:text-4xl font-bold text-cyan-400 leading-none">
                {stats.p1SpecialsUsed} <span className="text-lg">USED</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-rajdhani text-zinc-400 pt-3 border-t border-white/5">
            <span>MATCH TIME: {stats.matchDurationSeconds}s</span>
            <span>SUCCESSFUL BLOCKS: {stats.p1Blocks}</span>
          </div>
        </div>
      </main>

      {/* --- ACTION BUTTONS --- */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <button
          onClick={handleRematch}
          className="py-3.5 px-4 bg-gradient-to-r from-arcade-red to-arcade-orange hover:from-red-600 hover:to-orange-600 text-white font-cinzel font-black text-xs sm:text-sm rounded-xl shadow-arcade-red transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>REMATCH</span>
        </button>

        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('CHARACTER_SELECT');
          }}
          className="py-3.5 px-4 bg-dark-850 hover:bg-dark-800 text-zinc-300 hover:text-white font-rajdhani font-bold text-xs sm:text-sm rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Users className="w-4 h-4 text-arcade-orange" />
          <span>FIGHTERS</span>
        </button>

        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('ARENA_SELECT');
          }}
          className="py-3.5 px-4 bg-dark-850 hover:bg-dark-800 text-zinc-300 hover:text-white font-rajdhani font-bold text-xs sm:text-sm rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>ARENA</span>
        </button>

        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('MAIN_MENU');
          }}
          className="py-3.5 px-4 bg-dark-850 hover:bg-dark-800 text-zinc-400 hover:text-white font-rajdhani font-bold text-xs sm:text-sm rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>MENU</span>
        </button>
      </footer>
    </div>
  );
};
