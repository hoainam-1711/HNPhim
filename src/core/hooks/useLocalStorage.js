import { useState, useCallback } from "react";

/**
 * useLocalStorage
 * Quản lý state đồng bộ với localStorage an toàn, chống crash khi parse JSON lỗi
 *
 * @param {string} key - Tên khóa lưu trữ
 * @param {any} initialValue - Giá trị khởi tạo
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Lỗi đọc key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`[useLocalStorage] Lỗi lưu key "${key}":`, error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
