import { useCallback } from "react";
import movieApi from "../../../api/movieApi";
import useFetch from "../../../hooks/useFetch";

export default function useMoviesByGenre(slug, limit, page) {
  const fetcher = useCallback(() => {
    if (!slug) return Promise.resolve(null);
    return movieApi.getMoviesByGenre(slug, limit, page);
  }, [slug, limit, page]);

  return useFetch(fetcher, Boolean(slug));
}