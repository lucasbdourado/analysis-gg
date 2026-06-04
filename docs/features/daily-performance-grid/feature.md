# Feature: Daily Performance Grid

## Status

Status: Confirmed
Last updated: 2026-06-04
Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Source Documents

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Full Product PRD | docs/product/analysis-gg/full-product-prd.md | Full Product PRD | Confirmed | Approved on June 4, 2026 |
| MVP PRD | docs/product/analysis-gg/mvp-prd.md | MVP PRD | Confirmed | Approved on June 4, 2026 |
| Project Planning | docs/planning/analysis-gg/project-planning.md | Planning | Confirmed | Approved on June 4, 2026 |

## Feature Goal

Display a calendar/grid layout representing games played, wins, and losses on a daily basis (similar to GitHub contributions grid).

## User Value

Allows the player to see at a glance how their sessions distributed over the selected range and whether they are on a hot streak or a loss streak.

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-002 | Performance Dashboard | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-005 | Daily Performance Grid (wins/losses per calendar day) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-004 | As a player, I want to see a daily summary grid of my wins and losses so that I can see the outcome of my daily gaming sessions. | MVP PRD |

## Expected Outcome

An interactive calendar grid where each grid cell represents a day. The shade/color of the cell indicates play volume or win ratio (e.g., neutral gray for no games, shades of green for positive days, shades of red for negative days). Hovering displays the date and record (e.g. "June 3: 4 Games (3W - 1L)").

## Scope

- Aggregating game dates and match outcomes.
- Creating a chronological grid of cells covering the range of fetched matches.
- CSS/SVG grid rendering.
- Hover tooltips.

## Out of Scope

- Linking grid cells to open specific match history pages.

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Integration | Feature | Match dates and outcomes | Confirmed | Requires timestamp and win/loss fields. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Inconsistent spacing or grid overflow on narrow viewports | Medium | Medium | Implement standard horizontal scrolling or wrapping layout. | Open |

## Feature Completion Criteria

- [ ] Daily groupings display chronological order.
- [ ] Cells represent correct game counts and win/loss outcomes.
- [ ] Color rules map correctly (e.g. green for wins > losses, red for losses > wins, mixed for tied).
- [ ] Responsive behavior holds for mobile screen widths.

## Readiness Notes for Tech Spec

- CSS Grid layout spec.
- Color coding formula based on wins vs losses.

## Inputs for Create Tasks

- Create task for date accumulation helper.
- Create task for grid cell rendering.
- Create task for responsive layout design.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| How many days back should the grid show if the user selected 'Last 100 games'? (Should it show a fixed 30-day window or only dates matching the games?) | Medium | Yes, before Tech Spec | Product |
