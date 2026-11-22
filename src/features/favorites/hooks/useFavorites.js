import { useContext } from "react";
import {
  FavoritesStateContext,
  FavoritesDispatchContext,
} from "../context/FavoritesContext";

/**
 * useFavorites
 * Hook đa năng trả về cả state lẫn action (tương thích 100% với code hiện tại)
 * @returns {{ favorites: Array, favoritesCount: number, isFavorite: Function, toggleFavorite: Function }}
 */
export const useFavorites = () => {
  const state = useContext(FavoritesStateContext);
  const dispatch = useContext(FavoritesDispatchContext);

  if (!state || !dispatch) {
    throw new Error("useFavorites phải được dùng bên trong FavoritesProvider");
  }

  return {
    ...state,
    ...dispatch,
  };
};

export default useFavorites;
