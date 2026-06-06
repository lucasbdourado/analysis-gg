# Task: Implement unit tests for DailyPerformanceGrid

## Status

Depends on Previous Task

## Task ID

002-implement-grid-unit-tests

## Feature

`docs/features/daily-performance-grid/feature.md`

## Source Documents

- `docs/features/daily-performance-grid/feature.md`
- `docs/features/daily-performance-grid/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create and pass comprehensive unit/component tests in Vitest for the `DailyPerformanceGrid` component.

## Context

A unit test file does not exist for `DailyPerformanceGrid.tsx`. To guarantee component stability, we must implement tests validating empty states, date groupings, rolling 30-day window boundaries, and tooltip content.

## Scope

- Create `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.test.tsx`.
- Mock `useDashboard` hook and `DashboardContext` to inject controlled `filteredMatches` arrays.
- Write a test for empty states: verifying the component renders "No match records to display." when no matches are provided.
- Write a test for chronological 30-day window boundaries: verifying that the component constructs a grid of exactly 30 cells ending on the calendar date of the user's latest played match.
- Write a test for grouping logic: verifying that days are grouped by local timezone date strings.
- Write a test for cell statuses: verifying that cells obtain correct statuses (`win`, `loss`, `tie`, `none`) and corresponding CSS class associations based on custom match outcomes.
- Write a test for tooltips: verifying that tooltip text formatted as `[Date]: [Wins]W - [Losses]L ([Record Status])` is correctly rendered in `data-tooltip` attributes.
- Ensure all tests pass successfully in the test runner.

## Out of Scope

- Testing visual styling layout or actual CSS rendering rules (handled via manual visual review in task `001`).

## Depends On

- `001-verify-layout-and-styling.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- Test file `DailyPerformanceGrid.test.tsx` is created and correctly implements tests for:
  - Empty state rendering.
  - Chronological 30-day rolling window bounds.
  - Correct grouping and status calculation (`win`, `loss`, `tie`, `none`).
  - Tooltip content accuracy.
- Running `npm run test` or Vitest executes and passes all tests in `DailyPerformanceGrid.test.tsx` successfully.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Run Vitest locally using the terminal testing commands. Verify that all test assertions execute and pass without errors.

## Risks

- Timezone shifts causing date mapping discrepancies between local/UTC test environments (mitigated by using clear date math independent of host timezones).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
