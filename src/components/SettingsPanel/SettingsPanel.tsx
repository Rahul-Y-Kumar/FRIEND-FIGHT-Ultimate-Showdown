import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../game/effects/AudioManager';
import { ArrowLeft, Volume2, Cpu, Monitor, Keyboard, RotateCcw } from 'lucide-react';
import { AIDifficulty, AIPersonality } from '../../types/game';

export const SettingsPanel: React.FC = () => {
  const setScreen = useGameStore((s) => s.setScreen);
  const {
    musicVolume,
    sfxVolume,
    difficulty,
    aiPersonality,
    graphicsQuality,
    screenShake,
    reducedMotion,
    mobileControlsAlways,
    setMusicVolume,
    setSfxVolume,
    setDifficulty,
    setAiPersonality,
    setGraphicsQuality,
    setScreenShake,
    setReducedMotion,
    setMobileControlsAlways,
  } = useSettingsStore();

  const handleResetData = () => {
    if (window.confirm('Reset all friend match statistics and win/loss records?')) {
      localStorage.removeItem('friend_fight_stats_v1');
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,133,51,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full mb-6">
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
            GAME <span className="text-arcade-orange">SETTINGS</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-zinc-400">
            AUDIO, AI OPPONENT TUNING & ACCESSIBILITY
          </p>
        </div>

        <div className="w-20" />
      </header>

      {/* --- SETTINGS CONTENT CONTAINER --- */}
      <main className="relative z-10 max-w-4xl mx-auto w-full glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-6 my-auto shadow-2xl">
        {/* AUDIO SECTION */}
        <div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
            <Volume2 className="w-5 h-5 text-arcade-red" />
            AUDIO CHANNELS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <div className="flex justify-between text-xs font-bold font-rajdhani text-zinc-300 mb-2">
                <span>SOUND EFFECTS (SFX)</span>
                <span className="text-arcade-red">{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSfxVolume(val);
                  audioManager.playLightPunch();
                }}
                className="w-full accent-arcade-red cursor-pointer"
              />
            </div>

            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <div className="flex justify-between text-xs font-bold font-rajdhani text-zinc-300 mb-2">
                <span>BACKGROUND MUSIC (BGM)</span>
                <span className="text-arcade-orange">{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-arcade-orange cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI OPPONENT CONFIGURATION */}
        <div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
            <Cpu className="w-5 h-5 text-arcade-orange" />
            AI OPPONENT TUNING
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs font-bold font-rajdhani text-zinc-300 block mb-2">
                DIFFICULTY LEVEL
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      audioManager.playLightPunch();
                      setDifficulty(d);
                    }}
                    className={`py-2 text-xs font-bold font-rajdhani rounded-xl transition-all cursor-pointer ${
                      difficulty === d
                        ? 'bg-arcade-red text-white shadow-[0_0_12px_#e53935]'
                        : 'bg-dark-850 text-zinc-400 hover:text-white border border-zinc-750'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Override */}
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs font-bold font-rajdhani text-zinc-300 block mb-2">
                AI FIGHTING STYLE
              </span>
              <select
                value={aiPersonality}
                onChange={(e) => {
                  audioManager.playLightPunch();
                  setAiPersonality(e.target.value as AIPersonality | 'CHARACTER_DEFAULT');
                }}
                className="w-full bg-dark-850 text-white text-xs font-bold font-rajdhani p-2.5 rounded-xl border border-zinc-700 outline-none cursor-pointer"
              >
                <option value="CHARACTER_DEFAULT">Character Default (Recommended)</option>
                <option value="AGGRESSIVE">Aggressive (Heavy Pressure)</option>
                <option value="DEFENSIVE">Defensive (Guard & Poke)</option>
                <option value="STRATEGIC">Strategic (Tactical Punishes)</option>
                <option value="UNPREDICTABLE">Unpredictable (Acrobatic Jumps)</option>
                <option value="BALANCED">Balanced (Adaptive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRAPHICS & ACCESSIBILITY */}
        <div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            DISPLAY & ACCESSIBILITY
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-rajdhani">
            {/* Screen Shake */}
            <div className="bg-dark-900/90 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-200 block">SCREEN SHAKE</span>
                <span className="text-[10px] text-zinc-500">Heavy impact effects</span>
              </div>
              <input
                type="checkbox"
                checked={screenShake}
                onChange={(e) => setScreenShake(e.target.checked)}
                className="w-4 h-4 accent-arcade-red cursor-pointer"
              />
            </div>

            {/* Reduced Motion */}
            <div className="bg-dark-900/90 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-200 block">REDUCED MOTION</span>
                <span className="text-[10px] text-zinc-500">Milder animations</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-arcade-red cursor-pointer"
              />
            </div>

            {/* Mobile Controls Always Visible */}
            <div className="bg-dark-900/90 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-200 block">TOUCH CONTROLS</span>
                <span className="text-[10px] text-zinc-500">Show buttons on desktop</span>
              </div>
              <input
                type="checkbox"
                checked={mobileControlsAlways}
                onChange={(e) => setMobileControlsAlways(e.target.checked)}
                className="w-4 h-4 accent-arcade-orange cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* RESET DATA BUTTON */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-rajdhani">DATA PERSISTENCE: LOCALSTORAGE</span>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-red-950/60 border border-zinc-800 hover:border-red-800 text-xs text-zinc-400 hover:text-red-400 transition-all font-rajdhani cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET WIN/LOSS RECORDS</span>
          </button>
        </div>
      </main>

      <div className="h-6" />
    </div>
  );
};
