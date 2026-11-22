import { useCallback } from "react";
import { useFetch } from "@/core/hooks";
import { movieService } from "../services";

/**
 * useMovieDetail: Tải thông tin chi tiết của một bộ phim
 * @param {string} slug - Slug của phim
 */
export default function useMovieDetail(slug) {
  const fetcher = useCallback(
    (config) => {
      if (!slug) return Promise.resolve(null);
      return movieService.getMovieDetail(slug, config);
    },
    [slug],
  );

  return useFetch(fetcher, Boolean(slug));
}
