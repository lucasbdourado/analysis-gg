# Task: Refactor stats aggregation, KDA/CS formulas, and sorting logic

## Status

Implemented

## Task ID

002-implement-stats-aggregation-and-sorting

## Feature

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Refactor champion stats aggregation to correctly compute KDA sorting helper (`kdaValue`), handle division by zero (Perfect KDA), format KDA/CS strings, and sort memoized data dynamically based on the active `sortConfig`.

## Context

The current component has standard aggregation but lacks sorting by all columns, tie-breaker fallback, and correct Perfect KDA sorting. We need to refactor the data aggregation structure and memoized sort logic inside `TopChampionsTable.tsx` to conform to the specifications.

## Scope

- Update the internal type interface matching `ChampionStats` from `tech-spec.md`:
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
- Refactor data aggregation from `filteredMatches` inside `useMemo`:
  - Calculate KDA: `(kills + assists) / deaths`.
  - Handle zero deaths: set `isPerfectKda = true` and `kdaValue = kills + assists`.
  - Handle non-zero deaths: set `isPerfectKda = false` and `kdaValue = (kills + assists) / deaths`.
  - Format KDA string as: `Perfect (avgK/0.0/avgA)` or `${rawKda.toFixed(2)} (avgK/avgD/avgA)`.
  - Calculate CS/min: `totalCs / (totalDurationSeconds / 60)`. If duration is 0, default `csMinString = '0.0'` and `csMin = 0`. Format to 1 decimal place.
- Implement sorting on the aggregated array using active `sortKey` and `sortDirection`:
  - Map sort keys to sorting variables (`championName`, `gamesPlayed`, `winRate`, `kdaValue`, `csMin`).
  - To break ties on equal values: fallback to secondary sorting by `gamesPlayed` descending, then `championName` ascending.
  - Ensure correct rendering variables are mapped to the table JSX cells.

## Out of Scope

- Integrating champion portrait images from CDN (handled in 003).
- Adding styling variables and custom pointers in CSS Module (handled in 004).

## Depends On

`001-configure-interactive-sorting.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- Champion stats are calculated accurately from mock matches.
- Perfect KDA renders as "Perfect" with counts when deaths is 0.
- Sorting by KDA descending correctly places Perfect KDA champions with higher `kills + assists` at the top.
- CS/min calculates to 1 decimal place and defaults to "0.0" when duration is 0.
- Interactive table sorting is fully functional and uses correct tie-breaking logic.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Use `useMemo` for processing calculations to optimize performance.

## Validation Notes

- Verify through component layout inspection that clicking headers correctly reorders the table rows according to the expected metrics and direction.

## Risks

- Low game counts causing inflated win rates (mitigated by secondary gamesPlayed sort).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
