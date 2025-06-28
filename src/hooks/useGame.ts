/**
 * ゲーム状態管理フック
 */

import { useState, useCallback } from "react";
import type {
  GameState,
  BoardPosition,
  Player,
  GameConfig,
} from "../types/game";
import { createInitialGameState, updateGameState } from "../lib/gameLogic";

export interface UseGameReturn {
  gameState: GameState;
  makeMove: (position: BoardPosition) => void;
  resetGame: (startingPlayer?: Player) => void;
  isGameFinished: boolean;
  canMakeMove: (position: BoardPosition) => boolean;
}

/**
 * ゲーム状態を管理するカスタムフック
 * @param config ゲーム設定（オプション）
 * @returns ゲーム状態と操作関数
 */
export function useGame(config?: Partial<GameConfig>): UseGameReturn {
  // 初期プレイヤーを設定（デフォルトはX）
  const initialPlayer: Player = config?.playerXStarts !== false ? "X" : "O";

  // ゲーム状態の管理
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(initialPlayer)
  );

  /**
   * 手を打つ
   */
  const makeMove = useCallback((position: BoardPosition) => {
    setGameState(prevState => {
      // ゲームが終了している場合は何もしない
      if (prevState.gameStatus !== "playing") {
        return prevState;
      }

      // 新しいゲーム状態を計算
      return updateGameState(prevState, position);
    });
  }, []);

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(
    (startingPlayer?: Player) => {
      const player = startingPlayer || initialPlayer;
      setGameState(createInitialGameState(player));
    },
    [initialPlayer]
  );

  /**
   * 指定位置に手を打てるかチェック
   */
  const canMakeMove = useCallback(
    (position: BoardPosition) => {
      return (
        gameState.gameStatus === "playing" && gameState.board[position] === null
      );
    },
    [gameState.board, gameState.gameStatus]
  );

  /**
   * ゲームが終了しているかどうか
   */
  const isGameFinished = gameState.gameStatus !== "playing";

  return {
    gameState,
    makeMove,
    resetGame,
    isGameFinished,
    canMakeMove,
  };
}

export default useGame;
