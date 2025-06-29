/**
 * 棋譜再生機能のカスタムフック
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialGameState, updateGameState } from "../lib/gameLogic";
import type { GameRecord, GameState } from "../types/game";
import type {
  ReplayState,
  ReplayControls,
  ReplaySpeed,
  ReplayStatus,
  UseGameReplayReturn,
} from "../types/replay";

export function useGameReplay(
  gameRecord: GameRecord | null
): UseGameReplayReturn {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [status, setStatus] = useState<ReplayStatus>("idle");
  const [speed, setSpeed] = useState<ReplaySpeed>(1);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState()
  );
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 総手数と進捗率の計算
  const totalMoves = gameRecord?.moves.length ?? 0;
  const progress =
    totalMoves > 0 ? ((currentMoveIndex + 1) / totalMoves) * 100 : 0;

  // 再生状態オブジェクト
  const replayState: ReplayState = {
    currentMoveIndex,
    status,
    speed,
    gameState,
    totalMoves,
    progress: Math.min(100, Math.max(0, progress)),
  };

  // 指定した手順まで状態を構築
  const buildGameStateToMove = useCallback(
    (targetMoveIndex: number): GameState => {
      if (!gameRecord) {
        return createInitialGameState();
      }

      let state = createInitialGameState();

      // targetMoveIndex まで手順を適用
      for (
        let i = 0;
        i <= targetMoveIndex && i < gameRecord.moves.length;
        i++
      ) {
        const move = gameRecord.moves[i];
        state = updateGameState(state, move.position);
      }

      return state;
    },
    [gameRecord]
  );

  // 特定の手順にジャンプ
  const goToMove = useCallback(
    (moveIndex: number) => {
      if (!gameRecord) return;

      const clampedIndex = Math.max(-1, Math.min(moveIndex, totalMoves - 1));
      setCurrentMoveIndex(clampedIndex);

      const newGameState = buildGameStateToMove(clampedIndex);
      setGameState(newGameState);

      // 最後の手に到達したら再生完了
      if (clampedIndex >= totalMoves - 1) {
        setStatus("completed");
      } else if (status === "completed") {
        setStatus("paused");
      }
    },
    [gameRecord, totalMoves, buildGameStateToMove, status]
  );

  // 次の手順に進む
  const nextMove = useCallback(() => {
    if (currentMoveIndex < totalMoves - 1) {
      goToMove(currentMoveIndex + 1);
    }
  }, [currentMoveIndex, totalMoves, goToMove]);

  // 前の手順に戻る
  const previousMove = useCallback(() => {
    if (currentMoveIndex >= 0) {
      goToMove(currentMoveIndex - 1);
    }
  }, [currentMoveIndex, goToMove]);

  // 再生開始
  const play = useCallback(() => {
    if (!gameRecord || currentMoveIndex >= totalMoves - 1) return;

    setStatus("playing");
  }, [gameRecord, currentMoveIndex, totalMoves]);

  // 一時停止
  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  // リセット
  const reset = useCallback(() => {
    setCurrentMoveIndex(-1);
    setStatus("idle");
    setGameState(createInitialGameState());
  }, []);

  // 再生速度変更
  const setReplaySpeed = useCallback((newSpeed: ReplaySpeed) => {
    setSpeed(newSpeed);
  }, []);

  // 自動再生のインターバル処理
  useEffect(() => {
    if (status === "playing") {
      const interval = 1000 / speed; // 速度に応じたインターバル

      intervalRef.current = setInterval(() => {
        setCurrentMoveIndex(prevIndex => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= totalMoves) {
            setStatus("completed");
            return prevIndex;
          }

          return nextIndex;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, speed, totalMoves]);

  // 手順変更時のゲーム状態更新
  useEffect(() => {
    if (gameRecord) {
      const newGameState = buildGameStateToMove(currentMoveIndex);
      setGameState(newGameState);
    }
  }, [currentMoveIndex, gameRecord, buildGameStateToMove]);

  // ゲーム記録変更時のリセット
  useEffect(() => {
    reset();
    setError(null);

    if (!gameRecord) {
      setError("ゲーム記録が見つかりません");
    }
  }, [gameRecord, reset]);

  // コントロールオブジェクト
  const controls: ReplayControls = {
    play,
    pause,
    reset,
    goToMove,
    nextMove,
    previousMove,
    setSpeed: setReplaySpeed,
  };

  return {
    replayState,
    controls,
    isLoading,
    error,
  };
}
