/**
 * 棋譜再生コンポーネント
 */

import React from "react";
import { Cell } from "./Cell";
import { Button } from "./Button";
import { useGameReplay } from "../hooks/useGameReplay";
import type {
  GameReplayProps,
  ReplayControlsProps,
  ReplayProgressProps,
  ReplaySpeed,
} from "../types/replay";
import type { BoardPosition } from "../types/game";

/**
 * 再生進捗バー
 */
function ReplayProgress({
  currentMove,
  totalMoves,
  onSeek,
  className = "",
}: ReplayProgressProps) {
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetMove = Math.round(percentage * totalMoves) - 1;
    onSeek(Math.max(-1, Math.min(targetMove, totalMoves - 1)));
  };

  const progressPercentage =
    totalMoves > 0 ? ((currentMove + 1) / totalMoves) * 100 : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          手順: {currentMove + 1} / {totalMoves}
        </span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <div
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 再生コントロール
 */
function ReplayControls({
  replayState,
  controls,
  className = "",
}: ReplayControlsProps) {
  const { status, speed, currentMoveIndex, totalMoves } = replayState;
  const { play, pause, reset, nextMove, previousMove, setSpeed } = controls;

  const isPlaying = status === "playing";
  const isCompleted = status === "completed";
  const canPlay = currentMoveIndex < totalMoves - 1;
  const canGoBack = currentMoveIndex >= 0;
  const canGoForward = currentMoveIndex < totalMoves - 1;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* メイン再生コントロール */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={currentMoveIndex === -1}
          title="最初に戻る"
        >
          ⏮
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={previousMove}
          disabled={!canGoBack}
          title="前の手"
        >
          ⏪
        </Button>

        <Button
          variant={isPlaying ? "secondary" : "primary"}
          onClick={isPlaying ? pause : play}
          disabled={!canPlay && !isPlaying}
          title={isPlaying ? "一時停止" : "再生"}
        >
          {isPlaying ? "⏸" : "▶"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextMove}
          disabled={!canGoForward}
          title="次の手"
        >
          ⏩
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => controls.goToMove(totalMoves - 1)}
          disabled={currentMoveIndex >= totalMoves - 1}
          title="最後に進む"
        >
          ⏭
        </Button>
      </div>

      {/* 再生速度選択 */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">速度:</span>
        {[0.5, 1, 1.5, 2].map(speedOption => (
          <Button
            key={speedOption}
            variant={speed === speedOption ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSpeed(speedOption as ReplaySpeed)}
          >
            {speedOption}x
          </Button>
        ))}
      </div>

      {/* 状態表示 */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isCompleted && "再生完了"}
        {isPlaying && "再生中..."}
        {status === "paused" && currentMoveIndex >= 0 && "一時停止中"}
        {status === "idle" && "待機中"}
      </div>
    </div>
  );
}

/**
 * 棋譜再生メインコンポーネント
 */
export function GameReplay({
  gameRecord,
  config = {},
  onComplete,
  onMoveChange,
  className = "",
}: GameReplayProps) {
  const { replayState, controls, isLoading, error } = useGameReplay(gameRecord);

  // 再生完了時のコールバック
  React.useEffect(() => {
    if (replayState.status === "completed" && onComplete) {
      onComplete();
    }
  }, [replayState.status, onComplete]);

  // 手順変更時のコールバック
  React.useEffect(() => {
    if (onMoveChange) {
      onMoveChange(replayState.currentMoveIndex, replayState.gameState);
    }
  }, [replayState.currentMoveIndex, replayState.gameState, onMoveChange]);

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

  if (!gameRecord) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="text-gray-600 dark:text-gray-400">
          棋譜が見つかりません
        </div>
      </div>
    );
  }

  const { board } = replayState.gameState;

  // 最後の手をハイライト
  const lastMovePosition =
    config.highlightLastMove && replayState.currentMoveIndex >= 0
      ? gameRecord.moves[replayState.currentMoveIndex]?.position
      : undefined;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ゲーム情報 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          棋譜再生
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-x-4">
          <span>{new Date(gameRecord.timestamp).toLocaleString("ja-JP")}</span>
          <span>
            {gameRecord.gameMode === "pvp" ? "人 vs 人" : "人 vs コンピュータ"}
          </span>
          <span>
            結果:{" "}
            {gameRecord.result === "draw"
              ? "引き分け"
              : `${gameRecord.result} の勝利`}
          </span>
        </div>
      </div>

      {/* ゲームボード */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {board.map((cell, index) => (
            <Cell
              key={index}
              position={index as BoardPosition}
              content={cell}
              onClick={() => {}} // 再生モードではクリック無効
              disabled={true}
              highlighted={lastMovePosition === index}
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          ))}
        </div>
      </div>

      {/* 進捗バー */}
      <ReplayProgress
        currentMove={replayState.currentMoveIndex}
        totalMoves={replayState.totalMoves}
        onSeek={controls.goToMove}
      />

      {/* 再生コントロール */}
      <ReplayControls replayState={replayState} controls={controls} />

      {/* 手順表示 */}
      {config.showMoveNumbers && gameRecord.moves.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            手順一覧
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 text-xs">
            {gameRecord.moves.map((move, index) => (
              <button
                key={index}
                onClick={() => controls.goToMove(index)}
                className={`p-1 rounded text-center transition-colors ${
                  index === replayState.currentMoveIndex
                    ? "bg-blue-500 text-white"
                    : index <= replayState.currentMoveIndex
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {index + 1}:{move.player}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameReplay;
