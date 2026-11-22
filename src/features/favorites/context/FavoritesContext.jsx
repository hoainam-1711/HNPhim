import { createContext } from "react";

/**
 * Context chứa trạng thái dữ liệu (danh sách favorites, số lượng, hàm kiểm tra lookup)
 */
export const FavoritesStateContext = createContext(null);

/**
 * Context chứa hành động cập nhật (toggleFavorite) với reference ổn định tuyệt đối
 */
export const FavoritesDispatchContext = createContext(null);
