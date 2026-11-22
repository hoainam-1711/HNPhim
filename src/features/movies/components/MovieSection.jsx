import "./MovieSection.css";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

const MovieSection = ({ title, type, movies = [] }) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="movie-section mb-4 mb-md-5">
      {/* Tiêu đề & Xem tất cả */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="section-title text-white fs-5 fs-md-4 fw-bold mb-0">
          {title}
        </h2>
        <Button
          as={Link}
          to={`/loai/${type}`}
          variant="link"
          className="see-more-btn text-decoration-none text-secondary d-flex align-items-center gap-1 p-0"
        >
          <span>Xem thêm</span>
          <ChevronRight />
        </Button>
      </div>

      {/* Khung bao bọc danh sách + 2 nút điều hướng */}
      <div className="movie-carousel-wrapper">
        <button
          type="button"
          className="carousel-btn carousel-btn-prev"
          onClick={() => handleScroll("left")}
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft />
        </button>

        <div className="movie-list-container pt-3 px-1" ref={scrollRef}>
          {movies.map((movie) => (
            <div key={movie._id || movie.slug} className="movie-item">
              <Link
                to={`/chi-tiet/${movie.slug}`}
                className="text-decoration-none text-reset d-block h-100"
              >
                <MovieCard movie={movie} />
              </Link>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-btn carousel-btn-next"
          onClick={() => handleScroll("right")}
          aria-label="Cuộn sang phải"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default MovieSection;
