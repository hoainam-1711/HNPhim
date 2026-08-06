import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritePage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import WatchPage from "./pages/WatchPage";
import "./css/App.css"

function App() {
  return (
    <Routes className="background">
      {/* Nếu người dùng vào trang chủ "/", chuyển hướng về "/danh-sach" */}
      <Route path="/" element={<Navigate to="/danh-sach" replace />} />

      {/* Route danh sách phim đón nhận query parameters (?page=...) */}
      <Route path="/danh-sach" element={<HomePage />} />

      <Route path="/ua-thich" element={<FavoritesPage />} />

      {/* Khai báo tham số động :keyword ở đây */}
      <Route path="/tim-kiem/:keyword" element={<SearchPage />} />

      <Route path="/chi-tiet/:slug" element={<MovieDetailPage />} />

      <Route path="/xem/:slug/:ep" element={<WatchPage />} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
