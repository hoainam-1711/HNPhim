import { Container } from "react-bootstrap";
import { useHomeMovies, HeroSection, MovieSection } from "@/features/movies";
import Loading from "@/core/components/ui/Loading";
import SEO from "@/core/components/ui/SEO";

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
        Lỗi: {error.message || "Không thể tải danh sách phim"}
      </div>
    );
  }

  // Tách phim để hiển thị Hero Section trên cùng
  const heroGroup = data?.find((item) => item.type === "phim-moi");
  const heroMovies = heroGroup?.data?.items || [];

  // Các section còn lại, không bao gồm "phim-moi"
  const otherSection = data?.filter((item) => item.type !== "phim-moi") || [];

  return (
    <>
      <SEO
        title="Xem Phim Online HD"
        description="Xem phim online miễn phí với chất lượng HD, cập nhật phim mới, phim bộ, phim lẻ, hoạt hình và nhiều thể loại hấp dẫn."
        url="/"
      />

      <Container fluid className="px-3 px-md-4 py-2 home-container">
        {/* HERO SECTION */}
        {heroMovies.length > 0 && (
          <HeroSection movies={heroMovies.slice(0, 6)} />
        )}

        {/* MovieSection */}
        {otherSection.map(({ type, data: movieData }) => {
          const movies = movieData?.items || [];
          return (
            <MovieSection
              key={type}
              title={MOVIE_TITLES[type] || type}
              type={type}
              movies={movies}
            />
          );
        })}
      </Container>
    </>
  );
};

export default HomePage;
