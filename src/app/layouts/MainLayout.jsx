import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavbarComponent } from "./Header";
import { Footer } from "./Footer";
import { FilterModal } from "@/features/movies";

/**
 * ScrollToTop
 * Tự động cuộn lên đầu trang khi thay đổi pathname hoặc search query (hỗ trợ cả phân trang ?page=...)
 */
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
}

/**
 * MainLayout
 * Khung layout chuẩn của ứng dụng: ScrollToTop, Navbar (với FilterModal qua composition), Outlet, Footer
 */
export function MainLayout() {
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div
      style={{ backgroundColor: "#0f0f0f" }}
      className="text-white d-flex flex-column min-vh-100"
    >
      <ScrollToTop />

      {/* Truyền FilterModal qua composition vào NavbarComponent */}
      <NavbarComponent onOpenFilter={() => setShowFilterModal(true)}>
        <FilterModal
          show={showFilterModal}
          handleClose={() => setShowFilterModal(false)}
        />
      </NavbarComponent>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
