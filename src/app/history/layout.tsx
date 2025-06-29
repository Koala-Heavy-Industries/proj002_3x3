/**
 * 棋譜履歴ページ専用レイアウト
 */

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜履歴 | 三目並べ",
  description:
    "三目並べの棋譜履歴を確認できます。過去のゲーム記録、統計情報、勝敗履歴を表示します。",
  keywords: ["三目並べ", "棋譜", "履歴", "ゲーム記録", "統計"],
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
