import { useCallback } from "react";
import movieApi from "../api/movieApi";
import useFetch from "./useFetch";

export default function useMovieDetail(slug) {
  const fetcher = useCallback(() => {
    if (!slug) return Promise.resolve(null);
    return movieApi.getMovieDetail(slug);
  }, [slug]);

  return useFetch(fetcher, Boolean(slug));
}