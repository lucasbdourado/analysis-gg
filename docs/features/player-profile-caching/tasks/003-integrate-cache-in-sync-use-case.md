# Task: Integrate Cache in Sync Use Case

## Status

Done

## Task ID

003-integrate-cache-in-sync-use-case

## Feature

`docs/features/player-profile-caching/feature.md`

## Source Documents

- `docs/features/player-profile-caching/feature.md`
- `docs/features/player-profile-caching/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Integrate cache verification into `SyncPlayerProfileUseCase` using `PlayerProfileCachePort`, fetching matches in parallel on cache misses.

## Context

Inside the sync player profile pipeline, we must intercept lookup requests. Check the profile cache; if missed, retrieve from Riot and cache. For match detail lists, check the cache for each match; fetch misses concurrently using virtual threads, caching the results afterwards.

## Scope

- Inject `PlayerProfileCachePort` in `SyncPlayerProfileUseCase`.
- Retrieve player profile from cache or fetch and put into cache.
- Query match IDs. For each ID, check match summary cache.
- Fetch match detail cache misses in parallel using Java 21 Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`).
- Populate cache misses back to the match summary cache.

## Out of Scope

- Exposing the service via REST or styling the frontend.

## Depends On

`002-implement-caffeine-cache-adapter.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Cache checks executed before invoking `RiotApiClientPort` for both profile and match details.
- [x] Sync player profile and match details caching works successfully on cache misses.
- [x] Fetching of match detail cache misses runs in parallel using JVM Virtual Threads.
- [x] Single match fetch failures are logged as warnings and skipped, returning a partial list instead of crashing.

## Implementation Notes

- Handle concurrency safely: Use `Executors.newVirtualThreadPerTaskExecutor()` within a try-with-resources statement to manage virtual threads.

## Validation Notes

- Run tests to check parallel execution and partial failure handling.

## Risks

- Rate limiting if parallel misses occur frequently under massive scale. Enforce cache TTL.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
