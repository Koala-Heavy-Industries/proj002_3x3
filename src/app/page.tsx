"use client";

import React, { useState } from "react";
import { GameBoard } from "../components/GameBoard";
import type { GameResult } from "../types/game";

export default function Home() {
  const [gameHistory, setGameHistory] = useState<{
    totalGames: number;
    wins: { X: number; O: number };
    draws: number;
  }>({ totalGames: 0, wins: { X: 0, O: 0 }, draws: 0 });

  const [showStats, setShowStats] = useState(false);

  /**
   * ゲーム終了時の処理
   */
  const handleGameEnd = (result: GameResult) => {
    setGameHistory(prev => ({
      totalGames: prev.totalGames + 1,
      wins: {
        X: prev.wins.X + (result === "X" ? 1 : 0),
        O: prev.wins.O + (result === "O" ? 1 : 0),
      },
      draws: prev.draws + (result === "draw" ? 1 : 0),
    }));
  };

  /**
   * 統計をリセット
   */
  const resetStats = () => {
    setGameHistory({ totalGames: 0, wins: { X: 0, O: 0 }, draws: 0 });
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
                    {gameHistory.totalGames}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    X の勝利:
                  </span>
                  <span className="font-medium text-blue-600">
                    {gameHistory.wins.X}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    O の勝利:
                  </span>
                  <span className="font-medium text-red-600">
                    {gameHistory.wins.O}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    引き分け:
                  </span>
                  <span className="font-medium text-gray-600">
                    {gameHistory.draws}
                  </span>
                </div>
                {gameHistory.totalGames > 0 && (
                  <button
                    onClick={resetStats}
                    className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                  >
                    統計をリセット
                  </button>
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
