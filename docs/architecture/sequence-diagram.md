# ゲームフロー・シーケンス図

## 概要

ユーザー操作からゲーム終了までの時系列処理、リセット・統計更新・エラーハンドリングの詳細なシーケンス図を示します。

### 🔰 初心者向け：シーケンス図の読み方

**シーケンス図**は、時間の経過と共に、システムの各部分がどのように連携するかを示した図です。

**読み方のポイント**：
- **縦線**: 各コンポーネントの「ライフライン」（存在期間）
- **横矢印**: 関数呼び出しやデータの受け渡し
- **点線矢印**: 戻り値や非同期処理の結果
- **時間の流れ**: 上から下へ順番に処理が進む

**実際のコードとの対応**：
- 矢印に書かれた関数名が、実際のコードの関数名と一致
- 図を見ながら、実際のファイルを追いかけることが可能

## 完全ゲームフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant GB as GameBoard
    participant UG as useGame Hook
    participant GL as gameLogic
    participant P as Page
    participant LS as localStorage

    Note over U,LS: 🎮 ゲーム開始

    U->>GB: アプリ起動
    GB->>UG: useGame() 初期化
    UG->>GL: createInitialGameState()
    GL-->>UG: 初期GameState
    UG-->>GB: gameState, 操作関数
    GB-->>U: 空の3x3ボード表示

    Note over U,LS: 🎯 ゲームプレイ (先攻 X)

    U->>GB: セル(0) クリック
    GB->>GB: canMakeMove(0) チェック
    GB->>UG: makeMove(0)
    UG->>GL: updateGameState(state, 0)

    GL->>GL: board[0] = "X"
    GL->>GL: moves.push({player:"X", position:0, timestamp})
    GL->>GL: currentPlayer = "O"
    GL->>GL: checkWinner() → null
    GL->>GL: isDraw() → false
    GL->>GL: gameStatus = "playing"

    GL-->>UG: 新しいGameState
    UG-->>GB: gameState更新
    GB-->>U: X表示, 現在プレイヤー: O

    Note over U,LS: 🎯 ゲームプレイ (後攻 O)

    U->>GB: セル(4) クリック
    GB->>UG: makeMove(4)
    UG->>GL: updateGameState(state, 4)

    GL->>GL: board[4] = "O"
    GL->>GL: currentPlayer = "X"
    GL->>GL: checkWinner() → null
    GL->>GL: gameStatus = "playing"

    GL-->>UG: 新しいGameState
    UG-->>GB: gameState更新
    GB-->>U: O表示, 現在プレイヤー: X

    Note over U,LS: 🎯 ゲーム継続 (複数手番)

    loop 複数回の手番
        U->>GB: セルクリック
        GB->>UG: makeMove(position)
        UG->>GL: updateGameState()
        GL-->>UG: 更新されたGameState
        UG-->>GB: gameState更新
        GB-->>U: UI更新
    end

    Note over U,LS: 🏆 勝利確定

    U->>GB: セル(8) クリック (勝利手)
    GB->>UG: makeMove(8)
    UG->>GL: updateGameState(state, 8)

    GL->>GL: board[8] = "X"
    GL->>GL: checkWinner() → "X" (0,4,8ライン)
    GL->>GL: gameStatus = "finished"
    GL->>GL: winner = "X"

    GL-->>UG: 勝利状態のGameState
    UG-->>GB: gameState更新

    GB->>GB: useEffect 勝利検知
    GB->>P: onGameEnd("X")

    P->>P: handleGameEnd実行
    P->>P: setGameHistory 更新
    P->>LS: localStorage保存

    GB-->>U: 勝利表示, リセットボタン表示

    Note over U,LS: 📊 統計確認

    U->>P: 統計表示ボタンクリック
    P->>P: setShowStats(true)
    P-->>U: 統計情報表示
```

## リセットフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant GB as GameBoard
    participant UG as useGame Hook
    participant GL as gameLogic

    Note over U,GL: 🔄 ゲームリセット

    U->>GB: "新しいゲーム" ボタンクリック
    GB->>UG: resetGame()
    UG->>GL: createInitialGameState("X")

    GL->>GL: board = [null × 9]
    GL->>GL: currentPlayer = "X"
    GL->>GL: gameStatus = "playing"
    GL->>GL: winner = null
    GL->>GL: moves = []

    GL-->>UG: 初期GameState
    UG-->>GB: gameState更新

    GB->>GB: useEffect 状態変更検知
    GB->>GB: setHasNotifiedGameEnd(false)

    GB-->>U: クリアされたボード表示

    Note over U,GL: 🎮 新しいゲーム開始可能
```

## 無効操作のハンドリング

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant GB as GameBoard
    participant UG as useGame Hook

    Note over U,UG: ⚠️ 無効操作の処理

    U->>GB: 既に埋まったセルをクリック
    GB->>GB: canMakeMove(position) → false

    alt セルが既に埋まっている
        GB->>GB: 操作無視
        GB-->>U: 変化なし (視覚的フィードバックなし)
    else ゲームが終了している
        GB->>GB: 操作無視
        GB-->>U: 変化なし
    end

    Note over U,UG: ✅ 有効操作の場合

    U->>GB: 空のセルをクリック
    GB->>GB: canMakeMove(position) → true
    GB->>UG: makeMove(position)

    UG->>UG: setGameState実行
    UG-->>GB: 正常な状態更新
    GB-->>U: UI更新
```

## 統計管理フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant LS as localStorage
    participant GB as GameBoard

    Note over U,GB: 📊 統計初期化

    P->>LS: getItem('tic-tac-toe-stats')

    alt localStorage にデータあり
        LS-->>P: 保存された統計データ
        P->>P: setGameHistory(保存データ)
    else localStorage が空
        P->>P: setGameHistory(defaultStats)
    end

    Note over U,GB: 🎮 ゲーム終了時の統計更新

    GB->>P: onGameEnd("X")
    P->>P: handleGameEnd実行

    P->>P: 統計計算
    Note over P: totalGames++, wins.X++

    P->>P: setGameHistory(newStats)
    P->>LS: setItem('tic-tac-toe-stats', JSON)

    Note over U,GB: 🗑️ 統計リセット

    U->>P: "統計をリセット" ボタンクリック
    P->>P: resetStats実行
    P->>P: setGameHistory(defaultStats)
    P->>LS: setItem('tic-tac-toe-stats', defaultStats)
    P-->>U: 統計表示が初期値に更新
```

## エラーハンドリングフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant LS as localStorage
    participant C as Console

    Note over U,C: ⚠️ localStorage エラー処理

    U->>P: ゲーム終了 (統計更新)
    P->>P: handleGameEnd実行
    P->>LS: setItem('tic-tac-toe-stats', data)

    alt localStorage 容量不足
        LS-->>P: QuotaExceededError
        P->>C: console.warn("統計保存失敗")
        P->>P: 統計はメモリ内で維持
        P-->>U: ゲームは正常継続
    else localStorage 無効
        LS-->>P: SecurityError
        P->>C: console.warn("localStorage無効")
        P-->>U: 統計機能無効・ゲーム継続
    else 正常保存
        LS-->>P: 保存成功
        P-->>U: 正常動作
    end

    Note over U,C: 🛡️ 型安全性によるエラー防止

    U->>P: 不正な操作 (型エラー)
    Note over P: TypeScript コンパイル時エラー
    P-->>U: 開発時にエラー発見・修正
```

## パフォーマンス最適化フロー

```mermaid
sequenceDiagram
    participant R as React
    participant GB as GameBoard
    participant UG as useGame Hook
    participant M as React.memo

    Note over R,M: ⚡ 再レンダリング最適化

    R->>GB: props変更検知
    GB->>M: React.memo チェック

    alt props が同じ参照
        M-->>R: 再レンダリングスキップ
    else props が異なる参照
        M->>GB: 再レンダリング実行
        GB->>UG: フック実行
        UG-->>GB: メモ化された関数返却
        GB-->>R: UI更新
    end

    Note over R,M: 🔄 useCallback 最適化

    UG->>UG: makeMove 関数参照チェック

    alt 依存配列変更なし
        UG-->>GB: 同じ関数参照返却
    else 依存配列変更あり
        UG->>UG: 新しい関数生成
        UG-->>GB: 新しい関数参照返却
    end
```

## アクセシビリティ対応フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant KB as キーボード
    participant SR as スクリーンリーダー
    participant GB as GameBoard

    Note over U,GB: ♿ キーボード操作

    U->>KB: Tab キー押下
    KB->>GB: フォーカス移動
    GB-->>SR: aria-label 読み上げ
    SR-->>U: "空のマス、ボタン"

    U->>KB: Enter / Space キー押下
    KB->>GB: セルクリック実行
    GB->>GB: handleCellClick
    GB-->>SR: aria-label 更新
    SR-->>U: "X が配置されました"

    Note over U,GB: 🎯 ゲーム状態の音声通知

    GB->>GB: ゲーム状態変更
    GB-->>SR: 現在プレイヤー変更通知
    SR-->>U: "現在のプレイヤー: O"

    alt ゲーム終了時
        GB-->>SR: 勝利/引き分け通知
        SR-->>U: "X の勝利です"
    end
```

## 並行処理・非同期フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant GB as GameBoard
    participant UG as useGame Hook
    participant R1 as Render 1
    participant R2 as Render 2

    Note over U,R2: 🔄 React バッチ更新

    U->>GB: 高速連続クリック
    GB->>UG: makeMove(0)
    GB->>UG: makeMove(1) (即座)

    UG->>UG: setState バッチング

    Note over UG: React 18 自動バッチング

    UG->>R1: 単一の再レンダリング
    R1-->>U: 両方の変更が反映

    Note over U,R2: ⚡ useEffect 順序制御

    UG-->>GB: gameState 更新
    GB->>GB: useEffect 1 実行
    GB->>GB: useEffect 2 実行

    Note over GB: 依存配列の順序で実行

    GB-->>U: 全ての副作用完了後に表示
```

## 📚 初心者のためのシーケンス図活用ガイド

### 1. ゲームフロー図の読み方手順

**Step 1**: 参加者（participant）を確認
- `U` = ユーザー（あなた）
- `GB` = GameBoardコンポーネント
- `UG` = useGameフック
- `GL` = gameLogicモジュール

**Step 2**: 時間の流れを上から下へ追う

**Step 3**: 矢印の意味を理解
- `→`: 関数呼び出しやメッセージ送信
- `-->>`: 戻り値や非同期結果

### 2. 実際のデバッグでの活用方法

**例**: セルクリックが動作しない場合

1. **シーケンス図で流れを確認**
   ```
   ユーザー → GameBoard → useGame → gameLogic
   ```

2. **各ステップでデバッグ**
   ```javascript
   // GameBoard.tsx
   const handleCellClick = (position) => {
     console.log('handleCellClick called:', position); // ①
     if (canMakeMove(position)) {
       console.log('makeMove will be called'); // ②
       makeMove(position);
     }
   };
   ```

3. **問題箇所の特定**
   - ①が表示されない → クリックイベントの問題
   - ②が表示されない → `canMakeMove` の問題
   - ②まで表示される → `useGame` フックの問題

### 3. エラーハンドリングフローの理解

**無効操作の場合**：
```
ユーザーが埋まったセルをクリック
 → GameBoard.canMakeMove(position) → false
 → 操作無視（UI変化なし）
```

**localStorageエラーの場合**：
```
統計保存失敗
 → console.warn でエラーログ出力
 → ゲームは継続（統計はメモリ内のみ）
```

### 4. パフォーマンス最適化の理解

**Reactのバッチ更新**：
```
高速連続クリック
 → React 18 が自動でバッチング
 → 単一の再レンダリングで両方の変化を反映
```

---

**最終更新**: 2025-06-29  
**バージョン**: Phase 4完了版（初心者ガイド追加）  
**作成者**: Claude Code
