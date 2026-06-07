# Task: Configure Caffeine Cache Pools

## Status

Done

## Task ID

001-configure-caffeine-cache-pools

## Feature

`docs/features/player-profile-caching/feature.md`

## Source Documents

- `docs/features/player-profile-caching/feature.md`
- `docs/features/player-profile-caching/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create Spring Boot configuration for Caffeine cache instances with correct size and TTL settings.

## Context

To protect Riot API rate limits, we must configure Caffeine cache instances: one for player profiles with a write-based TTL of 15 minutes, and another for match summaries with a write-based TTL of 24 hours.

## Scope

- Define `CaffeineCacheConfig` under `infrastructure/cache`.
- Configure `playerProfileCache` Bean with `expireAfterWrite(15, TimeUnit.MINUTES)` and `maximumSize(1000)`.
- Configure `matchSummaryCache` Bean with `expireAfterWrite(24, TimeUnit.HOURS)` and `maximumSize(10000)`.

## Out of Scope

- Implementing the port or adapter that interacts with these caches.
- Integrating the caches in use cases.

## Depends On

None

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Spring configuration class `CaffeineCacheConfig` created under `com.analysisgg.modules.riotapi.infrastructure.cache`.
- [x] Cache bean `playerProfileCache` configured with a 15-minute write-based TTL and maximum size of 1000.
- [x] Cache bean `matchSummaryCache` configured with a 24-hour write-based TTL and maximum size of 10000.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Inject Caffeine Cache objects directly as Spring beans for direct cache interaction.

## Validation Notes

- Verify that the Spring Context loads correctly without bean configuration errors.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
