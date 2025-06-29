"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GameBoard } from "../components/GameBoard";
import { useGameHistory } from "../hooks/useGameHistory";
import type { GameResult, GameRecord } from "../types/game";

export default function Home() {
  const { games, stats, saveGame, clearAllGames } = useGameHistory();
  const [showStats, setShowStats] = useState(false);

  /**
   * ゲーム終了時の処理（棋譜記録）
   */
  const handleGameEnd = async (gameRecord: GameRecord) => {
    try {
      await saveGame(gameRecord);
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  };

  /**
   * 統計をリセット
   */
  const resetStats = async () => {
    try {
      await clearAllGames();
    } catch (error) {
      console.error("Failed to clear games:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            三目並べ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            シンプルで楽しい3x3の三目並べゲーム
          </p>
        </header>

        {/* メインゲームエリア */}
        <main className="flex flex-col items-center space-y-8">
          {/* ゲームボード */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <GameBoard onGameEnd={handleGameEnd} />
          </div>

          {/* 統計セクション */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                ゲーム統計
              </h2>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                {showStats ? "非表示" : "表示"}
              </button>
            </div>

            {showStats && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    総ゲーム数:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {stats.totalGames}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    X の勝利:
                  </span>
                  <span className="font-medium text-blue-600">
                    {stats.wins.X}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    O の勝利:
                  </span>
                  <span className="font-medium text-red-600">
                    {stats.wins.O}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    引き分け:
                  </span>
                  <span className="font-medium text-gray-600">
                    {stats.draws}
                  </span>
                </div>
                {stats.totalGames > 0 && (
                  <div className="mt-4 space-y-2">
                    <Link href="/history" className="block">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                        棋譜履歴を見る
                      </button>
                    </Link>
                    <button
                      onClick={resetStats}
                      className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      統計をリセット
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* フッター */}
        <footer className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Next.js + TypeScript + Tailwind CSS で作成
          </p>
        </footer>
      </div>
    </div>
  );
}
