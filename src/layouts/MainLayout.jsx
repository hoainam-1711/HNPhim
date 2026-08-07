import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  return (
    <div
      style={{ backgroundColor: "#0f0f0f" }}
      className="text-white d-flex flex-column min-vh-100"
    >
      <ScrollToTop />

      <NavbarComponent />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
