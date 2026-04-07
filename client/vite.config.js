import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false, // optional, helps if backend is HTTPS with self-signed cert
      },
    },
  },
  build: {
    target: "esnext",  // modern JS target
    outDir: "dist",
    sourcemap: true,   // optional: helps debug build issues
  },
});