import "./MovieDetailPage.css";
import { useParams } from "react-router-dom";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { useFavorites } from "@/features/favorites";
import Loading from "@/core/components/ui/Loading";
import SEO from "@/core/components/ui/SEO";
import {
  useMovieDetail,
  MovieDetailInfo,
  MovieDetailActions,
  MovieDescription,
} from "@/features/movies";
import { EpisodeSelector, useEpisodePlaylist } from "@/features/player";
import cleanDescription from "@/core/utils/text";
import { getImageSrc, handleImgError } from "@/core/utils/image";

const MovieDetailPage = () => {
  const { slug } = useParams();

  const { data, loading, error } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = data?.episodes || [];

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(movie.slug);

  // Gom toàn bộ logic server, playlist và chuyển tập vào useEpisodePlaylist
  const {
    selectedServer,
    setSelectedServer,
    serverData,
    firstEpisode,
    handleWatchMovie,
  } = useEpisodePlaylist({ episodesList, slug: movie?.slug || slug });

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-white text-center py-5">
        Lỗi: {error.message || "Không thể tải thông tin phim"}
      </div>
    );
  }

  const posterSrc = getImageSrc(movie?.poster_url || movie?.thumb_url);

  return (
    <>
      <SEO
        title={`${movie?.name || "Chi tiết phim"} - ${movie?.year || ""}`}
        description={cleanDescription(movie?.content)}
        image={posterSrc}
        url={`/chi-tiet/${movie?.slug}`}
      />

      <div>
        <Container fluid className="movie-detail-container py-4">
          {/* TOP SECTION: Poster & Thông tin chi tiết */}
          <Row className="g-4 mb-5">
            {/* Poster Phim (Cột trái) */}
            <Col xs={12} md={5} lg={4} xl={3}>
              <div className="movie-poster">
                <img
                  src={posterSrc}
                  alt={movie?.name}
                  onError={handleImgError}
                />

                {movie?.quality && (
                  <Badge className="movie-quality">{movie.quality}</Badge>
                )}
              </div>
            </Col>

            {/* Thông tin Phim (Cột phải) */}
            <Col className="movie-info">
              <div>
                <MovieDetailInfo movie={movie} />

                <MovieDetailActions
                  onWatch={() => handleWatchMovie(firstEpisode)}
                  isFavorited={favorited}
                  onToggleFavorite={() => toggleFavorite(movie)}
                  canWatch={Boolean(firstEpisode)}
                />
              </div>

              {/* Mô tả Nội dung phim */}
              <MovieDescription content={movie?.content} />
            </Col>
          </Row>

          {/* BOTTOM SECTION: Danh Sách Server & Tập Phim Hợp Nhất */}
          <EpisodeSelector
            pageType="detail"
            episodesList={episodesList}
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            serverData={serverData}
            handleWatchMovie={handleWatchMovie}
          />
        </Container>
      </div>
    </>
  );
};

export default MovieDetailPage;
