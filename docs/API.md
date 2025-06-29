# API仕様書

## 📋 概要

3x3三目並べゲームのAPI仕様書。主要なインターフェース、コンポーネントProps、カスタムフックのAPIを定義します。

## 🗄️ localStorage API

### GameRepository インターフェース

```typescript
interface GameRepository {
  saveGame(game: GameRecord): Promise<void>;
  loadGames(): Promise<GameRecord[]>;
  deleteGame(id: string): Promise<void>;
  clearAll(): Promise<void>;
}
```

#### メソッド詳細

**saveGame(game: GameRecord)**
- 新しいゲーム記録をlocalStorageに保存
- パラメータ: `GameRecord` オブジェクト
- 戻り値: `Promise<void>`

**loadGames()**
- 保存されているすべてのゲーム記録を取得
- パラメータ: なし
- 戻り値: `Promise<GameRecord[]>`

**deleteGame(id: string)**
- 指定IDのゲーム記録を削除
- パラメータ: ゲームID文字列
- 戻り値: `Promise<void>`

**clearAll()**
- すべてのゲーム記録を削除
- パラメータ: なし
- 戻り値: `Promise<void>`

## 🧩 コンポーネント API

### GameBoard Props

```typescript
interface GameBoardProps {
  className?: string;
  onGameComplete?: (result: GameResult) => void;
  disabled?: boolean;
}
```

#### Props詳細

- **className**: 追加CSSクラス（オプション）
- **onGameComplete**: ゲーム終了時のコールバック（オプション）
- **disabled**: ボード操作無効化フラグ（オプション）

### GameHistory Props

```typescript
interface GameHistoryProps {
  games: GameRecord[];
  onDeleteGame: (id: string) => void;
  onReplayGame?: (game: GameRecord) => void;
  className?: string;
}
```

#### Props詳細

- **games**: 表示するゲーム記録配列（必須）
- **onDeleteGame**: ゲーム削除時のコールバック（必須）
- **onReplayGame**: ゲーム再生時のコールバック（オプション）
- **className**: 追加CSSクラス（オプション）

### Button Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}
```

### Cell Props

```typescript
interface CellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  disabled?: boolean;
  position: number;
}
```

### StatusDisplay Props

```typescript
interface StatusDisplayProps {
  gameState: GameState;
  onReset: () => void;
  className?: string;
}
```

## 🎣 カスタムフック API

### useGame

```typescript
const {
  gameState,
  makeMove,
  resetGame,
  canMakeMove,
  isGameFinished
} = useGame();
```

#### 戻り値

- **gameState**: `GameState` - 現在のゲーム状態
- **makeMove**: `(position: number) => boolean` - 手を打つ関数
- **resetGame**: `() => void` - ゲームリセット関数
- **canMakeMove**: `(position: number) => boolean` - 手が打てるかチェック
- **isGameFinished**: `() => boolean` - ゲーム終了判定

### useGameHistory

```typescript
const {
  games,
  saveGame,
  deleteGame,
  clearHistory,
  isLoading
} = useGameHistory();
```

#### 戻り値

- **games**: `GameRecord[]` - ゲーム記録配列
- **saveGame**: `(game: GameRecord) => Promise<void>` - ゲーム保存
- **deleteGame**: `(id: string) => Promise<void>` - ゲーム削除
- **clearHistory**: `() => Promise<void>` - 履歴全削除
- **isLoading**: `boolean` - 読み込み状態

### useLocalStorage

```typescript
const [value, setValue, removeValue] = useLocalStorage<T>(key, defaultValue);
```

#### パラメータ

- **key**: `string` - localStorageキー
- **defaultValue**: `T` - デフォルト値

#### 戻り値

- **value**: `T` - 現在の値
- **setValue**: `(value: T) => void` - 値設定関数
- **removeValue**: `() => void` - 値削除関数

### useGameStats

```typescript
const {
  stats,
  updateStats,
  resetStats,
  totalGames
} = useGameStats();
```

#### 戻り値

- **stats**: `GameStats` - 統計データ
- **updateStats**: `(result: GameResult) => void` - 統計更新
- **resetStats**: `() => void` - 統計リセット
- **totalGames**: `number` - 総ゲーム数

### useKeyboardNavigation

```typescript
const {
  focusedPosition,
  handleKeyDown,
  resetFocus
} = useKeyboardNavigation(gridSize);
```

#### パラメータ

- **gridSize**: `number` - グリッドサイズ（通常3）

#### 戻り値

- **focusedPosition**: `number | null` - フォーカス中の位置
- **handleKeyDown**: `(event: KeyboardEvent) => void` - キーイベントハンドラ
- **resetFocus**: `() => void` - フォーカスリセット

## 🎮 AI Player API

### aiPlayer 関数

```typescript
function aiPlayer(board: Board): number
```

#### パラメータ

- **board**: `Board` - 現在のボード状態

#### 戻り値

- **number**: AIが選択したセル位置（0-8）

## 📊 型定義

### GameState

```typescript
interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: 'playing' | 'finished' | 'draw';
  winner: Player | null;
  moves: Move[];
  startTime: number;
}
```

### GameRecord

```typescript
interface GameRecord {
  id: string;
  timestamp: number;
  gameMode: 'pvp' | 'pvc';
  moves: Move[];
  result: 'X' | 'O' | 'draw';
  duration: number;
}
```

### Move

```typescript
interface Move {
  player: Player;
  position: number;
  timestamp: number;
}
```

### GameResult

```typescript
type GameResult = {
  winner: Player | null;
  gameMode: 'pvp' | 'pvc';
  moves: Move[];
  duration: number;
}
```

### GameStats

```typescript
interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  showStats: boolean;
}
```

## 🔧 ユーティリティ関数

### checkWinner

```typescript
function checkWinner(board: Board): Player | null
```

### isDraw

```typescript
function isDraw(board: Board): boolean
```

### getEmptyPositions

```typescript
function getEmptyPositions(board: Board): number[]
```

### makeMove

```typescript
function makeMove(board: Board, position: number, player: Player): Board
```

---

## 📚 使用例

### 基本的なゲーム使用例

```typescript
import { useGame } from '@/hooks/useGame';

function GameComponent() {
  const { gameState, makeMove, resetGame } = useGame();
  
  const handleCellClick = (position: number) => {
    if (gameState.gameStatus === 'playing') {
      makeMove(position);
    }
  };
  
  return (
    <div>
      {/* ゲームボード実装 */}
    </div>
  );
}
```

### 棋譜履歴使用例

```typescript
import { useGameHistory } from '@/hooks/useGameHistory';

function HistoryComponent() {
  const { games, deleteGame } = useGameHistory();
  
  return (
    <GameHistory 
      games={games}
      onDeleteGame={deleteGame}
    />
  );
}
```