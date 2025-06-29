/**
 * ゲーム統計管理用カスタムフック
 */

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { GameStats } from "../types/common/game";
import type { UseGameStatsReturn } from "../types/client/hooks";

const STORAGE_KEY = "tic-tac-toe-stats";

// 初期統計データ
const initialStats: GameStats = {
  totalGames: 0,
  wins: { X: 0, O: 0 },
  draws: 0,
  averageDuration: 0,
  longestGame: 0,
  shortestGame: 0,
};

/**
 * ゲーム統計を管理するフック
 * @returns ゲーム統計の操作機能
 */
export function useGameStats(): UseGameStatsReturn {
  const {
    value: stats,
    setValue: setStats,
    loading,
  } = useLocalStorage<GameStats>(STORAGE_KEY, initialStats);

  // 統計更新
  const updateStats = useCallback(
    (result: "X" | "O" | "draw", duration: number) => {
      setStats(prevStats => {
        const newStats = { ...prevStats };

        // 総ゲーム数更新
        newStats.totalGames += 1;

        // 結果別カウント更新
        if (result === "draw") {
          newStats.draws += 1;
        } else {
          newStats.wins[result] += 1;
        }

        // ゲーム時間統計更新
        const totalDuration =
          prevStats.averageDuration * (newStats.totalGames - 1) + duration;
        newStats.averageDuration = totalDuration / newStats.totalGames;

        // 最長・最短ゲーム時間更新
        if (newStats.totalGames === 1) {
          newStats.longestGame = duration;
          newStats.shortestGame = duration;
        } else {
          newStats.longestGame = Math.max(newStats.longestGame, duration);
          newStats.shortestGame = Math.min(newStats.shortestGame, duration);
        }

        return newStats;
      });
    },
    [setStats]
  );

  // 統計リセット
  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, [setStats]);

  return {
    stats,
    updateStats,
    resetStats,
    loading,
  };
}

export default useGameStats;
