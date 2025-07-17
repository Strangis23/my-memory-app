import { GameSize, Score } from './types';
import { Theme } from './components/ThemeSelector';

export const GAME_OPTIONS: { size: GameSize; label: string; difficulty: string }[] = [
    { size: 4, label: '4 Cards', difficulty: 'Easy'},
    { size: 12, label: '12 Cards', difficulty: 'Medium' },
    { size: 24, label: '24 Cards', difficulty: 'Hard' },
    { size: 48, label: '48 Cards', difficulty: 'Expert' },
];

export const THEMES: { name: Theme; label: string; colors: string[] }[] = [
  { name: 'clarity', label: 'Clarity', colors: ['bg-blue-600', 'bg-orange-600'] },
  { name: 'cyberpunk', label: 'Cyberpunk', colors: ['bg-cyan-300', 'bg-purple-500'] },
  { name: 'forest', label: 'Forest', colors: ['bg-green-300', 'bg-yellow-600'] },
  { name: 'sakura', label: 'Sakura', colors: ['bg-pink-400', 'bg-purple-400'] },
];

export const INITIAL_SCORES: Record<GameSize, Score[]> = { 4: [], 12: [], 24: [], 48: [] };
