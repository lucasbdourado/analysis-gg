# Task: Implement Domain Models and Value Objects

## Status

Implemented

## Task ID

003-implement-domain-models-and-value-objects

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create the Clean Architecture domain models, value objects, and domain exceptions under `com.analysisgg.modules.riotapi.domain`.

## Context

Following Clean Architecture principles, the domain layer must contain the core business rules and data models, fully isolated from web, caching, or database technologies. This ensures portability and makes business rules easier to unit test.

## Scope

- Create package structure under `src/main/java/com/analysisgg/modules/riotapi/domain`.
- Implement value objects:
  - `RiotId` (encapsulates Name#Tagline validation).
  - `Puuid` (encapsulates PUUID validation/format).
  - `Region` (encapsulates region whitelist: `br1`, `na1`, `euw1`, `eune1`, `kr`).
- Implement immutable models (records):
  - `RiotAccount` (puuid, gameName, tagLine).
  - `MatchSummary` (matchId, gameDuration, gameCreation, queueId, win, championId, championName, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled).
  - `PlayerAnalytics` (puuid, gameName, tagLine, region, list of MatchSummary).
- Implement domain exceptions:
  - `InvalidRiotIdException` (for validation failures).
  - `UnsupportedRegionException` (for region whitelist failures).

## Out of Scope

- Client interfaces, API integration adapters, or REST Controller mappings.

## Depends On

- `002-configure-maven-dependencies.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Immutable models (`RiotAccount`, `MatchSummary`, `PlayerAnalytics`) implemented as Java 21 `record`s.
- [x] Value objects validate inputs on instantiation (e.g. `Region` checks against the whitelist).
- [x] Domain objects do not import any framework annotations (e.g., Spring or Jackson).
- [x] Unit tests for `RiotId`, `Region`, and exception cases are implemented and pass.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` sections "Data Model", "Data Contracts", and "Validation Rules".
- Follow Java Clean Architecture coding guidelines (immutable domain, value objects validating inputs).

## Validation Notes

- Run unit tests verifying `RiotId` validation pattern `^[a-zA-Z0-9\s_.-]{3,16}$` and `^[a-zA-Z0-9]{3,5}$`.
- Run unit tests verifying `Region` rejects unsupported codes (e.g. `lan`, `las`).

## Risks

- Validation patterns too strict or too loose: Mitigate by matching Riot's official naming rules.

## Open Questions

- None

## Notes for Plan Task

- Make sure to review the Java coding guidelines in `.agents/docs/architecture/coding-guidelines/README.md`.
