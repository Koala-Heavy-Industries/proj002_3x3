/**
 * ホームページ（メインページ）のテスト
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";

// useGameHistoryフックのモック
const mockUseGameHistory = {
  games: [],
  stats: {
    totalGames: 0,
    wins: { X: 0, O: 0 },
    draws: 0,
    averageDuration: 0,
    longestGame: 0,
    shortestGame: 0,
  },
  isLoading: false,
  error: null,
  saveGame: jest.fn(),
  deleteGame: jest.fn(),
  clearAllGames: jest.fn(),
  refreshGames: jest.fn(),
};

jest.mock("../../hooks/useGameHistory", () => ({
  useGameHistory: () => mockUseGameHistory,
}));

describe("Home (Main Page)", () => {
  describe("初期表示", () => {
    it("ページタイトルとヘッダーが表示される", () => {
      render(<Home />);

      expect(screen.getByText("三目並べ")).toBeInTheDocument();
      expect(
        screen.getByText("シンプルで楽しい3x3の三目並べゲーム")
      ).toBeInTheDocument();
    });

    it("ゲームボードが表示される", () => {
      render(<Home />);

      // GameBoardコンポーネントが表示されていることを確認
      expect(screen.getByText("プレイヤー X のターン")).toBeInTheDocument();

      // 9個のセルボタンが表示されていることを確認
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });
      expect(cells).toHaveLength(9);
    });

    it("ゲーム統計セクションが表示される", () => {
      render(<Home />);

      expect(screen.getByText("ゲーム統計")).toBeInTheDocument();
      expect(screen.getByText("表示")).toBeInTheDocument();
    });

    it("フッターが表示される", () => {
      render(<Home />);

      expect(
        screen.getByText("Next.js + TypeScript + Tailwind CSS で作成")
      ).toBeInTheDocument();
    });
  });

  describe("統計表示機能", () => {
    it("統計表示ボタンをクリックすると統計が表示される", () => {
      render(<Home />);

      // 最初は統計詳細が非表示
      expect(screen.queryByText("総ゲーム数:")).not.toBeInTheDocument();

      // 表示ボタンをクリック
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);

      // 統計詳細が表示される
      expect(screen.getByText("総ゲーム数:")).toBeInTheDocument();
      expect(screen.getByText("X の勝利:")).toBeInTheDocument();
      expect(screen.getByText("O の勝利:")).toBeInTheDocument();
      expect(screen.getByText("引き分け:")).toBeInTheDocument();

      // ボタンテキストが変更される
      expect(screen.getByText("非表示")).toBeInTheDocument();
    });

    it("統計を非表示にできる", () => {
      render(<Home />);

      // 統計を表示
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);
      expect(screen.getByText("総ゲーム数:")).toBeInTheDocument();

      // 非表示ボタンをクリック
      const hideButton = screen.getByText("非表示");
      fireEvent.click(hideButton);

      // 統計詳細が非表示になる
      expect(screen.queryByText("総ゲーム数:")).not.toBeInTheDocument();
      expect(screen.getByText("表示")).toBeInTheDocument();
    });
  });

  describe("統計表示の基本機能", () => {
    it("統計データが正しく表示される", () => {
      // モックデータを更新
      mockUseGameHistory.stats = {
        totalGames: 5,
        wins: { X: 3, O: 1 },
        draws: 1,
        averageDuration: 30,
        longestGame: 45,
        shortestGame: 15,
      };

      render(<Home />);

      // 統計を表示
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);

      // 統計データが表示されることを確認
      expect(screen.getByText("総ゲーム数:")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument(); // 総ゲーム数
      expect(screen.getByText("X の勝利:")).toBeInTheDocument();
      expect(screen.getByText("O の勝利:")).toBeInTheDocument();
      expect(screen.getByText("引き分け:")).toBeInTheDocument();
    });
  });

  describe("レスポンシブ・アクセシビリティ", () => {
    beforeEach(() => {
      // テスト前にモックをリセット
      mockUseGameHistory.stats = {
        totalGames: 0,
        wins: { X: 0, O: 0 },
        draws: 0,
        averageDuration: 0,
        longestGame: 0,
        shortestGame: 0,
      };
    });

    it("適切なHTML構造が使用されている", () => {
      render(<Home />);

      // セマンティックなHTML要素が使用されていることを確認
      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument(); // main
      expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
    });

    it("見出しの階層が適切である", () => {
      render(<Home />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("三目並べ");

      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent("ゲーム統計");
    });
  });
});
