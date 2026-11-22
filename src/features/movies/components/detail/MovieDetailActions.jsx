import { Button } from "react-bootstrap";
import { Bookmark, BookmarkCheck, Play } from "lucide-react";

/**
 * Các nút hành động chính của phim: Xem Phim & Lưu Yêu Thích
 */
const MovieDetailActions = ({
  onWatch,
  isFavorited,
  onToggleFavorite,
  canWatch = true,
}) => {
  return (
    <div className="movie-actions">
      <Button
        className="movie-watch-btn"
        onClick={onWatch}
        disabled={!canWatch}
      >
        <Play /> Xem Phim
      </Button>

      <Button
        variant="link"
        className="movie-favorite-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        {isFavorited ? <BookmarkCheck /> : <Bookmark />}
        <span>Lưu</span>
      </Button>
    </div>
  );
};

export default MovieDetailActions;
