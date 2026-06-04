# Feature: Riot API Integration

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

Retrieve the player's PUUID using their Riot ID (Name#Tagline) and ingest their recent ranked match history details from the Riot Games Match-V5 API.

## User Value

Automates data acquisition so that players can view their match analytics without manually entering stats.

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-001 | Player Profile & Riot API Sync | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-002 | Riot API Integration (retrieve match details) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-001 | As a player, I want to search my Riot ID so that my ranked matches load automatically. | MVP PRD |

## Expected Outcome

An integration connector that:
1. Calls Riot Account API `by-riot-id` to fetch PUUID.
2. Calls Riot Match API to get match IDs for the PUUID.
3. Fetches details for each match ID and filters for ranked Solo/Duo or Flex queues.
4. Returns parsed match details to the frontend/dashboard.

## Scope

- Communication with Riot Games API.
- Error handling for API rate limits and invalid tokens.
- Queue-type filtering (Solo/Duo and Flex).
- Data parsing (KDA, CS/min, match date, win/loss, champion played).

## Out of Scope

- Normal games, ARAMs, Arena games.
- Real-time in-game data fetching.

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Key | External | Accessing Riot API | Pending | Needs developer/production key setup. |
| Riot ID Search Input | Feature | Getting query inputs | Confirmed | Needs name, tagline, and region. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Rate limiting (100 req / 2 min developer key limit) | High | High | Implement local cache (MVP-F-007) and request throttling. | Open |
| Developer Key Expiration (24h) | High | High | Plan deployment config variables to easily update key. | Open |

## Feature Completion Criteria

- [ ] PUUID fetched from Riot ID successfully.
- [ ] Recent match list retrieved (up to 100).
- [ ] Match details parsed, keeping only ranked Solo/Duo and Flex matches.
- [ ] Graceful error rendering for Riot API outages or limits.

## Readiness Notes for Tech Spec

- API mapping specs (Account-V1, Match-V5).
- Error status handlers (e.g. 403, 429, 404).

## Inputs for Create Tasks

- Create task for backend/proxy fetch routing.
- Create task for PUUID resolution logic.
- Create task for Match List fetching.
- Create task for individual Match Detail parsing.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| Do we retrieve match histories in chunks or in a single batch of up to 100? | Medium | Yes, before Tech Spec | Tech |
