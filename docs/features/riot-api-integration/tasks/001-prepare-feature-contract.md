# Task: Prepare Feature Contract and Proxy Configuration

## Status

Implemented

## Task ID

001-prepare-feature-contract

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Verify external Riot API request/response structures, finalize the internal response schema contracts, and confirm that the local development proxy (Vite to Spring Boot) is configured correctly.

## Context

Before writing any backend code, we must align the JSON contracts representing both the Riot API structures (Account-v1, Match-v5) and our backend-to-frontend response payload (`PlayerAnalyticsResponse`). We must also ensure that local frontend requests to `/api` proxy correctly to port `8080` where Spring Boot will run.

## Scope

- Document the exact mapping of Riot Account-v1 (by-riot-id) fields to internal representations.
- Document the exact mapping of Riot Match-v5 (by-match-id) fields to internal representations, detailing which elements are extracted to build `MatchSummary`.
- Verify the Vite configuration (`vite.config.ts`) to ensure the proxy server handles `/api` paths with the target pointing to `http://localhost:8080`.
- Document these contracts in a design reference file or markdown note for developers/subagents.

## Out of Scope

- Implementation of backend code or models.
- Adding Maven dependencies.

## Depends On

- None

## Blocking Reason

- None

## Required Action

- None

## Acceptance Criteria

- [x] Riot Account-v1 JSON schema mapped to internal domain model/value objects.
- [x] Riot Match-v5 JSON schema mapped, detailing fields for kills, deaths, assists, championId, championName, gameDuration, queueId, win, totalMinionsKilled, and neutralMinionsKilled.
- [x] Vite proxy configuration verified in `src/main/frontend/vite.config.ts`.
- [x] Design reference file `docs/features/riot-api-integration/decisions/contracts.md` created with final schemas.

## Implementation Notes

- Reference `docs/features/riot-api-integration/tech-spec.md` sections "Data Contracts" and "API or Interface Design".
- Avoid hardcoding any values. Keep configurations local and document any assumptions.

## Validation Notes

- Verify Vite proxy settings visually by inspection of `src/main/frontend/vite.config.ts`.
- Verify that `docs/features/riot-api-integration/decisions/contracts.md` exists and is formatted correctly.

## Risks

- Riot API payload change: Mitigate by focusing only on stable documented fields.

## Open Questions

- None

## Notes for Plan Task

- Read `tech-spec.md` sections on Integration Contracts and Data Contracts.
- Review existing `vite.config.ts`.
