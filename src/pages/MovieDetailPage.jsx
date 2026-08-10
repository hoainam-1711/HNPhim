import "./MovieDetailPage.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import noImg from "../assets/no-image.png";
import { MovieContext } from "../context/MovieContext";
import Loading from "../components/ui/Loading";
import EpisodeSelector from "../features/player/components/EpisodeSelector";
import LucideIcon from "../components/ui/LucideIcon";
import useMovieDetail from "../features/movies/hooks/useMovieDetail";

const MovieDetailPage = () => {
  const { slug } = useParams();

  const { data, loading } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = data?.episodes || [];

  const navigate = useNavigate();

  // Lấy hàm toggleFavorite và isFavorite từ Context
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const favorited = isFavorite(movie.slug);

  // State chọn Server (Vietsub / Lồng Tiếng)
  const [selectedServer, setSelectedServer] = useState(0);

  // Reset server về 0 khi chuyển sang phim khác
  useEffect(() => {
    setSelectedServer(0);
  }, [slug]);

  // Lấy thông tin server hiện tại an toàn
  const currentServer = episodesList[selectedServer] || episodesList[0];
  const serverData = currentServer?.server_data || [];
  const firstEpisode = serverData[0];

  // Hàm chuyển sang trang xem phim
  const handleWatchMovie = (ep) => {
    const targetEp = ep || firstEpisode;

    if (targetEp) {
      const epSlug = targetEp.slug || targetEp.name;

      // URL sinh ra sẽ là: /xem/dao-hai-tac/tap-1
      navigate(`/xem/${movie.slug}/${epSlug}`);
    } else {
      console.warn("Chưa có thông tin tập phim để xem!");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="movie-detail-page">
      <Container className="movie-detail-container py-4">
        {/* TOP SECTION: Poster & Thông tin chi tiết */}
        <Row className="g-4 mb-5">
          {/* Poster Phim */}
          <Col xs={12} md={4} lg={3}>
            <div className="movie-poster">
              <img
                src={movie?.poster_url || movie?.thumb_url}
                alt={movie?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noImg;
                }}
              />

              {movie?.quality && (
                <Badge className="movie-quality">{movie.quality}</Badge>
              )}
            </div>
          </Col>

          {/* Thông tin Phim */}
          <Col xs={12} md={8} lg={9} className="movie-info">
            <div>
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

                {movie?.imdb?.vote_count != 0 && (
                  <Badge className="movie-meta-badge movie-rating">
                    <LucideIcon icon="Star" />
                    IMDB: {movie.imdb.vote_average} ({movie.imdb.vote_count}{" "}
                    lượt)
                  </Badge>
                )}

                {movie?.tmdb?.vote_count != 0 && (
                  <Badge className="movie-meta-badge movie-rating">
                    <LucideIcon icon="Star" />
                    TMDB: {movie.tmdb.vote_average} ({movie.tmdb.vote_count}{" "}
                    lượt)
                  </Badge>
                )}
              </div>

              {/* Thể loại, Quốc gia, Đạo diễn, Diễn viên */}
              <div className="movie-detail-row">
                <span className="movie-detail-label">Thể loại:</span>{" "}
                {movie?.category?.map((cat) => (
                  <Badge key={cat.id || cat._id} className="movie-category">
                    {cat.name}
                  </Badge>
                ))}
              </div>

              <div className="movie-detail-row">
                <span className="movie-detail-label">Quốc gia:</span>{" "}
                {movie?.country?.map((c) => (
                  <span key={c.id || c._id} className="movie-country">
                    {c.name}
                  </span>
                ))}
              </div>

              <div className="movie-detail-row">
                <span className="movie-detail-label">Đạo diễn:</span>{" "}
                {/* Đạo diễn */}
                <span>
                  {Array.isArray(movie?.director) && movie.director.length > 0
                    ? movie.director.join(", ")
                    : typeof movie?.director === "string" &&
                        movie.director.trim() !== ""
                      ? movie.director
                      : "Đang cập nhật"}
                </span>
              </div>

              <div className="movie-detail-row">
                <span className="movie-detail-label">Diễn viên:</span>{" "}
                {/* Diễn viên */}
                <span>
                  {Array.isArray(movie?.actor) && movie.actor.length > 0
                    ? movie.actor.slice(0, 8).join(", ")
                    : typeof movie?.actor === "string" &&
                        movie.actor.trim() !== ""
                      ? movie.actor
                      : "Đang cập nhật"}
                </span>
              </div>

              <div className="movie-actions">
                <Button
                  className="movie-watch-btn"
                  onClick={() => handleWatchMovie(firstEpisode)}
                  disabled={!firstEpisode}
                >
                  <LucideIcon icon="Play" /> Xem Phim
                </Button>

                <Button
                  variant="link"
                  className="movie-favorite-btn"
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

                  <span>Lưu</span>
                </Button>
              </div>
            </div>

            {/* Mô tả Nội dung phim */}
            <div className="movie-description">
              <h5 className="movie-description-title">Nội dung phim</h5>

              <div
                className="movie-description-text"
                dangerouslySetInnerHTML={{
                  __html: movie?.content || "Chưa có mô tả cho phim này.",
                }}
              />
            </div>
          </Col>
        </Row>

        {/* BOTTOM SECTION: Danh Sách Server & Tập Phim Chia Nhóm */}
        {episodesList && episodesList.length > 0 && (
          <Row className="mt-4">
            <Col xs={12}>
              <Card className="episode-card text-white">
                <Card.Header className="episode-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h5 className="episode-title">Danh sách tập / Server</h5>

                  {episodesList?.length > 1 && (
                    <div className="server-buttons">
                      {episodesList.map((server, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={
                            selectedServer === idx
                              ? "danger"
                              : "outline-secondary"
                          }
                          className={`server-btn ${
                            selectedServer === idx ? "active" : ""
                          }`}
                          onClick={() => setSelectedServer(idx)}
                        >
                          {server.server_name || `Server ${idx + 1}`}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card.Header>
                <Card.Body>
                  {/* Gọi Component EpisodeSelector tại đây */}
                  <EpisodeSelector
                    pageType="detail"
                    serverData={serverData}
                    handleWatchMovie={handleWatchMovie}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Từ khóa Phim */}
        {movie?.keywords && movie.keywords.length > 0 && (
          <Row className="mt-4">
            <Col xs={12}>
              <div className="movie-keywords">
                <small className="text-secondary me-2">Từ khóa:</small>
                {movie.keywords.map((kw, i) => (
                  <Badge
                    key={i}
                    bg="dark"
                    text="secondary"
                    className="movie-keyword fw-normal border border-secondary"
                  >
                    #{kw}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MovieDetailPage;
