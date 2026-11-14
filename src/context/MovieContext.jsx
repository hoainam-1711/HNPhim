import { createContext, useContext } from "react";

// 1. Context chung (Backward compatibility)
export const MovieContext = createContext(null);

// 2. Context tách riêng: Chỉ lưu trữ State (Favorites data, count, lookup)
export const FavoritesStateContext = createContext(null);

// 3. Context tách riêng: Chỉ lưu trữ Actions (toggleFavorite - tham chiếu ổn định vĩnh viễn)
export const FavoritesActionsContext = createContext(null);

// Custom hooks tiện ích
export const useFavorites = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useFavorites must be used within a MovieProvider");
  }
  return context;
};

export const useFavoritesState = () => {
  const context = useContext(FavoritesStateContext);
  if (!context) {
    throw new Error("useFavoritesState must be used within a MovieProvider");
  }
  return context;
};

export const useFavoriteActions = () => {
  const context = useContext(FavoritesActionsContext);
  if (!context) {
    throw new Error("useFavoriteActions must be used within a MovieProvider");
  }
  return context;
};
