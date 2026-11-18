import { useCallback } from "react";
import movieApi from "../../../api/movieApi";
import useFetch from "@/core/hooks/useFetch";

export default function useHomeMovies(types = [], limit = 6) {
  const fetcher = useCallback(
    () => movieApi.getHomeMovies(types, limit),
    [types, limit],
  );

  return useFetch(fetcher);
}