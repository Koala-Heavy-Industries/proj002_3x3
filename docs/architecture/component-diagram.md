# コンポーネント関係図

## 概要

React コンポーネントの依存関係、プロパティフロー、状態の伝搬パターンを図示します。

### 🔰 初心者向け：この図の読み方

**Mermaid記法**で書かれた図表の基本的な読み方：
- **矢印 (`-->`)**: 依存関係や呼び出し方向を示す
- **四角いボックス**: コンポーネントやモジュールを表す
- **色分け**: 役割別にカテゴリ分けされている
- **階層構造**: 上から下への流れが依存関係を示す

**実際の開発での活用方法**：
- バグが発生した際の影響範囲の特定
- 新機能追加時の修正箇所の把握
- コンポーネント間の関係性の理解

## React コンポーネントツリー

```mermaid
graph TB
    subgraph "Next.js App Router"
        Root[RootLayout<br/>app/layout.tsx]
        Page[HomePage<br/>app/page.tsx]
    end

    subgraph "ゲームコンポーネント"
        GameBoard[GameBoard<br/>components/GameBoard.tsx]
    end

    subgraph "カスタムフック"
        useGame[useGame<br/>hooks/useGame.ts]
    end

    subgraph "ビジネスロジック"
        gameLogic[gameLogic<br/>lib/gameLogic.ts]
    end

    subgraph "型定義"
        Types[GameTypes<br/>types/game.ts]
    end

    Root --> Page
    Page --> GameBoard
    GameBoard --> useGame
    useGame --> gameLogic
    gameLogic --> Types

    style Root fill:#f9f9f9
    style Page fill:#e3f2fd
    style GameBoard fill:#e8f5e8
    style useGame fill:#f3e5f5
    style gameLogic fill:#fff3e0
    style Types fill:#fce4ec
```

## コンポーネント詳細

### 🏠 RootLayout (app/layout.tsx)

```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**責務**:

- HTML基盤構造の提供
- グローバルフォント設定
- メタデータ定義

**特徴**:

- 全ページ共通レイアウト
- ダークモード CSS変数の設定

### 📄 HomePage (app/page.tsx)

```typescript
interface GameStats {
  totalGames: number;
  wins: { X: number; O: number };
  draws: number;
}
```

**状態管理**:

- `gameHistory`: ゲーム統計データ
- `showStats`: 統計表示/非表示

**主要機能**:

- GameBoard との統合
- 統計機能の提供
- ゲーム結果の記録

**子コンポーネント**:

- `<GameBoard onGameEnd={handleGameEnd} />`

### 🎮 GameBoard (components/GameBoard.tsx)

```typescript
interface GameBoardProps {
  config?: {
    playerXStarts?: boolean;
  };
  onGameEnd?: (winner: "X" | "O" | "draw") => void;
}
```

**使用フック**:

- `useGame(config)`: ゲーム状態管理
- `useState(hasNotifiedGameEnd)`: 通知制御
- `useEffect`: ゲーム終了監視

**主要機能**:

- 3x3グリッドの描画
- セルクリックイベント処理
- ゲーム状態の表示
- リセット機能

## プロパティフロー図

```mermaid
flowchart LR
    subgraph "Page Component"
        PS[Page State]
        PH[handleGameEnd]
    end

    subgraph "GameBoard Component"
        GB[GameBoard]
        GS[GameBoard State]
    end

    subgraph "useGame Hook"
        UG[useGame]
        US[Hook State]
    end

    subgraph "Game Logic"
        GL[gameLogic]
        GLS[Pure Functions]
    end

    PS -->|config| GB
    PH -->|onGameEnd| GB

    GB -->|config| UG
    GS <-->|state updates| UG

    UG -->|function calls| GL
    US <-->|state calculations| GLS

    style PS fill:#e3f2fd
    style GS fill:#e8f5e8
    style US fill:#f3e5f5
    style GLS fill:#fff3e0
```

## 状態伝搬パターン

### 📊 GameBoard → Page (コールバック)

```typescript
// Page Component
const handleGameEnd = (winner: "X" | "O" | "draw") => {
  setGameHistory(prev => ({
    totalGames: prev.totalGames + 1,
    wins: winner !== "draw"
      ? { ...prev.wins, [winner]: prev.wins[winner] + 1 }
      : prev.wins,
    draws: winner === "draw" ? prev.draws + 1 : prev.draws
  }));
};

// GameBoard Component
<GameBoard onGameEnd={handleGameEnd} />
```

### 🔄 useGame → GameBoard (状態・関数)

```typescript
// useGame Hook返り値
interface UseGameReturn {
  gameState: GameState;
  makeMove: (position: BoardPosition) => void;
  resetGame: (startingPlayer?: Player) => void;
  isGameFinished: boolean;
  canMakeMove: (position: BoardPosition) => boolean;
}

// GameBoard での使用
const { gameState, makeMove, resetGame, canMakeMove, isGameFinished } =
  useGame(config);
```

### ⚙️ gameLogic → useGame (純粋関数)

```typescript
// 純粋関数の呼び出し
const makeMove = useCallback((position: BoardPosition) => {
  setGameState(
    prevState => updateGameState(prevState, position) // 純粋関数
  );
}, []);
```

## イベントフロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Cell as ゲームセル
    participant GB as GameBoard
    participant Hook as useGame
    participant Logic as gameLogic
    participant Page as HomePage

    User->>Cell: クリック
    Cell->>GB: handleCellClick(position)
    GB->>Hook: makeMove(position)
    Hook->>Logic: updateGameState(state, position)
    Logic-->>Hook: 新しいGameState
    Hook-->>GB: gameState更新
    GB-->>Cell: UI再レンダリング

    alt ゲーム終了時
        GB->>Page: onGameEnd(winner)
        Page->>Page: 統計更新
    end
```

## 状態管理詳細

### 🎯 useGame Hook の状態

```typescript
interface GameState {
  board: BoardCell[]; // [null, "X", "O", ...]
  currentPlayer: Player; // "X" | "O"
  gameStatus: GameStatus; // "playing" | "finished" | "draw"
  winner: null | Player; // null | "X" | "O"
  moves: Move[]; // 手順履歴
}
```

**状態更新フロー**:

1. `makeMove()` 呼び出し
2. `updateGameState()` で新状態計算
3. `setState()` で状態更新
4. React の再レンダリング

### 📈 Page Component の状態

```typescript
interface PageState {
  gameHistory: {
    totalGames: number;
    wins: { X: number; O: number };
    draws: number;
  };
  showStats: boolean;
}
```

**localStorage 連携**:

- `useEffect` で初期読み込み
- 統計更新時に localStorage へ保存

## パフォーマンス最適化

### ⚡ React.memo とコールバック

```typescript
// GameBoard Component (メモ化対象)
export const GameBoard = React.memo(({ config, onGameEnd }: GameBoardProps) => {
  // コンポーネント実装
});

// useGame Hook (useCallback使用)
const makeMove = useCallback((position: BoardPosition) => {
  // 実装
}, []);
```

### 🔧 依存配列の最適化

```typescript
// GameBoard useEffect
useEffect(() => {
  // ゲーム終了監視
}, [isGameFinished, gameState.winner, onGameEnd, hasNotifiedGameEnd]);
```

## エラーハンドリング

### 🛡️ 型安全性による防御

```typescript
// BoardPosition 型による制約
type BoardPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// 入力検証
const canMakeMove = (position: BoardPosition): boolean => {
  return (
    gameState.board[position] === null && gameState.gameStatus === "playing"
  );
};
```

### ⚠️ ランタイムエラー対策

```typescript
// セルクリック時の検証
const handleCellClick = (position: BoardPosition) => {
  if (canMakeMove(position)) {
    makeMove(position);
  }
  // 無効な操作は無視される
};
```

## テスト戦略

### 🧪 コンポーネントテスト

```typescript
// GameBoard.test.tsx
describe('GameBoard', () => {
  it('セルクリックで正しくゲーム状態が更新される', () => {
    render(<GameBoard />);
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0')).toHaveTextContent('X');
  });
});
```

### 🔬 フックテスト

```typescript
// useGame.test.ts
describe("useGame", () => {
  it("makeMove で正しく状態が更新される", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.makeMove(0);
    });
    expect(result.current.gameState.board[0]).toBe("X");
  });
});
```

## 📚 初心者のための読み方ガイド

### 1. 図表を見る順序

1. **全体俯瞰**: まず図全体を見て、どのようなコンポーネントがあるかを把握
2. **依存関係**: 矢印の方向で「誰が誰を使っているか」を理解
3. **階層構造**: Root → Page → GameBoard → useGame の順で詳しく見る
4. **実際のコード**: 図を見た後で実際のファイルを確認

### 2. 実開発での活用例

**機能追加時**:
```
GameBoard に新機能追加したい
 → この図で GameBoard の依存関係を確認
 → useGame, gameLogic への影響を把握
 → 実装計画を立てる
```

**バグ修正時**:
```
ページで問題発生
 → この図で Page コンポーネントを確認
 → GameBoard, useGameHistory への影響を調査
 → 原因箇所を特定
```

### 3. 各色の意味

- **薄いグレー (`#f9f9f9`)**: ルートレイアウト（基盤）
- **薄い青 (`#e3f2fd`)**: ページコンポーネント（表示層）
- **薄い緑 (`#e8f5e8`)**: UIコンポーネント（部品）
- **薄い紫 (`#f3e5f5`)**: フック（ロジック層）
- **薄いオレンジ (`#fff3e0`)**: ビジネスロジック（純粋関数）
- **薄いピンク (`#fce4ec`)**: 型定義（データ構造）

---

**最終更新**: 2025-06-29  
**バージョン**: Phase 4完了版（初心者ガイド追加）  
**作成者**: Claude Code
