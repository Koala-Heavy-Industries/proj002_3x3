# 3x3 三目並べゲーム 設計書

## プロジェクト概要

Next.js + TypeScriptを使用した3x3の三目並べゲームアプリケーション。  
棋譜記録・再生機能とクラウドDB移行を見据えた設計。

## 技術スタック

### フロントエンド

- **Next.js 15.3.4** (App Router) - ✅ 構築済み
- **TypeScript** - ✅ 構築済み
- **Tailwind CSS v4** (スタイリング) - ✅ 構築済み
- **React Hooks** (状態管理)

### 開発環境

- **ESLint 9** (コード品質) - ✅ 構築済み
- **Prettier 3.6.2** (フォーマット) - ✅ 構築済み

### テスト環境

- **Jest 30.0.3** (テストフレームワーク) - ✅ 構築済み
- **@testing-library/react** (Reactテスト) - ✅ 構築済み
- **@testing-library/jest-dom** (DOM拡張) - ✅ 構築済み

### データ永続化

- **localStorage** (JSON形式) - 初期実装
- **Firebase/Supabase** 対応可能な設計

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド実行
npm run build

# コードチェック
npm run lint

# フォーマット実行
npm run format

# フォーマット確認
npm run format:check

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# テストカバレッジ確認
npm run test:coverage
```

## 機能要件

### 基本ゲーム機能

- ✅ 3x3ゲームボード
- ✅ プレイヤー交代 (X / O)
- ✅ 勝利判定 (縦・横・斜め)
- ✅ 引き分け判定

### 対戦モード

- ✅ **人 vs 人** (同一デバイス)
- ⏳ **人 vs コンピュータ** (ランダムAI) - Phase 3で実装予定
- ✅ **先攻・後攻選択** (プレイヤーが選択可能)

### 棋譜機能

- ⏳ **棋譜記録** (手順・タイムスタンプ) - Phase 3で実装予定
- ⏳ **棋譜履歴** (過去のゲーム保存) - Phase 3で実装予定
- ⏳ **棋譜再生** (手順を順番に再現) - Phase 4で実装予定
- ⏳ **個別削除** (選択した棋譜のみ削除) - Phase 4で実装予定

### UI/UX機能

- ✅ **レスポンシブ対応** (モバイル・タブレット)
- ✅ **ダークモード対応** (ライト/ダーク切り替え)
- ✅ **アニメーション**
  - マス目クリック時 (フェードイン・スケール)
  - ゲーム結果表示時 (勝利ライン・メッセージ)
- ✅ **リセット機能** (ゲーム途中リセット)

## データ設計

### 型定義

```typescript
// ゲーム記録の型定義
interface GameRecord {
  id: string; // ユニークID
  timestamp: number; // ゲーム開始時刻
  gameMode: "pvp" | "pvc"; // 対戦モード
  moves: Move[]; // 手順リスト
  result: "X" | "O" | "draw"; // 結果
  duration: number; // ゲーム時間(秒)
}

// 手順の型定義
interface Move {
  player: "X" | "O"; // プレイヤー
  position: number; // 位置 (0-8)
  timestamp: number; // 手を打った時刻
}

// ゲーム状態の型定義
interface GameState {
  board: (null | "X" | "O")[]; // ボード状態
  currentPlayer: "X" | "O"; // 現在のプレイヤー
  gameStatus: "playing" | "finished" | "draw";
  winner: null | "X" | "O";
  moves: Move[];
}
```

### データアクセス層

```typescript
// リポジトリインターフェース (抽象化)
interface GameRepository {
  saveGame(game: GameRecord): Promise<void>;
  loadGames(): Promise<GameRecord[]>;
  deleteGame(id: string): Promise<void>;
}

// localStorage実装
class LocalStorageRepository implements GameRepository {
  private readonly STORAGE_KEY = "tic-tac-toe-games";

  async saveGame(game: GameRecord): Promise<void>;
  async loadGames(): Promise<GameRecord[]>;
  async deleteGame(id: string): Promise<void>;
}

// 将来のクラウドDB実装
class FirebaseRepository implements GameRepository {
  // Firebase/Supabase用の実装
}
```

## アーキテクチャ設計

### ディレクトリ構成

```
src/
├── app/                    # Next.js App Router ✅
│   ├── page.tsx           # メインページ ✅
│   ├── __tests__/         # ページテスト ✅
│   │   └── page.test.tsx  # メインページテスト ✅
│   ├── layout.tsx         # ルートレイアウト ✅
│   ├── globals.css        # グローバルCSS ✅
│   ├── favicon.ico        # ファビコン ✅
│   └── history/           # 棋譜履歴ページ (予定)
├── components/            # UIコンポーネント ✅
│   ├── index.ts           # エクスポート用 ✅
│   ├── GameBoard.tsx      # ゲームボード ✅
│   ├── __tests__/         # コンポーネントテスト ✅
│   │   └── GameBoard.test.tsx # GameBoardテスト ✅
│   ├── GameHistory.tsx    # 棋譜履歴 (予定)
│   ├── GameReplay.tsx     # 棋譜再生 (予定)
│   └── ThemeToggle.tsx    # ダークモード切り替え (予定)
├── hooks/                 # カスタムフック ✅
│   ├── index.ts           # エクスポート用 ✅
│   ├── useGame.ts         # ゲーム状態管理 ✅
│   ├── __tests__/         # テストファイル ✅
│   │   └── useGame.test.ts # useGameフックテスト ✅
│   ├── useGameHistory.ts  # 棋譜履歴管理 (予定)
│   └── useTheme.ts        # テーマ管理 (予定)
├── lib/                   # ビジネスロジック ✅
│   ├── index.ts           # エクスポート用 ✅
│   ├── gameLogic.ts       # ゲームロジック ✅
│   ├── __tests__/         # テストファイル ✅
│   │   └── gameLogic.test.ts # ゲームロジックテスト ✅
│   ├── aiPlayer.ts        # AI実装 (予定)
│   └── repository.ts      # データアクセス (予定)
└── types/                 # 型定義 ✅
    ├── index.ts           # エクスポート用 ✅
    └── game.ts            # ゲーム関連型 ✅
```

### コンポーネント設計

```typescript
// メインゲームコンポーネント
const GameBoard: React.FC = () => {
  const { gameState, makeMove, resetGame } = useGame();
  const { saveGame } = useGameHistory();

  // ゲームロジック実装
};

// 棋譜履歴コンポーネント
const GameHistory: React.FC = () => {
  const { games, deleteGame } = useGameHistory();

  // 履歴表示・削除機能
};

// 棋譜再生コンポーネント
const GameReplay: React.FC<{ game: GameRecord }> = ({ game }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  // 再生機能実装
};
```

## 実装フェーズ

### Phase 1: 基盤構築 - ✅ 完了

1. ✅ Next.js + TypeScript プロジェクトセットアップ
2. ✅ Tailwind CSS, ESLint, Prettier 設定
3. ✅ 基本的なプロジェクト構造作成
4. ✅ 型定義の実装

### Phase 2: コア機能 - ✅ 完了 (4/4)

5. ✅ ゲームロジック実装
6. ✅ useGameフック実装（ゲーム状態管理）
7. ✅ GameBoardコンポーネント実装
8. ✅ メインページ統合・人vs人モード完成

### Phase 3: AI・棋譜機能 - ✅ 完了 (4/4)

10. ✅ ランダムAI実装 (src/lib/aiPlayer.ts)
11. ✅ 棋譜記録機能 (useGameHistory.ts)
12. ✅ LocalStorageRepository実装 (src/lib/repository.ts)
13. ✅ 棋譜履歴表示 (src/components/GameHistory.tsx, /history ページ)

### Phase 3.1: AI実装詳細 ✅

- **ファイル**: `src/lib/aiPlayer.ts`
- **機能**: ランダム選択アルゴリズム、空セル検出、手の選択
- **テスト**: 包括的テストスイート (利用可能セル、ランダム選択)
- **統合**: GameBoardコンポーネントとの完全統合
- **完了日**: 2025-06-29

### Phase 3.2: 棋譜システム実装 ✅

- **ファイル**: `src/hooks/useGameHistory.ts`, `src/lib/repository.ts`
- **機能**: localStorage基盤の永続化、CRUD操作、ゲーム記録
- **データ**: JSON形式、タイムスタンプ、手順記録
- **UI**: `src/components/GameHistory.tsx`, `/history` ページ
- **完了日**: 2025-06-29

### Phase 3.3: 新コンポーネント群 ✅

- **Button.tsx**: 再利用可能ボタンコンポーネント
- **Cell.tsx**: ゲームセル専用コンポーネント
- **StatusDisplay.tsx**: ゲーム状態表示コンポーネント
- **GameHistory.tsx**: 棋譜履歴表示コンポーネント

### Phase 3.4: 高度なフック実装 ✅

- **useLocalStorage.ts**: 型安全なlocalStorage管理
- **useGameStats.ts**: ゲーム統計管理
- **useKeyboardNavigation.ts**: キーボード操作サポート
- **useGameHistory.ts**: 棋譜履歴管理フック

### Phase 4.1: 棋譜再生機能 ✅

- **ファイル**: `src/components/GameReplay.tsx`, `src/hooks/useGameReplay.ts`
- **機能**: 完全な再生コントロール、進捗バー、速度調整（0.5x-2x）
- **UI**: 再生/一時停止、手順ジャンプ、自動再生
- **ページ**: `/replay/[id]` 専用ページ実装済み
- **統合**: 棋譜履歴からワンクリック再生
- **完了日**: 2025-06-29

### Phase 4.2: 先攻・後攻選択機能 ✅

- **ファイル**: `src/components/GameBoard.tsx`, `src/types/common/game.ts`
- **機能**: X先攻/O先攻の選択UI、ゲーム状態への統合
- **対応**: 人vs人、人vsAI両モード対応
- **型安全性**: GameState.firstPlayer追加
- **UI**: ゲームモード選択下に配置、視覚的フィードバック
- **完了日**: 2025-06-29

### Phase 4.3: 個別削除機能強化 ✅

- **ファイル**: `src/components/GameHistory.tsx`
- **機能**: 改善された個別削除、複数選択・一括削除
- **UI強化**: 🗑️ アイコン、詳細確認ダイアログ
- **新機能**: 📋 複数選択モード、全選択・選択解除
- **UX**: 選択中件数表示、モード切替UI
- **完了日**: 2025-06-29

## 🎉 Phase 4完了記念

**完成した成果物**: 高度な棋譜管理・再生システム

### 🎮 新機能概要

- **完全な棋譜再生**: 手順ごとの可視化、速度調整、進捗制御
- **柔軟な先攻選択**: 人vs人・人vsAI対応、型安全な実装
- **効率的な削除管理**: 個別・複数選択・一括削除対応

### 📊 技術的成果

- **テスト**: 113テストケース全PASS（品質保証の継続）
- **コード品質**: ESLintエラー完全解消（12件 → 0件）
- **型安全性**: GameState.firstPlayer追加、any型削除
- **アーキテクチャ**: 再利用可能コンポーネント設計

### ✨ 実装済み機能

- **棋譜システム**: 記録・履歴・再生・削除の完全サイクル
- **ゲーム制御**: モード選択・先攻選択・状態管理
- **UI/UX**: モダンデザイン・レスポンシブ・アクセシビリティ対応

### 🚀 Phase 5準備状況

- **基盤完成**: 全主要機能の実装完了
- **品質確保**: 包括的テスト・エラー解消済み
- **拡張準備**: パフォーマンス最適化・UI改善の準備完了

## 🛠️ 技術改善履歴

### 2025-06-29: コード品質大幅改善

#### ✅ **ESLintエラー完全解消** (12件 → 0件)

**未使用変数・型の削除** (6件):
- `src/app/page.tsx` - 未使用import削除
- `src/lib/aiPlayer.ts` - 不要パラメータ削除
- `src/lib/__tests__/*.ts` - 未使用型定義削除

**型安全性向上** (5件):
- `any` → `unknown`/`BoardPosition` 型強化
- 空インターフェース → type alias 最適化

**React設計改善** (1件):
- useEffect依存配列の意図明確化

#### 📈 **品質指標改善**
- **型カバレッジ**: any型使用 → 型安全な設計
- **コード品質**: ESLintエラー0件達成
- **保守性**: 未使用コード削除による可読性向上

#### 🎯 **現在のプロジェクト指標**
- **ソースファイル**: 26ファイル（components/hooks/lib）
- **テストファイル**: 7ファイル（113テストケース全PASS）
- **ページ数**: 3ページ（/, /history, /replay/[id]）
- **ESLintエラー**: 0件（完全解消済み）
- **カバレッジ**: 主要機能100%

### Phase 5: UI/UX改善

17. ✅ ダークモード対応
18. ✅ レスポンシブ対応
19. ✅ アニメーション実装
20. ✅ リセット機能

### Phase 6: 最終調整

21. ✅ テストフレームワーク・基本テスト実装
22. パフォーマンス最適化
23. ドキュメント整備

## 実装済み機能詳細

### Phase 2.1: ゲームロジック ✅

- **ファイル**: `src/lib/gameLogic.ts`
- **機能**: 勝利判定、引き分け判定、手の操作、ボード管理
- **テスト**: 包括的テストスイート
- **完了日**: 2025-06-27

### Phase 2.2: useGameフック ✅

- **ファイル**: `src/hooks/useGame.ts`
- **機能**: ゲーム状態管理、手の操作、リセット機能
- **テスト**: 12テストケース（100%カバレッジ）
- **主要API**: `makeMove`, `resetGame`, `canMakeMove`, `isGameFinished`
- **完了日**: 2025-06-28

### Phase 2.3: GameBoardコンポーネント ✅

- **ファイル**: `src/components/GameBoard.tsx`
- **機能**: 3x3グリッド、セルクリック、ゲーム状態表示、リセット機能
- **テスト**: 13テストケース（100%カバレッジ）
- **UI**: Tailwind CSS、ダークモード対応、レスポンシブデザイン
- **特徴**: ホバー効果、アニメーション、アクセシビリティ対応
- **完了日**: 2025-06-29

### Phase 2.4: メインページ統合 ✅

- **ファイル**: `src/app/page.tsx`, `src/app/layout.tsx`
- **機能**: 完全なゲームアプリケーション、統計機能、日本語UI
- **テスト**: 11テストケース（統計・UI・アクセシビリティ）
- **特徴**: モダンUI、グラデーション背景、カード型レイアウト
- **統計機能**: リアルタイム勝敗記録、表示切替、リセット機能
- **完了日**: 2025-06-29

## 🎉 Phase 2完了記念

**完成した成果物**: 完全に動作する三目並べWebアプリケーション

### 🎮 アプリケーション概要

- **URL**: http://localhost:3000 (開発サーバー)
- **言語**: 日本語対応
- **プラットフォーム**: Web (モバイル・タブレット・デスクトップ)

### 📊 技術的成果

- **テスト**: 75テストケース全PASS（4テストスイート）
- **品質**: 100%機能カバレッジ達成
- **アーキテクチャ**: モダンReact + TypeScript
- **デザイン**: レスポンシブ・ダークモード対応

### ✨ 実装済み機能

- **基本ゲーム**: 3x3三目並べ、勝利・引き分け判定
- **UI/UX**: モダンデザイン、アニメーション、ホバー効果
- **統計機能**: リアルタイム勝敗記録、表示切替
- **操作性**: リセット・新しいゲーム機能
- **アクセシビリティ**: キーボード操作・スクリーンリーダー対応

### 🚀 Phase 3準備状況

- **基盤完成**: コア機能すべて実装済み
- **拡張可能**: AI・棋譜機能の実装準備完了
- **品質保証**: 包括的テストスイートで安全な拡張が可能

## 🐛 重要なバグ修正履歴

### 2025-06-29: ゲーム終了時の重要バグ修正 (Issue #17)

#### 🔴 **修正されたバグ**

1. **ゲーム終了時フリーズ**
   - **症状**: 勝利・引き分け時にアプリケーションがフリーズ
   - **原因**: useEffectの無限ループ (`gameState`依存配列問題)
   - **解決**: 状態更新と副作用処理の分離

2. **重複記録バグ**
   - **症状**: 1ゲームで2つの記録が作成される
   - **原因**: ゲーム終了処理が2か所で実行
   - **解決**: 単一のuseEffectによる統一処理

3. **型エラー**
   - **症状**: `BoardCell | undefined` vs `Player | null`の不一致
   - **解決**: null合体演算子による型安全性確保

#### ✅ **修正内容**

- **ファイル**: `src/hooks/useGame.ts`, `src/components/GameBoard.tsx`
- **コミット**: `ea0a0a3` - fix: resolve game-ending freeze and duplicate record bugs
- **Issue**: #17 (自動クローズ済み)
- **テスト**: 113テストケース全PASS維持

#### 🏗️ **アーキテクチャ改善**

- useEffectの適切な依存配列管理
- 状態更新とコールバック処理の明確な分離
- processMove関数による共通処理の統一
- React ベストプラクティスの適用

## 将来の拡張性

### クラウドDB移行

- インターフェースは変更せず、実装のみ変更
- JSONデータ形式はそのまま利用可能
- 認証機能追加時もデータ構造は維持

### 機能拡張案

- マルチプレイヤー対応
- AI難易度調整
- ゲーム統計表示
- SNSシェア機能
- カスタムテーマ

## 技術的考慮事項

### パフォーマンス

- React.memo でコンポーネント最適化
- useMemo/useCallback で再レンダリング制御
- lazy loading で初期読み込み時間短縮

### アクセシビリティ

- キーボード操作対応
- スクリーンリーダー対応
- コントラスト比確保

### セキュリティ

- XSS対策 (React標準で対応)
- データ検証 (型システムで対応)
- localStorage容量制限対応

## 📚 React/Next.js ベストプラクティス

### 技術改善指針

Phase 2完了を受けて、`../texts/react_memo.md` の知見を活用した技術改善を推進します。

#### 🎯 型定義構造の改善

**現状**: 実装済み型定義構造

```
src/types/
├── common/           # ✅ 実装済み
│   ├── game.ts      # ゲーム関連型
│   ├── api.ts       # API型定義
│   └── repository.ts # リポジトリ型
├── client/          # ✅ 実装済み
│   ├── components.ts # コンポーネントprops型
│   ├── hooks.ts     # カスタムフック型
│   └── index.ts     # エクスポート
└── game.ts          # レガシー（互換性維持）
```

#### 🧩 コンポーネント設計強化

**props型の明示化**:

```typescript
// 詳細なGameBoardProps定義
interface GameBoardProps {
  config?: Partial<GameConfig>;
  onGameEnd?: (result: GameResult) => void;
  onMoveStart?: (position: BoardPosition) => void;
  onMoveComplete?: (move: Move) => void;
  disabled?: boolean;
  theme?: "light" | "dark";
}
```

**再利用可能コンポーネント分離**:

- `Button`: 共通ボタンコンポーネント
- `Cell`: ゲームセル専用コンポーネント
- `StatusDisplay`: 状態表示コンポーネント

#### 🎣 カスタムフック拡張

**Phase 3準備のフック**:

```typescript
// 統計データ管理
const useLocalStorage = <T>(key: string, defaultValue: T) => { ... };

// 棋譜履歴管理
const useGameHistory = () => { ... };

// アクセシビリティ強化
const useKeyboardNavigation = (gridSize: number) => { ... };
```

#### ⚡ 開発ワークフロー改善

**TypeScript厳密化**:

```json
// tsconfig.json強化案
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**パフォーマンス分析**:

- Bundle Analyzer導入
- Core Web Vitals測定
- レンダリング最適化

#### 🚀 Phase 3拡張準備

**API Routes構造**（react_memo.md参考）:

```
src/app/api/
├── games/route.ts      # ゲーム一覧・作成
├── games/[id]/route.ts # 個別ゲーム操作
├── stats/route.ts      # 統計データ
└── health/route.ts     # ヘルスチェック
```

**レイアウト拡張**:

```
src/app/
├── history/           # 棋譜履歴機能
│   ├── layout.tsx     # 履歴専用レイアウト
│   └── page.tsx       # 履歴一覧
└── replay/            # 棋譜再生機能
    └── [id]/page.tsx  # 個別再生
```

#### 📋 実装優先順位

**高優先度**（Phase 3前）:

1. カスタムフック分離（useLocalStorage、useGameHistory）
2. コンポーネントprops型強化
3. 再利用可能コンポーネント分離

**中優先度**（Phase 3並行）:

1. API Routes構造準備
2. レイアウト構造拡張
3. 型定義構造改善

**低優先度**（Phase 4以降）:

1. middleware活用
2. Bundle最適化
3. 厳密型チェック

### 参考資料の活用

**`../texts/` フォルダ活用**:

- `react_memo.md`: React/Next.js技術ノート
- `gitmemo.txt`: Git操作リファレンス
- `prompt1.txt`: ドキュメント管理システム設計

これらの知見を継続的にプロジェクトに反映し、技術的負債の蓄積を防止します。
