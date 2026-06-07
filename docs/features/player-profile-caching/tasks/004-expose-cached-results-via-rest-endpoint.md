# Task: Expose Cached Results via REST Endpoint

## Status

Done

## Task ID

004-expose-cached-results-via-rest-endpoint

## Feature

`docs/features/player-profile-caching/feature.md`

## Source Documents

- `docs/features/player-profile-caching/feature.md`
- `docs/features/player-profile-caching/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Expose a REST controller endpoint `GET /api/summoner/{gameName}/{tagLine}` that routes requests through the caching-enabled use case.

## Context

We need to provide an endpoint for the React client to fetch player profile and match analytics. The endpoint must accept parameters like Riot ID, region, and count, map them to value objects, invoke the cache-enabled sync use case, and return a validated response.

## Scope

- Set up or verify `RiotApiController` mapped to `/api/summoner`.
- Define endpoint method `getPlayerAnalytics` accepting path variables and query parameters.
- Clamp the match search count to a range between 1 and 100.
- Invoke the sync use case and map domain objects to API response contract representation.

## Out of Scope

- Client-side React page layouts.

## Depends On

`003-integrate-cache-in-sync-use-case.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] REST endpoint `/api/summoner/{gameName}/{tagLine}` created and mapped to `RiotApiController`.
- [x] URL variables and query parameters correctly extracted and mapped to domain models.
- [x] Input query parameter `count` is validated/clamped (minimum 1, maximum 100).
- [x] Calls `SyncPlayerProfileUseCase` and returns mapped JSON payload response.

## Implementation Notes

- Use standard Spring Boot REST controllers and mapping annotations.

## Validation Notes

- Run local boot application and verify that querying endpoints returns the expected payloads.

## Risks

- None.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
