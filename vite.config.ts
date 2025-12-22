import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variables" as *;',
      },
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "ReactVectorPdf",
      fileName: (format) => `react-vector-pdf.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "jspdf"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM", jspdf: "jsPDF" },
      },
    },
  },
});
