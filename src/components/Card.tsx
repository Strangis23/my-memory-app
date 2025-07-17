import React from 'react';
import { CardData } from '../types';

interface CardProps {
  card: CardData;
  onClick: () => void;
}

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const isFlippable = !card.isFlipped && !card.isMatched;

  const getAriaLabel = () => {
    if (card.isMatched) return 'Matched card';
    if (card.isFlipped) return 'Flipped card';
    return 'Face down card';
  };

  return (
    <div 
      className="aspect-square [perspective:1000px] group" 
      onClick={isFlippable ? onClick : undefined}
      role="gridcell"
      aria-label={getAriaLabel()}
      aria-disabled={!isFlippable}
    >
      <div
        className={`relative w-full h-full rounded-xl shadow-[var(--shadow-md)] [transform-style:preserve-3d] transition-transform duration-700 ease-in-out ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''} ${isFlippable ? 'cursor-pointer' : ''}`}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full bg-[rgb(var(--color-surface))] rounded-xl [backface-visibility:hidden] flex items-center justify-center border border-[rgb(var(--color-border))] group-hover:border-[rgb(var(--color-primary))] transition-colors bg-gradient-to-br from-[rgba(var(--color-primary),0.05)] to-[rgba(var(--color-secondary),0.05)]">
           <div className="w-1/2 h-1/2 text-[rgb(var(--color-text-muted))] opacity-20 group-hover:opacity-40 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6.364 1.636l-.707.707M20 12h-1M17.636 17.636l-.707-.707M12 20v-1M6.364 17.636l.707-.707M4 12h1M6.364 6.364l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
           </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full bg-[rgb(var(--color-background))] rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          <img
            src={card.imageSrc}
            alt="Card face"
            className="w-full h-full object-cover"
            aria-hidden={!card.isFlipped && !card.isMatched}
          />
           <div className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${card.isMatched ? 'bg-[rgba(var(--color-primary),0.7)]' : 'bg-transparent opacity-0'}`}>
            {card.isMatched && <CheckIcon className="w-1/2 h-1/2 text-white" />}
           </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);