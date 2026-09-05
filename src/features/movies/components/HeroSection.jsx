import "./HeroSection.css";
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import noImg from "../../../assets/no-image.png";

const HeroSection = ({ movies = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!movies || movies.length === 0) return null;

  const total = movies.length;
  const currentMovie = movies[selectedIndex] || movies[0];

  const favorited = isFavorite(currentMovie?.slug);

  const getImageSrc = (img) => {
    if (!img) return noImg;
    return img.startsWith("http") ? img : `https://phimimg.com/${img}`;
  };

  const backdropSrc = getImageSrc(
    currentMovie?.thumb_url || currentMovie?.poster_url,
  );

  // Xử lý cử chỉ vuốt (Swipe)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchEndX.current - touchStartX.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        setSelectedIndex((prev) => (prev + 1) % total); // Vuốt sang trái -> xem phim tiếp theo
      } else {
        setSelectedIndex((prev) => (prev - 1 + total) % total); // Vuốt sang phải -> xem phim trước đó
      }
    }
  };

  const goToDetail = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      navigate(`/chi-tiet/${currentMovie.slug}`);
    }
  };

  const goToWatchEpisodeCurrent = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      navigate(`/xem/${currentMovie.slug}/${currentMovie?.episode_current}`);
    }
  };

  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Click vào khung ảnh sẽ vào chi tiết */}
      <div
        className="hero-backdrop-wrapper cursor-pointer"
        onClick={goToDetail}
      >
        <img
          src={backdropSrc}
          alt={currentMovie?.name}
          className="hero-backdrop-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = noImg;
          }}
        />
        <div className="hero-backdrop-gradient"></div>
      </div>

      {/* Khung nội dung */}
      <div className="hero-main-container">
        <div className="hero-info">
          <h1 className="hero-title" title={currentMovie?.name}>
            {currentMovie?.name}
          </h1>

          {currentMovie?.origin_name && (
            <div className="hero-origin-name" title={currentMovie.origin_name}>
              {currentMovie.origin_name}
            </div>
          )}

          {/* Badges */}
          <div className="hero-badges">
            <span className="hero-badge-item hero-badge-quality">
              <strong>{currentMovie?.quality || "FHD"}</strong>
            </span>

            {currentMovie?.year && (
              <span className="hero-badge-item">{currentMovie.year}</span>
            )}

            <span className="hero-badge-item">{currentMovie?.time}</span>

            {currentMovie?.episode_current && (
              <span className="hero-badge-item truncate-text">
                {currentMovie.episode_current}
              </span>
            )}
          </div>

          {/* Categories */}
          {currentMovie?.category && currentMovie.category.length > 0 && (
            <div className="hero-categories">
              {currentMovie.category.slice(0, 4).map((cat) => (
                <span
                  key={cat.id || cat.slug || cat.name}
                  className="hero-category-tag truncate-text"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Nút hành động */}
          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn-play"
              title="Xem ngay"
              aria-label="Xem ngay"
              onClick={goToWatchEpisodeCurrent}
            >
              <LucideIcon icon="Play" />
            </button>

            <div className="hero-action-pill">
              <button
                type="button"
                className="hero-icon-btn"
                title="Chi tiết phim"
                onClick={goToDetail}
              >
                <LucideIcon icon="Info" />
              </button>

              <button
                type="button"
                className="hero-icon-btn"
                title="Lưu vào danh sách"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(currentMovie);
                }}
              >
                {favorited ? (
                  <LucideIcon icon="BookmarkCheck" color="#f3ca3e" />
                ) : (
                  <LucideIcon icon="Bookmark" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách thumbnail */}
        <div className="hero-thumb-list">
          {movies.slice(0, 6).map((m, idx) => (
            <div
              key={m._id || m.slug || idx}
              className={`hero-thumb-item ${selectedIndex === idx ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
              }}
              title={m.name}
            >
              <img
                src={getImageSrc(m.thumb_url || m.poster_url)}
                alt={m.name}
                className="hero-thumb-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noImg;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
