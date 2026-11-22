import { useContext } from "react";
import { FavoritesStateContext } from "../context/FavoritesContext";

/**
 * useIsFavorite
 * Hook chuyên biệt kiểm tra một bộ phim có trong danh sách yêu thích hay không (Tra cứu O(1))
 * @param {string} slug - Định danh phim
 * @returns {boolean}
 */
export const useIsFavorite = (slug) => {
  const context = useContext(FavoritesStateContext);

  if (!context) {
    throw new Error("useIsFavorite phải được dùng bên trong FavoritesProvider");
  }

  return context.isFavorite(slug);
};

export default useIsFavorite;
