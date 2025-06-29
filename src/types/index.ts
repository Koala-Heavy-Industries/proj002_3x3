/**
 * 型定義のエクスポート
 */

// 共通型定義
export * from "./common";

// クライアント専用型定義
export * from "./client";

// 後方互換性のため既存のgame.tsから個別エクスポート（重複回避）
export type {
  CellClickHandler as LegacyCellClickHandler,
  GameResetHandler as LegacyGameResetHandler,
  GameModeChangeHandler as LegacyGameModeChangeHandler,
} from "./game";
