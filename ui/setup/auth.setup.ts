import fs from "node:fs/promises";

import { request, test } from "@playwright/test";
import config from "@config/test-config.json";

import { BaseApiService } from "@api/services/BaseApiService";
import { authDir, authStatePath } from "@utils/common/CommonUtils";
import { logger } from "@utils/common/Logger";

type RoleName = "admin" | "editor" | "viewer";

const authSetupLogger = logger.withScope("auth.setup");

type TokenResponse = {
  access_token: string;
};

const uiBaseUrl = config.BASE_URLS.UI;
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
} satisfies Record<RoleName, { username: string; password: string }>;

async function createRoleStorageState(role: RoleName): Promise<void> {
  const credentials = roleCredentials[role];
  authSetupLogger.info("Creating auth state", { role, username: credentials.username });
  const requestContext = await request.newContext({ baseURL: apiBaseUrl });
  try {
    const tokenResponse = await requestContext.post(BaseApiService.routes.token, {
      form: {
        username: credentials.username,
        password: credentials.password,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!tokenResponse.ok()) {
      throw new Error(`Unable to fetch token for ${role}. Status: ${tokenResponse.status()}`);
    }

    const tokenPayload = (await tokenResponse.json()) as TokenResponse;
    const authUser = {
      username: credentials.username,
      role,
      accessToken: tokenPayload.access_token,
    };

    const storageState = {
      cookies: [],
      origins: [
        {
          origin: uiBaseUrl,
          localStorage: [
            {
              name: "playwright_practice_auth_user",
              value: JSON.stringify(authUser),
            },
          ],
        },
      ],
    };

    await fs.writeFile(authStatePath[role], JSON.stringify(storageState, null, 2), "utf-8");
    authSetupLogger.info("Auth state created", { role, output: authStatePath[role] });
  } finally {
    await requestContext.dispose();
  }
}

test("create auth states for admin/editor/viewer", async () => {
  await fs.mkdir(authDir, { recursive: true });
  await Promise.all([
    createRoleStorageState("admin"),
    createRoleStorageState("editor"),
    createRoleStorageState("viewer"),
  ]);
});
