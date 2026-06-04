# Project Discovery

## Purpose

This discovery document establishes the initial context, goals, and boundaries of the Analysis.GG project, acting as the foundation for the Harness codebase organization and mapping steps.

## Discovery Status

Status: Confirmed

Last updated: 2026-06-04

## Project Scenario

Scenario: Greenfield / No Codebase Available

Codebase status: Not yet created

Next workflow mode: Planning/conceptual analysis

Evidence basis:

- Codebase evidence: None (greenfield project)
- User-provided context: Current workspace directory, mandatory React frontend, mandatory Java backend, with frontend inside `src/main/frontend` and no separate backend directory (root is the Java project).
- Documents or planning sources: Full Product PRD, MVP PRD, Project Planning document, and MVP features.

## Discovery Interview

Record the user-provided answers gathered before generating this document.

- Project scenario confirmed by user: Greenfield / No Codebase Available
- Project location provided by user: Current local directory (`c:\Users\lucas.dourado\IdeaProjects\analysis-gg`)
- Codebase availability confirmed by user: Not yet created
- Project purpose provided by user: Listed in local files (web-based self-improvement ranked companion for League of Legends).
- Existing documentation provided by user: `full-product-prd.md`, `mvp-prd.md`, `project-planning.md`, and features under `docs/features/`.
- Related repositories, systems, or integrations provided by user: None (besides the Riot Games API).
- Greenfield objective, scope, constraints, deliverables, and open decisions provided by user: Core stats dashboard is the focus; user provided mandatory technologies (React for frontend, Java for backend).

## Project Location

- Local path: `c:\Users\lucas.dourado\IdeaProjects\analysis-gg`
- Remote repository URL: Not yet created (TBD)
- Storage location: Local workspace
- Availability: Local directory is accessible.

## Project Summary

Analysis.GG is a web-based League of Legends analysis tool designed to help individual players improve their ranked performance. Instead of just listing raw, post-match statistics, it aggregates played matches to identify recurring performance patterns, highlight consistency issues, and provide actionable insights. The platform features an interactive dashboard that details daily and weekly performance trends (e.g., weekday win rates), champion-specific win rates, and benchmark comparisons.

## Business Context

The product targets League of Legends players who want to climb the ranked ladder (Solo/Duo and Flex queues) by identifying their repeating negative patterns and benchmarking their metrics against master/challenger averages.

## Available Sources

- Full Product PRD: [full-product-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/full-product-prd.md)
- MVP PRD: [mvp-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/mvp-prd.md)
- Project Planning: [project-planning.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/planning/analysis-gg/project-planning.md)
- MVP Features: [docs/features/](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/features/)

## Greenfield Context

- Project objective: Deliver a web application that pulls a player's recent ranked games using their Riot ID and region, caching it for 15 minutes, and displaying an interactive dashboard.
- Business domain: Esports / Gaming analytics.
- Initial scope: Riot ID validation and search, Riot API Match-V5 sync, 15-minute caching, Range filter, Weekday win rate bar chart, Daily performance grid, Top champions table.
- Expected deliverables: Core data syncing backend, frontend search page, interactive performance dashboard.
- Known requirements: Described in MVP-F-001 through MVP-F-007.
- Constraints: Riot Games API access key constraints (rotates every 24h for dev keys), rate limits (20 req/sec, 100 req/2min).
- Mandatory technologies explicitly provided by the user: React (frontend), Java (backend).
- Prohibited technologies explicitly provided by the user: None specified.
- Decisions still open: Web server/framework (e.g. Spring Boot for Java backend), UI styling (Vanilla CSS vs Tailwind), chart rendering library, proxy configuration, deployment/hosting environment.
- Product context status: Existing source provided
- Notes for planning/conceptual analysis: Since this is greenfield, the upcoming structure and analysis steps must remain conceptual and propose/guide the directory/module layout rather than parsing nonexistent code.

## Repositories and Related Systems

Summarize the repository and system landscape.

## Main Repository

- Name: analysis-gg
- Location: `c:\Users\lucas.dourado\IdeaProjects\analysis-gg`
- Availability: Local directory initialized.
- Notes: Greenfield repository containing documents. No source code directories yet.

## Related Repositories

| Repository | Location | Relationship | Availability | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## Microservices

| Service | Repository or Location | Responsibility | Availability | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## Internal Libraries or Dependencies

| Name | Location | Relationship | Availability | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## External Integrations

| Integration | Purpose | Criticality | Notes |
| --- | --- | --- | --- |
| Riot Games API (Match-V5, Account-V1) | Ingesting match history and resolving Riot IDs to PUUIDs | High | Requires API key and caching to manage rate limits. |

## Known Technologies

| Technology | Area | Status | Source | Notes |
| --- | --- | --- | --- | --- |
| React | Frontend | User constraint | User Input | Mandatory frontend technology. |
| Java | Backend | User constraint | User Input | Mandatory backend technology. |
| Riot Games API | Integration | Confirmed | PRD / Planning | Core external integration. |

## Analysis Scope

- The local workspace structures (`docs/`, future source code directories).
- Conceptual frontend (React) and backend (Java) layout.

## Out of Scope

- Parsing or scanning nonexistent source code files.
- Integrating other game modes (ARAM, Arena, Normal).
- Consistency & Pattern Analyzer (deferred to Post-MVP).
- Elo Benchmark Engine (deferred to Post-MVP).

## Existing Documentation

| Document | Location | Type | Relevance | Notes |
| --- | --- | --- | --- | --- |
| Full Product PRD | `docs/product/analysis-gg/full-product-prd.md` | PRD | High | Outlines complete product capabilities and goals. |
| MVP PRD | `docs/product/analysis-gg/mvp-prd.md` | PRD | High | Focuses scope specifically for the MVP. |
| Project Planning | `docs/planning/analysis-gg/project-planning.md` | Planning | High | Details phases, MVP features, and delivery order. |

## Open Questions

- Which Java framework should be used? (e.g., Spring Boot is standard for Java backends).
- Which build tool should be used for the Java project? (Maven or Gradle).
- How will the React frontend and Java backend build steps be integrated? (e.g., using frontend-maven-plugin or frontend-gradle-plugin).
- How will the Riot API key be managed securely?
- Which charting library should be used in React? (e.g., Recharts, Chart.js, custom SVG).

## Inputs for the Next Step

- The `project-structure` step must use this discovery file to define a proposed conceptual structure for the React frontend and Java backend projects/modules. It must not attempt to scan nonexistent source files.

## Notes for `project-structure`

The next step (`project-structure`) should operate in a planning/conceptual mode because this is a greenfield project. It should propose the directory layout, module separations, configuration files, and setup templates for the React frontend and Java backend based on the constraints identified.
