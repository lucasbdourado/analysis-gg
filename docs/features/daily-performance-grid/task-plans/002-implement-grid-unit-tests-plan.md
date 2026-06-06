# Task Implementation Plan: Implement unit tests for DailyPerformanceGrid

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/daily-performance-grid/task-plans/002-implement-grid-unit-tests-plan.md`

## Task Reference

Task ID: `002-implement-grid-unit-tests`

Task file: `docs/features/daily-performance-grid/tasks/002-implement-grid-unit-tests.md`

Task status: `Depends on Previous Task` (Previous task `001` is `Implemented`)

## Feature Reference

Feature name: `daily-performance-grid`

Feature file: `docs/features/daily-performance-grid/feature.md`

Feature Tech Spec: `docs/features/daily-performance-grid/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/daily-performance-grid/tasks/002-implement-grid-unit-tests.md` | Goal, Scope, AC | Confirmed by source document | Primary task scope definition |
| Feature file | `docs/features/daily-performance-grid/feature.md` | Feature Completion Criteria | Confirmed by source document | Functional requirements |
| Feature Tech Spec | `docs/features/daily-performance-grid/tech-spec.md` | Proposed Technical Approach, Testing Strategy | Confirmed by source document | Technical design and test criteria |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Internal Technology Guidelines | Confirmed by source document | Testing stack selection (Vitest) |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Regras, Teste de componente | Confirmed by source document | Project-standard React testing rules |
| Sibling Tests | `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx` | Mock setups | Confirmed by codebase | Mock reference for Recharts / React Context |

## Planning Scope

This planning session is strictly limited to the creation of the component test suite `DailyPerformanceGrid.test.tsx` to validate empty states, chronological 30-day boundaries, date grouping, cell statuses, and tooltip text formatting. It does not authorize modifications to any application source code.

## Task Summary

Implement a comprehensive suite of unit/component tests in Vitest for the `DailyPerformanceGrid` component to guarantee the stability of its rendering, date window calculation, and outcome status mapping.

## Execution Eligibility

Status: Eligible

Reason:

- The dependency task `001-verify-layout-and-styling.md` is already marked as `Implemented` in `docs/STATE.md` and `docs/features/daily-performance-grid/tasks/001-verify-layout-and-styling.md`.

## Feature Context

The `DailyPerformanceGrid` component visualizes a player's match history over the last 30 active calendar days in a contribution-like grid. Because it processes timestamps and groups matches client-side, the unit test suite ensures that grouping, date calculation, outcome classification (win/loss/tie/none), and tooltips behave predictably.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Testing Strategy | Full | Yes | Covers unit tests for empty states, grouping, rolling window bounds, and tooltip strings. |
| Confirmed Technology Decisions | Full | Yes | Validates component using Vitest + React Testing Library. |

Coverage assessment:
- Justifying Tech Spec section: "Testing Strategy" (page 6, lines 187-195)
- Tech Spec sections implemented by this task: "Testing Strategy"
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React, Vite, TS | `technology-definition.md` | Code is written in TypeScript and uses React components. |
| Vitest + React Testing Library | `technology-definition.md` | The tests will run via Vitest runner using JSDOM environment. |
| CSS Modules | `technology-definition.md` | Test assertions check class lists mapping to mapped styles (e.g. `win`, `loss`). |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Component tests | Requires testing observable user-facing behavior, avoiding large snapshots, and using accessible Testing Library queries. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| CSS modules classes for cell states | `DailyPerformanceGrid.module.css` | Verifies that class names mapping to statuses are: `win`, `loss`, `tie`, `none`. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `DailyPerformanceGrid.tsx` | Component logic and `filteredMatches` consumption | Direct target of the tests | Understood custom date/tooltip generation rules. |
| `WeekdayWinRateChart.test.tsx` | Jest-like vi.mock configurations | Implementation reference | Shows how to configure Vitest environment for dashboard component testing. |

## Confirmed Scope

- Creation of `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.test.tsx`.
- Mocking the `useDashboard` hook to return controlled `filteredMatches` arrays for testing.
- Testing the empty state rendering when no matches are provided.
- Testing the rolling 30-day window boundaries ending on the date of the latest match.
- Testing local date grouping calculations to verify matches played on the same calendar day group together.
- Testing correct classification status mapping (`win`, `loss`, `tie`, `none`) and corresponding CSS class applications.
- Testing tooltip attribute text generation (`[Date]: [Wins]W - [Losses]L ([Record Status])`).

## Out of Scope

- Testing the actual visual layout rendering, margins, layout overflow, or responsive grid behavior (which was verified manually in Task 001).
- Writing integration tests mapping to the live Riot API or backend Spring Boot cache.

## Proposed Implementation Approach

1. **Mocking `useDashboard`**:
   We will mock `useDashboard` from `../context/DashboardContext` using:
   ```typescript
   import { useDashboard } from '../context/DashboardContext';
   vi.mock('../context/DashboardContext', () => ({
     useDashboard: vi.fn(),
   }));
   ```
   This allows us to dynamically alter `filteredMatches` for each test case without worrying about default context limits (e.g. slicing to `activeRange` which defaults to 20).

2. **Timezone-Independent Date Generation**:
   We will construct mock matches using local time dates instantiated at midday (e.g. 12:00:00) using:
   ```typescript
   const createMockMatch = (date: Date, win: boolean): MatchSummary => ({
     matchId: `test-${Math.random()}`,
     gameCreation: date.getTime(),
     win,
     // mock fields...
   });
   ```
   This guarantees that the day borders do not shift during local/UTC testing runtime.

3. **Dynamic Formatting Assertions**:
   To ensure tooltips are evaluated correctly in different test environment locales, we will construct the expected formatted dates dynamically using the same options object as the component:
   ```typescript
   const expectedFormat = (date: Date) => date.toLocaleDateString(undefined, {
     month: 'short',
     day: 'numeric',
     year: 'numeric',
   });
   ```

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.test.tsx` | Create | Confirmed | Task Scope | New unit/component test suite |

## Implementation Steps

1. **Setup test file**: Create `DailyPerformanceGrid.test.tsx` under components directory.
2. **Import packages**: Import React, Testing Library, Vitest features, `DailyPerformanceGrid` component, and types.
3. **Configure mocks**: Set up the `useDashboard` Vitest mock implementation.
4. **Implement test helpers**: Create the timezone-safe match generator.
5. **Empty State Test**:
   - Return empty `filteredMatches` from mock.
   - Assert "No match records to display." is rendered.
6. **Chronological 30-Day Window Test**:
   - Provide a match list.
   - Verify that the grid renders exactly 30 cells.
   - Verify that the last cell corresponds to the date of the latest match, and the first cell corresponds to 29 days prior.
7. **Date Grouping Test**:
   - Provide multiple matches on the same day.
   - Check that they are accumulated under the same day cell.
8. **Cell Status/Class Test**:
   - Write tests injecting different records:
     - 2 wins, 0 losses -> status class `win`.
     - 0 wins, 2 losses -> status class `loss`.
     - 1 win, 1 loss -> status class `tie`.
     - 0 games -> status class `none`.
9. **Tooltip Content Test**:
   - Check that cells have the correct `data-tooltip` attribute value matching the required formats:
     - Mapped day with games: `Jun 6, 2026: 2W - 1L (Winning Day)` (with dynamically generated date format).
     - Mapped day with no games: `Jun 5, 2026: No games played`.
10. **Validation**: Execute `npm run test` or Vitest test runner locally to verify that all test cases compile and pass.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `DailyPerformanceGrid.test.tsx` is created | File created under correct path | Visual validation of file path |
| Unit test verifying empty state rendering | Included in suite (test 1) | Passing test output in console |
| Unit test verifying chronological 30-day window bounds | Included in suite (test 2) | Passing test output in console |
| Unit test verifying correct grouping and status calculation (`win`, `loss`, `tie`, `none`) | Included in suite (tests 3 & 4) | Passing test output in console |
| Unit test verifying tooltip content accuracy | Included in suite (test 5) | Passing test output in console |
| Vitest executes and passes all tests in `DailyPerformanceGrid.test.tsx` | Runs during task validation | Vitest CLI execution output |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `DailyPerformanceGrid.test.tsx` | Unit / Component | Ensure component logic, grouping, calendar windowing, and tooltips are robust. | Uses `@testing-library/react` and `vitest`. |
| Vitest Run | CLI validation | Verify all tests pass successfully in runner. | Run command in terminal. |

## Dependencies

- **`001-verify-layout-and-styling.md`**: Completed and verified. No remaining layout blocking issues.

## Risks and Edge Cases

- **Timezone boundary shifts**: Mitigated by specifying local midday dates for the mock creation, avoiding midnight timezone rolls.
- **Dynamic localized date format**: Mitigated by dynamically generating expected assertion dates with `.toLocaleDateString(undefined, { ... })` within the test body rather than hardcoding static locale strings.
- **CSS Module class name overrides**: Mitigated by verifying that classes are appended to the cell using container selectors or checking for existence in the element class list.

## Rollback or Recovery Notes

- Since this task only introduces a new test file (`DailyPerformanceGrid.test.tsx`), rollback involves deleting that file, leaving the component code completely untouched.

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

- Do not modify any application code in `DailyPerformanceGrid.tsx`.
- Mock `useDashboard` at the top of the test file using `vi.mock`.
- Make sure to instantiate dates with midday times `(12, 0, 0, 0)` to ensure timezone robustness.
- Use `data-tooltip` query selector or `data-tooltip` attributes check to assert tooltip values.
