import { useCallback } from "react";
import movieApi from "../api/movieApi";
import useFetch from "./useFetch";

export default function useMoviesByGenre(slug, limit = 10, page = 1, status) {
  const fetcher = useCallback(() => {
    if (!slug) return Promise.resolve(null);
    return movieApi.getMoviesByGenre(slug, limit, page, status);
  }, [slug, limit, page, status]);

  return useFetch(fetcher, Boolean(slug));
}