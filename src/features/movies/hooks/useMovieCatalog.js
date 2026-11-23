import { useCallback, useMemo } from "react";
import { useFetch } from "@/core/hooks";
import { movieService } from "../services";

/**
 * useMovieCatalog: Hook hợp nhất duyệt danh mục phim theo loại, thể loại, quốc gia, hoặc tìm kiếm
 * Hỗ trợ đầy đủ bộ lọc API (category, country, year, sort_field, sort_type, sort_lang)
 * @param {Object} params
 * @param {'type' | 'genre' | 'country' | 'search'} [params.mode='type']
 * @param {string} params.identifier - Slug hoặc từ khóa tìm kiếm
 * @param {number} [params.page=1] - Trang hiện tại
 * @param {number} [params.limit=24] - Số phim mỗi trang
 * @param {Object} [params.filters] - Các tham số lọc bổ sung
 */
export default function useMovieCatalog({
  mode = "type",
  identifier = "",
  page = 1,
  limit = 24,
  filters = {},
}) {
  // Ổn định reference của filters để tránh fetch lặp lại khi truyền object mới có cùng giá trị
  const filtersKey = JSON.stringify({
    category: filters?.category || [],
    country: filters?.country || [],
    year: filters?.year || [],
    sort_field: filters?.sort_field || "",
    sort_type: filters?.sort_type || "",
    sort_lang: filters?.sort_lang || "",
  });

  const stableFilters = useMemo(() => JSON.parse(filtersKey), [filtersKey]);

  const fetcher = useCallback(
    (config) => {
      const trimmed = identifier?.trim();
      if (!trimmed) return Promise.resolve(null);

      switch (mode) {
        case "type":
          return movieService.getNewMovies(
            trimmed,
            limit,
            page,
            config,
            stableFilters,
          );
        case "genre":
          return movieService.getMoviesByGenre(
            trimmed,
            limit,
            page,
            config,
            stableFilters,
          );
        case "country":
          return movieService.getMoviesByCountry(
            trimmed,
            limit,
            page,
            config,
            stableFilters,
          );
        case "search":
          return movieService.searchMovies(
            trimmed,
            limit,
            page,
            config,
            stableFilters,
          );
        default:
          return Promise.resolve(null);
      }
    },
    [mode, identifier, page, limit, stableFilters],
  );

  return useFetch(fetcher, Boolean(identifier?.trim()));
}
