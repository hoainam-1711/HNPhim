import { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BookmarkCheck } from "lucide-react";
import { FavoritesStateContext } from "../context/FavoritesContext";

/**
 * FavoriteCounter
 * Nút điều hướng kèm badge đếm số lượng phim yêu thích dùng trên Header/Navbar
 *
 * @param {Object} props
 * @param {string} [props.className=""] - Class CSS bổ sung
 */
export const FavoriteCounter = memo(function FavoriteCounter({
  className = "",
  ...rest
}) {
  const state = useContext(FavoritesStateContext);
  const count = state?.favoritesCount ?? 0;

  return (
    <Button
      as={Link}
      to="/ua-thich"
      variant="link"
      className={`favorite text-nowrap ${className}`.trim()}
      title="Danh sách phim yêu thích"
      aria-label={`Danh sách phim yêu thích (${count} phim)`}
      {...rest}
    >
      <BookmarkCheck />
      <span className="favorite-count">{count}</span>
    </Button>
  );
});

export default FavoriteCounter;
