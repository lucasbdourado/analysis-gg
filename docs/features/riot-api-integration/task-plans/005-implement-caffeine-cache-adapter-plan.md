# Task Implementation Plan: Implement Caffeine Cache Adapter

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/005-implement-caffeine-cache-adapter-plan.md`

## Task Reference

Task ID: `005-implement-caffeine-cache-adapter`

Task file: `docs/features/riot-api-integration/tasks/005-implement-caffeine-cache-adapter.md`

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
| Task file | `docs/features/riot-api-integration/tasks/005-implement-caffeine-cache-adapter.md` | Goal, Scope, AC, Risks | Confirmed by source document | Defines task scope and criteria |
| Feature file | `docs/features/riot-api-integration/feature.md` | Feature Goal, Scope, Risks | Confirmed by source document | Provides functional context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Concurrency & Caching, Proposed Technical Approach | Confirmed by source document | Defines caching TTLs and package layouts |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions (Caching) | Confirmed by source document | Confirms Caffeine Cache as the selected tech |
| Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | package-structure, infrastructure-layer | Confirmed by source document | Clean Architecture package guidelines |
| Caffeine Tech Reference | `docs/references/analysis-gg/technologies/caffeine.md` | Usage Guidelines, Examples | Confirmed by source document | Caffeine configuration specs |
| Local Decision | `docs/features/riot-api-integration/decisions/005-cache-keys-and-configuration.md` | Cache Key Design | Confirmed by user | Choice of type-safe record cache keys |

## Planning Scope

This planning session covers only Task 005 (Implement Caffeine Cache Adapter). It does not authorize implementation or modifications of other modules/features.

## Task Summary

Implement the Caffeine Cache configuration beans, the application-layer cache port interface (`PlayerProfileCachePort`), and the outbound Caffeine cache adapter (`CaffeineCacheAdapter`) to cache player profiles (RiotAccount) for 15 minutes and match summaries (MatchSummary) for 24 hours.

## Execution Eligibility

Status: Eligible

Reason:
This task depends on the completion of the Riot API client adapter task (004-implement-riot-api-client-adapter.md). The Riot API client adapter and its associated ports are fully implemented, compiled, and verified in the codebase. Therefore, this task is eligible for execution.

## Feature Context

To protect the application from exceeding Riot Games API rate limits (100 requests per 2 minutes on developer keys), the backend must cache resolved player profiles for 15 minutes and individual match details for 24 hours. This caching is crucial for the performance and reliability of the dashboard.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Architecture Notes | Full | `PlayerProfileCachePort` and `CaffeineCacheAdapter` layouts | Specifies package layout and dependencies |
| Proposed Technical Approach | Full | Eviction TTL configurations (15m profile, 24h match) | Defines eviction windows and size constraints |
| Performance Considerations | Full | Maximum cache sizes to prevent OOM | Caps profiles at 1000, matches at 10000 |

Coverage assessment:
- Justifying Tech Spec section: "Proposed Technical Approach" (subsection 4 "Concurrent Fetching & Caching") and "Performance Considerations" (subsection "Caching").
- Tech Spec sections implemented by this task: Caching and eviction policies.
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| **Java 21** | `technology-definition.md` | Implement using Java 21 syntax (e.g. records for keys, switch patterns if needed). |
| **Spring Boot 3.3.5** | `technology-definition.md` / `pom.xml` | Annotate adapter with `@Component` and configuration with `@Configuration` / `@Bean`. |
| **Caffeine Cache 3.1.8** | `technology-definition.md` / `pom.xml` | Configure eviction (expireAfterWrite), maximumSize, and build cache objects. |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Backend Clean Architecture Guidelines | `.agents/docs/architecture/coding-guidelines/` | Package structures and bean configurations | Directs code to be modular, keeps the port interface free of framework details, and places configuration under infrastructure. |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Riot API and Internal REST API Contracts | `docs/features/riot-api-integration/decisions/contracts.md` | Models `RiotAccount` and `MatchSummary` definitions | Contains exact fields for the domain objects being cached. |

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/domain/model/RiotAccount.java` | File existence and fields | Value type in profile cache | Contains `puuid`, `gameName`, `tagLine`. |
| `src/main/java/com/analysisgg/modules/riotapi/domain/model/MatchSummary.java` | File existence and fields | Value type in match cache | Contains parsed player statistics for a match. |
| `pom.xml` | Caffeine dependency presence | Libraries availability | Caffeine dependency is already present and active. |

## Confirmed Scope

- Define the `PlayerProfileCachePort` interface under `com.analysisgg.modules.riotapi.application.port`.
- Create cache key record classes `ProfileCacheKey` and `MatchSummaryCacheKey` under `com.analysisgg.modules.riotapi.adapter.out.cache`.
- Implement `CaffeineCacheAdapter` implementing `PlayerProfileCachePort` under `com.analysisgg.modules.riotapi.adapter.out.cache`.
- Create `CaffeineCacheConfig` configuration class under `com.analysisgg.modules.riotapi.infrastructure.cache` defining Caffeine cache beans:
  - Bean `"playerProfileCache"`: `Cache<ProfileCacheKey, RiotAccount>` (TTL 15m, maxSize 1000).
  - Bean `"matchSummaryCache"`: `Cache<MatchSummaryCacheKey, MatchSummary>` (TTL 24h, maxSize 10000).
- Write comprehensive unit tests for `CaffeineCacheAdapter` verifying caching behavior, cache hits, cache misses, and cache eviction.

## Out of Scope

- Implementing the orchestrator/usecase `SyncPlayerProfileUseCase` (reserved for Task 006).
- Integrating the caches in `RiotApiController` (reserved for Task 007).
- Persistent caching or database persistence.

## Proposed Implementation Approach

1. **Port Definition**: Create the `PlayerProfileCachePort` interface. Methods will return `Optional` to represent cache misses cleanly.
2. **Key Definitions**: Implement type-safe keys in the adapter layer. Key classes will use record definitions to benefit from automatically generated `equals()` and `hashCode()`.
3. **Caffeine Configuration**: Create a Spring `@Configuration` class to define `Cache` beans.
4. **Adapter Implementation**: Implement the port interface, delegating read/write/evict operations to the injected Caffeine cache beans.
5. **Testing**: Write unit/integration tests to verify that values are successfully put and retrieved, cache hits return the correct objects, and cache misses return empty Optionals.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/application/port/PlayerProfileCachePort.java` | Create | Confirmed | Task spec | Define interface port contract |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/ProfileCacheKey.java` | Create | Confirmed | Local decision | Custom record key for profile cache |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/MatchSummaryCacheKey.java` | Create | Confirmed | Local decision | Custom record key for match summary cache |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/CaffeineCacheAdapter.java` | Create | Confirmed | Task spec | Implement port delegating to Caffeine |
| `src/main/java/com/analysisgg/modules/riotapi/infrastructure/cache/CaffeineCacheConfig.java` | Create | Confirmed | Task spec | Caffeine Cache Spring beans configuration |
| `src/test/java/com/analysisgg/modules/riotapi/adapter/out/cache/CaffeineCacheAdapterTest.java` | Create | Confirmed | Task spec | Unit/integration tests for cache behavior |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. **Create the `PlayerProfileCachePort` interface** under `src/main/java/com/analysisgg/modules/riotapi/application/port/`.
2. **Create the `ProfileCacheKey` and `MatchSummaryCacheKey` record classes** under `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/`.
3. **Create the configuration class `CaffeineCacheConfig`** under `src/main/java/com/analysisgg/modules/riotapi/infrastructure/cache/` to define the Caffeine Cache beans (`playerProfileCache` and `matchSummaryCache`).
4. **Create the adapter class `CaffeineCacheAdapter`** under `src/main/java/com/analysisgg/modules/riotapi/adapter/out/cache/`, annotating it as a Spring `@Component` and implementing `PlayerProfileCachePort`. Inject both Caffeine cache beans via constructor injection.
5. **Write `CaffeineCacheAdapterTest`** under `src/test/java/com/analysisgg/modules/riotapi/adapter/out/cache/` to test cache read, write, hit, miss, and size evictions.
6. **Compile and run the maven build** (`mvn clean compile test`) to verify that the implementation builds successfully and all tests pass.

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Caffeine configurations build caches with proper eviction constraints (15 minutes for profile, 24 hours for matches). | `CaffeineCacheConfig` configured with `expireAfterWrite` and `maximumSize`. | Inspected and asserted in `CaffeineCacheAdapterTest` and configuration declarations. |
| `PlayerProfileCachePort` defined under `application.port`. | Pure Java port interface declared under `com.analysisgg.modules.riotapi.application.port`. | Verified file path and namespace. |
| `CaffeineCacheAdapter` implemented under `adapter.out.cache` and annotated as a Spring Component. | Class implemented, annotated, and using constructor injection. | Verified file path and Spring annotations. |
| Cache hit/miss operations are covered by unit/integration tests. | `CaffeineCacheAdapterTest` covers hits, misses, put, and evictions for both caches. | Run `mvn test` to verify test execution and assertions. |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Cache Operations | Unit | Validate cache hit, miss, write, and invalidate flow. | Verifies correct wrapping and delegation to Caffeine. |
| Size Limits | Unit | Verify that maximum size eviction behaves correctly. | Verify size bounds (1000 for profile, 10000 for match). |
| Build Integration | Manual | Verify the project compiles and tests pass via Maven. | Run `mvn clean test` on terminal. |

## Dependencies

- **Code dependency**: None (Riot account models are already implemented).
- **Execution dependency**: `004-implement-riot-api-client-adapter.md` (Already Implemented).

## Risks and Edge Cases

- **Memory Overhead**: Enforcing strict maximum size bounds (1000 and 10000) prevents cache growing unbounded.
- **Concurrent Access**: Caffeine's default `Cache` is inherently thread-safe.

## Rollback or Recovery Notes

- Since this task only creates new files and configuration beans, rollback simply requires deleting the created files. No database schema migrations or state updates are affected.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Cache Key Design | `docs/features/riot-api-integration/decisions/005-cache-keys-and-configuration.md` | Confirmed record cache key strategy |

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

- Caffeine cache instances must be declared using the exact types: `Cache<ProfileCacheKey, RiotAccount>` and `Cache<MatchSummaryCacheKey, MatchSummary>`.
- The port interface `PlayerProfileCachePort` should not have any Spring or Caffeine annotations (keep it pure Java/Clean Architecture).
- The adapter `CaffeineCacheAdapter` must be annotated with `@Component` (or `@Repository`) so it is picked up by Spring's component scanning.
