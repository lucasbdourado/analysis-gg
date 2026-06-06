# Task Implementation Plan: Implement Riot API Client Adapter

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/004-implement-riot-api-client-adapter-plan.md`

## Task Reference

Task ID: `004-implement-riot-api-client-adapter`

Task file: `docs/features/riot-api-integration/tasks/004-implement-riot-api-client-adapter.md`

Task status: `Depends on Previous Task` (Task 003 is implemented, so this is eligible for execution)

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/004-implement-riot-api-client-adapter.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Defines core client requirements. |
| Feature file | `docs/features/riot-api-integration/feature.md` | Goal, Scope | Confirmed by source document | General functional context. |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Proposed Technical Approach, Integration Contracts, State and Error Handling | Confirmed by source document | Core regional routing rules, endpoint specs, and error mappings. |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Identifies Java 21, Spring Boot, and Clean Architecture. |
| Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | package-structure.md, application-layer.md, repositories-and-ports.md | Confirmed by source document | Principles of Clean Architecture and outbound integration adapters. |
| Contracts Decision | `docs/features/riot-api-integration/decisions/contracts.md` | 1, 2, 4, and 5 | Confirmed by source document | Mappings for RiotAccountDto, RiotMatchDto, and ApiErrorResponse. |
| User Decision (Port types) | Current Chat Session | Port signatures design | Resolved by user | Decided to use domain types (RiotId, Puuid, Region) for the port interface. |
| User Decision (Exceptions) | Current Chat Session | Error exceptions mapping | Resolved by user | Decided to create new domain exceptions (PlayerNotFoundException, RateLimitExceededException, RiotApiException). |

## Planning Scope

This plan covers task `004-implement-riot-api-client-adapter` only. It establishes the design and implementation approach for the outbound integration client adapter and domain exceptions. It does not authorize editing application code for other tasks (such as use cases, controllers, or caching).

## Task Summary

Define the `RiotApiClientPort` interface in the application layer and implement the `RiotApiClientAdapter` in the outbound adapter layer using Spring's `RestClient`. Add custom unchecked domain exceptions and unit tests using `RestClient` mock helpers.

## Execution Eligibility

Status: Eligible

Reason:
- Task `003-implement-domain-models-and-value-objects` has been completed and verified.
- The project compile and test phases succeed.

## Feature Context

To safely retrieve League of Legends player matches, the system must interact with the external Riot Games API. The client adapter handles authentication, translates regional routing mappings, manages timeouts, and maps HTTP error status codes into domain-specific exceptions, insulating the rest of the application from HTTP-specific details.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes (Regional routing, PUUID resolution, Match ID fetching, Match detail mapping) | Implements client integration details. |
| Integration Contracts | Full | Yes (Calls Riot API endpoints using X-Riot-Token) | Establishes the integration layer. |
| State and Error Handling | Full | Yes (Translates 404, 429, and other HTTP failures) | Maps HTTP status codes to domain exceptions. |
| Testing Strategy | Partial | Yes (RestClient mock response testing) | Unit tests the adapter layer. Integration/WireMock tests happen in 008. |

Coverage assessment:
- **Justifying Tech Spec section**: Proposed Technical Approach (items 1, 2, 3), State and Error Handling (timeout, 404, 429 mapping).
- **Tech Spec sections implemented by this task**: Outbound REST API Client integration.
- **Gaps between task and Tech Spec**: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Spring RestClient | `technology-definition.md` / `pom.xml` | RestClient will be used to make outgoing HTTP requests (part of Spring Boot 3.3.5 / Spring Framework 6.1). |
| Java 21 | `technology-definition.md` | Supports modern switch patterns, records, and cleaner code. |
| Environment Variable Injection | Task description | API key loaded via `@Value("${riot.api.key}")` mapped from `RIOT_API_KEY`. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | All backend packages | Enforces separation between application port and adapter integration layers. |
| Package Structure | `.agents/docs/architecture/coding-guidelines/package-structure.md` | Layer packages | Ports go under `application/port`; adapters go under `adapter/out/integration`. |
| Repositories and Ports | `.agents/docs/architecture/coding-guidelines/repositories-and-ports.md` | Port & Adapter design | Defines port interface design and implementation naming conventions. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Contracts Decision | `docs/features/riot-api-integration/decisions/contracts.md` | Specifies DTO schemas, package structure, and mapping logic. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/domain/valueobject` | `RiotId`, `Puuid`, `Region` records | Domain parameter types | Port interface will use these types instead of raw strings. |

## Confirmed Scope

- Create new custom domain exceptions under `com.analysisgg.modules.riotapi.domain.exception`:
  - `RiotApiException` (base exception)
  - `PlayerNotFoundException` (specific to 404 for accounts)
  - `RateLimitExceededException` (specific to 429)
- Define `RiotApiClientPort` interface in the application layer.
- Define outbound DTOs (`RiotAccountDto`, `RiotMatchDto`) and the mapping class `RiotMatchMapper` in the outbound adapter layer as defined in `contracts.md`.
- Implement `RiotApiClientAdapter` implementing `RiotApiClientPort` using Spring's `RestClient` with dynamic URL path construction, `X-Riot-Token` authorization header customizer, and regional route mapping.
- Add `application.properties` to configure `riot.api.key=${RIOT_API_KEY}`.
- Create comprehensive unit tests for `RiotApiClientAdapter` using Spring's `MockRestServiceServer` to verify endpoint requests, token injection, regional mapping, and exception translation.

## Out of Scope

- Implementing in-memory caching logic or cache configurations.
- Implementing the use case orchestrator.
- Implementing REST controllers or endpoint security.
- Persistent databases or data mapping to tables.

## Proposed Implementation Approach

1. **Exceptions Creation**:
   - Write standard unchecked custom exception classes inheriting from `RuntimeException` (with `RiotApiException` as base).
2. **Port Definition**:
   - Define `RiotApiClientPort` using domain type arguments (`RiotId`, `Puuid`, `Region`).
3. **DTOs and Mapper**:
   - Write `RiotAccountDto`, `RiotMatchDto` records and `RiotMatchMapper` static mapper as specified in `contracts.md`.
4. **Client Adapter**:
   - Create `RiotApiClientAdapter` and annotate as `@Component`.
   - Inject the Riot API key using `@Value("${riot.api.key}")`.
   - Build `RestClient` instance using `RestClient.builder().defaultHeader("X-Riot-Token", apiKey).build()`.
   - Map `Region` parameters to their corresponding regional API subdomains (`americas.api.riotgames.com`, `europe.api.riotgames.com`, `asia.api.riotgames.com`).
   - Implement methods:
     - `resolvePuuid(RiotId, Region)`: calls Riot Account-V1 `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`. Throws `PlayerNotFoundException` on HTTP 404.
     - `fetchMatchIds(Puuid, Region, int count)`: calls Riot Match-V5 `/lol/match/v5/matches/by-puuid/{puuid}/ids` with `start=0` and `count` parameter. We will query both Solo/Duo (queue 420) and Flex (queue 440) match lists, merge, remove duplicates, sort alphabetically (lexicographical sorting matches chronological ordering for Riot IDs), and truncate to the requested `count`.
     - `fetchMatchDetail(String matchId, Puuid targetPuuid, Region region)`: calls Riot Match-V5 `/lol/match/v5/matches/{matchId}` and maps to `MatchSummary` using `RiotMatchMapper.toDomain`.
   - For all calls, handle client and server errors:
     - Throw `RateLimitExceededException` on HTTP 429.
     - Throw `PlayerNotFoundException` on 404 only for profile resolution; throw `RiotApiException` on 404 for match details.
     - Throw `RiotApiException` for all other 4xx and 5xx responses.
5. **Unit Tests**:
   - Write unit tests using `@RestClientTest` or mock `RestClient` with `MockRestServiceServer`.
   - Mock response payloads for successful accounts, match lists, and match details.
   - Assert correct subdomains are resolved and `X-Riot-Token` is attached.
   - Mock error HTTP status codes (404, 429, 403, 500) and assert correct exceptions are thrown.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/domain/exception/RiotApiException.java` | Create | Confirmed | Chat decision | Base exception |
| `src/main/java/com/analysisgg/modules/riotapi/domain/exception/PlayerNotFoundException.java` | Create | Confirmed | Chat decision | For Account 404 |
| `src/main/java/com/analysisgg/modules/riotapi/domain/exception/RateLimitExceededException.java` | Create | Confirmed | Chat decision | For Rate Limit 429 |
| `src/main/java/com/analysisgg/modules/riotapi/application/port/RiotApiClientPort.java` | Create | Confirmed | Task | Application Layer Port Interface |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java` | Create | Confirmed | Task | Integration Client Outbound Adapter |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/dto/RiotAccountDto.java` | Create | Confirmed | `contracts.md` | DTO record for Account-V1 |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/dto/RiotMatchDto.java` | Create | Confirmed | `contracts.md` | DTO records for Match-V5 |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/mapper/RiotMatchMapper.java` | Create | Confirmed | `contracts.md` | Mapper to domain MatchSummary |
| `src/main/resources/application.properties` | Create | Confirmed | Task | Spring configuration properties |
| `src/test/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapterTest.java` | Create | Confirmed | Testing Strategy | Unit tests for client adapter |

## Implementation Steps

1. **Create Custom Exceptions**:
   - Create package `com.analysisgg.modules.riotapi.domain.exception` if needed.
   - Create `RiotApiException.java`, `PlayerNotFoundException.java`, and `RateLimitExceededException.java` inheriting from `RuntimeException` (or `RiotApiException`).
2. **Define Port Interface**:
   - Create package `com.analysisgg.modules.riotapi.application.port`.
   - Create `RiotApiClientPort.java` with the signatures using `RiotId`, `Puuid`, `Region`.
3. **Implement DTOs and Mappers**:
   - Create packages `com.analysisgg.modules.riotapi.adapter.out.integration.dto` and `com.analysisgg.modules.riotapi.adapter.out.integration.mapper`.
   - Create `RiotAccountDto.java`, `RiotMatchDto.java`, and `RiotMatchMapper.java` matching the specifications in `contracts.md`.
4. **Implement Caching/Properties Setup**:
   - Create directory `src/main/resources` if it does not exist.
   - Create `application.properties` and add `riot.api.key=${RIOT_API_KEY}`.
5. **Implement Client Adapter**:
   - Create package `com.analysisgg.modules.riotapi.adapter.out.integration`.
   - Create `RiotApiClientAdapter.java`.
   - Add mapping logic for whitelisted regions to Riot host names.
   - Inject `@Value("${riot.api.key}")`.
   - Build `RestClient` with token header.
   - Implement `resolvePuuid(RiotId, Region)` with `.onStatus` mapping.
   - Implement `fetchMatchIds(Puuid, Region, int count)` querying both queue `420` (Solo/Duo) and `440` (Flex), merging results, deduplicating, sorting, and slicing.
   - Implement `fetchMatchDetail(String, Puuid, Region)` calling `/lol/match/v5/matches/{matchId}` and returning mapped domain `MatchSummary`.
6. **Write Unit Tests**:
   - Create package `com.analysisgg.modules.riotapi.adapter.out.integration` under `src/test/java`.
   - Create `RiotApiClientAdapterTest.java` using `@RestClientTest` and `MockRestServiceServer`.
   - Write tests:
     - `shouldResolvePuuidSuccessfully`
     - `shouldThrowPlayerNotFoundExceptionOn404Profile`
     - `shouldThrowRateLimitExceptionOn429`
     - `shouldFetchAndDeduplicateMatchIds`
     - `shouldFetchMatchDetailsAndMapToDomain`
7. **Verify Compilation**:
   - Run `mvn clean test` to verify everything compiles and tests pass.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `RiotApiClientPort` defined under `application.port`. | Port interface created under `com.analysisgg.modules.riotapi.application.port`. | Verified in compilation and step 2. |
| `RiotApiClientAdapter` implemented under `adapter.out.integration`. | Class implements port interface. | Verified in compilation and step 5. |
| `X-Riot-Token` is dynamically appended via header customizer in `RestClient`. | Configured defaultHeader on RestClient build. | Verified by unit tests checking headers. |
| Regional routing mapping works according to the specified rules. | Switch/map logic in adapter converts Region to host. | Verified by unit tests checking requested URLs. |
| Basic unit tests exist for endpoint mappings using mock responses. | `RiotApiClientAdapterTest` covers mock requests. | Verified by running unit tests. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `RiotApiClientAdapterTest` | Unit | Asserts RestClient calls correct subdomains, formats path variables, attaches API key header, parses responses, merges/filters match lists, and maps exceptions correctly. | Uses MockRestServiceServer to mock HTTP endpoints. |
| `mvn clean test` | Automated CLI | Ensures all tests compile and execute successfully. | Standard Maven check. |

## Dependencies

- **Execution dependency**: `003-implement-domain-models-and-value-objects` must be completed and marked implemented. (Eligible now).

## Risks and Edge Cases

- **Rate Limits (429)**: The adapter must intercept 429 status code and throw `RateLimitExceededException` cleanly so that the use case can handle it (or let it bubble up to the controller exception translator).
- **Match list merge/sorting**: Riot's match lists are returned chronologically sorted (latest first) but using different queue filters (`queue=420` and `queue=440`) returns two lists. Merging them and sorting chronologically ensures the UI gets the actual latest matches. Since Riot match IDs contain regional prefixes and numbers (e.g. `BR1_123456789`), sorting them descending lexicographically works because higher numbers correspond to newer matches in the same region.
- **Empty results**: If a player has no matches, `fetchMatchIds` should return an empty list instead of failing.

## Rollback or Recovery Notes

- Rollback is possible by deleting the newly created adapter files, port interface, exceptions, resources, and tests.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Custom Domain Exceptions | `docs/features/riot-api-integration/task-plans/004-implement-riot-api-client-adapter-plan.md` | Establishes domain-level contract for API-specific errors. |
| Port signatures use domain value objects | `docs/features/riot-api-integration/task-plans/004-implement-riot-api-client-adapter-plan.md` | Enhances DDD layer separation and typesafety. |

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
- [x] Acceptance criteria mapping.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

- Ensure all imports to domain classes from the integration adapter are clean.
- Do not import Spring framework classes into domain exception classes.
- Use `RestClient` for outgoing HTTP requests.
- Configure `riot.api.key=${RIOT_API_KEY}` in `src/main/resources/application.properties` and handle cases where it might not be set.
- MockRestServiceServer is highly recommended for unit testing the RestClient calls in `RiotApiClientAdapterTest`.
