import { memo, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { MovieContext } from "../../../context/MovieContext";
import LucideIcon from "../../../components/ui/LucideIcon";
import noImg from "../../../assets/no-image.png";

const MovieCard = ({ movie }) => {
  const { poster_url, thumb_url, name } = movie || {};

  // Ưu tiên poster_url, nếu không có thì lấy thumb_url
  const imgSrc = poster_url || thumb_url;

  // Lấy hàm toggleFavorite và isFavorite từ Context
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const favorited = isFavorite(movie.slug);

  return (
    <Card
      className="h-100 border-0 bg-secondary bg-opacity-10 text-white overflow-hidden shadow"
      style={{ transition: "transform 0.3s ease", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Dùng wrapper với tỉ lệ khung hình 2:3 (Aspect Ratio chuẩn cho poster phim) */}
      <div
        className="position-relative w-100"
        style={{ aspectRatio: "2 / 3", overflow: "hidden" }}
      >
        <Card.Img
          variant="top"
          src={
            imgSrc?.startsWith("http")
              ? imgSrc
              : `https://phimimg.com/${imgSrc}`
          }
          alt={name}
          loading="lazy" // Tải ảnh khi lướt tới
          onError={(e) => {
            e.target.onerror = null; // Chống lặp vô hạn nếu ảnh fallback cũng lỗi
            e.target.src = noImg; // Thay bằng link ảnh mặc định của bạn
          }}
          style={{ height: "100%", objectFit: "cover" }}
        />
        {/* Layer phủ đen mờ ở đáy ảnh giúp làm nổi bật tên phim */}
        <div
          className="position-absolute bottom-0 w-100 p-2 text-center d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          }}
        >
          <Card.Title className="fs-6 fw-bold mb-0 text-truncate text-white">
            {name}
          </Card.Title>
          {/* Nút lưu phim yêu thích */}
          <Button
            variant="link"
            className="p-0 text-white border-0 shadow-none"
            onClick={(e) => {
              e.preventDefault(); // Chặn thẻ <Link> ở ngoài kích hoạt
              e.stopPropagation(); // 5. QUAN TRỌNG: Ngăn chuyển trang khi bấm nút bookmark
              toggleFavorite(movie);
            }}
          >
            {favorited ? (
              <LucideIcon icon="BookmarkCheck" />
            ) : (
              <LucideIcon icon="Bookmark" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default memo(MovieCard);
