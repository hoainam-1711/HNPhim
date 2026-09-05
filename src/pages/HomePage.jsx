import useHomeMovies from "../features/movies/hooks/useHomeMovies";
import Loading from "../components/ui/Loading";
import MovieSection from "../features/movies/components/MovieSection";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import HeroSection from "../features/movies/components/HeroSection";

const MOVIE_TYPES = [
  "phim-chieu-rap",
  "hoat-hinh",
  "phim-moi",
  "phim-le",
  "phim-bo",
  "tv-shows",
];

const MOVIE_TITLES = {
  "phim-chieu-rap": "Phim Chiếu Rạp",
  "hoat-hinh": "Hoạt Hình",
  "phim-moi": "Phim Mới Cập Nhật",
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "tv-shows": "TV Shows",
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

  // Tách phim để hiển thị Hero Section trên cùng
  const heroGroup = data?.find((item) => item.type === "phim-le");
  const heroMovies =
    heroGroup?.data?.data?.items || heroGroup?.data?.items || [];

  return (
    <>
      <Helmet>
        <title>HNPhim - Xem phim trực tuyến</title>
        <meta name="description" content="Trang chủ chọn phim theo loại" />
      </Helmet>

      <Container fluid className="px-3 px-md-4 py-4 home-container">
        {/* HERO SECTION */}
        {heroMovies.length > 0 && (
          <HeroSection movies={heroMovies} type={heroGroup.type} />
        )}

        {/* MovieSection */}
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
