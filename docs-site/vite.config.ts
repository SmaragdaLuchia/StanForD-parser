import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes every asset reference relative, so the build works from
// any GitHub Pages location (user site root or /<repo>/ project subpath).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
