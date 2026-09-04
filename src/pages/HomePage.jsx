import useHomeMovies from "../features/movies/hooks/useHomeMovies";
import Loading from "../components/ui/Loading";
import MovieSection from "../features/movies/components/MovieSection";
import HeroSection from "../features/movies/components/HeroSection";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const MOVIE_TYPES = [
  "phim-moi",
  "phim-le",
  "phim-bo",
  "hoat-hinh",
  "phim-chieu-rap",
  "tv-shows",
];

const MOVIE_TITLES = {
  "phim-moi": "Phim Mới Cập Nhật",
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "hoat-hinh": "Hoạt Hình",
  "tv-shows": "TV Shows",
  "phim-chieu-rap": "Phim Chiếu Rạp",
};

const HomePage = () => {
  const { data, loading, error } = useHomeMovies(MOVIE_TYPES, 6);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-white text-center py-5">
        Lỗi:{" "}
        {"HomePage: " + error.message ||
          "HomePage: Không thể tải danh sách phim"}
      </div>
    );
  }

  // Tách phim-chieu-rap để hiển thị Hero Section trên cùng
  const heroGroup = data?.find((item) => item.type === "phim-chieu-rap");
  const heroMovies =
    heroGroup?.data?.data?.items || heroGroup?.data?.items || [];

  return (
    <>
      <Helmet>
        <title>HNPhim - Xem phim trực tuyến</title>
        <meta name="description" content="Trang chủ chọn phim theo loại" />
      </Helmet>

      <Container fluid className="px-3 px-md-4 py-4 home-container">
        {/* HERO SECTION CHO PHIM CHIẾU RẠP */}
        {heroMovies.length > 0 && <HeroSection movies={heroMovies} />}

        {/* CÁC SECTION PHIM CÒN LẠI DẠNG CAROUSEL */}
        {data.map(({ type, data: movieData }) => {
          const movies = movieData?.data?.items || movieData?.items || [];
          return (
            <MovieSection
              key={type}
              title={MOVIE_TITLES[type] || type}
              type={type}
              movies={movies.slice(0, 6)}
            />
          );
        })}
      </Container>
    </>
  );
};

export default HomePage;
