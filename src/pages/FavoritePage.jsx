import { MovieContext } from "../context/MovieContext";
import MovieList from "../components/MovieList";
import { useContext, useEffect, useState } from "react";

function FavoritesPage() {
  // Lấy mảng favorites từ Context
  const { favorites } = useContext(MovieContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tắt loading sau một khoảng thời gian ngắn để tạo hiệu ứng mượt
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer); // Cleanup timer khi unmount
  }, []);

  return (
    <div
      className="text-white min-vh-100"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      <MovieList movies={favorites} loading={loading} msg={"Phim Đã Lưu"} />
    </div>
  );
}

export default FavoritesPage;
