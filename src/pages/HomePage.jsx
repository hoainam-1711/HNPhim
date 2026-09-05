import useHomeMovies from "../features/movies/hooks/useHomeMovies";
import Loading from "../components/ui/Loading";
import MovieSection from "../features/movies/components/MovieSection";
import { Container } from "react-bootstrap";
import HeroSection from "../features/movies/components/HeroSection";
import SEO from "../components/SEO";

const MOVIE_TYPES = [
  "phim-moi",
  "phim-le",
  "phim-bo",
  "phim-chieu-rap",
  "hoat-hinh",
  "tv-shows",
];

const MOVIE_TITLES = {
  "phim-moi": "Phim Mới Cập Nhật",
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "phim-chieu-rap": "Phim Chiếu Rạp",
  "hoat-hinh": "Hoạt Hình",
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

  // Các section còn lại, không bao gồm "phim-le"
  const otherSection = data?.filter((item) => item.type !== "phim-le") || [];

  return (
    <>
      <SEO
        title="Xem Phim Online HD"
        description="Xem phim online miễn phí với chất lượng HD, cập nhật phim mới, phim bộ, phim lẻ, hoạt hình và nhiều thể loại hấp dẫn."
        url="/"
      />

      <Container fluid className="px-3 px-md-4 py-4 home-container">
        {/* HERO SECTION */}
        {heroMovies.length > 0 && (
          <HeroSection movies={heroMovies} type={heroGroup.type} />
        )}

        {/* MovieSection */}
        {otherSection.map(({ type, data: movieData }) => {
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
