import { useCallback } from "react";
import { useFetch } from "@/core/hooks";
import { movieService } from "../services";

/**
 * useMovieCatalog: Hook hợp nhất duyệt danh mục phim theo loại, thể loại, quốc gia, hoặc tìm kiếm
 * @param {Object} params
 * @param {'type' | 'genre' | 'country' | 'search'} [params.mode='type']
 * @param {string} params.identifier - Slug hoặc từ khóa tìm kiếm
 * @param {number} [params.page=1] - Trang hiện tại
 * @param {number} [params.limit=24] - Số phim mỗi trang
 */
export default function useMovieCatalog({
  mode = "type",
  identifier = "",
  page = 1,
  limit = 24,
}) {
  const fetcher = useCallback(
    (config) => {
      const trimmed = identifier?.trim();
      if (!trimmed) return Promise.resolve(null);

      switch (mode) {
        case "type":
          return movieService.getNewMovies(trimmed, limit, page, config);
        case "genre":
          return movieService.getMoviesByGenre(trimmed, limit, page, config);
        case "country":
          return movieService.getMoviesByCountry(trimmed, limit, page, config);
        case "search":
          return movieService.searchMovies(trimmed, limit, page, config);
        default:
          return Promise.resolve(null);
      }
    },
    [mode, identifier, page, limit],
  );

  return useFetch(fetcher, Boolean(identifier?.trim()));
}
