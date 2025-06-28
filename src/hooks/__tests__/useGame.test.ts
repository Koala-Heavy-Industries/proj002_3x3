/**
 * useGame フックのテスト
 */

import { renderHook, act } from "@testing-library/react";
import { useGame } from "../useGame";

describe("useGame", () => {
  describe("初期化", () => {
    it("デフォルトでXが先攻のゲーム状態を作成する", () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.gameState.currentPlayer).toBe("X");
      expect(result.current.gameState.gameStatus).toBe("playing");
      expect(result.current.gameState.winner).toBeNull();
      expect(result.current.gameState.board).toEqual(Array(9).fill(null));
      expect(result.current.gameState.moves).toEqual([]);
      expect(result.current.isGameFinished).toBe(false);
    });

    it("設定でOを先攻にできる", () => {
      const { result } = renderHook(() => useGame({ playerXStarts: false }));

      expect(result.current.gameState.currentPlayer).toBe("O");
    });
  });

  describe("makeMove", () => {
    it("有効な手を打つことができる", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.makeMove(0);
      });

      expect(result.current.gameState.board[0]).toBe("X");
      expect(result.current.gameState.currentPlayer).toBe("O");
      expect(result.current.gameState.moves).toHaveLength(1);
      expect(result.current.gameState.moves[0]).toMatchObject({
        player: "X",
        position: 0,
      });
    });

    it("既に置かれた位置には打てない", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.makeMove(0);
      });

      const boardAfterFirstMove = [...result.current.gameState.board];

      act(() => {
        result.current.makeMove(0);
      });

      expect(result.current.gameState.board).toEqual(boardAfterFirstMove);
      expect(result.current.gameState.currentPlayer).toBe("O");
    });

    it("ゲーム終了後は手を打てない", () => {
      const { result } = renderHook(() => useGame());

      // X の勝利パターンを作成
      act(() => {
        result.current.makeMove(0); // X
      });
      act(() => {
        result.current.makeMove(3); // O
      });
      act(() => {
        result.current.makeMove(1); // X
      });
      act(() => {
        result.current.makeMove(4); // O
      });
      act(() => {
        result.current.makeMove(2); // X wins
      });

      expect(result.current.gameState.gameStatus).toBe("finished");
      expect(result.current.isGameFinished).toBe(true);

      const boardAfterWin = [...result.current.gameState.board];

      act(() => {
        result.current.makeMove(5);
      });

      expect(result.current.gameState.board).toEqual(boardAfterWin);
    });
  });

  describe("canMakeMove", () => {
    it("空のセルには手を打てる", () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.canMakeMove(0)).toBe(true);
      expect(result.current.canMakeMove(4)).toBe(true);
      expect(result.current.canMakeMove(8)).toBe(true);
    });

    it("既に埋まったセルには手を打てない", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.makeMove(0);
      });

      expect(result.current.canMakeMove(0)).toBe(false);
    });

    it("ゲーム終了後は手を打てない", () => {
      const { result } = renderHook(() => useGame());

      // X の勝利パターンを作成
      act(() => {
        result.current.makeMove(0);
        result.current.makeMove(3);
        result.current.makeMove(1);
        result.current.makeMove(4);
        result.current.makeMove(2);
      });

      expect(result.current.canMakeMove(5)).toBe(false);
      expect(result.current.canMakeMove(6)).toBe(false);
    });
  });

  describe("resetGame", () => {
    it("ゲームを初期状態にリセットできる", () => {
      const { result } = renderHook(() => useGame());

      // いくつか手を打つ
      act(() => {
        result.current.makeMove(0);
        result.current.makeMove(1);
        result.current.makeMove(2);
      });

      // リセット
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameState.board).toEqual(Array(9).fill(null));
      expect(result.current.gameState.currentPlayer).toBe("X");
      expect(result.current.gameState.gameStatus).toBe("playing");
      expect(result.current.gameState.winner).toBeNull();
      expect(result.current.gameState.moves).toEqual([]);
      expect(result.current.isGameFinished).toBe(false);
    });

    it("リセット時に開始プレイヤーを指定できる", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.resetGame("O");
      });

      expect(result.current.gameState.currentPlayer).toBe("O");
    });
  });

  describe("勝利判定", () => {
    it("横一列で勝利する", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.makeMove(0); // X
        result.current.makeMove(3); // O
        result.current.makeMove(1); // X
        result.current.makeMove(4); // O
        result.current.makeMove(2); // X wins (0,1,2)
      });

      expect(result.current.gameState.gameStatus).toBe("finished");
      expect(result.current.gameState.winner).toBe("X");
      expect(result.current.isGameFinished).toBe(true);
    });

    it("引き分けを検出する", () => {
      const { result } = renderHook(() => useGame());

      // 引き分けパターンを作成
      act(() => {
        result.current.makeMove(0); // X
        result.current.makeMove(1); // O
        result.current.makeMove(2); // X
        result.current.makeMove(4); // O
        result.current.makeMove(3); // X
        result.current.makeMove(5); // O
        result.current.makeMove(7); // X
        result.current.makeMove(6); // O
        result.current.makeMove(8); // X
      });

      expect(result.current.gameState.gameStatus).toBe("draw");
      expect(result.current.gameState.winner).toBeNull();
      expect(result.current.isGameFinished).toBe(true);
    });
  });
});
