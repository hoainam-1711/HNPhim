import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-bootstrap")) {
              return "bootstrap";
            }
            if (id.includes("hls.js")) {
              return "player";
            }
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("react-router")
            ) {
              return "vendor";
            }
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  clearScreen: false,
});
