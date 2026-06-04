# Feature: Match Range Filter

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

Provide an interactive selector on the dashboard allowing the user to filter the scope of analyzed ranked games to the last 20, 50, or 100 matches.

## User Value

Enables players to inspect short-term performance shifts (last 20 games) as well as broader trends (last 100 games).

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-002 | Performance Dashboard | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-003 | Match Range Filter (Last 20, 50, 100 games) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-002 | As a player, I want to filter my dashboard by game count (20/50/100) so that I can analyze short-term or long-term trends. | MVP PRD |

## Expected Outcome

A selector element (such as a dropdown or button group) at the top of the dashboard. Selecting an option updates the local data array used by all widgets, forcing immediate visual recalculation of win rates, tables, and charts.

## Scope

- Dropdown component in the dashboard header.
- Filter recalculation engine.
- Re-rendering trigger for the weekday win rate chart, daily grid, and champion table.

## Out of Scope

- Filtering by queue type (Solo/Duo vs Flex) - both are analyzed together in the MVP.
- Filtering by custom date ranges or patch versions.

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Integration | Feature | Providing the matches to filter | Confirmed | Ingestion must fetch at least 100 matches to support the full filter range. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Insufficient matches (e.g. user has only 15 games) | Low | Medium | Gracefully limit the range options or display a message if the profile contains fewer matches than selected. | Open |

## Feature Completion Criteria

- [ ] Dropdown element is accessible in dashboard header.
- [ ] Selecting "Last 20" updates all widgets with calculations of the 20 most recent games.
- [ ] Selecting "Last 50" updates all widgets with calculations of the 50 most recent games.
- [ ] Selecting "Last 100" updates all widgets with calculations of the 100 most recent games.

## Readiness Notes for Tech Spec

- State management layout to handle active range filter.
- Safe slicing logic (`slice(0, Math.min(games.length, filterCount))`).

## Inputs for Create Tasks

- Create task for filter dropdown styling and layout.
- Create task for dashboard filter state management.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| If a user has fewer than 100 games, how should the dropdown display (e.g., hide 100, or display "Last 100 (Max 35 Available)")? | Low | No | Product |
