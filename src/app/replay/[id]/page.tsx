/**
 * 棋譜再生ページ
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GameReplay } from "../../../components/GameReplay";
import { Button } from "../../../components/Button";
import { useGameHistory } from "../../../hooks/useGameHistory";
import type { GameRecord } from "../../../types/game";

export default function ReplayPage() {
  const params = useParams();
  const router = useRouter();
  const { games, isLoading } = useGameHistory();

  const [gameRecord, setGameRecord] = useState<GameRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gameId = Array.isArray(params.id) ? params.id[0] : params.id;

  // ゲーム記録の取得
  useEffect(() => {
    if (!isLoading && games.length > 0 && gameId) {
      const found = games.find(game => game.id === gameId);
      if (found) {
        setGameRecord(found);
        setError(null);
      } else {
        setError("指定された棋譜が見つかりません");
      }
    } else if (!isLoading && games.length === 0) {
      setError("棋譜が保存されていません");
    }
  }, [games, gameId, isLoading]);

  // 再生完了時の処理
  const handleReplayComplete = () => {
    // 完了時の特別な処理があればここに追加
    console.log("棋譜再生が完了しました");
  };

  // 手順変更時の処理
  const handleMoveChange = (moveIndex: number) => {
    // 必要に応じて手順変更時の処理を追加
    console.log(`手順 ${moveIndex + 1} に移動しました`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          {/* ナビゲーション */}
          <div className="mb-6">
            <Link href="/history">
              <Button variant="ghost">← 棋譜履歴に戻る</Button>
            </Link>
          </div>

          {/* エラー表示 */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-2">エラー</h2>
              <p>{error}</p>
              <div className="mt-4 space-x-4">
                <Link href="/history">
                  <Button variant="primary">棋譜履歴に戻る</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary">ゲームページに戻る</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* ナビゲーション */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/history">
            <Button variant="ghost">← 棋譜履歴に戻る</Button>
          </Link>

          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => router.back()}>
              戻る
            </Button>
            <Link href="/">
              <Button variant="secondary">新しいゲーム</Button>
            </Link>
          </div>
        </div>

        {/* 再生コンポーネント */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            {gameRecord ? (
              <GameReplay
                gameRecord={gameRecord}
                config={{
                  showMoveNumbers: true,
                  highlightLastMove: true,
                }}
                onComplete={handleReplayComplete}
                onMoveChange={handleMoveChange}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600 dark:text-gray-400">
                  棋譜を読み込んでいます...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 関連する他の棋譜 */}
        {gameRecord && games.length > 1 && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                他の棋譜
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {games
                  .filter(game => game.id !== gameRecord.id)
                  .slice(0, 6) // 最大6件表示
                  .map(game => (
                    <Link
                      key={game.id}
                      href={`/replay/${game.id}`}
                      className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {game.result === "draw"
                          ? "引き分け"
                          : `${game.result} の勝利`}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(game.timestamp).toLocaleDateString("ja-JP")} •{" "}
                        {game.moves.length}手
                      </div>
                    </Link>
                  ))}
              </div>
              {games.length > 7 && (
                <div className="mt-4 text-center">
                  <Link href="/history">
                    <Button variant="ghost" size="sm">
                      すべての棋譜を見る
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
