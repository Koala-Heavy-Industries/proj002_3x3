# 3x3 三目並べゲーム

Next.js + TypeScriptで開発された3x3三目並べゲームアプリケーション。
棋譜記録・再生機能とクラウドDB移行を見据えた設計で構築されています。

## 🎯 主な機能

### 基本ゲーム機能

- 3x3ゲームボード
- プレイヤー交代 (X / O)
- 勝利判定 (縦・横・斜め)
- 引き分け判定

### 対戦モード

- **人 vs 人** (同一デバイス)
- **人 vs コンピュータ** (ランダムAI)
- **先攻・後攻選択** (プレイヤーが選択可能)

### 棋譜機能

- **棋譜記録** (手順・タイムスタンプ)
- **棋譜履歴** (過去のゲーム保存)
- **棋譜再生** (手順を順番に再現)
- **個別削除** (選択した棋譜のみ削除)

### UI/UX機能

- **レスポンシブ対応** (モバイル・タブレット)
- **ダークモード対応** (ライト/ダーク切り替え)
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

- ゲームロジック関数: 100%
- 型定義: TypeScriptによる型安全性確保

## 🏗️ プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── globals.css        # グローバルCSS
│   └── favicon.ico        # ファビコン
├── components/            # UIコンポーネント
│   └── index.ts           # エクスポート用
├── hooks/                 # カスタムフック
│   └── index.ts           # エクスポート用
├── lib/                   # ビジネスロジック
│   ├── gameLogic.ts       # ゲームロジック
│   ├── __tests__/         # テストファイル
│   │   └── gameLogic.test.ts
│   └── index.ts           # エクスポート用
└── types/                 # 型定義
    ├── game.ts            # ゲーム関連型
    └── index.ts           # エクスポート用
```

## 🔄 開発フェーズ

### Phase 1: 基盤構築 ✅ 完了

1. ✅ Next.js + TypeScript プロジェクトセットアップ
2. ✅ Tailwind CSS, ESLint, Prettier 設定
3. ✅ 基本的なプロジェクト構造作成
4. ✅ 型定義の実装

### Phase 2: コア機能 🚧 進行中

5. ✅ ゲームロジック実装
6. ゲームボードコンポーネント
7. 人vs人モード
8. 勝利判定・ゲーム終了処理

### 今後の予定

- AI・棋譜機能の実装
- 高度な機能追加
- UI/UX改善
- 最終調整

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
