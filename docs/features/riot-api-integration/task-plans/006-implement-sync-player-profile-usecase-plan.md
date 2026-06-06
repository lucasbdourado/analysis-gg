# Task Implementation Plan: Implement Sync Player Profile Use Case

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/006-implement-sync-player-profile-usecase-plan.md`

## Task Reference

Task ID: `006-implement-sync-player-profile-usecase`

Task file: `docs/features/riot-api-integration/tasks/006-implement-sync-player-profile-usecase.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/006-implement-sync-player-profile-usecase.md` | Scope, Acceptance Criteria, Implementation Notes | Confirmed by source document | Primary source for task boundaries |
| Feature file | `docs/features/riot-api-integration/feature.md` | Feature Goal, Expected Outcome, Scope | Confirmed by source document | Functional Context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Proposed Technical Approach, Architecture Notes, Flow Diagram | Confirmed by source document | Architectural blueprint and contracts |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions, Internal Guidelines | Confirmed by source document | Concurrency and backend stack decisions |
| Coding Guidelines | `.agents/docs/architecture/coding-guidelines/application-layer.md` | Exemplo de Use Case | Confirmed by source document | Application layer package rules |

## Planning Scope

This plan covers task `006-implement-sync-player-profile-usecase` only. It defines the implementation details, package organization, virtual thread concurrency orchestration, caching logic, and testing strategy for the `SyncPlayerProfileUseCase` class. It does not authorize editing application source code during this planning phase.

## Task Summary

Implement the orchestrator application service `SyncPlayerProfileUseCase` and its unit tests, executing parallel match detail fetching with Java 21 Virtual Threads and cache checks.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `005-implement-caffeine-cache-adapter.md`, which is already marked as `Implemented`. Therefore, once this plan is approved and saved, the task will be immediately eligible for execution.

## Feature Context

The Riot API Integration feature maps search queries (Riot ID and Region) to player stats. Since individual match detail fetches are I/O bound and can cause major latency bottlenecks (up to 10+ seconds for 50 matches), we use Java 21 Virtual Threads to fetch match details in parallel. To defend against Riot API rate limits (100 req / 2 min), player profiles and match summaries are cached before hitting the external Riot API.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes | Parallel fetching logic and cache orchestrations are fully covered. |
| Architecture Notes | Full | Yes | Implements `SyncPlayerProfileUseCase` inside the clean architecture `application/usecase` package. |
| State and Error Handling | Partial | Yes | Graceful failure mapping is defined here; HTTP translations occur in the controller (Task 007). |

Coverage assessment:
- **Justifying Tech Spec section**: Proposed Technical Approach (items 2, 3, 4, 5) and Flow Diagram.
- **Tech Spec sections implemented by this task**: `application/usecase/SyncPlayerProfileUseCase.java`.
- **Gaps between task and Tech Spec**: None.
- **Dependencies not specified by the Tech Spec**: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Java 21 | `technology-definition.md` | Use of records, switch expressions, and modern syntax features. |
| Virtual Threads | `technology-definition.md` | Use of `Executors.newVirtualThreadPerTaskExecutor()` for concurrent I/O. |
| Clean Architecture | Coding Guidelines | Keeping application service packages decoupled from Spring frameworks. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Backend Guidelines | `.agents/docs/architecture/coding-guidelines/application-layer.md` | Use Case definition | Dictates that UseCases must be pure Java classes without framework annotations. Decouples dependencies using constructor injection. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Caffeine Cache config | `infrastructure/cache/CaffeineCacheConfig.java` | Confirms cache names (`playerProfileCache` and `matchSummaryCache`). |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `domain/model` | `MatchSummary`, `PlayerAnalytics`, `RiotAccount` | Confirmed types, fields, and constructors. | Core records to build. |
| `domain/valueobject` | `RiotId`, `Region`, `Puuid` | Confirmed validation rules and format constraints. | Parameters needed by Use Case. |
| `application/port` | `PlayerProfileCachePort`, `RiotApiClientPort` | Confirmed port method signatures. | Ports to call from Use Case. |
| `adapter/out/cache` | `CaffeineCacheAdapter` | Checked cache implementations. | Already implemented. |
| `adapter/out/integration` | `RiotApiClientAdapter` | Checked fetcher methods. | Already implemented. |

## Confirmed Scope

- Create class `SyncPlayerProfileUseCase` in package `com.analysisgg.modules.riotapi.application.usecase`.
- Resolve Riot ID to PUUID by checking `PlayerProfileCachePort` first. On cache miss, resolve it via `RiotApiClientPort` and write back to cache.
- Fetch match ID list for Solo/Duo (420) and Flex (440) via `RiotApiClientPort.fetchMatchIds`.
- Orchestrate parallel fetching of individual match summaries for cache misses using Java 21 Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`).
- Cache newly resolved match summaries using `PlayerProfileCachePort`.
- Filter out failed match details (partial failures) gracefully by catching exceptions within the task threads, logging warnings, and proceeding.
- Register `SyncPlayerProfileUseCase` as a Spring `@Bean` in a Spring configuration class `RiotApiModuleConfiguration` to preserve clean separation.
- Add unit tests validating concurrent execution, cache checks, and partial failures.

## Out of Scope

- Implementing HTTP controllers, endpoints, or REST mappings.
- Setting up WireMock-based integration tests.

## Proposed Implementation Approach

1. **Instantiation**: `SyncPlayerProfileUseCase` will accept `RiotApiClientPort` and `PlayerProfileCachePort` in its constructor.
2. **Execute Method**:
   ```java
   public PlayerAnalytics execute(RiotId riotId, Region region, int count)
   ```
3. **PUUID Resolution Flow**:
   - Query `playerProfileCachePort.getProfile(riotId, region)`.
   - If present, use cached profile.
   - If absent, call `riotApiClientPort.resolvePuuid(riotId, region)`. Create `RiotAccount`, cache it via `playerProfileCachePort.putProfile`, and proceed.
4. **Fetch Match IDs**:
   - Call `riotApiClientPort.fetchMatchIds(puuid, region, count)`.
5. **Parallel Detail Fetching**:
   - Setup a `try-with-resources` block using `Executors.newVirtualThreadPerTaskExecutor()`.
   - For each match ID, query `playerProfileCachePort.getMatchSummary(matchId, puuid, region)`.
   - If cached, add a resolved `CompletableFuture` or pre-fetched result.
   - If not cached, submit a task to the executor:
     - Run `riotApiClientPort.fetchMatchDetail(matchId, puuid, region)`.
     - Put the result in `playerProfileCachePort.putMatchSummary`.
     - Return the mapped summary.
     - Catch exceptions within the thread, log, and return `null`.
   - When the try-with-resources block exits, all virtual threads have completed.
   - Aggregate all non-null `MatchSummary` records, create `PlayerAnalytics` and return.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java` | Create | Confirmed | Tech Spec / Coding Guidelines | Core use case file |
| `src/main/java/com/analysisgg/modules/riotapi/RiotApiModuleConfiguration.java` | Create | Confirmed | Tech Spec / Coding Guidelines | Spring bean configuration |
| `src/test/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCaseTest.java` | Create | Confirmed | Tech Spec | JUnit 5 Mockito unit tests |

## Implementation Steps

1. Create directory `src/main/java/com/analysisgg/modules/riotapi/application/usecase/` if it does not exist.
2. Create file `SyncPlayerProfileUseCase.java` with the orchestrating logic. Ensure no Spring framework annotations are present in this class.
3. Create `RiotApiModuleConfiguration.java` at `src/main/java/com/analysisgg/modules/riotapi/` containing `@Configuration` and a `@Bean` declaration for the use case.
4. Create test directory `src/test/java/com/analysisgg/modules/riotapi/application/usecase/`.
5. Implement unit tests in `SyncPlayerProfileUseCaseTest.java` verifying cache lookups, fallback API resolutions, parallel virtual threads executions, and partial failures.
6. Verify code compiles and unit tests pass by executing `mvn clean test`.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `SyncPlayerProfileUseCase` implemented and correctly processes lookups. | Full integration of Cache and API ports. | Unit tests asserting returned `PlayerAnalytics`. |
| Concurrent fetches are performed using Java 21 Virtual Threads. | Use of `Executors.newVirtualThreadPerTaskExecutor()`. | Unit tests asserting thread completion and execution model. |
| Match ID list merging filters for Solo/Duo and Flex, removes duplicate IDs, and truncates correctly. | Handled downstream by `RiotApiClientAdapter.fetchMatchIds`. | Unit tests verifying parameter forwarding and usecase integrity. |
| Match details are parsed to extract only the target player's statistics. | Handled downstream by `RiotApiClientAdapter.fetchMatchDetail`. | Unit tests verifying mapped results are returned. |
| Unit tests achieve high code coverage, mocking the client and cache adapter ports. | Coverage of hits, misses, exception recoveries. | Test results showing green execution. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `SyncPlayerProfileUseCaseTest` | Unit | Assert Use Case coordinates correct sequence (Cache hit/miss). | Mock cache and client ports. |
| `SyncPlayerProfileUseCaseTest` | Unit | Assert parallel virtual threads fetch match details on misses. | Mock slow calls and verify concurrency. |
| `SyncPlayerProfileUseCaseTest` | Unit | Assert partial failures do not fail the entire use case. | Simulate API exceptions on one match ID and verify others return. |

## Dependencies

- None. The Caffeine Cache Adapter (`005`) is already implemented.

## Risks and Edge Cases

- **Rate Limit Overflow on Misses**: If a user requests 100 matches and none are cached, we will run 100 concurrent API calls. This may temporarily trigger Riot's rate limit.
  *Mitigation*: The `RiotApiClientAdapter` handles `429` rate limit exceptions. In this use case, we handle individual failures gracefully so that even if some calls are rate-limited, the successfully fetched ones are returned.
- **Virtual Thread Resource Leak**: Ensure `try-with-resources` is used around `Executors.newVirtualThreadPerTaskExecutor()` to prevent leak of execution context.

## Rollback or Recovery Notes

- If issues are found, revert the files:
  - `src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java`
  - `src/main/java/com/analysisgg/modules/riotapi/RiotApiModuleConfiguration.java`
  - `src/test/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCaseTest.java`

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

- Always wrap `Executors.newVirtualThreadPerTaskExecutor()` in a `try-with-resources` block.
- Keep `SyncPlayerProfileUseCase` free of Spring framework annotations. Register it as a bean in `RiotApiModuleConfiguration`.
- Handle exceptions on fetching match details gracefully inside the thread task by logging and returning `null`.
