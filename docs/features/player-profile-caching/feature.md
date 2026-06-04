# Feature: Player Profile Caching

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

Store synced profile lookup and match details for 15 minutes to reduce API traffic and ensure rapid page reloads.

## User Value

Speeds up page loads for repeated lookups and prevents the app from being rate limited by Riot.

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-001 | Player Profile & Riot API Sync | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-007 | Player Profile Caching (15 mins) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-001 | As a player, I want to search my Riot ID so that my ranked matches load automatically. | MVP PRD |

## Expected Outcome

An interception layer in the data pipeline. When a profile is requested:
1. Check if the profile data is stored locally and timestamp is within 15 minutes.
2. If valid, serve data directly.
3. If missing or expired, fetch fresh data from Riot, store in cache with current timestamp, and return it.

## Scope

- Data model design for cache entries.
- Cache check and retrieval logic.
- Expiration check (15 minutes).
- Cache update/eviction process.

## Out of Scope

- Storing cache in a persistent cloud database (cached locally or in-memory for the MVP).

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Riot API Integration | Feature | Data provider for cache misses | Confirmed | Connects directly to the sync pipeline. |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Local cache clearing due to browser reset | Low | Medium | Acceptable for MVP; user will just re-trigger sync. | Open |
| API key rotation invalidating cache | Low | Low | Key rotation shouldn't affect already parsed matches. | Open |

## Feature Completion Criteria

- [ ] Checks cache validity prior to calling Riot API.
- [ ] Expires data exactly after 15 minutes of store time.
- [ ] Returns cache payload instantly on match.

## Readiness Notes for Tech Spec

- Cache implementation details (local storage vs memory cache vs database).

## Inputs for Create Tasks

- Create task for caching utility class/helper.
- Create task for sync pipeline cache interceptor.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| Should we let the user force refresh the cache via a "Refresh" button, or strictly enforce the 15-minute wait? | Low | No | Product |
