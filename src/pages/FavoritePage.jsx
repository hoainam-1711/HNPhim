import { MovieContext } from "../context/MovieContext";
import { useContext } from "react";
import MovieList from "../features/movies/components/MovieList";

function FavoritesPage() {
  // Lấy mảng favorites từ Context
  const { favorites } = useContext(MovieContext);

  return <MovieList movies={favorites}  msg={"Phim Đã Lưu"} />;
}

export default FavoritesPage;
