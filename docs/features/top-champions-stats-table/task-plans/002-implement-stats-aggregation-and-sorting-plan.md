# Task Implementation Plan: Refactor stats aggregation, KDA/CS formulas, and sorting logic

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/top-champions-stats-table/task-plans/002-implement-stats-aggregation-and-sorting-plan.md`

## Task Reference

Task ID: `002-implement-stats-aggregation-and-sorting`

Task file: `docs/features/top-champions-stats-table/tasks/002-implement-stats-aggregation-and-sorting.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `top-champions-stats-table`

Feature file: `docs/features/top-champions-stats-table/feature.md`

Feature Tech Spec: `docs/features/top-champions-stats-table/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/top-champions-stats-table/tasks/002-implement-stats-aggregation-and-sorting.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Scope for aggregation formulas and sorting mapping |
| Feature file | `docs/features/top-champions-stats-table/feature.md` | Feature Completion Criteria, Scope | Confirmed by source document | Target features and scope definition |
| Feature Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | Data Contracts, Proposed Technical Approach | Confirmed by source document | Details interfaces, formulas, KDA sorting helper and tie-breakers |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Dictates language/state choices (React TS, Context, Vanilla CSS) |
| Codebase File | `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Component Implementation | Confirmed by source document | Existing component structure, state hooks and rendering JSX |

## Planning Scope

Explain the exact boundary of this planning session. This plan covers one task only and does not authorize implementation.

This planning session is strictly scoped to Task 002. It covers the data aggregation structure, KDA ratio formulas (including Perfect KDA mapping), CS/min calculation rules, sorting execution using the dynamic `sortConfig` state (along with its secondary/tie-breaking fallbacks), and updating the JSX cell variables. It does not authorize editing codebase files yet.

## Task Summary

Refactor the champion stats data aggregation and sorting execution logic inside `useMemo` of `TopChampionsTable.tsx` to compute all metrics correctly, support interactive column sorting, resolve Perfect KDA sorting fairly, and display the expected stats formats.

## Execution Eligibility

Status: Eligible

Reason:

- Task 001 (`001-configure-interactive-sorting`) is already implemented (as documented in `docs/STATE.md` and `001-configure-interactive-sorting-execution.md`), meaning the sorting state hook and headers are interactive.

## Feature Context

The Top Champions Stats Table provides player metrics grouped per champion to help identify their strongest pool. This task executes the data pipeline itself, transforming raw filtered match arrays into a sorted list of aggregated performance items.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| 1. Data Aggregation | Full | Grouping matches by champion name and aggregating raw statistics | Covered |
| 2. Metrics Computation | Full | Calculation of Win Rate, CS/min, KDA ratio, Perfect KDA logic, and `kdaValue`/`csMin` sorting helpers | Covered |
| 4. Interactive Sorting State | Full | Sorting on aggregated list using active column headers and secondary/tie-breaker logic | Covered |
| Data Contracts: `ChampionStats` | Full | Adjust interface fields to include `kdaValue`, `isPerfectKda`, `kdaString`, `csMin`, and `csMinString` | Covered |

Coverage assessment:

- Justifying Tech Spec section: "Proposed Technical Approach" sections 1, 2, and 4.
- Tech Spec sections implemented by this task: Aggregation, Formulas, Sorting logic.
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Standard hooks (`useMemo`) are used to optimize performance and protect type-safety. |
| Vanilla CSS | `technology-definition.md` | Dynamic highlights (such as cyan for high win rates) will use standard CSS class bindings. |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React coding guidelines | `.agents/docs/architecture/react-coding-guidelines/` | React components | Dictates component styling, structure, and readability. |
| Performance guidelines | `.agents/docs/architecture/react-coding-guidelines/performance-guidelines.md` | React memoization | Guides the use of `useMemo` for heavy CPU tasks (aggregation + sorting) to avoid unnecessary executions. |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

```text
No existing feature, ADR, or architecture decision was relevant to this task.
```

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Current `useMemo` block and `ChampionStats` type. | Base component to refactor. | Currently has mock stats aggregation, hardcoded sorting by gamesPlayed/winRate, and lacks dynamic header-based sorting. |

## Confirmed Scope

List the work confirmed to be part of this task.

- Update the internal type interface `ChampionStats` in `TopChampionsTable.tsx` to match the exact schema.
- Accumulate raw totals (`wins`, `losses`, `kills`, `deaths`, `assists`, `totalCs`, `totalDurationSeconds`) per champion name from `filteredMatches`.
- Implement KDA calculation logic:
  - If `deaths === 0`: `isPerfectKda = true`, `kdaValue = kills + assists`, `kdaString = Perfect (${avgK.toFixed(1)}/0.0/${avgA.toFixed(1)})` (where `avgK = kills/gamesPlayed` and `avgA = assists/gamesPlayed`).
  - If `deaths > 0`: `isPerfectKda = false`, `kdaValue = (kills + assists) / deaths`, `kdaString = ${rawKda.toFixed(2)} (${avgK.toFixed(1)}/${avgD.toFixed(1)}/${avgA.toFixed(1)})`.
- Implement CS/min calculation logic:
  - `csMin = totalDurationSeconds > 0 ? totalCs / (totalDurationSeconds / 60) : 0`
  - `csMinString = csMin.toFixed(1)`
- Implement list sorting based on active `sortConfig.sortKey` and `sortConfig.sortDirection`:
  - Map `sortKey` to sorting variables (`championName`, `gamesPlayed`, `winRate`, `kdaValue`, `csMin`).
  - Handle direction cycling (`asc`/`desc`).
  - Break ties using secondary sorting by `gamesPlayed` descending, then `championName` ascending.
- Update table JSX elements to read `{champ.kdaString}` and `{champ.csMinString}`.

## Out of Scope

List related work that must not be done in this task.

- Adding champion portrait icons/static assets from Data Dragon CDN (Task 003).
- Styling updates like CSS pointers, transitions, and highlights (Task 004).
- Creating/updating unit tests in `TopChampionsTable.test.tsx` (Task 005).

## Proposed Implementation Approach

Describe the future implementation approach using only confirmed information.

1. **Type Adjustments**: Replace the existing `ChampionStats` interface in `TopChampionsTable.tsx` with the specified fields containing both numeric sorting values and display strings.
2. **Aggregation Refactor**: Update the `useMemo` aggregator logic to accumulate data and perform correct metric conversions, ensuring zero-death (Perfect) cases are caught.
3. **Sorting Implementation**: Build a flexible sorting function inside `useMemo` that evaluates `sortConfig.sortKey` and `sortConfig.sortDirection` dynamically. When values are equal, fallback to compare `gamesPlayed` (descending) and `championName` (ascending via `localeCompare`).
4. **JSX Remapping**: Swap output properties to ensure display strings are correctly rendered in table cells.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Modify | Confirmed | Codebase | Refactor stats aggregation, formulas, and sort execution |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. Open `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`.
2. Update the `ChampionStats` interface to match:
   ```typescript
   interface ChampionStats {
     championName: string;
     gamesPlayed: number;
     wins: number;
     losses: number;
     winRate: number;
     kills: number;
     deaths: number;
     assists: number;
     kdaValue: number;
     isPerfectKda: boolean;
     kdaString: string;
     csMin: number;
     csMinString: string;
   }
   ```
3. Inside the `useMemo` block:
   - Perform standard grouping/accumulation over `filteredMatches` to build raw stats.
   - Map each grouped entry into a `ChampionStats` object:
     - `gamesPlayed = wins + losses`.
     - `winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0`.
     - `avgK = kills / gamesPlayed`, `avgD = deaths / gamesPlayed`, `avgA = assists / gamesPlayed`.
     - If `deaths === 0`:
       - `isPerfectKda = true`
       - `kdaValue = kills + assists`
       - `kdaString = Perfect (${avgK.toFixed(1)}/0.0/${avgA.toFixed(1)})`
     - If `deaths > 0`:
       - `isPerfectKda = false`
       - `kdaValue = (kills + assists) / deaths`
       - `kdaString = ${rawKda.toFixed(2)} (${avgK.toFixed(1)}/${avgD.toFixed(1)}/${avgA.toFixed(1)})`
     - Calculate CS/min:
       - `csMin = totalDurationSeconds > 0 ? totalCs / (totalDurationSeconds / 60) : 0`
       - `csMinString = csMin.toFixed(1)`
4. Apply sorting logic on the mapped list:
   - Select sort properties `valA` and `valB` based on `sortConfig.sortKey`.
   - Implement comparison based on `sortDirection` ('asc' vs 'desc'):
     - If the sort properties differ:
       - For strings (e.g. `championName`), use `localeCompare`.
       - For numbers, return difference or standard `<`/`>` flags.
     - If the sort properties are equal, resolve the tie-breaker:
       - Compare `gamesPlayed` descending: `b.gamesPlayed - a.gamesPlayed`
       - If `gamesPlayed` is also equal, compare `championName` ascending: `a.championName.localeCompare(b.championName)`
5. Remove `// eslint-disable-next-line react-hooks/exhaustive-deps` if `sortConfig` is now actively referenced in the `useMemo` logic, ensuring there are no lint issues.
6. Replace output tags in the table JSX:
   - Line 185: `{champ.kda}` -> `{champ.kdaString}`
   - Line 187: `{champ.csMin}` -> `{champ.csMinString}`
7. Validate compilation and check for linter warnings:
   - Run `npm run build`
   - Run `npm run lint`

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Champion stats are calculated accurately from mock matches. | Aggregation calculates sums of wins, losses, kills, deaths, assists, creep score and duration. | Validated in Task 005 via unit test dashboard mock data checks. |
| Perfect KDA renders as "Perfect" with counts when deaths is 0. | KDA formatting uses conditional checks to produce `Perfect (X.Y/0.0/A.B)` when deaths = 0. | Validated in Task 005 unit tests checking JSX text assertions. |
| Sorting by KDA descending correctly places Perfect KDA champions with higher `kills + assists` at the top. | Perfect KDA `kdaValue` is calculated as `kills + assists`. Sorting descending on `kdaValue` orders them. | Validated in Task 005 unit tests sorting by KDA descending. |
| CS/min calculates to 1 decimal place and defaults to "0.0" when duration is 0. | CS/min calculation formats to 1 decimal place with `toFixed(1)` and defaults to `0` when duration is 0. | Validated in Task 005 unit tests checking CS/min strings. |
| Interactive table sorting is fully functional and uses correct tie-breaking logic. | Comparator handles asc/desc toggle and falls back to gamesPlayed desc then championName asc on equal values. | Validated in Task 005 unit tests checking header clicks and sorting outputs. |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `npm.cmd run build` | Compilation check | Ensure TypeScript and Vite assets build cleanly without type mismatch. | Running in frontend workspace |
| `npm.cmd run lint` | Lint check | Ensure ESLint rules are satisfied. | Running in frontend workspace |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- Dependency: Task `001-configure-interactive-sorting.md` must be completed (Satisfied: Status is `Implemented`).

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- **Division by zero in KDA**: Handled by detecting `deaths === 0` and treating as Perfect KDA.
- **Division by zero in CS/min**: Handled by detecting `totalDurationSeconds === 0` and defaulting `csMin` to `0` and `csMinString` to `"0.0"`.
- **High win rate tie-breaker**: Standardized fallback sorting (games played desc, then name asc) guarantees deterministic row order.

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- Revert the changes to the React component:
  `git checkout -- src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`

## Pending Decisions

```text
None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.
```

## Questions for the User

```text
None. All task-relevant questions have been answered.
```

## Decisions Created During Planning

```text
No local feature/task decisions were created during this planning session.
```

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

- Pay attention to `localeCompare` for `championName` strings to handle proper ascending/descending alphabetical sorting.
- Ensure that sorting fallback `gamesPlayed` desc and `championName` asc is always applied on any key when active values match.
- Since unit tests for this table will be written in Task 005, do not create or modify unit test files during this task.
