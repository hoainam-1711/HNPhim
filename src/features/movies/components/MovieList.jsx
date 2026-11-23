import { Col, Container, Row } from "react-bootstrap";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";
import Loading from "@/core/components/ui/Loading";

const MovieList = ({
  movies,
  loading = false,
  error = null,
  msg,
  filterSlot = null,
}) => {
  return (
    <Container fluid>
      {/* Tiêu đề */}
      <Row className="mb-3 align-items-center">
        <Col>
          <hr className="border-secondary opacity-25" />
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-danger rounded-pill"
              style={{ width: "4px", height: "24px" }}
            ></div>
            <h2 className="fs-5 fw-bold text-uppercase m-0 tracking-wider">
              {msg}
            </h2>
          </div>
          <hr className="border-secondary opacity-25 mt-3 mb-0" />
        </Col>
      </Row>

      {/* Bộ lọc (nếu có) - giữ nguyên không unmount khi danh sách phim đang tải */}
      {filterSlot}

      {/* Nội dung danh sách phim */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-white text-center py-5">
          Lỗi: {error.message || "Không thể tải danh sách phim"}
        </div>
      ) : movies && movies.length > 0 ? (
        <Row xs={2} sm={3} md={4} lg={6} className="g-3 g-md-4">
          {movies.map((movie) => (
            <Col key={movie._id || movie.id || movie.slug}>
              <Link
                to={`/chi-tiet/${movie.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard movie={movie} />
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-secondary text-center py-5">
          Không tìm thấy phim nào phù hợp!
        </p>
      )}
    </Container>
  );
};

export default MovieList;
