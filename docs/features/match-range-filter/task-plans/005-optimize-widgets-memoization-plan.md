# Task Implementation Plan: Optimize Widgets Memoization

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/match-range-filter/task-plans/005-optimize-widgets-memoization-plan.md`

## Task Reference

Task ID: `005`

Task file: `docs/features/match-range-filter/tasks/005-optimize-widgets-memoization.md`

Task status: `Depends on Previous Task` (Eligible for execution as Task 004 is Implemented)

## Feature Reference

Feature name: `match-range-filter`

Feature file: `docs/features/match-range-filter/feature.md`

Feature Tech Spec: `docs/features/match-range-filter/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/match-range-filter/tasks/005-optimize-widgets-memoization.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Focuses on hooking up widgets to DashboardContext and memoization |
| Feature file | `docs/features/match-range-filter/feature.md` | Feature Goal, Scope | Confirmed by source document | High level scope of the widgets and filter functionality |
| Feature Tech Spec | `docs/features/match-range-filter/tech-spec.md` | Proposed Technical Approach, State and Error Handling | Confirmed by source document | Maps data flow from Context to chart/grid/table widgets |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions, Charting, UI Styling | Confirmed by source document | Recharts, Vanilla CSS, and React Context confirmed |
| Recharts Reference | `docs/references/analysis-gg/technologies/recharts.md` | Usage Guidelines, Examples | Confirmed by source document | Code example for WeekdayChart component and tooltip |

## Planning Scope

This plan covers Task 005 only. It outlines the creation, integration, and performance optimization (memoization) of the dashboard widgets (WeekdayWinRateChart, DailyPerformanceGrid, TopChampionsTable) using the filtered match list from `DashboardContext`.

## Task Summary

Connect and build the three dashboard widgets (WeekdayWinRateChart, DailyPerformanceGrid, TopChampionsTable) to consume `filteredMatches` from `useDashboard()` and optimize their aggregation calculations using React `useMemo` hooks.

## Execution Eligibility

Status: Eligible

Reason:

- The dependency task `004-integrate-filter-into-dashboard.md` has been successfully implemented and the dashboard context provider successfully wraps the layout structure.

## Feature Context

To allow users to view their ranked statistics across different sample sizes (20/50/100 games), all statistics widgets on the dashboard must display computations based on the active range-filtered game list rather than the full raw dataset. Memoizing these calculations is vital to prevent lag and unnecessary computation overhead on parent re-renders.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Data Flow | Full | Yes | Context routes filtered data to Chart, Grid, and Table widgets |
| Proposed Technical Approach | Full | Yes | Details widget interactions with DashboardContext |
| Testing Strategy | Partial | No | Adding unit tests is deferred to Task 006 |

Coverage assessment:

- Justifying Tech Spec section: Proposed Technical Approach (Section 8.4, 8.5)
- Tech Spec sections implemented by this task: 8.5 (Context & State Management), 12 (Observability and Performance)
- Gaps between task and Tech Spec: The Tech Spec assumes these widgets already exist, but because the project is greenfield, they must be created from scratch.
- Dependencies not specified by the Tech Spec: `recharts` must be added to `package.json` dependencies.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Standard framework for creating components and hooks. |
| React Context API | `technology-definition.md` | Consuming `filteredMatches` and `activeRange` from `useDashboard()`. |
| Recharts | `technology-definition.md` | Drawing the Weekday Win Rate Bar Chart. |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Obsidian dark-themed components styled via `.module.css`. |
| React `useMemo` hooks | `technology-definition.md` | Wrapping calculations for daily performance, weekday grouping, and champion statistics accumulation. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Clean Code Guidelines | `.agents/docs/architecture/react-coding-guidelines/` | All widgets | Modularity, props definitions, clean separation |
| Performance Guidelines | `.agents/docs/architecture/react-coding-guidelines/performance-guidelines.md` | useMemo hooks | Defines when to use memoization for data aggregation loops |
| State Management | `.agents/docs/architecture/react-coding-guidelines/state-management.md` | Context consumption | Guides on consuming state without introducing side-effects |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS modules | Obsidian variable usage and modular layout styling |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| VerbatimModuleSyntax imports | N/A (State.md notes) | All type imports must use `import type { ... }` explicitly. |
| Obsidian Theme Variables | `src/main/frontend/src/index.css` | All components must use CSS variables like `var(--accent-cyan)`, `var(--card-bg)`, etc. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` | Layout and placeholders | Where the widgets will be mounted | Replace `placeholderWidget` section with real components |
| `src/main/frontend/package.json` | Dependencies list | Missing library validation | Recharts is not installed and must be added |

## Confirmed Scope

- Install `recharts` to frontend dependencies (using `--legacy-peer-deps` if peer conflicts arise due to React 19).
- Create `WeekdayWinRateChart` component:
  - Group matches by local day of the week (Sunday-Saturday).
  - Calculate win rate `(wins/totalGames) * 100` per day.
  - Wrap calculation logic in `useMemo` depending on `filteredMatches`.
  - Render a styled Recharts `BarChart` using HSL obsidian variables and a custom HTML hover Tooltip.
- Create `DailyPerformanceGrid` component:
  - Aggregate match outcomes (wins/losses) per calendar date (`YYYY-MM-DD`).
  - Sort dates chronologically.
  - Wrap computation in `useMemo` depending on `filteredMatches`.
  - Render a GitHub contribution-style grid with small square cells color-coded by win/loss results.
- Create `TopChampionsTable` component:
  - Group and accumulate match records per champion name.
  - Calculate games played, win rate %, average KDA, and average CS/min.
  - Sort by total games played descending.
  - Wrap computation in `useMemo` depending on `filteredMatches`.
  - Render a responsive HTML table.
- Replace the placeholder widget in `DashboardPage.tsx` with these three widgets organized in a responsive grid layout.

## Out of Scope

- Persisting filter values across page reloads.
- Implementing filters for dates or queue types.
- Adding Unit or Integration tests (covered in Task 006).

## Proposed Implementation Approach

1. Add `"recharts": "^2.15.0"` (or similar version) to `src/main/frontend/package.json` under dependencies.
2. Build the three widgets inside `src/main/frontend/src/features/dashboard/presentation/components/`.
3. Separate each component's styles into its corresponding `.module.css` file using the CSS variables from `index.css`.
4. Group dates using JavaScript native Date methods, taking caution to handle timezone conversions cleanly (e.g., standardizing on local date strings).
5. For calculations, ensure division-by-zero errors are prevented (e.g., if a champion or day has 0 games, or if deaths is 0, default KDA denominator to 1).
6. Connect all components to `useDashboard()` hook, destructure `filteredMatches`, and wrap calculations in `useMemo`.
7. Import and mount the widgets in `DashboardPage.tsx`.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/package.json` | Modify | Confirmed | N/A | Add `recharts` dependency |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx` | Create | Confirmed | Tech Spec | Recharts Weekday Chart component |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.module.css` | Create | Confirmed | Styling Guidelines | Obsidian CSS for chart |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx` | Create | Confirmed | Tech Spec | Contribution-style grid component |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.module.css` | Create | Confirmed | Styling Guidelines | Obsidian CSS for grid |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Create | Confirmed | Tech Spec | Champions aggregator table component |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css` | Create | Confirmed | Styling Guidelines | Obsidian CSS for table |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` | Modify | Confirmed | Context | Replace placeholder layout |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css` | Modify | Confirmed | Styling Guidelines | Adjust layout structure to fit widgets |

## Implementation Steps

1. **Install Dependencies**:
   - Add `"recharts": "^2.15.0"` (or similar) to `src/main/frontend/package.json`.
   - Run `npm install --legacy-peer-deps` (bypassing any React 19 peer constraints) to initialize the library.
2. **Build WeekdayWinRateChart**:
   - Create `WeekdayWinRateChart.tsx` and `WeekdayWinRateChart.module.css`.
   - Calculate weekday stats inside a `useMemo` hook using `filteredMatches`.
   - Build a custom tool-tip component styling it with Obsidian card variables.
   - Render a responsive `<ResponsiveContainer>` containing a `<BarChart>` mapping the calculated day win rates.
3. **Build DailyPerformanceGrid**:
   - Create `DailyPerformanceGrid.tsx` and `DailyPerformanceGrid.module.css`.
   - In `useMemo`, group matches by local date, calculating win/loss counts. Sort dates ascending.
   - Map dates to a calendar-style grid of cells color-coded by performance (green for win > loss, red for loss > win, dark grey for ties or no games).
4. **Build TopChampionsTable**:
   - Create `TopChampionsTable.tsx` and `TopChampionsTable.module.css`.
   - In `useMemo`, aggregate games, wins, kills, deaths, assists, minion count, and game duration per champion name.
   - Calculate Win Rate, average KDA, and average CS/min. Sort champions descending by total games played.
   - Render a styled CSS table listing the aggregated values.
5. **Integrate into Dashboard**:
   - Import `WeekdayWinRateChart`, `DailyPerformanceGrid`, and `TopChampionsTable` in `DashboardPage.tsx`.
   - Replace the `placeholderWidget` with the components organized in a layout grid (e.g. 2 columns for chart & calendar grid, full-width row below for champions).
   - Verify that all imports use `import type` where relevant for verbatimModuleSyntax compliance.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| All three target widgets calculate statistics based on the active range-filtered list. | Components consume `filteredMatches` from `useDashboard()` and display aggregated results. | Manual verification on dev server by changing ranges (20/50/100) and checking statistics values. |
| Calculations are wrapped in `useMemo` and do not execute unless the active filtered match list changes. | Wrappers for aggregation functions in all three widgets are configured with `[filteredMatches]` dependency array. | React profiling / log checking to verify calculations only execute on filter shifts. |
| Changing range dropdown filter instantly updates the statistics display in all widgets. | Context updates state and triggers re-renders which receive the sliced list. | Manual validation of real-time transition updates on UI. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| TypeScript check | Static | Ensure imports and verbatimModuleSyntax are valid | Run `npm run build` or `tsc` |
| Local dev server test | Manual | Verify visual responsiveness and dropdown state shifts | Run `npm run dev` and navigate to a player profile |
| Maven build validation | Integration | Confirm integration builds cleanly in Maven lifecycle | Run `mvn clean compile` from root directory |

## Dependencies

- Requires task `004` to be complete (Dashboard page wrapped in context provider and range filter dropdown mounted).

## Risks and Edge Cases

- **React 19 Recharts Peer Warnings**: Installing Recharts might throw package peer warnings in npm.
  - *Mitigation*: Ensure the run command uses `--legacy-peer-deps` or specify peer flag in npm configs.
- **Empty Datasets**: User profile contains 0 matches.
  - *Mitigation*: Ensure all calculation loops guard against empty lists, and display a "No matches found" message within each widget wrapper.
- **Divide-by-zero KDA errors**: Standard KDA calculation `(K+A)/D` fails if deaths is 0.
  - *Mitigation*: Cap deaths at `Math.max(1, deaths)` when calculating KDA.
- **Timezone shifts on Daily Calendar**: Matching days using standard UTC vs local browser dates can skew calendar grids.
  - *Mitigation*: Group dates using a consistent format (`new Date(Creation).toLocaleDateString()`) mapping to local browser timezone.

## Rollback or Recovery Notes

- In case of styling breakage, restore `DashboardPage.tsx` and `DashboardPage.module.css` back to the post-Task 004 commit state.

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

- Do not write custom logic inside loops that could cause infinite renders.
- Ensure type imports follow verbatimModuleSyntax (e.g. `import type { MatchSummary } ...`).
- If npm install throws peer conflicts, use `npm install --legacy-peer-deps`.
