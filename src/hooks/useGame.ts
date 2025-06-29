/**
 * ゲーム状態管理フック
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  GameState,
  BoardPosition,
  Player,
  GameConfig,
  GameRecord,
} from "../types/common/game";
import { createInitialGameState, updateGameState } from "../lib/gameLogic";
import { getAIMove } from "../lib/aiPlayer";

export interface UseGameReturn {
  gameState: GameState;
  makeMove: (position: BoardPosition) => void;
  resetGame: (startingPlayer?: Player) => void;
  isGameFinished: boolean;
  canMakeMove: (position: BoardPosition) => boolean;
  gameMode: "pvp" | "pvc";
  setGameMode: (mode: "pvp" | "pvc") => void;
  isAITurn: boolean;
}

/**
 * ゲーム状態を管理するカスタムフック
 * @param config ゲーム設定（オプション）
 * @param onGameEnd ゲーム終了時のコールバック（棋譜記録用）
 * @returns ゲーム状態と操作関数
 */
export function useGame(
  config?: Partial<GameConfig>,
  onGameEnd?: (gameRecord: GameRecord) => void
): UseGameReturn {
  // 初期プレイヤーを設定（デフォルトはX）
  const initialPlayer: Player = config?.playerXStarts !== false ? "X" : "O";

  // ゲーム状態の管理
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(initialPlayer)
  );

  // ゲームモードの管理（デフォルトは人vs人）
  const [gameMode, setGameMode] = useState<"pvp" | "pvc">(
    config?.mode || "pvp"
  );

  // ゲーム開始時刻の記録
  const gameStartTime = useRef<number>(Date.now());
  

  // AIが O プレイヤーかどうか（PvCモードでは人間がX、AIがO）
  const aiPlayer: Player = "O";

  // 現在がAIのターンかどうか
  const isAITurn =
    gameMode === "pvc" &&
    gameState.currentPlayer === aiPlayer &&
    gameState.gameStatus === "playing";

  /**
   * 手を打って新しい状態を作成（共通処理）
   */
  const processMove = useCallback(
    (prevState: GameState, position: BoardPosition) => {
      const newState = updateGameState(prevState, position);
      return newState;
    },
    []
  );

  /**
   * ゲーム終了時のコールバック実行
   */
  const handleGameEnd = useCallback(
    (finalGameState: GameState) => {
      if (onGameEnd && finalGameState.gameStatus !== "playing") {
        const gameRecord: GameRecord = {
          id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          timestamp: gameStartTime.current,
          gameMode,
          moves: finalGameState.moves,
          result: finalGameState.winner || "draw",
          duration: Math.floor((Date.now() - gameStartTime.current) / 1000),
          playerXStarts: initialPlayer === "X",
        };
        onGameEnd(gameRecord);
      }
    },
    [onGameEnd, gameMode, initialPlayer]
  );

  /**
   * AIの手を自動実行
   */
  useEffect(() => {
    if (isAITurn) {
      const timer = setTimeout(() => {
        try {
          const aiMove = getAIMove(
            gameState.board,
            aiPlayer,
            config?.aiDifficulty
          );
          setGameState(prevState => processMove(prevState, aiMove));
        } catch (error) {
          console.error("AI move failed:", error);
        }
      }, 500); // 0.5秒待ってからAIが手を打つ

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAITurn, handleGameEnd]);

  /**
   * 手を打つ（人間プレイヤー用）
   */
  const makeMove = useCallback(
    (position: BoardPosition) => {
      setGameState(prevState => {
        // ゲームが終了している場合は何もしない
        if (prevState.gameStatus !== "playing") {
          return prevState;
        }

        // PvCモードでAIのターンの場合は何もしない
        if (gameMode === "pvc" && prevState.currentPlayer === aiPlayer) {
          return prevState;
        }

        // 新しいゲーム状態を計算
        return processMove(prevState, position);
      });
    },
    [gameMode, aiPlayer, processMove]
  );

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(
    (startingPlayer?: Player) => {
      const player = startingPlayer || initialPlayer;
      setGameState(createInitialGameState(player));
      gameStartTime.current = Date.now(); // 新しいゲーム開始時刻を記録
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

  /**
   * ゲーム終了を監視（状態変化後に一度だけ実行）
   */
  useEffect(() => {
    if (isGameFinished) {
      handleGameEnd(gameState);
    }
  }, [isGameFinished]); // isGameFinishedが変わった時のみ実行


  return {
    gameState,
    makeMove,
    resetGame,
    isGameFinished,
    canMakeMove,
    gameMode,
    setGameMode,
    isAITurn,
  };
}

export default useGame;
