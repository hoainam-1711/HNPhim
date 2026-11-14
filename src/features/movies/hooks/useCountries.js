import movieApi from "../../../api/movieApi";
import useFetch from "../../../hooks/useFetch";

export default function useCountries(enabled = true) {
  return useFetch(movieApi.getCountries, enabled);
}
