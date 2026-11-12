import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import markdownResources from "./scripts/markdownResources.js";

export default defineConfig({
  plugins: [react(), markdownResources()],
  server: {
    // Redirect all 404s back to index.html so react-router handles them
    historyApiFallback: true,
  },
});
