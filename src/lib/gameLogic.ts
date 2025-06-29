/**
 * 三目並べのゲームロジック関数集
 */

import type {
  BoardCell,
  BoardPosition,
  Player,
  GameState,
  WinCondition,
  GameStatus,
} from "../types/game";

// 勝利パターンの定義（8パターン: 縦3、横3、斜め2）
const WINNING_PATTERNS: [BoardPosition, BoardPosition, BoardPosition][] = [
  // 横の勝利パターン
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // 縦の勝利パターン
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // 斜めの勝利パターン
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * ボードを初期化する
 * @returns 空のボード状態
 */
export function initializeBoard(): BoardCell[] {
  return Array(9).fill(null);
}

/**
 * 指定された位置への手が有効かどうかを判定
 * @param board 現在のボード状態
 * @param position 置こうとする位置
 * @returns 有効な手かどうか
 */
export function isValidMove(
  board: BoardCell[],
  position: BoardPosition
): boolean {
  // 位置が範囲内かつ、その位置が空かどうか
  return position >= 0 && position <= 8 && board[position] === null;
}

/**
 * ボードに手を打つ
 * @param board 現在のボード状態
 * @param position 置く位置
 * @param player プレイヤー
 * @returns 新しいボード状態
 */
export function makeMove(
  board: BoardCell[],
  position: BoardPosition,
  player: Player
): BoardCell[] {
  if (!isValidMove(board, position)) {
    throw new Error(`Invalid move: position ${position} is not available`);
  }

  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

/**
 * 勝者を判定する
 * @param board 現在のボード状態
 * @returns 勝者の情報（勝者がいない場合はnull）
 */
export function checkWinner(board: BoardCell[]): WinCondition | null {
  for (const pattern of WINNING_PATTERNS) {
    const [a, b, c] = pattern;
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];

    // 3つのセルが同じプレイヤーで埋まっているかチェック
    if (cellA && cellA === cellB && cellB === cellC) {
      return {
        positions: pattern,
        player: cellA,
      };
    }
  }

  return null;
}

/**
 * 引き分けかどうかを判定
 * @param board 現在のボード状態
 * @returns 引き分けかどうか
 */
export function checkDraw(board: BoardCell[]): boolean {
  // 勝者がおらず、全てのセルが埋まっている場合は引き分け
  return !checkWinner(board) && board.every(cell => cell !== null);
}

/**
 * ゲームの状態を判定
 * @param board 現在のボード状態
 * @returns ゲーム状態
 */
export function getGameStatus(board: BoardCell[]): GameStatus {
  const winner = checkWinner(board);
  if (winner) {
    return "finished";
  }

  if (checkDraw(board)) {
    return "draw";
  }

  return "playing";
}

/**
 * 次のプレイヤーを取得
 * @param currentPlayer 現在のプレイヤー
 * @returns 次のプレイヤー
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === "X" ? "O" : "X";
}

/**
 * 空いているセルの位置を取得
 * @param board 現在のボード状態
 * @returns 空いているセルの位置の配列
 */
export function getAvailablePositions(board: BoardCell[]): BoardPosition[] {
  const availablePositions: BoardPosition[] = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      availablePositions.push(i as BoardPosition);
    }
  }

  return availablePositions;
}

/**
 * ゲーム状態を更新
 * @param currentState 現在のゲーム状態
 * @param position 置く位置
 * @returns 新しいゲーム状態
 */
export function updateGameState(
  currentState: GameState,
  position: BoardPosition
): GameState {
  // 無効な手の場合は現在の状態をそのまま返す
  if (!isValidMove(currentState.board, position)) {
    return currentState;
  }

  // 新しいボード状態を作成
  const newBoard = makeMove(
    currentState.board,
    position,
    currentState.currentPlayer
  );

  // 手順を記録
  const newMove = {
    player: currentState.currentPlayer,
    position,
    timestamp: Date.now(),
  };

  const newMoves = [...currentState.moves, newMove];

  // ゲーム状態を判定
  const gameStatus = getGameStatus(newBoard);
  const winner = checkWinner(newBoard);

  return {
    board: newBoard,
    currentPlayer:
      gameStatus === "playing"
        ? getNextPlayer(currentState.currentPlayer)
        : currentState.currentPlayer,
    gameStatus,
    winner: winner?.player || null,
    moves: newMoves,
    firstPlayer: currentState.firstPlayer,
  };
}

/**
 * 初期ゲーム状態を作成
 * @param startingPlayer 開始プレイヤー（デフォルト: "X"）
 * @returns 初期ゲーム状態
 */
export function createInitialGameState(
  startingPlayer: Player = "X"
): GameState {
  return {
    board: initializeBoard(),
    currentPlayer: startingPlayer,
    gameStatus: "playing",
    winner: null,
    moves: [],
    firstPlayer: startingPlayer,
  };
}
