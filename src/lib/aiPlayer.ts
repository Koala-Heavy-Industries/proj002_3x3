/**
 * AI プレイヤー実装
 * Phase 3: ランダムAI実装
 */

import { BoardCell, BoardPosition, Player } from "../types/common/game";

/**
 * AIプレイヤークラス
 * 現在はランダム手選択のみ実装
 */
export class AIPlayer {
  private difficulty: "easy" | "medium" | "hard";

  constructor(difficulty: "easy" | "medium" | "hard" = "easy") {
    this.difficulty = difficulty;
  }

  /**
   * 次の手を決定する
   * @param board 現在のボード状態
   * @param player AIのプレイヤー (X または O)
   * @returns 選択された位置 (0-8)
   */
  public getNextMove(board: BoardCell[]): BoardPosition {
    switch (this.difficulty) {
      case "easy":
        return this.getRandomMove(board);
      case "medium":
        // TODO: Phase 4で中級AI実装予定
        return this.getRandomMove(board);
      case "hard":
        // TODO: Phase 4で上級AI実装予定
        return this.getRandomMove(board);
      default:
        return this.getRandomMove(board);
    }
  }

  /**
   * ランダムに空いているマスを選択
   * @param board 現在のボード状態
   * @returns ランダムに選択された空きマスの位置
   */
  private getRandomMove(board: BoardCell[]): BoardPosition {
    // 空いているマスの位置を取得
    const availableMoves = this.getAvailableMoves(board);

    if (availableMoves.length === 0) {
      throw new Error("No available moves on the board");
    }

    // ランダムに選択
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  /**
   * 空いているマスの位置リストを取得
   * @param board 現在のボード状態
   * @returns 空きマスの位置配列
   */
  private getAvailableMoves(board: BoardCell[]): BoardPosition[] {
    const availableMoves: BoardPosition[] = [];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        availableMoves.push(i as BoardPosition);
      }
    }

    return availableMoves;
  }

  /**
   * AI難易度を変更
   * @param difficulty 新しい難易度
   */
  public setDifficulty(difficulty: "easy" | "medium" | "hard"): void {
    this.difficulty = difficulty;
  }

  /**
   * 現在の難易度を取得
   * @returns 現在の難易度
   */
  public getDifficulty(): "easy" | "medium" | "hard" {
    return this.difficulty;
  }
}

/**
 * デフォルトのAIプレイヤーインスタンス
 */
export const defaultAIPlayer = new AIPlayer("easy");

/**
 * ヘルパー関数: 指定されたAI設定で次の手を取得
 * @param board 現在のボード状態
 * @param player AIのプレイヤー
 * @param difficulty AI難易度
 * @returns 選択された位置
 */
export function getAIMove(
  board: BoardCell[],
  player: Player,
  difficulty: "easy" | "medium" | "hard" = "easy"
): BoardPosition {
  const ai = new AIPlayer(difficulty);
  return ai.getNextMove(board);
}
