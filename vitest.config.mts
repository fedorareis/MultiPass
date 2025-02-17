import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  define: {
    "process.env": JSON.stringify({}),
  },
  test: {
    include: ["src/**/*.test.tsx"],
    environment: "jsdom",
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["json", "json-summary"],
    },
  },
});
