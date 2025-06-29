# データフロー図

## 概要

3x3三目並べアプリケーションにおける状態管理、データの流れ、イベント処理パターンを詳細に図示します。

## 全体データフロー概観

```mermaid
flowchart TD
    subgraph "ユーザーアクション"
        U1[セルクリック]
        U2[リセットボタン]
        U3[統計表示切替]
        U4[統計リセット]
    end
    
    subgraph "イベント処理層"
        E1[handleCellClick]
        E2[handleReset]
        E3[handleStatsToggle]
        E4[handleStatsReset]
    end
    
    subgraph "状態管理層"
        S1[useGame Hook]
        S2[Page State]
        S3[localStorage]
    end
    
    subgraph "ビジネスロジック層"
        L1[updateGameState]
        L2[checkWinner]
        L3[isDraw]
    end
    
    subgraph "UI更新"
        UI1[GameBoard再レンダリング]
        UI2[統計表示更新]
        UI3[ゲーム状態表示]
    end
    
    U1 --> E1
    U2 --> E2
    U3 --> E3
    U4 --> E4
    
    E1 --> S1
    E2 --> S1
    E3 --> S2
    E4 --> S2
    
    S1 --> L1
    L1 --> L2
    L1 --> L3
    
    S1 --> UI1
    S2 --> UI2
    S1 --> UI3
    
    S2 <--> S3
    
    style U1 fill:#ffebee
    style S1 fill:#f3e5f5
    style S2 fill:#e3f2fd
    style L1 fill:#e8f5e8
    style UI1 fill:#fff3e0
```

## useState/useCallback パターン

### 🎯 useGame Hook 状態管理

```typescript
// hooks/useGame.ts
export function useGame(config?: Partial<GameConfig>): UseGameReturn {
  // 状態定義
  const [gameState, setGameState] = useState<GameState>(
    () => createInitialGameState(initialPlayer)
  );

  // メモ化された関数
  const makeMove = useCallback((position: BoardPosition) => {
    setGameState(prevState => {
      // 条件チェック
      if (prevState.board[position] !== null || prevState.gameStatus !== "playing") {
        return prevState; // 変更なし
      }
      
      // 新しい状態を計算
      return updateGameState(prevState, position);
    });
  }, []);

  const resetGame = useCallback((startingPlayer?: Player) => {
    const player = startingPlayer || (config?.playerXStarts !== false ? "X" : "O");
    setGameState(createInitialGameState(player));
  }, [config?.playerXStarts]);
}
```

### 📊 Page Component 状態管理

```typescript
// app/page.tsx
export default function HomePage() {
  // ゲーム統計状態
  const [gameHistory, setGameHistory] = useState<GameStats>(() => {
    // localStorage から初期値読み込み
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tic-tac-toe-stats');
      return saved ? JSON.parse(saved) : defaultStats;
    }
    return defaultStats;
  });

  // 統計表示状態
  const [showStats, setShowStats] = useState(true);

  // ゲーム終了処理
  const handleGameEnd = useCallback((winner: "X" | "O" | "draw") => {
    setGameHistory(prev => {
      const newHistory = {
        totalGames: prev.totalGames + 1,
        wins: winner !== "draw" 
          ? { ...prev.wins, [winner]: prev.wins[winner] + 1 }
          : prev.wins,
        draws: winner === "draw" ? prev.draws + 1 : prev.draws
      };
      
      // localStorage に保存
      localStorage.setItem('tic-tac-toe-stats', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);
}
```

## GameState更新サイクル

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as GameBoard
    participant Hook as useGame
    participant State as GameState
    participant Logic as gameLogic
    participant Render as React Renderer
    
    Note over User,Render: ゲーム開始
    
    User->>UI: セル(0)をクリック
    UI->>Hook: makeMove(0)
    
    Hook->>Hook: setGameState(prevState => ...)
    Note over Hook: useState 更新関数実行
    
    Hook->>Logic: updateGameState(prevState, 0)
    Logic->>Logic: 新しいMovesを追加
    Logic->>Logic: currentPlayerを切り替え
    Logic->>Logic: checkWinner()実行
    Logic->>Logic: isDraw()チェック
    Logic-->>Hook: 新しいGameState
    
    Hook-->>UI: gameState更新
    UI-->>Render: 再レンダリング実行
    Render-->>User: UI更新完了
    
    Note over User,Render: プレイヤー交代
```

## イベント処理フロー

### 🖱️ セルクリックフロー

```mermaid
flowchart TD
    A[ユーザーがセルクリック] --> B{canMakeMove チェック}
    B -->|可能| C[makeMove実行]
    B -->|不可能| D[操作無視]
    
    C --> E[setGameState実行]
    E --> F[updateGameState呼び出し]
    
    F --> G[手順をMovesに追加]
    G --> H[currentPlayer切り替え]
    H --> I[勝利判定実行]
    
    I --> J{勝利者あり?}
    J -->|あり| K[gameStatus: 'finished']
    J -->|なし| L{引き分け?}
    
    L -->|あり| M[gameStatus: 'draw']
    L -->|なし| N[gameStatus: 'playing']
    
    K --> O[UI再レンダリング]
    M --> O
    N --> O
    
    O --> P{ゲーム終了?}
    P -->|Yes| Q[onGameEnd コールバック実行]
    P -->|No| R[次のターン待機]
    
    Q --> S[統計更新]
    S --> T[localStorage保存]
    
    D --> U[UI変更なし]
    
    style A fill:#ffebee
    style C fill:#e8f5e8
    style F fill:#fff3e0
    style O fill:#e3f2fd
    style S fill:#f3e5f5
```

### 🔄 リセットフロー

```mermaid
flowchart TD
    A[リセットボタンクリック] --> B[resetGame実行]
    B --> C[createInitialGameState呼び出し]
    
    C --> D[空のボード生成]
    D --> E[初期プレイヤー設定]
    E --> F[空のMoves配列]
    F --> G[gameStatus: 'playing']
    
    G --> H[setGameState実行]
    H --> I[UI再レンダリング]
    I --> J[新しいゲーム開始]
    
    style A fill:#ffebee
    style B fill:#e8f5e8
    style H fill:#f3e5f5
    style I fill:#e3f2fd
```

## localStorage 連携フロー

```mermaid
sequenceDiagram
    participant App as App起動
    participant Page as HomePage
    participant LS as localStorage
    participant State as gameHistory
    
    Note over App,State: アプリ初期化
    
    App->>Page: ページロード
    Page->>LS: getItem('tic-tac-toe-stats')
    LS-->>Page: 保存された統計データ
    Page->>State: useState初期値設定
    
    Note over App,State: ゲーム実行中
    
    Page->>Page: handleGameEnd実行
    Page->>State: setGameHistory(新しい統計)
    Page->>LS: setItem('tic-tac-toe-stats', JSON)
    
    Note over App,State: 統計リセット
    
    Page->>Page: resetStats実行
    Page->>State: setGameHistory(初期値)
    Page->>LS: setItem('tic-tac-toe-stats', 初期値)
```

## React 状態管理詳細

### 🔄 状態更新の流れ

```typescript
// 1. イベント発生
const handleCellClick = (position: BoardPosition) => {
  if (canMakeMove(position)) {
    makeMove(position); // 2. Hook関数呼び出し
  }
};

// 3. useState更新
const makeMove = useCallback((position: BoardPosition) => {
  setGameState(prevState => { // 4. 関数型更新
    return updateGameState(prevState, position); // 5. 純粋関数実行
  });
}, []);

// 6. React再レンダリングスケジュール
// 7. useEffect実行 (依存配列の変更検知)
useEffect(() => {
  if (isGameFinished && onGameEnd && !hasNotifiedGameEnd) {
    const result = gameState.winner || "draw";
    onGameEnd(result); // 8. 親コンポーネントへコールバック
    setHasNotifiedGameEnd(true);
  }
}, [isGameFinished, gameState.winner, onGameEnd, hasNotifiedGameEnd]);
```

### ⚡ パフォーマンス最適化

```typescript
// useCallback によるメモ化
const makeMove = useCallback((position: BoardPosition) => {
  // 関数が再生成されない
}, []); // 依存配列が空

const resetGame = useCallback((startingPlayer?: Player) => {
  // config.playerXStarts が変更時のみ再生成
}, [config?.playerXStarts]);

// useMemo による計算結果キャッシュ
const isGameFinished = useMemo(() => {
  return gameState.gameStatus !== "playing";
}, [gameState.gameStatus]);

const canMakeMove = useCallback((position: BoardPosition): boolean => {
  return gameState.board[position] === null && gameState.gameStatus === "playing";
}, [gameState.board, gameState.gameStatus]);
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[ユーザー操作] --> B{型チェック}
    B -->|型エラー| C[TypeScript コンパイルエラー]
    B -->|OK| D{canMakeMove チェック}
    
    D -->|無効操作| E[操作無視・UI変更なし]
    D -->|有効操作| F[状態更新実行]
    
    F --> G{localStorage エラー?}
    G -->|エラー| H[統計保存失敗・ゲーム継続]
    G -->|成功| I[正常フロー]
    
    C --> J[開発時エラー表示]
    E --> K[ユーザーに視覚的フィードバック]
    H --> L[エラーログ出力・デフォルト動作]
    I --> M[成功完了]
    
    style C fill:#ffcdd2
    style E fill:#fff9c4
    style H fill:#ffe0b2
    style I fill:#c8e6c9
```

## 副作用管理

### 📝 useEffect パターン

```typescript
// GameBoard Component
useEffect(() => {
  // ゲーム終了監視
  if (isGameFinished && onGameEnd && !hasNotifiedGameEnd) {
    const result = gameState.winner || "draw";
    onGameEnd(result);
    setHasNotifiedGameEnd(true);
  } else if (!isGameFinished && hasNotifiedGameEnd) {
    // リセット時の処理
    setHasNotifiedGameEnd(false);
  }
}, [isGameFinished, gameState.winner, onGameEnd, hasNotifiedGameEnd]);

// Page Component  
useEffect(() => {
  // localStorage 保存
  localStorage.setItem('tic-tac-toe-stats', JSON.stringify(gameHistory));
}, [gameHistory]);
```

## データ不変性

### 🔒 Immutable 更新パターン

```typescript
// 配列の不変更新
const updateBoard = (board: BoardCell[], position: BoardPosition, player: Player) => {
  const newBoard = [...board]; // スプレッド演算子でコピー
  newBoard[position] = player;
  return newBoard;
};

// オブジェクトの不変更新
const updateStats = (prev: GameStats, winner: GameResult) => ({
  ...prev, // 既存プロパティコピー
  totalGames: prev.totalGames + 1,
  wins: winner !== "draw" 
    ? { ...prev.wins, [winner]: prev.wins[winner] + 1 } // ネストしたオブジェクトも不変更新
    : prev.wins,
  draws: winner === "draw" ? prev.draws + 1 : prev.draws
});

// 配列への要素追加
const addMove = (moves: Move[], newMove: Move) => [...moves, newMove];
```

---

**最終更新**: 2025-06-29  
**バージョン**: Phase 2完了版  
**作成者**: Claude Code