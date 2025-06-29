/**
 * データアクセス層の実装
 * ゲーム記録の保存・読み込み・削除を行う
 */

import type { GameRecord, GameRepository } from "../types/game";

/**
 * localStorage を使用したリポジトリ実装
 */
export class LocalStorageRepository implements GameRepository {
  private readonly STORAGE_KEY = "tic-tac-toe-games";

  /**
   * ゲーム記録を保存
   */
  async saveGame(game: GameRecord): Promise<void> {
    try {
      const games = await this.loadGames();
      
      // 既存のゲームがあれば更新、なければ新規追加
      const existingIndex = games.findIndex(g => g.id === game.id);
      if (existingIndex >= 0) {
        games[existingIndex] = game;
      } else {
        games.push(game);
      }

      // タイムスタンプ順でソート（新しい順）
      games.sort((a, b) => b.timestamp - a.timestamp);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error("Failed to save game:", error);
      throw new Error("ゲームの保存に失敗しました");
    }
  }

  /**
   * ゲーム記録を読み込み
   */
  async loadGames(): Promise<GameRecord[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }

      const games = JSON.parse(data) as GameRecord[];
      
      // データの妥当性チェック
      return games.filter(this.isValidGameRecord);
    } catch (error) {
      console.error("Failed to load games:", error);
      return []; // エラー時は空配列を返す
    }
  }

  /**
   * 指定したゲーム記録を削除
   */
  async deleteGame(id: string): Promise<void> {
    try {
      const games = await this.loadGames();
      const filteredGames = games.filter(game => game.id !== id);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredGames));
    } catch (error) {
      console.error("Failed to delete game:", error);
      throw new Error("ゲームの削除に失敗しました");
    }
  }

  /**
   * すべてのゲーム記録を削除
   */
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear all games:", error);
      throw new Error("すべてのゲームの削除に失敗しました");
    }
  }

  /**
   * ゲーム記録の妥当性をチェック
   */
  private isValidGameRecord(game: any): game is GameRecord {
    return (
      game &&
      typeof game.id === "string" &&
      typeof game.timestamp === "number" &&
      (game.gameMode === "pvp" || game.gameMode === "pvc") &&
      Array.isArray(game.moves) &&
      (game.result === "X" || game.result === "O" || game.result === "draw") &&
      typeof game.duration === "number" &&
      typeof game.playerXStarts === "boolean"
    );
  }
}

/**
 * デフォルトのリポジトリインスタンス
 */
export const gameRepository = new LocalStorageRepository();