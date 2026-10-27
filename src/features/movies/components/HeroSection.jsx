import "./HeroSection.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import { getImageSrc, handleImgError } from "../../../utils/formatImage";

// Khoảng cách tối thiểu để xác định người dùng đang swipe
const SWIPE_THRESHOLD = 50;

// Thời gian tự động chuyển slide
const AUTO_SLIDE_INTERVAL = 5000;

// Chặn click thumbnail liên tục quá nhanh
const CLICK_DEBOUNCE_TIME = 150;

const HeroSection = ({ movies = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  // Lưu vị trí bắt đầu/kết thúc của thao tác swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Lưu thời điểm click thumbnail gần nhất
  const lastClickTime = useRef(0);

  const total = movies.length;

  // Lấy phim hiện tại.
  // Fallback về phim đầu tiên để tránh lỗi nếu index không còn hợp lệ.
  const currentMovie = movies[selectedIndex] || movies[0];
  const favorited = isFavorite(currentMovie?.slug);

  const backdropSrc = getImageSrc(
    currentMovie?.thumb_url || currentMovie?.poster_url,
  );
  const posterSrc = getImageSrc(
    currentMovie?.poster_url || currentMovie?.thumb_url,
  );

  /**
   * Dùng functional update để luôn lấy state mới nhất,
   * tránh phụ thuộc trực tiếp vào selectedIndex.
   */
  const nextSlide = () => {
    if (total <= 1) return;
    setSelectedIndex((prevIndex) => (prevIndex + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setSelectedIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  /**
   * Khi danh sách movies thay đổi và selectedIndex
   * không còn hợp lệ, đưa index về slide cuối hợp lệ.
   */
  useEffect(() => {
    if (total === 0) {
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex((prevIndex) => Math.min(prevIndex, total - 1));
  }, [total]);

  // AUTO SLIDE
  useEffect(() => {
    if (total <= 1) return;
    const intervalId = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % total);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [total]);

  //Bắt đầu thao tác swipe.
  const handleTouchStart = (event) => {
    const touchX = event.touches[0]?.clientX ?? 0;
    touchStartX.current = touchX;
    touchEndX.current = touchX;
  };

  // Cập nhật vị trí ngón tay khi đang swipe.
  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0]?.clientX ?? touchEndX.current;
  };

  //Xác định hướng swipe khi người dùng thả tay.

  const handleTouchEnd = () => {
    const diffX = touchEndX.current - touchStartX.current;

    // Chưa đủ khoảng cách để xem là swipe
    if (Math.abs(diffX) <= SWIPE_THRESHOLD) return;

    if (diffX < 0) {
      // Vuốt sang trái -> phim tiếp theo
      nextSlide();
    } else {
      // Vuốt sang phải -> phim trước
      prevSlide();
    }

    // Reset tọa độ sau khi xử lý
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Xử lý trường hợp touch bị hủy.
  const handleTouchCancel = () => {
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Đi tới trang chi tiết phim.
  const goToDetail = (event) => {
    event.stopPropagation();
    if (!currentMovie?.slug) return;
    navigate(`/chi-tiet/${currentMovie.slug}`);
  };

  // Xem tập đầu tiên của phim.
  const goToWatchEpisodeCurrent = (event) => {
    event.stopPropagation();
    if (!currentMovie?.slug) return;
    navigate(`/xem/${currentMovie.slug}/tap-01`);
  };

  // Thêm/xóa phim hiện tại khỏi danh sách yêu thích.
  const handleToggleFavorite = (event) => {
    event.stopPropagation();
    if (!currentMovie) return;
    toggleFavorite(currentMovie);
  };

  /**
   * Có debounce nhẹ để tránh việc click quá nhanh
   * gây ra nhiều lần setState liên tiếp.
   */
  const handleSelectThumb = (index) => {
    const now = Date.now();
    if (
      index === selectedIndex ||
      now - lastClickTime.current < CLICK_DEBOUNCE_TIME
    ) {
      return;
    }

    lastClickTime.current = now;
    setSelectedIndex(index);
  };

  // Không render Hero nếu không có phim.
  if (total === 0) return null;

  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div
        className="hero-backdrop-wrapper cursor-pointer"
        onClick={goToDetail}
      >
        <img
          src={backdropSrc}
          alt={currentMovie?.name || "Movie backdrop"}
          className="hero-backdrop-img"
          decoding="async"
          onError={handleImgError}
          draggable="false"
        />
      </div>

      <div className="hero-main-container">
        <div className="hero-poster-wrapper">
          <img
            src={posterSrc}
            alt={currentMovie?.name || "Movie poster"}
            className="hero-poster-img"
            decoding="async"
            onError={handleImgError}
            draggable="false"
          />
        </div>

        <div className="hero-detail">
          <div className="hero-info">
            {/* title */}
            <h1 className="hero-title" title={currentMovie?.name}>
              {currentMovie?.name}
            </h1>

            {/*  origin_name  */}
            {currentMovie?.origin_name && (
              <div
                className="hero-origin-name"
                title={currentMovie.origin_name}
              >
                {currentMovie.origin_name}
              </div>
            )}

            {/*  BADGES  */}
            <div className="hero-badges">
              {/* Quality */}
              <span className="hero-badge-item hero-badge-quality">
                <strong>{currentMovie?.quality || "FHD"}</strong>
              </span>

              {/* Year */}
              {currentMovie?.year && (
                <span className="hero-badge-item">{currentMovie.year}</span>
              )}

              {/* Duration */}
              {currentMovie?.time && (
                <span className="hero-badge-item">{currentMovie.time}</span>
              )}

              {/* Current episode */}
              {currentMovie?.episode_current && (
                <span className="hero-badge-item truncate-text">
                  {currentMovie.episode_current}
                </span>
              )}
            </div>

            {/*  CATEGORIES  */}
            {currentMovie?.category?.length > 0 && (
              <div className="hero-categories">
                {currentMovie.category.map((category) => (
                  <span
                    key={category.id || category.slug || category.name}
                    className="hero-category-tag"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/*  ACTIONS  */}
            <div className="hero-actions">
              {/* Watch */}
              <button
                type="button"
                className="hero-btn-play"
                title="Xem ngay"
                aria-label="Xem ngay"
                onClick={goToWatchEpisodeCurrent}
              >
                <LucideIcon icon="Play" />
              </button>

              {/* Secondary actions */}
              <div className="hero-action-pill">
                {/* Detail */}
                <button
                  type="button"
                  className="hero-icon-btn"
                  title="Chi tiết phim"
                  aria-label="Chi tiết phim"
                  onClick={goToDetail}
                >
                  <LucideIcon icon="Info" />
                </button>

                {/* Favorite */}
                <button
                  type="button"
                  className="hero-icon-btn"
                  title={favorited ? "Xóa khỏi danh sách" : "Lưu vào danh sách"}
                  aria-label={
                    favorited ? "Xóa khỏi danh sách" : "Lưu vào danh sách"
                  }
                  aria-pressed={favorited}
                  onClick={handleToggleFavorite}
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
                    handleSelectThumb(index);
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
