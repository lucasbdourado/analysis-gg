# Task: Update CSS module styles for sorting indicators, highlights, and portraits

## Status

Depends on Previous Task

## Task ID

004-update-table-styling

## Feature

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Add necessary styling declarations to `TopChampionsTable.module.css` for interactive header buttons, sorting indicators, portrait icons, fallback circular placeholders, and high win rate highlights.

## Context

To make the dashboard look premium and fit the Obsidian dark theme, the table headers must clearly indicate interactivity (hover styles, cursors) and active sort state. Portraits and fallback placeholders must be neatly aligned with champion names.

## Scope

- Update `TopChampionsTable.module.css`:
  - Add styles for headers (`th`) that are interactive: `cursor: pointer` on sortable headers, hover background, and flex alignment.
  - Add indicator styling for the sorting direction arrows (e.g. spacing and color styling).
  - Style the portrait image: circular shape (`border-radius: 50%`), explicit dimensions (e.g., `24px` or `32px` width/height), and centering.
  - Style the fallback placeholder circle: matching portrait dimensions, centered text alignment, distinct background color (e.g. dark slate/grey matching the theme), and high-contrast text.
  - Align cell contents: portraits and names should align flex-left, stats should center.
  - Highlight win rates >= 60% with `var(--accent-cyan)` and a bold weight.
  - Ensure modern, subtle transitions on table row hover states.

## Out of Scope

- React logic changes.
- Writing unit test suites.

## Depends On

`003-render-champion-portraits-with-fallback.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- Interactive headers display pointer cursors on hover.
- Sorting indicators (▲/▼) are properly aligned next to the column titles.
- Champion portraits render as circles with clean borders.
- Fallback placeholders display as aligned circle text components when images fail to load.
- Win rates >= 60% are highlighted with the correct HSL cyan variable.
- CSS changes compile cleanly without errors.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Reference `styling-guidelines.md` from the React coding guidelines for colors, variables, and typography.
- Avoid Tailwind CSS or inline styles.

## Validation Notes

- Verify visually in the browser that the table layout is responsive, alignment matches the mockups, and hover highlights are smooth.

## Risks

- Text overflow on narrow screens (mitigated by using responsive table wrapper with horizontal scroll).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
