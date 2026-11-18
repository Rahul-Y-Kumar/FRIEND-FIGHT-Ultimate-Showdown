import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS } from '../../data/characters';
import { Character } from '../../types/game';
import { audioManager } from '../../game/effects/AudioManager';
import { ArrowLeft, Trophy, Swords, Shield, Zap, Gauge, Dumbbell, Sparkles, UserCheck } from 'lucide-react';

export const CharacterCollection: React.FC = () => {
  const { winLossRecords, setScreen, setP1Character } = useGameStore();
  const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);

  const selectedChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];
  const record = winLossRecords[selectedChar.id] || { wins: 0, losses: 0 };
  const totalMatches = record.wins + record.losses;
  const winRate = totalMatches > 0 ? Math.round((record.wins / totalMatches) * 100) : 0;

  const handlePickForP1 = () => {
    audioManager.playHeavyPunch();
    setP1Character(selectedChar.id);
    setScreen('CHARACTER_SELECT');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080808] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(229,57,53,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full mb-6">
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
            FRIEND <span className="text-arcade-red">ROSTER</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-zinc-400">
            FIGHTER ARCHIVES, ABILITIES & COMBAT HISTORIES
          </p>
        </div>

        <div className="w-20" />
      </header>

      {/* --- CONTENT LAYOUT --- */}
      <main className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start flex-1 my-auto">
        {/* Left Character Scrollable List */}
        <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-2 max-h-[70vh] overflow-y-auto shadow-xl">
          <span className="text-xs font-bold font-rajdhani text-zinc-400 uppercase tracking-widest px-2 mb-1">
            ALL FIGHTERS ({CHARACTERS.length})
          </span>

          {CHARACTERS.map((char) => {
            const isSelected = char.id === selectedId;
            const charRecord = winLossRecords[char.id] || { wins: 0, losses: 0 };

            return (
              <div
                key={char.id}
                onClick={() => {
                  audioManager.playLightPunch();
                  setSelectedId(char.id);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-dark-800 border-arcade-red shadow-[0_0_15px_rgba(229,57,53,0.4)]'
                    : 'bg-dark-900/60 border-zinc-800 hover:bg-dark-850 hover:border-zinc-700'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/60 border border-zinc-700 flex-shrink-0">
                  <img
                    src={char.portrait}
                    alt={char.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-cinzel font-black text-sm text-white truncate">
                    {char.name}
                  </h4>
                  <p className="text-[10px] font-rajdhani text-arcade-orange font-bold uppercase truncate">
                    "{char.nickname}"
                  </p>
                </div>
                <div className="text-right text-[11px] font-rajdhani text-zinc-400">
                  <span className="text-emerald-400 font-bold">{charRecord.wins}W</span>
                  <span className="text-zinc-600"> / </span>
                  <span className="text-red-400 font-bold">{charRecord.losses}L</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Fighter Dossier Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col gap-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
            {/* Cutout Frame */}
            <div className="relative h-72 w-full bg-dark-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center p-4">
              <img
                src={selectedChar.fighterImage}
                alt={selectedChar.name}
                className="max-h-64 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-white">
                  {selectedChar.name}
                </h2>
                <span className="px-3 py-1 bg-dark-850 border border-arcade-orange/60 rounded-full text-xs font-rajdhani font-bold text-arcade-orange uppercase tracking-wider">
                  {selectedChar.personality} STYLE
                </span>
              </div>
              <p className="font-rajdhani text-base font-bold text-arcade-red">
                "{selectedChar.nickname}"
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-1 font-rajdhani">
                {selectedChar.bio}
              </p>

              {/* Record Summary */}
              <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div className="bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-bold font-rajdhani block uppercase">VICTORIES</span>
                  <span className="font-teko text-2xl font-bold text-emerald-400 leading-none">
                    {record.wins}
                  </span>
                </div>
                <div className="bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-bold font-rajdhani block uppercase">DEFEATS</span>
                  <span className="font-teko text-2xl font-bold text-red-400 leading-none">{record.losses}</span>
                </div>
                <div className="bg-dark-900/90 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-bold font-rajdhani block uppercase">WIN RATE</span>
                  <span className="font-teko text-2xl font-bold text-yellow-400 leading-none">{winRate}%</span>
                </div>
              </div>

              {/* Select for P1 Button */}
              <button
                onClick={handlePickForP1}
                className="mt-3 py-2.5 px-6 bg-gradient-to-r from-arcade-red to-arcade-orange hover:from-red-600 hover:to-orange-500 text-white font-cinzel font-black text-xs rounded-xl shadow-arcade-red transition-all flex items-center justify-center gap-2 cursor-pointer w-fit"
              >
                <UserCheck className="w-4 h-4" />
                <span>CHOOSE AS MY FIGHTER</span>
              </button>
            </div>
          </div>

          {/* Special Ability & Signature Quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            {/* Special Ability */}
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-yellow-400 font-bold text-sm mb-1 font-rajdhani">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    SPECIAL: {selectedChar.specialAbility.name}
                  </span>
                  <span className="text-xs bg-yellow-950 px-2 py-0.5 rounded border border-yellow-700">
                    {selectedChar.specialAbility.damage} DMG
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-rajdhani">
                  {selectedChar.specialAbility.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-rajdhani">
                <span>COST: {selectedChar.specialAbility.energyCost} ENERGY</span>
                <span>COOLDOWN: {selectedChar.specialAbility.cooldown}S</span>
              </div>
            </div>

            {/* Voice Lines */}
            <div className="bg-dark-900/90 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2 text-xs font-rajdhani">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">
                SIGNATURE QUOTES
              </span>
              <div>
                <span className="text-zinc-400 font-bold">Intro: </span>
                <span className="text-zinc-300 italic">"{selectedChar.voiceLines.intro}"</span>
              </div>
              <div>
                <span className="text-zinc-400 font-bold">Victory: </span>
                <span className="text-yellow-400 italic">"{selectedChar.voiceLines.victory}"</span>
              </div>
              <div>
                <span className="text-zinc-400 font-bold">Defeat: </span>
                <span className="text-zinc-400 italic">"{selectedChar.voiceLines.defeat}"</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
