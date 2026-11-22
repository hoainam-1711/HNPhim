import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { FavoritesProvider } from "@/features/favorites";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FavoritesProvider>
    </HelmetProvider>
  </StrictMode>,
);
