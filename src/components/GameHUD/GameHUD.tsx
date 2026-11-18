import React, { useState, useEffect } from 'react';
import { FighterState, Character, Arena } from '../../types/game';
import { MatchSnapshot } from '../../game/match/MatchManager';
import { getCharacterById } from '../../data/characters';
import { Pause, Play, RotateCcw, Home, Zap, Shield, Swords } from 'lucide-react';

interface Props {
  p1: FighterState;
  p2: FighterState;
  match: MatchSnapshot;
  arena: Arena;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const GameHUD: React.FC<Props> = ({
  p1,
  p2,
  match,
  arena,
  isPaused,
  onTogglePause,
  onRestart,
  onExit,
}) => {
  const p1Char = getCharacterById(p1.characterId);
  const p2Char = getCharacterById(p2.characterId);

  // Smooth damage trail bars
  const [p1GhostHp, setP1GhostHp] = useState(p1.health);
  const [p2GhostHp, setP2GhostHp] = useState(p2.health);

  useEffect(() => {
    const t = setTimeout(() => {
      setP1GhostHp((prev) => Math.max(p1.health, prev - 15));
    }, 100);
    return () => clearTimeout(t);
  }, [p1.health]);

  useEffect(() => {
    const t = setTimeout(() => {
      setP2GhostHp((prev) => Math.max(p2.health, prev - 15));
    }, 100);
    return () => clearTimeout(t);
  }, [p2.health]);

  const p1HpPercent = Math.max(0, (p1.health / p1.maxHealth) * 100);
  const p1GhostPercent = Math.max(0, (p1GhostHp / p1.maxHealth) * 100);
  const p2HpPercent = Math.max(0, (p2.health / p2.maxHealth) * 100);
  const p2GhostPercent = Math.max(0, (p2GhostHp / p2.maxHealth) * 100);

  const p1SpecialReady = p1.energy >= p1Char.specialAbility.energyCost && p1.specialCooldownTimer <= 0;
  const p2SpecialReady = p2.energy >= p2Char.specialAbility.energyCost && p2.specialCooldownTimer <= 0;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex flex-col justify-between p-3 sm:p-5 md:p-6">
      {/* --- TOP ARCADE COMBAT HEADER --- */}
      <div className="w-full max-w-7xl mx-auto flex items-start justify-between gap-2 sm:gap-4 md:gap-6">
        {/* PLAYER 1 (LEFT SIDE) */}
        <div className="flex-1 flex items-start gap-2 sm:gap-3">
          {/* Portrait */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-arcade-red shadow-arcade-red bg-dark-900 flex-shrink-0">
            <img
              src={p1Char.portrait}
              alt={p1Char.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-center text-[9px] sm:text-[10px] font-black text-arcade-red uppercase font-cinzel tracking-wider">
              P1
            </div>
          </div>

          {/* Health & Meters Bar */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* Fighter Name & Round Medals */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="font-cinzel text-lg sm:text-2xl font-black text-white uppercase tracking-wider truncate">
                  {p1Char.name}
                </span>
                <span className="text-[10px] sm:text-xs font-rajdhani text-zinc-400 hidden sm:inline">
                  "{p1Char.nickname}"
                </span>
              </div>

              {/* Rounds Won Pips */}
              <div className="flex items-center gap-1.5">
                {[1, 2].map((r) => (
                  <div
                    key={r}
                    className={`w-3.5 h-3.5 rounded-full border border-yellow-500 transition-all ${
                      match.p1RoundsWon >= r
                        ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                        : 'bg-black/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Health Bar (Left to Right) */}
            <div className="relative w-full h-5 sm:h-6 bg-dark-950 rounded-lg overflow-hidden border border-zinc-700 shadow-inner">
              <div
                className="absolute top-0 bottom-0 left-0 bg-yellow-500/80 transition-all duration-300"
                style={{ width: `${p1GhostPercent}%` }}
              />
              <div
                className={`absolute top-0 bottom-0 left-0 transition-all duration-100 ${
                  p1HpPercent < 25
                    ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-500 animate-pulse'
                    : 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400'
                }`}
                style={{ width: `${p1HpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] sm:text-xs font-bold font-rajdhani text-white drop-shadow">
                <span>HP</span>
                <span>{Math.max(0, p1.health)} / 1000</span>
              </div>
            </div>

            {/* Secondary Meters: Energy & Stamina */}
            <div className="grid grid-cols-2 gap-2">
              {/* Energy */}
              <div className="relative h-2 sm:h-2.5 bg-dark-950 rounded overflow-hidden border border-blue-900">
                <div
                  className={`h-full transition-all duration-100 ${
                    p1SpecialReady
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${(p1.energy / p1.maxEnergy) * 100}%` }}
                />
              </div>
              {/* Stamina */}
              <div className="relative h-2 sm:h-2.5 bg-dark-950 rounded overflow-hidden border border-emerald-900">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100"
                  style={{ width: `${(p1.stamina / p1.maxStamina) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- CENTER: TIMER & ROUND INFO --- */}
        <div className="flex flex-col items-center justify-start flex-shrink-0 px-2 sm:px-4">
          <div className="font-rajdhani text-[11px] sm:text-xs font-black tracking-widest text-zinc-300 uppercase bg-dark-850 px-3 py-0.5 rounded-full border border-zinc-700 shadow-md">
            ROUND {match.currentRound}
          </div>

          <div
            className={`font-teko text-5xl sm:text-6xl md:text-7xl font-bold leading-none tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${
              match.roundTimer <= 15 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}
          >
            {match.roundTimer}
          </div>

          <button
            onClick={onTogglePause}
            className="pointer-events-auto mt-0.5 p-1.5 sm:p-2 bg-dark-850 hover:bg-dark-800 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white transition-all shadow hover:shadow-arcade-orange cursor-pointer"
            title="Pause Match (Esc)"
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* PLAYER 2 (RIGHT SIDE) */}
        <div className="flex-1 flex items-start justify-end gap-2 sm:gap-3 text-right">
          {/* Health & Meters Bar */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* Fighter Name & Round Medals */}
            <div className="flex items-center justify-between">
              {/* Rounds Won Pips */}
              <div className="flex items-center gap-1.5">
                {[1, 2].map((r) => (
                  <div
                    key={r}
                    className={`w-3.5 h-3.5 rounded-full border border-yellow-500 transition-all ${
                      match.p2RoundsWon >= r
                        ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                        : 'bg-black/80'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 truncate justify-end">
                <span className="text-[10px] sm:text-xs font-rajdhani text-zinc-400 hidden sm:inline">
                  "{p2Char.nickname}"
                </span>
                <span className="font-cinzel text-lg sm:text-2xl font-black text-white uppercase tracking-wider truncate">
                  {p2Char.name}
                </span>
              </div>
            </div>

            {/* Health Bar (Right to Left) */}
            <div className="relative w-full h-5 sm:h-6 bg-dark-950 rounded-lg overflow-hidden border border-zinc-700 shadow-inner">
              <div
                className="absolute top-0 bottom-0 right-0 bg-yellow-500/80 transition-all duration-300"
                style={{ width: `${p2GhostPercent}%` }}
              />
              <div
                className={`absolute top-0 bottom-0 right-0 transition-all duration-100 ${
                  p2HpPercent < 25
                    ? 'bg-gradient-to-l from-red-700 via-red-600 to-red-500 animate-pulse'
                    : 'bg-gradient-to-l from-red-600 via-orange-500 to-amber-400'
                }`}
                style={{ width: `${p2HpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] sm:text-xs font-bold font-rajdhani text-white drop-shadow">
                <span>{Math.max(0, p2.health)} / 1000</span>
                <span>HP</span>
              </div>
            </div>

            {/* Secondary Meters: Energy & Stamina */}
            <div className="grid grid-cols-2 gap-2">
              {/* Stamina */}
              <div className="relative h-2 sm:h-2.5 bg-dark-950 rounded overflow-hidden border border-emerald-900">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100 ml-auto"
                  style={{ width: `${(p2.stamina / p2.maxStamina) * 100}%` }}
                />
              </div>
              {/* Energy */}
              <div className="relative h-2 sm:h-2.5 bg-dark-950 rounded overflow-hidden border border-blue-900">
                <div
                  className="h-full bg-blue-600 transition-all duration-100 ml-auto"
                  style={{ width: `${(p2.energy / p2.maxEnergy) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-arcade-orange shadow-arcade-orange bg-dark-900 flex-shrink-0">
            <img
              src={p2Char.portrait}
              alt={p2Char.name}
              className="w-full h-full object-cover object-top -scale-x-100"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-center text-[9px] sm:text-[10px] font-black text-arcade-orange uppercase font-cinzel tracking-wider">
              CPU
            </div>
          </div>
        </div>
      </div>

      {/* --- CENTER BANNER NOTIFICATIONS --- */}
      {match.bannerMessage && (
        <div className="self-center my-auto transform -translate-y-4">
          <div className="text-center animate-pulse-fast">
            <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-red-500 to-amber-600 drop-shadow-[0_0_35px_rgba(229,57,53,0.9)] tracking-wider uppercase">
              {match.bannerMessage}
            </h1>
          </div>
        </div>
      )}

      {/* --- COMBO FEEDBACK POPUP --- */}
      {p1.comboCount >= 2 && p1.comboTimer > 0 && (
        <div className="absolute left-6 md:left-14 top-32 md:top-40 animate-bounce">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 px-4 py-1.5 rounded-full shadow-[0_0_20px_#e53935] text-white font-cinzel font-black text-base md:text-xl tracking-wider">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-spin" />
            <span>{p1.comboCount} HITS COMBO!</span>
          </div>
        </div>
      )}

      {/* --- DESKTOP KEYBOARD CONTROLS BAR (BOTTOM) --- */}
      <div className="hidden lg:flex items-center justify-between text-xs font-rajdhani text-zinc-300 bg-dark-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 mx-auto max-w-4xl shadow-2xl">
        <div className="flex items-center gap-4">
          <span className="text-arcade-orange font-bold uppercase tracking-wider">MOVEMENT:</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">A / D</kbd> Walk</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">W</kbd> Jump</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">S</kbd> Crouch</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">Shift</kbd> Dash</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-arcade-red font-bold uppercase tracking-wider">ATTACKS:</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">J</kbd> Light</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">K</kbd> Heavy</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">L</kbd> Kick</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold border border-zinc-700">Space</kbd> Guard</span>
          <span className="text-yellow-400 font-bold"><kbd className="px-1.5 py-0.5 bg-yellow-950 text-yellow-300 rounded font-bold border border-yellow-700">I</kbd> Special</span>
        </div>
      </div>

      {/* --- PAUSE OVERLAY MODAL --- */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50 p-4">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border-2 border-arcade-red shadow-arcade-red flex flex-col gap-5">
            <h2 className="font-cinzel text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-arcade-red via-orange-500 to-yellow-400 tracking-wider">
              SHOWDOWN PAUSED
            </h2>
            <p className="text-zinc-400 text-sm font-rajdhani">
              Take a breather. The arena is frozen in time until you resume!
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={onTogglePause}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-arcade-red to-arcade-orange hover:from-red-600 hover:to-orange-600 rounded-xl font-bold font-rajdhani tracking-wider text-white shadow-arcade-red transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>RESUME MATCH</span>
              </button>
              <button
                onClick={onRestart}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-dark-800 hover:bg-dark-700 rounded-xl font-bold font-rajdhani tracking-wider text-zinc-200 border border-zinc-700 transition-all hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>RESTART ROUND 1</span>
              </button>
              <button
                onClick={onExit}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-dark-850 hover:bg-red-950/60 rounded-xl font-bold font-rajdhani tracking-wider text-zinc-400 hover:text-red-400 border border-zinc-800 transition-all cursor-pointer"
              >
                <Home className="w-5 h-5" />
                <span>EXIT TO MAIN MENU</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
