# Task: Align Sequential Day Ordering

## Status

Done

## Task ID

001-align-sequential-day-ordering

## Feature

`docs/features/weekday-win-rate-bar-chart/feature.md`

## Source Documents

- `docs/features/weekday-win-rate-bar-chart/feature.md`
- `docs/features/weekday-win-rate-bar-chart/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Align the weekday grouping and output sequence to start on Monday and end on Sunday (Monday to Sunday) in the `WeekdayWinRateChart.tsx` component.

## Context

The current `WeekdayWinRateChart.tsx` aggregates player matches client-side. However, it initializes its days array starting with 'Sunday' (index 0) through 'Saturday' (index 6) matching JavaScript's standard `date.getDay()`. The Tech Spec requires that the chart displays Monday through Sunday sequentially (Mon-Sun). We need to shift/reorder the final data array passed to Recharts to satisfy this layout requirement.

## Scope

- Modify the `weekdayData` `useMemo` block in `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.
- Shift or re-map the day array so that it contains Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday in that exact sequence before returning it to the chart.
- Ensure that mapping of `date.getDay()` index (0 for Sunday) is correctly aggregated into the Sunday slot, and Sunday is moved to the end of the array.

## Out of Scope

- Writing unit or component tests (handled in a separate task).
- Backend aggregation logic.
- Timezone selector dropdown or styling overrides of the chart beyond the day order.

## Depends On

None

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- The computed `weekdayData` array contains exactly 7 items.
- The order of `dayName` in the data fed to Recharts is: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
- Sunday games (`date.getDay() === 0`) are correctly counted in the Sunday object.
- Match win rates are accurately rounded using `Math.round((wins / total) * 100)` or default to 0 if total is 0.
- No compilation/transpilation errors exist.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep changes localized to the `weekdayData` mapping inside `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.
- For Sunday (index 0), ensure it maps to the last position in the sequential array (e.g. using `const sequentialDays = [...days.slice(1), days[0]]` or similar).

## Validation Notes

- Verify that the application builds and compile checks pass.
- Verify that the layout of the chart updates correctly in the UI.

## Risks

- Off-by-one errors in array slicing or day indexing where Sunday games might be mapped to the wrong day or lost.
- Redundant re-renders if the `useMemo` dependencies are altered incorrectly.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
