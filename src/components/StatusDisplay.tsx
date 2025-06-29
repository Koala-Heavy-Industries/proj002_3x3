/**
 * ゲーム状態表示コンポーネント
 */

import React from "react";
import type { StatusDisplayProps } from "../types/client/components";

/**
 * ゲームステータス表示コンポーネント
 */
export function StatusDisplay({
  currentPlayer,
  gameStatus,
  winner,
  showMoveCount = false,
  moveCount = 0,
  className = "",
  isAITurn = false,
  gameMode = "pvp",
}: StatusDisplayProps) {
  // ステータスメッセージを取得
  const getStatusMessage = () => {
    if (gameStatus === "finished") {
      if (winner && gameMode === "pvc") {
        return winner === "X" ? "あなたの勝利！" : "コンピュータの勝利！";
      }
      return winner ? `プレイヤー ${winner} の勝利！` : "引き分け！";
    }

    if (gameStatus === "draw") {
      return "引き分け！";
    }

    if (gameMode === "pvc") {
      if (isAITurn) {
        return "コンピュータが考え中...";
      }
      return currentPlayer === "X" ? "あなたのターン" : "コンピュータのターン";
    }

    return `プレイヤー ${currentPlayer} のターン`;
  };

  // ステータス別スタイルクラス
  const getStatusClassName = () => {
    const baseClasses = "text-xl font-semibold text-center";

    if (gameStatus === "finished") {
      const colorClass = winner
        ? winner === "X"
          ? "text-blue-600"
          : "text-red-600"
        : "text-gray-600";
      return `${baseClasses} ${colorClass}`;
    }

    if (gameStatus === "draw") {
      return `${baseClasses} text-gray-600`;
    }

    const playerColorClass =
      currentPlayer === "X" ? "text-blue-600" : "text-red-600";
    return `${baseClasses} ${playerColorClass}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`${getStatusClassName()} ${isAITurn ? "animate-pulse" : ""}`}
      >
        {getStatusMessage()}
        {isAITurn && (
          <span className="ml-2 inline-block">
            <span className="animate-bounce">🤖</span>
          </span>
        )}
      </div>

      {showMoveCount && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          手数: {moveCount}
        </div>
      )}
    </div>
  );
}

export default StatusDisplay;
