import "./MovieCard.css";
import { memo, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import { getImageSrc, handleImgError } from "../../../utils/formatImage";

const MovieCard = ({ movie }) => {
  const { poster_url, thumb_url, name } = movie || {};

  const posterSrc = getImageSrc(poster_url || thumb_url);
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const favorited = isFavorite(movie.slug);

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
          <Card.Title className="title">
            {name}
          </Card.Title>
          <Button
            variant="link"
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(movie);
            }}
          >
            {favorited ? (
              <LucideIcon icon="BookmarkCheck" />
            ) : (
              <LucideIcon icon="Bookmark" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default memo(MovieCard);