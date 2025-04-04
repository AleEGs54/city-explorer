import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/", // Define la carpeta raíz del proyecto

  build: {
    outDir: "../dist", // Carpeta de salida de los archivos compilados
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        map: resolve(__dirname, "src/mapPage/map.html"),
        place: resolve(__dirname, "src/placeDetailsPage/placeDetails.html"),
      },
    },
  },
});