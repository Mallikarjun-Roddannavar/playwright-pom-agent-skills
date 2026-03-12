# Playwright POM Agent Skills (Playwright + TypeScript)

This repository demonstrates a Playwright + TypeScript automation framework designed for both maintainable test engineering and AI-assisted development.

It combines:

- Page Object Model for UI automation
- API and UI coverage in one framework
- `AGENTS.md` and local skills to guide AI coding assistants toward framework-aligned changes

## Repository Boundary

This repository is the automation framework only.

The application under test (AUT) is expected to exist in a separate backend/frontend repository and be running before you execute this framework.

This repo does not start or own the AUT codebase. It consumes the AUT through the URLs configured in `config/test-config.json`.

Before running tests, make sure:

- the AUT backend is running and reachable at the configured API base URL
- the AUT frontend is running and reachable at the configured UI base URL
- the configured demo users exist in the AUT

## Structure

```text
playwright-pom-agent-skills/
  .codex/
    skills/
  api/
    services/
    specs/
  config/
    test-config.json
  scripts/
  ui/
    pages/
    setup/
    specs/
    test-data/
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
npm run install:browsers
```


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
npm run typecheck
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
2. Re-run the most relevant validation commands

Typical validation after config changes:

```bash
npm run test:list
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
- Browser fixtures are exposed by role, for example `adminPage`, `editorPage`, and `viewerPage`
- API fixtures are exposed by role, for example `adminRequest`, `editorRequest`, and `viewerRequest`
- Data cleanup is registered through the shared `cleanup` fixture

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

Implemented in this framework:

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

## Page Object Model Coverage

Implemented in this framework:

- page classes represent application pages in `ui/pages`
- selectors are centralized in page objects instead of being duplicated in specs
- reusable page actions such as navigation and form submission are encapsulated in page methods
- assertions remain in tests instead of page objects
- shared page behavior is centralized in `BasePage.ts`


## AI Guidance

This repo includes local AI guidance to keep framework changes aligned with the existing structure and conventions.

- `AGENTS.md` defines repo-level rules
- `utils/fixtures/TestFixtures.ts` defines the shared role-based fixture surface
- `.codex/skills/` contains focused workflows for:
  - `playwright-pom-agent-skills-ui-pom`
  - `playwright-pom-agent-skills-api-workflow`
  - `playwright-pom-agent-skills-quality-tooling`

The expected outcome is simple: selectors stay in page objects, assertions stay in specs, fixtures and services are reused, and validation stays targeted.

## Skill Evaluation

Use short task-focused prompts to evaluate whether the local skills improve output quality.
Do not restate framework rules in the prompt; those should come from `AGENTS.md`, skills, and references.

### Quick Checklist

- selectors stay in page objects
- assertions stay in specs and API services remain assertion-free
- existing fixtures, routes, and helpers are reused before new ones are added
- alias imports and naming conventions are preserved
- edits stay focused
- the smallest relevant validation commands are used

### Sample Prompts

#### UI / POM

- "Add a new UI test that verifies an editor can create a folder from the folders page and the new folder appears in the list."
- "Add a new UI negative test that verifies a login failure message for an invalid password."
- "Update an existing UI login test because the app now lands on a different page after successful sign-in."

#### API / Service Boundaries

- "Add a new API test that verifies an editor can create a folder and then list it."
- "Add a new API negative test for invalid credentials or missing token scenarios."
- "Update an existing API spec to validate a new response field on folders."

#### Quality / Tooling

- "Update the framework so a new naming convention is enforced automatically."
- "Update framework docs and validation after a new shared route or config convention is introduced."
- "Add a small quality-tooling improvement for test authoring, such as a validation script or lint rule."

## Sample Specs

- `ui/specs/login.spec.ts`
- `ui/specs/multi-role.spec.ts`
- `ui/specs/files.spec.ts`
- `api/specs/health.spec.ts`
- `api/specs/rbac.spec.ts`





