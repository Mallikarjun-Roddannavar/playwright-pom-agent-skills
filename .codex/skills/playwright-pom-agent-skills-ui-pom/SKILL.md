---
name: playwright-pom-agent-skills-ui-pom
description: Maintain UI page objects, UI specs, and UI navigation flows for the `playwright-pom-agent-skills` Playwright framework. Use when tasks touch ui/pages, ui/specs, ui/setup, selector placement, navigation return types, or Page Object Model decisions for this repo.
---

# Playwright POM Agent Skills UI POM

Maintain the UI automation layer in a way that matches this repo's current conventions.

## Use This Skill When

- Adding a new UI scenario under `ui/specs`.
- Repairing or updating an existing UI flow.
- Cleaning up recorded or generated UI tests so they match the framework conventions.
- Creating or changing page-object methods, selectors, waits, or navigation returns.
- Adjusting UI auth/setup behavior in `ui/setup` or `utils/fixtures/TestFixtures.ts`.

## Follow These Rules

- Keep selectors in page objects under `ui/pages`.
- Keep assertions in specs under `ui/specs`.
- Do not add assertions to page objects.
- Prefer `data-testid` locators and explicit user-visible locators.
- Use aliases such as `@pages/*`, `@utils/*`, and `@config/*`.
- Keep shared page behavior in `ui/pages/BasePage.ts`.

## Inspect First

1. Identify the impacted spec, page object, and fixture or setup file before editing.
2. Reuse an existing page object and method before adding a new one.
3. If the task changes auth or role setup, inspect `ui/setup/auth.setup.ts` and `utils/fixtures/TestFixtures.ts`.
4. If the task changes navigation or route ownership, inspect `ui/pages/BasePage.ts` first.

## Decide What To Edit

- Edit a page object when selectors, interactions, readiness, or truthful navigation returns change.
- Edit a spec when the scenario, test data, or user-visible expectations change.
- Edit a fixture or setup file only when session creation, role bootstrap, or auth state behavior changes.
- Keep the change in the narrowest layer that actually owns the behavior.

## New UI Test Flow

1. Inspect a similar spec and the target page object.
2. Reuse existing fixture/page-object coverage before adding methods.
3. Add selectors only to the relevant page object.
4. Keep the spec readable and assertion-focused.
5. Register cleanup through the shared `cleanup` fixture as soon as the test has the created resource id.
6. Validate with the smallest relevant command set.

## Cleanup Generated Or Recorded UI Tests

1. Treat recorded code as raw input, not framework-ready output.
2. Move selectors and interactions into existing page objects first.
3. Keep assertions in the spec.
4. Reuse existing fixtures, routes, and navigation methods before adding new ones.
5. Create new page-object methods only when the scenario truly needs new reusable behavior.

## Update Existing UI Flow

1. Identify whether the breakage belongs to selector ownership, navigation flow, waits, setup, or test expectation.
2. Update the page object if the UI contract changed.
3. Update the spec if only the scenario expectation changed.
4. Avoid broad rewrites when a focused selector or method change is sufficient.
5. Recheck any affected return type so page-object navigation stays truthful.

## Page Object Return Types

Use these conventions consistently:

- Return `this` for guaranteed same-page navigation methods.
- Return another page object only when navigation is guaranteed.
- Return `Promise<void>` for ambiguous outcomes.

Current repo examples:

- `LoginPage.goto()` returns `this`
- `HomePage.goto()` returns `this`
- `LoginPage.login(...)` returns `HomePage`
- `LoginPage.loginExpectingFailure(...)` returns `void`
- `HomePage.openFolders()` returns `FoldersPage`
- `FoldersPage` intentionally has no `goto()`

## Navigation And Waiting

- Reuse route constants from `BasePage.routes`.
- Keep page-specific readiness in each page's `waitForPageLoad()`.
- Do not reintroduce a generic page-ready helper if the page already owns its load condition.
- Keep page logging lightweight: navigation start, wait start, wait complete.

## When To Load References

Load these only when the task needs more repo-specific detail:

- `references/testing-conventions.md` for selector ownership, waits, assertion placement, and fixture use.
- `references/page-object-decisions.md` for page-object boundaries and return-type choices.

## Finish Checklist

- Selectors remain in page objects.
- Assertions remain in specs.
- Raw `page.getBy...` usage was not added to specs.
- Existing page objects and fixtures were reused where reasonable.
- Persistent test data is registered with the shared `cleanup` fixture.
- New methods follow the current return conventions.
- Validation matches the scope of the change.
