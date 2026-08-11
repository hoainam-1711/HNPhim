import { MovieContext } from "../context/MovieContext";
import { useContext } from "react";
import MovieList from "../features/movies/components/MovieList";
import { Helmet } from "react-helmet-async";
import { Col, Container, Row } from "react-bootstrap";
import CustomPagination from "../components/ui/CustomPagination";
import { useSearchParams } from "react-router-dom";

const ITEMSPERPAGE = 24;

function FavoritesPage() {
  // Lấy mảng favorites từ Context
  const { favorites } = useContext(MovieContext);
  const length = favorites.length;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const totalPages = Math.ceil(length / ITEMSPERPAGE);

  // Cắt mảng lấy 24 items theo trang
  const startIndex = (page - 1) * ITEMSPERPAGE;
  const endIndex = startIndex + ITEMSPERPAGE;
  const currentFavorites = favorites.slice(startIndex, endIndex);
  
  const handlePageChange = (newPage) => {
    // Cập nhật URL thành /danh-sach?page=newPage
    setSearchParams({ page: newPage });

    // Tự động cuộn mượt lên đầu trang khi sang trang mới (UX tốt hơn)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Phim đã lưu - HNPhim</title>
        <meta name="description" content="Mục phim ưa thích" />
      </Helmet>

      <MovieList movies={currentFavorites} msg={"Phim Đã Lưu"} />

      <Container className="pt-3">
        {/* Điều khiển phân trang */}
        {totalPages > 1 && (
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

export default FavoritesPage;
