
import React, { useState, useEffect, useCallback } from 'react';
import { Score, GameSize } from './types.ts';
import ImageManager from './components/ImageManager.tsx';
import GameBoard from './components/GameBoard.tsx';
import { Theme } from './components/ThemeSelector.tsx';
import OptionsMenu from './components/OptionsMenu.tsx';
import useLocalStorage from './hooks/useLocalStorage.ts';
import { INITIAL_SCORES } from './constants.ts';

type GameState = 'setup' | 'playing' | 'finished';

const GearIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Header: React.FC<{ onOpenOptions: () => void }> = ({ onOpenOptions }) => (
  <header className="py-4 bg-[rgba(var(--color-surface),0.8)] backdrop-blur-sm border-b border-[rgb(var(--color-border))] sticky top-0 z-20 shadow-[var(--shadow-md)]">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[rgb(var(--color-text-accent))] font-orbitron tracking-wide">
          Memory of Memories
        </h1>
        <button 
            onClick={onOpenOptions} 
            className="p-2 rounded-full text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text-base))] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface))] focus:ring-[rgb(var(--color-primary-focus))]"
            aria-label="Open settings menu"
        >
            <GearIcon className="w-6 h-6"/>
        </button>
    </div>
  </header>
);
const MemoizedHeader = React.memo(Header);

const App: React.FC = () => {
  const [theme, setThemeState] = useLocalStorage<Theme>('memory-game-theme', 'clarity');
  const [gameState, setGameState] = useState<GameState>('setup');
  const [uploadedImages, setUploadedImages] = useLocalStorage<string[]>('memory-game-images', []);
  const [gameImages, setGameImages] = useState<string[]>([]);
  const [gameSize, setGameSize] = useState<GameSize>(12);
  const [scores, setScores] = useLocalStorage<Record<GameSize, Score[]>>('memory-of-memories-scores', INITIAL_SCORES);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, [setThemeState]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleImagesUploaded = useCallback((newImages: string[]) => {
    setUploadedImages(prev => [...prev, ...newImages]);
  }, [setUploadedImages]);

  const handleStartGame = useCallback((selectedImages: string[], size: GameSize) => {
    setGameImages(selectedImages);
    setGameSize(size);
    setGameState('playing');
    setLastScore(null);
  }, []);

  const handleGameFinish = useCallback((flips: number) => {
    setGameState('finished');
    setLastScore(flips);
    const newScore: Score = { date: new Date().toISOString(), flips, gameSize };
    
    setScores(prevScores => {
      const updatedScoresForSize = [...(prevScores[gameSize] || []), newScore]
        .sort((a, b) => a.flips - b.flips)
        .slice(0, 10); // Keep top 10 scores
      
      const newScores = {
        ...prevScores,
        [gameSize]: updatedScoresForSize,
      };
      
      return newScores;
    });
  }, [gameSize, setScores]);

  const handlePlayAgain = useCallback(() => {
    setGameState('setup');
    setGameImages([]);
  }, []);

  const handleRemoveAllPhotos = useCallback(() => {
    setUploadedImages([]);
  }, [setUploadedImages]);

  const handleResetAllScores = useCallback(() => {
    setScores(INITIAL_SCORES);
  }, [setScores]);

  const openOptions = useCallback(() => setIsOptionsOpen(true), []);
  const closeOptions = useCallback(() => setIsOptionsOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[rgb(var(--color-primary))] selection:text-[rgb(var(--color-button-text))]">
      <MemoizedHeader onOpenOptions={openOptions} />
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {gameState === 'setup' ? (
          <ImageManager
            uploadedImages={uploadedImages}
            onImagesUploaded={handleImagesUploaded}
            onStartGame={handleStartGame}
            scores={scores}
          />
        ) : (
          <div className="flex justify-center">
            <GameBoard
              images={gameImages}
              gameSize={gameSize}
              onGameFinish={handleGameFinish}
              onPlayAgain={handlePlayAgain}
              gameState={gameState}
              lastScore={lastScore}
            />
          </div>
        )}
      </main>

      {/* Ad Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex items-center justify-center bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg min-h-[100px] text-center text-[rgb(var(--color-text-muted))] shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold tracking-wider uppercase">Advertisement</p>
        </div>
      </div>

      <footer className="text-center py-4 text-[rgb(var(--color-text-muted))] text-sm">
        <p>Created by a World-Class Senior Frontend Engineer</p>
      </footer>

      <OptionsMenu
        isOpen={isOptionsOpen}
        onClose={closeOptions}
        currentTheme={theme}
        setTheme={setTheme}
        onRemoveAllPhotos={handleRemoveAllPhotos}
        onResetAllScores={handleResetAllScores}
      />
    </div>
  );
};

export default App;
