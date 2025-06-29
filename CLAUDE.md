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

### Phase 3: AI・棋譜機能

10. ランダムAI実装
11. 棋譜記録機能
12. LocalStorageRepository実装
13. 棋譜履歴表示

### Phase 4: 高度な機能

14. 棋譜再生機能
15. 先攻・後攻選択
16. 個別削除機能

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

**現状**: 基本的な型定義（`src/types/game.ts`）
**改善案**: react_memo.mdの構造を参考に拡張

```
src/types/
├── common/           # クライアント・サーバー共通型
│   ├── game.ts      # ゲーム関連型（既存移動）
│   └── api.ts       # API型定義（Phase 3準備）
├── client/          # クライアント専用型
│   ├── components/  # コンポーネントprops型
│   ├── hooks/       # カスタムフック型
│   └── store/       # 状態管理型
└── server/          # サーバー専用型（将来）
    ├── api/         # API実装型
    └── db/          # データベース型
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
