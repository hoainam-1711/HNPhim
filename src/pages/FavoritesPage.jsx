import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useFavorites } from "@/features/favorites";
import { MovieList } from "@/features/movies";
import { usePagination } from "@/core/hooks";
import CustomPagination from "@/core/components/ui/CustomPagination";
import SEO from "@/core/components/ui/SEO";

const ITEMS_PER_PAGE = 24;

const FavoritesPage = () => {
  // Lấy mảng favorites từ Context
  const { favorites } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10) || 1;

  // Sử dụng usePagination từ tầng core để cắt trang và tính tổng trang chuẩn xác
  const { totalPages, paginatedItems } = usePagination({
    totalItems: favorites.length,
    itemsPerPage: ITEMS_PER_PAGE,
    currentPage: page,
    data: favorites,
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <>
      <SEO
        title={`Phim Yêu Thích${page > 1 ? ` - Trang ${page}` : ""}`}
        description="Danh sách những bộ phim bạn đã lưu yêu thích."
        url="/ua-thich"
        robots="noindex, nofollow"
      />

      <MovieList movies={paginatedItems} msg={"Phim Yêu Thích"} />

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
};

export default FavoritesPage;
