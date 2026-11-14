import "./MovieDetailPage.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useFavorites } from "../context/MovieContext";
import Loading from "../components/ui/Loading";
import SEO from "../components/ui/SEO";
import useMovieDetail from "../features/movies/hooks/useMovieDetail";
import cleanDescription from "../utils/cleanDescription";
import { getImageSrc } from "../utils/formatImage";

import MovieDetailInfo from "../features/movies/components/detail/MovieDetailInfo";
import MovieDetailActions from "../features/movies/components/detail/MovieDetailActions";
import MovieDescription from "../features/movies/components/detail/MovieDescription";
import MovieServerEpisodes from "../features/movies/components/detail/MovieServerEpisodes";

const MovieDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = data?.episodes || [];

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(movie.slug);

  const [selectedServer, setSelectedServer] = useState(0);

  // Reset server khi đổi slug phim
  useEffect(() => {
    setSelectedServer(0);
  }, [slug]);

  const currentServer = episodesList[selectedServer] || episodesList[0];
  const serverData = currentServer?.server_data || [];
  const firstEpisode = serverData[0];

  const handleWatchMovie = useCallback(
    (ep) => {
      const targetEp = ep || firstEpisode;
      if (targetEp) {
        const epSlug = targetEp.slug || targetEp.name;
        navigate(`/xem/${movie.slug}/${epSlug}`);
      } else {
        console.warn("Chưa có thông tin tập phim để xem!");
      }
    },
    [firstEpisode, movie?.slug, navigate],
  );

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

      <div className="movie-detail-page">
        <Container fluid className="movie-detail-container py-4">
          {/* Thông tin metadata + Poster */}
          <MovieDetailInfo movie={movie} />

          {/* Cụm nút Thao tác & Mô tả nội dung */}
          <div className="ps-md-3">
            <MovieDetailActions
              onWatch={() => handleWatchMovie(firstEpisode)}
              isFavorited={favorited}
              onToggleFavorite={() => toggleFavorite(movie)}
              canWatch={Boolean(firstEpisode)}
            />

            <MovieDescription content={movie?.content} />
          </div>

          {/* Cụm Server và Danh sách tập */}
          <MovieServerEpisodes
            episodesList={episodesList}
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            serverData={serverData}
            onWatchEpisode={handleWatchMovie}
          />
        </Container>
      </div>
    </>
  );
};

export default MovieDetailPage;
