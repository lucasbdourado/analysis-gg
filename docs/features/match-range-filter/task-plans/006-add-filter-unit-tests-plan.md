# Task Implementation Plan: Add Filter Unit Tests

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/match-range-filter/task-plans/006-add-filter-unit-tests-plan.md`

## Task Reference

Task ID: `006`

Task file: `docs/features/match-range-filter/tasks/006-add-filter-unit-tests.md`

Task status: `Depends on Previous Task` (Satisfied, 005 is Implemented)

## Feature Reference

Feature name: `match-range-filter`

Feature file: `docs/features/match-range-filter/feature.md`

Feature Tech Spec: `docs/features/match-range-filter/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/match-range-filter/tasks/006-add-filter-unit-tests.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Primary requirement source |
| Feature file | `docs/features/match-range-filter/feature.md` | Feature Goal, Completion Criteria | Confirmed by source document | Product/functional context |
| Feature Tech Spec | `docs/features/match-range-filter/tech-spec.md` | Testing Strategy | Confirmed by source document | Technical requirements for unit tests |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed frontend stack (React, Vitest) | Confirmed by source document | Stack constraints |
| React Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Rules, Component testing | Confirmed guideline | Testing best practices |

## Planning Scope

This planning session covers Task 006 only (adding Vitest unit tests for range filtering). It defines the scope of unit tests, the test files to create, the scenarios to cover, and validation commands. It does not authorize implementation.

## Task Summary

Create a test file `src/features/dashboard/presentation/context/DashboardContext.test.tsx` next to the dashboard context file, containing unit and integration tests for the dashboard context state, local slicing logic, and dynamic dropdown label rendering.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `005-optimize-widgets-memoization.md`, which is already marked as `Implemented` in its task file and in `docs/STATE.md`.
- All required inputs and configurations are ready.

## Feature Context

The range filter allows scoping dashboard analytics to the last 20, 50, or 100 matches. Slicing is performed client-side on the frontend via `DashboardContext`. Dynamic dropdown labels are formatted to show availability when fewer matches are present. Automated unit tests ensure this core logic behaves correctly and does not regress.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Testing Strategy | Full | Slicing and label formatting unit tests | Unit testing coverage requirements match the Tech Spec |

Coverage assessment:
- Justifying Tech Spec section: `Testing Strategy`
- Tech Spec sections implemented by this task: `Testing Strategy` (specifically "Unit: Verify slicing logic...", "Unit: Verify dropdown option label...", "Integration: Verify selecting new option...")
- Gaps between task and Tech Spec: None
- Dependencies not specified by the Tech Spec: None

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Component structure and syntax (TSX) |
| React Context API | `technology-definition.md` | Context under test |
| Vitest | `technology-definition.md` | Test runner and assertions framework |
| Testing Library (React) | `package.json` / Guidelines | Rendering components in test |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | React tests | Guide testing behavior rather than implementation details, using query roles, testing states, and clean mock setup. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Vanilla CSS & CSS Modules | `technology-definition.md` | Styles won't be tested but we need to mock or handle modules in components under test |

No other relevant decisions exist.

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` | Context implementation | Code to be tested | Defines `DashboardProvider`, `useDashboard` |
| `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.tsx` | Dropdown component | Logic to be tested | Contains option labels mapping |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.test.tsx` | Existing test file | Testing setup patterns | Shows imports, `vi.mock` usage, test structure |

## Confirmed Scope

- Creating a new test file: `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx`
- Writing test scenarios for `DashboardProvider` (slicing output lengths under different match counts: 0, 15, 35, 100, 120 matches).
- Writing test scenarios for `DashboardProvider` state changes (calling `setActiveRange` and verifying `filteredMatches` update).
- Writing test scenarios for `MatchRangeFilter` dropdown rendering, testing that option label builder formats strings like `"Last 50 (35 available)"` correctly.
- Ensuring `npm run test` or `npx vitest run` is used for validation.

## Out of Scope

- Testing Riot API backend proxies or endpoints.
- Integration tests involving backend databases or real server APIs.
- Playwright E2E browser automation.
- Styling changes or modifying the CSS files.

## Proposed Implementation Approach

1. Create the new test file `DashboardContext.test.tsx` inside the directory `src/main/frontend/src/features/dashboard/presentation/context/`.
2. Define a helper function to generate mock matches arrays of variable length.
3. Test 1: Verify the default state of `DashboardProvider` (defaults to activeRange = 20, correct slicing of raw data).
4. Test 2: Verify slicing logic under different sizes:
   - 0 matches: `filteredMatches` is empty.
   - 15 matches: `filteredMatches` contains all 15 matches (under all active ranges).
   - 35 matches: `filteredMatches` contains 20 matches when activeRange is 20, and 35 matches when activeRange is 50.
   - 120 matches: `filteredMatches` contains 20, 50, or 100 matches depending on selected activeRange.
5. Test 3: Verify context state transitions when calling `setActiveRange`.
6. Test 4: Verify dropdown labels formatting:
   - Render `DashboardProvider` and `MatchRangeFilter` together.
   - Query select options by role/testid and assert their texts.
   - Case A: 0 matches -> Displays "No matches available" and is disabled.
   - Case B: 15 matches -> Options are: "Last 20 (15 available)", "Last 50 (15 available)", "Last 100 (15 available)".
   - Case C: 35 matches -> Options are: "Last 20", "Last 50 (35 available)", "Last 100 (35 available)".
   - Case D: 120 matches -> Options are: "Last 20", "Last 50", "Last 100".
7. Test 5: Verify user interaction changes state:
   - Simulate user selecting a different option in the dropdown and verify that the context value updates.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx` | Create | Confirmed | Task file | Target unit test file |

## Implementation Steps

1. Create `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx`.
2. Import required packages (`@testing-library/react`, `vitest`, `React`, etc.).
3. Write the unit tests covering all expected scenarios described in the approach.
4. Run `npm run test` or `npx vitest run` inside the `src/main/frontend` directory to verify the tests execute and pass successfully.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| All written unit tests execute and pass successfully. | Covered by writing robust unit tests and executing the test runner. | Test execution console output showing all tests passing. |
| Test coverage includes 0 matches, fewer matches than filter limit, and more matches than filter limit. | Covered by tests passing 0, 15, 35, and 120 matches mock data. | Test cases verifying slice lengths in the test suite. |
| Dropdown label formatting logic is covered under multiple scenarios. | Covered by rendering `MatchRangeFilter` with varying match counts and asserting option texts. | Test cases verifying dropdown label strings in the test suite. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Vitest test execution | Unit / Integration | Run `npm run test` (or `npx vitest run`) to verify all frontend unit tests pass. | Done client-side inside the `frontend` folder. |

## Dependencies

- Previous task `005-optimize-widgets-memoization.md` must be completed (satisfied).
- Vite, Vitest, and testing library dependencies must be present in `package.json` (satisfied).

## Risks and Edge Cases

- Context provider mock: If we don't wrap components in `DashboardProvider`, they will throw. Our tests must properly wrap tested components in `DashboardProvider`.
- Types validation: Ensure mocked matches conform to the `MatchSummary` interface.

## Rollback or Recovery Notes

- Deleting the created test file `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx` restores the repository to its initial state.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

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

- Ensure you wrap `<MatchRangeFilter />` in `<DashboardProvider rawData={...}>` in the component tests.
- When generating mock matches, you only need to supply the properties required by the code under test or type definitions, or typecast a partial object to `MatchSummary`.
- Make sure to run `npm run test` to verify the execution.
