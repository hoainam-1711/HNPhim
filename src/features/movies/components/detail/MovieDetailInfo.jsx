import { Link } from "react-router-dom";
import { Badge, Button, Col, Row } from "react-bootstrap";
import LucideIcon from "../../../../components/ui/LucideIcon";
import { getImageSrc, handleImgError } from "../../../../utils/formatImage";

/**
 * Hiển thị Poster và Metadata chi tiết của phim (Thể loại, quốc gia, diễn viên, đạo diễn, ratings)
 */
const MovieDetailInfo = ({ movie }) => {
  const posterSrc = getImageSrc(movie?.poster_url || movie?.thumb_url);

  return (
    <Row className="g-4 mb-4">
      {/* Cột trái: Poster Phim */}
      <Col xs={12} md={5} lg={4} xl={3}>
        <div className="movie-poster">
          <img src={posterSrc} alt={movie?.name} onError={handleImgError} />
          {movie?.quality && (
            <Badge className="movie-quality">{movie.quality}</Badge>
          )}
        </div>
      </Col>

      {/* Cột phải: Thông tin Phim */}
      <Col className="movie-info">
        <h1 className="movie-title">{movie?.name}</h1>

        {movie?.origin_name && (
          <div className="movie-origin-name mb-3">
            {movie.origin_name} {movie.year ? `(${movie.year})` : ""}
          </div>
        )}

        {/* Tags Metadata */}
        <div className="movie-metadata">
          <Badge className="movie-meta-badge">
            <LucideIcon icon="Clock" />
            {movie?.time || "N/A"}
          </Badge>

          <Badge className="movie-meta-badge">
            <LucideIcon icon="Volume2" />
            {movie?.lang || "Thuyết minh"}
          </Badge>

          <Badge className="movie-meta-badge">
            <LucideIcon icon="ClapperBoard" />
            {movie?.episode_current || "Full"}
          </Badge>

          {movie?.imdb?.vote_count !== 0 && movie?.imdb?.vote_count && (
            <Badge className="movie-meta-badge movie-rating">
              <LucideIcon icon="Star" />
              IMDB: {movie.imdb.vote_average} ({movie.imdb.vote_count} lượt)
            </Badge>
          )}

          {movie?.tmdb?.vote_count !== 0 && movie?.tmdb?.vote_count && (
            <Badge className="movie-meta-badge movie-rating">
              <LucideIcon icon="Star" />
              TMDB: {movie.tmdb.vote_average} ({movie.tmdb.vote_count} lượt)
            </Badge>
          )}
        </div>

        {/* Thể loại */}
        <div className="movie-detail-row">
          <span className="movie-detail-label">Thể loại:</span>{" "}
          {movie?.category?.map((cat) => (
            <Badge key={cat.id || cat._id} className="movie-category">
              <Button
                variant="link"
                as={Link}
                to={`/the-loai/${cat.slug}`}
                className="text-decoration-none p-0 border-0 align-baseline fw-semibold"
                style={{
                  fontSize: "0.8rem",
                  lineHeight: "inherit",
                  color: "#e5e5e5",
                }}
              >
                {cat.name}
              </Button>
            </Badge>
          ))}
        </div>

        {/* Quốc gia */}
        <div className="movie-detail-row">
          <span className="movie-detail-label">Quốc gia:</span>{" "}
          {movie?.country?.map((c) => (
            <Badge key={c.id || c._id} className="movie-category">
              <Button
                variant="link"
                as={Link}
                to={`/quoc-gia/${c.slug}`}
                className="text-decoration-none p-0 border-0 align-baseline fw-semibold"
                style={{
                  fontSize: "0.8rem",
                  lineHeight: "inherit",
                  color: "#e5e5e5",
                }}
              >
                {c.name}
              </Button>
            </Badge>
          ))}
        </div>

        {/* Đạo diễn */}
        <div className="movie-detail-row">
          <span className="movie-detail-label">Đạo diễn:</span>{" "}
          <span>
            {Array.isArray(movie?.director) && movie.director.length > 0
              ? movie.director.join(", ")
              : typeof movie?.director === "string" &&
                  movie.director.trim() !== ""
                ? movie.director
                : "Đang cập nhật"}
          </span>
        </div>

        {/* Diễn viên */}
        <div className="movie-detail-row">
          <span className="movie-detail-label">Diễn viên:</span>{" "}
          <span>
            {Array.isArray(movie?.actor) && movie.actor.length > 0
              ? movie.actor.slice(0, 8).join(", ")
              : typeof movie?.actor === "string" && movie.actor.trim() !== ""
                ? movie.actor
                : "Đang cập nhật"}
          </span>
        </div>
      </Col>
    </Row>
  );
};

export default MovieDetailInfo;
