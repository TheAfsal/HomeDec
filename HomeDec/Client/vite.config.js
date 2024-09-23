import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy only API requests, leave frontend routes to Vite
      "/api": {
        target: "http://localhost:3000", // Node.js backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix from the request
      },
    },
  },
});
