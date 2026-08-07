import { Col, Container, Row } from "react-bootstrap";
import Loading from "./Loading";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

const MovieList = ({ movies, loading, msg }) => {
  if (loading) return <Loading />;
  
  return (
    <Container>
      {/* Tiêu đề */}
      <Row className="mb-4 align-items-center">
        <Col>
          <hr className="border-secondary opacity-25" />
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-danger rounded-pill"
              style={{ width: "4px", height: "24px" }}
            ></div>
            <h2 className="fs-4 fw-bold text-uppercase m-0 tracking-wider">
              {msg}
            </h2>
          </div>
          <hr className="border-secondary opacity-25 mt-3" />
        </Col>
      </Row>

      {/* Danh sách phim */}
      <Row xs={2} sm={3} md={4} lg={6} className="g-3 g-md-4">
        {movies && movies.length > 0 ? (
          movies?.map((movie) => (
            <Col key={movie._id || movie.id}>
              <Link
                to={`/chi-tiet/${movie.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard movie={movie} />
              </Link>
            </Col>
          ))
        ) : (
          <p>Không có phim nào!</p>
        )}
      </Row>
    </Container>
  );
};

export default MovieList;
