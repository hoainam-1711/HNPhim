import { useContext } from "react";
import { FavoritesDispatchContext } from "../context/FavoritesContext";

/**
 * useFavoriteActions
 * Hook chỉ lấy hàm toggleFavorite từ DispatchContext.
 * Tham chiếu hàm là vĩnh viễn không đổi (stable), component sử dụng hook này
 * HOÀN TOÀN KHÔNG BỊ RE-RENDER khi danh sách favorites thay đổi.
 *
 * @returns {{ toggleFavorite: (movie: Object) => void }}
 */
export const useFavoriteActions = () => {
  const context = useContext(FavoritesDispatchContext);

  if (!context) {
    throw new Error(
      "useFavoriteActions phải được dùng bên trong FavoritesProvider",
    );
  }

  return context;
};

export default useFavoriteActions;
