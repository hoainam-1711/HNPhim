import { useCallback } from "react";
import { useFetch } from "@/core/hooks";
import { movieService } from "../services";

/**
 * useFilterData: Tải song song danh sách Thể loại và Quốc gia phục vụ FilterModal
 * @param {boolean} [enabled=true] - Kích hoạt tải dữ liệu
 */
export default function useFilterData(enabled = true) {
  const fetcher = useCallback(async (config) => {
    const [genresData, countriesData] = await Promise.all([
      movieService.getGenres(config),
      movieService.getCountries(config),
    ]);

    return {
      genres: genresData?.items || [],
      countries: countriesData?.items || [],
    };
  }, []);

  return useFetch(fetcher, enabled);
}
