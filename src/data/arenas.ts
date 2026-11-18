import { Arena } from '../types/game';

export const ARENAS: Arena[] = [
  {
    id: 'dojo',
    name: 'The Grand Dojo',
    subtitle: 'Ancient Hall of Discipline',
    description: 'Traditional tatami and mahogany flooring surrounded by hanging paper lanterns and falling sakura blossoms in a warm golden twilight.',
    theme: 'dojo',
    bgColor: '#160d08',
    ambientColor: '#ffaa66',
    lightIntensity: 1.2,
    accentColor: '#FF8533',
  },
  {
    id: 'rooftop',
    name: 'Rooftop Rumble',
    subtitle: 'Skyscraper Helipad at Dusk',
    description: 'Perched high above a neon metropolis during a fiery purple-orange sunset with dramatic city silhouettes and evening breeze.',
    theme: 'rooftop',
    bgColor: '#0c0714',
    ambientColor: '#a855f7',
    lightIntensity: 1.1,
    accentColor: '#E53935',
  },
  {
    id: 'neon',
    name: 'Neon Underground',
    subtitle: 'Cyberpunk Sub-Level 9',
    description: 'An illicit sub-city battle ring lined with pulsing neon red holograms, streaming data cables, and electric underground ambiance.',
    theme: 'neon',
    bgColor: '#050a12',
    ambientColor: '#00F0FF',
    lightIntensity: 1.3,
    accentColor: '#00F0FF',
  },
];

export function getArenaById(id: string): Arena {
  const found = ARENAS.find((a) => a.id === id);
  return found || ARENAS[0];
}
