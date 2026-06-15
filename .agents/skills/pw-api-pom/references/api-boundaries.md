# API Boundaries

Load this file only when an API task needs more detail about layer ownership.

## Ownership

- `api/services/*Service.ts` owns request building, route reuse, and response return values.
- `api/specs/*.spec.ts` owns assertions, negative scenarios, and role expectations.
- `utils/fixtures/TestFixtures.ts` owns shared authenticated browser and request-context creation.
- UI auth setup may still matter when a change affects shared credentials or role assumptions.

## Service Rules

- Return raw `APIResponse` values.
- Do not assert status or body inside services.
- Reuse `BaseApiService.routes` instead of hardcoded route strings.

## Fixture Rules

- The shared fixture file exposes `adminRequest`, `editorRequest`, `viewerRequest`, and `cleanup`.
- Tests instantiate the services they need.

## Auth Rules

- Credentials come from `config/test-config.json`.
- Invalid-user and negative-auth scenarios should be expressible from the spec layer.
- If token behavior changes, inspect both the service and any setup/bootstrap path that depends on it.

## Good And Bad Examples

### Service Assertions

Good:

```ts
const response = await authService.getAccessToken("admin", "wrong-password");
await expect(response.status()).toBe(401);
```

Bad:

```ts
async getAccessToken(username: string, password: string): Promise<APIResponse> {
  const response = await this.apiContext.post(BaseApiService.routes.token, {
    data: { username, password },
  });
  expect(response.ok()).toBeTruthy();
  return response;
}
```

Why:

- The good example keeps the service reusable for both success and failure scenarios.
- The bad example hides assertions inside the service and breaks negative-path testing.

### Route Ownership

Good:

```ts
const response = await adminRequest.get(BaseApiService.routes.health);
```

Bad:

```ts
const response = await adminRequest.get("/health");
```

Why:

- The good example reuses the shared route constant.
- The bad example duplicates route knowledge directly in the spec.

### Fixture Usage

Good:

```ts
const foldersService = new FoldersService(editorRequest);
const response = await foldersService.create(name);
```

Bad:

```ts
const response = await editorRequest.post("/folders", {
  data: { name },
});
```

Why:

- The good example keeps request construction in the service layer.
- The bad example bypasses the service and duplicates request details in the spec.

### Cleanup Registration

Good:

```ts
cleanup.add(async () => {
  await adminFoldersService.remove(created.id);
});
```

Bad:

```ts
const adminDelete = await adminFoldersService.remove(created.id);
expect(adminDelete.ok()).toBeTruthy();
```

Why:

- The good example keeps deletion in framework-managed teardown.
- The bad example mixes cleanup into the main scenario path.

### Before/After Service-Safe Test Update

Before:

```ts
// api/specs/rbac.spec.ts
const response = await editorRequest.post("/folders", {
  data: { name },
});
expect(response.status()).toBe(200);
```

After:

```ts
// api/specs/rbac.spec.ts
const foldersService = new FoldersService(editorRequest);
const response = await foldersService.create(name);
await expect(response.status()).toBe(200);
```

Why:

- The after version keeps request construction in the service and leaves assertions in the spec.

### Before/After API Negative Test Cleanup

Before:

```ts
const response = await adminRequest.post("/token", {
  data: { username: "admin", password: "wrong-password" },
});
expect(response.status()).toBe(401);
```

After:

```ts
const authService = new AuthService(adminRequest);
const response = await authService.getAccessToken("admin", "wrong-password");
await expect(response.status()).toBe(401);
```

Why:

- The after version keeps request construction in the service layer.
- The negative assertion remains in the spec where failure behavior is validated.
- The same service can still be reused for both valid and invalid credential scenarios.

## Examples In This Repo

- `api/specs/health.spec.ts`
- `api/specs/rbac.spec.ts`
- `api/services/AuthService.ts`
- `api/services/FoldersService.ts`
- `utils/fixtures/TestFixtures.ts`
