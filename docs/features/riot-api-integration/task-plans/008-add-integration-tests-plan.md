# Task Implementation Plan: Add Integration Tests

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/008-add-integration-tests-plan.md`

## Task Reference

Task ID: `008-add-integration-tests`

Task file: `docs/features/riot-api-integration/tasks/008-add-integration-tests.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/008-add-integration-tests.md` | Entire document | Confirmed by source document | Defines goals, scope, and criteria for integration testing |
| Feature file | `docs/features/riot-api-integration/feature.md` | Entire document | Confirmed by source document | Provides functional context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Proposed Technical Approach, State and Error Handling, Testing Strategy | Confirmed by source document | Details HTTP endpoints, concurrency, and validation |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Establishes Spring Boot, Java 21, and Caffeine configuration |

## Planning Scope

This planning session covers only the design and integration testing plan for the Riot API Integration module. It specifies setting up `RiotApiIntegrationTest` utilizing `MockMvc` and `WireMock` stand-alone to cover successful proxy executions, caching behavior, rate-limiting, missing profiles, and partial fetching failures. It does not cover unit testing (already completed) or any frontend component integration.

## Task Summary

Create a Spring Boot integration test class (`RiotApiIntegrationTest`) using `MockMvc` and `WireMock` to verify all end-to-end proxy endpoints and behaviors under normal, cached, rate-limited, and failure scenarios.

## Execution Eligibility

Status: Eligible

Reason:
- The dependency `007-implement-riot-api-controller-and-validations.md` has been completed and verified (unit tests are passing).

## Feature Context

To ensure the proxy backend is robust against real-world Riot API characteristics, we must perform integration testing. Since real Riot API calls require a secret token, rate-limiting rules, and internet access, we mock outgoing HTTP requests using WireMock. The integration test will verify that HTTP requests to our proxy (`/api/summoner/{gameName}/{tagLine}`) correctly invoke the underlying client and return normalized JSON or appropriate HTTP error responses, while checking that caching layer saves redundant network requests.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Testing Strategy | Full | Implements Spring Boot integration tests verifying caches and endpoints. | Validates using MockMvc and WireMock. |
| State and Error Handling | Full | Asserts correct mapping of Riot API responses (404, 429) to HTTP proxy responses. | Verifies status mapping. |
| Performance Considerations | Full | Verifies concurrent fetching and Caffeine caching efficiency. | Asserts cache hits skip external WireMock client. |

Coverage assessment:
- Justifying Tech Spec section: `Testing Strategy`
- Tech Spec sections implemented by this task: `Testing Strategy`, `State and Error Handling`, `Performance Considerations`
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Java 21 | `technology-definition.md` | Core language runtime for writing and running test cases. |
| Spring Boot 3.3.5 | `technology-definition.md` / `pom.xml` | Enforces Spring Boot Test utilities and dependency injection in integration testing. |
| Caffeine Cache | `technology-definition.md` / `pom.xml` | Cache layer behavior asserted via state inspection / WireMock request counting. |
| WireMock Standalone 3.6.0 | `pom.xml` | Emulates the Riot API HTTP server endpoints for americas/europe/asia. |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | Integration Test package and class structure | Enforces clean package organization, naming conventions, and resource cleanups |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Local Cache & API Proxy | `technology-definition.md` | Integration test will verify local Caffeine caching and proxying |

No existing feature, ADR, or architecture decision was relevant to this task.

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java` | Riot Client HTTP request structure | Checked host mappings and request routing | Uses `https://{host}/...` dynamically resolved by region |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/CaffeineCacheAdapter.java` | Cache adapter methods | Allows clearing cache between tests | Exposes public `clear()` method |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java` | RestController endpoints | Checked endpoint mapping paths and parameters | `/api/summoner/{gameName}/{tagLine}` |

## Confirmed Scope

List the work confirmed to be part of this task.

- Set up a Spring Boot integration test class `RiotApiIntegrationTest` under package `com.analysisgg.modules.riotapi`.
- Annotate with `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` and `@AutoConfigureMockMvc`.
- Use a dynamic WireMock server instance started before all tests and stopped after all tests to prevent port conflicts.
- Redirect RestClient's outgoing calls to the local WireMock port by registering a custom `RestClientCustomizer` bean in a nested `@TestConfiguration` class. The customizer will replace the target URI scheme `"https://"` with `"http://localhost:<wiremockPort>/"` inside the `UriTemplateHandler` so that external hosts become the first path segment.
- Clear Caffeine cache state (via `CaffeineCacheAdapter.clear()`) and reset WireMock mappings (via `wireMockServer.resetAll()`) before each test execution to ensure isolation.
- Implement the following test cases:
  1. **Success Proxy Sync and Caching**: Verify that searching a Riot ID requests PUUID resolution, match list ingestion, and details fetching. Ensure that the correct response payload is mapped and returned, and that calling the endpoint a second time serves all data from the Caffeine cache directly, resulting in zero additional calls to WireMock.
  2. **Profile Not Found**: Verify that when Riot API returns `404 Not Found` for PUUID resolution, the proxy maps it to an HTTP `404 Not Found` response with correct payload.
  3. **Rate Limiting**: Verify that when Riot API returns `429 Too Many Requests`, the proxy maps it to an HTTP `429 Too Many Requests` response.
  4. **Partial Failure**: Verify that when fetching details for one match ID fails (e.g. returns 500 or times out), other match fetches still succeed and the controller returns a successful payload containing the subset of valid matches.

## Out of Scope

List related work that must not be done in this task.

- Writing frontend end-to-end/visual tests.
- Testing production properties or database persistence (no DB exists).

## Proposed Implementation Approach

Describe the future implementation approach using only confirmed information.

1. **Test Class Skeleton**:
   Create `RiotApiIntegrationTest.java` in `src/test/java/com/analysisgg/modules/riotapi/RiotApiIntegrationTest.java`.
   Apply class level annotations:
   - `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)`
   - `@AutoConfigureMockMvc`
   - `@ActiveProfiles("test")`

2. **WireMock and Cache Setup**:
   - Define a static `WireMockServer` instance.
   - In `@BeforeAll`, start the server on a dynamic port: `new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort())`. Configure WireMock's client using `WireMock.configureFor("localhost", wireMockServer.port())`.
   - In `@AfterAll`, stop the server.
   - Autowire `CaffeineCacheAdapter` and `MockMvc`.
   - In `@BeforeEach`, invoke `cacheAdapter.clear()` and `wireMockServer.resetAll()`.

3. **Routing Redirect Customizer**:
   Define a static inner `@TestConfiguration` class inside `RiotApiIntegrationTest`.
   Expose a `@Bean` returning a `RestClientCustomizer` that wraps the `RestClient.Builder`'s `UriTemplateHandler` with a custom implementation. The handler will substitute `"https://"` with `"http://localhost:" + wireMockServer.port() + "/"`.

4. **Stubbing Mock Endpoints**:
   Define helper methods for stubbing WireMock routes:
   - Profile resolution: `GET /americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` -> returns `{"puuid": "...", "gameName": "...", "tagLine": "..."}`
   - Match ID retrieval: `GET /americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids` -> returns `["BR1_1", "BR1_2"]`
   - Match details lookup: `GET /americas.api.riotgames.com/lol/match/v5/matches/{matchId}` -> returns match detail JSON string.

5. **Test Assertions**:
   Use `MockMvc` to perform requests and assert response bodies, HTTP status codes, and HTTP headers using JSONPath.
   Verify caching by asserting that WireMock receives exactly 1 request for external resources upon repeated MockMvc queries.
   Verify partial failures by stubbing one match endpoint to return 500, asserting that the response returned is still 200 OK containing only the successful match.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/test/java/com/analysisgg/modules/riotapi/RiotApiIntegrationTest.java` | Create | Confirmed | Task Spec / Design | Integration test class using MockMvc and WireMock |
| `docs/STATE.md` | Modify | Confirmed | Guideline | Document task execution state |
| `docs/features/riot-api-integration/tasks/008-add-integration-tests.md` | Modify | Confirmed | Guideline | Update task status |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. Create the new test file `RiotApiIntegrationTest.java` at `src/test/java/com/analysisgg/modules/riotapi/RiotApiIntegrationTest.java`.
2. Implement class declaration, class annotations, WireMock lifecycle hooks, autowired beans, and cleanups in `@BeforeEach`.
3. Add the static nested `@TestConfiguration` class with the `RestClientCustomizer` mapping.
4. Implement the success flow integration test (validating HTTP status 200, JSON structure, and Caffeine cache interception).
5. Implement the profile 404 mapping integration test.
6. Implement the rate-limiting 429 mapping integration test.
7. Implement the partial failure integration test where one match endpoint returns an error.
8. Execute Maven build command `mvn verify` (or `mvn clean test`) to confirm that all tests pass successfully.

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Spring Boot integration test class implemented. | Create `RiotApiIntegrationTest.java` with `@SpringBootTest` and `@AutoConfigureMockMvc`. | Class exists and executes in test suite. |
| WireMock mock server runs and mocks Riot API endpoints. | In `@BeforeAll`/`@AfterAll` hook lifecycle managing `WireMockServer`. | Test executes and logs WireMock client connections successfully. |
| Integration tests verify: Cache hit bypasses wire client; Cache miss requests wire client and saves results. | `shouldCachePlayerProfileAndMatchDetailsOnSubsequentRequests` asserts that WireMock receives only 1 call per external endpoint when MockMvc is executed twice. | JUnit assertions pass verifying cache hit. |
| Integration tests verify: Riot API 404 maps to HTTP 404. | `shouldMapRiotApi404ToHttpClient404` stubs profile resolution with 404 and asserts MockMvc returns 404. | MockMvc response status assertion is `.andExpect(status().isNotFound())`. |
| Integration tests verify: Riot API 429 maps to HTTP 429. | `shouldMapRiotApi429ToHttpClient429` stubs profile resolution with 429 and asserts MockMvc returns 429. | MockMvc response status assertion is `.andExpect(status().isTooManyRequests())`. |
| Integration tests verify: Parallel fetching works correctly under load. | Successful flow retrieves multiple match details concurrently using virtual threads. | Asserting that all fetched match details are aggregated in response. |
| Maven build passes all integration tests (`mvn clean verify` succeeds). | Run `mvn clean verify` on terminal. | Command output shows successful build execution with no failed tests. |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Success Flow with Caching | Integration (MockMvc + WireMock) | Verify the full player search proxy flow and assert that subsequent requests are served from cache. | Asserts WireMock calls are not duplicated. |
| Profile Not Found | Integration (MockMvc + WireMock) | Verify Riot Account API 404 is mapped to HTTP 404. | Uses WireMock stub status 404. |
| Rate Limit Exceeded | Integration (MockMvc + WireMock) | Verify Riot API 429 is mapped to HTTP 429. | Uses WireMock stub status 429. |
| Partial Match Details Failure | Integration (MockMvc + WireMock) | Verify that if 1 of N match detail requests fails, the remaining N-1 matches are successfully aggregated and returned with 200 OK. | Uses WireMock stub status 500 on one match ID. |
| Maven Build Verification | Automated | Execute full test suite via Maven lifecycle. | Runs `mvn verify`. |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- Requires `007-implement-riot-api-controller-and-validations.md` task to be completed.
- Spring Boot Test and WireMock Standalone dependencies configured in `pom.xml`.

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- **WireMock Port Collision**: Mitigation: configure WireMock to bind to a dynamic port (`0` or random) instead of a hardcoded port.
- **Cache Pollution**: Mitigation: invoke `cacheAdapter.clear()` in `@BeforeEach` to make tests self-contained and order-independent.
- **Port/Protocol Rewriting Reliability**: Mitigation: write the `RestClientCustomizer` `UriTemplateHandler` substitution carefully to ensure it handles all parameters correctly.

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- Delete the file `src/test/java/com/analysisgg/modules/riotapi/RiotApiIntegrationTest.java` to revert the test implementation.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

## Task Planning Readiness Checklist

- [x] Task file reviewed.
- [x] Feature context reviewed.
- [x] Feature Tech Spec coverage verified.
- [x] Technology decisions reviewed.
- [x] Applicable guidelines reviewed.
- [x] Existing decisions reviewed.
- [x] Local codebase references checked when applicable.
- [x] Task dependencies checked.
- [x] Execution eligibility documented.
- [x] Blocking decisions resolved.
- [x] Local feature/task decisions documented when needed.
- [x] Architecture/global decisions routed to ADR or `resolve-architecture-blocker` when needed.
- [x] Implementation approach defined.
- [x] Acceptance criteria mapped.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

Add concise handoff notes, source-reading reminders, sequencing constraints, and things the future `execute-task` agent must not assume.

- The custom `RestClientCustomizer` defined in the nested `@TestConfiguration` replaces `"https://"` with `"http://localhost:<wiremockPort>/"` inside the URI template expansion. The WireMock request matches will therefore need to include the host in the path (e.g. `/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1`).
- Ensure the test class is in package `com.analysisgg.modules.riotapi` so it gets scanned correctly and fits the cleanliness model of the project.
- Use WireMock's API `verify(moreThanOnce(getRequestedFor(...)))` or similar to explicitly verify request frequencies.
