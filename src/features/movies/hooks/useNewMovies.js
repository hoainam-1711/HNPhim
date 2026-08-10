import { useCallback } from "react";
import useFetch from "../../../hooks/useFetch";
import movieApi from "../../../api/movieApi";

export default function useNewMovies(type, limit, page) {
  const fetcher = useCallback(
    () => movieApi.getNewMovies(type, limit, page),
    [type, limit, page],
  );
  return useFetch(fetcher);
}
