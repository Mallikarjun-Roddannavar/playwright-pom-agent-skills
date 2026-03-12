import {
  request as playwrightRequest,
  test as base,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import config from "@config/test-config.json";

import { AuthService } from "@api/services/AuthService";
import { authStatePath } from "@utils/common/CommonUtils";
import { logger } from "@utils/common/Logger";

const apiBaseUrl = config.BASE_URLS.API;
const roleCredentials = {
  admin: {
    username: config.USERS.ADMIN.USER_NAME,
    password: config.USERS.ADMIN.PASSWORD,
  },
  editor: {
    username: config.USERS.EDITOR.USER_NAME,
    password: config.USERS.EDITOR.PASSWORD,
  },
  viewer: {
    username: config.USERS.VIEWER.USER_NAME,
    password: config.USERS.VIEWER.PASSWORD,
  },
} as const;

type RoleName = "admin" | "editor" | "viewer";

type TokenResponse = {
  access_token: string;
};

type CleanupTask = () => Promise<void>;

export type Cleanup = {
  add(task: CleanupTask): void;
};

export type TestFixtures = {
  adminContext: BrowserContext;
  editorContext: BrowserContext;
  viewerContext: BrowserContext;
  adminPage: Page;
  editorPage: Page;
  viewerPage: Page;
  adminRequest: APIRequestContext;
  editorRequest: APIRequestContext;
  viewerRequest: APIRequestContext;
  cleanup: Cleanup;
};

const fixtureLogger = logger.withScope("test.fixtures");

async function createBrowserRoleContext(browser: Browser, role: RoleName): Promise<BrowserContext> {
  fixtureLogger.info("Creating browser role context", {
    role,
    storageState: authStatePath[role],
  });

  return browser.newContext({ storageState: authStatePath[role] });
}

async function createApiRoleContext(role: RoleName): Promise<APIRequestContext> {
  const credentials = roleCredentials[role];
  const authRequest = await playwrightRequest.newContext({ baseURL: apiBaseUrl });

  fixtureLogger.info("Creating API role context", {
    role,
    username: credentials.username,
  });

  try {
    const authService = new AuthService(authRequest);
    const tokenResponse = await authService.getAccessToken(
      credentials.username,
      credentials.password
    );
    if (!tokenResponse.ok()) {
      throw new Error(
        "Failed to create API role context for " + role + ". Status: " + tokenResponse.status()
      );
    }
    const tokenPayload = (await tokenResponse.json()) as TokenResponse;

    return playwrightRequest.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: "Bearer " + tokenPayload.access_token,
      },
    });
  } finally {
    await authRequest.dispose();
  }
}

export const test = base.extend<TestFixtures>({
  cleanup: async ({ request: _request }, use) => {
    void _request;
    const tasks: CleanupTask[] = [];

    await use({
      add(task: CleanupTask) {
        tasks.push(task);
      },
    });

    for (const task of tasks.reverse()) {
      await task();
    }
  },
  adminContext: async ({ browser }, use) => {
    const context = await createBrowserRoleContext(browser, "admin");
    try {
      await use(context);
    } finally {
      fixtureLogger.info("Closing browser role context", { role: "admin" });
      await context.close();
    }
  },
  editorContext: async ({ browser }, use) => {
    const context = await createBrowserRoleContext(browser, "editor");
    try {
      await use(context);
    } finally {
      fixtureLogger.info("Closing browser role context", { role: "editor" });
      await context.close();
    }
  },
  viewerContext: async ({ browser }, use) => {
    const context = await createBrowserRoleContext(browser, "viewer");
    try {
      await use(context);
    } finally {
      fixtureLogger.info("Closing browser role context", { role: "viewer" });
      await context.close();
    }
  },
  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    try {
      await use(page);
    } finally {
      await page.close();
    }
  },
  editorPage: async ({ editorContext }, use) => {
    const page = await editorContext.newPage();
    try {
      await use(page);
    } finally {
      await page.close();
    }
  },
  viewerPage: async ({ viewerContext }, use) => {
    const page = await viewerContext.newPage();
    try {
      await use(page);
    } finally {
      await page.close();
    }
  },
  adminRequest: async ({ request: _request }, use) => {
    void _request;
    const apiContext = await createApiRoleContext("admin");
    try {
      await use(apiContext);
    } finally {
      fixtureLogger.info("Disposing API role context", { role: "admin" });
      await apiContext.dispose();
    }
  },
  editorRequest: async ({ request: _request }, use) => {
    void _request;
    const apiContext = await createApiRoleContext("editor");
    try {
      await use(apiContext);
    } finally {
      fixtureLogger.info("Disposing API role context", { role: "editor" });
      await apiContext.dispose();
    }
  },
  viewerRequest: async ({ request: _request }, use) => {
    void _request;
    const apiContext = await createApiRoleContext("viewer");
    try {
      await use(apiContext);
    } finally {
      fixtureLogger.info("Disposing API role context", { role: "viewer" });
      await apiContext.dispose();
    }
  },
});

export { expect } from "@playwright/test";
