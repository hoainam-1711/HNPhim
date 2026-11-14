import movieApi from "../../../api/movieApi";
import useFetch from "../../../hooks/useFetch";

export default function useGenres(enabled = true) {
  return useFetch(movieApi.getGenres, enabled);
}
