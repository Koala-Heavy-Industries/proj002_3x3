/**
 * ゲームロジック関数のテスト
 */

import {
  initializeBoard,
  isValidMove,
  makeMove,
  checkWinner,
  checkDraw,
  getGameStatus,
  getNextPlayer,
  getAvailablePositions,
  updateGameState,
  createInitialGameState,
} from "../gameLogic";
import type { BoardCell, Player, GameState } from "../../types/game";

describe("gameLogic", () => {
  describe("initializeBoard", () => {
    it("should create an empty board with 9 null cells", () => {
      const board = initializeBoard();
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
    });
  });

  describe("isValidMove", () => {
    it("should return true for empty cell", () => {
      const board = initializeBoard();
      expect(isValidMove(board, 0)).toBe(true);
      expect(isValidMove(board, 4)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
    });

    it("should return false for occupied cell", () => {
      const board: BoardCell[] = [
        "X",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      expect(isValidMove(board, 0)).toBe(false);
    });

    it("should handle all valid positions", () => {
      const board = initializeBoard();
      for (let i = 0; i < 9; i++) {
        expect(isValidMove(board, i as any)).toBe(true);
      }
    });
  });

  describe("makeMove", () => {
    it("should place player mark on empty cell", () => {
      const board = initializeBoard();
      const newBoard = makeMove(board, 0, "X");
      expect(newBoard[0]).toBe("X");
      expect(newBoard[1]).toBe(null);
    });

    it("should not mutate original board", () => {
      const board = initializeBoard();
      const newBoard = makeMove(board, 0, "X");
      expect(board[0]).toBe(null);
      expect(newBoard[0]).toBe("X");
    });

    it("should throw error for invalid move", () => {
      const board: BoardCell[] = [
        "X",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      expect(() => makeMove(board, 0, "O")).toThrow(
        "Invalid move: position 0 is not available"
      );
    });
  });

  describe("checkWinner", () => {
    it("should detect horizontal win - top row", () => {
      const board: BoardCell[] = [
        "X",
        "X",
        "X",
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [0, 1, 2],
        player: "X",
      });
    });

    it("should detect horizontal win - middle row", () => {
      const board: BoardCell[] = [
        null,
        null,
        null,
        "O",
        "O",
        "O",
        null,
        null,
        null,
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [3, 4, 5],
        player: "O",
      });
    });

    it("should detect horizontal win - bottom row", () => {
      const board: BoardCell[] = [
        null,
        null,
        null,
        null,
        null,
        null,
        "X",
        "X",
        "X",
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [6, 7, 8],
        player: "X",
      });
    });

    it("should detect vertical win - left column", () => {
      const board: BoardCell[] = [
        "X",
        null,
        null,
        "X",
        null,
        null,
        "X",
        null,
        null,
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [0, 3, 6],
        player: "X",
      });
    });

    it("should detect vertical win - middle column", () => {
      const board: BoardCell[] = [
        null,
        "O",
        null,
        null,
        "O",
        null,
        null,
        "O",
        null,
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [1, 4, 7],
        player: "O",
      });
    });

    it("should detect vertical win - right column", () => {
      const board: BoardCell[] = [
        null,
        null,
        "X",
        null,
        null,
        "X",
        null,
        null,
        "X",
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [2, 5, 8],
        player: "X",
      });
    });

    it("should detect diagonal win - top-left to bottom-right", () => {
      const board: BoardCell[] = [
        "X",
        null,
        null,
        null,
        "X",
        null,
        null,
        null,
        "X",
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [0, 4, 8],
        player: "X",
      });
    });

    it("should detect diagonal win - top-right to bottom-left", () => {
      const board: BoardCell[] = [
        null,
        null,
        "O",
        null,
        "O",
        null,
        "O",
        null,
        null,
      ];
      const winner = checkWinner(board);
      expect(winner).toEqual({
        positions: [2, 4, 6],
        player: "O",
      });
    });

    it("should return null when no winner", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      const winner = checkWinner(board);
      expect(winner).toBe(null);
    });

    it("should return null for empty board", () => {
      const board = initializeBoard();
      const winner = checkWinner(board);
      expect(winner).toBe(null);
    });
  });

  describe("checkDraw", () => {
    it("should return true when board is full with no winner", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      expect(checkDraw(board)).toBe(true);
    });

    it("should return false when board has empty cells", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "O", "X", null];
      expect(checkDraw(board)).toBe(false);
    });

    it("should return false when there is a winner", () => {
      const board: BoardCell[] = [
        "X",
        "X",
        "X",
        "O",
        "O",
        null,
        null,
        null,
        null,
      ];
      expect(checkDraw(board)).toBe(false);
    });

    it("should return false for empty board", () => {
      const board = initializeBoard();
      expect(checkDraw(board)).toBe(false);
    });
  });

  describe("getGameStatus", () => {
    it("should return 'finished' when there is a winner", () => {
      const board: BoardCell[] = [
        "X",
        "X",
        "X",
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      expect(getGameStatus(board)).toBe("finished");
    });

    it("should return 'draw' when board is full with no winner", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      expect(getGameStatus(board)).toBe("draw");
    });

    it("should return 'playing' when game is ongoing", () => {
      const board: BoardCell[] = [
        "X",
        "O",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      expect(getGameStatus(board)).toBe("playing");
    });

    it("should return 'playing' for empty board", () => {
      const board = initializeBoard();
      expect(getGameStatus(board)).toBe("playing");
    });
  });

  describe("getNextPlayer", () => {
    it("should return 'O' when current player is 'X'", () => {
      expect(getNextPlayer("X")).toBe("O");
    });

    it("should return 'X' when current player is 'O'", () => {
      expect(getNextPlayer("O")).toBe("X");
    });
  });

  describe("getAvailablePositions", () => {
    it("should return all positions for empty board", () => {
      const board = initializeBoard();
      const positions = getAvailablePositions(board);
      expect(positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should return only empty positions", () => {
      const board: BoardCell[] = [
        "X",
        null,
        "O",
        null,
        "X",
        null,
        null,
        null,
        null,
      ];
      const positions = getAvailablePositions(board);
      expect(positions).toEqual([1, 3, 5, 6, 7, 8]);
    });

    it("should return empty array for full board", () => {
      const board: BoardCell[] = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      const positions = getAvailablePositions(board);
      expect(positions).toEqual([]);
    });
  });

  describe("updateGameState", () => {
    it("should update game state with valid move", () => {
      const initialState = createInitialGameState("X");
      const newState = updateGameState(initialState, 0);

      expect(newState.board[0]).toBe("X");
      expect(newState.currentPlayer).toBe("O");
      expect(newState.gameStatus).toBe("playing");
      expect(newState.moves).toHaveLength(1);
      expect(newState.moves[0]).toEqual({
        player: "X",
        position: 0,
        timestamp: expect.any(Number),
      });
    });

    it("should not change state for invalid move", () => {
      const initialState = createInitialGameState("X");
      const stateAfterMove = updateGameState(initialState, 0);
      const stateAfterInvalidMove = updateGameState(stateAfterMove, 0);

      expect(stateAfterInvalidMove).toEqual(stateAfterMove);
    });

    it("should detect win and set correct game status", () => {
      let gameState = createInitialGameState("X");

      // X wins with top row
      gameState = updateGameState(gameState, 0); // X
      gameState = updateGameState(gameState, 3); // O
      gameState = updateGameState(gameState, 1); // X
      gameState = updateGameState(gameState, 4); // O
      gameState = updateGameState(gameState, 2); // X wins

      expect(gameState.gameStatus).toBe("finished");
      expect(gameState.winner).toBe("X");
      expect(gameState.currentPlayer).toBe("X"); // Should not change after game ends
    });

    it("should detect draw", () => {
      // Test draw detection with a manually constructed draw board
      // Board: O X O / X X O / O O X (verified draw pattern)
      const drawBoard: BoardCell[] = [
        "O",
        "X",
        "O",
        "X",
        "X",
        "O",
        "O",
        "O",
        "X",
      ];

      expect(checkWinner(drawBoard)).toBe(null);
      expect(checkDraw(drawBoard)).toBe(true);
      expect(getGameStatus(drawBoard)).toBe("draw");
    });

    it("should track move history correctly", () => {
      let gameState = createInitialGameState("X");
      const timestamp1 = Date.now();

      gameState = updateGameState(gameState, 0);
      gameState = updateGameState(gameState, 4);

      expect(gameState.moves).toHaveLength(2);
      expect(gameState.moves[0].player).toBe("X");
      expect(gameState.moves[0].position).toBe(0);
      expect(gameState.moves[0].timestamp).toBeGreaterThanOrEqual(timestamp1);
      expect(gameState.moves[1].player).toBe("O");
      expect(gameState.moves[1].position).toBe(4);
    });
  });

  describe("createInitialGameState", () => {
    it("should create initial state with X as default starting player", () => {
      const state = createInitialGameState();

      expect(state.board).toEqual(initializeBoard());
      expect(state.currentPlayer).toBe("X");
      expect(state.gameStatus).toBe("playing");
      expect(state.winner).toBe(null);
      expect(state.moves).toEqual([]);
    });

    it("should create initial state with specified starting player", () => {
      const state = createInitialGameState("O");

      expect(state.currentPlayer).toBe("O");
      expect(state.gameStatus).toBe("playing");
    });
  });

  describe("Integration tests", () => {
    it("should play a complete game with X winning", () => {
      let gameState = createInitialGameState("X");

      // Game: X wins with diagonal
      const moves = [
        { pos: 0, expectedPlayer: "X" }, // X
        { pos: 1, expectedPlayer: "O" }, // O
        { pos: 4, expectedPlayer: "X" }, // X
        { pos: 2, expectedPlayer: "O" }, // O
        { pos: 8, expectedPlayer: "X" }, // X wins
      ];

      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        expect(gameState.currentPlayer).toBe(move.expectedPlayer);
        gameState = updateGameState(gameState, move.pos);
      }

      expect(gameState.gameStatus).toBe("finished");
      expect(gameState.winner).toBe("X");
      expect(gameState.moves).toHaveLength(5);
    });

    it("should play a complete game ending in draw", () => {
      // Test updateGameState with a board that results in draw after final move
      let gameState = createInitialGameState("X");

      // Start with a near-draw board and make the final move
      // Board before final move: O X O / X X O / O O -
      gameState.board = ["O", "X", "O", "X", "X", "O", "O", "O", null];
      gameState.currentPlayer = "X";
      gameState.moves = []; // Don't care about move history for this test

      // Make the final move that should result in draw
      const finalState = updateGameState(gameState, 8);

      expect(finalState.gameStatus).toBe("draw");
      expect(finalState.winner).toBe(null);
    });
  });
});
