/**
 * LocalStorageRepository のテスト
 */

import { LocalStorageRepository } from "../repository";
import type { GameRecord } from "../../types/game";

// localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// グローバルのlocalStorageをモックに置き換え
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// コンソールエラーのモック
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("LocalStorageRepository", () => {
  let repository: LocalStorageRepository;
  
  const mockGameRecord: GameRecord = {
    id: "test-game-1",
    timestamp: 1640995200000, // 2022-01-01 00:00:00 UTC
    gameMode: "pvp",
    moves: [
      { player: "X", position: 0, timestamp: 1640995201000 },
      { player: "O", position: 1, timestamp: 1640995202000 },
      { player: "X", position: 4, timestamp: 1640995203000 },
    ],
    result: "X",
    duration: 30,
    playerXStarts: true,
  };

  beforeEach(() => {
    repository = new LocalStorageRepository();
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("saveGame", () => {
    it("新規ゲームを保存できる", async () => {
      await repository.saveGame(mockGameRecord);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "tic-tac-toe-games",
        JSON.stringify([mockGameRecord])
      );
    });

    it("既存ゲームを更新できる", async () => {
      // 最初に保存
      await repository.saveGame(mockGameRecord);
      
      // 同じIDで更新
      const updatedGame = { ...mockGameRecord, duration: 45 };
      await repository.saveGame(updatedGame);

      const games = await repository.loadGames();
      expect(games).toHaveLength(1);
      expect(games[0].duration).toBe(45);
    });

    it("複数ゲームをタイムスタンプ順で保存する", async () => {
      const game1 = { ...mockGameRecord, id: "game1", timestamp: 1000 };
      const game2 = { ...mockGameRecord, id: "game2", timestamp: 2000 };
      
      await repository.saveGame(game1);
      await repository.saveGame(game2);

      const games = await repository.loadGames();
      expect(games).toHaveLength(2);
      expect(games[0].id).toBe("game2"); // 新しい順
      expect(games[1].id).toBe("game1");
    });

    it("localStorage エラー時に例外を投げる", async () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("Storage quota exceeded");
      });

      await expect(repository.saveGame(mockGameRecord)).rejects.toThrow(
        "ゲームの保存に失敗しました"
      );
    });
  });

  describe("loadGames", () => {
    it("空の場合は空配列を返す", async () => {
      const games = await repository.loadGames();
      expect(games).toEqual([]);
    });

    it("保存されたゲームを読み込める", async () => {
      localStorageMock.setItem(
        "tic-tac-toe-games",
        JSON.stringify([mockGameRecord])
      );

      const games = await repository.loadGames();
      expect(games).toEqual([mockGameRecord]);
    });

    it("不正なデータをフィルタリングする", async () => {
      const invalidData = [
        mockGameRecord,
        { id: "invalid", timestamp: "invalid" }, // 不正なデータ
        { ...mockGameRecord, id: "valid-2" },
      ];

      localStorageMock.setItem(
        "tic-tac-toe-games",
        JSON.stringify(invalidData)
      );

      const games = await repository.loadGames();
      expect(games).toHaveLength(2);
      expect(games.map(g => g.id)).toEqual(["test-game-1", "valid-2"]);
    });

    it("JSON パースエラー時は空配列を返す", async () => {
      localStorageMock.setItem("tic-tac-toe-games", "invalid json");

      const games = await repository.loadGames();
      expect(games).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load games:",
        expect.any(Error)
      );
    });
  });

  describe("deleteGame", () => {
    beforeEach(async () => {
      const games = [
        { ...mockGameRecord, id: "game1" },
        { ...mockGameRecord, id: "game2" },
        { ...mockGameRecord, id: "game3" },
      ];
      
      for (const game of games) {
        await repository.saveGame(game);
      }
    });

    it("指定したIDのゲームを削除できる", async () => {
      await repository.deleteGame("game2");

      const games = await repository.loadGames();
      expect(games).toHaveLength(2);
      expect(games.map(g => g.id)).toContain("game3");
      expect(games.map(g => g.id)).toContain("game1");
      expect(games.map(g => g.id)).not.toContain("game2");
    });

    it("存在しないIDを指定しても問題ない", async () => {
      await repository.deleteGame("non-existent");

      const games = await repository.loadGames();
      expect(games).toHaveLength(3);
    });

    it("localStorage エラー時に例外を投げる", async () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      await expect(repository.deleteGame("game1")).rejects.toThrow(
        "ゲームの削除に失敗しました"
      );
    });
  });

  describe("clearAll", () => {
    it("すべてのゲームを削除できる", async () => {
      await repository.saveGame(mockGameRecord);
      await repository.clearAll();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "tic-tac-toe-games"
      );

      const games = await repository.loadGames();
      expect(games).toEqual([]);
    });

    it("localStorage エラー時に例外を投げる", async () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      await expect(repository.clearAll()).rejects.toThrow(
        "すべてのゲームの削除に失敗しました"
      );
    });
  });

  describe("isValidGameRecord (private method test)", () => {
    it("有効なゲーム記録を認識する", async () => {
      await repository.saveGame(mockGameRecord);
      const games = await repository.loadGames();
      expect(games).toHaveLength(1);
    });

    it("無効なゲーム記録を除外する", async () => {
      const invalidRecords = [
        null,
        undefined,
        {},
        { id: "test" }, // 必須フィールド不足
        { ...mockGameRecord, gameMode: "invalid" }, // 無効なモード
        { ...mockGameRecord, result: "invalid" }, // 無効な結果
      ];

      // 直接localStorage に無効データを設定
      localStorageMock.setItem(
        "tic-tac-toe-games",
        JSON.stringify(invalidRecords)
      );

      const games = await repository.loadGames();
      expect(games).toEqual([]);
    });
  });
});