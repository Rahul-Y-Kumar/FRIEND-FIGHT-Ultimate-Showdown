import React from 'react';
import { useGameStore } from '../store/gameStore';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { CharacterSelect } from '../components/CharacterSelect/CharacterSelect';
import { CharacterCollection } from '../components/CharacterCollection/CharacterCollection';
import { ArenaSelect } from '../components/ArenaSelect/ArenaSelect';
import { FightPreparation } from '../components/FightPreparation/FightPreparation';
import { FightingScreen } from '../components/FightingScreen/FightingScreen';
import { ResultsScreen } from '../components/ResultsScreen/ResultsScreen';
import { SettingsPanel } from '../components/SettingsPanel/SettingsPanel';
import { HowToPlay } from '../components/HowToPlay/HowToPlay';

export const App: React.FC = () => {
  const currentScreen = useGameStore((s) => s.currentScreen);

  switch (currentScreen) {
    case 'MAIN_MENU':
      return <MainMenu />;
    case 'CHARACTER_SELECT':
      return <CharacterSelect />;
    case 'CHARACTER_COLLECTION':
      return <CharacterCollection />;
    case 'ARENA_SELECT':
      return <ArenaSelect />;
    case 'FIGHT_PREPARATION':
      return <FightPreparation />;
    case 'FIGHTING':
      return <FightingScreen />;
    case 'MATCH_RESULTS':
      return <ResultsScreen />;
    case 'SETTINGS':
      return <SettingsPanel />;
    case 'HOW_TO_PLAY':
      return <HowToPlay />;
    default:
      return <MainMenu />;
  }
};
