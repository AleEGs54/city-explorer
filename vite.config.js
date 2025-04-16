import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        place: resolve(__dirname, "src/placeDetails/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),
      },
    },
  },
});

