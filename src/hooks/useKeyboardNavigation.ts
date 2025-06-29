/**
 * キーボードナビゲーション用カスタムフック
 */

import { useState, useCallback, useEffect } from "react";
import type { BoardPosition } from "../types/common/game";
import type { UseKeyboardNavigationReturn } from "../types/client/hooks";

/**
 * ゲームボードのキーボードナビゲーションフック
 * @param gridSize - グリッドサイズ（3x3の場合は3）
 * @returns キーボードナビゲーション機能
 */
export function useKeyboardNavigation(
  gridSize: number = 3
): UseKeyboardNavigationReturn {
  const [currentPosition, setCurrentPosition] = useState<BoardPosition>(0);

  // 上に移動
  const moveUp = useCallback(() => {
    setCurrentPosition(prev => {
      const newRow = Math.floor(prev / gridSize) - 1;
      if (newRow < 0) return prev; // 上端の場合は移動しない
      return (newRow * gridSize + (prev % gridSize)) as BoardPosition;
    });
  }, [gridSize]);

  // 下に移動
  const moveDown = useCallback(() => {
    setCurrentPosition(prev => {
      const newRow = Math.floor(prev / gridSize) + 1;
      if (newRow >= gridSize) return prev; // 下端の場合は移動しない
      return (newRow * gridSize + (prev % gridSize)) as BoardPosition;
    });
  }, [gridSize]);

  // 左に移動
  const moveLeft = useCallback(() => {
    setCurrentPosition(prev => {
      const col = prev % gridSize;
      if (col === 0) return prev; // 左端の場合は移動しない
      return (prev - 1) as BoardPosition;
    });
  }, [gridSize]);

  // 右に移動
  const moveRight = useCallback(() => {
    setCurrentPosition(prev => {
      const col = prev % gridSize;
      if (col === gridSize - 1) return prev; // 右端の場合は移動しない
      return (prev + 1) as BoardPosition;
    });
  }, [gridSize]);

  // 現在位置を選択
  const selectCurrent = useCallback(() => {
    // この関数は外部で定義されたhandlerに委譲される
    return currentPosition;
  }, [currentPosition]);

  // 位置をリセット
  const resetPosition = useCallback(() => {
    setCurrentPosition(0);
  }, []);

  // キーボードイベントハンドラ
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          moveUp();
          break;
        case "ArrowDown":
          event.preventDefault();
          moveDown();
          break;
        case "ArrowLeft":
          event.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          moveRight();
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          // 実際の選択処理は外部で処理
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveUp, moveDown, moveLeft, moveRight]);

  return {
    currentPosition,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    selectCurrent,
    resetPosition,
  };
}

export default useKeyboardNavigation;
