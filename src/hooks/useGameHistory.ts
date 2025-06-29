/**
 * ゲーム履歴管理フック
 */

import { useState, useEffect, useCallback } from "react";
import type { GameRecord, GameStats } from "../types/game";
import { gameRepository } from "../lib/repository";

export interface UseGameHistoryReturn {
  games: GameRecord[];
  stats: GameStats;
  isLoading: boolean;
  error: string | null;
  saveGame: (game: GameRecord) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  clearAllGames: () => Promise<void>;
  refreshGames: () => Promise<void>;
}

/**
 * ゲーム履歴を管理するカスタムフック
 */
export function useGameHistory(): UseGameHistoryReturn {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ゲーム履歴を読み込み
   */
  const refreshGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedGames = await gameRepository.loadGames();
      setGames(loadedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ゲーム履歴の読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * ゲームを保存
   */
  const saveGame = useCallback(async (game: GameRecord) => {
    try {
      setError(null);
      await gameRepository.saveGame(game);
      await refreshGames(); // 保存後にリフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : "ゲームの保存に失敗しました");
      throw err;
    }
  }, [refreshGames]);

  /**
   * ゲームを削除
   */
  const deleteGame = useCallback(async (id: string) => {
    try {
      setError(null);
      await gameRepository.deleteGame(id);
      await refreshGames(); // 削除後にリフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : "ゲームの削除に失敗しました");
      throw err;
    }
  }, [refreshGames]);

  /**
   * すべてのゲームを削除
   */
  const clearAllGames = useCallback(async () => {
    try {
      setError(null);
      await gameRepository.clearAll();
      await refreshGames(); // 削除後にリフレッシュ
    } catch (err) {
      setError(err instanceof Error ? err.message : "すべてのゲームの削除に失敗しました");
      throw err;
    }
  }, [refreshGames]);

  /**
   * 統計情報を計算
   */
  const stats: GameStats = {
    totalGames: games.length,
    wins: {
      X: games.filter(g => g.result === "X").length,
      O: games.filter(g => g.result === "O").length,
    },
    draws: games.filter(g => g.result === "draw").length,
    averageDuration: games.length > 0 
      ? games.reduce((sum, g) => sum + g.duration, 0) / games.length 
      : 0,
    longestGame: games.length > 0 
      ? Math.max(...games.map(g => g.duration)) 
      : 0,
    shortestGame: games.length > 0 
      ? Math.min(...games.map(g => g.duration)) 
      : 0,
  };

  // 初回読み込み
  useEffect(() => {
    refreshGames();
  }, [refreshGames]);

  return {
    games,
    stats,
    isLoading,
    error,
    saveGame,
    deleteGame,
    clearAllGames,
    refreshGames,
  };
}

export default useGameHistory;