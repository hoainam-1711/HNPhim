import { useEffect, useState, useCallback, useMemo } from "react";
import { MovieContext } from "./MovieContext";

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
  // 3. CÁC HÀM XỬ LÝ DỮ LIỆU (ACTIONS)
  // =========================================================

  /**
   * Thêm hoặc xóa một bộ phim khỏi danh sách yêu thích
   * - Nếu đã có: Xóa khỏi danh sách
   * - Nếu chưa có: Đưa phim mới lên đầu danh sách
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
   * Kiểm tra một bộ phim đã nằm trong danh sách yêu thích hay chưa dựa vào slug
   * @param {string} slug - Mã định danh của phim
   * @returns {boolean}
   */
  const isFavorite = useCallback(
    (slug) => favorites.some((item) => item.slug === slug),
    [favorites]
  );

  // =========================================================
  // 4. MEMOIZE CONTEXT VALUE ĐỂ TRÁNH RE-RENDER KHÔNG CẦN THIẾT
  // =========================================================
  const contextValue = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, toggleFavorite, isFavorite]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};