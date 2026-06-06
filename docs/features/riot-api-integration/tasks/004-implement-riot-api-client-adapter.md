# Task: Implement Riot API Client Adapter

## Status

Depends on Previous Task

## Task ID

004-implement-riot-api-client-adapter

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Define the `RiotApiClientPort` interface in the application layer and implement the `RiotApiClientAdapter` in the outbound adapter layer using Spring's `RestClient`, supporting environment-based configuration and regional routing mappings.

## Context

The backend must query Riot's external servers safely, injecting the `X-Riot-Token` header for authentication and resolving the correct regional endpoints (`americas`, `europe`, `asia`) based on the user's platform region.

## Scope

- Create package structures under `com.analysisgg.modules.riotapi.application.port` and `com.analysisgg.modules.riotapi.adapter.out.integration`.
- Define interface `RiotApiClientPort` with methods:
  - `resolvePuuid(String gameName, String tagLine, String regionalRoute)`
  - `fetchMatchIds(String puuid, String regionalRoute, int count)`
  - `fetchMatchDetail(String matchId, String regionalRoute)`
- Create `RiotApiClientAdapter` implementing `RiotApiClientPort` using Spring `RestClient`.
- Configure environment variable injection for the Riot API key (`RIOT_API_KEY`).
- Implement the platform-to-route mapping rules:
  - `br1`, `na1` -> `americas.api.riotgames.com`
  - `euw1`, `eune1` -> `europe.api.riotgames.com`
  - `kr` -> `asia.api.riotgames.com`
- Map HTTP error responses (404 Not Found, 429 Rate Limit, 403 Forbidden) into domain-specific or system-specific exceptions.

## Out of Scope

- Implementing the orchestrator use case or the caching logic.

## Depends On

- `003-implement-domain-models-and-value-objects.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] `RiotApiClientPort` defined under `application.port`.
- [ ] `RiotApiClientAdapter` implemented under `adapter.out.integration`.
- [ ] `X-Riot-Token` is dynamically appended via header customizer in `RestClient`.
- [ ] Regional routing mapping works according to the specified rules.
- [ ] Basic unit tests exist for endpoint mappings using mock responses.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` sections "Proposed Technical Approach" and "Riot Games API Endpoints Used".
- Riot developer keys must NEVER be hardcoded. Use Spring Boot `@Value` properties or configurations.
- Use `RestClient` built-in error handlers (`.onStatus()`) to translate HTTP failures into appropriate runtime exceptions.

## Validation Notes

- Run unit tests that mock the remote Riot server responses and assert that the headers and paths are built correctly.
- Verify that regional mapping correctly translates `br1` to `americas` and `kr` to `asia`.

## Risks

- Key exposure: Ensure the key is never logged or written to files.
- Rate limiting: Ensure we intercept 429 status and forward/throw it cleanly.

## Open Questions

- None

## Notes for Plan Task

- Examine Spring `RestClient` documentation for handling path variables and headers.
