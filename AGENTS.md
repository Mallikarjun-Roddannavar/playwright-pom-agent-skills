# AGENTS.md

This file applies to the entire `playwright-pom-agent-skills` framework.

## Purpose

Maintain this Playwright + TypeScript framework for UI and API automation practice. Follow Playwright best practices and Selenium-style Page Object Model guidance as adapted in this repo.

## Use The Local Skills

Use these local skills when their scope matches the task:

- `playwright-pom-agent-skills-ui-pom` for `ui/pages`, `ui/specs`, and UI navigation/page-object changes
- `playwright-pom-agent-skills-api-workflow` for `api/services`, `api/specs`, `utils/fixtures/TestFixtures.ts`, and auth/API session work
- `playwright-pom-agent-skills-quality-tooling` for `playwright.config.ts`, linting, formatting, typechecking, logging, waits, reporting, and README quality-tooling updates

## Framework Conventions

- Keep selectors in page objects. Do not add raw page selectors in specs.
- Keep assertions in tests. Do not add assertions inside page objects or API services.
- Keep API services assertion-free and return raw `APIResponse` values.
- Use TypeScript path aliases instead of deep relative imports:
  - `@pages/*`
  - `@api/*`
  - `@utils/*`
  - `@config/*`
- Use route constants from `ui/pages/BasePage.ts` and `api/services/BaseApiService.ts` instead of hardcoded paths.
- Use config from `config/test-config.json` as the single source of truth for base URLs, role credentials, and shared waits.
- Use `utils/common/Waits.ts` for framework wait and timeout values.
- Use `logger.withScope(...)` for scoped logging.

## Config Model

- The single committed config source is `config/test-config.json`.
- That file is the runtime source of truth for:
  - UI base URL
  - API base URL
  - role credentials for admin, editor, and viewer
  - shared wait values used by the framework
- If config values need to change, update `config/test-config.json` directly.
- Keep JSON config keys in `UPPER_SNAKE_CASE` to match the current framework model.
- The committed credentials are demo credentials intended for the sample app used with this framework.

## Naming Conventions

- Use `PascalCase` for page objects, services, fixtures, reporters, logger/waits helpers, and other exported class-style framework files.
- Keep file names aligned with their primary exported class or object name when applicable:
  - `LoginPage.ts` -> `LoginPage`
  - `FoldersService.ts` -> `FoldersService`
  - `CustomReporter.ts` -> `CustomReporter`
- Use `Base*` naming only for shared parent abstractions such as `BasePage.ts` and `BaseApiService.ts`.
- Use `camelCase` for methods, local variables, object properties, and locator fields.
- Keep spec files lowercase with the `.spec.ts` suffix, for example `login.spec.ts` and `multi-role.spec.ts`.
- Keep folder names lowercase and role-focused, for example `pages`, `services`, `specs`, `fixtures`, and `common`.
- Keep JSON config keys in `config/test-config.json` as `UPPER_SNAKE_CASE` to match the current config model.
- Keep alias names short and domain-based: `@pages/*`, `@api/*`, `@utils/*`, and `@config/*`.

## Page Object Rules

- Keep page objects in `ui/pages`.
- Keep shared page behavior in `ui/pages/BasePage.ts`.
- Let same-page navigation methods return `this` when the destination is guaranteed.
- Return a different page object only when navigation outcome is guaranteed.
- Keep ambiguous actions as `Promise<void>`.
- Current intentional flow:
  - `LoginPage.login(...)` returns `HomePage`
  - `LoginPage.loginExpectingFailure(...)` stays on `LoginPage`
  - `HomePage.openFolders()` returns `FoldersPage`
  - `FoldersPage` does not have a `goto()`

## Fixture Rules

- The shared fixture file is `utils/fixtures/TestFixtures.ts`.
- Browser fixtures are exposed as `adminContext`, `editorContext`, `viewerContext` and `adminPage`, `editorPage`, `viewerPage`.
- API fixtures are exposed as `adminRequest`, `editorRequest`, `viewerRequest`.
- The shared `cleanup` fixture lets tests register teardown work for any data they create.
- Tests instantiate the page objects or API services they need.
- Do not hide test intent by returning page objects or services directly from fixtures.

## Quality Tooling Rules

- Keep ESLint, Prettier, and `tsc --noEmit` green.
- Keep `@typescript-eslint/no-floating-promises` enabled.
- Keep the custom reporter at `utils/common/CustomReporter.ts`.
- If `npm run ...` fails in the Codex shell with the known Windows `EPERM` issue, use the local binaries directly from `node_modules/.bin`.

## Validation Defaults

After meaningful changes, prefer validating with the smallest relevant command set:

- naming: `node ./scripts/checkNamingConventions.mjs`
- lint: `./node_modules/.bin/eslint.cmd .`
- typecheck: `./node_modules/.bin/tsc.cmd --noEmit`
- format check: `./node_modules/.bin/prettier.cmd . --check`
- Playwright inventory: `./node_modules/.bin/playwright.cmd test --list`

Only run the full test suite when it is relevant to the change or the user asks for it.



