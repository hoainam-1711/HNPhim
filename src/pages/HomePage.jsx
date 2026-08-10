import useHomeMovies from "../features/movies/hooks/useHomeMovies";
import Loading from "../components/ui/Loading";
import MovieSection from "../features/movies/components/MovieSection";
import { Container } from "react-bootstrap";

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
  "phim-chieu-rap": "Phim Chiếu Rạp",
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

  return (
    <Container className="py-4">
      {data?.map(({ type, data: movieData }) => {
        const movies = movieData?.data?.items || [];
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
  );
};

export default HomePage;
