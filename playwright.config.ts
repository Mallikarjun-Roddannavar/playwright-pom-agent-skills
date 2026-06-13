import { defineConfig, devices } from "@playwright/test";
import { BaseApiService } from "@api/services/BaseApiService";
import config from "@config/test-config.json";
import { BasePage } from "@pages/BasePage";
import { timeouts } from "@utils/common/Waits";

const uiBaseUrl = config.BASE_URLS.UI;
const apiBaseUrl = config.BASE_URLS.API;

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: timeouts.test,
  expect: {
    timeout: timeouts.expect,
  },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["./utils/common/CustomReporter.ts"],
  ],
  use: {
    baseURL: uiBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: timeouts.action,
    navigationTimeout: timeouts.navigation,
  },
  projects: [
    {
      name: "setup",
      testDir: "./ui/setup",
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: apiBaseUrl,
      },
    },
    {
      name: "ui",
      testDir: "./ui/specs",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: uiBaseUrl,
      },
    },
    {
      name: "api",
      testDir: "./api/specs",
      dependencies: ["setup"],
      use: {
        baseURL: apiBaseUrl,
      },
    },
  ],
  webServer: [
    {
      command: "echo running backend API on remote url",
      cwd: "../backend",
      url: `${apiBaseUrl}${BaseApiService.routes.health}`,
      reuseExistingServer: true,
      timeout: timeouts.apiServerStartup,
    },
    {
      command: "echo running frontend UI on remote url",
      cwd: "../frontend",
      url: `${uiBaseUrl}${BasePage.routes.login}`,
      reuseExistingServer: true,
      timeout: timeouts.uiServerStartup,
    },
  ],
});
