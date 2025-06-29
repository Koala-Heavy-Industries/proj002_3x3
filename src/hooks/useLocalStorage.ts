/**
 * localStorage操作用カスタムフック
 */

import { useState, useEffect, useCallback } from "react";
import type { UseLocalStorageReturn } from "../types/client/hooks";

/**
 * localStorageを使用した状態管理フック
 * @param key - localStorageのキー
 * @param defaultValue - デフォルト値
 * @returns localStorage操作用のstate・setter・remover
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [value, setValue] = useState<T>(defaultValue);

  // 初期値の読み込み
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [key]);

  // 値の更新
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setError(null);
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;

        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [key, value]
  );

  // 値の削除
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    loading,
    error,
  };
}

export default useLocalStorage;
