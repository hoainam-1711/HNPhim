import "./MovieCard.css";
import { memo, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import {
  MovieContext,
  FavoritesActionsContext,
} from "../../../context/MovieContext";
import LucideIcon from "@/core/components/icons";
import { getImageSrc, handleImgError } from "@/core/utils/image";

/**
 * Pure MovieCard:
 * - Không subscribe trực tiếp vào Favorites State Context
 * - Chỉ nhận isFavorited qua props và lấy toggleFavorite từ ActionsContext (stable)
 * - Đảm bảo React.memo hoạt động 100% hiệu quả (chỉ re-render card được bấm, không re-render cả danh sách)
 */
const PureMovieCard = memo(function PureMovieCard({
  movie,
  isFavorited = false,
  onToggleFavorite,
}) {
  const { poster_url, thumb_url, name } = movie || {};
  const posterSrc = getImageSrc(poster_url || thumb_url);

  const actions = useContext(FavoritesActionsContext);
  const handleToggle = onToggleFavorite || actions?.toggleFavorite;

  return (
    <Card className="movie-card">
      <div className="poster-wrapper">
        <Card.Img
          variant="top"
          src={posterSrc}
          alt={name}
          loading="lazy"
          onError={handleImgError}
          className="movie-card-img"
        />
        <div className="overlay">
          <Card.Title className="title">{name}</Card.Title>
          <Button
            variant="link"
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggle?.(movie);
            }}
          >
            {isFavorited ? (
              <LucideIcon icon="BookmarkCheck" />
            ) : (
              <LucideIcon icon="Bookmark" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
});

/**
 * Fallback Component khi dùng MovieCard độc lập mà không truyền isFavorited
 */
const StandaloneMovieCard = ({ movie, ...props }) => {
  const context = useContext(MovieContext);
  const favorited = context?.isFavorite?.(movie?.slug) ?? false;
  return (
    <PureMovieCard
      movie={movie}
      isFavorited={favorited}
      onToggleFavorite={context?.toggleFavorite}
      {...props}
    />
  );
};

const MovieCard = (props) => {
  // Nếu đã truyền isFavorited từ list cha, dùng PureMovieCard tối ưu
  if (props.isFavorited !== undefined) {
    return <PureMovieCard {...props} />;
  }
  // Nếu không truyền, fallback về Standalone
  return <StandaloneMovieCard {...props} />;
};

export default memo(MovieCard);
