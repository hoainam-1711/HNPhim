import "./MainLayout.css";
import { useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import NavbarComponent from "../components/layout/NavbarComponent";
import Footer from "../components/layout/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  return (
    <div className="text-white min-vh-100 aura-bg">
      {/* 4 lớp hiệu ứng nền của Smoked Glass */}
      <div className="aura-layer-1" aria-hidden="true" />
      <div className="aura-layer-2" aria-hidden="true" />
      <div className="aura-layer-3" aria-hidden="true" />
      <div className="aura-layer-4" aria-hidden="true" />

      {/* Wrapper nội dung chính - Giữ Flexbox để đẩy Footer xuống đáy */}
      <div className="aura-content d-flex flex-column min-vh-100">
        <ScrollToTop />

        <NavbarComponent />

        <main className="flex-grow-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
