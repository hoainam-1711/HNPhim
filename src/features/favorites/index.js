// Context & Provider
export {
  FavoritesStateContext,
  FavoritesDispatchContext,
} from "./context/FavoritesContext";
export { default as FavoritesProvider } from "./context/FavoritesProvider";

// Custom Hooks
export { default as useFavorites } from "./hooks/useFavorites";
export { default as useIsFavorite } from "./hooks/useIsFavorite";
export { default as useFavoriteActions } from "./hooks/useFavoriteActions";

// Components
export { default as FavoriteButton } from "./components/FavoriteButton";
export { default as FavoriteCounter } from "./components/FavoriteCounter";

// Utils & Normalizers
export {
  normalizeFavoriteItem,
  migrateFavoritesData,
} from "./utils/normalizeFavorite";
