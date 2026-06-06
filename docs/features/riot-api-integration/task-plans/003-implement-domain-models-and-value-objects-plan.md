# Task Implementation Plan: Implement Domain Models and Value Objects

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/003-implement-domain-models-and-value-objects-plan.md`

## Task Reference

Task ID: `003-implement-domain-models-and-value-objects`

Task file: `docs/features/riot-api-integration/tasks/003-implement-domain-models-and-value-objects.md`

Task status: `Depends on Previous Task` (All prior tasks are implemented, so eligible for execution)

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/003-implement-domain-models-and-value-objects.md` | Goal, Scope, Acceptance Criteria | Confirmed | Defines core task requirements. |
| Feature file | `docs/features/riot-api-integration/feature.md` | Goal, Scope | Confirmed | General functional context. |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Architecture Notes, Validation Rules | Confirmed | Core package layouts, validation constraints, and records structure. |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed | Identifies Java 21 and Clean Architecture standards. |
| Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | Camada de Domínio, Estrutura de Pacotes | Confirmed | Principles of domain purity and modular package layouts. |
| Contracts Decision | `docs/features/riot-api-integration/decisions/contracts.md` | 1, 2, and 5 | Confirmed | Field definitions for RiotAccount, MatchSummary, and PlayerAnalytics. |

## Planning Scope

This planning session covers only the implementation of pure Clean Architecture domain objects (value objects, models, and exceptions) and their corresponding unit tests. No controllers, HTTP clients, caches, or Spring configurations will be created in this task.

## Task Summary

Implement the package structure and Java 21 `record` classes for the domain layer under `com.analysisgg.modules.riotapi.domain`, covering domain models, value objects, exceptions, and unit tests.

## Execution Eligibility

Status: Eligible

Reason:
The parent task `002-configure-maven-dependencies` has been successfully implemented, and the root `pom.xml` is fully configured and compiling.

## Feature Context

To ensure the backend application scales gracefully, the core domain rules must be fully isolated from frameworks (such as Spring Boot) or mapping libraries (Jackson). The value objects validate incoming data at the domain boundary, preventing illegal states (e.g. invalid Riot ID strings or unsupported regions) from propagating.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Architecture Notes | Full | Domain models and value objects packaged correctly | Package layout maps to guidelines. |
| Data Contracts | Full | MatchSummary, RiotAccount, PlayerAnalytics records | Fields match defined JSON formats. |
| Validation Rules | Full | RiotId and Region input validation rules | Regex and region whitelist checks. |

Coverage assessment:
- **Justifying Tech Spec section**: Architecture Notes (Clean Architecture package layout), Validation Rules.
- **Tech Spec sections implemented by this task**: Package structures under `domain/`, data schemas for models.
- **Gaps between task and Tech Spec**: None.
- **Dependencies not specified by the Tech Spec**: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Java 21 | `technology-definition.md` | Restricts codebase to Java 21 features (e.g. records, pattern matching). |
| Value Objects as Records | User Confirmation | Value objects (`RiotId`, `Puuid`, `Region`) will be implemented as Java 21 `record`s instead of final classes to minimize boilerplate. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | All backend packages | Enforces domain purity (no framework imports like Spring/Jackson in domain files). |
| Domain Layer | `.agents/docs/architecture/coding-guidelines/domain-layer.md` | Models, value objects, exceptions | Guides structure of immutable models, compact constructor validation patterns. |
| Package Structure | `.agents/docs/architecture/coding-guidelines/package-structure.md` | Subpackages | Restricts packages to `domain/model`, `domain/valueobject`, and `domain/exception`. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Contracts Decision | `docs/features/riot-api-integration/decisions/contracts.md` | Defines exact fields for `RiotAccount`, `MatchSummary`, and `PlayerAnalyticsResponse` mappings. |

## Local Codebase References

No Java codebase exists yet since this is a greenfield project setup. The source packages will be initialized under `src/main/java/com/analysisgg/modules/riotapi/domain` during execution.

## Confirmed Scope

- Create package structures for domain components.
- Implement value objects (`RiotId`, `Puuid`, `Region`) as immutable Java 21 `record`s.
- Implement domain exceptions (`InvalidRiotIdException`, `UnsupportedRegionException`) as standard unchecked exceptions.
- Implement domain models (`RiotAccount`, `MatchSummary`, `PlayerAnalytics`) as immutable Java 21 `record`s.
- Add comprehensive JUnit 5 unit tests for all domain models, value objects, and exception flows.

## Out of Scope

- Client interfaces, API integration adapters, REST controllers, caching configurations, or JSON mapper setups.

## Proposed Implementation Approach

1. **Package Creation**:
   - `com.analysisgg.modules.riotapi.domain.model`
   - `com.analysisgg.modules.riotapi.domain.valueobject`
   - `com.analysisgg.modules.riotapi.domain.exception`
2. **Domain Exceptions**:
   - `InvalidRiotIdException` (extends `RuntimeException`)
   - `UnsupportedRegionException` (extends `RuntimeException`)
3. **Value Objects Validation Logic**:
   - `RiotId` compact constructor: validates `gameName` matches `^[a-zA-Z0-9\s_.-]{3,16}$` and `tagLine` matches `^[a-zA-Z0-9]{3,5}$`. Include `parse(String)` for `"Name#Tag"` parsing.
   - `Region` compact constructor: trims and normalizes to lowercase, validates against whitelist: `br1`, `na1`, `euw1`, `eune1`, `kr`.
   - `Puuid` compact constructor: validates non-null and non-blank.
4. **Domain Models**:
   - `RiotAccount` (fields: `String puuid`, `String gameName`, `String tagLine`)
   - `MatchSummary` (fields: `String matchId`, `long gameDuration`, `long gameCreation`, `int queueId`, `boolean win`, `int championId`, `String championName`, `int kills`, `int deaths`, `int assists`, `int totalMinionsKilled`, `int neutralMinionsKilled`)
   - `PlayerAnalytics` (fields: `String puuid`, `String gameName`, `String tagLine`, `String region`, `List<MatchSummary> matches`)
5. **Unit Tests**:
   - Test validation passes on valid entries.
   - Test exceptions thrown on invalid inputs (invalid regex, unsupported regions, null/blank bounds).

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/java/com/analysisgg/modules/riotapi/domain/exception/InvalidRiotIdException.java` | Create | Confirmed | Task | Custom domain exception |
| `src/main/java/com/analysisgg/modules/riotapi/domain/exception/UnsupportedRegionException.java` | Create | Confirmed | Task | Custom domain exception |
| `src/main/java/com/analysisgg/modules/riotapi/domain/valueobject/RiotId.java` | Create | Confirmed | Task | Record value object with pattern validation |
| `src/main/java/com/analysisgg/modules/riotapi/domain/valueobject/Puuid.java` | Create | Confirmed | Task | Record value object with presence validation |
| `src/main/java/com/analysisgg/modules/riotapi/domain/valueobject/Region.java` | Create | Confirmed | Task | Record value object with whitelist validation |
| `src/main/java/com/analysisgg/modules/riotapi/domain/model/RiotAccount.java` | Create | Confirmed | Task | Record domain model |
| `src/main/java/com/analysisgg/modules/riotapi/domain/model/MatchSummary.java` | Create | Confirmed | Task | Record domain model |
| `src/main/java/com/analysisgg/modules/riotapi/domain/model/PlayerAnalytics.java` | Create | Confirmed | Task | Record domain model |
| `src/test/java/com/analysisgg/modules/riotapi/domain/valueobject/RiotIdTest.java` | Create | Confirmed | Task | Unit tests for Riot ID formats |
| `src/test/java/com/analysisgg/modules/riotapi/domain/valueobject/RegionTest.java` | Create | Confirmed | Task | Unit tests for region whitelist and normalization |
| `src/test/java/com/analysisgg/modules/riotapi/domain/valueobject/PuuidTest.java` | Create | Confirmed | Task | Unit tests for Puuid validation |
| `src/test/java/com/analysisgg/modules/riotapi/domain/model/DomainModelsTest.java` | Create | Confirmed | Task | Verification of record immutability and fields |

## Implementation Steps

1. Create target packages under `src/main/java` and `src/test/java`.
2. Write exception classes `InvalidRiotIdException` and `UnsupportedRegionException` under `com.analysisgg.modules.riotapi.domain.exception`.
3. Write `RiotId` record under `com.analysisgg.modules.riotapi.domain.valueobject`.
4. Write `Puuid` record under `com.analysisgg.modules.riotapi.domain.valueobject`.
5. Write `Region` record under `com.analysisgg.modules.riotapi.domain.valueobject`.
6. Write model records `RiotAccount`, `MatchSummary`, and `PlayerAnalytics` under `com.analysisgg.modules.riotapi.domain.model`.
7. Write unit tests under `src/test/java` verifying all validation, normalization, and parsing rules.
8. Run `mvn clean test` to ensure compilation and all unit tests pass.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Immutable models (`RiotAccount`, `MatchSummary`, `PlayerAnalytics`) implemented as Java 21 `record`s. | Full | Implemented as records under `domain/model`. Verified by compiler checks and model unit tests. |
| Value objects validate inputs on instantiation (e.g. `Region` checks against the whitelist). | Full | Regex checks in `RiotId`, whitelist checks in `Region`, non-blank check in `Puuid`. Verified by unit tests. |
| Domain objects do not import any framework annotations (e.g., Spring or Jackson). | Full | Code verification. No external imports besides JDK standard library in the domain classes. |
| Unit tests for `RiotId`, `Region`, and exception cases are implemented and pass. | Full | Targeted unit tests covering normal runs, validation errors, and custom exception checking. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `RiotIdTest` | Unit | Asserts correct gameName/tagLine validation, regex correctness, and `RiotId.parse()` behavior. | Verifies correct exceptions are thrown for bad formats. |
| `RegionTest` | Unit | Asserts region whitelist validation and normalization (casing/spaces). | Ensures only `br1`, `na1`, `euw1`, `eune1`, `kr` are accepted. |
| `PuuidTest` | Unit | Asserts PUUID is non-null and non-blank. | Standard protection. |
| `DomainModelsTest` | Unit | Verifies fields, constructors, and immutability for `RiotAccount`, `MatchSummary`, `PlayerAnalytics`. | Simple getter/equality tests. |
| `mvn clean test` | Automated CLI | Ensures the entire module compiles and tests execute cleanly. | Executed after writing tests. |

## Dependencies

- **Execution dependency**: `002-configure-maven-dependencies` must be marked as implemented (already done).

## Risks and Edge Cases

- **Strict Validation Patterns**: Riot Games allows spaces, hyphens, and dots in game names. The regex `^[a-zA-Z0-9\s_.-]{3,16}$` must handle spaces and allowed special characters correctly. Unit tests will cover names containing these characters (e.g., `"T1 Faker"`, `"Doublelift"`).
- **Casing and Spaces in Region**: Whitelist validation must tolerate trailing spaces or mixed-case queries (e.g., `"BR1 "` or `"Kr"`), normalizing them to lowercase.

## Rollback or Recovery Notes

- All changes are local new files. A rollback can be safely executed by deleting the newly created package directory `com/analysisgg/modules/riotapi/domain` under both `src/main/java` and `src/test/java`.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Use Java 21 `record`s for value objects | `docs/features/riot-api-integration/task-plans/003-implement-domain-models-and-value-objects-plan.md` | Reduces boilerplate for immutable value object structures. |

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

- Ensure no Spring Boot or Jackson imports leak into the classes under `com.analysisgg.modules.riotapi.domain`.
- Use JUnit 5 and AssertJ assertions in the unit tests.
- When validation fails in compact constructors, throw the specific domain exceptions (`InvalidRiotIdException` or `UnsupportedRegionException`) rather than generic runtime exceptions where possible, except for `Puuid` which throws `IllegalArgumentException`.
