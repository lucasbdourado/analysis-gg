# Task: Add Weekday Win Rate Chart Tests

## Status

Done

## Task ID

002-add-weekday-win-rate-chart-tests

## Feature

`docs/features/weekday-win-rate-bar-chart/feature.md`

## Source Documents

- `docs/features/weekday-win-rate-bar-chart/feature.md`
- `docs/features/weekday-win-rate-bar-chart/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Add comprehensive unit and component tests for `WeekdayWinRateChart.tsx` to verify weekday aggregation, sorting, rounding, empty states, and tooltip rendering.

## Context

To ensure correctness and prevent regressions, we must implement unit and component tests. Recharts requires responsive sizing bounds that are not fully supported by `jsdom` out-of-the-box. We must mock Recharts components in Vitest to isolate calculation and rendering tests.

## Scope

- Create test file `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx`.
- Mock Recharts components using Vitest global/local mocks as specified in the Tech Spec.
- Write test cases validating:
  - Exact day extraction and grouping for varying timestamps.
  - Verification of the sequential sorting order (Monday to Sunday).
  - Proper rounding of win rate percentages (e.g. 1 win, 2 losses = 33%).
  - Graceful rendering of empty states when no matches are provided by `DashboardContext`.
  - Proper rendering and content of the custom tooltip.

## Out of Scope

- E2E browser tests using Playwright (handled in verification task 999).
- Testing dashboard page layout outside of this specific chart widget.

## Depends On

`001-align-sequential-day-ordering.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- All test cases run and pass under `npm run test` or `vitest`.
- Testing suite covers:
  - Empty state text verification ("No match records to display.").
  - Monday-first and Sunday-last sorting verification.
  - Rounding logic correctness.
  - Hover tooltip content matching `Win Rate: X% (YW - ZL)` or `No games played`.
- No SVG / ResizeObserver / layout errors are thrown by Recharts components during test execution due to mocking.

## Implementation Notes

- Follow the testing guidelines in `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md`.
- Use the Recharts mocking block defined in the Tech Spec to mock BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid.
- Leverage or adapt context mocking strategies similar to `DashboardContext.test.tsx`.

## Validation Notes

- Execute `npm run test` or `npx vitest run src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx` to verify test execution.

## Risks

- Brittle mock assertions if Recharts DOM output changes.
- Date/timezone testing differences on different runner environments. Date mocking or UTC based input generation should be used to make tests independent of runner local timezones.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
