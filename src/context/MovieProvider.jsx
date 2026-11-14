import { useEffect, useState, useCallback, useMemo } from "react";
import {
  MovieContext,
  FavoritesStateContext,
  FavoritesActionsContext,
} from "./MovieContext";

// Khóa định danh lưu trữ danh sách yêu thích trong LocalStorage
const STORAGE_KEY = "family_favorites";

export const MovieProvider = ({ children }) => {
  // =========================================================
  // 1. STATE KHỞI TẠO TỪ LOCALSTORAGE (LAZY INITIALIZATION)
  // =========================================================
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Lỗi đọc dữ liệu favorites từ localStorage:", error);
      return [];
    }
  });

  // =========================================================
  // 2. ĐỒNG BỘ STATE VÀO LOCALSTORAGE KHI FAVORITES THAY ĐỔI
  // =========================================================
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Lỗi lưu dữ liệu favorites vào localStorage:", error);
    }
  }, [favorites]);

  // =========================================================
  // 3. SET TRA CỨU O(1) CHO IS_FAVORITE
  // =========================================================
  const favoritesSet = useMemo(
    () => new Set(favorites.map((item) => item?.slug).filter(Boolean)),
    [favorites],
  );

  // =========================================================
  // 4. CÁC HÀM XỬ LÝ DỮ LIỆU (ACTIONS)
  // =========================================================

  /**
   * Thêm hoặc xóa một bộ phim khỏi danh sách yêu thích
   * Callback này KHÔNG có dependencies => Tham chiếu ổn định vĩnh viễn,
   * không bao giờ kích hoạt re-render ở các component chỉ dùng action.
   */
  const toggleFavorite = useCallback((movie) => {
    if (!movie?.slug) return;

    setFavorites((prev) => {
      const isExist = prev.some((item) => item.slug === movie.slug);
      return isExist
        ? prev.filter((item) => item.slug !== movie.slug)
        : [movie, ...prev];
    });
  }, []);

  /**
   * Kiểm tra nhanh O(1) xem phim có trong favorites không
   */
  const isFavorite = useCallback(
    (slug) => Boolean(slug && favoritesSet.has(slug)),
    [favoritesSet],
  );

  // =========================================================
  // 5. MEMOIZE CONTEXT VALUES
  // =========================================================

  // Context chỉ chứa Actions (100% stable reference)
  const actionsValue = useMemo(
    () => ({
      toggleFavorite,
    }),
    [toggleFavorite],
  );

  // Context chỉ chứa State
  const stateValue = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
    }),
    [favorites, isFavorite],
  );

  // Context kết hợp đầy đủ (Backward compatibility cho code cũ)
  const combinedValue = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, toggleFavorite, isFavorite],
  );

  return (
    <FavoritesActionsContext.Provider value={actionsValue}>
      <FavoritesStateContext.Provider value={stateValue}>
        <MovieContext.Provider value={combinedValue}>
          {children}
        </MovieContext.Provider>
      </FavoritesStateContext.Provider>
    </FavoritesActionsContext.Provider>
  );
};
