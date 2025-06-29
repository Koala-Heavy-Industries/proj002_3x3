/**
 * ゲーム履歴管理用カスタムフック
 */

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { GameRecord } from "../types/common/game";
import type { UseGameHistoryReturn } from "../types/client/hooks";

const STORAGE_KEY = "tic-tac-toe-games";
const MAX_RECORDS = 100; // 最大保存件数

/**
 * ゲーム履歴を管理するフック
 * @returns ゲーム履歴の操作機能
 */
export function useGameHistory(): UseGameHistoryReturn {
  const {
    value: games,
    setValue: setGames,
    loading,
    error,
  } = useLocalStorage<GameRecord[]>(STORAGE_KEY, []);

  // ゲーム保存
  const saveGame = useCallback(
    async (game: GameRecord): Promise<void> => {
      try {
        setGames(prevGames => {
          // 新しいゲームを先頭に追加
          const newGames = [game, ...prevGames];

          // 最大件数制限
          if (newGames.length > MAX_RECORDS) {
            return newGames.slice(0, MAX_RECORDS);
          }

          return newGames;
        });
      } catch (err) {
        console.error("Failed to save game:", err);
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    [setGames]
  );

  // ゲーム削除
  const deleteGame = useCallback(
    async (id: string): Promise<void> => {
      try {
        setGames(prevGames => prevGames.filter(game => game.id !== id));
      } catch (err) {
        console.error("Failed to delete game:", err);
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    [setGames]
  );

  // 履歴全削除
  const clearHistory = useCallback(async (): Promise<void> => {
    try {
      setGames([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [setGames]);

  return {
    games,
    saveGame,
    deleteGame,
    clearHistory,
    loading,
    error,
  };
}

export default useGameHistory;
