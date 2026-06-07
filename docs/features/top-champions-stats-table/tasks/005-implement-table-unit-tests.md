# Task: Write Vitest unit and component tests for TopChampionsTable

## Status

Depends on Previous Task

## Task ID

005-implement-table-unit-tests

## Feature

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create `TopChampionsTable.test.tsx` containing robust unit and component tests verifying aggregation calculations, sorting behavior (default, tie-breaking, interactive), fallback image rendering, empty states, and visual highlights.

## Context

To ensure the table aggregates match statistics accurately and sorts reliably as users interact with the column headers, we must write a comprehensive test suite. We will use Vitest and React Testing Library, which is the confirmed testing stack.

## Scope

- Create a test file `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.test.tsx`.
- Mock `useDashboard` (or render within `DashboardProvider`) with mock matches.
- Implement tests covering:
  - **Data Aggregation**: Assert wins, losses, win rates, CS/min, and average KDA are computed accurately from multiple matches.
  - **Default Sorting**: Verify the table defaults to sorting by winRate descending, then gamesPlayed descending, then championName ascending.
  - **Perfect KDA**: Verify that when deaths are 0, KDA is formatted as "Perfect" (e.g. `Perfect (4.0/0.0/8.0)`), and that Perfect KDAs sort correctly descending.
  - **Interactive Sorting**: Simulate clicks on the table column headers ("Champion", "Played", "Win Rate", "KDA", "CS/min"), and verify row re-ordering and direction toggling.
  - **Image fallback**: Mock/simulate `onError` on the champion portrait image tag, and verify that the circular placeholder containing the first letter is displayed.
  - **Empty State**: Verify that when `filteredMatches` is empty, the message "No champion statistics to display." is rendered instead of a table.
  - **Visual styling accents**: Verify that champions with win rate >= 60% are styled with the high-win-rate class.

## Out of Scope

- Writing end-to-end tests or server-side tests.
- UI styling adjustments.

## Depends On

`004-update-table-styling.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- All tests pass when running the Vitest runner.
- Mock matches cover varied cases: 0 deaths, 0 match duration, equal win rates (tie-breakers), and empty lists.
- Interactive header clicks are correctly simulated, asserting the change in row order.
- Portrait `onError` handler is triggered in a test, confirming the render of the fallback letter.
- Test coverage covers all branches of the aggregation and sorting logic.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep mock data realistic (representing `MatchSummary` objects).
- Follow clean testing practices: describe/it structure, clean mock cleanup, and clear assertions.

## Validation Notes

- Run Vitest locally and verify that all test suites for the dashboard features pass cleanly.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
