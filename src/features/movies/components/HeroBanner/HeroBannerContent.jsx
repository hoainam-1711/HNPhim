import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteButton } from "@/features/favorites";
import { getImageSrc, handleImgError } from "@/core/utils/image";
import { Info, Play } from "lucide-react";

/**
 * HeroBannerContent: Hiển thị backdrop, poster, thông tin tiêu đề, badges, thể loại và các nút tương tác chính
 */
export const HeroBannerContent = memo(function HeroBannerContent({
  movie,
  children,
}) {
  const navigate = useNavigate();

  if (!movie) return null;

  const backdropSrc = getImageSrc(movie?.thumb_url || movie?.poster_url);
  const posterSrc = getImageSrc(movie?.poster_url || movie?.thumb_url);

  const goToDetail = (event) => {
    event.stopPropagation();
    if (movie?.slug) {
      navigate(`/chi-tiet/${movie.slug}`);
    }
  };

  const goToWatchEpisodeCurrent = (event) => {
    event.stopPropagation();
    if (movie?.slug) {
      navigate(`/xem/${movie.slug}/tap-01`);
    }
  };

  return (
    <>
      {/* Backdrop nền lớn */}
      <div
        className="hero-backdrop-wrapper cursor-pointer"
        onClick={goToDetail}
      >
        <img
          src={backdropSrc}
          alt={movie?.name || "Movie backdrop"}
          className="hero-backdrop-img"
          decoding="async"
          onError={handleImgError}
          draggable="false"
        />
      </div>

      {/* Poster dọc và thông tin chi tiết */}
      <div className="hero-main-container">
        <div className="hero-poster-wrapper">
          <img
            src={posterSrc}
            alt={movie?.name || "Movie poster"}
            className="hero-poster-img"
            decoding="async"
            onError={handleImgError}
            draggable="false"
          />
        </div>

        <div className="hero-detail">
          <div className="hero-info">
            <h1 className="hero-title" title={movie?.name}>
              {movie?.name}
            </h1>

            {movie?.origin_name && (
              <div className="hero-origin-name" title={movie.origin_name}>
                {movie.origin_name}
              </div>
            )}

            {/* Badges */}
            <div className="hero-badges">
              <span className="hero-badge-item hero-badge-quality">
                <strong>{movie?.quality || "FHD"}</strong>
              </span>

              {movie?.year && (
                <span className="hero-badge-item">{movie.year}</span>
              )}

              {movie?.time && (
                <span className="hero-badge-item">{movie.time}</span>
              )}

              {movie?.episode_current && (
                <span className="hero-badge-item truncate-text">
                  {movie.episode_current}
                </span>
              )}
            </div>

            {/* Categories */}
            {movie?.category?.length > 0 && (
              <div className="hero-categories">
                {movie.category.map((category) => (
                  <span
                    key={category.id || category.slug || category.name}
                    className="hero-category-tag"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="hero-actions">
              <button
                type="button"
                className="hero-btn-play"
                title="Xem ngay"
                aria-label="Xem ngay"
                onClick={goToWatchEpisodeCurrent}
              >
                <Play/>
              </button>

              <div className="hero-action-pill">
                <button
                  type="button"
                  className="hero-icon-btn"
                  title="Chi tiết phim"
                  aria-label="Chi tiết phim"
                  onClick={goToDetail}
                >
                  <Info />
                </button>

                <FavoriteButton
                  movie={movie}
                  className="hero-icon-btn p-0 border-0"
                />
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
});

export default HeroBannerContent;
