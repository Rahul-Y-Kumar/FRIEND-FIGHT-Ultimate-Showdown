import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../game/effects/AudioManager';
import { ArrowLeft, Swords, Sparkles, Zap, Shield, Flame, Wind, Award, Play } from 'lucide-react';

export const HowToPlay: React.FC = () => {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(0,240,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full mb-6">
        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('MAIN_MENU');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-850 hover:bg-dark-800 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs sm:text-sm font-rajdhani font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">
            HOW TO <span className="text-arcade-red">PLAY</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-zinc-400">
            MASTER COMBAT TECHNIQUES, COMBOS & SPECIAL MOVES
          </p>
        </div>

        <div className="w-20" />
      </header>

      {/* --- CONTENT CARDS --- */}
      <main className="relative z-10 max-w-5xl mx-auto w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
        {/* DESKTOP KEYBOARD CONTROLS */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
          <h3 className="font-cinzel text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Swords className="w-5 h-5 text-arcade-red" />
            DESKTOP KEYBOARD CONTROLS
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-rajdhani">
            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">MOVE LEFT / RIGHT</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded-lg text-white font-bold border border-zinc-700 shadow-sm">
                A / D
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">JUMP</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded-lg text-white font-bold border border-zinc-700 shadow-sm">
                W
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">CROUCH</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded-lg text-white font-bold border border-zinc-700 shadow-sm">
                S
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">DASH</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded-lg text-white font-bold border border-zinc-700 shadow-sm">
                SHIFT
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">LIGHT PUNCH</span>
              <kbd className="px-2 py-0.5 bg-red-950 text-red-300 rounded-lg font-bold border border-red-800 shadow-sm">
                J
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">HEAVY PUNCH</span>
              <kbd className="px-2 py-0.5 bg-red-950 text-red-300 rounded-lg font-bold border border-red-800 shadow-sm">
                K
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">KICK</span>
              <kbd className="px-2 py-0.5 bg-orange-950 text-orange-300 rounded-lg font-bold border border-orange-800 shadow-sm">
                L
              </kbd>
            </div>

            <div className="flex items-center justify-between bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 font-bold">BLOCK (GUARD)</span>
              <kbd className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded-lg font-bold border border-blue-800 shadow-sm">
                SPACE
              </kbd>
            </div>

            <div className="col-span-2 flex items-center justify-between bg-dark-900/90 p-3 rounded-xl border border-yellow-500/40 shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">SPECIAL ATTACK (40 ENERGY)</span>
              </div>
              <kbd className="px-3 py-1 bg-yellow-950 text-yellow-300 rounded-lg font-bold border border-yellow-700 shadow-sm">
                I
              </kbd>
            </div>
          </div>

          <div className="text-[11px] font-rajdhani text-zinc-400 leading-relaxed border-t border-white/5 pt-2">
            💡 <strong className="text-zinc-300">Guard Rule:</strong> Blocking reduces 75% of incoming damage when facing the opponent!
          </div>
        </div>

        {/* COMBO RECIPES & TECHNIQUES */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
          <h3 className="font-cinzel text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-5 h-5 text-arcade-orange" />
            COMBO CHAINS & MOVES
          </h3>

          <div className="flex flex-col gap-2.5 text-xs font-rajdhani">
            <div className="bg-dark-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">DOUBLE PUNCH</span>
                <span className="text-[10px] text-zinc-500">Quick 2-hit jab sequence</span>
              </div>
              <span className="px-2.5 py-1 bg-dark-850 text-arcade-red font-bold rounded-lg border border-zinc-700">
                J + J
              </span>
            </div>

            <div className="bg-dark-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">QUICK COMBO (3 HITS)</span>
                <span className="text-[10px] text-zinc-500">Jab string finished with high kick</span>
              </div>
              <span className="px-2.5 py-1 bg-dark-850 text-arcade-orange font-bold rounded-lg border border-zinc-700">
                J + J + L
              </span>
            </div>

            <div className="bg-dark-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">HEAVY KNOCKDOWN</span>
                <span className="text-[10px] text-zinc-500">Light into heavy smash into high kick</span>
              </div>
              <span className="px-2.5 py-1 bg-dark-850 text-yellow-400 font-bold rounded-lg border border-zinc-700">
                J + K + L
              </span>
            </div>

            <div className="bg-dark-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">DASH PUNCH</span>
                <span className="text-[10px] text-zinc-500">High speed forward gap closer strike</span>
              </div>
              <span className="px-2.5 py-1 bg-dark-850 text-cyan-400 font-bold rounded-lg border border-zinc-700">
                SHIFT + J
              </span>
            </div>

            <div className="bg-dark-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">AERIAL KICK</span>
                <span className="text-[10px] text-zinc-500">Jumping airborne dropkick</span>
              </div>
              <span className="px-2.5 py-1 bg-dark-850 text-emerald-400 font-bold rounded-lg border border-zinc-700">
                W + L
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-4 flex justify-center">
        <button
          onClick={() => {
            audioManager.playHeavyPunch();
            setScreen('CHARACTER_SELECT');
          }}
          className="py-3 px-8 bg-gradient-to-r from-arcade-red to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white font-cinzel font-black text-sm rounded-xl shadow-arcade-red transition-all transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START PLAYING NOW</span>
        </button>
      </footer>
    </div>
  );
};
