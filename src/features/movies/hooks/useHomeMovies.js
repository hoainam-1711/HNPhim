import { useCallback, useMemo } from "react";
import { useFetch } from "@/core/hooks";
import { movieService } from "../services";

/**
 * useHomeMovies: Tải danh sách phim cho trang chủ với khả năng ổn định tham chiếu types
 * @param {string[]} types - Danh sách mã loại phim
 * @param {number} [limit=6] - Số lượng phim mỗi loại
 */
export default function useHomeMovies(types = [], limit = 6) {
  // Ổn định reference bằng key chuỗi để tránh vòng lặp fetch vô tận khi truyền array literal
  const stableTypesKey = Array.isArray(types) ? types.join(",") : "";
  const stableTypes = useMemo(
    () => (Array.isArray(types) ? [...types] : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stableTypesKey],
  );

  const fetcher = useCallback(
    (config) => movieService.getHomeMovies(stableTypes, limit, config),
    [stableTypes, limit],
  );

  return useFetch(fetcher);
}
