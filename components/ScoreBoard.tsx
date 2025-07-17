import React from 'react';
import { Score } from '../types';

interface ScoreBoardProps {
  scores: Score[];
  title: string;
}

const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75v11.25l-2.25-2.25-2.25 2.25V3.75m12 15.75h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25z" />
    </svg>
);


const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, title }) => {
  const sortedScores = [...scores].sort((a, b) => a.flips - b.flips);

  const getTrophyColor = (index: number) => {
    if(index === 0) return 'text-[rgb(var(--color-trophy-gold))]';
    if(index === 1) return 'text-[rgb(var(--color-trophy-silver))]';
    if(index === 2) return 'text-[rgb(var(--color-trophy-bronze))]';
    return 'text-[rgb(var(--color-text-muted))]';
  }

  return (
    <div className="bg-[rgb(var(--color-surface))] p-6 rounded-2xl border border-[rgb(var(--color-border))] shadow-[var(--shadow-xl)] h-full">
      <h2 className="text-2xl font-bold text-center text-[rgb(var(--color-secondary))] font-orbitron mb-1">{title}</h2>
      <p className="text-center text-sm text-[rgb(var(--color-text-muted))] mb-6">Lowest Score Wins</p>
      
      {scores.length === 0 ? (
        <div className="text-center text-[rgb(var(--color-text-muted))] py-10 px-4">
          <TrophyIcon className="w-16 h-16 mx-auto text-[rgb(var(--color-border))]"/>
          <p className="mt-4 font-semibold">No Scores Yet!</p>
          <p className="mt-1">Complete a game in this mode to get on the leaderboard.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedScores.map((score, index) => (
            <li key={`${score.date}-${score.flips}-${index}`} className="flex items-center justify-between bg-[rgba(var(--color-background),0.5)] p-3 rounded-lg border border-transparent hover:border-[rgb(var(--color-primary))] transition-colors">
              <div className="flex items-center gap-4">
                <TrophyIcon className={`w-7 h-7 flex-shrink-0 ${getTrophyColor(index)}`}/>
                <span className="font-bold text-lg text-[rgb(var(--color-text-base))]">
                  {score.flips} <span className="text-sm font-medium text-[rgb(var(--color-text-muted))]">flips</span>
                </span>
              </div>
              <span className="text-xs text-[rgb(var(--color-text-muted))]">
                {new Date(score.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(ScoreBoard);
