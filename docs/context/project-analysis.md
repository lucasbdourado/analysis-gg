# Project Analysis

## Purpose

This analysis document consolidates the conceptual planning, requirements validation, dependency mapping, and technical/operational risks for the greenfield Analysis.GG project. It serves as direct input for the upcoming `technology-definition` and `tech-spec` steps.

## Analysis Status

Status: Confirmed

Last updated: 2026-06-04

## Analysis Mode

Project scenario: Greenfield / No Codebase Available

Analysis basis: Requirements and conceptual planning

Codebase inspected: No

If no codebase was inspected, explain why: Greenfield project with no pre-existing codebase. We are performing conceptual requirement and architecture analysis.

## Source Documents

- [project-discover.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-discover.md)
- [project-structure.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-structure.md)
- [full-product-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/full-product-prd.md)
- [mvp-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/mvp-prd.md)
- [project-planning.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/planning/analysis-gg/project-planning.md)
- [docs/features/](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/features/)

## Project Overview

Analysis.GG is an integrated web-based analytics companion for League of Legends. It takes a user's Riot ID and region, resolves their account details, syncs their recent ranked matches via the Riot Games API, applies a 15-minute local cache to protect API limits, aggregates performance indicators (e.g. weekday-specific win rates, top champions), and renders a responsive dashboard. The system integrates a React frontend directly inside the main Java backend codebase.

## Business Domain Understanding

- **Target User**: Ranked League of Legends player ("Ranked Climber").
- **Core Need**: Move beyond raw individual match logs to spot high-level habits (e.g., "Do I play worse on Fridays after work?") and understand performance consistency.
- **Product Value**: Combines automated data fetching, local time conversion, and aggregated statistics calculations into an actionable companion.

## System Responsibilities

- **In Scope for MVP**:
  - Riot ID search and form validation.
  - Ingestion of Solo/Duo & Flex ranked matches from Riot API (Account-V1, Match-V5).
  - Recalculating metrics over range filters (last 20, 50, 100 games).
  - Local caching (15-min TTL) of summoner and match data.
  - Visualizing weekday win rates, a daily calendar win/loss grid, and a top champions table.
  - Serving and building the React client from the Java project packaging.
- **Out of Scope**:
  - Real-time in-game overlay utilities.
  - Video replay analysis or large logs storage.
  - Normal, ARAM, or Arena game mode analysis.
  - Consistency pattern analyzer and elo benchmarking (deferred post-MVP).

## Repository Analysis Summary

No codebase repository was analyzed because the project is in a greenfield state. The analysis is based on product requirements, planning documents, and user-provided layout constraints.

## Greenfield Requirements Analysis

- **Project objective**: Deliver a web application that compiles ranked match history to identify weekday trends, daily outcomes, and champion statistics.
- **Business domain**: League of Legends analytics.
- **Initial scope**: Search onboarding, API match synchronization, local caching, range filters, and dashboard visual widgets.
- **Expected deliverables**: An integrated Java JAR artifact containing both the backend service and the bundled frontend static assets.
- **Key requirements**: PUUID resolution, match detail retrieval, datetime conversions, and win/loss groupings.
- **Constraints**: 
  - React frontend must live inside `src/main/frontend` of the Java root project.
  - Secret Riot API key must not be exposed to the client.
  - Riot API rate limits (20 requests/1 sec, 100 requests/2 min).
- **Assumptions explicitly provided by the user**:
  - Frontend is React.
  - Backend is Java.
  - Folder layout is integrated (no standalone `backend` folder, frontend in `src/main/frontend`).
- **Open decisions**: Java REST framework, build tool, build integration plugins, React build template, charting libraries, caching solution.

## Expected Modules and Responsibilities

This structure is conceptual/proposed and was not detected from codebase.

| Proposed Module or Area | Expected Responsibility | Basis | Status | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend` | Renders search interface, charts, tables, and manages client dashboard state. | User-provided constraint | Proposed | Built using React. |
| `src/main/java` | Handles Riot API calls, mapping, controllers, endpoints, and caching. | User-provided constraint | Proposed | Written in Java. |
| `src/main/resources` | Contains application configurations and the build outputs of the React frontend. | Proposed | Proposed | Backend resources folder. |
| Root files (`pom.xml` / `build.gradle`) | Coordinates the integrated build and packaging. | Proposed | Proposed | Java build configuration. |

## Main Modules and Responsibilities

No modules exist in the codebase yet.

## Cross-Repository Dependencies

None (monorepo structure). External dependencies exist only for third-party libraries and the Riot Games API.

## Internal Dependencies

- `src/main/frontend` depends on the REST API exposed by `src/main/java` (endpoints like `/api/summoner/{gameName}/{tagLine}`).

## External Integrations

| Integration | Purpose | Evidence | Risk or Criticality | Notes |
| --- | --- | --- | --- | --- |
| Riot Games API | Fetching PUUID, match lists, and match details. | PRD / Planning | High | Subject to strict rate limits and key rotation. |

## Detected Technologies

No technologies were detected from codebase because no codebase exists.

## Technology Evidence

No codebase evidence is available.

## Technology Constraints and Pending Recommendations

| Area | Technology or Constraint | Status | Source | Notes |
| --- | --- | --- | --- | --- |
| Frontend | React | User constraint | User Input | Lives in `src/main/frontend`. |
| Backend | Java | User constraint | User Input | Lives in root folder. |
| API Ingestion | Riot Games API | Confirmed | PRD / Planning | Required for data synchronization. |
| Backend Framework | Spring Boot | Pending confirmation | Recommendation | Standard framework for Java REST APIs and static serving. |
| Build Tool | Maven or Gradle | Pending confirmation | Recommendation | Standard Java build systems. |
| Build Plugin | `frontend-maven-plugin` or similar | Pending confirmation | Recommendation | Integrates npm build commands with Java packaging. |
| Charting Library | Recharts or custom SVG | Pending confirmation | Recommendation | Standard charting for React widgets. |
| Caching Solution | Caffeine or ConcurrentHashMap | Pending confirmation | Recommendation | Fast, in-memory local caches suitable for MVP. |

## Existing Architectural Decisions

There are no existing architectural decisions observed from codebase.

## Architectural Patterns Observed

None (greenfield project).

## Code Organization Patterns

The project follows an integrated layout style where the Java codebase is the root project, and the React codebase lives inside the sub-directory `src/main/frontend`.

## Data and Persistence Analysis

- **Database needs**: The MVP does not require a persistent database. Player profiles and match details are fetched dynamically from the Riot API and cached for 15 minutes.
- **Cache scope**: Local, in-memory caching is sufficient for the MVP. If a user refreshes the page within 15 minutes, data will be served from the local cache instead of hitting the Riot API.

## API and Integration Analysis

The Java backend acts as an API proxy. It will expose REST endpoints (e.g. `/api/summoner/...`) and internally fetch data from the Riot API:
1. `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` to resolve the name to a PUUID.
2. `GET /lol/match/v5/matches/by-puuid/{puuid}/ids` to get the list of recent ranked match IDs.
3. `GET /lol/match/v5/matches/{matchId}` to retrieve details for each match.

## Security and Authentication Notes

- **Riot API Key Protection**: The Riot API key must be kept secret. The Java backend will fetch it from environment variables or a configuration properties file. The key will never be returned in HTTP response payloads to the client.
- **CORS Configuration**: During development, the React frontend dev server (typically port 5173) and the Java backend server (typically port 8080) will run separately. A proxy mapping (Vite dev proxy) must be configured to prevent CORS blockages.

## Testing Strategy Observed

Conceptual testing layout:
- Frontend: Vitest / React Testing Library for component rendering and state verification.
- Backend: JUnit / Mockito to mock Riot API responses and test caching/recalculation calculations.

## Build, Runtime and Deployment Notes

- **Build Pipeline**: The Java build system (Maven or Gradle) will run the React production build (`npm run build`) via a plugin. The output static assets (HTML/JS/CSS) will be copied to `src/main/resources/static` (or equivalent) so that the Java JAR can serve the frontend directly.
- **Deployment**: The single packaged JAR will run as an embedded server, making deployment simple (runnable on any VM or container environment).

## Documentation Gaps

- Local development setup instructions (configuring the proxy and injecting the Riot API key).

## Technical Risks

| Risk | Area | Evidence | Impact | Notes |
| --- | --- | --- | --- | --- |
| Riot API Rate Limiting | External Integration | PRD / Planning | High | Standard developer keys are limited (20 req/1 sec, 100 req/2 min). A dashboard refresh with 100 matches requires 100 API calls, easily hitting the limit. |
| Riot API Key Expiration | Operations | PRD / Planning | Medium | Developer keys expire every 24 hours. Uptime requires rotating keys manually or using a production API key. |
| Sync Latency | Performance | Proposed flow | Medium | Querying 50 or 100 matches sequentially from the Riot API can cause slow response times. Concurrent fetching or background syncs must be considered. |

## Maintenance Risks

- **API Changes**: Any contract updates from Riot Games API (e.g. Match-V5 changes) will require immediate modifications to the backend parser.

## Development Guidance

- Configure the local dev environment with Vite proxy enabled.
- Ensure the backend handles empty match results or invalid summoners gracefully.

## Bug Investigation Guidance

- Implement structured logging in the Java backend around Riot API HTTP status responses (e.g., logging 429 Rate Limit, 403 Forbidden/Expired Key, or 404 Summoner Not Found).

## Candidate ADRs

All candidates are future topics with status `Pending decision`:

| Candidate ADR | Proposed Topic | Reason |
| --- | --- | --- |
| integrated-react-java-build | Integration of build runner | Choose Maven vs Gradle and the corresponding frontend plugin. |
| java-backend-framework | Backend REST server | Confirm Spring Boot vs another framework. |
| local-caching-solution | Cache management | Decide between local cache libraries (e.g. Caffeine, Ehcache, or custom Map). |

## Inputs for `technology-definition`

- Confirming Java backend framework (Spring Boot is recommended).
- Confirming build tool (Maven vs Gradle).
- Confirming frontend plugin for integrated build.
- Confirming caching library.
- Confirming chart engine for React (Recharts vs custom SVG).

## Inputs for `project-planning`

- Planning is already confirmed (`project-planning.md`), but analysis confirms features MVP-F-001 through MVP-F-007 are aligned with this structure.

## Open Questions

- Do we use Gradle or Maven for the Java build system?
- Will Spring Boot be the Java backend framework?
- What local caching framework should be adopted in Java (e.g. Caffeine vs standard ConcurrentHashMap)?
- How will the API key configuration be injected securely in production?

## Notes for Next Steps

Recommend proceeding directly to `technology-definition` now that discovery, structure, and analysis context documents are complete and confirmed.
