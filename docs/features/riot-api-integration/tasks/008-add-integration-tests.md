# Task: Add Integration Tests

## Status

Done

## Task ID

008-add-integration-tests

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create integration tests for the Riot API Integration module using `MockMvc` and `WireMock` to verify full proxy flows, caching layers, and external failure scenarios.

## Context

Integrating with external APIs like Riot Games introduces runtime risks (timeouts, key expiration, rate limits, schema changes). Integration tests using mock servers (WireMock) simulate these scenarios and ensure that the backend's caching, parallel fetching, and error handling layers work correctly under realistic conditions.

## Scope

- Set up a Spring Boot integration test class (e.g. `RiotApiIntegrationTest`).
- Use `@SpringBootTest` with `@AutoConfigureMockMvc`.
- Configure WireMock to intercept outgoing HTTP calls to the Riot API regional subdomains.
- Implement test cases:
  - **Success Flow**: Look up player, mock PUUID resolution, match list ingestion, and details fetch. Verify mapped response and that caching prevents duplicate external requests.
  - **Profile Not Found**: Verify a 404 from Riot Account-v1 maps to a `404 Not Found` response.
  - **Rate Limiting**: Verify a 429 from Riot API maps to a `429 Too Many Requests` response.
  - **Cache Eviction**: Assert cache hits serve from memory and that entries expire/evict correctly.
  - **Partial Failure**: Verify that if fetching details for one match ID fails, other matches are still parsed and returned.

## Out of Scope

- Frontend integration tests or visual tests.

## Depends On

- `007-implement-riot-api-controller-and-validations.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] Spring Boot integration test class implemented.
- [ ] WireMock mock server runs and mocks Riot API endpoints.
- [ ] Integration tests verify:
  - Cache hit bypasses the wire client.
  - Cache miss requests the wire client and saves results.
  - Riot API 404 maps to HTTP 404.
  - Riot API 429 maps to HTTP 429.
  - Parallel fetching works correctly under load.
- [ ] Maven build passes all integration tests (`mvn clean verify` succeeds).

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` section "Testing Strategy".
- Configure WireMock port dynamically or via Spring properties to avoid port conflicts.
- Keep tests clean and self-contained; ensure cache instances are cleared between tests (`@DirtiesContext` or manual cache eviction).

## Validation Notes

- Execute integration tests with `mvn test` or `mvn verify`.
- Ensure tests execute and assert expected outcomes without depending on actual external internet connections.

## Risks

- Flaky tests: Mitigate by avoiding threads races and ensuring mock responses have stable latency profiles.

## Open Questions

- None

## Notes for Plan Task

- Review WireMock configurations in Spring Boot integration tests.
