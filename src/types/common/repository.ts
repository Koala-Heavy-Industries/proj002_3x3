/**
 * データリポジトリ関連型定義
 */

import type { GameRecord } from "./game";

// リポジトリインターフェース（抽象化）
export interface GameRepository {
  saveGame(game: GameRecord): Promise<void>;
  loadGames(): Promise<GameRecord[]>;
  deleteGame(id: string): Promise<void>;
  clearAll(): Promise<void>;
}

// localStorage実装用の設定
export interface LocalStorageConfig {
  storageKey: string;
  maxRecords?: number;
  enableCompression?: boolean;
}

// Cloud DB用の設定（将来実装）
export interface CloudDbConfig {
  apiUrl: string;
  apiKey: string;
  userId?: string;
  enableOfflineSync?: boolean;
}

// リポジトリ設定の統合型
export type RepositoryConfig = LocalStorageConfig | CloudDbConfig;
