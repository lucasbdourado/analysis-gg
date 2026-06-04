# Technology Definition: Analysis.GG

## Status

Status: Confirmed

Technology definition readiness: Ready for Tech Spec

Last updated: 2026-06-04

Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Source Documents

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Project Planning | [project-planning.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/planning/analysis-gg/project-planning.md) | Planning | Confirmed | Primary source |
| MVP PRD | [mvp-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/mvp-prd.md) | MVP PRD | Confirmed | Product source |
| Full Product PRD | [full-product-prd.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/product/analysis-gg/full-product-prd.md) | Full Product PRD | Confirmed | Product roadmap |
| Project Discovery | [project-discover.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-discover.md) | Discovery | Confirmed | Core constraints |
| Project Structure | [project-structure.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-structure.md) | Structure | Confirmed | Monorepo layout |
| Project Analysis | [project-analysis.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/context/project-analysis.md) | Analysis | Confirmed | Risk identification |

## Definition Scope

Project-level technology definition specifying language, frameworks, build system, packaging, caching, and visualization choices for the initial MVP release of the **Analysis.GG** application.

Target output path: `docs/architecture/analysis-gg/technology-definition.md`

Technology reference path pattern: `docs/references/analysis-gg/technologies/<technology-name>.md`

## Planning Summary

The MVP delivers a single-page React client served by a Java/Spring Boot proxy backend. Key features include searching LoL players, fetching Solo/Duo & Flex match histories, applying 15-minute caches to avoid Riot API limits, and displaying daily performance grids, weekday win-rate charts, and top champions tables.
- **Phase 1**: Onboarding search UI, Riot API ingestion client, and backend caching.
- **Phase 2**: Dashboard layout, range filter, weekday win rate chart, daily grid calendar, top champions table.

## Project Scenario

Scenario: Greenfield / No Codebase Available

Codebase inspected: No (Project contains only Harness configuration and docs directories).

## Technology Decision Principles

```text
The agent recommends.
The user decides.
```

- Technologies detected from clear codebase evidence are existing confirmed decisions.
- Technologies explicitly required by the user are confirmed decisions or user constraints.
- Technologies inferred from PRD, planning, feature files, or requirements are pending recommendations until confirmed.
- Pending, rejected, or deferred technologies must not be treated as confirmed.
- Context7 documentation is captured only for confirmed or explicitly selected technologies.
- Unclear technology needs remain open questions.

## Feature Technology Needs

| Feature | Technology Need | Reason | Priority | Status |
| --- | --- | --- | --- | --- |
| **Riot ID Search Input** (MVP-F-001) | Frontend form + Validation | Standard form validations and redirect engine | Must | Confirmed by user |
| **Riot API Integration** (MVP-F-002) | Backend client + JSON parser | Query Account-V1 & Match-V5 endpoints and parse payloads | Must | Confirmed by user |
| **Match Range Filter** (MVP-F-003) | React state coordination | Slice match list (20/50/100) and sync widgets | Must | Confirmed by user |
| **Weekday Win Rate Bar Chart** (MVP-F-004) | Chart visualization + Timezone conv. | Render weekday win rate percentages and tooltips | Must | Confirmed by user |
| **Daily Performance Grid** (MVP-F-005) | Flexbox/Grid CSS + Date grouping | Display wins/losses calendar grid | Must | Confirmed by user |
| **Top Champions Stats Table** (MVP-F-006) | Sorting table + Asset fetcher | Display stats sorted by Win Rate and load champion portraits | Must | Confirmed by user |
| **Player Profile Caching** (MVP-F-007) | Cache TTL provider | Keep player data for 15 minutes locally to protect rate limits | Must | Confirmed by user |

## Required Technology Decisions

| Area | Decision Needed | Source | Blocks Next Step? | Notes |
| --- | --- | --- | --- | --- |
| Build Tool | Choose Maven vs Gradle | `project-structure.md` | Yes, before Tech Spec | Maven selected |
| Backend Framework | Choose Web framework | `project-analysis.md` | Yes, before Tech Spec | Spring Boot selected |
| Frontend Template | Choose React build tool & language | `project-discover.md` | Yes, before Tech Spec | Vite + React + TS selected |
| Packaging Integration | Choose frontend-backend build link | `project-structure.md` | Yes, before Tech Spec | `frontend-maven-plugin` selected |
| Caching | Choose in-memory cache solution | `project-analysis.md` | Yes, before Tech Spec | Caffeine Cache selected |
| Charting | Choose React chart engine | `project-planning.md` | Yes, before Tech Spec | Recharts selected |
| State Management | Choose dashboard state sync | `project-planning.md` | Yes, before Tech Spec | React Context API selected |
| UI Styling | Choose layout styling system | `project-discover.md` | Yes, before Tech Spec | Vanilla CSS selected |

## Confirmed Technology Decisions

| Area | Technology | Decision Source | Evidence or Rationale | Documentation Reference | Notes |
| --- | --- | --- | --- | --- | --- |
| **Backend Language** | Java 21 | User constraint | Mandatory constraint provided by user. | Not captured | Root execution language |
| **Frontend Language** | React (Vite + TS) | User constraint & confirmation | Strong type-safety for complex Riot payload schemas. | Not captured | Inside `src/main/frontend` |
| **Build Tool** | Maven | Confirmed by user | Declarative, predictable lifecycle. | Not captured | Root `pom.xml` |
| **Backend Framework** | Spring Boot | Confirmed by user | Built-in resource serving and REST controllers. | [springboot.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/springboot.md) | REST API provider |
| **Build Plugin** | `frontend-maven-plugin` | Confirmed by user | Standard integration to install Node/npm and build React. | [frontend-maven-plugin.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/frontend-maven-plugin.md) | Bound to compile phase |
| **Caching** | Caffeine Cache | Confirmed by user | High-performance, automatic 15-minute write-based eviction. | [caffeine.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/caffeine.md) | In-memory cache bean |
| **Charting** | Recharts | Confirmed by user | Native SVG rendering, flexible styling, custom tooltips. | [recharts.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/recharts.md) | Composable components |
| **State Management** | Context API & useState | Confirmed by user | Lightweight, standard React state hooks without overhead. | Not captured | Local dashboard context |
| **UI Styling** | Vanilla CSS | Confirmed by user & rules | Complies with web styling guidelines; zero build overhead. | Not captured | Standard layout styling |

## Existing Technologies Detected in Codebase

No codebase technologies were detected (Greenfield project).

## Pending Technology Recommendations

No pending recommendations. All critical areas have been confirmed by the user.

## Rejected or Deferred Technologies

| Area | Technology | Reason | Status |
| --- | --- | --- | --- |
| Build Tool | Gradle | Verbose DSL variations; Maven was selected for lifecycle predictability. | Rejected |
| Backend Framework | Raw Servlets / Lightweight Server | Lacks auto-configured static asset routing and logging out-of-the-box. | Rejected |
| Caching | Standard `ConcurrentHashMap` | Lacks native time-based eviction; requires custom background cleaning threads. | Rejected |
| Charting | Chart.js / react-chartjs-2 | Canvas-based rendering, which is less customizable using native SVG styling. | Rejected |
| State Management | Zustand / Redux | Redux is too heavy; Zustand deferred since React Context is sufficient for simple filters. | Rejected / Deferred |
| UI Styling | Tailwind CSS | Rejected in favor of custom HSL-styled Vanilla CSS. | Rejected |

## Technology Documentation References

| Technology | Reference File | Source | Status |
| --- | --- | --- | --- |
| Caffeine Cache | [caffeine.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/caffeine.md) | Context7 `/ben-manes/caffeine` | Captured |
| Recharts | [recharts.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/recharts.md) | Context7 `/recharts/recharts` | Captured |
| Spring Boot | [springboot.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/springboot.md) | Context7 `/spring-projects/spring-boot` | Captured |
| Frontend Maven Plugin | [frontend-maven-plugin.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/references/analysis-gg/technologies/frontend-maven-plugin.md) | Context7 `/eirslett/frontend-maven-plugin` | Captured |

## Internal Technology Guidelines

| Area | Guideline | Path | Applies When |
|---|---|---|---|
| Backend (Java) | Backend Clean Architecture coding guidelines | [.agents/docs/architecture/coding-guidelines/README.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/coding-guidelines/README.md) | Implementing controllers, domain objects, and caches on Java backend |
| Frontend (React) | React clean coding guidelines | [.agents/docs/architecture/react-coding-guidelines/](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/react-coding-guidelines/) | Implementing React components, custom hooks, and styles |

## Context7 Documentation Capture

| Technology | Context7 Library ID | Query Focus | Capture Status | Notes |
| --- | --- | --- | --- | --- |
| Caffeine | `/ben-manes/caffeine` | Setup, write-based eviction, size constraints | Captured | Configured manual cache builder |
| Recharts | `/recharts/recharts` | ResponsiveContainer, BarChart, Tooltip customization | Captured | Used custom component Tooltip pattern |
| Spring Boot | `/spring-projects/spring-boot` | Auto-configuration, static resource serving | Captured | Used SPA index redirect resolver |
| Frontend Maven Plugin | `/eirslett/frontend-maven-plugin` | Execution configurations, working directory | Captured | Defined local Node/npm installs |

## ADR Candidates

| Candidate ADR | Decision Area | Technology | Reason | Status |
| --- | --- | --- | --- | --- |
| ADR-001 | REST API Server Framework | Spring Boot | Standard, fast, out-of-the-box static serving. | Ready for ADR |
| ADR-002 | Build and Frontend Link | Maven + `frontend-maven-plugin` | Automated Node/npm environment containment. | Ready for ADR |
| ADR-003 | Local Caching Library | Caffeine Cache | Auto-evicting JVM cache to defend Riot API limits. | Ready for ADR |

## Open Questions

- None at this stage. All critical technology selections have been successfully resolved.

## Risks and Constraints

| Risk or Constraint | Area | Impact | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| **Riot API Rate Limiting** | Integration | High | Cache match details in the Caffeine backend cache for 15 minutes. | Confirmed Constraint |
| **Riot API Key Leakage** | Security | High | Inject Riot API Key using Environment Variables in Spring Boot; never expose or send key to the client. | Confirmed Constraint |
| **CORS Blockage** | Development | Medium | Configure Vite local dev server proxy mapping `/api` requests to Spring Boot `localhost:8080`. | Confirmed Constraint |

## Inputs for Tech Spec

- **REST Contracts**: Define endpoint `/api/summoner/{gameName}/{tagLine}` and response schemas containing parsed match arrays.
- **Cache Configuration**: Build Caffeine Cache instance as a Spring Component bean.
- **Vite Configuration**: Set up dev proxy configuration for mapping API calls.
- **Routing Fallback**: Standardize path resolvers to redirect non-matching frontend calls back to index.html.

## Inputs for Create Tasks

- Create task to configure root `pom.xml` with dependencies (Spring Boot starter web, Caffeine, developer tools) and `frontend-maven-plugin` configurations.
- Create task to initialize `src/main/frontend` using Vite React + TypeScript template.
- Create task to setup styling using custom Vanilla CSS variables (e.g. colors, grid cells, sizing).

## Next Recommended Steps

Proceed to the **Tech Spec** phase (`tech-spec` skill) to detail the endpoint payloads, timezone conversions, chart data mappings, and cache interceptor architectures.
