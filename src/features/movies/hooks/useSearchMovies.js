import { useCallback } from "react";
import movieApi from "../../../api/movieApi";
import useFetch from "../../../hooks/useFetch";

export default function useSearchMovies(keyword, limit, page) {
  const fetcher = useCallback(() => {
    if (!keyword?.trim()) return Promise.resolve(null);
    return movieApi.searchMovies(keyword, limit, page);
  }, [keyword, limit, page]);

  return useFetch(fetcher, Boolean(keyword?.trim()));
}