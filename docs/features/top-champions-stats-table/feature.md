# Feature: Top Champions Stats Table

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

Display a tabular summary of the player's champion performance, sorted descending by win rate.

## User Value

Informs players which champions are most successful, helping them optimize their champion pool to climb.

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-002 | Performance Dashboard | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-006 | Top Champions Stats Table (sorted by win rate) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-005 | As a player, I want to see my top champions sorted by win rate so that I can easily identify which champions give me the best results. | MVP PRD |

## Expected Outcome

A clean data table displaying:
1. Champion name/icon
2. Total Games played
3. Win Rate (%)
4. Average KDA ratio
5. Average CS/min
Sorted initially by Win Rate (descending).

## Scope

- Aggregation of stats per champion (kills, deaths, assists, creep score, match outcome).
- Math computations for KDA `(K+A)/D` and CS/min `CS/(Duration_Seconds/60)`.
- Interactive table rendering.
- Sorting columns when headers are clicked.

## Out of Scope

- Displaying champion skill order or item builds.

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Integration | Feature | Matches with detailed statistics | Confirmed | Requires player-specific participant details from Match-V5. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Division by zero in KDA calculation (0 deaths) | Low | High | Treat 0 deaths as 1 or show a specialized value like "Perfect KDA". | Open |

## Feature Completion Criteria

- [ ] Champion stats calculated accurately based on match scope.
- [ ] Table lists champion entries.
- [ ] Sorted descending by Win Rate by default.
- [ ] Displays champion icons (if static assets exist) or name.

## Readiness Notes for Tech Spec

- Sorting logic details.
- Formulas for KDA, CS/min, and Perfect KDA formatting.

## Inputs for Create Tasks

- Create task for champion stats parsing.
- Create task for table styling and sorting interactivity.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| What asset provider should be used for champion portraits (e.g. Riot Data Dragon)? | Medium | Yes, before Technology Definition | Tech |
