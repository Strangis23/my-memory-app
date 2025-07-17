import React, { useState, useEffect, useCallback } from 'react';
import { CardData, GameSize } from '../types';
import Card from './Card';
import { shuffleArray } from '../utils/shuffle';

interface GameBoardProps {
  images: string[];
  gameSize: GameSize;
  onGameFinish: (flips: number) => void;
  onPlayAgain: () => void;
  gameState: 'playing' | 'finished';
  lastScore: number | null;
}

const createShuffledCards = (images: string[]): CardData[] => {
  const cardPairs = [...images, ...images].map((imageSrc, index) => ({
    id: index,
    imageId: `${imageSrc}-${index % images.length}`,
    imageSrc,
    isFlipped: false,
    isMatched: false,
  }));
  return shuffleArray(cardPairs);
};

const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75v11.25l-2.25-2.25-2.25 2.25V3.75m12 15.75h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25-2.25z" />
    </svg>
);

const Confetti: React.FC = () => (
  <>
    {Array.from({ length: 50 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${-20 - Math.random() * 80}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
      };
      return <div key={i} className="absolute w-2 h-4" style={style}></div>;
    })}
    <style>{`
      @keyframes fall {
        to {
          transform: translateY(120vh) rotate(720deg);
        }
      }
      .absolute { animation: fall ease-in forwards; }
    `}</style>
  </>
);


const WinModal: React.FC<{ score: number; onPlayAgain: () => void }> = ({ score, onPlayAgain }) => (
    <div className="fixed inset-0 bg-[rgba(var(--color-surface),0.8)] backdrop-blur-md flex items-center justify-center z-50 overflow-hidden">
        <Confetti />
        <div className="relative bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-8 rounded-2xl text-center shadow-[var(--shadow-xl)] max-w-sm w-full animate-popup">
            <TrophyIcon className="w-24 h-24 text-[rgb(var(--color-trophy-gold))] mx-auto -mt-20 mb-4 bg-[rgb(var(--color-surface))] p-4 rounded-full shadow-[var(--shadow-lg)]"/>
            <h2 className="text-4xl font-bold text-[rgb(var(--color-text-accent))] font-orbitron">You Won!</h2>
            <p className="text-[rgb(var(--color-text-base))] text-lg mt-4">Your final score is:</p>
            <p className="text-6xl font-bold text-[rgb(var(--color-text-base))] my-4 font-orbitron">{score}</p>
            <p className="text-[rgb(var(--color-text-muted))] text-sm mb-8">Lower is better!</p>
            <button
                onClick={onPlayAgain}
                className="w-full px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-button-text))] hover:bg-[rgb(var(--color-primary-focus))] hover:shadow-[var(--shadow-lg)]">
                Play Again
            </button>
        </div>
        <style>{`
            @keyframes popup {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-popup { animation: popup 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        `}</style>
    </div>
);

const getGridStyles = (size: GameSize) => {
    switch (size) {
        case 4: return { container: 'max-w-xs', grid: 'grid-cols-2' };
        case 12: return { container: 'max-w-2xl', grid: 'grid-cols-4' };
        case 24: return { container: 'max-w-4xl', grid: 'grid-cols-6' };
        case 48: return { container: 'max-w-7xl', grid: 'grid-cols-8' };
        default: return { container: 'max-w-2xl', grid: 'grid-cols-4' };
    }
}

const GameBoard: React.FC<GameBoardProps> = ({ images, gameSize, onGameFinish, onPlayAgain, gameState, lastScore }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flips, setFlips] = useState(0);
  const [flippedCards, setFlippedCards] = useState<CardData[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setFlips(0);
    setCards(createShuffledCards(images));
  }, [images]);

  const handleCardClick = (clickedCard: CardData) => {
    if (isChecking || clickedCard.isFlipped || flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // Flip the card immediately
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setFlips(prev => prev + 1);
      
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.imageId === secondCard.imageId) {
        // Match
        setCards(prevCards =>
          prevCards.map(card =>
            card.imageId === firstCard.imageId ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };
  
  const checkWinCondition = useCallback(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      onGameFinish(flips);
    }
  }, [cards, flips, onGameFinish]);

  useEffect(() => {
    if (!isChecking) {
        checkWinCondition();
    }
  }, [isChecking, checkWinCondition]);

  const gridStyles = getGridStyles(gameSize);

  return (
    <div className={`relative bg-[rgb(var(--color-surface))] p-4 sm:p-6 md:p-8 rounded-2xl border border-[rgb(var(--color-border))] shadow-[var(--shadow-xl)] w-full ${gridStyles.container}`}>
      <div className="flex justify-between items-center mb-6">
        <div 
            className="font-orbitron text-xl sm:text-2xl text-[rgb(var(--color-text-muted))]"
            aria-live="polite"
            aria-atomic="true"
        >
          Moves: <span className="text-[rgb(var(--color-text-base))] font-bold w-12 inline-block text-center">{flips}</span>
        </div>
        <button onClick={onPlayAgain} className="px-4 py-2 font-semibold rounded-lg transition-colors bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-button-text))] hover:bg-[rgb(var(--color-secondary-focus))] hover:shadow-[var(--shadow-md)]">
          New Game
        </button>
      </div>

      <div
        role="grid"
        aria-label={`Memory game board with ${gameSize} cards`}
        className={`grid gap-2 sm:gap-4 ${gridStyles.grid}`}
      >
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      
      {gameState === 'finished' && lastScore !== null && (
         <WinModal score={lastScore} onPlayAgain={onPlayAgain} />
      )}
    </div>
  );
};

export default React.memo(GameBoard);