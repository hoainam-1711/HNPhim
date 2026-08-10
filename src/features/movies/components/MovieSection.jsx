import "./MovieSection.css";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import LucideIcon from "../../../components/ui/LucideIcon";
import MovieCard from "./MovieCard";

const MovieSection = ({ title, type, movies }) => {
  return (
    <section className="movie-section mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title text-white fs-4 fw-bold mb-0">{title}</h2>
        <Button
          as={Link}
          to={`/loai/${type}`}
          variant="link"
          className="see-more-btn text-decoration-none text-secondary d-flex align-items-center gap-1 p-0"
        >
          <span>Xem tất cả</span>
          <LucideIcon icon="ChevronRight" size={18} />
        </Button>
      </div>

      <Row className="g-3">
        {movies.map((movie) => (
          <Col key={movie._id || movie.slug} xs={6} md={4} lg={2}>
            <Link
              to={`/chi-tiet/${movie.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MovieCard movie={movie} />
            </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default MovieSection;
