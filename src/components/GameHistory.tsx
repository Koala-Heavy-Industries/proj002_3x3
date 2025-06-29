/**
 * 棋譜履歴表示コンポーネント
 */

import React, { useState, useMemo } from "react";
import { Button } from "./Button";
import { useGameHistory } from "../hooks/useGameHistory";
import type { GameRecord } from "../types/game";

export interface GameHistoryProps {
  className?: string;
  showStats?: boolean;
  onGameSelect?: (game: GameRecord) => void;
}

/**
 * 棋譜履歴コンポーネント
 */
export function GameHistory({
  className = "",
  showStats = true,
  onGameSelect,
}: GameHistoryProps) {
  const { games, stats, isLoading, error, deleteGame, clearAllGames } =
    useGameHistory();

  // ソート・フィルタ状態
  const [sortBy, setSortBy] = useState<"timestamp" | "duration" | "result">(
    "timestamp"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterMode, setFilterMode] = useState<"all" | "pvp" | "pvc">("all");
  const [filterResult, setFilterResult] = useState<"all" | "X" | "O" | "draw">(
    "all"
  );

  // 複数選択機能
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // フィルタ・ソート済みゲーム一覧
  const filteredAndSortedGames = useMemo(() => {
    let filtered = games;

    // モードフィルタ
    if (filterMode !== "all") {
      filtered = filtered.filter(game => game.gameMode === filterMode);
    }

    // 結果フィルタ
    if (filterResult !== "all") {
      filtered = filtered.filter(game => game.result === filterResult);
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "timestamp":
          comparison = a.timestamp - b.timestamp;
          break;
        case "duration":
          comparison = a.duration - b.duration;
          break;
        case "result":
          comparison = a.result.localeCompare(b.result);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [games, sortBy, sortOrder, filterMode, filterResult]);

  // 日時フォーマット
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 時間フォーマット
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  // 結果表示
  const formatResult = (result: string) => {
    switch (result) {
      case "X":
        return "X の勝利";
      case "O":
        return "O の勝利";
      case "draw":
        return "引き分け";
      default:
        return result;
    }
  };

  // モード表示
  const formatGameMode = (mode: string) => {
    return mode === "pvp" ? "人 vs 人" : "人 vs コンピュータ";
  };

  // 削除確認（改善版）
  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    // 削除対象のゲーム情報を取得
    const gameToDelete = games.find(game => game.id === id);
    const gameInfo = gameToDelete
      ? `${formatResult(gameToDelete.result)} (${new Date(gameToDelete.timestamp).toLocaleDateString("ja-JP")})`
      : "選択された棋譜";

    const confirmed = window.confirm(
      `${gameInfo}を削除してもよろしいですか？\n\nこの操作は取り消せません。`
    );

    if (confirmed) {
      try {
        await deleteGame(id);
        // 成功時の視覚的フィードバック（オプション）
        console.log("棋譜が正常に削除されました");
      } catch (error) {
        console.error("削除に失敗しました:", error);
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  // 複数選択関連のハンドラー
  const toggleGameSelection = (gameId: string) => {
    setSelectedGames(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(gameId)) {
        newSelection.delete(gameId);
      } else {
        newSelection.add(gameId);
      }
      return newSelection;
    });
  };

  const selectAllGames = () => {
    setSelectedGames(new Set(filteredAndSortedGames.map(game => game.id)));
  };

  const deselectAllGames = () => {
    setSelectedGames(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedGames.size === 0) return;

    const confirmed = window.confirm(
      `選択された${selectedGames.size}件の棋譜を削除してもよろしいですか？\n\nこの操作は取り消せません。`
    );

    if (confirmed) {
      try {
        // 選択されたゲームを順次削除
        for (const gameId of selectedGames) {
          await deleteGame(gameId);
        }
        setSelectedGames(new Set());
        setIsSelectionMode(false);
      } catch (error) {
        console.error("一括削除に失敗しました:", error);
        alert("一括削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  // 全削除確認
  const handleClearAll = async () => {
    if (
      window.confirm("すべての棋譜を削除しますか？この操作は取り消せません。")
    ) {
      try {
        await clearAllGames();
      } catch (error) {
        console.error("全削除に失敗しました:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <strong>エラー:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 統計情報 */}
      {showStats && stats.totalGames > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            統計情報
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalGames}
              </div>
              <div className="text-gray-600 dark:text-gray-400">総ゲーム数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.wins.X}
              </div>
              <div className="text-gray-600 dark:text-gray-400">X の勝利</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.wins.O}
              </div>
              <div className="text-gray-600 dark:text-gray-400">O の勝利</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.draws}
              </div>
              <div className="text-gray-600 dark:text-gray-400">引き分け</div>
            </div>
          </div>
        </div>
      )}

      {/* フィルタ・ソートコントロール */}
      {games.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* ソート */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                並び替え:
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by as typeof sortBy);
                  setSortOrder(order as typeof sortOrder);
                }}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="timestamp-desc">新しい順</option>
                <option value="timestamp-asc">古い順</option>
                <option value="duration-asc">短時間順</option>
                <option value="duration-desc">長時間順</option>
              </select>
            </div>

            {/* モードフィルタ */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                モード:
              </label>
              <select
                value={filterMode}
                onChange={e =>
                  setFilterMode(e.target.value as typeof filterMode)
                }
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="all">全て</option>
                <option value="pvp">人 vs 人</option>
                <option value="pvc">人 vs コンピュータ</option>
              </select>
            </div>

            {/* 結果フィルタ */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                結果:
              </label>
              <select
                value={filterResult}
                onChange={e =>
                  setFilterResult(e.target.value as typeof filterResult)
                }
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="all">全て</option>
                <option value="X">X の勝利</option>
                <option value="O">O の勝利</option>
                <option value="draw">引き分け</option>
              </select>
            </div>

            {/* 選択・削除コントロール */}
            <div className="ml-auto flex items-center space-x-2">
              {!isSelectionMode ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSelectionMode(true)}
                    disabled={games.length === 0}
                  >
                    📋 複数選択
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={games.length === 0}
                  >
                    🗑️ 全削除
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedGames.size}件選択中
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAllGames}
                    disabled={filteredAndSortedGames.length === 0}
                  >
                    全選択
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deselectAllGames}
                    disabled={selectedGames.size === 0}
                  >
                    選択解除
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={selectedGames.size === 0}
                  >
                    🗑️ 選択削除 ({selectedGames.size})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedGames(new Set());
                    }}
                  >
                    キャンセル
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ゲーム一覧 */}
      {filteredAndSortedGames.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 dark:text-gray-400 text-lg">
            {games.length === 0
              ? "まだ棋譜が保存されていません"
              : "条件に合う棋譜が見つかりません"}
          </div>
          {games.length === 0 && (
            <div className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              ゲームを完了すると、ここに棋譜が保存されます
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedGames.map(game => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onGameSelect?.(game)}
            >
              <div className="flex items-center justify-between">
                {/* 選択モード時のチェックボックス */}
                {isSelectionMode && (
                  <div className="mr-3 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedGames.has(game.id)}
                      onChange={() => toggleGameSelection(game.id)}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatResult(game.result)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatGameMode(game.gameMode)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {formatDuration(game.duration)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(game.timestamp)} • {game.moves.length}手
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      window.open(`/replay/${game.id}`, "_blank");
                    }}
                    title="棋譜を再生"
                  >
                    ▶ 再生
                  </Button>
                  {!isSelectionMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => handleDelete(game.id, e)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                      title={`${formatResult(game.result)}の棋譜を削除`}
                    >
                      🗑️ 削除
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameHistory;
