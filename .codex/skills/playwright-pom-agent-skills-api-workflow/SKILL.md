---
name: playwright-pom-agent-skills-api-workflow
description: Maintain API services, API specs, shared fixtures, and auth/API session setup for the `playwright-pom-agent-skills` Playwright framework. Use when tasks touch api/services, api/specs, TestFixtures, auth token flows, role sessions, or route constants in the API automation layer.
---

# Playwright POM Agent Skills API Workflow

Maintain the API automation layer in a way that keeps tests explicit and services reusable.

## Use This Skill When

- Adding a new API scenario under `api/specs`.
- Updating request/response handling in `api/services`.
- Cleaning up raw API tests so they match the service/spec boundary conventions.
- Adjusting authenticated request-context behavior in `utils/fixtures/TestFixtures.ts`.
- Changing auth token flow or role bootstrap behavior.

## Follow These Rules

- Keep API services under `api/services`.
- Keep API specs under `api/specs`.
- Keep services assertion-free.
- Return raw `APIResponse` objects from services.
- Put assertions in specs, including negative scenarios.
- Use aliases such as `@api/*`, `@utils/*`, and `@config/*`.

## Inspect First

1. Identify the affected service, spec, fixture, and any auth/bootstrap file before editing.
2. Reuse an existing service method before adding a new one.
3. If the task changes credentials or token flow, inspect auth setup and fixture usage together.
4. If a route is involved, inspect `BaseApiService.routes` first.

## Decide What To Edit

- Edit a service when request construction, route usage, or response parsing changes.
- Edit a spec when the expected status, payload, or role-based behavior changes.
- Edit a fixture when authenticated request-context creation changes.
- Keep assertion logic out of services even when handling failure paths.

## New API Scenario Flow

1. Inspect a similar spec and any related service methods.
2. Reuse an existing authenticated fixture if one already matches the role.
3. Add or update the service method only if the request shape is new.
4. Keep all assertions in the spec body.
5. Register cleanup through the shared `cleanup` fixture as soon as the test has the created resource id.
6. Validate with the smallest relevant command set.

## Cleanup Raw API Tests

1. Treat direct request calls in specs as cleanup candidates when a service already owns that behavior.
2. Move request construction into services.
3. Keep assertions and negative-path expectations in specs.
4. Reuse route constants and authenticated fixtures before adding new helpers.
5. Keep the service reusable for both positive and negative scenarios.

## Update Existing API Flow

1. Identify whether the change belongs to route ownership, request shape, auth setup, or test expectation.
2. Update the service if the API contract changed.
3. Update the spec if only the expected behavior changed.
4. Keep failures explicit in specs for negative-role and invalid-input scenarios.
5. Avoid burying response validation inside helpers.

## Service Conventions

- Reuse route constants from `BaseApiService.routes`.
- Do not hardcode route strings in services or specs when a constant already exists.
- Keep per-service logging scoped via `logger.withScope(...)` through `BaseApiService`.
- Log request intent and response status, but do not add assertion logic.

Current repo examples:

- `AuthService.getAccessToken(username, password)` returns raw `APIResponse`
- `FoldersService` returns raw `APIResponse` values for `list`, `create`, and `remove`

## When To Load References

Load `references/api-boundaries.md` when the task is ambiguous about service/spec/fixture ownership or auth responsibilities.

## Finish Checklist

- Assertions remain in specs.
- Services still return raw `APIResponse` values.
- Persistent test data is registered with the shared `cleanup` fixture.
- Existing routes/constants/fixtures were reused where possible.
- Negative paths remain explicit in the spec.
- Validation matches the scope of the change.
