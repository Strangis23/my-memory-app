/**
 * Represents the total number of cards on the board.
 * Valid sizes are 4, 12, 24, or 48.
 */
export type GameSize = 4 | 12 | 24 | 48;

/**
 * Represents the state of a single card in the game.
 */
export interface CardData {
  /** A unique identifier for the card instance. */
  id: number;
  /** A unique identifier for the image, shared by two cards. */
  imageId: string;
  /** The source URL or base64 string for the card's image. */
  imageSrc: string;
  /** True if the card is currently face-up. */
  isFlipped: boolean;
  /** True if the card has been successfully matched. */
  isMatched: boolean;
}

/**
 * Represents a player's score for a completed game.
 */
export interface Score {
  /** The ISO 8601 timestamp of when the score was achieved. */
  date: string;
  /** The number of flips (moves) taken to complete the game. */
  flips: number;
  /** The size of the game board for which this score was recorded. */
  gameSize: GameSize;
}