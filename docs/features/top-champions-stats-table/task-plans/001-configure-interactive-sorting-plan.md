# Task Implementation Plan: Configure interactive sorting state and header click handlers

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/top-champions-stats-table/task-plans/001-configure-interactive-sorting-plan.md`

## Task Reference

Task ID: `001-configure-interactive-sorting`

Task file: `docs/features/top-champions-stats-table/tasks/001-configure-interactive-sorting.md`

Task status: `Ready`

## Feature Reference

Feature name: `top-champions-stats-table`

Feature file: `docs/features/top-champions-stats-table/feature.md`

Feature Tech Spec: `docs/features/top-champions-stats-table/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/top-champions-stats-table/tasks/001-configure-interactive-sorting.md` | Entire file | Confirmed by source document | Primary task source |
| Feature file | `docs/features/top-champions-stats-table/feature.md` | Scope, Completion Criteria | Confirmed by source document | Product/Feature context |
| Feature Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | 4. Interactive Sorting State | Confirmed by source document | Component design & state behavior |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Tech stack confirmation |
| React Coding Guidelines | `.agents/docs/architecture/react-coding-guidelines/` | component-guidelines.md, styling-guidelines.md | Confirmed by source document | Design rules |

## Planning Scope

This plan covers Task 001 only (configuring state, headers, click handlers, and active indicators) and does not authorize implementation or code modifications.

## Task Summary

Declare the React sorting state `sortConfig` and header click handlers in `TopChampionsTable.tsx` to cycle sorting directions, rendering direction arrow indicators next to the active sorted header.

## Execution Eligibility

Status: Eligible

Reason:

- The task has no dependencies (`Depends On: None`).
- The task status is `Ready`.

## Feature Context

The Top Champions Stats Table aggregates and displays player performance data per champion. Interactive header sorting is required to let users order champions by name or specific metrics.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach: 4. Interactive Sorting State | Full | State declaration, click handler cycling, header updates with indicators | Actual sorting execution on data array is out of scope (handled in Task 002) |

Coverage assessment:

- Justifying Tech Spec section: `4. Interactive Sorting State`
- Tech Spec sections implemented by this task: Setting up the `sortConfig` state, header interaction, and direction rendering.
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Strict type safety for state structures and props |
| Context API & useState | `technology-definition.md` | Local useState hooks to track sorting configuration |
| Vanilla CSS | `technology-definition.md` | Styling hooks via CSS module class names (`styles.sortIndicator`) |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Component design | No inline styling for interactive properties, use pure React state |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS Modules | Custom classes mapped to CSS modules; avoid Tailwind or ad-hoc overrides |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

```text
No existing feature, ADR, or architecture decision was relevant to this task.
```

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Component header DOM elements and hooks usage | Modifying this file to add sorting state, click triggers, and indicators | Component already exists and uses CSS modules |

## Confirmed Scope

List the work confirmed to be part of this task.

- Define type `SortConfig` mapping keys to `'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin'`.
- Declare state `sortConfig` in `TopChampionsTable.tsx` using React `useState`, defaulting to `winRate` and `desc`.
- Implement `handleSort(key)` click handler cycling logic:
  - New column clicked -> Set to active with default direction (alphabetical `championName` defaults to `asc`, numeric columns default to `desc`).
  - Active column clicked -> Toggle direction (e.g. `desc` -> `asc`).
  - Clicked again -> Reset to default sorting config (`winRate` desc).
- Update table headers (`<th>`) in JSX to trigger click handlers.
- Render visual direction indicators (▲/▼) wrapped in a styled `<span>` next to the active sorted header text.
- Include `sortConfig` in the `useMemo` dependency array of `championsData` to ensure reactive re-evaluation in subsequent tasks.

## Out of Scope

List related work that must not be done in this task.

- Implementing the sorting execution on the aggregated champions data array (handled in 002).
- Integrating portrait assets or fallback placeholders (handled in 003).
- Adding custom styling pointer cursors, hover backgrounds, or transitions in `TopChampionsTable.module.css` (handled in 004).
- Creating unit tests for sorting states (handled in 005).

## Proposed Implementation Approach

Describe the future implementation approach using only confirmed information.

1. Declare a type `SortConfig` for tracking state.
2. Initialize `sortConfig` using React `useState` at the top of the component.
3. Write `handleSort(key)` to implement the cycling behavior.
4. Implement a helper function `renderSortIndicator(key)` to render a span wrapper containing the arrow symbol.
5. Bind headers to `onClick` handlers.
6. Pass `sortConfig` to the `championsData` `useMemo` hook dependencies.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Modify | Confirmed | Task & Tech Spec | File contains the React component to update |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps. Do not include executable steps when the plan is blocked by a required ADR or architecture/global decision.

1. Define `SortConfig` interface in `TopChampionsTable.tsx`:
   ```typescript
   interface SortConfig {
     sortKey: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin';
     sortDirection: 'asc' | 'desc';
   }
   ```
2. Inside `TopChampionsTable` component, declare state:
   ```typescript
   const [sortConfig, setSortConfig] = React.useState<SortConfig>({
     sortKey: 'winRate',
     sortDirection: 'desc',
   });
   ```
3. Implement `handleSort` function:
   ```typescript
   const handleSort = (key: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin') => {
     const isCurrent = sortConfig.sortKey === key;
     if (!isCurrent) {
       const defaultDirection = key === 'championName' ? 'asc' : 'desc';
       setSortConfig({ sortKey: key, sortDirection: defaultDirection });
     } else {
       const defaultDirection = key === 'championName' ? 'asc' : 'desc';
       if (sortConfig.sortDirection === defaultDirection) {
         setSortConfig({
           sortKey: key,
           sortDirection: defaultDirection === 'asc' ? 'desc' : 'asc',
         });
       } else {
         setSortConfig({ sortKey: 'winRate', sortDirection: 'desc' });
       }
     }
   };
   ```
4. Implement `renderSortIndicator` helper function:
   ```typescript
   const renderSortIndicator = (key: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin') => {
     if (sortConfig.sortKey !== key) return null;
     return (
       <span className={styles.sortIndicator}>
         {sortConfig.sortDirection === 'asc' ? ' ▲' : ' ▼'}
       </span>
     );
   };
   ```
5. Update `<th>` tags:
   ```tsx
   <th className={styles.thLeft} onClick={() => handleSort('championName')}>
     Champion{renderSortIndicator('championName')}
   </th>
   <th onClick={() => handleSort('gamesPlayed')}>
     Played{renderSortIndicator('gamesPlayed')}
   </th>
   <th onClick={() => handleSort('winRate')}>
     Win Rate{renderSortIndicator('winRate')}
   </th>
   <th className={styles.thLeft} onClick={() => handleSort('kdaValue')}>
     KDA{renderSortIndicator('kdaValue')}
   </th>
   <th onClick={() => handleSort('csMin')}>
     CS/min{renderSortIndicator('csMin')}
   </th>
   ```
6. Add `sortConfig` to the `championsData` `useMemo` dependency array:
   `}, [filteredMatches, sortConfig]);`

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| State variables for sorting are correctly declared using React `useState` | Covered by step 2 | State verified by compiling checks |
| Table header elements are interactive and trigger the sorting click handler | Covered by step 5 | Interactive trigger checks |
| Sort configuration correctly cycles: New Column Clicked -> Active -> Toggle -> Reset | Covered by step 3 | Cycling validation checks |
| Arrow indicators render correctly next to the active sorted header according to the current direction | Covered by step 4 | Visual assertion checks |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| React component compilation | Unit | Ensure no TypeScript or build errors in component | Checked during compilation phase |
| Header click cycling check | Manual | Log sorting state changes to verify they cycle as expected | Verified by adding temporary console logs or debugging state overlays |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- None.

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- None (since sorting execution itself is out of scope).

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- standard git discard of modified frontend files.

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

- Remind the executing agent that sorting execution on the data array is handled in Task 002. Do not modify the sorting of the rows inside `championsData` during execution.
- Do not add CSS overrides in the stylesheet (handled in Task 004).
