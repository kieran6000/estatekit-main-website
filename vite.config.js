import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Redirect all 404s back to index.html so react-router handles them
    historyApiFallback: true,
  },
});
