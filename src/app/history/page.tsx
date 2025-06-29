/**
 * 棋譜履歴ページ
 */

"use client";

import React from "react";
import Link from "next/link";
import { GameHistory } from "../../components/GameHistory";
import { Button } from "../../components/Button";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            棋譜履歴
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            過去のゲーム記録を確認できます
          </p>
          
          {/* ナビゲーション */}
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="secondary">
                ← ゲームに戻る
              </Button>
            </Link>
          </div>
        </div>

        {/* 棋譜履歴コンポーネント */}
        <div className="max-w-4xl mx-auto">
          <GameHistory
            showStats={true}
            onGameSelect={(game) => {
              // TODO: Phase 4で棋譜再生機能を実装予定
              console.log("Selected game:", game);
              alert(`ゲーム詳細:\n日時: ${new Date(game.timestamp).toLocaleString("ja-JP")}\nモード: ${game.gameMode === "pvp" ? "人 vs 人" : "人 vs コンピュータ"}\n結果: ${game.result}\n手数: ${game.moves.length}手\n時間: ${Math.floor(game.duration / 60)}分${game.duration % 60}秒`);
            }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          />
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>三目並べ - 棋譜履歴</p>
          <p className="mt-1">Phase 4で棋譜再生機能を追加予定</p>
        </div>
      </div>
    </div>
  );
}