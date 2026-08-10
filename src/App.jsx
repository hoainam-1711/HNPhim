import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesByTypePage from "./pages/MoviesByTypePage";
import FavoritesPage from "./pages/FavoritePage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import WatchPage from "./pages/WatchPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import MoviesByGenresPage from "./pages/MoviesByGenresPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        <Route index element={<HomePage />} />

        {/* Route danh sách phim đón nhận query parameters (?page=...) */}
        <Route path="/:type" element={<MoviesByTypePage />} />

        <Route path="/ua-thich" element={<FavoritesPage />} />

        <Route path="/the-loai/:slug" element={<MoviesByGenresPage />} />

        {/* Khai báo tham số động :keyword ở đây */}
        <Route path="/tim-kiem/:keyword" element={<SearchPage />} />

        <Route path="/chi-tiet/:slug" element={<MovieDetailPage />} />

        <Route path="/xem/:slug/:ep" element={<WatchPage />} />

        {/* Trang 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
