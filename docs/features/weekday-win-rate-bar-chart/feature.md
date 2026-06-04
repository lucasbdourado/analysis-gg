# Feature: Weekday Win Rate Bar Chart

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

Render a bar chart displaying the player's win rate percentage grouped by day of the week (Monday through Sunday).

## User Value

Highlights behavioral win/loss patterns (e.g., "Monday win rate is 30% compared to Friday's 65%", suggesting exhaustion after work or weekend concentration).

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-002 | Performance Dashboard | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-004 | Weekday Win Rate Bar Chart | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-003 | As a player, I want to see my win rate per day of the week so that I can decide which days are best for me to play ranked. | MVP PRD |

## Expected Outcome

A clean, responsive bar chart mapping days (Mon-Sun) to win rate percentages (0-100%). Hovering over each bar displays the actual win-loss record for that specific day (e.g., "Win Rate: 60% (3W - 2L)").

## Scope

- Day extraction from UTC match timestamps (converting to user timezone if possible).
- Aggregation of wins and losses grouped by weekday.
- Responsive bar chart visualization with modern styling.

## Out of Scope

- Time-of-day analytics (e.g., morning vs. late night) - deferred post-MVP.

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Integration | Feature | Match data with timestamps and outcomes | Confirmed | Requires access to game start timestamp and win/loss boolean. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Low sample sizes leading to misleading stats (e.g. 1 game on Sunday = 100% win rate) | Medium | Medium | Display the number of games played next to or inside the tooltip for each day. | Open |

## Feature Completion Criteria

- [ ] Correct conversion of Unix timestamp to day of the week.
- [ ] Accurate calculation of (Wins / Total Games on Day) * 100.
- [ ] Chart displays Mon-Sun sequentially.
- [ ] Hover tooltips show details of Wins, Losses, and Win Rate.

## Readiness Notes for Tech Spec

- Chart libraries to use (e.g., pure SVG, Chart.js, or Recharts).
- Formula: `WinRate = (Wins / Total) * 100` rounded to nearest integer.

## Inputs for Create Tasks

- Create task for weekday aggregation functions.
- Create task for bar chart rendering and styling.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| Should we adjust the timestamps to the player's local browser timezone or default to server/UTC? | Medium | Yes, before Tech Spec | Tech |
