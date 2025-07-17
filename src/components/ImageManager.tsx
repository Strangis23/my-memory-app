import React, { useState, useEffect } from 'react';
import { GameSize, Score } from '../types';
import ScoreBoard from './ScoreBoard';
import { shuffleArray } from '../utils/shuffle';
import { GAME_OPTIONS } from '../constants';

interface ImageManagerProps {
  uploadedImages: string[];
  onImagesUploaded: (images: string[]) => void;
  onStartGame: (images: string[], size: GameSize) => void;
  scores: Record<GameSize, Score[]>;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
const PlayIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);
const ShuffleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        <path fillRule="evenodd" d="M5.5 3.5A1.5 1.5 0 017 2h6a1.5 1.5 0 011.5 1.5v2.016a.75.75 0 001.5 0V3.5A3 3 0 0013 0H7a3 3 0 00-3 3v2.016a.75.75 0 001.5 0V3.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3.5 14.5A1.5 1.5 0 012 13V7a1.5 1.5 0 011.5-1.5h2.016a.75.75 0 000-1.5H3.5A3 3 0 00.5 7v6a3 3 0 003 3h2.016a.75.75 0 000-1.5H3.5zm13 0A1.5 1.5 0 0018 13V7a1.5 1.5 0 00-1.5-1.5h-2.016a.75.75 0 000 1.5H16.5A1.5 1.5 0 0118 7v6a1.5 1.5 0 01-1.5 1.5h-2.016a.75.75 0 000 1.5H16.5z" clipRule="evenodd" />
    </svg>
);

const ImageManager: React.FC<ImageManagerProps> = ({ uploadedImages, onImagesUploaded, onStartGame, scores }) => {
  const [selectedGameSize, setSelectedGameSize] = useState<GameSize>(12);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const imagesNeeded = selectedGameSize / 2;
  
  useEffect(() => {
    if (uploadedImages.length === 0) {
        setSelectedImages([]);
    }
  }, [uploadedImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError('');

    const imagePromises: Promise<string>[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        imagePromises.push(new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        }));
      }
    }

    Promise.all(imagePromises)
      .then(onImagesUploaded)
      .catch(err => {
        console.error("Error reading files:", err);
        setError("Could not load one or more images. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    
    event.target.value = '';
  };

  const handleGameSizeChange = (size: GameSize) => {
    setSelectedGameSize(size);
    setSelectedImages([]); // Reset selection when size changes
    setError('');
  };

  const toggleImageSelection = (imageSrc: string) => {
    setError('');
    setSelectedImages(prev => {
      if (prev.includes(imageSrc)) {
        return prev.filter(src => src !== imageSrc);
      }
      if (prev.length < imagesNeeded) {
        return [...prev, imageSrc];
      }
      setError(`Select ${imagesNeeded} images for a ${selectedGameSize}-card game.`);
      setTimeout(() => setError(''), 3000);
      return prev;
    });
  };

  const handleStart = () => {
    if(selectedImages.length === imagesNeeded) {
        onStartGame(selectedImages, selectedGameSize);
    }
  };

  const handleRandomStart = () => {
    if (uploadedImages.length < imagesNeeded) {
      setError(`Upload at least ${imagesNeeded} images to start a random game.`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    const randomImages = shuffleArray(uploadedImages).slice(0, imagesNeeded);
    onStartGame(randomImages, selectedGameSize);
  };

  const canStart = selectedImages.length === imagesNeeded;
  const canStartRandom = uploadedImages.length >= imagesNeeded;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 bg-[rgb(var(--color-surface))] p-6 md:p-8 rounded-2xl border border-[rgb(var(--color-border))] shadow-[var(--shadow-xl)] self-start">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[rgb(var(--color-text-accent))] font-orbitron">Game Setup</h2>
          <p className="text-[rgb(var(--color-text-muted))] mt-2 text-base">Create your perfect memory challenge.</p>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-semibold text-left text-[rgb(var(--color-text-base))] mb-4">1. Select Game Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {GAME_OPTIONS.map(opt => (
                    <button key={opt.size} onClick={() => handleGameSizeChange(opt.size)} className={`p-4 font-bold rounded-xl transition-all duration-200 border-2 text-left flex flex-col justify-between h-24 ${selectedGameSize === opt.size ? 'bg-[rgb(var(--color-primary))] text-white border-transparent shadow-[var(--shadow-lg)]' : 'bg-[rgba(var(--color-background),0.5)] border-[rgb(var(--color-border))] text-[rgb(var(--color-text-base))] hover:border-[rgb(var(--color-primary))] hover:bg-white'}`}>
                        <span className="block text-lg">{opt.label}</span>
                        <span className={`block text-sm font-medium ${selectedGameSize === opt.size ? 'text-blue-200' : 'text-[rgb(var(--color-text-muted))]'}`}>{opt.difficulty}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-semibold text-left text-[rgb(var(--color-text-base))] mb-4">2. Add Your Photos</h3>
            <label htmlFor="image-upload" className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[rgb(var(--color-border))] rounded-xl transition-colors duration-300 ${isLoading ? 'cursor-wait bg-[rgba(var(--color-border),0.5)]' : 'cursor-pointer hover:bg-[rgba(var(--color-primary),0.05)] hover:border-[rgb(var(--color-primary-focus))]'}`}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-10 w-10 text-[rgb(var(--color-text-muted))] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold text-[rgb(var(--color-text-base))]">Processing...</span>
                    <span className="text-sm text-[rgb(var(--color-text-muted))]">Please wait</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-10 h-10 text-[rgb(var(--color-text-muted))] mb-2"/>
                    <span className="font-semibold text-[rgb(var(--color-text-base))]">Click to upload images</span>
                    <span className="text-sm text-[rgb(var(--color-text-muted))]">PNG, JPG, GIF accepted</span>
                  </>
                )}
                <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={isLoading}/>
            </label>
        </div>

        {error && <p className="text-[rgb(var(--color-error))] text-center my-4 font-medium animate-pulse">{error}</p>}
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-base))] mb-2">3. Choose Pictures for the Game</h3>
          <p className="text-[rgb(var(--color-text-muted))] mb-4">
            {uploadedImages.length > 0 ? `Selected ${selectedImages.length} of ${imagesNeeded}.` : 'Your uploaded pictures will appear here.'}
          </p>
          {uploadedImages.length > 0 &&
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {uploadedImages.map((src, index) => (
              <div key={index} className="relative aspect-square cursor-pointer group" onClick={() => toggleImageSelection(src)}>
                <img src={src} alt={`Uploaded ${index}`} className="w-full h-full object-cover rounded-xl" />
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${selectedImages.includes(src) ? 'ring-4 ring-[rgb(var(--color-primary-focus))] ring-offset-2 ring-offset-[rgb(var(--color-surface))]' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`}>
                  {selectedImages.includes(src) && (
                    <div className="absolute top-1.5 right-1.5 bg-[rgb(var(--color-primary-focus))] rounded-full h-6 w-6 flex items-center justify-center text-white font-bold shadow-lg">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>}
        </div>
        
        <div className="mt-8 pt-6 border-t border-[rgb(var(--color-border))] flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
                onClick={handleStart} 
                disabled={!canStart || isLoading}
                className="w-full sm:w-auto px-6 py-3 font-bold text-lg rounded-lg transition-all duration-300 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-button-text))] disabled:bg-[rgb(var(--color-border))] disabled:text-[rgb(var(--color-text-muted))] disabled:cursor-not-allowed hover:enabled:bg-[rgb(var(--color-primary-focus))] hover:enabled:shadow-[var(--shadow-lg)] flex items-center justify-center gap-2">
                <PlayIcon className="w-5 h-5"/>
                Start with Selected
            </button>
            <button 
                onClick={handleRandomStart}
                disabled={!canStartRandom || isLoading}
                className="w-full sm:w-auto px-6 py-3 font-bold text-lg rounded-lg transition-all duration-300 bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-button-text))] disabled:bg-[rgb(var(--color-border))] disabled:text-[rgb(var(--color-text-muted))] disabled:cursor-not-allowed hover:enabled:bg-[rgb(var(--color-secondary-focus))] hover:enabled:shadow-[var(--shadow-lg)] flex items-center justify-center gap-2">
                <ShuffleIcon className="w-5 h-5"/>
                Start Random Game
            </button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <ScoreBoard scores={scores[selectedGameSize] || []} title={`${selectedGameSize} Card Mode`} />
      </div>
    </div>
  );
};

export default React.memo(ImageManager);