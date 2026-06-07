# Task: Verify Caching and Eviction via Tests

## Status

Done

## Task ID

005-verify-caching-and-eviction-via-tests

## Feature

`docs/features/player-profile-caching/feature.md`

## Source Documents

- `docs/features/player-profile-caching/feature.md`
- `docs/features/player-profile-caching/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Verify caching adapter behavior, use case caching flows, and end-to-end integration contracts via automated tests.

## Context

To ensure the cache performs correctly, handles hits/misses, complies with TTL constraints and maximum sizes, manages concurrent virtual threads, and maps rate-limiting or errors correctly, we must have a robust suite of tests.

## Scope

- Implement unit tests in `CaffeineCacheAdapterTest` checking profile and match summary hits, misses, clear, evictions, and maximum size boundaries.
- Implement unit tests in `SyncPlayerProfileUseCaseTest` checking that caching intercepts redundant client calls, handles thread parallel fetches, and recovers from single-match api failures.
- Implement integration tests in `RiotApiIntegrationTest` checking mock REST endpoints with WireMock, verifying that subsequent requests hit the cache instead of triggering remote HTTP queries.

## Out of Scope

- Testing frontend react component renders.

## Depends On

`004-expose-cached-results-via-rest-endpoint.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] `CaffeineCacheAdapterTest` implemented and passes, verifying hits, misses, clear, and size-based evictions.
- [x] `SyncPlayerProfileUseCaseTest` implemented and passes, verifying profile/match caching, virtual thread parallel fetches, and partial fetch failures.
- [x] `RiotApiIntegrationTest` implemented and passes, verifying integration endpoint caching behavior using MockMvc and WireMock.

## Implementation Notes

- Use JUnit 5, Mockito, AssertJ, and WireMock to write test suites.

## Validation Notes

- Run `mvn test` in the terminal to execute all backend test suites and confirm they pass cleanly.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
