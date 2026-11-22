import { useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/core/hooks";
import {
  FavoritesStateContext,
  FavoritesDispatchContext,
} from "./FavoritesContext";
import {
  normalizeFavoriteItem,
  migrateFavoritesData,
} from "../utils/normalizeFavorite";

const STORAGE_KEY = "family_favorites";

export const FavoritesProvider = ({ children }) => {
  // 1. Quản lý State qua useLocalStorage (an toàn với JSON lỗi & SSR)
  const [rawFavorites, setFavorites] = useLocalStorage(STORAGE_KEY, []);

  // 2. Chạy migration an toàn nếu dữ liệu cũ còn sót các trường thừa hoặc trùng lặp
  useEffect(() => {
    if (Array.isArray(rawFavorites) && rawFavorites.length > 0) {
      const sanitized = migrateFavoritesData(rawFavorites);
      const needsUpdate =
        sanitized.length !== rawFavorites.length ||
        rawFavorites.some((item) => item && Object.keys(item).length > 6);

      if (needsUpdate) {
        setFavorites(sanitized);
      }
    }
  }, [rawFavorites, setFavorites]);

  const favorites = useMemo(
    () => migrateFavoritesData(rawFavorites),
    [rawFavorites],
  );

  // 3. Set tra cứu O(1) cho isFavorite
  const favoritesSet = useMemo(
    () => new Set(favorites.map((item) => item?.slug).filter(Boolean)),
    [favorites],
  );

  // 4. Action toggleFavorite (tham chiếu ổn định, chỉ phụ thuộc setFavorites)
  const toggleFavorite = useCallback(
    (movie) => {
      if (!movie?.slug) return;
      const normalized = normalizeFavoriteItem(movie);
      if (!normalized) return;

      setFavorites((prev) => {
        const currentList = Array.isArray(prev) ? prev : [];
        const isExist = currentList.some((item) => item?.slug === normalized.slug);
        return isExist
          ? currentList.filter((item) => item?.slug !== normalized.slug)
          : [normalized, ...currentList];
      });
    },
    [setFavorites],
  );

  // 5. Hàm kiểm tra O(1)
  const isFavorite = useCallback(
    (slug) => Boolean(slug && favoritesSet.has(slug)),
    [favoritesSet],
  );

  // 6. Memoize Values
  const stateValue = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
    }),
    [favorites, isFavorite],
  );

  const dispatchValue = useMemo(
    () => ({
      toggleFavorite,
    }),
    [toggleFavorite],
  );

  return (
    <FavoritesDispatchContext.Provider value={dispatchValue}>
      <FavoritesStateContext.Provider value={stateValue}>
        {children}
      </FavoritesStateContext.Provider>
    </FavoritesDispatchContext.Provider>
  );
};

export default FavoritesProvider;
