import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom", // simulate browser
    globals: true, // use global test/expect
    setupFiles: "./src/setupTests.js", // setup file for RTL
  },
});
