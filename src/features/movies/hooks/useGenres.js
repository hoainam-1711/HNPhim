import movieApi from "../../../api/movieApi";
import useFetch from "@/core/hooks/useFetch";

export default function useGenres(enabled = true) {
  return useFetch(movieApi.getGenres, enabled);
}
