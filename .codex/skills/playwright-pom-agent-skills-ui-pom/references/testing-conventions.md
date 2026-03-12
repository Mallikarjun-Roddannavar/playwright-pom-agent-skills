# UI Testing Conventions

Load this file only when a UI task needs more repo-specific decision rules.

## Ownership

- `ui/pages/*Page.ts` owns selectors, interactions, routes, and page-load readiness.
- `ui/specs/*.spec.ts` owns assertions and scenario intent.
- `utils/fixtures/TestFixtures.ts` owns shared authenticated browser and API fixture creation.
- `ui/setup/auth.setup.ts` owns reusable auth-state bootstrap.

## Selector Strategy

- Prefer `data-testid` selectors first.
- Use explicit user-visible locators when a stable test id is not available.
- Do not add raw locators directly in specs when a page object can own them.

## Waiting Strategy

- Each page owns its own `waitForPageLoad()` condition.
- Do not add assertion logic to `waitForPageLoad()`.
- Avoid ad hoc sleeps; use locator waits or web-first assertions.

## Assertions

- Keep assertions in specs, not in page objects.
- Specs should assert user-visible behavior with Playwright web-first assertions.

## Fixtures

- The shared fixture file exposes `adminPage`, `editorPage`, `viewerPage`, `adminContext`, `editorContext`, `viewerContext`, `adminRequest`, `editorRequest`, `viewerRequest`, and `cleanup`.
- Tests create the page objects they need.

## Good And Bad Examples

### Selector Ownership

Good:

```ts
// ui/specs/login.spec.ts
await loginPage.loginExpectingFailure("admin", "wrong-password");
await expect(loginPage.errorMessage).toBeVisible();
```

Bad:

```ts
// ui/specs/login.spec.ts
await page.getByTestId("username-input").fill("admin");
await page.getByTestId("password-input").fill("wrong-password");
await page.getByRole("button", { name: "Sign in" }).click();
await expect(page.getByTestId("login-error")).toBeVisible();
```

Why:

- The good example keeps selectors in the page object and assertions in the spec.
- The bad example duplicates UI structure directly in the spec.

### Fixture Usage

Good:

```ts
const loginPage = new LoginPage(page);
await loginPage.goto();
```

Bad:

```ts
const loginPage = fixtures.loginPage;
await loginPage.goto();
```

Why:

- In this repo, fixtures expose Playwright primitives such as `adminPage` and `adminRequest`, not page-object instances.
- Tests should create the page objects they need.

### Data Cleanup Registration

Good:

```ts
cleanup.add(async () => {
  await adminFoldersService.remove(createdFolderId);
});
```

Bad:

```ts
test.afterAll(async () => {
  await adminFoldersService.remove(createdFolderId);
});
```

Why:

- Cleanup is framework-managed through the shared `cleanup` fixture.
- Specs should not need their own suite lifecycle code just to remove test data.

### Before/After Generated Test Cleanup

Before:

```ts
// generated-style test
await page.goto("/login");
await page.getByTestId("username-input").fill("admin");
await page.getByTestId("password-input").fill("adminpass");
await page.getByRole("button", { name: "Sign in" }).click();
await expect(page.getByTestId("home-title")).toBeVisible();
```

After:

```ts
const loginPage = new LoginPage(page);
const homePage = new HomePage(page);

await loginPage.goto();
await loginPage.login(roleCredentials.admin.username, roleCredentials.admin.password);
await expect(homePage.title).toBeVisible();
```

Why:

- The after version moves selectors and interactions into page objects.
- The assertion remains in the spec.
- The spec reads like a scenario instead of a recorded interaction dump.

### Before/After Multi-Role UI Test Cleanup

Before:

```ts
await adminPage.goto("/folders");
await adminPage.getByTestId("new-folder-input").fill(name);
await adminPage.getByRole("button", { name: "Create" }).click();
await viewerPage.goto("/folders");
await viewerPage.getByRole("button", { name: "Refresh" }).click();
await expect(viewerPage.getByText(name)).toBeVisible();
```

After:

```ts
const adminFoldersPage = new FoldersPage(adminPage);
const viewerFoldersPage = new FoldersPage(viewerPage);

await adminFoldersPage.createFolder(name);
await viewerFoldersPage.waitForPageLoad();
await viewerFoldersPage.refreshButton.click();
await expect(viewerFoldersPage.folderName(name)).toBeVisible();
```

Why:

- The after version keeps selectors and repeated interactions in the page object.
- The spec still owns the final visibility assertion.
- The scenario stays readable even with multiple authenticated pages.

## Examples In This Repo

- `ui/specs/login.spec.ts`
- `ui/specs/multi-role.spec.ts`
- `ui/pages/LoginPage.ts`
- `ui/pages/HomePage.ts`
- `ui/pages/FoldersPage.ts`
