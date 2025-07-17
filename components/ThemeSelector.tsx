import React from 'react';
import { THEMES } from '../constants';

export type Theme = 'clarity' | 'cyberpunk' | 'forest' | 'sakura';

interface ThemeSelectorProps {
  setTheme: (theme: Theme) => void;
  currentTheme: Theme;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ setTheme, currentTheme }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {THEMES.map(theme => (
        <button
          key={theme.name}
          onClick={() => setTheme(theme.name)}
          className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all border-2 ${currentTheme === theme.name ? 'border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.1)]' : 'border-transparent bg-[rgb(var(--color-background))] hover:border-[rgb(var(--color-primary))]'}`}
          >
          <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden shrink-0">
            <div className={`w-full h-full flex`}>
                <div className={`w-1/2 h-full ${theme.colors[0]}`}></div>
                <div className={`w-1/2 h-full ${theme.colors[1]}`}></div>
            </div>
          </div>
          <span className="font-semibold text-sm text-[rgb(var(--color-text-base))]">{theme.label}</span>
        </button>
      ))}
    </div>
  );
};

export default React.memo(ThemeSelector);
