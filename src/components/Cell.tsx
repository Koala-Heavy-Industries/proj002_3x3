/**
 * ゲームセル専用コンポーネント
 */

import React from "react";
import type { CellProps } from "../types/client/components";

/**
 * ゲームボードのセルコンポーネント
 */
export function Cell({
  position,
  content,
  onClick,
  disabled = false,
  highlighted = false,
  className = "",
  ariaLabel,
}: CellProps) {
  const handleClick = () => {
    if (!disabled && !content) {
      onClick(position);
    }
  };

  // セルの基本スタイル
  const baseClasses = [
    "w-20 h-20 border-2 border-gray-400",
    "flex items-center justify-center",
    "text-3xl font-bold",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  ];

  // 状態別スタイル
  const stateClasses = [];

  if (content) {
    // セルに内容がある場合
    stateClasses.push(content === "X" ? "text-blue-600" : "text-red-600");
  } else if (disabled) {
    // 無効化状態
    stateClasses.push("cursor-not-allowed", "opacity-50");
  } else {
    // クリック可能状態
    stateClasses.push(
      "cursor-pointer",
      "hover:bg-gray-100 dark:hover:bg-gray-700"
    );
  }

  // ハイライト表示
  if (highlighted) {
    stateClasses.push("bg-yellow-100 dark:bg-yellow-900");
  }

  const cellClasses = [...baseClasses, ...stateClasses, className]
    .filter(Boolean)
    .join(" ");

  // アクセシビリティラベル
  const defaultAriaLabel = `セル ${position + 1}${
    content ? `, ${content}` : ", 空"
  }`;

  return (
    <button
      className={cellClasses}
      onClick={handleClick}
      disabled={disabled || !!content}
      aria-label={ariaLabel || defaultAriaLabel}
      tabIndex={disabled ? -1 : 0}
    >
      {content || ""}
    </button>
  );
}

export default Cell;
