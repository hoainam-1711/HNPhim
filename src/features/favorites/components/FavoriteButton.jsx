import { memo } from "react";
import { Button } from "react-bootstrap";
import LucideIcon from "@/core/components/icons";
import { useIsFavorite } from "../hooks/useIsFavorite";
import { useFavoriteActions } from "../hooks/useFavoriteActions";

/**
 * FavoriteButton
 * Component nút bấm yêu thích độc lập, tự động đồng bộ trạng thái lưu/bỏ lưu.
 *
 * @param {Object} props
 * @param {Object} props.movie - Object phim cần lưu
 * @param {string} [props.className=""] - Class CSS tùy biến
 * @param {string} [props.activeColor="#f3ca3e"] - Màu icon khi đã lưu
 * @param {boolean} [props.showLabel=false] - Có hiển thị chữ nhãn "Lưu" hay không
 * @param {string} [props.variant="link"] - Biến thể Button của React Bootstrap
 */
export const FavoriteButton = memo(function FavoriteButton({
  movie,
  className = "",
  activeColor = "#f3ca3e",
  showLabel = false,
  variant = "link",
  ...rest
}) {
  const isFavorited = useIsFavorite(movie?.slug);
  const { toggleFavorite } = useFavoriteActions();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie) {
      toggleFavorite(movie);
    }
  };

  const titleText = isFavorited
    ? "Xóa khỏi danh sách yêu thích"
    : "Lưu vào danh sách yêu thích";

  return (
    <Button
      variant={variant}
      className={`favorite-btn ${className}`.trim()}
      onClick={handleClick}
      title={titleText}
      aria-label={titleText}
      aria-pressed={isFavorited}
      {...rest}
    >
      {isFavorited ? (
        <LucideIcon icon="BookmarkCheck" color={activeColor} />
      ) : (
        <LucideIcon icon="Bookmark" />
      )}
      {showLabel && <span>{isFavorited ? "Đã lưu" : "Lưu"}</span>}
    </Button>
  );
});

export default FavoriteButton;
