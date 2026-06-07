# Task: Implement Caffeine Cache Adapter

## Status

Done

## Task ID

002-implement-caffeine-cache-adapter

## Feature

`docs/features/player-profile-caching/feature.md`

## Source Documents

- `docs/features/player-profile-caching/feature.md`
- `docs/features/player-profile-caching/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create `PlayerProfileCachePort` interface and implement its adapter `CaffeineCacheAdapter` using configured Caffeine cache beans.

## Context

Decouple the application layer from Caffeine cache libraries using ports and adapters, implementing caching keys and adapter methods to put, get, and evict values.

## Scope

- Create interface `PlayerProfileCachePort` under `application/port`.
- Create records `ProfileCacheKey` and `MatchSummaryCacheKey` under `adapter/out/cache`.
- Create `CaffeineCacheAdapter` implementing `PlayerProfileCachePort` and inject Caffeine beans.
- Implement get, put, evict, and clear operations.

## Out of Scope

- Integrating caching inside use case orchestrators.

## Depends On

`001-configure-caffeine-cache-pools.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Interface `PlayerProfileCachePort` defined under `com.analysisgg.modules.riotapi.application.port`.
- [x] Records `ProfileCacheKey` and `MatchSummaryCacheKey` defined under `com.analysisgg.modules.riotapi.adapter.out.cache` as thread-safe keys.
- [x] Class `CaffeineCacheAdapter` implemented under `com.analysisgg.modules.riotapi.adapter.out.cache` and annotated with `@Component`.
- [x] Inject Caffeine cache instances in adapter and implement all port operations.

## Implementation Notes

- Use Java 21 features (records for keys).
- Validate key constructor parameters if needed to avoid null key values.

## Validation Notes

- Verify class compiles and implements all methods of the interface.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
