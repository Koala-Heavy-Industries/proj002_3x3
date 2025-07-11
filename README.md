# 3x3 三目並べゲーム

Next.js + TypeScriptで開発された3x3三目並べゲームアプリケーション。
棋譜記録・再生機能とクラウドDB移行を見据えた設計で構築されています。

## 🎯 主な機能

### 基本ゲーム機能

- 3x3ゲームボード
- プレイヤー交代 (X / O)
- 勝利判定 (縦・横・斜め)
- 引き分け判定

### 対戦モード ✅

- **人 vs 人** (同一デバイス) ✅ 実装済み
- **人 vs コンピュータ** (ランダムAI) ✅ 実装済み
- ⏳ **先攻・後攻選択** (プレイヤーが選択可能) - Phase 4予定

### 統計機能

- **リアルタイム勝敗記録** (X勝利・O勝利・引き分け)
- **統計表示切替** (表示/非表示)
- **統計リセット** (記録の初期化)

### 棋譜機能 ✅

- **棋譜記録** (手順・タイムスタンプ) ✅ 実装済み
- **棋譜履歴** (過去のゲーム保存) ✅ 実装済み
- **履歴表示ページ** (/history) ✅ 実装済み
- **個別削除** (選択した棋譜のみ削除) ✅ 実装済み
- ⏳ **棋譜再生** (手順を順番に再現) - Phase 4予定

### UI/UX機能

- **レスポンシブ対応** (モバイル・タブレット)
- **ダークモード対応** (システム設定自動検出対応)
- **アニメーション**
  - マス目クリック時 (フェードイン・スケール)
  - ゲーム結果表示時 (勝利ライン・メッセージ)
- **リセット機能** (ゲーム途中リセット)

## 🛠️ 技術スタック

### フロントエンド

- **Next.js 15.3.4** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (スタイリング)
- **React Hooks** (状態管理)

### 開発環境

- **ESLint 9** (コード品質)
- **Prettier 3.6.2** (フォーマット)

### テスト環境

- **Jest 30.0.3** (テストフレームワーク)
- **@testing-library/react** (Reactテスト)
- **@testing-library/jest-dom** (DOM拡張)

### データ永続化

- **localStorage** (JSON形式) - 初期実装
- **Firebase/Supabase** 対応可能な設計

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd proj002_3x3
```

2. 依存関係をインストール

```bash
npm install
```

3. 開発サーバーを起動

```bash
npm run dev
```

4. ブラウザで確認
   [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認

## 📝 開発コマンド

### 基本コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド実行
npm run build

# 本番サーバー起動
npm start
```

### コード品質

```bash
# コードチェック
npm run lint

# フォーマット実行
npm run format

# フォーマット確認
npm run format:check
```

### テスト

```bash
# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# テストカバレッジ確認
npm run test:coverage
```

## 🧪 テスト

プロジェクトはJestを使用した包括的なテストスイートを含んでいます。

### テスト実行

```bash
npm test
```

### カバレッジ確認

```bash
npm run test:coverage
```

### 現在のテストカバレッジ

- ゲームロジック: 100%カバレッジ (包括的テストスイート)
- useGameフック: 100%カバレッジ (12テストケース)
- GameBoardコンポーネント: 100%カバレッジ (13テストケース)
- メインページ: 統計・UI・アクセシビリティテスト (11テストケース)
- 総テスト数: 75テストケース (4テストスイート)
- 型定義: TypeScriptによる型安全性確保

## 🏗️ プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ ✅
│   ├── __tests__/         # ページテスト ✅
│   │   └── page.test.tsx  # メインページテスト
│   ├── layout.tsx         # ルートレイアウト ✅
│   ├── globals.css        # グローバルCSS ✅
│   └── favicon.ico        # ファビコン ✅
├── components/            # UIコンポーネント ✅
│   ├── GameBoard.tsx      # ゲームボード ✅
│   ├── GameHistory.tsx    # 棋譜履歴 ✅ 新規
│   ├── Button.tsx         # 再利用ボタン ✅ 新規
│   ├── Cell.tsx           # ゲームセル ✅ 新規
│   ├── StatusDisplay.tsx  # 状態表示 ✅ 新規
│   ├── __tests__/         # コンポーネントテスト ✅
│   │   └── GameBoard.test.tsx # GameBoardテスト
│   └── index.ts           # エクスポート用 ✅
├── hooks/                 # カスタムフック ✅
│   ├── useGame.ts         # ゲーム状態管理 ✅
│   ├── useGameHistory.ts  # 棋譜履歴管理 ✅ 新規
│   ├── useGameStats.ts    # 統計管理 ✅ 新規
│   ├── useLocalStorage.ts # ストレージ管理 ✅ 新規
│   ├── useKeyboardNavigation.ts # キーボード操作 ✅ 新規
│   ├── __tests__/         # テストファイル ✅
│   │   ├── useGame.test.ts # useGameフックテスト
│   │   └── useGameHistory.test.ts # 履歴フックテスト ✅ 新規
│   └── index.ts           # エクスポート用 ✅
├── lib/                   # ビジネスロジック ✅
│   ├── gameLogic.ts       # ゲームロジック ✅
│   ├── aiPlayer.ts        # AI実装 ✅ 新規
│   ├── repository.ts      # データアクセス ✅ 新規
│   ├── __tests__/         # テストファイル ✅
│   │   ├── gameLogic.test.ts # ゲームロジックテスト
│   │   ├── aiPlayer.test.ts # AIテスト ✅ 新規
│   │   └── repository.test.ts # リポジトリテスト ✅ 新規
│   └── index.ts           # エクスポート用 ✅
└── types/                 # 型定義 ✅
    ├── common/            # 共通型 ✅ 新規
    │   ├── game.ts        # ゲーム関連型
    │   ├── api.ts         # API型定義
    │   └── repository.ts  # リポジトリ型
    ├── client/            # クライアント型 ✅ 新規
    │   ├── components.ts  # コンポーネント型
    │   ├── hooks.ts       # フック型
    │   └── index.ts       # エクスポート
    ├── game.ts            # レガシー型 ✅
    └── index.ts           # エクスポート用 ✅
```

## 🔄 開発フェーズ

### Phase 1: 基盤構築 ✅ 完了

1. ✅ Next.js + TypeScript プロジェクトセットアップ
2. ✅ Tailwind CSS, ESLint, Prettier 設定
3. ✅ 基本的なプロジェクト構造作成
4. ✅ 型定義の実装

### Phase 2: コア機能 ✅ 完了

5. ✅ ゲームロジック実装
6. ✅ useGameフック実装（ゲーム状態管理）
7. ✅ GameBoardコンポーネント実装
8. ✅ メインページ統合・人vs人モード完成

### Phase 3: AI・棋譜機能 ✅ 完了

9. ✅ ランダムAI実装 (PvC対戦モード完成)
10. ✅ 棋譜記録機能 (localStorage基盤)
11. ✅ 棋譜履歴表示 (/history ページ)
12. ✅ 新コンポーネント群 (Button, Cell, StatusDisplay, GameHistory)

### 今後の予定 (Phase 4-6)

- ✅ Phase 4: 高度な機能 - 部分実装済み
  - ⏳ 棋譜再生機能
  - ⏳ 先攻・後攻選択
- ✅ Phase 5: UI/UX改善 - ほぼ完成
- ✅ Phase 6: 最終調整 - テスト完備済み

## 🤝 コントリビュート

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
