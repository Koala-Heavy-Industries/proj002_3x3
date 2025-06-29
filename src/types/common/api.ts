/**
 * API関連型定義（Phase 3準備）
 */

import type { GameRecord, GameStats } from "./game";

// API共通レスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// ゲーム一覧取得レスポンス
export type GetGamesResponse = ApiResponse<GameRecord[]>;

// ゲーム作成リクエスト
export interface CreateGameRequest {
  gameMode: "pvp" | "pvc";
  playerXStarts?: boolean;
  aiDifficulty?: "easy" | "medium" | "hard";
}

// ゲーム作成レスポンス
export type CreateGameResponse = ApiResponse<GameRecord>;

// 統計取得レスポンス
export type GetStatsResponse = ApiResponse<GameStats>;

// ヘルスチェックレスポンス
export type HealthCheckResponse = ApiResponse<{
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  version: string;
}>;

// エラーレスポンス型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
