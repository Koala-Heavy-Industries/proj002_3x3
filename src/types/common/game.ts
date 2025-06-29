/**
 * 共通ゲーム型定義（クライアント・サーバー共通）
 */

// 基本型定義
export type Player = "X" | "O";
export type GameMode = "pvp" | "pvc"; // Player vs Player, Player vs Computer
export type GameStatus = "playing" | "finished" | "draw";
export type GameResult = Player | "draw";

// ボードの位置 (0-8の範囲)
export type BoardPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// ボードセル（null は空のマス）
export type BoardCell = null | Player;

// 手順の型定義
export interface Move {
  player: Player; // プレイヤー
  position: BoardPosition; // 位置 (0-8)
  timestamp: number; // 手を打った時刻
}

// ゲーム状態の型定義
export interface GameState {
  board: BoardCell[]; // ボード状態 (9要素の配列)
  currentPlayer: Player; // 現在のプレイヤー
  gameStatus: GameStatus; // ゲーム状態
  winner: null | Player; // 勝者 (未決定の場合はnull)
  moves: Move[]; // 手順履歴
}

// ゲーム記録の型定義
export interface GameRecord {
  id: string; // ユニークID
  timestamp: number; // ゲーム開始時刻
  gameMode: GameMode; // 対戦モード
  moves: Move[]; // 手順リスト
  result: GameResult; // 結果
  duration: number; // ゲーム時間(秒)
  playerXStarts: boolean; // Xが先攻かどうか
}

// 勝利条件の型定義
export interface WinCondition {
  positions: [BoardPosition, BoardPosition, BoardPosition]; // 勝利ライン
  player: Player; // 勝利プレイヤー
}

// ゲーム設定の型定義
export interface GameConfig {
  mode: GameMode; // ゲームモード
  playerXStarts: boolean; // Xが先攻か
  aiDifficulty?: "easy" | "medium" | "hard"; // AI難易度（PvCモードの場合）
}

// ゲーム統計の型定義
export interface GameStats {
  totalGames: number;
  wins: { X: number; O: number };
  draws: number;
  averageDuration: number;
  longestGame: number;
  shortestGame: number;
}
