import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const MULTI_FILTER_KEYS = ["category", "country", "year"];
const SINGLE_FILTER_KEYS = ["sort_field", "sort_type", "sort_lang"];

/**
 * Tách chuỗi query param phân tách bởi dấu phẩy thành mảng giá trị duy nhất
 */
const parseMultiParam = (rawValue) => {
  if (!rawValue) return [];
  const seen = new Set();
  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
};

/**
 * useCatalogFilters: Quản lý trạng thái bộ lọc & phân trang đồng bộ trực tiếp với URL SearchParams
 * Giúp giữ nguyên bộ lọc khi chuyển trang, reload hoặc chia sẻ liên kết.
 * @param {'type' | 'genre' | 'country' | 'search'} [mode='type']
 */
export default function useCatalogFilters(mode = "type") {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();

  const page = useMemo(() => {
    const parsed = parseInt(searchParams.get("page"), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const filters = useMemo(() => {
    const params = new URLSearchParams(searchKey);
    return {
      category: mode === "genre" ? [] : parseMultiParam(params.get("category")),
      country: mode === "country" ? [] : parseMultiParam(params.get("country")),
      year: parseMultiParam(params.get("year")),
      sort_field: params.get("sort_field") || "",
      sort_type: params.get("sort_type") || "",
      sort_lang: params.get("sort_lang") || "",
    };
  }, [searchKey, mode]);

  const activeFilterCount = useMemo(() => {
    const multiCount =
      filters.category.length + filters.country.length + filters.year.length;
    const singleCount = [
      filters.sort_field,
      filters.sort_type,
      filters.sort_lang,
    ].filter(Boolean).length;
    return multiCount + singleCount;
  }, [filters]);

  /**
   * Áp dụng bộ lọc mới vào URL và tự động đưa trang về 1
   */
  const applyFilters = useCallback(
    (nextFilters) => {
      const nextParams = new URLSearchParams();

      MULTI_FILTER_KEYS.forEach((key) => {
        const list = Array.isArray(nextFilters?.[key])
          ? nextFilters[key].filter(Boolean)
          : [];
        if (list.length > 0) {
          nextParams.set(key, list.join(","));
        }
      });

      SINGLE_FILTER_KEYS.forEach((key) => {
        const val = nextFilters?.[key];
        if (val) {
          nextParams.set(key, val);
        }
      });

      setSearchParams(nextParams);
    },
    [setSearchParams],
  );

  /**
   * Xóa toàn bộ bộ lọc đang áp dụng
   */
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  /**
   * Gỡ bỏ một tiêu chí lọc đơn lẻ (dùng cho thanh chip bộ lọc đang bật)
   */
  const removeFilterValue = useCallback(
    (key, value) => {
      const nextFilters = {
        ...filters,
        category: [...filters.category],
        country: [...filters.country],
        year: [...filters.year],
      };

      if (MULTI_FILTER_KEYS.includes(key)) {
        nextFilters[key] = nextFilters[key].filter((item) => item !== value);
      } else if (SINGLE_FILTER_KEYS.includes(key)) {
        nextFilters[key] = "";
      }

      applyFilters(nextFilters);
    },
    [filters, applyFilters],
  );

  /**
   * Chuyển trang nhưng vẫn giữ nguyên toàn bộ tham số lọc hiện tại
   */
  const setPage = useCallback(
    (newPage) => {
      const nextParams = new URLSearchParams(searchParams);
      if (newPage > 1) {
        nextParams.set("page", String(newPage));
      } else {
        nextParams.delete("page");
      }
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  return {
    page,
    filters,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    applyFilters,
    resetFilters,
    removeFilterValue,
    setPage,
  };
}
