/**
 * 3x3三目並べゲームボードコンポーネント
 */

import React from "react";
import { useGame } from "../hooks/useGame";
import type { BoardPosition } from "../types/game";

export interface GameBoardProps {
  /** ゲーム設定（オプション） */
  config?: {
    playerXStarts?: boolean;
  };
  /** ゲーム終了時のコールバック */
  onGameEnd?: (winner: "X" | "O" | "draw") => void;
}

/**
 * ゲームボードコンポーネント
 */
export function GameBoard({ config, onGameEnd }: GameBoardProps) {
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
    if (canMakeMove(position)) {
      makeMove(position);
    }
  };

  /**
   * セルの表示内容を取得
   */
  const getCellContent = (position: BoardPosition) => {
    const cell = gameState.board[position];
    if (!cell) return "";
    return cell;
  };

  /**
   * セルのスタイルクラスを取得
   */
  const getCellClassName = (position: BoardPosition) => {
    const baseClasses =
      "w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700";

    const cell = gameState.board[position];
    if (cell) {
      return `${baseClasses} ${
        cell === "X" ? "text-blue-600" : "text-red-600"
      }`;
    }

    if (!canMakeMove(position)) {
      return `${baseClasses} cursor-not-allowed opacity-50`;
    }

    return baseClasses;
  };

  /**
   * ゲーム状態メッセージを取得
   */
  const getStatusMessage = () => {
    if (gameState.gameStatus === "finished") {
      return gameState.winner
        ? `プレイヤー ${gameState.winner} の勝利！`
        : "引き分け！";
    }

    if (gameState.gameStatus === "draw") {
      return "引き分け！";
    }

    return `プレイヤー ${gameState.currentPlayer} のターン`;
  };

  /**
   * ステータスメッセージのスタイルクラスを取得
   */
  const getStatusClassName = () => {
    const baseClasses = "text-xl font-semibold mb-4 text-center";

    if (gameState.gameStatus === "finished") {
      return `${baseClasses} ${
        gameState.winner
          ? gameState.winner === "X"
            ? "text-blue-600"
            : "text-red-600"
          : "text-gray-600"
      }`;
    }

    if (gameState.gameStatus === "draw") {
      return `${baseClasses} text-gray-600`;
    }

    return `${baseClasses} ${
      gameState.currentPlayer === "X" ? "text-blue-600" : "text-red-600"
    }`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* ゲーム状態表示 */}
      <div className={getStatusClassName()}>{getStatusMessage()}</div>

      {/* ゲームボード */}
      <div className="grid grid-cols-3 gap-1 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
        {Array.from({ length: 9 }, (_, index) => {
          const position = index as BoardPosition;
          return (
            <button
              key={position}
              className={getCellClassName(position)}
              onClick={() => handleCellClick(position)}
              disabled={!canMakeMove(position)}
              aria-label={`セル ${position + 1}`}
            >
              {getCellContent(position)}
            </button>
          );
        })}
      </div>

      {/* コントロールボタン */}
      <div className="flex space-x-4">
        <button
          onClick={() => resetGame()}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          リセット
        </button>

        {isGameFinished && (
          <button
            onClick={() => resetGame()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            新しいゲーム
          </button>
        )}
      </div>

      {/* ゲーム情報 */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        <div>手数: {gameState.moves.length}</div>
        <div>先攻: {config?.playerXStarts !== false ? "X" : "O"}</div>
      </div>
    </div>
  );
}

export default GameBoard;
