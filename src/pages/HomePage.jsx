import { Col, Container, Row } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import CustomPagination from "../components/CustomPagination";
import { useSearchParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import useMoviesList from "../hooks/useMoviesList";


function HomePage() {
  // 1. Khởi tạo useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Lấy số trang từ URL (Ví dụ: /danh-sach?page=2 -> pageParam = 2). Mặc định là 1 nếu chưa có
  const page = parseInt(searchParams.get("page")) || 1;

  const { data, loading, error } = useMoviesList(page);
  const movies = data?.data.items || data?.items || [];
  const totalPages = data?.data.params?.pagination?.totalPages;

  // 3. Mỗi khi `page` trên URL thay đổi -> Gọi lại API để lấy dữ liệu trang tương ứng

  // 4. Hàm chuyển trang: Thay vì setState, ta cập nhật Param trên URL
  const handlePageChange = (newPage) => {
    // Cập nhật URL thành /danh-sach?page=newPage
    setSearchParams({ page: newPage });

    // Tự động cuộn mượt lên đầu trang khi sang trang mới (UX tốt hơn)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (error) return <div>{error}</div>;

  return (
    <div
      className="text-white min-vh-100 d-flex flex-column"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      {/* Header */}
      <NavbarComponent />

      {/* Content chính */}
      <div className="flex-grow-1">
        <MovieList
          movies={movies}
          loading={loading}
          msg={"Phim mới cập nhật"}
        />

        <Container className="pt-3 pb-4">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
