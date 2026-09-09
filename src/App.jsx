import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/ui/Loading";

const HomePage = lazy(() => import("./pages/HomePage"));
const MoviesByTypePage = lazy(() => import("./pages/MoviesByTypePage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const MoviesByGenrePage = lazy(() => import("./pages/MoviesByGenrePage"));
const MoviesByCountryPage = lazy(() => import("./pages/MoviesByCountryPage"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/loai/:type" element={<MoviesByTypePage />} />

          <Route path="/ua-thich" element={<FavoritesPage />} />

          <Route path="/tim-kiem/:keyword" element={<SearchPage />} />

          <Route path="/the-loai/:slug" element={<MoviesByGenrePage />} />

          <Route path="/quoc-gia/:slug" element={<MoviesByCountryPage />} />

          <Route path="/chi-tiet/:slug" element={<MovieDetailPage />} />

          <Route path="/xem/:slug/:ep" element={<WatchPage />} />

          {/* Trang 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
