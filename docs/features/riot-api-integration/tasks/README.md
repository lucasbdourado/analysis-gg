# Task Breakdown: Riot API Integration

## Status

Confirmed

## Product Name

Analysis.GG

## Feature Reference

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Task Strategy

The Riot API Integration feature has been split into 8 focused, sequential tasks plus a final verification task. The strategy isolates configuration, domain modeling, downstream adapter implementations (Riot API Client, Caffeine Cache), the core application orchestration service, the REST controller layer, and end-to-end integration tests. This allows for step-by-step verification and prevents architectural bleed.

## Task List

| Order | Task File | Goal | Status | Depends On | Blocking Reason |
|---|---|---|---|---|---|
| 001 | `001-prepare-feature-contract.md` | Validate Riot API JSON responses, specify internal data contracts, and set up the Vite development proxy. | Ready | None | None |
| 002 | `002-configure-maven-dependencies.md` | Configure root `pom.xml` with dependencies for Spring Boot Starter Web, Caffeine cache, WireMock, and testing libraries. | Depends on Previous Task | `001-prepare-feature-contract.md` | None |
| 003 | `003-implement-domain-models-and-value-objects.md` | Create immutable domain records (`RiotAccount`, `MatchSummary`, `PlayerAnalytics`), value objects (`RiotId`, `Puuid`, `Region`), and exceptions. | Depends on Previous Task | `002-configure-maven-dependencies.md` | None |
| 004 | `004-implement-riot-api-client-adapter.md` | Build `RiotApiClientPort` and `RiotApiClientAdapter` with Spring `RestClient`, regional route mapping, and environment-based key auth. | Depends on Previous Task | `003-implement-domain-models-and-value-objects.md` | None |
| 005 | `005-implement-caffeine-cache-adapter.md` | Configure Spring-managed Caffeine cache instances and implement `PlayerProfileCachePort`/`CaffeineCacheAdapter` with configured TTLs. | Depends on Previous Task | `004-implement-riot-api-client-adapter.md` | None |
| 006 | `006-implement-sync-player-profile-usecase.md` | Build `SyncPlayerProfileUseCase` orchestrator with Virtual Threads parallel match ingestion, mapping logic, and unit tests. | Depends on Previous Task | `005-implement-caffeine-cache-adapter.md` | None |
| 007 | `007-implement-riot-api-controller-and-validations.md` | Expose REST endpoints with controller-level input validation, mapping to domain models, and global exception translation. | Depends on Previous Task | `006-implement-sync-player-profile-usecase.md` | None |
| 008 | `008-add-integration-tests.md` | Create MockMvc + WireMock integration tests to cover rate limit retry, cache hit/miss, thread execution, and API failures. | Depends on Previous Task | `007-implement-riot-api-controller-and-validations.md` | None |
| 999 | `999-verify-feature-completion.md` | Validate the complete feature behavior, verifying packaging, CORS proxy redirect, caching, and rate limiting. | Depends on Previous Task | All previous tasks | None |

## Suggested Execution Order

1. `001-prepare-feature-contract.md`
2. `002-configure-maven-dependencies.md`
3. `003-implement-domain-models-and-value-objects.md`
4. `004-implement-riot-api-client-adapter.md`
5. `005-implement-caffeine-cache-adapter.md`
6. `006-implement-sync-player-profile-usecase.md`
7. `007-implement-riot-api-controller-and-validations.md`
8. `008-add-integration-tests.md`
9. `999-verify-feature-completion.md`

## Blocked Tasks

| Task File | Blocking Reason | Required Action |
|---|---|---|
| None | None | None |

## Dependency Notes

- The project setup (`001`, `002`) provides the dependencies and Vite configuration required by all subsequent tasks.
- Domain models (`003`) are dependencies for the API Client (`004`) and Caching (`005`) adapters, which implement ports using domain models.
- The use case orchestrator (`006`) requires both adapters to satisfy its inbound ports.
- The controller (`007`) and integration tests (`008`) expose and verify the completed backend use case and endpoints.

## Notes for Plan Task

- Plan one task at a time.
- Read the task file and its source documents before creating a task implementation plan.
- Do not plan blocked tasks until their blocking reason is resolved.

## Notes for Execute Task

- Execute only from an approved task implementation plan.
- Validate each task against its acceptance criteria.
- Do not mark the feature complete until `999-verify-feature-completion.md` is satisfied.
