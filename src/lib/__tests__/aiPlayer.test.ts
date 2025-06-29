/**
 * AIプレイヤーのテスト
 */

import { AIPlayer, getAIMove, defaultAIPlayer } from "../aiPlayer";
import type { BoardCell, BoardPosition, Player } from "../../types/common/game";

describe("AIPlayer", () => {
  let aiPlayer: AIPlayer;

  beforeEach(() => {
    aiPlayer = new AIPlayer("easy");
  });

  describe("constructor", () => {
    it("should create AI player with default difficulty", () => {
      const ai = new AIPlayer();
      expect(ai.getDifficulty()).toBe("easy");
    });

    it("should create AI player with specified difficulty", () => {
      const ai = new AIPlayer("medium");
      expect(ai.getDifficulty()).toBe("medium");
    });
  });

  describe("getNextMove", () => {
    it("should return a valid move position", () => {
      const board: BoardCell[] = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];

      const move = aiPlayer.getNextMove(board, "O");
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(8);
      expect(Number.isInteger(move)).toBe(true);
    });

    it("should only choose empty cells", () => {
      const board: BoardCell[] = [
        "X",
        "O",
        null,
        null,
        "X",
        null,
        "O",
        null,
        null,
      ];

      const move = aiPlayer.getNextMove(board, "O");
      const availablePositions = [2, 3, 5, 7, 8];
      expect(availablePositions).toContain(move);
    });

    it("should choose the last available cell when only one is left", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "X", "O", null];

      const move = aiPlayer.getNextMove(board, "O");
      expect(move).toBe(8);
    });

    it("should throw error when no moves are available", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];

      expect(() => {
        aiPlayer.getNextMove(board, "O");
      }).toThrow("No available moves on the board");
    });

    it("should work with both X and O players", () => {
      const board: BoardCell[] = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];

      const moveX = aiPlayer.getNextMove(board, "X");
      const moveO = aiPlayer.getNextMove(board, "O");

      expect(moveX).toBeGreaterThanOrEqual(0);
      expect(moveX).toBeLessThanOrEqual(8);
      expect(moveO).toBeGreaterThanOrEqual(0);
      expect(moveO).toBeLessThanOrEqual(8);
    });
  });

  describe("setDifficulty and getDifficulty", () => {
    it("should update difficulty setting", () => {
      expect(aiPlayer.getDifficulty()).toBe("easy");

      aiPlayer.setDifficulty("hard");
      expect(aiPlayer.getDifficulty()).toBe("hard");

      aiPlayer.setDifficulty("medium");
      expect(aiPlayer.getDifficulty()).toBe("medium");
    });
  });

  describe("randomness", () => {
    it("should make different moves given multiple attempts", () => {
      const board: BoardCell[] = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];

      const moves = new Set<BoardPosition>();

      // 10回試行して複数の異なる手を選ぶかテスト
      for (let i = 0; i < 10; i++) {
        const move = aiPlayer.getNextMove(board, "O");
        moves.add(move);
      }

      // 少なくとも2つ以上の異なる手が選ばれるはず
      expect(moves.size).toBeGreaterThan(1);
    });
  });

  describe("edge cases", () => {
    it("should handle board with various patterns", () => {
      const boards: BoardCell[][] = [
        // 中央のみ空き
        ["X", "O", "X", "O", null, "O", "X", "O", "X"],
        // 角のみ空き
        [null, "X", "O", "X", "O", "X", "O", "X", "O"],
        // 2つの空きがある場合
        ["X", "O", null, "O", "X", "O", "X", "O", null],
      ];

      boards.forEach((board, index) => {
        expect(() => {
          const move = aiPlayer.getNextMove(board, "O");
          expect(board[move]).toBeNull();
        }).not.toThrow();
      });
    });
  });
});

describe("getAIMove helper function", () => {
  it("should return valid move with default difficulty", () => {
    const board: BoardCell[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const move = getAIMove(board, "O");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it("should work with different difficulties", () => {
    const board: BoardCell[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const difficulties: ("easy" | "medium" | "hard")[] = [
      "easy",
      "medium",
      "hard",
    ];

    difficulties.forEach(difficulty => {
      const move = getAIMove(board, "O", difficulty);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(8);
    });
  });
});

describe("defaultAIPlayer", () => {
  it("should be initialized with easy difficulty", () => {
    expect(defaultAIPlayer.getDifficulty()).toBe("easy");
  });

  it("should be able to make moves", () => {
    const board: BoardCell[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const move = defaultAIPlayer.getNextMove(board, "O");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });
});
