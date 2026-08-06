import movieApi from "../api/movieApi";
import useFetch from "./useFetch";

export default function useGenres() {
  return useFetch(movieApi.getGenres);
}