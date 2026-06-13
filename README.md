# Playwright POM Agent Skills (Playwright + TypeScript)

Playwright + TypeScript automation framework for UI and API testing with page objects, shared fixtures, reusable services, and AI-assistant guidance through AGENTS.md and local skills

## What This Repo Contains

This repository is the automation framework only.

It provides:

- UI automation using Page Object Model
- API automation using service classes
- shared multi-role fixtures for browser and API sessions
- linting, formatting, typechecking, reporting, and naming checks
- local `AGENTS.md` and `.codex/skills/` guidance for framework-aligned changes

## Prerequisites

Before running tests, make sure the target application is already running and reachable through the URLs configured in `config/test-config.json`.

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
  AGENTS.md
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

When you change URLs or credentials in `config/test-config.json`, re-run the most relevant validation commands.

Typical validation after config changes:

```bash
npm run test:list
npm test
```

## Framework Highlights

- Playwright project dependencies for reusable authenticated setup
- role-based shared fixtures in `utils/fixtures/TestFixtures.ts`
- route constants centralized in page and service base classes
- TypeScript path aliases for framework-local imports
- custom framework logger and custom reporter summary
- cleanup registration through the shared `cleanup` fixture

## Quality Tools

- ESLint uses `eslint.config.mjs`
- Prettier uses `.prettierrc.json` and `.prettierignore`
- `npm run check:naming` enforces framework naming conventions
- `utils/common/Logger.ts` provides the framework logger
- `utils/common/CustomReporter.ts` writes `test-results/framework-summary.json`

## Sample Specs

- `ui/specs/login.spec.ts`
- `ui/specs/multi-role.spec.ts`
- `ui/specs/files.spec.ts`
- `api/specs/health.spec.ts`
- `api/specs/rbac.spec.ts`

## Guidance

For detailed framework rules, naming conventions, ownership boundaries, config guidance, and validation defaults, see:

- `AGENTS.md`
- `.codex/skills/`
