# Page Object Decisions

Load this file only when the main skill instructions are not enough to choose the correct layer or return type.

## Edit The Page Object When

- A selector changes.
- A reusable interaction changes.
- A route constant or navigation path changes.
- A page-specific readiness rule changes.

## Edit The Spec When

- The business expectation changes.
- The scenario data changes.
- The validation or negative expectation changes.

## Edit Fixtures Or Setup When

- Auth bootstrap changes.
- Role/session creation changes.
- Shared browser context behavior changes.

## Return Type Rules

- Return `this` when the action definitely stays on the same page.
- Return another page object when the destination is guaranteed.
- Return `void` when the outcome is intentionally ambiguous.

## Good And Bad Examples

### Where Should The Change Go?

Good:

- Login button test id changed: update `LoginPage.ts`.
- Success redirect changed from home to folders: update the affected page-object flow and any dependent spec expectations.
- Error message wording changed: update the spec assertion if the behavior is the same.

Bad:

- Login button test id changed: patch the selector directly in `login.spec.ts`.
- Shared folder-row interaction changed: duplicate a new click flow in every spec that uses it.
- Session/bootstrap issue: patch around it inside a single spec instead of fixing setup or fixture ownership.

### Return Types

Good:

```ts
async goto(): Promise<this> {
  await this.page.goto(BasePage.routes.login);
  await this.waitForPageLoad();
  return this;
}

async login(username: string, password: string): Promise<HomePage> {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  const homePage = new HomePage(this.page);
  await homePage.waitForPageLoad();
  return homePage;
}
```

Bad:

```ts
async login(username: string, password: string): Promise<LoginPage | HomePage> {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  return Math.random() > 0.5 ? this : new HomePage(this.page);
}
```

Why:

- Return `this` only when staying on the same page is guaranteed.
- Return another page object only when navigation is guaranteed.
- Avoid ambiguous unions for normal page-object flows in this repo.

### Assertions In Page Objects

Good:

```ts
async waitForPageLoad(): Promise<void> {
  await this.title.waitFor();
}
```

Bad:

```ts
async waitForPageLoad(): Promise<void> {
  await expect(this.title).toBeVisible();
}
```

Why:

- Page objects should wait for readiness, not assert business expectations.
- Assertions remain in specs in this framework.

## Current Repo Intent

- `LoginPage.login(...)` returns `HomePage`.
- `LoginPage.loginExpectingFailure(...)` returns `void`.
- `HomePage.openFolders()` returns `FoldersPage`.
- `FoldersPage` does not expose `goto()`.
