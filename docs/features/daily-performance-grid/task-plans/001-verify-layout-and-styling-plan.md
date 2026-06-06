# Task Implementation Plan: Verify layout and styling for DailyPerformanceGrid

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/daily-performance-grid/task-plans/001-verify-layout-and-styling-plan.md`

## Task Reference

Task ID: `001-verify-layout-and-styling`

Task file: `docs/features/daily-performance-grid/tasks/001-verify-layout-and-styling.md`

Task status: `Ready`

## Feature Reference

Feature name: `daily-performance-grid`

Feature file: `docs/features/daily-performance-grid/feature.md`

Feature Tech Spec: `docs/features/daily-performance-grid/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/daily-performance-grid/tasks/001-verify-layout-and-styling.md` | All | Confirmed by source document | Planning scope definition |
| Feature file | `docs/features/daily-performance-grid/feature.md` | Expected Outcome, Scope | Confirmed by source document | Visual behavior expectations |
| Feature Tech Spec | `docs/features/daily-performance-grid/tech-spec.md` | Technical Goals, CSS & Tooltips | Confirmed by source document | CSS layout & formula reference |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Decisions | Confirmed by source document | Vanilla CSS Modules styling rule |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | Regras & CSS Modules | Confirmed by guideline | Avoid inline styles, reuse tokens |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Presentational & Container Components | Confirmed by guideline | Correct state/props separation |

## Planning Scope

This plan covers task `001-verify-layout-and-styling` only and does not authorize source code modification unless a visual, responsive, or styling defect is identified during verification.

## Task Summary

Verify that the existing `DailyPerformanceGrid` component and its styling module render a 30-day performance grid ending on the date of the latest match, apply correct HSL variables (emerald for wins, red for losses, gray for ties, transparent/none for no games), behave responsively (10-column layout), and display correct tooltip text and hover states.

## Execution Eligibility

Status: Eligible

Reason:

- The task has no dependencies and the target implementation files (`DailyPerformanceGrid.tsx` and `DailyPerformanceGrid.module.css`) are already present in the codebase.

## Feature Context

The Daily Performance Grid represents games played, wins, and losses on a daily calendar-like grid to help players visualize recent performance trends and hot/cold streaks.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes | Grouping mathematics and date windowing |
| Modules and Responsibilities | Full | Yes | Verifies `DailyPerformanceGrid` component and helpers |
| Data Contracts | Full | Yes | Validates `DayRecord` structure |
| State and Error Handling | Full | Yes | Verifies empty state fallback message |
| Compatibility and Migration Notes | Full | Yes | Verifies CSS Modules & grid template columns repeat layout |

Coverage assessment:

- Justifying Tech Spec section: `docs/features/daily-performance-grid/tech-spec.md#proposed-technical-approach`
- Tech Spec sections implemented by this task: `#proposed-technical-approach`, `#data-contracts`, `#state-and-error-handling`, `#compatibility-and-migration-notes`
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Component code format |
| Vanilla CSS Modules | `technology-definition.md` | Component styling encapsulation (`.module.css`) |
| React Context API | `technology-definition.md` | Consuming `filteredMatches` from `useDashboard()` |
| HSL Design Tokens | `index.css` | Using `--card-bg`, `--card-border`, `--accent-emerald`, `--error-red`, `--sans` |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS code | Ensures styling isolation and compliance with global variables |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | React structure | Guides validation of pure render states and prop immutability |

## Existing Decisions Reviewed

No existing feature, ADR, or architecture decision was relevant to this task besides `technology-definition.md`.

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx` | Code logic | Component implementation | Verification target |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.module.css` | Styles and selectors | Component styling module | Verification target |
| `src/main/frontend/src/index.css` | CSS Custom Properties | Global theme variables | Verify variable names compliance |

## Confirmed Scope

- Verify 30-day calendar rolling window: ensure it correctly groups matches ending on the day of the latest match.
- Verify timezone-safe date helper `getLocalDateString` and display formatter `formatDateLabel`.
- Verify cell color mappings: `win` (emerald), `loss` (error-red), `tie` (neutral gray), and `none` (transparent).
- Verify grid columns configuration (`grid-template-columns: repeat(10, 1fr)`) and aspect ratio.
- Verify fallback handling ("No match records to display.") when `filteredMatches` is empty.
- Verify tooltips content string format on hover.

## Out of Scope

- Writing Vitest tests for the component (handled in task `002-implement-grid-unit-tests.md`).
- Interlinking grid cells to match history details.

## Proposed Implementation Approach

1. Perform static analysis of `DailyPerformanceGrid.tsx` and `DailyPerformanceGrid.module.css` to verify calculations and CSS variables compliance.
2. (Optional) Run the frontend compiler/linter check to verify that the files compile without TS/ESLint errors.
3. If any discrepancies or bugs are found, apply minimal fixes to the files.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx` | Inspect / Modify | Confirmed | Task file | Main target component |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.module.css` | Inspect / Modify | Confirmed | Task file | Component CSS Module |

## Implementation Steps

1. Inspect `DailyPerformanceGrid.tsx` date-windowing logic to ensure it generates exactly 30 days chronologically ending at the date of the latest match.
2. Inspect date utility functions `getLocalDateString` and `formatDateLabel` to verify they avoid timezone shift anomalies.
3. Verify CSS classes mapping logic in `DailyPerformanceGrid.tsx`:
   - `wins > losses` maps to `win`
   - `losses > wins` maps to `loss`
   - `wins == losses` maps to `tie`
   - no games played maps to `none`
4. Inspect `DailyPerformanceGrid.module.css` to confirm that layout uses `grid-template-columns: repeat(10, 1fr)` and `.cell` has `aspect-ratio: 1` with `border-radius: 4px`.
5. Check CSS variables references (`var(--accent-emerald)`, `var(--error-red)`) match definitions in `src/main/frontend/src/index.css`.
6. Inspect tooltip text content format and absolute placement behaviors on hover.
7. Verify empty state fallback behavior.
8. Run frontend dev build or TS check if necessary to confirm clean compilation.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Component displays exactly 30 days ending on the day of latest match | Full | Review code logic in `DailyPerformanceGrid.tsx` lines 41-54 |
| Color classes map correctly to outcomes | Full | Review code logic in `DailyPerformanceGrid.tsx` lines 73-82 and CSS class bindings |
| CSS layout is responsive with a 10-column repeating grid | Full | Review `.grid` selector rules in `DailyPerformanceGrid.module.css` |
| Hover state tooltips are checked and display correctly | Full | Review tooltip strings and `.cell[data-tooltip]` pseudo-element styling |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Static code verification | Manual | Ensure compliance with the design spec, CSS variables, and layout properties | Completed during task planning |
| TS Compilation check | Static | Verify that no typescript compiler or ESLint errors are introduced | Check build if changes are made |

## Dependencies

- None.

## Risks and Edge Cases

- Viewport edge overflow: Tooltips on edge columns (like column 1 or column 10) could overflow the viewport bounds because they are absolute positioned with `white-space: nowrap`. Since cells are small, this is a low-impact risk.
- Empty states: Verified to fallback to "No match records to display." correctly when there are no matches.

## Rollback or Recovery Notes

- In case of source modification, use `git checkout` or `git restore` to revert frontend files to their original state.

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

- Ensure styling matches variables in `src/main/frontend/src/index.css`.
- Tooltip formatting must be exactly: `[Formatted Date]: [Wins]W - [Losses]L ([Status])` for played days, or `[Formatted Date]: No games played` for empty days.
- No source code changes are expected unless verification fails.
