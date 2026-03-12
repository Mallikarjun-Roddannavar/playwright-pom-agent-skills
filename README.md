# Playwright POM Agent Skills (Playwright + TypeScript)

Reusable framework for UI and API automation with role-based auth setup.

## Structure

```text
playwright-pom-agent-skills/
  api/
    services/
    specs/
  config/
    test-config.json
  ui/
    pages/
    setup/
    specs/
  utils/
    common/
    fixtures/
  playwright.config.ts
  package.json
  README.md
```

## Setup

```bash
cd playwright-pom-agent-skills
npm install
npx playwright install
```

## Config Model

This framework uses a single committed config source:

- `config/test-config.json`

That file is imported directly by the framework at runtime for:

- UI base URL
- API base URL
- role credentials for admin, editor, and viewer

If you need different values, edit `config/test-config.json` directly.

## Run

```bash
npm run test:list
npm test
npm run test:ui
npm run test:api
npm run test:debug
npm run report
npm run lint
npm run lint:fix
npm run check:naming
npm run format
npm run format:check
```

## Change Workflow

When you change test code:

```bash
npm test
```

When you change URLs or credentials:

1. Update `config/test-config.json`
2. Run tests again

```bash
npm test
```

When you want to inspect the test inventory without execution:

```bash
npm run test:list
```

## Quality Tools

- ESLint uses `eslint.config.mjs`
- `npm run check:naming` enforces framework file and config naming conventions
- Prettier uses `.prettierrc.json` and `.prettierignore`
- `utils/common/Logger.ts` provides the framework logger
- `utils/common/CustomReporter.ts` writes `test-results/framework-summary.json` after each run

## Project Dependencies Setup

This framework uses Playwright project dependencies (`setup -> ui/api`):

- `ui/setup/auth.setup.ts` creates `.auth/admin.json`, `.auth/editor.json`, and `.auth/viewer.json`
- `ui` and `api` projects depend on `setup` in `playwright.config.ts`

This aligns with Playwright project dependency guidance.

## Multi-Role

- Shared role-based browser, API, and cleanup fixtures: `utils/fixtures/TestFixtures.ts`

## Route Ownership

- UI routes are defined once in `ui/pages/BasePage.ts`
- API routes are defined once in `api/services/BaseApiService.ts`
- Specs and setup code should reuse those route constants instead of hardcoding endpoint or path strings

## Import Aliases

Use TypeScript path aliases for framework-local imports instead of deep relative paths.

- `@pages/*` -> `ui/pages/*`
- `@api/*` -> `api/*`
- `@utils/*` -> `utils/*`
- `@config/*` -> `config/*`

Examples:

```ts
import { LoginPage } from "@pages/LoginPage";
import { AuthService } from "@api/services/AuthService";
import { folderName } from "@utils/common/CommonUtils";
import config from "@config/test-config.json";
```

## Naming Conventions

Use these naming rules consistently across the framework:

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

## Playwright Best Practices Coverage

This framework currently follows these Playwright best practices:

- test isolation through fresh browser contexts and API request contexts per role
- setup project with project dependencies for reusable authenticated state
- resilient locator usage through page objects and explicit `data-testid` contracts
- web-first assertions in UI tests
- trace capture on first retry
- HTML reporting plus a custom reporter summary
- linting with ESLint
- typechecking with `tsc --noEmit`
- `@typescript-eslint/no-floating-promises` to catch missing `await` on async Playwright calls
- parallel execution for independent tests
- tests clean up the data they create so repeated runs do not leave backend residue or interfere with later scenarios
- cleanup registration is framework-managed through the shared `cleanup` fixture instead of suite-owned lifecycle code

This section lists only the best practices that are already implemented in the framework.

## Page Object Model Coverage

This framework currently follows these Page Object Model practices:

- page classes represent application pages in `ui/pages`
- selectors are centralized in page objects instead of being duplicated in specs
- reusable page actions such as navigation and form submission are encapsulated in page methods
- assertions remain in tests instead of page objects
- shared page behavior is centralized in `BasePage.ts`

This section describes the Page Object Model practices that are already implemented in the framework.

## Codex Guidance

This framework includes repo-local guidance for Codex:

- root `AGENTS.md` for framework-wide conventions
- shared role-based fixtures in `utils/fixtures/TestFixtures.ts`
- local skills under `.codex/skills/` for focused workflows:
  - `playwright-pom-agent-skills-ui-pom`
  - `playwright-pom-agent-skills-api-workflow`
  - `playwright-pom-agent-skills-quality-tooling`

These files are intended to help Codex follow the framework conventions already used in this repo, especially for page objects, API services, fixtures, logging, waits, and quality tooling.

## Codex Skill Evaluation

Use the prompts below to evaluate whether the local skills are improving change quality in this framework.
This benchmark covers new test creation, updates to existing tests, registration of cleanup for created test data, and cleanup of generated or raw tests into framework-compliant tests.

### How To Evaluate

1. Run the same prompt with and without an explicit skill mention when practical.
2. Compare the output against the checklist below, not just whether the task completed.
3. Add guidance to a skill only when the evaluation shows a repeat failure pattern.

#### Prompt Design Note

- Good benchmark prompt: states the task only, for example "Add a new UI negative test for invalid password."
- Weak benchmark prompt: states the task and also restates framework rules, for example "Add a new UI negative test for invalid password and keep selectors in page objects, assertions in specs, and reuse existing fixtures."
- The benchmark is stronger when the prompt is simple and the framework conventions come from `AGENTS.md`, skills, and references rather than from the prompt itself.

### Evaluation Checklist

- Architecture: selectors stay in page objects, assertions stay in specs, and API assertions stay out of services.
- Reuse: existing fixtures, services, routes, and page-object methods are reused before new ones are added.
- Selector hygiene: raw UI locators are not introduced in specs.
- Boundary discipline: fixture, page, spec, and service ownership remains clear.
- Naming and imports: aliases and repo naming conventions are preserved.
- Change scope: edits stay focused and avoid unrelated churn.
- Validation: the smallest relevant lint/typecheck/test commands are used.

### Sample Evaluation Prompts

These prompts are intentionally task-focused. They should not restate the framework conventions that the skills are supposed to supply.

#### UI / POM

- "Add a new UI test that verifies an editor can create a folder from the folders page and the new folder appears in the list."
- "Add a new UI negative test that verifies a login failure message for an invalid password."
- "Update an existing UI login test because the app now lands on a different page after successful sign-in."
- "Update an existing multi-role UI test because the folder list now requires an explicit refresh after create."
- "Add a new UI test for opening a folder and verifying its files screen."

#### API / Service Boundaries

- "Add a new API test that verifies an editor can create a folder and then list it."
- "Add a new API negative test for invalid credentials or missing token scenarios."
- "Update an existing RBAC API test because delete behavior changed from 200 to 204."
- "Update an existing API spec to validate a new response field on folders."
- "Add a new API test for viewer access to list folders."

#### Quality / Tooling

- "Update the framework so a new naming convention is enforced automatically."
- "Update framework docs and validation after a new shared route or config convention is introduced."
- "Add a small quality-tooling improvement for test authoring, such as a validation script or lint rule."

## Sample Specs

- `ui/specs/login.spec.ts`
- `ui/specs/multi-role.spec.ts`
- `api/specs/health.spec.ts`
- `api/specs/rbac.spec.ts`
