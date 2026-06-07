# Task: Render champion portraits from Riot Data Dragon CDN with fallback placeholders

## Status

Implemented

## Task ID

003-render-champion-portraits-with-fallback

## Feature

`docs/features/top-champions-stats-table/feature.md`

## Source Documents

- `docs/features/top-champions-stats-table/feature.md`
- `docs/features/top-champions-stats-table/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Render champion portraits dynamically using Riot Data Dragon CDN, implementing a local state tracker for broken images to display a styled circular fallback placeholder showing the champion's first letter.

## Context

To enhance visual aesthetics, we need to show champion portrait icons in the table rows next to their names. Since champion keys or Patch versions can shift, we must build a robust fallback system that triggers on image load errors so we never display broken image icons.

## Scope

- Declare a configurable constant `CHAMPION_ASSET_VERSION = '14.11.1'` (defined locally or at the top of the component file).
- Declare React state `failedImages` as a dictionary/Record or Set of strings to track champion names whose images fail to load:
  ```typescript
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  ```
- Render a container in the `Champion` column cell containing:
  - An `<img>` tag with:
    - `src` set to `https://ddragon.leagueoflegends.com/cdn/${CHAMPION_ASSET_VERSION}/img/champion/${champ.championName}.png`
    - `alt` set to champion name
    - `onError` handler that updates `failedImages` state mapping the champion name to `true`.
  - A fallback placeholder container rendering the first letter of the champion name when `failedImages[champ.championName]` is true.
- Hide/omit the `<img>` tag if the image failed to load, replacing it with the placeholder.

## Out of Scope

- Adding custom pointer cursors or high win rate text colors in CSS (handled in 004).
- Writing Vitest assertions for fallback simulation (handled in 005).

## Depends On

`002-implement-stats-aggregation-and-sorting.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- Champion portraits are fetched from Riot Data Dragon CDN version `14.11.1`.
- Images that fail to load trigger the `onError` handler.
- If an image fails to load, a fallback circular element with the champion's first letter is displayed instead.
- The UI displays names alongside the portraits/placeholders cleanly.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Ensure the image `alt` text is descriptive.
- Keep state updates minimal to prevent render loops.

## Validation Notes

- Temporarily change the champion image URL to an invalid path and check that the circular fallback placeholder renders correctly for all rows.

## Risks

- Rate limits or CDN downtime (mitigated by local first-letter fallback).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
