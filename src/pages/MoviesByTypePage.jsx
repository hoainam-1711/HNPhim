import { Col, Container, Row } from "react-bootstrap";
import { useParams, useSearchParams } from "react-router-dom";
import CustomPagination from "../components/ui/CustomPagination";
import MovieList from "../features/movies/components/MovieList";
import useNewMovies from "../features/movies/hooks/useNewMovies";
import Loading from "../components/ui/Loading";
import SEO from "../components/SEO";

function MoviesByTypePage() {
  const type = useParams();
  const typeSlug = type?.type || "";

  const msg = (typeParams) => {
    switch (typeParams) {
      case "phim-moi":
        return "Phim Mới Cập Nhật";
      case "phim-le":
        return "Phim Lẻ";
      case "phim-bo":
        return "Phim Bộ";
      case "hoat-hinh":
        return "Hoạt Hình";
      case "phim-chieu-rap":
        return "Phim Chiếu Rạp";
      case "tv-shows":
        return "TV Shows";
      default:
        return "";
    }
  };

  // 1. Khởi tạo useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Lấy số trang từ URL (Ví dụ: /danh-sach?page=2 -> pageParam = 2). Mặc định là 1 nếu chưa có
  const page = parseInt(searchParams.get("page")) || 1;

  const { data, loading, error } = useNewMovies(typeSlug, 24, page);
  const movies = data?.data.items || data?.items || [];

  const totalPages = data?.data.params?.pagination?.totalPages || 1;

  // 3. Hàm chuyển trang: Thay vì setState, ta cập nhật Param trên URL
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
        {"MoviesByTypePage: " + error.message ||
          "MoviesByTypePage: Không thể tải danh sách phim"}
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${msg(typeSlug)}${page > 1 ? ` - Trang ${page}` : ""}`}
        description={`Tổng hợp ${msg(typeSlug)} hay và mới nhất. Xem ${msg(typeSlug)} online chất lượng HD với nhiều bộ phim hấp dẫn.`}
        url="/the-loai/hanh-dong"
      />

      <MovieList movies={movies} loading={loading} msg={`${msg(typeSlug)}`} />

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
}

export default MoviesByTypePage;
