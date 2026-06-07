# Task Breakdown: top-champions-stats-table

## Status

Confirmed

## Product Name

Analysis.GG

## Feature Reference

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Task Strategy

The Top Champions Stats Table feature is split into focused implementation tasks following the React clean coding guidelines:
1. **Interactive Sorting State**: Add sorting configuration (`sortKey`, `sortDirection`) to `TopChampionsTable.tsx` and click handlers to the table headers with visual sorting arrows (▲/▼).
2. **Stats Aggregation & Calculations**: Implement stats parsing from `filteredMatches`, computing KDA ratio (handling zero deaths as "Perfect" and providing a numerical sorting helper), and CS/min calculations.
3. **Data Dragon Assets & Fallbacks**: Enable loading of champion portrait images from Riot's Data Dragon CDN with a patch version constant (`CHAMPION_ASSET_VERSION`) and a fallback error placeholder.
4. **CSS Styling Updates**: Update CSS classes in `TopChampionsTable.module.css` to cover pointer cursors, hover states, image layout, circular placeholders, and ciano high-win-rate styling.
5. **Vitest Unit/Component Tests**: Write tests in `TopChampionsTable.test.tsx` verifying data aggregation, default/interactive sorting, fallback assets, empty states, and CSS accents.
6. **Completion Verification**: A final verification task validates the complete feature behavior from a product perspective.

## Task List

| Order | Task File | Goal | Status | Depends On | Blocking Reason |
|---|---|---|---|---|---|
| 001 | `001-configure-interactive-sorting.md` | Configure interactive sorting state and header click handlers. | Ready | None | None |
| 002 | `002-implement-stats-aggregation-and-sorting.md` | Refactor stats aggregation, KDA/CS formulas, and sorting logic. | Depends on Previous Task | `001-configure-interactive-sorting.md` | None |
| 003 | `003-render-champion-portraits-with-fallback.md` | Render champion portraits from Riot Data Dragon CDN with fallback placeholders. | Depends on Previous Task | `002-implement-stats-aggregation-and-sorting.md` | None |
| 004 | `004-update-table-styling.md` | Update CSS module styles for sorting indicators, highlights, and portraits. | Depends on Previous Task | `003-render-champion-portraits-with-fallback.md` | None |
| 005 | `005-implement-table-unit-tests.md` | Write Vitest unit and component tests for TopChampionsTable. | Depends on Previous Task | `004-update-table-styling.md` | None |
| 999 | `999-verify-feature-completion.md` | Validate the complete feature behavior. | Depends on Previous Task | `001-configure-interactive-sorting.md`, `002-implement-stats-aggregation-and-sorting.md`, `003-render-champion-portraits-with-fallback.md`, `004-update-table-styling.md`, `005-implement-table-unit-tests.md` | None |

## Suggested Execution Order

1. `001-configure-interactive-sorting.md`
2. `002-implement-stats-aggregation-and-sorting.md`
3. `003-render-champion-portraits-with-fallback.md`
4. `004-update-table-styling.md`
5. `005-implement-table-unit-tests.md`
6. `999-verify-feature-completion.md`

## Blocked Tasks

| Task File | Blocking Reason | Required Action |
|---|---|---|
| None | None | None |

## Dependency Notes

- Task `002` relies on the sorting state configuration and header handlers implemented in `001`.
- Task `003` integrates portrait CDN assets and fallbacks into the aggregated table structure from `002`.
- Task `004` applies styling overrides to the interactive elements and portraits introduced in `001` and `003`.
- Task `005` relies on the completed component state, logic, styling, and visual structure from `004` to run assertions.
- Task `999` verifies the completed feature behavior once all tasks are implemented and tested.

## Notes for Plan Task

- Plan one task at a time.
- Read the task file and its source documents before creating a task implementation plan.
- Do not plan blocked tasks until their blocking reason is resolved.

## Notes for Execute Task

- Execute only from an approved task implementation plan.
- Validate each task against its acceptance criteria.
- Do not mark the feature complete until `999-verify-feature-completion.md` is satisfied.
