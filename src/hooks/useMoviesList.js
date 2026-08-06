import { useCallback } from "react";
import useFetch from "./useFetch";
import movieApi from "../api/movieApi";

export default function useNewMovies(page = 1) {
  const fetcher = useCallback(() => movieApi.getNewMovies(page), [page]);
  return useFetch(fetcher);
}