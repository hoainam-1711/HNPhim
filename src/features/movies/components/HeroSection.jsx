import "./HeroSection.css";
import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import noImg from "../../../assets/no-image.png";

// Ngưỡng khoảng cách tối thiểu (pixel) để kích hoạt cử chỉ vuốt
const SWIPE_THRESHOLD = 40;

const HeroSection = ({ movies = [], type }) => {
  // =========================================================
  // 1. STATE & HOOKS
  // =========================================================
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  // Tọa độ chạm để tính toán cử chỉ vuốt ngang (Touch swipe)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // =========================================================
  // 2. DATA EXTRACTION & FALLBACKS
  // =========================================================
  if (!movies || movies.length === 0) return null;

  const total = movies.length;
  const currentMovie = movies[selectedIndex] || movies[0];
  const favorited = isFavorite(currentMovie?.slug);

  /**
   * Chuẩn hóa URL ảnh đại diện / poster
   */
  const getImageSrc = (img) => {
    if (!img) return noImg;
    return img.startsWith("http") ? img : `https://phimimg.com/${img}`;
  };

  const backdropSrc = getImageSrc(
    currentMovie?.thumb_url || currentMovie?.poster_url,
  );

  // =========================================================
  // 3. EVENT HANDLERS (TOUCH & NAVIGATION)
  // =========================================================
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchEndX.current - touchStartX.current;
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX < 0) {
        // Vuốt sang trái -> Xem phim kế tiếp
        setSelectedIndex((prev) => (prev + 1) % total);
      } else {
        // Vuốt sang phải -> Quay lại phim trước
        setSelectedIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

  // Điều hướng đến trang chi tiết
  const goToDetail = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      navigate(`/chi-tiet/${currentMovie.slug}`);
    }
  };

  // Điều hướng đến trang xem tập phim hiện tại
  const goToWatchEpisodeCurrent = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      navigate(`/xem/${currentMovie.slug}/${currentMovie?.episode_current}`);
    }
  };

  // Xử lý fallback ảnh khi link hỏng (404/error)
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = noImg;
  };

  // =========================================================
  // 4. RENDER
  // =========================================================
  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 4.1 Khung ảnh nền (Backdrop) */}
      <div
        className="hero-backdrop-wrapper cursor-pointer"
        onClick={goToDetail}
      >
        <img
          src={backdropSrc}
          alt={currentMovie?.name}
          className="hero-backdrop-img"
          onError={handleImgError}
        />
        <div className="hero-backdrop-gradient" />
      </div>

      {/* 4.2 Khung nội dung chính */}
      <div className="hero-main-container">
        {/* Thông tin chi tiết phim */}
        <div className="hero-info">
          <h1 className="hero-title" title={currentMovie?.name}>
            {currentMovie?.name}
          </h1>

          {currentMovie?.origin_name && (
            <div className="hero-origin-name" title={currentMovie.origin_name}>
              {currentMovie.origin_name}
            </div>
          )}

          {/* Huy hiệu thông số (Badges) */}
          <div className="hero-badges">
            <span className="hero-badge-item hero-badge-quality">
              <strong>{currentMovie?.quality || "FHD"}</strong>
            </span>

            {currentMovie?.year && (
              <span className="hero-badge-item">{currentMovie.year}</span>
            )}

            {currentMovie?.time && (
              <span className="hero-badge-item">{currentMovie.time}</span>
            )}

            {currentMovie?.episode_current && (
              <span className="hero-badge-item truncate-text">
                {currentMovie.episode_current}
              </span>
            )}
          </div>

          {/* Danh sách thể loại (Tối đa 4 mục) */}
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

          {/* Các nút hành động */}
          <div className="hero-actions">
            {/* Nút Xem ngay */}
            <button
              type="button"
              className="hero-btn-play"
              title="Xem ngay"
              aria-label="Xem ngay"
              onClick={goToWatchEpisodeCurrent}
            >
              <LucideIcon icon="Play" />
            </button>

            {/* Cụm nút phụ: Chi tiết & Lưu yêu thích */}
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

        {/* 4.3 Khối thumbnail và nút Xem thêm */}
        <div className="hero-thumb-wrapper">
          <div className="hero-thumb-list">
            {movies.slice(0, 6).map((m, idx) => (
              <div
                key={m._id || m.slug || idx}
                className={`hero-thumb-item ${
                  selectedIndex === idx ? "active" : ""
                }`}
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
                  onError={handleImgError}
                />
              </div>
            ))}
          </div>

          <Button
            as={Link}
            to={`/loai/${type}`}
            variant="link"
            className="see-more-btn text-decoration-none text-secondary d-flex align-items-center gap-1 p-0"
          >
            <span>Xem thêm</span>
            <LucideIcon icon="ChevronRight" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
