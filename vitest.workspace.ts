import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vitest.config.mts',
  {
    extends: "vitest.config.mts",
    test: {
      browser: {
        provider: "playwright", // or 'webdriverio'
        enabled: true,
        instances: [
          {
            browser: "chromium",
            headless: true,
          },
          { browser: "firefox", headless: true },
          { browser: "webkit", headless: true },
        ],
      },
    },
  },
]);
