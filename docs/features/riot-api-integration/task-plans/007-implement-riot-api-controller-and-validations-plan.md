# Task Implementation Plan: Implement Riot API Controller and Validations

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/007-implement-riot-api-controller-and-validations-plan.md`

## Task Reference

Task ID: `007-implement-riot-api-controller-and-validations`

Task file: `docs/features/riot-api-integration/tasks/007-implement-riot-api-controller-and-validations.md`

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
| Task file | `docs/features/riot-api-integration/tasks/007-implement-riot-api-controller-and-validations.md` | Entire document | Confirmed by source document | Defines goals and scope of controller |
| Feature file | `docs/features/riot-api-integration/feature.md` | Entire document | Confirmed by source document | Provides functional context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Proposed Technical Approach, State and Error Handling, Validation Rules | Confirmed by source document | Provides REST API definitions, expected status mapping, and validation constraints |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Establishes Java 21, Spring Boot, Clean Architecture, and Vanilla CSS stack |
| Package Structure Guideline | `.agents/docs/architecture/coding-guidelines/package-structure.md` | Interface Adapters package structures | Confirmed by source document | Directs modular folder organization |
| Interface Adapters Guideline | `.agents/docs/architecture/coding-guidelines/interface-adapters.md` | Controller and DTO conventions | Confirmed by source document | Establishes HTTP controller separation and validation responsibilities |
| DTOs e Mappers Guideline | `.agents/docs/architecture/coding-guidelines/dto-mapper-guidelines.md` | Mappers and DTO conventions | Confirmed by source document | Enforces separation of web request/response objects from domain entities |

## Planning Scope

Explain the exact boundary of this planning session. This plan covers one task only and does not authorize implementation.

This planning session covers only the design and implementation plan for the REST controller (`RiotApiController`), parameter validations, global exception mapping, mapper class, and unit tests under the package `com.analysisgg.modules.riotapi.adapter.in.web` in the `riot-api-integration` feature module. It does not cover other tasks, integration tests, or UI components.

## Task Summary

Expose the REST endpoint `/api/summoner/{gameName}/{tagLine}` via a Spring Boot RestController, applying path/query validations and translating domain exceptions to HTTP errors.

## Execution Eligibility

Status: Eligible

Reason:
- The single dependency `006-implement-sync-player-profile-usecase.md` has been successfully implemented and verified (all tests passed).

## Feature Context

The React frontend communicates with our proxy backend to load player statistics. The proxy REST controller must validate query parameters (region, count), invoke the synchronization use case, and return the compact `PlayerAnalyticsResponse` payload. It must also handle external errors (such as Riot API rate limits or profile not found) and map them to standard HTTP status codes.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| API or Interface Design | Full | Exposes `/api/summoner/{gameName}/{tagLine}` | Maps exactly to defined endpoint |
| Data Contracts | Full | Implements `PlayerAnalyticsResponse` and `MatchResponse` DTOs | Defines custom records to return to React client |
| State and Error Handling | Full | Maps exceptions to appropriate HTTP status codes (400, 404, 429, 500, 504) | Implemented via global exception advice |
| Validation Rules | Full | Validates Riot ID formats, region whitelist, and count range | Imposed via value object constructors and parameter constraints |

Coverage assessment:
- Justifying Tech Spec section: "API or Interface Design"
- Tech Spec sections implemented by this task: "API or Interface Design", "Data Contracts", "State and Error Handling", "Validation Rules"
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Java 21 | `technology-definition.md` | Uses modern language features such as records |
| Spring Boot 3.3.5 | `technology-definition.md` / `pom.xml` | Standard MVC controller and Exception Handler framework annotations |
| Maven | `technology-definition.md` / `pom.xml` | Used to run verification tests |
| Clean Architecture Package Layout | `technology-definition.md` / Guidelines | New files placed under `com.analysisgg.modules.riotapi.adapter.in.web` |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Interface Adapters | `.agents/docs/architecture/coding-guidelines/interface-adapters.md` | Incoming adapters (Controllers) | Directs that controllers have no business logic; validates format only |
| DTOs e Mappers | `.agents/docs/architecture/coding-guidelines/dto-mapper-guidelines.md` | Request/Response DTO mapping | Enforces use of web-specific DTO records and mapping layer |
| Package Structure | `.agents/docs/architecture/coding-guidelines/package-structure.md` | Project file structure | Directs package name and directory location |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Local Cache & API Proxy | `technology-definition.md` | Backend proxy is selected; API key is injected via environment variables |

No conflicting feature, ADR, or architecture decision was relevant to this task.

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `com/analysisgg/modules/riotapi/domain/valueobject/RiotId.java` | RiotId record constructor | Defines pattern regex and format validation | Throws `InvalidRiotIdException` |
| `com/analysisgg/modules/riotapi/domain/valueobject/Region.java` | Region record constructor | Defines region whitelist and normalization | Throws `UnsupportedRegionException` |
| `com/analysisgg/modules/riotapi/domain/exception` | Exception classes | Exceptions to map in `@RestControllerAdvice` | `InvalidRiotIdException`, `UnsupportedRegionException`, `PlayerNotFoundException`, `RateLimitExceededException`, `RiotApiException` |
| `com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java` | Use case orchestrator signature | Needs to be invoked by the controller | Method signature is `execute(RiotId, Region, int)` |
| `com/analysisgg/modules/riotapi/RiotApiModuleConfiguration.java` | Bean registrations | Registers application-layer components | RestController will be discovered automatically |

## Confirmed Scope

- Create `PlayerAnalyticsResponse` and `MatchResponse` DTO records under `com.analysisgg.modules.riotapi.adapter.in.web`.
- Create `RiotApiWebMapper` to map domain model `PlayerAnalytics` (and `MatchSummary`) to DTO response records.
- Create `RiotApiController` under `com.analysisgg.modules.riotapi.adapter.in.web` exposing `/api/summoner/{gameName}/{tagLine}`.
- Enforce validations:
  - Call `new RiotId(gameName, tagLine)` to validate paths (regex match).
  - Call `new Region(region)` to validate region (whitelist/normalization check).
  - Clamp `count` query param between 1 and 100 (defaults to 20).
- Create `RiotApiExceptionHandler` `@RestControllerAdvice` mapping:
  - `InvalidRiotIdException` -> HTTP 400 Bad Request
  - `UnsupportedRegionException` -> HTTP 400 Bad Request
  - `PlayerNotFoundException` -> HTTP 404 Not Found
  - `RateLimitExceededException` -> HTTP 429 Too Many Requests
  - `RiotApiException` -> HTTP 500 Internal Server Error (or HTTP 504 Gateway Timeout if message/cause contains timeout)
  - `org.springframework.web.client.ResourceAccessException` -> HTTP 504 Gateway Timeout (covers connection/read timeouts to Riot API)
- Create controller unit tests in `RiotApiControllerTest` using `MockMvc` and `@WebMvcTest(RiotApiController.class)`.

## Out of Scope

- Setting up WireMock-based integration tests (deferred to task `008-add-integration-tests`).
- Serving React static files (decoupled from this REST controller).

## Proposed Implementation Approach

1. **DTO Definition**:
   Create `PlayerAnalyticsResponse` and `MatchResponse` records inside `com.analysisgg.modules.riotapi.adapter.in.web` to define the JSON response schema for the React client.

2. **Web Mapper**:
   Create a `@Component` class `RiotApiWebMapper` to map domain classes to the web responses.

3. **Controller Implementation**:
   Implement `RiotApiController` annotated with `@RestController` and `@RequestMapping("/api/summoner")`.
   Inject `SyncPlayerProfileUseCase` and `RiotApiWebMapper`.
   Expose endpoint `GET /{gameName}/{tagLine}` mapping:
   - Path variables: `gameName`, `tagLine`
   - Query parameters: `region` (required request param), `count` (optional, default "20").
   Within the handler:
   - Validate and instantiate `RiotId` and `Region` using their constructors (which automatically enforce formats/whitelist rules).
   - Clamp the `count` value: `int clampedCount = Math.max(1, Math.min(100, count != null ? count : 20));`.
   - Invoke `syncPlayerProfileUseCase.execute(riotId, region, clampedCount)`.
   - Map domain `PlayerAnalytics` to `PlayerAnalyticsResponse` using the mapper, and return `ResponseEntity.ok(response)`.

4. **Exception Handling**:
   Create `RiotApiExceptionHandler` annotated with `@RestControllerAdvice(assignableTypes = RiotApiController.class)`.
   Implement `@ExceptionHandler` methods to translate domain exceptions to client-friendly JSON bodies (e.g. returning an `ErrorResponse(String error, String message)` record).
   - Map `InvalidRiotIdException` & `UnsupportedRegionException` -> 400 Bad Request
   - Map `PlayerNotFoundException` -> 404 Not Found
   - Map `RateLimitExceededException` -> 429 Too Many Requests
   - Map `ResourceAccessException` / `SocketTimeoutException` -> 504 Gateway Timeout
   - Map `RiotApiException` -> 500 Internal Server Error (or 504 if message indicates timeout)
   - Map general `Exception` -> 500 Internal Server Error

5. **Unit Testing**:
   Create `RiotApiControllerTest` annotated with `@WebMvcTest(RiotApiController.class)`.
   Inject `MockMvc` and use `@MockBean` to mock `SyncPlayerProfileUseCase` and `RiotApiWebMapper`.
   Cover paths:
   - Success path: valid request params returns 200 and maps correctly.
   - Validation failure: invalid Riot ID or region query returns 400.
   - Exception handling: mock the use case throwing `PlayerNotFoundException`, `RateLimitExceededException`, `RiotApiException`, and `ResourceAccessException` (timeout) and assert status codes.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/PlayerAnalyticsResponse.java` | Create | Confirmed | Tech Spec / Guideline | Web Response DTO record |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/MatchResponse.java` | Create | Confirmed | Tech Spec / Guideline | Match details response DTO record |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiWebMapper.java` | Create | Confirmed | Tech Spec / Guideline | Mapping component |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java` | Create | Confirmed | Task / Tech Spec | REST Controller exposing endpoint |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiExceptionHandler.java` | Create | Confirmed | Task / Tech Spec | Global exception mapper advice |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/ErrorResponse.java` | Create | Confirmed | Tech Spec / Best practice | Error JSON schema record |
| `src/test/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiControllerTest.java` | Create | Confirmed | Task / Tech Spec | MockMvc unit tests for controller |
| `docs/STATE.md` | Modify | Confirmed | Guideline | Track task execution state |
| `docs/features/riot-api-integration/tasks/007-implement-riot-api-controller-and-validations.md` | Modify | Confirmed | Guideline | Update task status |

## Implementation Steps

1. Create `PlayerAnalyticsResponse.java` and `MatchResponse.java` records under `com.analysisgg.modules.riotapi.adapter.in.web`.
2. Create `ErrorResponse.java` under `com.analysisgg.modules.riotapi.adapter.in.web` (e.g. `public record ErrorResponse(String error, String message) {}`).
3. Create `RiotApiWebMapper.java` under `com.analysisgg.modules.riotapi.adapter.in.web` with mappings `toResponse(PlayerAnalytics)` and `toMatchResponse(MatchSummary)`. Annotate it with `@Component`.
4. Create `RiotApiController.java` under `com.analysisgg.modules.riotapi.adapter.in.web`. Declare paths, inject usecase/mapper, implement validations (instantiating value objects and clamping count), and return response.
5. Create `RiotApiExceptionHandler.java` under `com.analysisgg.modules.riotapi.adapter.in.web`. Declare mappings for the exceptions and output `ErrorResponse` with appropriate HTTP status codes.
6. Create `RiotApiControllerTest.java` under `com.analysisgg.modules.riotapi.adapter.in.web`. Write tests using `MockMvc` and `@WebMvcTest`. Mock the use case and mapper.
7. Run `.\mvnw.cmd test` to compile and verify all unit tests pass.

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `RiotApiController` exposed and accepts lookups at `/api/summoner/{gameName}/{tagLine}`. | Controller defined with `@GetMapping("/{gameName}/{tagLine}")` mapping. | MockMvc calls to `/api/summoner/Ahri/123?region=br1` returns `200 OK`. |
| Endpoint validates Riot ID parameters using regular expressions. | Controller parses and invokes value objects which enforce regexes. | MockMvc calls with invalid gameName (e.g. `A`) returns `400 Bad Request`. |
| Whitelist filters regions and returns `400 Bad Request` on unsupported inputs. | Controller invokes `Region` VO which enforces whitelist. | MockMvc calls with unsupported region query (e.g. `invalid`) returns `400 Bad Request`. |
| Exceptions are translated to appropriate HTTP status codes (400, 404, 429, 500) using a RestControllerAdvice. | `@RestControllerAdvice` maps exceptions to HTTP codes. | MockMvc test cases asserting 404 on `PlayerNotFoundException`, 429 on `RateLimitExceededException`, etc. |
| Controller unit tests pass. | MockMvc tests created and run. | Execute `mvn test` verifying controller tests pass cleanly. |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Success GET endpoint | Unit (MockMvc) | Verify standard query performs validation, triggers usecase, maps results, and returns HTTP 200. | Assert JSON response structure match. |
| Invalid Game Name format | Unit (MockMvc) | Verify game name shorter than 3 characters triggers exception and maps to HTTP 400. | E.g. `/api/summoner/Ah/123` |
| Invalid Tag Line format | Unit (MockMvc) | Verify tagline longer than 5 characters triggers exception and maps to HTTP 400. | E.g. `/api/summoner/Ahri/123456` |
| Unsupported Region | Unit (MockMvc) | Verify invalid region parameter triggers exception and maps to HTTP 400. | E.g. `region=invalid` |
| Count clamping | Unit (MockMvc) | Verify count < 1 is clamped to 1, and count > 100 is clamped to 100. | Assert use case is called with clamped value. |
| Player not found | Unit (MockMvc) | Verify `PlayerNotFoundException` results in HTTP 404. | - |
| Rate limit exceeded | Unit (MockMvc) | Verify `RateLimitExceededException` results in HTTP 429. | - |
| Connection Timeout | Unit (MockMvc) | Verify `ResourceAccessException` results in HTTP 504. | - |
| Generic Exception | Unit (MockMvc) | Verify unhandled exceptions result in HTTP 500. | - |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- Dependency on task `006-implement-sync-player-profile-usecase.md` is complete.
- Spring Boot Starter Web and Test packages are configured in `pom.xml`.

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- **URL Parameter Encoding**: Space, dot, or hyphen characters in gameName might be encoded. Spring MVC's path routing handles path decoding automatically. Ensure tests include names with spaces/special characters (e.g. `/api/summoner/Ahri%20Solo/123`) to verify routing.
- **Null safety**: Ensure `region` parameter is required, and `count` parameter is clamped gracefully if null.

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- Delete the following created files to revert changes:
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/PlayerAnalyticsResponse.java`
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/MatchResponse.java`
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/ErrorResponse.java`
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiWebMapper.java`
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java`
  - `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiExceptionHandler.java`
  - `src/test/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiControllerTest.java`

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

- Use `@MockBean` from Spring Boot Test for mocking application beans in the controller test because Spring Boot version is 3.3.5.
- The `RiotId` and `Region` value objects must be used to perform formatting/whitelist validation inside the controller endpoint.
- For URL encoding, ensure that the MockMvc tests use `UriComponentsBuilder` or specify fully-encoded paths where appropriate to verify character handling.
- The controller advice should catch `ResourceAccessException` and map it to `504 Gateway Timeout`.
