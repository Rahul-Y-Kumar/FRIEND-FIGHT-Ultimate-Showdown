import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS, getCharacterById } from '../../data/characters';
import { Character } from '../../types/game';
import { audioManager } from '../../game/effects/AudioManager';
import { ArrowLeft, Dices, Swords, CheckCircle2, Sparkles, Shield, Gauge, Dumbbell, Zap, User, Bot } from 'lucide-react';

export const CharacterSelect: React.FC = () => {
  const { p1CharacterId, p2CharacterId, setP1Character, setP2Character, setScreen } = useGameStore();

  // Active selection slot: 'p1' or 'p2'
  const [activeSlot, setActiveSlot] = useState<'p1' | 'p2'>('p1');
  const [hoveredId, setHoveredId] = useState<string>(p1CharacterId);

  const p1 = getCharacterById(p1CharacterId);
  const p2 = getCharacterById(p2CharacterId);
  const activeChar = activeSlot === 'p1' ? p1 : p2;
  const hoveredChar = getCharacterById(hoveredId);

  const handleSelect = (char: Character) => {
    audioManager.playLightPunch();
    if (activeSlot === 'p1') {
      setP1Character(char.id);
      // Auto toggle to picking P2 if P2 is currently the same
      if (char.id === p2CharacterId) {
        const other = CHARACTERS.find((c) => c.id !== char.id);
        if (other) setP2Character(other.id);
      }
      setActiveSlot('p2');
    } else {
      setP2Character(char.id);
    }
  };

  const handleRandomize = () => {
    audioManager.playKick();
    const available = CHARACTERS.filter((c) => (activeSlot === 'p1' ? c.id !== p2CharacterId : c.id !== p1CharacterId));
    const randomPick = available[Math.floor(Math.random() * available.length)] || CHARACTERS[0];
    if (activeSlot === 'p1') {
      setP1Character(randomPick.id);
    } else {
      setP2Character(randomPick.id);
    }
    setHoveredId(randomPick.id);
  };

  const handleConfirm = () => {
    audioManager.playSpecialAttack();
    setScreen('ARENA_SELECT');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(229,57,53,0.15)_0%,rgba(8,8,8,0.98)_70%)] pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full mb-4">
        <button
          onClick={() => {
            audioManager.playLightPunch();
            setScreen('MAIN_MENU');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-850 hover:bg-dark-800 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs sm:text-sm font-rajdhani font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>MAIN MENU</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">
            CHARACTER <span className="text-arcade-red">SELECTION</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-rajdhani text-zinc-400">SELECTING:</span>
            <span
              className={`text-xs font-rajdhani font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                activeSlot === 'p1'
                  ? 'bg-arcade-red/20 text-arcade-red border border-arcade-red/50 animate-pulse'
                  : 'bg-arcade-orange/20 text-arcade-orange border border-arcade-orange/50 animate-pulse'
              }`}
            >
              {activeSlot === 'p1' ? 'PLAYER 1 (HUMAN)' : 'PLAYER 2 (CPU OPPONENT)'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 px-4 py-2 bg-dark-850 hover:bg-dark-800 border border-yellow-600/60 rounded-xl text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm font-rajdhani font-bold transition-all cursor-pointer shadow-sm"
          title="Pick Random Character"
        >
          <Dices className="w-4 h-4" />
          <span className="hidden sm:inline">RANDOM</span>
        </button>
      </header>

      {/* --- CENTER SECTION: TWO FIGHTER SHOWCASES & DETAILS --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-2">
        {/* PLAYER 1 CARD */}
        <div
          onClick={() => setActiveSlot('p1')}
          className={`glass-panel p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeSlot === 'p1'
              ? 'border-arcade-red shadow-[0_0_25px_rgba(229,57,53,0.4)] bg-dark-850/90'
              : 'border-zinc-800/80 hover:border-zinc-700 bg-dark-900/60'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-arcade-red" />
              <span className="font-cinzel font-black text-sm text-arcade-red tracking-wider">
                PLAYER 1 (YOU)
              </span>
            </div>
            {activeSlot === 'p1' && (
              <span className="px-2 py-0.5 bg-arcade-red text-white text-[10px] font-bold rounded-full font-rajdhani uppercase tracking-wider">
                CHOOSING NOW
              </span>
            )}
          </div>

          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center my-3">
            {/* Portrait Frame */}
            <div className="relative h-44 sm:h-52 bg-dark-950 rounded-xl overflow-hidden border border-arcade-red/40 flex items-center justify-center">
              <img
                src={p1.fighterImage}
                alt={p1.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              />
              <div className="absolute bottom-1 inset-x-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-center text-[10px] font-bold font-rajdhani text-zinc-300">
                {p1.personality}
              </div>
            </div>

            {/* Stats & Special */}
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-cinzel text-2xl font-black text-white">{p1.name}</h3>
                <p className="text-xs font-rajdhani font-bold text-arcade-red uppercase">
                  "{p1.nickname}"
                </p>
              </div>

              {/* Stats Bars */}
              <div className="flex flex-col gap-1.5 text-[11px] font-rajdhani text-zinc-300">
                <StatBar label="PWR" value={p1.strength} color="bg-red-500" />
                <StatBar label="SPD" value={p1.speed} color="bg-yellow-500" />
                <StatBar label="DEF" value={p1.defense} color="bg-blue-500" />
                <StatBar label="STA" value={p1.stamina} color="bg-emerald-500" />
              </div>

              {/* Special Ability Pill */}
              <div className="bg-dark-900/90 p-2 rounded-lg border border-zinc-800 text-[11px]">
                <div className="flex items-center justify-between font-bold text-yellow-400">
                  <span className="truncate">⚡ {p1.specialAbility.name}</span>
                  <span className="text-[10px]">{p1.specialAbility.damage} DMG</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-rajdhani text-zinc-400 italic truncate border-t border-white/5 pt-2">
            "{p1.voiceLines.intro}"
          </div>
        </div>

        {/* PLAYER 2 (CPU) CARD */}
        <div
          onClick={() => setActiveSlot('p2')}
          className={`glass-panel p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeSlot === 'p2'
              ? 'border-arcade-orange shadow-[0_0_25px_rgba(255,133,51,0.4)] bg-dark-850/90'
              : 'border-zinc-800/80 hover:border-zinc-700 bg-dark-900/60'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-arcade-orange" />
              <span className="font-cinzel font-black text-sm text-arcade-orange tracking-wider">
                PLAYER 2 (CPU)
              </span>
            </div>
            {activeSlot === 'p2' && (
              <span className="px-2 py-0.5 bg-arcade-orange text-white text-[10px] font-bold rounded-full font-rajdhani uppercase tracking-wider">
                CHOOSING NOW
              </span>
            )}
          </div>

          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 items-center my-3">
            {/* Portrait Frame */}
            <div className="relative h-44 sm:h-52 bg-dark-950 rounded-xl overflow-hidden border border-arcade-orange/40 flex items-center justify-center">
              <img
                src={p2.fighterImage}
                alt={p2.name}
                className="max-h-full max-w-full object-contain -scale-x-100 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              />
              <div className="absolute bottom-1 inset-x-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-center text-[10px] font-bold font-rajdhani text-zinc-300">
                {p2.personality}
              </div>
            </div>

            {/* Stats & Special */}
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-cinzel text-2xl font-black text-white">{p2.name}</h3>
                <p className="text-xs font-rajdhani font-bold text-arcade-orange uppercase">
                  "{p2.nickname}"
                </p>
              </div>

              {/* Stats Bars */}
              <div className="flex flex-col gap-1.5 text-[11px] font-rajdhani text-zinc-300">
                <StatBar label="PWR" value={p2.strength} color="bg-red-500" />
                <StatBar label="SPD" value={p2.speed} color="bg-yellow-500" />
                <StatBar label="DEF" value={p2.defense} color="bg-blue-500" />
                <StatBar label="STA" value={p2.stamina} color="bg-emerald-500" />
              </div>

              {/* Special Ability Pill */}
              <div className="bg-dark-900/90 p-2 rounded-lg border border-zinc-800 text-[11px]">
                <div className="flex items-center justify-between font-bold text-yellow-400">
                  <span className="truncate">⚡ {p2.specialAbility.name}</span>
                  <span className="text-[10px]">{p2.specialAbility.damage} DMG</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-rajdhani text-zinc-400 italic truncate border-t border-white/5 pt-2">
            "{p2.voiceLines.intro}"
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: 7 CHARACTER CARDS ROSTER & CONFIRMATION --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-4 mt-2">
        {/* Roster Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
          {CHARACTERS.map((char) => {
            const isP1 = p1CharacterId === char.id;
            const isP2 = p2CharacterId === char.id;

            return (
              <div
                key={char.id}
                onClick={() => handleSelect(char)}
                onMouseEnter={() => setHoveredId(char.id)}
                className={`relative rounded-xl overflow-hidden cursor-pointer p-2 bg-dark-900/90 border-2 transition-all transform hover:-translate-y-1 ${
                  isP1
                    ? 'border-arcade-red shadow-[0_0_15px_rgba(229,57,53,0.6)] bg-dark-850'
                    : isP2
                    ? 'border-arcade-orange shadow-[0_0_15px_rgba(255,133,51,0.6)] bg-dark-850'
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {/* Active Badges */}
                <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-0.5">
                  {isP1 && (
                    <span className="px-1.5 py-0.2 bg-arcade-red text-white text-[9px] font-black rounded font-cinzel">
                      P1
                    </span>
                  )}
                  {isP2 && (
                    <span className="px-1.5 py-0.2 bg-arcade-orange text-white text-[9px] font-black rounded font-cinzel">
                      CPU
                    </span>
                  )}
                </div>

                <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                  <img
                    src={char.portrait}
                    alt={char.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="mt-1.5 text-center">
                  <h4 className="font-cinzel font-bold text-xs text-white truncate">
                    {char.name}
                  </h4>
                  <p className="text-[9px] font-rajdhani text-zinc-400 truncate">
                    {char.nickname}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation & Arena Navigation Bar */}
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-rajdhani">
            <span className="text-zinc-400">SELECTED MATCHUP:</span>
            <span className="font-bold text-arcade-red">{p1.name} (P1)</span>
            <span className="text-zinc-600 font-bold">VS</span>
            <span className="font-bold text-arcade-orange">{p2.name} (CPU)</span>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-arcade-red via-red-600 to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white font-cinzel font-black text-sm sm:text-base rounded-xl shadow-arcade-red transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO ARENA</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-[10px] font-bold text-zinc-400">{label}</span>
      <div className="flex-1 h-1.5 bg-dark-950 rounded-full overflow-hidden border border-zinc-800">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-5 text-right font-bold text-zinc-400 text-[10px]">{value}</span>
    </div>
  );
};
