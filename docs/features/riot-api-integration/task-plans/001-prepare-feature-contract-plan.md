# Task Implementation Plan: Prepare Feature Contract and Proxy Configuration

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/001-prepare-feature-contract-plan.md`

## Task Reference

Task ID: `001-prepare-feature-contract`

Task file: `docs/features/riot-api-integration/tasks/001-prepare-feature-contract.md`

Task status: `Ready`

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/001-prepare-feature-contract.md` | All | Confirmed | Primary task scope |
| Feature file | `docs/features/riot-api-integration/feature.md` | Scope, Completion Criteria | Confirmed | Functional context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Integration Contracts, Data Contracts, API Design | Confirmed | Primary technical source |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed | Stack constraints |
| DTO Mapper Guidelines | `.agents/docs/architecture/coding-guidelines/dto-mapper-guidelines.md` | Rules, Examples | Confirmed | Architecture conventions |
| User Decision (Error Payload) | Current Chat Session | Custom Error Format | Confirmed | Textual error representation |
| User Decision (Deserialization) | Current Chat Session | Jackson Global Configuration | Confirmed | Configured on global ObjectMapper |
| Codebase Check | `src/main/frontend/vite.config.ts` | server.proxy config | Verified | Existing configuration |

## Planning Scope

This plan covers task `001-prepare-feature-contract` only. It establishes the JSON contract design reference and verifies local proxy settings. It does not authorize backend or frontend code changes.

## Task Summary

Verify that the local Vite development proxy is correctly configured to forward `/api` requests to Spring Boot on `http://localhost:8080`, and document the JSON request/response contracts for the Riot API integrations (Account-v1, Match-v5), the internal REST endpoint `/api/summoner/...`, and the custom API error payloads in `docs/features/riot-api-integration/decisions/contracts.md`.

## Execution Eligibility

Status: Eligible

Reason:
- This task has no dependencies (`Depends On: None`) and is the initial setup task for the feature.

## Feature Context

The Riot API Integration feature maps a player's Riot ID to their PUUID, fetches their recent ranked match IDs, and aggregates their match statistics. Because these operations cross multiple boundaries (React client -> Spring Boot proxy -> Riot Games API), we must finalize all data contracts and confirm that local frontend requests are proxying correctly before writing backend logic.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes (Documenting mappings & regional subdomains) | Finalizes the exact fields extracted from Match-v5 info. |
| Integration Contracts | Full | Yes (Mapping Riot endpoints to internal models) | Covers Account-v1, Match-v5, and internal REST API. |
| Data Contracts | Full | Yes (Specifying internal schemas and custom error JSON) | Aligns backend-to-frontend response payloads. |
| Validation Rules | Full | Yes (Documenting valid name, tagline, and region criteria) | Included in contracts design reference. |
| Compatibility and Migration Notes | Full | Yes (Verifying Vite configuration) | Ensures dev proxy is operational. |

Coverage assessment:
- **Justifying Tech Spec section**: "Integration Contracts", "Data Contracts", and "Proposed Technical Approach" define the endpoint URLs, schemas, and regional mappings.
- **Tech Spec sections implemented by this task**: finalizes integration mapping details, maps custom error responses, and inspects Vite config.
- **Gaps between task and Tech Spec**: None. The Tech Spec provides all necessary parameters, which are here formalized into concrete schemas.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Spring Boot (REST) | `technology-definition.md` | Shapes the `/api/summoner/...` REST endpoint structure. |
| Jackson Object Mapping | Current Chat Session | Configured globally to ignore unknown properties, avoiding deserialization errors on unused Riot fields. |
| Vite Dev Proxy | `technology-definition.md` | Requires verification of the proxy server configuration in `vite.config.ts`. |
| Clean Architecture | `tech-spec.md` / Coding Guidelines | Outbound adapter DTOs will map directly to domain entities/value objects, maintaining layer separation. |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| DTO Mapper Guidelines | `.agents/docs/architecture/coding-guidelines/dto-mapper-guidelines.md` | DTO layer separation | Mapped DTOs for Riot API belong to the outbound integration adapter; frontend response DTOs belong to the inbound web adapter. |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

```text
No existing feature, ADR, or architecture decision was relevant to this task.
```

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/vite.config.ts` | `server.proxy` block | Dev environment routing | Verified that `/api` maps to `http://localhost:8080` with `changeOrigin: true`. |

## Confirmed Scope

- Inspection of `src/main/frontend/vite.config.ts` to confirm proxy target settings.
- Creation of `docs/features/riot-api-integration/decisions/contracts.md` documenting:
  - Riot Account-v1 API JSON structure and mapping to `RiotAccount` domain record.
  - Riot Match-v5 API JSON structure (info, metadata, participant) and extraction mapping to `MatchSummary` record.
  - Spring Boot API `/api/summoner/{gameName}/{tagLine}?region={region}&count={count}` response DTO structure.
  - Custom API error payload structure (`timestamp`, `status`, `error`, `message`).
  - Validation parameters (Riot ID format, region whitelist, count range).
  - Global `ObjectMapper` configuration decision.

## Out of Scope

- Implementing Java backend controllers, use cases, domain entities, adapters, or DTOs.
- Modifying `pom.xml` dependencies.
- Writing unit, integration, or E2E tests.
- Modifying `vite.config.ts` (as the existing setup is already correct).

## Proposed Implementation Approach

1. **Vite Proxy Inspection**: Look at `src/main/frontend/vite.config.ts` and verify it contains the proxy block targeting `http://localhost:8080` for path `/api`.
2. **Contracts Design Reference Creation**: Draft a comprehensive decision and contract reference markdown file (`docs/features/riot-api-integration/decisions/contracts.md`) containing all confirmed schemas, error formats, validation rules, mapping logic, and ObjectMapper configuration rules.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/vite.config.ts` | Inspect | Confirmed | `tech-spec.md` | Verify proxy settings. |
| `docs/features/riot-api-integration/decisions/contracts.md` | Create | Confirmed | Task file AC | Design reference for developers and subagents. |

## Implementation Steps

1. **Verify Vite Proxy Configuration**:
   - Inspect `src/main/frontend/vite.config.ts`.
   - Confirm lines 8-15 contain:
     ```typescript
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:8080',
           changeOrigin: true,
         },
       },
     }
     ```
2. **Generate Contracts Reference File**:
   - Create parent directory `docs/features/riot-api-integration/decisions/` if it does not exist.
   - Write the finalized schemas and mapping specifications to `docs/features/riot-api-integration/decisions/contracts.md`.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Riot Account-v1 JSON schema mapped to internal domain model/value objects. | Covered in `contracts.md` section 1. | Mappings documented in `contracts.md`. |
| Riot Match-v5 JSON schema mapped, detailing fields for kills, deaths, assists, championId, championName, gameDuration, queueId, win, totalMinionsKilled, and neutralMinionsKilled. | Covered in `contracts.md` section 2. | Detailed JSON extraction paths specified in `contracts.md`. |
| Vite proxy configuration verified in `src/main/frontend/vite.config.ts`. | Covered in Step 1. | Confirmed in this plan (visually inspected). |
| Design reference file `docs/features/riot-api-integration/decisions/contracts.md` created with final schemas. | Covered in Step 2. | Verify file exists on disk with correct contents. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Visual Inspection | Manual | Verify Vite proxy settings in `vite.config.ts`. | Confirmed correct. |
| File Verification | Documentation | Verify that `docs/features/riot-api-integration/decisions/contracts.md` exists and contains correct markdown. | Checked during task completion. |

## Dependencies

- None. This is task 001.

## Risks and Edge Cases

- **Riot API payload drift**: Riot Games might update Match-v5 payload structures. Mitigated by disabling `FAIL_ON_UNKNOWN_PROPERTIES` on the global Spring Boot Jackson `ObjectMapper` so that extra fields do not cause deserialization exceptions.

## Rollback or Recovery Notes

- If the created document is incorrect, it can be edited or deleted safely as it only contains documentation.

## Pending Decisions

```text
None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.
```

## Questions for the User

```text
None. All task-relevant questions have been answered.
```

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Custom Error Payload Structure | `docs/features/riot-api-integration/decisions/contracts.md` | Standardizes how HTTP errors are returned to the React frontend. |
| Global Jackson Configuration | `docs/features/riot-api-integration/decisions/contracts.md` | Configures `ObjectMapper` globally to ignore unknown properties, mitigating Riot payload changes. |

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

- Do not implement any backend Java classes or controllers.
- Check that `src/main/frontend/vite.config.ts` contains the verified proxy setup.
- Write the exact content of `docs/features/riot-api-integration/decisions/contracts.md` as drafted in this planning session.
