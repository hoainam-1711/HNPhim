import "./HeroSection.css";
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import noImg from "../../../assets/no-image.webp";

// Ngưỡng vuốt tối thiểu (px) để chuyển slide
const SWIPE_THRESHOLD = 40;

// Base URL cho ảnh từ server CDN
const IMAGE_CDN_BASE = "https://phimimg.com/";

// Giới hạn số lượng hiển thị trên UI
const MAX_CATEGORIES = 4;
const MAX_THUMBNAILS = 6;

// -----------------------------------------------------------------------------
// HÀM TIỆN ÍCH NGOÀI COMPONENT (Tránh khởi tạo lại mỗi lần re-render)
// -----------------------------------------------------------------------------

/**
 * Xử lý URL ảnh: Trả về ảnh mặc định nếu rỗng, thêm host nếu thiếu http
 */
const getImageSrc = (img) => {
  if (!img) return noImg;
  return img.startsWith("http") ? img : `${IMAGE_CDN_BASE}${img}`;
};

/**
 * Chuẩn hóa tên tập phim thành slug URL (vd: "Tập 01" -> "tap-01")
 */
const normalizeEpisodeCurrent = (ep) => {
  if (!ep) return "tap-1";

  return ep
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng gạch nối
};

// -----------------------------------------------------------------------------
// COMPONENT CHÍNH
// -----------------------------------------------------------------------------

const HeroSection = ({ movies = [] }) => {
  // 1. Hooks & States
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const navigate = useNavigate();

  // Tọa độ chạm để tính toán cử chỉ vuốt
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 2. Kiểm tra dữ liệu đầu vào
  if (!movies || movies.length === 0) return null;

  const total = movies.length;
  const currentMovie = movies[selectedIndex] || movies[0];
  const favorited = isFavorite(currentMovie?.slug);

  // Chuẩn bị URL ảnh cho banner và poster
  const backdropSrc = getImageSrc(
    currentMovie?.thumb_url || currentMovie?.poster_url
  );
  const posterSrc = getImageSrc(
    currentMovie?.poster_url || currentMovie?.thumb_url
  );

  // 3. Xử lý cử chỉ vuốt (Touch Swipe)
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
        // Vuốt sang trái -> Xem phim tiếp theo
        setSelectedIndex((prev) => (prev + 1) % total);
      } else {
        // Vuốt sang phải -> Quay lại phim trước
        setSelectedIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

  // 4. Xử lý điều hướng & Sự kiện click
  const goToDetail = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      navigate(`/chi-tiet/${currentMovie.slug}`);
    }
  };

  const goToWatchEpisodeCurrent = (e) => {
    e.stopPropagation();
    if (currentMovie?.slug) {
      const epSlug = normalizeEpisodeCurrent(currentMovie?.last_episodes?.[0]?.name);
      navigate(`/xem/${currentMovie.slug}/${epSlug}`);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(currentMovie);
  };

  const handleSelectThumbnail = (index, e) => {
    e.stopPropagation();
    setSelectedIndex(index);
  };

  // Ảnh lỗi thì thay thế bằng ảnh mặc định
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = noImg;
  };

  // 5. Giao diện (Render)
  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 5.1 Banner nền làm mờ */}
      <div className="hero-backdrop-wrapper cursor-pointer" onClick={goToDetail}>
        <img
          src={backdropSrc}
          alt={currentMovie?.name}
          className="hero-backdrop-img"
          onError={handleImgError}
        />
      </div>

      {/* 5.2 Khung nội dung chính */}
      <div className="hero-main-container">
        {/* Poster phim */}
        <div className="hero-poster-wrapper">
          <img
            src={posterSrc}
            alt={currentMovie?.name}
            className="hero-poster-img"
            onError={handleImgError}
          />
        </div>

        {/* Thông tin & Danh sách thumbnails */}
        <div className="hero-detail">
          {/* Cột thông tin chi tiết */}
          <div className="hero-info">
            <h1 className="hero-title" title={currentMovie?.name}>
              {currentMovie?.name}
            </h1>

            {currentMovie?.origin_name && (
              <div className="hero-origin-name" title={currentMovie.origin_name}>
                {currentMovie.origin_name}
              </div>
            )}

            {/* Các nhãn thông số (Chất lượng, năm, thời lượng, số tập) */}
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

            {/* Thể loại phim */}
            {currentMovie?.category && currentMovie.category.length > 0 && (
              <div className="hero-categories">
                {currentMovie.category.slice(0, MAX_CATEGORIES).map((cat) => (
                  <span
                    key={cat.id || cat.slug || cat.name}
                    className="hero-category-tag truncate-text"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Các nút tương tác */}
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

              {/* Nút Chi tiết & Lưu yêu thích */}
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

          {/* Cột danh sách thumbnail chọn phim */}
          <div className="hero-thumb-list">
            {movies.slice(0, MAX_THUMBNAILS).map((m, idx) => (
              <div
                key={m._id || m.slug || idx}
                className={`hero-thumb-item ${
                  selectedIndex === idx ? "active" : ""
                }`}
                onClick={(e) => handleSelectThumbnail(idx, e)}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;