# Task Implementation Plan: Align Sequential Day Ordering

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/weekday-win-rate-bar-chart/task-plans/001-align-sequential-day-ordering-plan.md`

## Task Reference

Task ID: `001-align-sequential-day-ordering`

Task file: `docs/features/weekday-win-rate-bar-chart/tasks/001-align-sequential-day-ordering.md`

Task status: `Ready`

## Feature Reference

Feature name: `weekday-win-rate-bar-chart`

Feature file: `docs/features/weekday-win-rate-bar-chart/feature.md`

Feature Tech Spec: `docs/features/weekday-win-rate-bar-chart/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/weekday-win-rate-bar-chart/tasks/001-align-sequential-day-ordering.md` | Entire file | Confirmed by source document | Primary scope definition |
| Feature file | `docs/features/weekday-win-rate-bar-chart/feature.md` | Entire file | Confirmed by source document | Goal and Completion Criteria |
| Feature Tech Spec | `docs/features/weekday-win-rate-bar-chart/tech-spec.md` | Proposed Technical Approach, Data Flow, Validation Rules | Confirmed by source document | Outlines the rotation array strategy |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Confirmed stack: React + Vite + TS, Recharts, Vanilla CSS |

## Planning Scope

This planning session covers task `001-align-sequential-day-ordering` only. It defines the implementation steps and validation strategy for updating the day sequence in the frontend bar chart component. It does not authorize implementation or modifying source code.

## Task Summary

Align the weekday grouping array returned to Recharts in `WeekdayWinRateChart.tsx` to display days sequentially from Monday to Sunday (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) instead of JavaScript's native Sunday to Saturday ordering.

## Execution Eligibility

Status: Eligible

Reason:

- The task has no dependencies (`Depends On: None`).
- All required inputs (feature.md, tech-spec.md, technology-definition.md) are complete and confirmed.
- Codebase scaffolding exists and the target component `WeekdayWinRateChart.tsx` is ready for the change.

## Feature Context

The `WeekdayWinRateChart` component displays the player's win rate per day of the week to highlight behavioral patterns. Standard JS `Date.getDay()` returns `0` for Sunday and `6` for Saturday. To present an intuitive Monday-to-Sunday layout, we must re-order the aggregated days before passing them to the charting engine.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Data Flow & Timezone Conversion | Full | Yes | Implements Sunday mapping/rotation logic to output Monday-Sunday sequentially |
| Validation Rules | Full | Yes | Applies win rate percentage rounding formula |
| State and Error Handling | Partial | No | Empty state and tooltip details already exist; this task only reorders the list |

Coverage assessment:

- Justifying Tech Spec section: `Data Flow & Timezone Conversion` (lines 96-117)
- Tech Spec sections implemented by this task: `Data Flow & Timezone Conversion`
- Gaps between task and Tech Spec: None. The suggested rotation `[...days.slice(1), days[0]]` aligns perfectly with the Tech Spec guidelines.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Component is written in TypeScript and TSX |
| Recharts | `technology-definition.md` | Composable charting library used to render the bar chart |
| Vanilla CSS | `technology-definition.md` | Styles applied via CSS Modules |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | React Component | Structure of `WeekdayWinRateChart` component |
| Performance Guidelines | `.agents/docs/architecture/react-coding-guidelines/performance-guidelines.md` | useMemo hooks | Wrapping reordering inside the existing `useMemo` block |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Confirmed Technology Stack | `docs/architecture/analysis-gg/technology-definition.md` | Ensures React Context and Recharts are utilized correctly |

No other feature, ADR, or architecture decisions are relevant.

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx` | Entire file | Target file for modifications | Checked `weekdayData` useMemo block and return array structure |

## Confirmed Scope

List the work confirmed to be part of this task.

- Modifying `weekdayData` inside `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.
- Moving Sunday (originally index 0 in the days mapping) to the end of the days array so the sequence is Monday to Sunday.
- Ensuring win rate calculation uses `Math.round((wins / total) * 100)` or 0 if total is 0 (already implemented, but must verify it is preserved).

## Out of Scope

List related work that must not be done in this task.

- Modifying styling or layout CSS.
- Implementing test files (handled in a separate task `002-add-weekday-win-rate-chart-tests.md`).
- Changing backend endpoints or data parsing.

## Proposed Implementation Approach

Describe the future implementation approach using only confirmed information.

1. Open `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.
2. Inspect the `useMemo` block for `weekdayData`.
3. In the return value of `useMemo`, instead of returning the mapped `days` array directly, rotate/slice the array to place Sunday (the first element, index 0) at the end of the list:
   ```typescript
   const dayDataList = days.map(day => {
     const total = day.wins + day.losses;
     const winRate = total > 0 ? Math.round((day.wins / total) * 100) : 0;
     return {
       ...day,
       winRate,
     };
   });
   return [...dayDataList.slice(1), dayDataList[0]];
   ```
4. Verify that no TypeScript or compilation errors occur.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx` | Modify | Confirmed | Task file | Localized modification within `useMemo` |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. Locate the `weekdayData` `useMemo` block in `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.
2. Modify the return statement of `weekdayData` `useMemo` to return the reordered array where Sunday is moved to the end:
   ```typescript
   const dayDataList = days.map(day => {
     const total = day.wins + day.losses;
     const winRate = total > 0 ? Math.round((day.wins / total) * 100) : 0;
     return {
       ...day,
       winRate,
     };
   });

   return [...dayDataList.slice(1), dayDataList[0]];
   ```
3. Run `npm run build` or the corresponding compile step inside `src/main/frontend` to verify that there are no compilation or typescript errors.

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| The computed `weekdayData` array contains exactly 7 items | Full | Computed array length is checked in component tests and manual inspection |
| The order of `dayName` in the data fed to Recharts is: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday | Full | Array reordering puts Sunday at the end, starting with Monday |
| Sunday games (`date.getDay() === 0`) are correctly counted in the Sunday object | Full | Sunday is index 0 in `days` array during aggregation, which is preserved and moved |
| Match win rates are accurately rounded using `Math.round((wins / total) * 100)` or default to 0 | Full | Math.round calculation is applied and verified |
| No compilation/transpilation errors exist | Full | Verified by running frontend builds |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Compile Check | Manual | Ensure no typescript or build errors are introduced | Run dev/build commands |
| Manual UI verification | Manual | Launch dashboard and verify that the Weekday Win Rate chart displays Monday through Sunday in order | Checked via browser |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- None.

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- **Off-by-one errors in rotation**: If we slice incorrectly (e.g. `slice(0)` instead of `slice(1)`), Sunday or Monday might be duplicated/omitted. Slicing with `1` and appending `dayDataList[0]` is safe because the original array has exactly 7 elements.

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- If any layout or functional regressions occur, discard modifications using `git checkout -- src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`.

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

Add concise handoff notes, source-reading reminders, sequencing constraints, and things the future `execute-task` agent must not assume.

- Be extremely careful to keep Sunday's aggregation at index 0 during the `forEach` iteration, and only perform the reordering slice-and-concat in the final return of `useMemo`.
- Ensure the day ordering remains Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
