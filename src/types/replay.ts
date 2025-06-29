/**
 * 棋譜再生機能の型定義
 */

import type { GameRecord, GameState } from "./game";

// 再生状態
export type ReplayStatus = "idle" | "playing" | "paused" | "completed";

// 再生速度
export type ReplaySpeed = 0.5 | 1 | 1.5 | 2;

// 再生コントロール
export interface ReplayControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  goToMove: (moveIndex: number) => void;
  nextMove: () => void;
  previousMove: () => void;
  setSpeed: (speed: ReplaySpeed) => void;
}

// 再生状態
export interface ReplayState {
  currentMoveIndex: number; // 現在の手順インデックス (-1: 初期状態)
  status: ReplayStatus; // 再生状態
  speed: ReplaySpeed; // 再生速度
  gameState: GameState; // 現在のゲーム状態
  totalMoves: number; // 総手数
  progress: number; // 進捗率 (0-100)
}

// 再生設定
export interface ReplayConfig {
  autoPlay?: boolean; // 自動再生開始
  initialSpeed?: ReplaySpeed; // 初期再生速度
  showMoveNumbers?: boolean; // 手順番号表示
  highlightLastMove?: boolean; // 最後の手をハイライト
}

// フック戻り値
export interface UseGameReplayReturn {
  replayState: ReplayState;
  controls: ReplayControls;
  isLoading: boolean;
  error: string | null;
}

// コンポーネントProps
export interface GameReplayProps {
  gameRecord: GameRecord;
  config?: ReplayConfig;
  onComplete?: () => void;
  onMoveChange?: (moveIndex: number, gameState: GameState) => void;
  className?: string;
}

// 再生コントロールUIのProps
export interface ReplayControlsProps {
  replayState: ReplayState;
  controls: ReplayControls;
  className?: string;
}

// プログレスバーのProps
export interface ReplayProgressProps {
  currentMove: number;
  totalMoves: number;
  onSeek: (moveIndex: number) => void;
  className?: string;
}
