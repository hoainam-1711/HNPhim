import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/ui/Loading";

const HomePage = lazy(() => import("./pages/HomePage"));
const MovieCatalogPage = lazy(() => import("./pages/MovieCatalogPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          <Route
            path="/loai/:type"
            element={<MovieCatalogPage mode="type" />}
          />

          <Route path="/ua-thich" element={<FavoritesPage />} />

          <Route
            path="/tim-kiem/:keyword"
            element={<MovieCatalogPage mode="search" />}
          />

          <Route
            path="/the-loai/:slug"
            element={<MovieCatalogPage mode="genre" />}
          />

          <Route
            path="/quoc-gia/:slug"
            element={<MovieCatalogPage mode="country" />}
          />

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
