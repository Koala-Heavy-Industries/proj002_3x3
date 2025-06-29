/**
 * useGameHistory フックのテスト
 */

import { renderHook, act } from "@testing-library/react";
import { useGameHistory } from "../useGameHistory";
import { gameRepository } from "../../lib/repository";
import type { GameRecord } from "../../types/game";

// リポジトリのモック
jest.mock("../../lib/repository", () => ({
  gameRepository: {
    loadGames: jest.fn(),
    saveGame: jest.fn(),
    deleteGame: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const mockGameRepository = gameRepository as jest.Mocked<typeof gameRepository>;

// コンソールエラーのモック
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("useGameHistory", () => {
  const mockGames: GameRecord[] = [
    {
      id: "game1",
      timestamp: 1640995200000,
      gameMode: "pvp",
      moves: [
        { player: "X", position: 0, timestamp: 1640995201000 },
        { player: "O", position: 1, timestamp: 1640995202000 },
        { player: "X", position: 4, timestamp: 1640995203000 },
      ],
      result: "X",
      duration: 30,
      playerXStarts: true,
    },
    {
      id: "game2",
      timestamp: 1640995300000,
      gameMode: "pvc",
      moves: [
        { player: "X", position: 4, timestamp: 1640995301000 },
        { player: "O", position: 0, timestamp: 1640995302000 },
      ],
      result: "draw",
      duration: 45,
      playerXStarts: true,
    },
    {
      id: "game3",
      timestamp: 1640995400000,
      gameMode: "pvp",
      moves: [
        { player: "X", position: 0, timestamp: 1640995401000 },
        { player: "O", position: 4, timestamp: 1640995402000 },
      ],
      result: "O",
      duration: 60,
      playerXStarts: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGameRepository.loadGames.mockResolvedValue(mockGames);
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("初期化", () => {
    it("初期読み込み時にゲーム履歴を取得する", async () => {
      const { result } = renderHook(() => useGameHistory());

      // 初期状態
      expect(result.current.isLoading).toBe(true);
      expect(result.current.games).toEqual([]);

      // データ読み込み完了まで待機
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.games).toEqual(mockGames);
      expect(mockGameRepository.loadGames).toHaveBeenCalledTimes(1);
    });

    it("読み込みエラー時はエラー状態を設定する", async () => {
      const errorMessage = "Network error";
      mockGameRepository.loadGames.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.games).toEqual([]);
    });
  });

  describe("統計計算", () => {
    it("正しい統計情報を計算する", async () => {
      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const { stats } = result.current;

      expect(stats.totalGames).toBe(3);
      expect(stats.wins.X).toBe(1);
      expect(stats.wins.O).toBe(1);
      expect(stats.draws).toBe(1);
      expect(stats.averageDuration).toBe(45); // (30 + 45 + 60) / 3
      expect(stats.longestGame).toBe(60);
      expect(stats.shortestGame).toBe(30);
    });

    it("ゲームが0件の場合の統計を計算する", async () => {
      mockGameRepository.loadGames.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const { stats } = result.current;

      expect(stats.totalGames).toBe(0);
      expect(stats.wins.X).toBe(0);
      expect(stats.wins.O).toBe(0);
      expect(stats.draws).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.longestGame).toBe(0);
      expect(stats.shortestGame).toBe(0);
    });
  });

  describe("saveGame", () => {
    it("ゲームを保存してリフレッシュする", async () => {
      const { result } = renderHook(() => useGameHistory());

      // 初期読み込み完了まで待機
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const newGame: GameRecord = {
        id: "new-game",
        timestamp: Date.now(),
        gameMode: "pvp",
        moves: [],
        result: "X",
        duration: 10,
        playerXStarts: true,
      };

      // saveGame のモック設定
      mockGameRepository.saveGame.mockResolvedValueOnce(undefined);
      mockGameRepository.loadGames.mockResolvedValueOnce([
        newGame,
        ...mockGames,
      ]);

      await act(async () => {
        await result.current.saveGame(newGame);
      });

      expect(mockGameRepository.saveGame).toHaveBeenCalledWith(newGame);
      expect(mockGameRepository.loadGames).toHaveBeenCalledTimes(2); // 初期 + refresh
      expect(result.current.games).toHaveLength(4);
    });

    it("保存エラー時はエラーを設定して例外を投げる", async () => {
      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const errorMessage = "Save failed";
      mockGameRepository.saveGame.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newGame: GameRecord = {
        id: "new-game",
        timestamp: Date.now(),
        gameMode: "pvp",
        moves: [],
        result: "X",
        duration: 10,
        playerXStarts: true,
      };

      await act(async () => {
        await expect(result.current.saveGame(newGame)).rejects.toThrow(
          errorMessage
        );
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("deleteGame", () => {
    it("ゲームを削除してリフレッシュする", async () => {
      const { result } = renderHook(() => useGameHistory());

      // 初期読み込み完了まで待機
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const remainingGames = mockGames.filter(g => g.id !== "game2");
      mockGameRepository.deleteGame.mockResolvedValueOnce(undefined);
      mockGameRepository.loadGames.mockResolvedValueOnce(remainingGames);

      await act(async () => {
        await result.current.deleteGame("game2");
      });

      expect(mockGameRepository.deleteGame).toHaveBeenCalledWith("game2");
      expect(mockGameRepository.loadGames).toHaveBeenCalledTimes(2);
      expect(result.current.games).toHaveLength(2);
    });

    it("削除エラー時はエラーを設定して例外を投げる", async () => {
      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const errorMessage = "Delete failed";
      mockGameRepository.deleteGame.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await act(async () => {
        await expect(result.current.deleteGame("game1")).rejects.toThrow(
          errorMessage
        );
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("clearAllGames", () => {
    it("すべてのゲームを削除してリフレッシュする", async () => {
      const { result } = renderHook(() => useGameHistory());

      // 初期読み込み完了まで待機
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockGameRepository.clearAll.mockResolvedValueOnce(undefined);
      mockGameRepository.loadGames.mockResolvedValueOnce([]);

      await act(async () => {
        await result.current.clearAllGames();
      });

      expect(mockGameRepository.clearAll).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.loadGames).toHaveBeenCalledTimes(2);
      expect(result.current.games).toEqual([]);
    });

    it("全削除エラー時はエラーを設定して例外を投げる", async () => {
      const { result } = renderHook(() => useGameHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const errorMessage = "Clear all failed";
      mockGameRepository.clearAll.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await act(async () => {
        await expect(result.current.clearAllGames()).rejects.toThrow(
          errorMessage
        );
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("refreshGames", () => {
    it("手動でゲーム履歴をリフレッシュできる", async () => {
      const { result } = renderHook(() => useGameHistory());

      // 初期読み込み完了まで待機
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // 新しいデータでモック更新
      const newMockGames = [
        ...mockGames,
        {
          id: "refresh-game",
          timestamp: Date.now(),
          gameMode: "pvp" as const,
          moves: [],
          result: "X" as const,
          duration: 15,
          playerXStarts: true,
        },
      ];
      mockGameRepository.loadGames.mockResolvedValueOnce(newMockGames);

      await act(async () => {
        await result.current.refreshGames();
      });

      expect(mockGameRepository.loadGames).toHaveBeenCalledTimes(2);
      expect(result.current.games).toHaveLength(4);
    });
  });
});
