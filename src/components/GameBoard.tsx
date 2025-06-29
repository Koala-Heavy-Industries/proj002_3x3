/**
 * 3x3三目並べゲームボードコンポーネント
 */

import React from "react";
import { useGame } from "../hooks/useGame";
import { Button } from "./Button";
import { Cell } from "./Cell";
import { StatusDisplay } from "./StatusDisplay";
import type { GameBoardProps } from "../types/client/components";
import type { BoardPosition } from "../types/game";

/**
 * ゲームボードコンポーネント
 */
export function GameBoard({
  config,
  onGameEnd,
  onMoveStart,
  onMoveComplete,
  disabled = false,
  theme = "light",
  className = "",
  ariaLabel = "三目並べゲームボード",
}: GameBoardProps) {
  const { gameState, makeMove, resetGame, canMakeMove, isGameFinished } =
    useGame(config);

  // ゲーム終了時の処理（前の状態との比較で実行を制御）
  const [hasNotifiedGameEnd, setHasNotifiedGameEnd] = React.useState(false);

  React.useEffect(() => {
    if (isGameFinished && onGameEnd && !hasNotifiedGameEnd) {
      const result = gameState.winner || "draw";
      onGameEnd(result);
      setHasNotifiedGameEnd(true);
    } else if (!isGameFinished && hasNotifiedGameEnd) {
      // ゲームがリセットされたら通知フラグもリセット
      setHasNotifiedGameEnd(false);
    }
  }, [isGameFinished, gameState.winner, onGameEnd, hasNotifiedGameEnd]);

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
      {/* ゲーム状態表示 */}
      <StatusDisplay
        currentPlayer={gameState.currentPlayer}
        gameStatus={gameState.gameStatus}
        winner={gameState.winner}
        showMoveCount
        moveCount={gameState.moves.length}
        className="mb-4"
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
              content={gameState.board[position]}
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
      </div>
    </div>
  );
}

export default GameBoard;
