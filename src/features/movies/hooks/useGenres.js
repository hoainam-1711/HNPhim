import movieApi from "../../../api/movieApi";
import useFetch from "../../../hooks/useFetch";

export default function useGenres() {
  return useFetch(movieApi.getGenres);
}