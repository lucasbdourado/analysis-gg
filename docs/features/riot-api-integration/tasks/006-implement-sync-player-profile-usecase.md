# Task: Implement Sync Player Profile Use Case

## Status

Implemented

## Task ID

006-implement-sync-player-profile-usecase

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Implement the orchestrator class `SyncPlayerProfileUseCase` and its corresponding unit tests, performing parallel match detail fetching using Java 21 Virtual Threads and cache checks.

## Context

To avoid sequential fetch bottlenecks (which can take 10+ seconds for 50 matches), the use case coordinates parallel lookup using Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`). It checks the cache first for each match ID and only invokes the external API adapter for cache misses, optimizing performance and rate limits.

## Scope

- Implement `SyncPlayerProfileUseCase` class in `com.analysisgg.modules.riotapi.application.usecase`.
- Implement orchestration flow:
  1. Resolve Riot ID to PUUID (using the cache adapter first, then the API client adapter on miss).
  2. Fetch match IDs lists for queue 420 (Solo/Duo) and queue 440 (Flex) via the API client.
  3. Merge, remove duplicates, sort lexicographically/chronologically, and truncate to the requested limit.
  4. For each match ID, check `matchSummaryCache` for hits.
  5. For misses, fetch details from Riot API in parallel using Virtual Threads, parse the payload, extract the target player's stats, and store the resulting `MatchSummary` in the cache.
  6. Aggregate profile and match list into `PlayerAnalytics` and return.
- Implement comprehensive unit tests for `SyncPlayerProfileUseCase` using JUnit 5 and Mockito.

## Out of Scope

- Implementing the REST Controller or global exception handling.

## Depends On

- `005-implement-caffeine-cache-adapter.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] `SyncPlayerProfileUseCase` implemented and correctly processes lookups.
- [ ] Concurrent fetches are performed using Java 21 Virtual Threads via an executor.
- [ ] Match ID list merging filters for Solo/Duo and Flex, removes duplicate IDs, and truncates correctly.
- [ ] Match details are parsed to extract only the target player's statistics (compacting payload).
- [ ] Unit tests achieve high code coverage, mocking the client and cache adapter ports.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` section "Proposed Technical Approach" and the flow diagram.
- Use `try-with-resources` with `Executors.newVirtualThreadPerTaskExecutor()` to ensure proper executor lifecycle management and thread cleanup.
- Handle partial failures gracefully (e.g. if 1 out of 20 match details fails to fetch, log the failure and skip it, instead of failing the entire request).

## Validation Notes

- Run unit tests that assert parallel execution and cache checks.
- Verify that duplicate match IDs between queues are correctly de-duplicated.

## Risks

- Executor leak: Mitigate by wrapping the executor in a try-with-resources block.
- Virtual thread blockage: Ensure we use non-blocking or compatible I/O operations (Spring RestClient is compatible).

## Open Questions

- None

## Notes for Plan Task

- Review virtual thread execution patterns in Java 21 to build a safe, structured concurrent fetch pipeline.
