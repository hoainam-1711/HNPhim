import { useParams, useSearchParams } from "react-router-dom";
import useMoviesByGenre from "../hooks/useMovieByGenres";
import { Col, Container, Row } from "react-bootstrap";
import CustomPagination from "../components/CustomPagination";
import MovieList from "../components/MovieList";

const MoviesByGenresPages = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { data, loading } = useMoviesByGenre(slug, 24, page);

  const movies = data?.data?.items || data?.items || [];
  

  const titlePage = data?.data?.titlePage || data?.titlePage || "";

  const totalPages =
    data?.data?.params?.pagination?.totalPages ||
    data?.params?.pagination?.totalPages ||
    1;

  const handlePageChange = (newPage) => {
    // Cập nhật URL thành /danh-sach?page=newPage
    setSearchParams({ page: newPage });

    // Tự động cuộn mượt lên đầu trang khi sang trang mới (UX tốt hơn)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      <MovieList movies={movies} loading={loading} msg={`Phim thuộc thể loại: ${titlePage}`}/>
      <Container className="pt-3">
        {/* Điều khiển phân trang */}
        {!loading && totalPages > 1 && (
          <Row>
            <Col>
              <CustomPagination
                page={page}
                totalPages={totalPages}
                setPage={handlePageChange}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MoviesByGenresPages;
