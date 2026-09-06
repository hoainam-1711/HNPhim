import { useState, useEffect, useCallback } from "react";

export default function useFetch(apiFunc, autoFetch = true) {
  // ==========================================
  // 1. STATES (Trạng thái dữ liệu, loading & lỗi)
  // ==========================================
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // ==========================================
  // 2. HANDLERS / ACTIONS (Hàm gọi API)
  // ==========================================
  /**
   * Thực thi hàm API truyền vào với các tham số tương ứng.
   * Dùng useCallback để tránh tạo lại hàm khi component re-render.
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunc(...args);
        setData(response);
        return response;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [apiFunc],
  );

  // ==========================================
  // 3. EFFECTS (Tự động gọi dữ liệu khi khởi tạo)
  // ==========================================
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [execute, autoFetch]);

  // ==========================================
  // 4. RETURN VALUES (Dữ liệu trả về cho component)
  // ==========================================
  return {
    data,
    loading,
    error,
    refetch: execute, // Hàm kích hoạt gọi lại API thủ công
  };
}
