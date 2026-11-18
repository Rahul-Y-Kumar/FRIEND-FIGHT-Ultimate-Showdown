import React from 'react';
import { InputCommands, InputController } from '../../game/input/InputController';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shield, Flame, Wind } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  inputController: InputController;
}

export const MobileControls: React.FC<Props> = ({ inputController }) => {
  const forceShow = useSettingsStore((s) => s.mobileControlsAlways);

  const bindButton = (action: keyof InputCommands) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        inputController.setVirtualInput(action, true);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
        inputController.setVirtualInput(action, false);
      },
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        inputController.setVirtualInput(action, true);
      },
      onMouseUp: (e: React.MouseEvent) => {
        e.preventDefault();
        inputController.setVirtualInput(action, false);
      },
      onMouseLeave: () => {
        inputController.setVirtualInput(action, false);
      },
    };
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-4 px-3 sm:px-6 pointer-events-none z-30 select-none ${
        forceShow ? 'flex' : 'flex lg:hidden'
      } justify-between items-end`}
    >
      {/* --- LEFT D-PAD / DIRECTIONAL CONTROLS --- */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-dark-950/70 backdrop-blur-md p-2.5 rounded-3xl border border-white/10 shadow-2xl">
        {/* UP (JUMP) */}
        <button
          {...bindButton('jump')}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-dark-800/90 active:bg-dark-700 active:scale-95 text-zinc-200 rounded-2xl border border-zinc-700 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* LEFT / CROUCH / RIGHT ROW */}
        <div className="flex items-center gap-1.5">
          <button
            {...bindButton('left')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-dark-800/90 active:bg-dark-700 active:scale-95 text-zinc-200 rounded-2xl border border-zinc-700 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            {...bindButton('crouch')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-dark-800/90 active:bg-dark-700 active:scale-95 text-zinc-200 rounded-2xl border border-zinc-700 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          <button
            {...bindButton('right')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-dark-800/90 active:bg-dark-700 active:scale-95 text-zinc-200 rounded-2xl border border-zinc-700 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* DASH BUTTON */}
        <button
          {...bindButton('dash')}
          className="w-full py-1.5 bg-dark-800/90 active:bg-dark-700 active:scale-95 text-zinc-300 text-xs font-bold font-rajdhani rounded-xl border border-zinc-700 flex items-center justify-center gap-1 shadow transition-transform cursor-pointer"
        >
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>DASH</span>
        </button>
      </div>

      {/* --- RIGHT ACTION & ATTACK BUTTONS --- */}
      <div className="pointer-events-auto flex flex-col gap-2 bg-dark-950/70 backdrop-blur-md p-2.5 rounded-3xl border border-white/10 shadow-2xl">
        {/* TOP ROW: SPECIAL & BLOCK */}
        <div className="flex items-center gap-2 justify-end">
          <button
            {...bindButton('special')}
            className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-amber-600 active:scale-95 text-white font-black text-xs rounded-full border-2 border-yellow-300 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] transition-transform cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-yellow-200" />
            <span className="text-[9px] font-rajdhani font-black">SPECIAL</span>
          </button>

          <button
            {...bindButton('block')}
            className="w-13 h-13 bg-blue-900/90 active:bg-blue-800 active:scale-95 text-blue-200 font-bold text-xs rounded-full border border-blue-400 flex flex-col items-center justify-center shadow transition-transform cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9px] font-rajdhani font-bold">GUARD</span>
          </button>
        </div>

        {/* MAIN ATTACK BUTTONS: LIGHT, HEAVY, KICK */}
        <div className="grid grid-cols-3 gap-2">
          <button
            {...bindButton('lightPunch')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-red-700 active:bg-red-600 active:scale-95 text-white font-black text-sm rounded-2xl border border-red-500 flex flex-col items-center justify-center shadow transition-transform cursor-pointer"
          >
            <span className="font-cinzel">LP</span>
            <span className="text-[8px] font-normal opacity-80">Light</span>
          </button>

          <button
            {...bindButton('heavyPunch')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-red-900 active:bg-red-800 active:scale-95 text-red-200 font-black text-sm rounded-2xl border border-red-600 flex flex-col items-center justify-center shadow transition-transform cursor-pointer"
          >
            <span className="font-cinzel">HP</span>
            <span className="text-[8px] font-normal opacity-80">Heavy</span>
          </button>

          <button
            {...bindButton('kick')}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-orange-700 active:bg-orange-600 active:scale-95 text-white font-black text-sm rounded-2xl border border-orange-500 flex flex-col items-center justify-center shadow transition-transform cursor-pointer"
          >
            <span className="font-cinzel">KICK</span>
            <span className="text-[8px] font-normal opacity-80">High</span>
          </button>
        </div>
      </div>
    </div>
  );
};
