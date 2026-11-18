import { create } from 'zustand';
import { Screen } from '../types/game';
import { MatchSnapshot } from '../game/match/MatchManager';

interface GameStore {
  currentScreen: Screen;
  p1CharacterId: string;
  p2CharacterId: string;
  arenaId: string;
  lastMatch: MatchSnapshot | null;
  winLossRecords: Record<string, { wins: number; losses: number }>;

  setScreen: (s: Screen) => void;
  setP1Character: (id: string) => void;
  setP2Character: (id: string) => void;
  setArena: (id: string) => void;
  recordMatchResult: (match: MatchSnapshot) => void;
}

const STATS_KEY = 'friend_fight_stats_v1';

function loadWinLoss(): Record<string, { wins: number; losses: number }> {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScreen: 'MAIN_MENU',
  p1CharacterId: 'rahuuu',
  p2CharacterId: 'likithuuu',
  arenaId: 'dojo',
  lastMatch: null,
  winLossRecords: loadWinLoss(),

  setScreen: (s: Screen) => set({ currentScreen: s }),
  setP1Character: (id: string) => set({ p1CharacterId: id }),
  setP2Character: (id: string) => set({ p2CharacterId: id }),
  setArena: (id: string) => set({ arenaId: id }),

  recordMatchResult: (match: MatchSnapshot) => {
    const { p1CharacterId, p2CharacterId, winLossRecords } = get();
    const records = { ...winLossRecords };

    if (!records[p1CharacterId]) records[p1CharacterId] = { wins: 0, losses: 0 };
    if (!records[p2CharacterId]) records[p2CharacterId] = { wins: 0, losses: 0 };

    if (match.matchWinner === 'p1') {
      records[p1CharacterId].wins++;
      records[p2CharacterId].losses++;
    } else if (match.matchWinner === 'p2') {
      records[p2CharacterId].wins++;
      records[p1CharacterId].losses++;
    }

    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }

    set({ lastMatch: match, winLossRecords: records, currentScreen: 'MATCH_RESULTS' });
  },
}));
