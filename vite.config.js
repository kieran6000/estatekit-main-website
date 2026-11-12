import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import markdownResources from "./scripts/markdownResources.js";

export default defineConfig({
  plugins: [react(), markdownResources()],
  build: {
    // Read by scripts/prerender.mjs to preload each article's own file,
    // then deleted so it never ships.
    manifest: true,
  },
  server: {
    // Redirect all 404s back to index.html so react-router handles them
    historyApiFallback: true,
  },
});
