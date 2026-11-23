import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import {
  useMovieCatalog,
  useCatalogFilters,
  MovieList,
  MovieFilter,
} from "@/features/movies";
import CustomPagination from "@/core/components/ui/CustomPagination";
import SEO from "@/core/components/ui/SEO";

const TYPE_TITLES = {
  "phim-moi": "Phim Mới Cập Nhật",
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "hoat-hinh": "Hoạt Hình",
  "phim-chieu-rap": "Phim Chiếu Rạp",
  "tv-shows": "TV Shows",
};

/**
 * MovieCatalogPage: Trang danh mục phim thống nhất
 * Hợp nhất 4 trang (Type, Genre, Country, Search) kèm bộ lọc đa tham số
 *
 * @param {Object} props
 * @param {'type' | 'genre' | 'country' | 'search'} props.mode - Chế độ hiển thị danh mục
 */
const MovieCatalogPage = ({ mode = "type" }) => {
  const params = useParams();
  const identifier = params.type || params.slug || params.keyword || "";

  // Quản lý đồng bộ bộ lọc và phân trang qua URL SearchParams
  const {
    page,
    filters,
    activeFilterCount,
    applyFilters,
    resetFilters,
    removeFilterValue,
    setPage,
  } = useCatalogFilters(mode);

  // Sử dụng hook hợp nhất useMovieCatalog từ feature movies
  const { data, loading, error } = useMovieCatalog({
    mode,
    identifier,
    page,
    limit: 24,
    filters,
  });

  const movies = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const titlePage = data?.titlePage || "";

  // Xác định tiêu đề hiển thị và SEO metadata theo từng mode
  const getMetadata = () => {
    switch (mode) {
      case "type": {
        const title = TYPE_TITLES[identifier] || identifier;
        return {
          heading: title,
          seoTitle: `${title}${page > 1 ? ` - Trang ${page}` : ""}`,
          seoDesc: `Tổng hợp ${title} hay và mới nhất. Xem ${title} online chất lượng HD với nhiều bộ phim hấp dẫn.`,
          url: `/loai/${identifier}`,
          robots: "index, follow",
        };
      }
      case "genre": {
        const name = titlePage || identifier;
        return {
          heading: `Thể loại: ${name}`,
          seoTitle: `Phim ${name}${page > 1 ? ` - Trang ${page}` : ""}`,
          seoDesc: `Tổng hợp phim ${name} hay và mới nhất. Xem phim ${name} online chất lượng HD.`,
          url: `/the-loai/${identifier}`,
          robots: "index, follow",
        };
      }
      case "country": {
        const name = titlePage || identifier;
        return {
          heading: `Quốc Gia: ${name}`,
          seoTitle: `Phim ${name}${page > 1 ? ` - Trang ${page}` : ""}`,
          seoDesc: `Tổng hợp phim ${name} hay và mới nhất. Xem phim ${name} online chất lượng HD.`,
          url: `/quoc-gia/${identifier}`,
          robots: "index, follow",
        };
      }
      case "search": {
        return {
          heading: `Kết quả tìm kiếm cho: ${identifier}`,
          seoTitle: `${identifier}${page > 1 ? ` - Trang ${page}` : ""}`,
          seoDesc: `Kết quả tìm kiếm phim cho từ khóa "${identifier}".`,
          url: `/tim-kiem/${identifier}`,
          robots: "noindex, follow",
        };
      }
      default:
        return {
          heading: "Danh Sách Phim",
          seoTitle: "Danh Sách Phim",
          seoDesc: "Danh sách phim online chất lượng cao.",
          url: "/",
          robots: "index, follow",
        };
    }
  };

  const meta = getMetadata();

  return (
    <>
      <SEO
        title={meta.seoTitle}
        description={meta.seoDesc}
        url={meta.url}
        robots={meta.robots}
      />

      <MovieList
        movies={movies}
        loading={loading}
        error={error}
        msg={meta.heading}
        filterSlot={
          <MovieFilter
            mode={mode}
            filters={filters}
            activeFilterCount={activeFilterCount}
            onApply={applyFilters}
            onReset={resetFilters}
            onRemoveFilter={removeFilterValue}
          />
        }
      />

      <Container className="pt-3">
        {!loading && !error && totalPages > 1 && (
          <Row>
            <Col>
              <CustomPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default MovieCatalogPage;
