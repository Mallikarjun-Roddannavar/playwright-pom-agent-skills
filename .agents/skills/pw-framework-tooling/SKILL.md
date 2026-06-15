---
name: pw-framework-tooling
description: Maintain framework-wide quality tooling, runtime configuration, waits, logging, reporting, and Playwright config for the `playwright-pom-agent-skills` Playwright framework. Use when tasks touch playwright.config.ts, package.json scripts, eslint/prettier/typecheck setup, waits, logger, custom reporter, or README sections about framework behavior.
---

# PW Framework Tooling

Maintain the framework infrastructure that supports test execution quality and developer workflow.

## Use This Skill When

- Changing `playwright.config.ts`, `package.json`, linting, formatting, typechecking, waits, logging, or reporting.
- Adding or updating validation scripts.
- Updating framework documentation about tooling or execution behavior.

## Covered Areas

- `playwright.config.ts`
- `package.json`
- `eslint.config.mjs`
- `tsconfig.json`
- `utils/common/Logger.ts`
- `utils/common/Waits.ts`
- `utils/common/CustomReporter.ts`
- `scripts/checkNamingConventions.mjs`
- framework README quality/tooling sections

## Follow These Rules

- Keep `config/test-config.json` as the single config source for base URLs, role credentials, and shared waits.
- Keep framework timeout derivation in `utils/common/Waits.ts`.
- Keep scoped logging via `logger.withScope(...)`.
- Keep the custom reporter at `utils/common/CustomReporter.ts`.
- Keep ESLint, Prettier, and `tsc --noEmit` working together.
- Keep `@typescript-eslint/no-floating-promises` enabled.
- Keep `npm run check:naming` passing for framework naming rules.

## Inspect First

1. Identify the smallest set of tooling files that own the behavior.
2. Check whether the change is configuration, validation, runtime helper, or documentation.
3. Reuse an existing script or helper before adding a new one.
4. Keep claims in docs limited to what the framework actually implements.

## Preferred Change Order

1. Change configuration or shared helper logic first.
2. Change scripts next if deterministic enforcement is needed.
3. Update documentation last so it reflects the final behavior.
4. Avoid spreading the same rule across multiple files unless each layer truly needs it.

## Validation Workflow

Prefer direct local binaries if `npm run` is unreliable in the AI shell:

- `node ./scripts/checkNamingConventions.mjs`
- `./node_modules/.bin/eslint.cmd .`
- `./node_modules/.bin/tsc.cmd --noEmit`
- `./node_modules/.bin/prettier.cmd . --check`
- `./node_modules/.bin/playwright.cmd test --list`

Run the smallest set that proves the change.

## Finish Checklist

- The change is centralized in the narrowest responsible tooling layer.
- Validation scripts and config still agree with each other.
- Documentation claims only what is currently implemented.
- The minimal relevant validation commands were run or explicitly skipped.
