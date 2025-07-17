/**
 * Shuffles an array using the Fisher-Yates (aka Knuth) algorithm.
 * @param array The array to shuffle.
 * @returns A new array with the elements shuffled.
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
