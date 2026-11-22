import { memo } from "react";
import { getImageSrc, handleImgError } from "@/core/utils/image";

/**
 * HeroThumbnailList: Danh sách thumbnail cuộn phía dưới của Hero Banner
 */
export const HeroThumbnailList = memo(function HeroThumbnailList({
  movies = [],
  selectedIndex = 0,
  onSelectThumb,
}) {
  if (!movies.length) return null;

  return (
    <div className="hero-thumb-list">
      {movies.map((movie, index) => {
        const isActive = selectedIndex === index;

        return (
          <div
            key={movie._id || movie.slug || index}
            className={`hero-thumb-item ${isActive ? "active" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={`Chọn phim ${movie.name}`}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => {
              event.stopPropagation();
              onSelectThumb(index);
            }}
            title={movie.name}
          >
            <img
              src={getImageSrc(movie.thumb_url || movie.poster_url)}
              alt={movie.name || "Movie thumbnail"}
              className="hero-thumb-img"
              loading="lazy"
              decoding="async"
              onError={handleImgError}
              draggable="false"
            />
          </div>
        );
      })}
    </div>
  );
});

export default HeroThumbnailList;
