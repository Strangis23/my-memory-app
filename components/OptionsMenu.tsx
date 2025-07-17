import React from 'react';
import ThemeSelector, { Theme } from './ThemeSelector';

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const RefreshIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.686 11.234M20 20a14.95 14.95 0 01-14.686-11.234" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  onRemoveAllPhotos: () => void;
  onResetAllScores: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ isOpen, onClose, currentTheme, setTheme, onRemoveAllPhotos, onResetAllScores }) => {
  if (!isOpen) return null;

  const handleRemovePhotos = () => {
    if (window.confirm('Are you sure you want to remove all uploaded photos? This action cannot be undone.')) {
        onRemoveAllPhotos();
        onClose();
    }
  };

  const handleResetScores = () => {
    if (window.confirm('Are you sure you want to reset all scores? This action cannot be undone.')) {
        onResetAllScores();
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative bg-[rgb(var(--color-surface))] w-full max-w-md rounded-2xl shadow-[var(--shadow-xl)] border border-[rgb(var(--color-border))] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-orbitron text-[rgb(var(--color-text-accent))]">Options</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text-base))] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface))] focus:ring-[rgb(var(--color-primary-focus))]"
            aria-label="Close options menu"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-base))] mb-3">Theme</h3>
                <ThemeSelector setTheme={setTheme} currentTheme={currentTheme} />
            </div>
            
            <div className="space-y-4 pt-6 border-t border-[rgb(var(--color-border))]">
                <h3 className="text-lg font-semibold text-[rgb(var(--color-error))]">Danger Zone</h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] -mt-2 mb-3">These actions cannot be undone.</p>
                <button 
                  onClick={handleRemovePhotos} 
                  className="w-full flex items-center justify-center gap-3 text-left p-3 rounded-lg text-[rgb(var(--color-error))] bg-[rgba(var(--color-error),0.1)] hover:bg-[rgba(var(--color-error),0.2)] transition-colors font-semibold"
                >
                    <TrashIcon className="w-5 h-5"/>
                    <span>Remove All Photos</span>
                </button>
                <button 
                  onClick={handleResetScores} 
                  className="w-full flex items-center justify-center gap-3 text-left p-3 rounded-lg text-[rgb(var(--color-error))] bg-[rgba(var(--color-error),0.1)] hover:bg-[rgba(var(--color-error),0.2)] transition-colors font-semibold"
                >
                    <RefreshIcon className="w-5 h-5"/>
                    <span>Reset All Scores</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OptionsMenu);