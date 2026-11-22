import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { FavoritesProvider } from "@/features/favorites";
import AppRoutes from "./routes/AppRoutes";

/**
 * App
 * Cấu hình gốc: Chỉ bao bọc các Provider toàn cục và hiển thị AppRoutes
 */
export function App() {
  return (
    <HelmetProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FavoritesProvider>
    </HelmetProvider>
  );
}

export default App;
