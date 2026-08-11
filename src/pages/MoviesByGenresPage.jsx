import { useParams, useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import useMoviesByGenre from "../features/movies/hooks/useMovieByGenres";
import CustomPagination from "../components/ui/CustomPagination";
import MovieList from "../features/movies/components/MovieList";
import Loading from "../components/ui/Loading";
import { Helmet } from "react-helmet-async";

const MoviesByGenresPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { data, loading, error } = useMoviesByGenre(slug, 24, page);

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

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-white text-center py-5">
        Lỗi:{" "}
        {"MoviesByGenresPage: " + error.message ||
          "MoviesByGenresPage: Không thể tải danh sách phim"}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Thể loại - {titlePage} - HNPhim{page > 1 ? ` - Trang ${page}` : ""}</title>

        <meta
          name="description"
          content={`Trang phim theo thể loại ${titlePage}`}
        />
      </Helmet>

      <MovieList
        movies={movies}
        loading={loading}
        msg={`Phim thuộc thể loại: ${titlePage}`}
      />
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
    </>
  );
};

export default MoviesByGenresPage;
