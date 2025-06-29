/**
 * GameBoard コンポーネントのテスト
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GameBoard } from "../GameBoard";

describe("GameBoard", () => {
  describe("初期表示", () => {
    it("3x3のグリッドが表示される", () => {
      render(<GameBoard />);

      // 9個のセルボタンが表示されていることを確認
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });
      expect(cells).toHaveLength(9);
    });

    it("初期状態でXのターンが表示される", () => {
      render(<GameBoard />);

      expect(screen.getByText("プレイヤー X のターン")).toBeInTheDocument();
    });

    it("リセットボタンが表示される", () => {
      render(<GameBoard />);

      expect(screen.getByText("リセット")).toBeInTheDocument();
    });

    it("ゲーム情報が表示される", () => {
      render(<GameBoard />);

      expect(screen.getByText("手数: 0")).toBeInTheDocument();
      expect(screen.getByText("先攻: X")).toBeInTheDocument();
    });
  });

  describe("設定による初期化", () => {
    it("Oを先攻にできる", () => {
      render(<GameBoard config={{ playerXStarts: false }} />);

      expect(screen.getByText("プレイヤー O のターン")).toBeInTheDocument();
      expect(screen.getByText("先攻: O")).toBeInTheDocument();
    });
  });

  describe("ゲームプレイ", () => {
    it("セルをクリックしてX/Oを配置できる", () => {
      render(<GameBoard />);

      const firstCell = screen.getByRole("button", { name: "セル 1" });
      fireEvent.click(firstCell);

      expect(firstCell).toHaveTextContent("X");
      expect(screen.getByText("プレイヤー O のターン")).toBeInTheDocument();
      expect(screen.getByText("手数: 1")).toBeInTheDocument();
    });

    it("既に配置されたセルはクリックできない", () => {
      render(<GameBoard />);

      const firstCell = screen.getByRole("button", { name: "セル 1" });

      // 最初のクリック
      fireEvent.click(firstCell);
      expect(firstCell).toHaveTextContent("X");

      // 同じセルを再度クリック
      fireEvent.click(firstCell);
      expect(firstCell).toHaveTextContent("X"); // 変わらない
      expect(screen.getByText("プレイヤー O のターン")).toBeInTheDocument(); // ターンも変わらない
    });

    it("プレイヤーが交互にプレイできる", () => {
      render(<GameBoard />);

      const cell1 = screen.getByRole("button", { name: "セル 1" });
      const cell2 = screen.getByRole("button", { name: "セル 2" });

      // Xのターン
      fireEvent.click(cell1);
      expect(cell1).toHaveTextContent("X");
      expect(screen.getByText("プレイヤー O のターン")).toBeInTheDocument();

      // Oのターン
      fireEvent.click(cell2);
      expect(cell2).toHaveTextContent("O");
      expect(screen.getByText("プレイヤー X のターン")).toBeInTheDocument();
    });
  });

  describe("勝利判定", () => {
    it("横一列で勝利した場合の表示", () => {
      render(<GameBoard />);

      // X が 0, 1, 2 で勝利
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });

      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X wins

      expect(screen.getByText("プレイヤー X の勝利！")).toBeInTheDocument();
      expect(screen.getByText("新しいゲーム")).toBeInTheDocument();
    });

    it("引き分けの場合の表示", () => {
      render(<GameBoard />);

      const cells = screen.getAllByRole("button", { name: /セル \d+/ });

      // 引き分けパターンを作成
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[1]); // O
      fireEvent.click(cells[2]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[3]); // X
      fireEvent.click(cells[5]); // O
      fireEvent.click(cells[7]); // X
      fireEvent.click(cells[6]); // O
      fireEvent.click(cells[8]); // X

      expect(screen.getByText("引き分け！")).toBeInTheDocument();
      expect(screen.getByText("新しいゲーム")).toBeInTheDocument();
    });
  });

  describe("リセット機能", () => {
    it("リセットボタンでゲームがリセットされる", () => {
      render(<GameBoard />);

      // いくつかの手を打つ
      const cell1 = screen.getByRole("button", { name: "セル 1" });
      const cell2 = screen.getByRole("button", { name: "セル 2" });

      fireEvent.click(cell1);
      fireEvent.click(cell2);

      expect(cell1).toHaveTextContent("X");
      expect(cell2).toHaveTextContent("O");
      expect(screen.getByText("手数: 2")).toBeInTheDocument();

      // リセット
      const resetButton = screen.getByText("リセット");
      fireEvent.click(resetButton);

      expect(cell1).toHaveTextContent("");
      expect(cell2).toHaveTextContent("");
      expect(screen.getByText("手数: 0")).toBeInTheDocument();
      expect(screen.getByText("プレイヤー X のターン")).toBeInTheDocument();
    });
  });

  describe("コールバック", () => {
    it("ゲーム終了時にonGameEndが呼ばれる", () => {
      const onGameEnd = jest.fn();
      render(<GameBoard onGameEnd={onGameEnd} />);

      // X が 0, 1, 2 で勝利
      const cells = screen.getAllByRole("button", { name: /セル \d+/ });

      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[3]); // O
      fireEvent.click(cells[1]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[2]); // X wins

      expect(onGameEnd).toHaveBeenCalledWith("X");
    });

    it("引き分け時にonGameEndが呼ばれる", () => {
      const onGameEnd = jest.fn();
      render(<GameBoard onGameEnd={onGameEnd} />);

      const cells = screen.getAllByRole("button", { name: /セル \d+/ });

      // 引き分けパターンを作成
      fireEvent.click(cells[0]); // X
      fireEvent.click(cells[1]); // O
      fireEvent.click(cells[2]); // X
      fireEvent.click(cells[4]); // O
      fireEvent.click(cells[3]); // X
      fireEvent.click(cells[5]); // O
      fireEvent.click(cells[7]); // X
      fireEvent.click(cells[6]); // O
      fireEvent.click(cells[8]); // X

      expect(onGameEnd).toHaveBeenCalledWith("draw");
    });
  });
});
