import { create } from 'zustand';
import { GameSettings, AIDifficulty, AIPersonality } from '../types/game';
import { audioManager } from '../game/effects/AudioManager';

interface SettingsStore extends GameSettings {
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setDifficulty: (d: AIDifficulty) => void;
  setAiPersonality: (p: AIPersonality | 'CHARACTER_DEFAULT') => void;
  setGraphicsQuality: (g: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  setScreenShake: (s: boolean) => void;
  setReducedMotion: (r: boolean) => void;
  setMobileControlsAlways: (m: boolean) => void;
}

const STORAGE_KEY = 'friend_fight_settings_v1';

function loadInitialSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    musicVolume: 0.5,
    sfxVolume: 0.8,
    difficulty: 'MEDIUM',
    aiPersonality: 'CHARACTER_DEFAULT',
    graphicsQuality: 'HIGH',
    screenShake: true,
    reducedMotion: false,
    mobileControlsAlways: false,
  };
}

const initial = loadInitialSettings();
audioManager.setVolumes(initial.sfxVolume, initial.musicVolume);

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initial,

  setMusicVolume: (v: number) => {
    set({ musicVolume: v });
    audioManager.setVolumes(get().sfxVolume, v);
    saveSettings(get());
  },

  setSfxVolume: (v: number) => {
    set({ sfxVolume: v });
    audioManager.setVolumes(v, get().musicVolume);
    saveSettings(get());
  },

  setDifficulty: (d: AIDifficulty) => {
    set({ difficulty: d });
    saveSettings(get());
  },

  setAiPersonality: (p: AIPersonality | 'CHARACTER_DEFAULT') => {
    set({ aiPersonality: p });
    saveSettings(get());
  },

  setGraphicsQuality: (g: 'LOW' | 'MEDIUM' | 'HIGH') => {
    set({ graphicsQuality: g });
    saveSettings(get());
  },

  setScreenShake: (s: boolean) => {
    set({ screenShake: s });
    saveSettings(get());
  },

  setReducedMotion: (r: boolean) => {
    set({ reducedMotion: r });
    saveSettings(get());
  },

  setMobileControlsAlways: (m: boolean) => {
    set({ mobileControlsAlways: m });
    saveSettings(get());
  },
}));

function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
