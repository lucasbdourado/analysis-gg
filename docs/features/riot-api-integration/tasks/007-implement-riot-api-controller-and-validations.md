# Task: Implement Riot API Controller and Validations

## Status

Implemented

## Task ID

007-implement-riot-api-controller-and-validations

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Expose the REST endpoint `/api/summoner/{gameName}/{tagLine}` via a Spring Boot RestController, applying path/query validations and translating domain exceptions to HTTP errors.

## Context

The React frontend communicates with our proxy backend to load player statistics. The controller must validate query parameters (region, count), invoke the synchronization use case, and return the compact `PlayerAnalyticsResponse` payload. It must also handle external errors (such as Riot API rate limits or profile not found) and map them to standard HTTP status codes.

## Scope

- Create `RiotApiController` under `com.analysisgg.modules.riotapi.adapter.in.web`.
- Expose endpoint `GET /api/summoner/{gameName}/{tagLine}` supporting:
  - Path variables: `gameName`, `tagLine`
  - Query parameters: `region` (required), `count` (optional, defaults to 20)
- Add input validations:
  - `gameName` matches regex `^[a-zA-Z0-9\s_.-]{3,16}$`
  - `tagLine` matches regex `^[a-zA-Z0-9]{3,5}$`
  - `region` query param is in whitelist (`br1`, `na1`, `euw1`, `eune1`, `kr`)
  - `count` is coerced/clamped between `1` and `100`
- Implement global exception mapping (`@RestControllerAdvice`):
  - `InvalidRiotIdException` / `UnsupportedRegionException` -> HTTP 400 Bad Request
  - Riot API 404 -> HTTP 404 Not Found
  - Riot API 429 -> HTTP 429 Too Many Requests
  - Riot API 403 / 500 / other errors -> HTTP 500/504 with generic error messages
- Create unit tests for `RiotApiController` using `MockMvc` or Spring's WebMvcTest.

## Out of Scope

- Setting up WireMock-based integration tests.

## Depends On

- `006-implement-sync-player-profile-usecase.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] `RiotApiController` exposed and accepts lookups at `/api/summoner/{gameName}/{tagLine}`.
- [ ] Endpoint validates Riot ID parameters using regular expressions.
- [ ] Whitelist filters regions and returns `400 Bad Request` on unsupported inputs.
- [ ] Exceptions are translated to appropriate HTTP status codes (400, 404, 429, 500) using a RestControllerAdvice.
- [ ] Controller unit tests pass.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` sections "Data Contracts", "API or Interface Design", and "State and Error Handling".
- Keep the controller minimal. It should only validate inputs, call the use case, and map response payloads.
- Use Spring Boot's validation annotations (e.g., `@Pattern`, `@Validated`) or manual validation inside the controller method.

## Validation Notes

- Run unit tests verifying that `/api/summoner/Ahri/123?region=br1` works.
- Verify that request `/api/summoner/A/1?region=invalid` returns `400 Bad Request`.

## Risks

- Input parsing issues with spaces or special characters in `gameName`: Ensure path parameters are handled and decoded properly.

## Open Questions

- None

## Notes for Plan Task

- Review Spring Validation and controller exception handling patterns.
