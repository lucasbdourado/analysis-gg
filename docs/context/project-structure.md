# Project Structure

## Purpose

This structure document defines the proposed conceptual directory, module, and configuration layouts for the greenfield Analysis.GG project. It helps guide structural planning, upcoming analysis, technology definitions, and codebase setup.

## Structure Analysis Status

Status: Confirmed

Last updated: 2026-06-04

## Structure Mode

Project scenario: Greenfield / No Codebase Available

Structure basis: Conceptual/proposed structure from requirements

Codebase inspected: No

If no codebase was inspected, explain why: Greenfield project with no pre-existing codebase. We are defining the proposed conceptual structure.

## Source Documents

- [project-discover.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-discover.md)
- [full-product-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/full-product-prd.md)
- [mvp-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/mvp-prd.md)
- [project-planning.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/planning/analysis-gg/project-planning.md)
- [docs/features/](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/features/)

## Repositories Overview

No codebase repository was inspected (greenfield). The main workspace `analysis-gg` represents the Java project root (e.g., Maven/Gradle project) and the React frontend will live inside `src/main/frontend`.

## Repository Relationship Map

- **frontend** (Proposed React client located at `src/main/frontend`): The user interface which is packaged with the Java application or served/communicated with via REST APIs.
- **Java Root Project** (Backend & Packaging): The core Java application logic which proxies requests to the Riot Games API, applies local caching, exposes REST endpoints, and packages the frontend assets.
- **Riot Games API** (External Integration): Queried by the Java backend to fetch PUUID and match data.

```
[React Frontend Client (src/main/frontend)] ---> [Java Root Backend] ---> [Riot Games API]
```

## Main Repository

### Responsibility

Parent directory representing the Java backend project and workspace, hosting the Java build configuration, backend source code, documentation, and the integrated React frontend.

### Location

- Local path: `c:\Users\lucas.dourado\IdeaProjects\analysis-gg`
- Remote URL: Not yet created
- Availability: Local directory is accessible.

### Detected Technologies

No codebase evidence available.

### Important Files

No files were detected from codebase. Propose:

- `docs/context/project-discover.md` (Harness Context)
- `docs/context/project-structure.md` (Harness Context)
- `pom.xml` or `build.gradle` (Proposed root Java build configurations)

### Directory Overview

No directories detected from codebase besides `.agents/` and `docs/`. Propose:

- `src/main/frontend/` (Proposed React client workspace)
- `src/main/java/` (Proposed Java backend source code)
- `src/main/resources/` (Proposed Java backend resources and static assets)
- `docs/` (Harness product, planning, and context documentation)

### Entry Points

No codebase entry points. Propose:

- `src/main/frontend/src/main.jsx` (React Client Entry Point) (Proposed)
- `src/main/java/.../Application.java` (Java Spring Boot main class) (Proposed)

### Build and Dependency Management

No build tools detected in codebase. Propose:

- `src/main/frontend/package.json`: Dependency manager and script runner (npm, yarn, or pnpm) (Expected).
- `pom.xml` or `build.gradle` (in root): Java build and dependency files (Maven or Gradle) (Expected), configured with a frontend build plugin (e.g. frontend-maven-plugin).

### Configuration Files

None detected. Propose:

- `src/main/resources/application.yml` (Java/Spring Boot configuration) (Proposed)
- `src/main/frontend/vite.config.js` (React/Vite configuration) (Proposed)

### Test Structure

None detected. Propose:

- `src/main/frontend/src/**/*.test.jsx` (React unit and component tests) (Proposed)
- `src/test/java/` (JUnit/Mockito integration and unit tests) (Proposed)

### Documentation Structure

- `docs/context/` (Discovery, Structure, Analysis)
- `docs/product/` (PRDs)
- `docs/planning/` (Project planning)
- `docs/features/` (Feature definitions)

### Development Hotspots

- React components under `src/main/frontend/src/components/` (specifically the search screen, weekday charts, win/loss calendar grid, and top champions table).
- Java controllers/services under `src/main/java/` (Riot API ingestion client, caching logic, endpoint handlers).

### Bug Investigation Hotspots

- Java logging and error handling around the Riot API client wrapper (API key rotation, rate-limit retries).
- React API client/fetch utilities (CORS/endpoint URL configuration, response parsing, error state updates).

## Proposed Greenfield Structure

This structure is conceptual/proposed and was not detected from codebase.

| Area or Proposed Module | Expected Responsibility | Basis | Status | Open Questions |
| --- | --- | --- | --- | --- |
| `src/main/frontend/` | Renders search interface, charts, tables, and manages state. | User-provided constraint | Proposed | Vite vs Create-React-App |
| `src/main/java/` | Connects to Riot API, manages caching (15-min TTL), serves REST endpoints, packages frontend. | User-provided constraint | Proposed | Spring Boot vs raw Java Servlets |

## Planned Deliverables

| Deliverable | Expected Purpose | Basis | Status | Notes |
| --- | --- | --- | --- | --- |
| Frontend Assets Bundle | HTML, JS, CSS files built for production deployment (e.g., packaged into the Java jar static resources). | PRD / Planning | Proposed | Packaged static resources |
| Backend Executable JAR | Runnable Java application jar containing backend and embedded frontend. | PRD / Planning | Proposed | Executable container/jar |

## Related Repositories

| Repository | Location | Responsibility | Availability | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## Microservices

| Service | Location | Responsibility | Entry Points | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## Internal Libraries or Dependencies

| Name | Location | Relationship | Evidence | Notes |
| --- | --- | --- | --- | --- |
| None | N/A | N/A | N/A | N/A |

## External Integrations

| Integration | Evidence | Related Components | Notes |
| --- | --- | --- | --- |
| Riot Games API (Match-V5, Account-V1) | PRD / Planning | Backend proxy client | Handles summoner search and match fetching. |

## Cross-Repository Relationships

None (all components will live under the parent monorepo `analysis-gg` workspace).

## Technology Evidence

| Area | Technology | Evidence | Repository | Notes |
| --- | --- | --- | --- | --- |
| Frontend | React | User constraint | N/A | Decided by user. Lives in `src/main/frontend`. |
| Backend | Java | User constraint | N/A | Decided by user. Lives in Java project root. |
| API Integration | Riot Games API | PRD / Planning | N/A | Required by PRD. |
| Backend Framework | Spring Boot | Planned | N/A | Standard for Java REST APIs (Pending confirmation). |
| Build Tool (Backend) | Maven or Gradle | Planned | N/A | Standard Java build systems (Pending confirmation). |
| Charting Library | Recharts or custom SVG | Planned | N/A | React charting options (Pending confirmation). |

No codebase evidence is available.

## Important Conventions Observed

None yet (greenfield project).

## Missing or Unclear Structure Information

- None at this stage.

## Open Structure Decisions

- Choice of integration plugin (e.g., frontend-maven-plugin vs. frontend-gradle-plugin) to build React and package static resources with the Java application.
- Java build system selection (Maven `pom.xml` vs. Gradle `build.gradle`) in the root directory.
- React template selection (Vite React-TS vs. React-JS).
- Caching implementation structure in Java (local in-memory cache vs. separate Redis store).

## Inputs for the Next Step

`project-analysis` must analyze conceptual requirements, risks, planned modules, and planned dependencies using this conceptual structure and `project-discover.md`.

## Notes for `project-analysis`

The next step (`project-analysis`) must assess architecture and integration risks:
1. Local development proxy setup (mapping the React dev server to Java API endpoints during development).
2. Securing the Riot API Key (ensuring it is loaded via environment variables in the Java backend and not exposed to the frontend client).
3. Riot API rate limits and how the Java caching layer will mitigate it.
4. Packaging workflow configuration to ensure React build is embedded correctly in the final jar.
