import "./MovieCard.css";
import { memo } from "react";
import { Card } from "react-bootstrap";
import { FavoriteButton } from "@/features/favorites";
import { getImageSrc, handleImgError } from "@/core/utils/image";

/**
 * MovieCard: Component hiển thị thẻ phim tinh gọn, tối ưu re-render với FavoriteButton độc lập
 * @param {Object} props
 * @param {Object} props.movie - Đối tượng phim
 */
const MovieCard = memo(function MovieCard({ movie }) {
  const { poster_url, thumb_url, name } = movie || {};
  const posterSrc = getImageSrc(poster_url || thumb_url);

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
          <FavoriteButton movie={movie} className="favorite-btn" />
        </div>
      </div>
    </Card>
  );
});

export default MovieCard;
