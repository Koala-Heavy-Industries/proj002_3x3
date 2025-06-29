/**
 * ホームページ（メインページ）のテスト
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";

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

  describe("ゲーム統計の更新", () => {
    it("ゲーム完了時に統計が更新される", () => {
      render(<Home />);

      // 統計を表示
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);

      // 初期状態を確認（総ゲーム数の表示を確認）
      expect(screen.getByText("総ゲーム数:")).toBeInTheDocument();
      const totalGamesValue =
        screen.getByText("総ゲーム数:").nextElementSibling;
      expect(totalGamesValue).toHaveTextContent("0");

      // X が勝利するゲームをプレイ
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X wins (0,1,2)

      // 統計が更新されていることを確認
      const updatedTotalGames =
        screen.getByText("総ゲーム数:").nextElementSibling;
      expect(updatedTotalGames).toHaveTextContent("1");

      // X の勝利数が1になっていることを確認
      const xWinsValue = screen.getByText("X の勝利:").nextElementSibling;
      expect(xWinsValue).toHaveTextContent("1");
    });

    it("複数ゲーム後の統計が正確に表示される", () => {
      render(<Home />);

      // 統計を表示
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);

      // 1ゲーム目: Xの勝利
      let cells = screen.getAllByRole("button", { name: /セル \d+/ });
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X wins

      // 新しいゲームボタンをクリック
      const newGameButton = screen.getByText("新しいゲーム");
      fireEvent.click(newGameButton);

      // 2ゲーム目: Oの勝利
      cells = screen.getAllByRole("button", { name: /セル \d+/ });
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X
      fireEvent.click(cells[5]); // O wins (3,4,5)

      // 統計が正確に更新されていることを確認
      const finalTotalGames =
        screen.getByText("総ゲーム数:").nextElementSibling;
      expect(finalTotalGames).toHaveTextContent("2");
    });
  });

  describe("統計リセット機能", () => {
    it("統計をリセットできる", () => {
      render(<Home />);

      // 統計を表示
      const toggleButton = screen.getByText("表示");
      fireEvent.click(toggleButton);

      // ゲームをプレイして統計を作成
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X wins

      // リセットボタンが表示されることを確認
      const resetButton = screen.getByText("統計をリセット");
      expect(resetButton).toBeInTheDocument();

      // リセット実行
      fireEvent.click(resetButton);

      // 統計が初期状態に戻ることを確認
      const resetTotalGames =
        screen.getByText("総ゲーム数:").nextElementSibling;
      expect(resetTotalGames).toHaveTextContent("0");
    });
  });

  describe("レスポンシブ・アクセシビリティ", () => {
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
