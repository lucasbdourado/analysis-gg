# Project Planning: Analysis.GG

## Status

Status: Confirmed
Planning readiness: Ready
Last updated: 2026-06-04
Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Source Documents

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Project Discovery | docs/context/project-discover.md | Discovery | Missing | Tracked as a planning dependency for greenfield setup. |
| Full Product PRD | docs/product/analysis-gg/full-product-prd.md | Full Product PRD | Confirmed | Approved on June 4, 2026. |
| MVP PRD | docs/product/analysis-gg/mvp-prd.md | MVP PRD | Confirmed | Approved on June 4, 2026. |

## Planning Scope

This document defines the MVP-first delivery plan for Analysis.GG, organizing core features, timeline phases, and handoff points for downstream tasks.

In scope:
- Search and validation of Riot ID and region.
- Ingestion of recent ranked match history via Riot Games API.
- Dashboard with Match Range Filter (20/50/100 games).
- Overall Stats summary widget.
- Weekday Win Rate Bar Chart.
- Daily Performance Grid (win/loss calendar).
- Top Champions Table.
- Caching player profiles and match data for 15 minutes.

Out of scope:
- Detailed codebase analysis (greenfield project).
- Final technology decisions (handled in `technology-definition`).
- Technical specification (handled in `tech-spec`).
- Granular task creation (handled in `create-tasks`).
- Task implementation plans (handled in `plan-task`).
- Post-MVP features (Consistency & Pattern Analyzer, High Elo Benchmarking).

## Product Vision Summary

Analysis.GG is an interactive web-based League of Legends analysis tool aimed at helping individual players improve their ranked performance. Instead of just presenting a list of matches, it compiles performance trends, highlights consistency and timing errors, and benchmarks player statistics against higher tiers (Diamond+). It is designed to act as a self-improvement companion for climbing the ranked ladder.

## MVP Planning Focus

The MVP focuses on the Core Statistics Dashboard. It aims to build the foundational data synchronization pipeline (Riot API integration and caching) and validate the main user experience around aggregate performance visualizations. By deferring complex pattern analysis and benchmark lookups, we minimize upfront engineering risk and deliver immediate value.

## MVP Scope Summary

The MVP will deliver a web application that pulls a player's recent ranked games using their Riot ID (Name#Tagline) and region, caching it for 15 minutes. It will display a dashboard with overall statistics, a weekday win rate chart, a daily win/loss calendar grid, and a table of top champions.

Included in MVP:
- Riot ID input validation and submission.
- Riot API Match-V5 sync (recent ranked Solo/Duo & Flex).
- 15-minute player profile and match cache.
- Filter for last 20, 50, or 100 matches.
- Weekday Win Rate Bar Chart, Daily Performance Grid, and Top Champions Table.

Deferred beyond MVP:
- Consistency & Pattern Analyzer (CAP-003).
- Elo Benchmark Engine (CAP-004).
- User accounts and authentication.
- Analysis of ARAM, Arena, or Normal games.

## MVP Features Summary

| Feature | Goal | Priority | Dependencies | Notes |
| --- | --- | --- | --- | --- |
| MVP-F-001: Riot ID Search Input | Allow users to input their Riot ID and select their region. | Must | None | Basic onboarding form. |
| MVP-F-002: Riot API Integration | Fetch ranked matches from Riot Games API. | Must | MVP-F-001 | Interfaces with Match-V5 and Account-V1 endpoints. |
| MVP-F-003: Match Range Filter | Filter dashboard data range (20/50/100 games). | Must | MVP-F-002 | Triggers recalculation on dashboard. |
| MVP-F-004: Weekday Win Rate Bar Chart | Visualize win rates grouped by day of the week. | Must | MVP-F-002 | Uses aggregated match results. |
| MVP-F-005: Daily Performance Grid | Display wins/losses per calendar day in a grid view. | Must | MVP-F-002 | Calendar-like win/loss tracker. |
| MVP-F-006: Top Champions Stats Table | Render sorted table of champion performance. | Must | MVP-F-002 | Shows games, win rate, KDA, CS/min. |
| MVP-F-007: Player Profile Caching | Cache match data for 15 minutes. | Must | MVP-F-002 | Prevents rate limiting and speeds up page loads. |

## MVP Feature Details

### MVP Feature: Riot ID Search Input (MVP-F-001)
- **Goal**: Render a user-friendly entry form to submit a Riot ID and region.
- **User Value**: Quick onboarding without account registration.
- **Related PRD Capabilities**: CAP-001
- **Related User Stories**: MVP-US-001
- **Expected Outcome**: A validated text input and dropdown select that routes the user to their dashboard.
- **Dependencies**: None.
- **Risks**: Users submitting invalid formats or regions.
- **Feature Completion Criteria**:
  - [ ] Input validates pattern `Name#Tagline` before allowing submission.
  - [ ] Region select offers major Riot servers (e.g. BR1, NA1, EUW1).
  - [ ] Form submission redirects to dashboard with query parameters or state.
- **Readiness Notes for Tech Spec**: Needs details on validation regex and UI states.
- **Inputs for Create Tasks**: Create task for search form UI, input validation, and redirect.

### MVP Feature: Riot API Integration (MVP-F-002)
- **Goal**: Fetch account PUUID and recent ranked matches.
- **User Value**: Automatically populates the dashboard with actual game data.
- **Related PRD Capabilities**: CAP-001
- **Related User Stories**: MVP-US-001
- **Expected Outcome**: Ingestion pipeline that queries Riot API for PUUID, fetches match list, retrieves individual match details, and filters for Solo/Duo or Flex queues.
- **Dependencies**: MVP-F-001.
- **Risks**: API rate limits, API key expiration, data latency.
- **Feature Completion Criteria**:
  - [ ] Resolves Riot ID to PUUID.
  - [ ] Ingests recent ranked match history IDs.
  - [ ] Fetches and filters details of individual matches.
- **Readiness Notes for Tech Spec**: Map endpoint payloads, error handling, rate limiting.
- **Inputs for Create Tasks**: Create task for API client, PUUID resolution, match detail fetcher, queue type filter.

### MVP Feature: Match Range Filter (MVP-F-003)
- **Goal**: Provide a dropdown selection to analyze a subset of matches.
- **User Value**: Allows flexible analysis (short-term vs. long-term trend).
- **Related PRD Capabilities**: CAP-002
- **Related User Stories**: MVP-US-002
- **Expected Outcome**: A dashboard control that filters the dataset and triggers instant UI recalculation.
- **Dependencies**: MVP-F-002.
- **Risks**: Client-side lag with large datasets.
- **Feature Completion Criteria**:
  - [ ] UI dropdown filter with options 20, 50, 100.
  - [ ] Changing selection filters active data array and updates dashboard.
- **Readiness Notes for Tech Spec**: State synchronization across dashboard child components.
- **Inputs for Create Tasks**: Create task for filter dropdown component, state filter logic.

### MVP Feature: Weekday Win Rate Bar Chart (MVP-F-004)
- **Goal**: Present a bar chart displaying win rate grouped by day of the week.
- **User Value**: Helps identify performance trends based on the day played.
- **Related PRD Capabilities**: CAP-002
- **Related User Stories**: MVP-US-003
- **Expected Outcome**: Bar chart visualization showing percentage of wins for Mon-Sun.
- **Dependencies**: MVP-F-002.
- **Risks**: Day skewing due to low play count on certain days.
- **Feature Completion Criteria**:
  - [ ] Maps timestamps to local days of the week.
  - [ ] Calculates win rate per day.
  - [ ] Displays a responsive bar chart with HSL colors and hover values.
- **Readiness Notes for Tech Spec**: Date transformation details, chart component options.
- **Inputs for Create Tasks**: Create task for day grouping logic, bar chart rendering.

### MVP Feature: Daily Performance Grid (MVP-F-005)
- **Goal**: Display a calendar-style grid of games played, wins, and losses.
- **User Value**: Clear visual overview of daily play session outcomes.
- **Related PRD Capabilities**: CAP-002
- **Related User Stories**: MVP-US-004
- **Expected Outcome**: A grid mapping days to win/loss boxes.
- **Dependencies**: MVP-F-002.
- **Risks**: Layout crowding on smaller screens.
- **Feature Completion Criteria**:
  - [ ] Groups matches by calendar date.
  - [ ] Renders a grid showing date cells color-coded by win/loss ratio or game counts.
- **Readiness Notes for Tech Spec**: Responsive grid layout and tooltip contents.
- **Inputs for Create Tasks**: Create task for grid calendar component, date aggregation utility.

### MVP Feature: Top Champions Stats Table (MVP-F-006)
- **Goal**: Display champion statistics sorted by win rate.
- **User Value**: Highlights which champions are most effective.
- **Related PRD Capabilities**: CAP-002
- **Related User Stories**: MVP-US-005
- **Expected Outcome**: A data table with sorting capability.
- **Dependencies**: MVP-F-002.
- **Risks**: Unreliable stats for low game count champions (e.g. 1 game, 100% win rate).
- **Feature Completion Criteria**:
  - [ ] Extracts champion ID, name, kills, deaths, assists, CS, game duration.
  - [ ] Computes win rate %, average KDA, average CS/min.
  - [ ] Renders a table sorted descending by win rate.
- **Readiness Notes for Tech Spec**: Formula definitions and UI table interactions.
- **Inputs for Create Tasks**: Create task for champion accumulator, table UI styling.

### MVP Feature: Player Profile Caching (MVP-F-007)
- **Goal**: Cache sync results for 15 minutes.
- **User Value**: Faster loads on repeat visits, prevents API lockouts.
- **Related PRD Capabilities**: CAP-001
- **Related User Stories**: MVP-US-001
- **Expected Outcome**: Cache layer that checks timestamp and details before querying Riot API.
- **Dependencies**: MVP-F-002.
- **Risks**: Stale data, caching strategy selection.
- **Feature Completion Criteria**:
  - [ ] Caches matches and player data.
  - [ ] Evicts cache after 15 minutes.
  - [ ] Serves cached response instantly.
- **Readiness Notes for Tech Spec**: Cache architecture (frontend localStorage or backend store).
- **Inputs for Create Tasks**: Create task for caching utility / backend caching mechanism.

## Suggested Delivery Phases

### Phase 1: Foundation & Data Sync
**Goal**: Set up the project, mock data structures, and the Riot API integration with caching.
**Suggested feature order**:
1. MVP-F-001: Riot ID Search Input
2. MVP-F-007: Player Profile Caching
3. MVP-F-002: Riot API Integration
**Exit criteria**:
- Form validates and redirects.
- Ingestion fetches and parses match history or retrieves from cache.

### Phase 2: Visual Dashboard
**Goal**: Build dashboard layout, range filtering, and individual analytics components.
**Suggested feature order**:
1. MVP-F-003: Match Range Filter
2. MVP-F-006: Top Champions Stats Table
3. MVP-F-004: Weekday Win Rate Bar Chart
4. MVP-F-005: Daily Performance Grid
**Exit criteria**:
- Filter updates dashboard state.
- Table, chart, and grid display accurate aggregated values.

## MVP Risks and Dependencies

| Risk or Dependency | Type | Impact | Mitigation or Follow-Up | Blocks Next Step? |
| --- | --- | --- | --- | --- |
| Missing project-discover.md | Documentation | Low | Acknowledge as a planning dependency. The codebase is greenfield, so no pre-existing code is analyzed. | No |
| Riot API Rate Limit | External dependency | High | Enforce 15-minute cache; design throttling/retry queue. | Yes, before Tech Spec |
| Riot Developer Key Expiration | External dependency | Medium | Inform developers key rotates daily; plan configuration management. | No |
| API Key Exposure in Frontend | Security risk | High | If doing a pure frontend app, we must use serverless functions or a basic server backend to proxy API calls and hide the key. | Yes, before Technology Definition |

## Product Gaps Found During Planning

| Gap | Impact | Recommended Source to Update | Blocks Next Step? |
| --- | --- | --- | --- |
| None | N/A | N/A | No |

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| Are there plans to deploy to a cloud serverless environment (e.g. Vercel) where API proxy functions can be implemented easily? | High | Yes, before Technology Definition | User / Tech |
| Should we include a minimum game threshold for sorting champions (e.g. only show champions with 3+ games)? | Low | No | Product |

## MVP Planning Readiness

Status: Ready
Reason: Greenfield planning is complete. The MVP scope is clearly mapped into 7 defined features. Key dependencies and security risks (Riot API key exposure) are highlighted for the upcoming `technology-definition` and `tech-spec` phases.

## MVP Planning Readiness Checklist

- [x] MVP scope is clear.
- [x] MVP features are identified.
- [x] Feature dependencies are mapped.
- [x] Suggested delivery phases are defined.
- [x] Suggested feature order is defined.
- [x] Blocking open questions are resolved or clearly marked.
- [x] Inputs for Technology Definition are listed.
- [x] Inputs for Tech Spec are listed.
- [x] Inputs for Create Tasks are listed.

## Inputs for Technology Definition

- **Architectural Layout**: Single Page Application (React/Vite) vs Fullstack SSR (Next.js) to address the API Proxy need.
- **State Management**: Context API or Zustand to coordinate the Match Range Filter across widgets.
- **Chart Rendering**: Chart.js, Recharts, or lightweight custom SVG for the Weekday Win Rate Bar Chart and Daily Performance Grid.
- **Cache Store**: Server-side (In-Memory, Redis) vs client-side (sessionStorage/localStorage).

## Inputs for Tech Spec

- **Riot API payload mapping**: Ingestion mapping for Match-V5 details (participants, stats, queue IDs).
- **Date aggregation formulas**: Timezone conversion for local daily grids and weekday calendars.
- **Champion calculations**: Formulas for CS/min, win rate, and KDA.
- **Cache eviction mechanism**: Expiry validation logic.

## Inputs for Create Tasks

- Setup workspace, config, and dev dependencies.
- Build search landing page UI.
- Implement input validation and server region mappings.
- Integrate Riot API client (PUUID and Match Ingestion).
- Build caching module.
- Create dashboard core layout and filter state.
- Build Weekday Win Rate component.
- Build Daily Performance Grid.
- Build Top Champions table.

## Post-MVP Evolution Roadmap

| Phase | Focus | Capabilities Added | Notes |
| --- | --- | --- | --- |
| V2 | Consistency Analysis & Benchmarking | CAP-003 (Consistency Pattern Analyzer) and CAP-004 (Elo Benchmarking) | Sourcing Diamond/Challenger static averages. |

## Next Recommended Steps

- Proceed to `technology-definition` to lock down the stack, followed by `tech-spec` and `create-tasks`.
