import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

/**
 * useFetch: Custom hook gọi API có tích hợp AbortController chống Race Condition
 * @param {Function} apiFunc - Async function gọi API
 * @param {boolean} autoFetch - Có tự động fetch khi mount hoặc khi apiFunc thay đổi hay không
 */
export default function useFetch(apiFunc, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Lưu controller của request đang chạy để cancel khi cần
  const abortControllerRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      // Hủy request trước đó nếu còn đang chờ
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        // Truyền controller.signal vào apiFunc (nếu apiFunc hỗ trợ)
        const response = await apiFunc(...args, { signal: controller.signal });

        // Chỉ cập nhật state nếu request này chưa bị hủy
        if (!controller.signal.aborted) {
          setData(response);
          return response;
        }
      } catch (err) {
        // Bỏ qua lỗi hủy request (không ghi nhận là lỗi UI)
        const isAborted =
          controller.signal.aborted ||
          axios.isCancel(err) ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError";

        if (!isAborted) {
          setError(err);
        }
      } finally {
        // Chỉ tắt loading nếu request này là request mới nhất và chưa bị hủy
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [apiFunc],
  );

  useEffect(() => {
    if (autoFetch) {
      execute();
    }

    // Cleanup: hủy request khi component unmount hoặc effect re-run
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
