/**
 * クライアント専用カスタムフック型定義
 */

import type {
  GameState,
  BoardPosition,
  Player,
  GameConfig,
  GameRecord,
  GameStats,
} from "../common/game";

// useGame戻り値型
export interface UseGameReturn {
  gameState: GameState;
  makeMove: (position: BoardPosition) => void;
  resetGame: (startingPlayer?: Player) => void;
  isGameFinished: boolean;
  canMakeMove: (position: BoardPosition) => boolean;
}

// useLocalStorage戻り値型
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  loading: boolean;
  error: Error | null;
}

// useGameHistory戻り値型
export interface UseGameHistoryReturn {
  games: GameRecord[];
  saveGame: (game: GameRecord) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

// useGameStats戻り値型
export interface UseGameStatsReturn {
  stats: GameStats;
  updateStats: (result: "X" | "O" | "draw", duration: number) => void;
  resetStats: () => void;
  loading: boolean;
}

// useKeyboardNavigation戻り値型
export interface UseKeyboardNavigationReturn {
  currentPosition: BoardPosition;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  selectCurrent: () => void;
  resetPosition: () => void;
}

// useTheme戻り値型
export interface UseThemeReturn {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isDark: boolean;
}

// useGameTimer戻り値型
export interface UseGameTimerReturn {
  duration: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
}

// useGameReplay戻り値型
export interface UseGameReplayReturn {
  currentMoveIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  goToMove: (index: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  reset: () => void;
}
