# Task Implementation Plan: Add Search Form Unit Tests

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-id-search-input/task-plans/005-add-search-form-unit-tests-plan.md`

## Task Reference

Task ID: `005`

Task file: `docs/features/riot-id-search-input/tasks/005-add-search-form-unit-tests.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `riot-id-search-input`

Feature file: `docs/features/riot-id-search-input/feature.md`

Feature Tech Spec: `docs/features/riot-id-search-input/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-id-search-input/tasks/005-add-search-form-unit-tests.md` | Entire document | Confirmed by source document | Primary source for task boundaries |
| Feature file | `docs/features/riot-id-search-input/feature.md` | Scope, Completion Criteria | Confirmed by source document | Context and completion requirements |
| Feature Tech Spec | `docs/features/riot-id-search-input/tech-spec.md` | Proposed Technical Approach, Testing Strategy | Confirmed by source document | Unit test coverage requirements |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Defines React + TS, Vitest, Testing Library, Vanilla CSS |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Entire document | Confirmed by source document | Best practices for React component tests |

## Planning Scope

This plan covers task 005 ("Add Search Form Unit Tests") under the `riot-id-search-input` feature. It outlines the environment configuration for Vitest/jsdom/Testing Library and details the test suite verifying component rendering, client-side input validation states, onBlur correction behaviors, and routing redirects. It does not authorize the direct modification of application source code.

## Task Summary

Configure Vitest execution environment, create a test setup file for `@testing-library/jest-dom`, add a test runner script to `package.json`, and implement a unit test suite verifying that the `SearchForm` component renders correctly, blocks and notifies users on empty or malformed inputs, and navigates correctly to the dashboard with query variables upon valid submissions.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `004-implement-region-selector-and-redirect.md` which has been fully completed and marked as `Implemented` in `STATE.md`.

## Feature Context

The `riot-id-search-input` onboarding flow requires strict format checking before submitting the search request. Writing these tests ensures that the user interface, error messages, focus-out validations, and redirection formatting work reliably across all edge cases without requiring manual verification of the browser state every time.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Testing Strategy | Full | Yes | Defines the required unit tests for form components and error messages |
| State and Error Handling | Full | Yes | Verifies validation behaviors (empty check, regex match, blur validation) |
| Integration Contracts | Full | Yes | Verifies `useNavigate` parameter encoding format |

Coverage assessment:
- Justifying Tech Spec section: `Testing Strategy` and `State and Error Handling`
- Tech Spec sections implemented by this task: `Testing Strategy` (Unit tests block)
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| **Vitest** | `technology-definition.md` | Standard testing runner used to execute tests. |
| **React Testing Library & @testing-library/jest-dom** | `technology-definition.md` | Used to render, interact, and assert elements in tests. |
| **jsdom** | `technology-definition.md` | Simulates a browser environment in Node for unit testing. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Unit/component tests | Enforces testing behavior instead of implementation details, using accessible query methods (`getByRole`, `getByLabelText`, etc.) and proper mocks. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Establishes testing stack dependencies (Vitest, RTL, jsdom). |
| User Decision on Vitest Setup | `docs/features/riot-id-search-input/decisions/005-vitest-setup.md` | Confirms setup file usage and package.json scripts configuration. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.tsx` | Target component | Code being tested | We must mock `useNavigate`, select elements, input values, and trigger form submit |
| `src/main/frontend/package.json` | Project configuration | Test runner script | Needs to have `"test": "vitest"` added to scripts block |
| `src/main/frontend/vite.config.ts` | Vite configuration | Test environment setup | Needs `test` key with `environment: 'jsdom'`, `globals: true`, and `setupFiles` |

## Confirmed Scope

- **Vitest Environment Configuration**:
  - Add `"test": "vitest"` script to `package.json`.
  - Add `test` config to `vite.config.ts` referencing a new test setup file.
  - Create global test setup `src/main/frontend/src/test/setup.ts` to import `@testing-library/jest-dom` and configure mock cleanups.
- **SearchForm Unit Test Suite**:
  - Create a test file `src/main/frontend/src/features/search/presentation/components/SearchForm.test.tsx`.
  - Test Case 1: Form elements (Riot ID input, region selector select, Analyze button) render correctly in default states.
  - Test Case 2: Submitting an empty field blocks navigation, logs warning, and displays `"Riot ID is required"`.
  - Test Case 3: Submitting an invalid Riot ID format (e.g. no `#` character, or spaces/invalid tag length) blocks navigation and displays `"Format must be Name#Tag"`.
  - Test Case 4: Blur focus-out validates malformed Riot ID format and shows error, but empty input on blur clears errors.
  - Test Case 5: Valid form submission clears errors, disables input fields, and triggers the `useNavigate` routing hook with encoded query parameters (e.g., `/dashboard?name=Hide%20on%20bush&tag=KR1&region=kr`).

## Out of Scope

- E2E testing using Playwright (already performed in task 004, not in scope of unit tests).
- Mocking or calling real Riot API endpoints.
- Verifying the responsive styles or visual layout configurations.

## Proposed Implementation Approach

1. Configure Vitest globally: Add test scripts, update `vite.config.ts`, and write the test setup file.
2. In `SearchForm.test.tsx`, mock `react-router-dom`'s `useNavigate` hook using Vitest's `vi.fn()`.
3. Render the `SearchForm` component inside test cases, wrapping it in a `<BrowserRouter>` (or memory router) if required by routing hooks.
4. Use standard React Testing Library commands (`screen.getByPlaceholderText`, `screen.getByRole`, etc.) and simulate user events (`userEvent.type`, `userEvent.click`, `fireEvent.blur`) to verify the interface behavior.
5. Verify assertions on both mock functions and the document DOM (e.g. check tooltips or error boundaries).

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/package.json` | Modify | Confirmed | Task Scope | Add the Vitest runner command to standard scripts |
| `src/main/frontend/vite.config.ts` | Modify | Confirmed | Task Scope | Add the `test` block to export configuration |
| `src/main/frontend/src/test/setup.ts` | Create | Confirmed | Task Scope | Setup file containing global testing imports |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.test.tsx` | Create | Confirmed | Task Scope | Form test suite containing unit tests |

## Implementation Steps

1. **Configure npm Test Script**:
   - Edit `src/main/frontend/package.json` to insert `"test": "vitest"` into the `"scripts"` dictionary.
2. **Configure Vitest in Vite**:
   - Edit `src/main/frontend/vite.config.ts`.
   - Add a `/// <reference types="vitest" />` comment at the top to secure typescript declarations.
   - Inside `defineConfig`, add:
     ```typescript
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.ts',
     }
     ```
3. **Create Test Setup File**:
   - Create `src/main/frontend/src/test/setup.ts`.
   - Add:
     ```typescript
     import '@testing-library/jest-dom';
     import { cleanup } from '@testing-library/react';
     import { afterEach } from 'vitest';

     afterEach(() => {
       cleanup();
     });
     ```
4. **Scaffold SearchForm Test File**:
   - Create `src/main/frontend/src/features/search/presentation/components/SearchForm.test.tsx`.
   - Add standard React, Vitest, and RTL imports.
5. **Mock the Navigation Hook**:
   - Mock `react-router-dom` using:
     ```typescript
     const mockNavigate = vi.fn();
     vi.mock('react-router-dom', () => ({
       ...vi.importActual('react-router-dom'),
       useNavigate: () => mockNavigate,
     }));
     ```
6. **Implement Render & Form Tests**:
   - Implement tests simulating empty submit, invalid format blur/submit, and valid submission navigation check.
7. **Run Tests locally**:
   - Execute `npm run test` or `npx vitest run` in the directory `src/main/frontend` and check results.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Unit tests cover all key execution paths (empty, invalid format, valid format). | Test cases written for empty inputs, invalid regex formats (e.g. no tagline, short tag), and valid input paths. | Vitest test execution output. |
| Mocks verify that the routing hook (`useNavigate`) is triggered with correctly formatted query paths. | Assertions verify `mockNavigate` is called with the formatted URL `/dashboard?name=Hide%20on%20bush&tag=KR1&region=kr`. | Vitest test execution output. |
| Test commands run and pass successfully in the test environment. | Set up script, config, and run command in the frontend root. | Console test output showing all tests passed successfully. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Run Vitest Suite | Unit | Verify that the implemented unit tests compile, run, and pass. | Execute `npm run test` or `npx vitest run` inside `src/main/frontend` |

## Dependencies

- Depends on Task 004 (`004-implement-region-selector-and-redirect.md` - Implemented).

## Risks and Edge Cases

- **React Router version discrepancies**: Mocking `useNavigate` can sometimes conflict depending on React Router's bundler behavior. *Mitigated by standard `vi.mock('react-router-dom')` override.*
- **CSS Module class resolution in test environment**: Vanilla CSS Modules may return empty class names in tests. *Mitigated by using accessible HTML element queries (by role/placeholder) instead of CSS class selectors.*

## Rollback or Recovery Notes

- Run `git checkout` on `package.json` and `vite.config.ts`, and delete the generated test setup and spec files.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Vitest Configuration & Script | `docs/features/riot-id-search-input/decisions/005-vitest-setup.md` | Documents the confirmed setup strategy for Vitest, setup file, and package scripts. |

## Task Planning Readiness Checklist

- [x] Task file reviewed.
- [x] Feature context reviewed.
- [x] Feature Tech Spec coverage verified.
- [x] Technology decisions reviewed.
- [x] Applicable guidelines reviewed.
- [x] Existing decisions reviewed.
- [x] Local codebase references checked when applicable.
- [x] Task dependencies checked.
- [x] Execution eligibility documented.
- [x] Blocking decisions resolved.
- [x] Local feature/task decisions documented when needed.
- [x] Architecture/global decisions routed to ADR or `resolve-architecture-blocker` when needed.
- [x] Implementation approach defined.
- [x] Acceptance criteria mapped.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

- Do not change actual `SearchForm.tsx` logic unless a test highlights a real defect in its implementation.
- Remember to run `npm run test` to verify everything is in order.
- Ensure that `mockNavigate` is cleared using `vi.clearAllMocks()` or `beforeEach` to prevent test contamination.
