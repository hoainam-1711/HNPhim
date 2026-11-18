import { useState, useEffect } from "react";

/**
 * useDebounce
 * Trì hoãn cập nhật giá trị sau một khoảng delay ms
 *
 * @param {any} value - Giá trị cần debounce
 * @param {number} [delay=300] - Thời gian chờ tính bằng ms
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
