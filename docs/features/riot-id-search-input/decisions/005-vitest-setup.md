# Task Decision: Vitest Configuration & Setup File

## Status

Status: Confirmed

Last updated: 2026-06-06

Decision file: `docs/features/riot-id-search-input/decisions/005-vitest-setup.md`

## Task Reference

Task ID: `005`

Task file: `docs/features/riot-id-search-input/tasks/005-add-search-form-unit-tests.md`

Task plan file: `docs/features/riot-id-search-input/task-plans/005-add-search-form-unit-tests-plan.md`

Feature: `riot-id-search-input`

## Context

To run unit tests using Vitest and React Testing Library in this greenfield React project, the testing environment needs to be properly configured. Since no unit tests exist yet, this decision determines how the testing framework is initialized, how standard DOM matcher support (`@testing-library/jest-dom`) is imported, and how commands are executed.

## Decision Needed

What is the preferred approach for configuring Vitest, setting up `@testing-library/jest-dom` helper matchers, and defining the script execution entry point?

## Options Considered

| Option | Summary | Trade-offs |
| --- | --- | --- |
| **Option 1 (Chosen)** | Configure Vitest globally inside `vite.config.ts`, use a dedicated setup file `src/test/setup.ts` to import `@testing-library/jest-dom` globally, and add a `"test": "vitest"` script to `package.json`. | **Pros**: Clean, centralized configuration. Tests do not need boilerplate imports for custom matchers. Standard npm test runner works. <br>**Cons**: Minimal setup overhead. |
| **Option 2** | Import `@testing-library/jest-dom` manually in each spec file, configure Vitest directly in `vite.config.ts`, and run tests via `npx vitest` directly (without an npm script). | **Pros**: No separate setup file. <br>**Cons**: Duplicate imports in test files; harder for CI/CD runners to locate the test command script. |

## User Decision

Confirmed Option 1: Configure Vitest globally in `vite.config.ts`, use setup file `src/test/setup.ts` for `@testing-library/jest-dom`, and add the `"test"` script.

## Rationale

This approach provides a clean development experience, follows standard React Vite testing patterns, and makes the test suites easily maintainable for future feature testing since the DOM environment is set up globally.

## Impact

- `vite.config.ts` will declare Vitest globals and the `jsdom` environment.
- A new file `src/test/setup.ts` will run before all tests, initializing `@testing-library/jest-dom`.
- Running `npm run test` will initiate the Vitest runner.

## Date

Decision date: 2026-06-06

## Notes

None.
