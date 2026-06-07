# Task: Configure interactive sorting state and header click handlers

## Status

Ready

## Task ID

001-configure-interactive-sorting

## Feature

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Set up state variables for active column sorting and click handlers on table headers to cycle sort directions, rendering visual arrow indicators (▲/▼) next to the sorted header.

## Context

Currently, the table headers in `TopChampionsTable.tsx` are static. To support interactive sorting, we need to add React state to track the active column and direction, and update header markup so that clicking them updates the sorting configuration.

## Scope

- Define state `sortConfig` tracking:
  - `sortKey`: `'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin'`
  - `sortDirection`: `'asc' | 'desc'`
- Update `<th>` headers to make them interactive.
- Implement click handler logic `handleSort(key)` that:
  - Selects the clicked column as the active sorting column.
  - If a new column is clicked: defaults direction to `desc` (or `asc` for `championName`).
  - If the active column is clicked: toggles direction (`desc` -> `asc`).
  - If clicked again, cycles or resets to default sorting (sorted descending by `winRate`).
- Render sorting indicators next to column headers (e.g. `▲` for ascending, `▼` for descending) when they are active.

## Out of Scope

- Implementing actual sorting execution on the aggregated champion data array (handled in 002).
- Integrating portrait assets (handled in 003).
- Styling adjustments in `TopChampionsTable.module.css` (handled in 004).

## Depends On

None

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- State variables for sorting are correctly declared using React `useState`.
- Table header elements are interactive and trigger the sorting click handler.
- Sort configuration correctly cycles: New Column Clicked -> Active (Asc/Desc) -> Toggle -> Reset to default (`winRate` desc).
- Arrow indicators render correctly next to the active sorted header according to the current direction.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Verify through console logging or temporary state rendering that the sort configuration changes correctly upon clicking headers.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
