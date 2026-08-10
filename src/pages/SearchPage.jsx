import { useParams, useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import CustomPagination from "../components/ui/CustomPagination";
import MovieList from "../features/movies/components/MovieList";
import useSearchMovies from "../features/movies/hooks/useSearchMovies";

const SearchPage = () => {
  const { keyword } = useParams();

  // 1. Khởi tạo useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Lấy số trang từ URL (Ví dụ: /danh-sach?page=2 -> pageParam = 2). Mặc định là 1 nếu chưa có
  const page = parseInt(searchParams.get("page")) || 1;

  const { data, loading } = useSearchMovies(keyword, 24, page);
  const movies = data?.data?.items || data?.items || [];

  const totalPages = data?.data?.params?.pagination?.totalPages || 1;

  // 4. Hàm chuyển trang: Thay vì setState, ta cập nhật Param trên URL
  const handlePageChange = (newPage) => {
    // Cập nhật URL thành /danh-sach?page=newPage
    setSearchParams({ page: newPage });

    // Tự động cuộn mượt lên đầu trang khi sang trang mới (UX tốt hơn)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <MovieList
        movies={movies}
        loading={loading}
        msg={`Kết quả tìm kiếm cho: ${keyword}`}
      />

      <Container className="pt-3">
        {/* Điều khiển phân trang */}
        {totalPages > 1 && (
          <Row>
            <Col>
              <CustomPagination
                page={page}
                totalPages={totalPages}
                setPage={handlePageChange} // Truyền hàm handlePageChange vào
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default SearchPage;
