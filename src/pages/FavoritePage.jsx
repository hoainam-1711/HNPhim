import { MovieContext } from "../context/MovieContext";
import { useContext } from "react";
import MovieList from "../features/movies/components/MovieList";
import { Helmet } from "react-helmet-async";

function FavoritesPage() {
  // Lấy mảng favorites từ Context
  const { favorites } = useContext(MovieContext);
  const length = favorites.length;
  console.log("length: ", length);

  return (
    <>
      <Helmet>
        <title>Phim đã lưu - HNPhim</title>
        <meta name="description" content="Mục phim ưa thích" />
      </Helmet>

      <MovieList movies={favorites} msg={"Phim Đã Lưu"} />
    </>
  );
}

export default FavoritesPage;
