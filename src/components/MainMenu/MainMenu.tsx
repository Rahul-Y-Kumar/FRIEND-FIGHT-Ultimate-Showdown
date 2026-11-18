import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS } from '../../data/characters';
import { Play, Users, BookOpen, Settings, Swords, Flame, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioManager } from '../../game/effects/AudioManager';
import { useSettingsStore } from '../../store/settingsStore';

export const MainMenu: React.FC = () => {
  const setScreen = useGameStore((s) => s.setScreen);
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const setMusicVolume = useSettingsStore((s) => s.setMusicVolume);

  // Cycle featured confrontation fighters
  const [f1Idx, setF1Idx] = useState(0); // Rahul
  const [f2Idx, setF2Idx] = useState(1); // Likith

  useEffect(() => {
    const interval = setInterval(() => {
      setF1Idx((prev) => (prev + 2) % CHARACTERS.length);
      setF2Idx((prev) => (prev + 3) % CHARACTERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const f1 = CHARACTERS[f1Idx];
  const f2 = CHARACTERS[f2Idx === f1Idx ? (f2Idx + 1) % CHARACTERS.length : f2Idx];

  const handleStartPlay = () => {
    audioManager.playLightPunch();
    setScreen('CHARACTER_SELECT');
  };

  const toggleSound = () => {
    if (musicVolume > 0) {
      setMusicVolume(0);
    } else {
      setMusicVolume(0.5);
      audioManager.startBGM();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between overflow-hidden select-none">
      {/* Background radial arcade glow & ambient grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,57,53,0.18)_0%,rgba(14,14,14,0.95)_75%)] pointer-events-none" />
      <div className="absolute inset-0 arcade-scanlines opacity-30 pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-arcade-red to-orange-500 flex items-center justify-center shadow-arcade-red">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="font-cinzel text-base font-black tracking-widest text-white block leading-none">
              FRIEND FIGHT
            </span>
            <span className="text-[10px] font-rajdhani tracking-[0.25em] text-arcade-orange font-bold uppercase">
              ULTIMATE SHOWDOWN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 hover:bg-dark-800 border border-zinc-750 text-xs font-rajdhani font-semibold text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            {musicVolume > 0 ? (
              <Volume2 className="w-4 h-4 text-arcade-orange" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
            <span>{musicVolume > 0 ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </header>

      {/* --- CENTER HERO SECTION --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-6xl mx-auto w-full">
        {/* LOGO & TITLE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-rajdhani text-zinc-300 tracking-widest uppercase mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>GENUINE CUSTOM BROWSER COMBAT</span>
          </div>

          <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_0_40px_rgba(229,57,53,0.65)]">
            FRIEND{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-red via-orange-500 to-yellow-400">
              FIGHT
            </span>
          </h1>

          <p className="font-rajdhani text-sm sm:text-base md:text-lg font-bold tracking-[0.3em] text-zinc-400 uppercase mt-2">
            ULTIMATE SHOWDOWN • YOUR FRIENDS. YOUR FIGHT.
          </p>
        </div>

        {/* Cinematic Dual Fighter Stage Card */}
        <div className="relative w-full max-w-4xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 overflow-hidden">
          {/* Subtle stage ambient backlights */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-arcade-red/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-arcade-orange/20 rounded-full blur-3xl pointer-events-none" />

          {/* Fighter 1 (Left Showcase) */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative w-44 h-56 sm:w-52 sm:h-64 flex items-center justify-center">
              <div className="absolute bottom-2 inset-x-4 h-6 bg-arcade-red/30 rounded-full blur-md" />
              <img
                src={f1.fighterImage}
                alt={f1.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-3">
              <span className="px-2.5 py-0.5 bg-arcade-red/20 text-arcade-red text-[10px] font-bold font-rajdhani rounded-full border border-arcade-red/40 uppercase tracking-wider">
                FEATURED FIGHTER
              </span>
              <h3 className="font-cinzel text-2xl font-black text-white mt-1">
                {f1.name}
              </h3>
              <p className="text-xs font-rajdhani text-zinc-400">"{f1.nickname}"</p>
            </div>
          </div>

          {/* Glowing Animated VS Emblem Center */}
          <div className="flex flex-col items-center justify-center my-2 md:my-0">
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-dark-900 via-dark-850 to-dark-900 border-2 border-arcade-orange shadow-arcade-orange animate-pulse-glow">
              <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-arcade-red" />
            </div>
            <span className="font-cinzel font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 mt-2 tracking-widest">
              VS
            </span>
            <span className="text-[10px] font-rajdhani text-zinc-500 uppercase tracking-widest mt-0.5">
              ARCADE DUEL
            </span>
          </div>

          {/* Fighter 2 (Right Showcase) */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative w-44 h-56 sm:w-52 sm:h-64 flex items-center justify-center">
              <div className="absolute bottom-2 inset-x-4 h-6 bg-arcade-orange/30 rounded-full blur-md" />
              <img
                src={f2.fighterImage}
                alt={f2.name}
                className="max-h-full max-w-full object-contain -scale-x-100 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-3">
              <span className="px-2.5 py-0.5 bg-arcade-orange/20 text-arcade-orange text-[10px] font-bold font-rajdhani rounded-full border border-arcade-orange/40 uppercase tracking-wider">
                FEATURED RIVAL
              </span>
              <h3 className="font-cinzel text-2xl font-black text-white mt-1">
                {f2.name}
              </h3>
              <p className="text-xs font-rajdhani text-zinc-400">"{f2.nickname}"</p>
            </div>
          </div>
        </div>

        {/* --- MAIN ACTION BUTTONS --- */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr_auto] gap-3">
          {/* PLAY NOW */}
          <button
            onClick={handleStartPlay}
            className="py-4 px-6 bg-gradient-to-r from-arcade-red via-red-600 to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white rounded-2xl font-cinzel font-black text-lg sm:text-xl tracking-wider shadow-arcade-red transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>PLAY NOW</span>
          </button>

          {/* ROSTER */}
          <button
            onClick={() => {
              audioManager.playLightPunch();
              setScreen('CHARACTER_COLLECTION');
            }}
            className="py-4 px-4 bg-dark-850 hover:bg-dark-800 text-zinc-200 hover:text-white rounded-2xl font-rajdhani font-bold text-sm tracking-wider border border-zinc-700/80 hover:border-arcade-orange transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Users className="w-4 h-4 text-arcade-orange" />
            <span>ROSTER</span>
          </button>

          {/* GUIDE */}
          <button
            onClick={() => {
              audioManager.playLightPunch();
              setScreen('HOW_TO_PLAY');
            }}
            className="py-4 px-4 bg-dark-850 hover:bg-dark-800 text-zinc-200 hover:text-white rounded-2xl font-rajdhani font-bold text-sm tracking-wider border border-zinc-700/80 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>GUIDE</span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => {
              audioManager.playLightPunch();
              setScreen('SETTINGS');
            }}
            className="p-4 bg-dark-850 hover:bg-dark-800 text-zinc-400 hover:text-white rounded-2xl border border-zinc-700/80 hover:border-zinc-500 transition-all flex items-center justify-center cursor-pointer shadow-md"
            title="Game Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-4 px-6 text-center border-t border-white/5 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full text-xs font-rajdhani text-zinc-500 tracking-wider">
        <span>7 PLAYABLE FRIEND CHARACTERS • 3 ARENAS • REAL COMBAT SIMULATION</span>
        <span className="mt-1 sm:mt-0 text-zinc-400">ARCADE EDITION v1.0</span>
      </footer>
    </div>
  );
};
