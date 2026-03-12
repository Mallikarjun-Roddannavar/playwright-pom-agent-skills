import { test, expect } from "@playwright/test";

import { BaseApiService } from "@api/services/BaseApiService";

test("health endpoint is reachable", async ({ request }) => {
  const response = await request.get(BaseApiService.routes.health);
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});
