/**
 * 3x3三目並べゲームボードコンポーネント
 */

import React from "react";
import { useGame } from "../hooks/useGame";
import { Button } from "./Button";
import { Cell } from "./Cell";
import { StatusDisplay } from "./StatusDisplay";
import type { GameBoardProps } from "../types/client/components";
import type { BoardPosition } from "../types/common/game";

/**
 * ゲームボードコンポーネント
 */
export function GameBoard({
  config,
  onGameEnd,
  onMoveStart,
  onMoveComplete,
  disabled = false,
  className = "",
  ariaLabel = "三目並べゲームボード",
}: GameBoardProps) {
  const {
    gameState,
    makeMove,
    resetGame,
    canMakeMove,
    isGameFinished,
    gameMode,
    setGameMode,
    isAITurn,
  } = useGame(config, onGameEnd);

  // 棋譜記録機能はuseGameフック内で処理されるため、ここでは削除

  /**
   * セルクリックハンドラ
   */
  const handleCellClick = (position: BoardPosition) => {
    if (disabled || !canMakeMove(position)) return;

    onMoveStart?.(position);
    makeMove(position);
    onMoveComplete?.(position, gameState.currentPlayer);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* ゲームモード切替 */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          ゲームモード:
        </span>
        <div className="flex space-x-2">
          <Button
            variant={gameMode === "pvp" ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setGameMode("pvp");
              resetGame(); // モード変更時にゲームをリセット
            }}
            disabled={disabled}
          >
            人 vs 人
          </Button>
          <Button
            variant={gameMode === "pvc" ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setGameMode("pvc");
              resetGame(); // モード変更時にゲームをリセット
            }}
            disabled={disabled}
          >
            人 vs コンピュータ
          </Button>
        </div>
      </div>

      {/* 先攻・後攻選択 */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          先攻プレイヤー:
        </span>
        <div className="flex space-x-2">
          <Button
            variant={gameState.firstPlayer === "X" ? "primary" : "secondary"}
            size="sm"
            onClick={() => resetGame("X")}
            disabled={disabled}
            title="Xが先攻でゲーム開始"
          >
            X が先攻
          </Button>
          <Button
            variant={gameState.firstPlayer === "O" ? "primary" : "secondary"}
            size="sm"
            onClick={() => resetGame("O")}
            disabled={disabled}
            title="Oが先攻でゲーム開始"
          >
            O が先攻
          </Button>
        </div>
      </div>

      {/* ゲーム状態表示 */}
      <StatusDisplay
        currentPlayer={gameState.currentPlayer}
        gameStatus={gameState.gameStatus}
        winner={gameState.winner}
        showMoveCount
        moveCount={gameState.moves.length}
        className="mb-4"
        isAITurn={isAITurn}
        gameMode={gameMode}
      />

      {/* ゲームボード */}
      <div
        className={`grid grid-cols-3 gap-1 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
        aria-label={ariaLabel}
        role="grid"
      >
        {Array.from({ length: 9 }, (_, index) => {
          const position = index as BoardPosition;
          return (
            <Cell
              key={position}
              position={position}
              content={gameState.board[position] ?? null}
              onClick={handleCellClick}
              disabled={disabled || !canMakeMove(position)}
              ariaLabel={`セル ${position + 1}`}
            />
          );
        })}
      </div>

      {/* コントロールボタン */}
      <div className="flex space-x-4">
        <Button
          variant="secondary"
          onClick={() => resetGame()}
          disabled={disabled}
        >
          リセット
        </Button>

        {isGameFinished && (
          <Button
            variant="primary"
            onClick={() => resetGame()}
            disabled={disabled}
          >
            新しいゲーム
          </Button>
        )}
      </div>

      {/* ゲーム情報 */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        <div>先攻: {config?.playerXStarts !== false ? "X" : "O"}</div>
        {gameMode === "pvc" && (
          <div className="mt-1">
            あなた: X, コンピュータ: O
            {isAITurn && (
              <span className="ml-2 text-blue-500">（AI思考中...）</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
