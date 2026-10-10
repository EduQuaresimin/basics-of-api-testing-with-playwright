import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  // Global settings: shared by every project
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["list"]],
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL: process.env.API_BASE_URL ?? "http://localhost:3001",
        extraHTTPHeaders: { Accept: "application/json" },
      },
    },
  ],
});
