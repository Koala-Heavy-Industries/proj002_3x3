/**
 * クライアント専用コンポーネント型定義
 */

import type {
  Player,
  GameMode,
  GameResult,
  BoardPosition,
  GameConfig,
} from "../common/game";

// 基本イベントハンドラー型
export type CellClickHandler = (position: BoardPosition) => void;
export type GameResetHandler = () => void;
export type GameModeChangeHandler = (mode: GameMode) => void;
export type GameEndHandler = (result: GameResult) => void;
export type MoveStartHandler = (position: BoardPosition) => void;
export type MoveCompleteHandler = (
  position: BoardPosition,
  player: Player
) => void;

// GameBoard詳細Props型
export interface GameBoardProps {
  /** ゲーム設定（オプション） */
  config?: Partial<GameConfig>;
  /** ゲーム終了時のコールバック */
  onGameEnd?: GameEndHandler;
  /** 手の開始時コールバック */
  onMoveStart?: MoveStartHandler;
  /** 手の完了時コールバック */
  onMoveComplete?: MoveCompleteHandler;
  /** ボード無効化フラグ */
  disabled?: boolean;
  /** テーマ設定 */
  theme?: "light" | "dark";
  /** カスタムCSSクラス */
  className?: string;
  /** アクセシビリティ設定 */
  ariaLabel?: string;
}

// Button共通Props型
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

// Cell専用Props型
export interface CellProps {
  position: BoardPosition;
  content: Player | null;
  onClick: CellClickHandler;
  disabled?: boolean;
  highlighted?: boolean;
  className?: string;
  ariaLabel?: string;
}

// StatusDisplay Props型
export interface StatusDisplayProps {
  currentPlayer: Player;
  gameStatus: "playing" | "finished" | "draw";
  winner: Player | null;
  className?: string;
  showMoveCount?: boolean;
  moveCount?: number;
}

// GameInfo Props型
export interface GameInfoProps {
  moveCount: number;
  currentPlayer: Player;
  startingPlayer: Player;
  duration?: number;
  className?: string;
}

// ThemeToggle Props型
export interface ThemeToggleProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  className?: string;
}
