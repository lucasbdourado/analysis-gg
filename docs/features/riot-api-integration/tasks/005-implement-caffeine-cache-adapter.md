# Task: Implement Caffeine Cache Adapter

## Status

Depends on Previous Task

## Task ID

005-implement-caffeine-cache-adapter

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create Caffeine Cache configurations and implement the `PlayerProfileCachePort` interface and its adapter `CaffeineCacheAdapter` to cache player profiles and match summaries.

## Context

To defend against Riot's strict developer key rate limits (100 req / 2 min), we must cache active player profiles and individual match details. Player profiles have a 15-minute write-based eviction policy, while match details can be cached longer (24 hours or more) since historical match statistics are immutable.

## Scope

- Implement Spring configuration for Caffeine cache instances:
  - Cache 1: `playerProfileCache` (TTL: 15 minutes, maximum size: 1000).
  - Cache 2: `matchSummaryCache` (TTL: 24 hours, maximum size: 10000).
- Define `PlayerProfileCachePort` in the application layer.
- Implement `CaffeineCacheAdapter` in the outbound adapter layer.
- Define methods to read, write, and evict cached entries.

## Out of Scope

- Implementing the controller or orchestrating parallel thread fetching.

## Depends On

- `004-implement-riot-api-client-adapter.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] Caffeine configurations build caches with proper eviction constraints (15 minutes for profile, 24 hours for matches).
- [ ] `PlayerProfileCachePort` defined under `application.port`.
- [ ] `CaffeineCacheAdapter` implemented under `adapter.out.cache` and annotated as a Spring Component.
- [ ] Cache hit/miss operations are covered by unit/integration tests.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` section "Proposed Technical Approach" and Caffeine reference documentation.
- Leverage Spring's Cache abstraction or interact directly with Caffeine Cache objects for fine-grained program control. The tech spec indicates direct cache bean interaction in `CaffeineCacheAdapter`.
- Keep in-memory structures thread-safe.

## Validation Notes

- Run tests validating that querying the same profile twice triggers only one call to the underlying service.
- Verify that cache entries are evicted after their respective eviction windows.

## Risks

- Memory exhaustion: Mitigate by enforcing strict maximum size limits (e.g. 1000 for profiles, 10000 for matches).

## Open Questions

- None

## Notes for Plan Task

- Review the Caffeine technology reference in `docs/references/analysis-gg/technologies/caffeine.md` to map configuration options correctly.
