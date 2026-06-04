# MVP PRD - Analysis.GG

## Status

Status: In Review

Last updated: 2026-06-04

Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## MVP Summary

The MVP (Minimum Viable Product) of Analysis.GG is a lightweight web application that focuses on syncing player match histories and providing essential performance summaries. The application allows users to search for their Riot ID (Name#Tagline) and instantly loads their recent ranked match history. The core value of the MVP is delivered through an interactive dashboard featuring a summary of key statistics (wins, losses, overall win rate), a weekday performance chart (which days of the week have the highest win rates), a daily activity/match grid, and a list of top-performing champions. Advanced analytical features like automated consistency pattern notifications and Diamond/Challenger benchmark comparisons are deferred to future versions.

## Source Context

List the source materials used to create this MVP PRD. Include the confirmed Full Product PRD.

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Full Product PRD | docs/product/analysis-gg/full-product-prd.md | Full Product PRD | Confirmed | Approved on June 4, 2026 |
| MVP Priorities | Chat Conversation | User Input | Confirmed | Prioritized quick delivery and validation of core statistics/dashboard |
| MVP Option Choice | Chat Conversation | User Input | Confirmed | Selected Option 1 (Core Statistics Dashboard) |

## Selected MVP Option

Describe the MVP option selected or confirmed by the user.

| Option Name | Focus | Decision Source | Rationale |
| --- | --- | --- | --- |
| Core Statistics Dashboard | Essential stats, Riot ID sync, weekday/weekend win rates, daily summaries, top champion win rates. | User decision | Chosen to establish the basic data sync pipeline and validate the visual dashboard experience quickly. |

## MVP Goal

- Sync, process, and visually present a player's recent ranked match history, identifying their win rates grouped by champion and by day of the week.

## Problem Solved by the MVP

- Resolves the player's difficulty in tracking daily and weekday-specific performance trends across multiple matches. Instead of a scrolling list of individual games, it aggregates data to show whether the user performs better on certain days or with specific champions.

## Target Users

Describe the users included in the MVP scope.

| User or Actor | MVP Need | Priority | Notes |
| --- | --- | --- | --- |
| Ranked Climber | Wants a clear visualization of their recent match performance, daily trends, and best champions. | Primary | Focused on ranked Solo/Duo and Flex queues. |

## MVP Scope

- Search and validation of Riot ID (Name#Tagline) and region.
- Automatic match sync via Riot Games API.
- Selectable filter for match history scope (Last 20, 50, or 100 matches).
- Performance Dashboard featuring:
  - Summary stats (Wins, Losses, Overall Win Rate, Main Role).
  - Weekday Performance Chart (bar chart displaying win rate % per day of the week).
  - Daily Performance Grid (calendar/grid view of games played, wins, and losses for each day).
  - Top Champions Table (list of champions played, sorted by win rate, showing total games, average KDA, and average CS/min).
- Local cache mechanism (15-minute lifespan) to prevent Riot API rate limits.

## Out of Scope for MVP

- Dynamic Consistency Pattern Analyzer (CAP-003) - deferred to V2.
- High Elo Benchmarking vs. Diamond/Challenger tiers (CAP-004) - deferred to V2.
- Analysis of ARAMs, Arena, Normal, or special game modes.
- User account creation, login, or saving multiple profiles (public lookup only).

## Included Capabilities

| Capability ID | Capability | Why Included | Notes |
| --- | --- | --- | --- |
| CAP-001 | Player Profile & Riot API Sync | Required to locate players, authorize access, and ingest match data. | Core capability. |
| CAP-002 | Performance Dashboard | Delivers the main visual value: daily grid, champion stats, and weekday chart. | Core capability. |

## Deferred Capabilities

| Capability ID | Capability | Why Deferred | Target Later Phase |
| --- | --- | --- | --- |
| CAP-003 | Consistency & Pattern Analyzer | High data parsing complexity; requires complex rulesets. | V2 / Post-MVP |
| CAP-004 | Elo Benchmark Engine | Sourcing and maintaining high elo statistics tables requires additional infrastructure. | V2 / Post-MVP |

## MVP Features

| ID | Capability ID | Feature | Priority | Status |
| --- | --- | --- | --- | --- |
| MVP-F-001 | CAP-001 | Riot ID Search Input (Name#Tagline + Region Selector) | Must | Confirmed |
| MVP-F-002 | CAP-001 | Riot API Integration (retrieve match details) | Must | Confirmed |
| MVP-F-003 | CAP-002 | Match Range Filter (Last 20, 50, 100 games) | Must | Confirmed |
| MVP-F-004 | CAP-002 | Weekday Win Rate Bar Chart | Must | Confirmed |
| MVP-F-005 | CAP-002 | Daily Performance Grid (wins/losses per calendar day) | Must | Confirmed |
| MVP-F-006 | CAP-002 | Top Champions Stats Table (sorted by win rate) | Must | Confirmed |
| MVP-F-007 | CAP-001 | Player Profile Caching (15 mins) | Must | Confirmed |

## MVP User Stories

| ID | User Story | Capability ID | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| MVP-US-001 | As a player, I want to search my Riot ID so that my ranked matches load automatically. | CAP-001 | Must | Confirmed | Quick and easy profile loading. |
| MVP-US-002 | As a player, I want to filter my dashboard by game count (20/50/100) so that I can analyze short-term or long-term trends. | CAP-002 | Must | Confirmed | Dropdown filter on dashboard. |
| MVP-US-003 | As a player, I want to see my win rate per day of the week so that I can decide which days are best for me to play ranked. | CAP-002 | Must | Confirmed | Bar chart representation. |
| MVP-US-004 | As a player, I want to see a daily summary grid of my wins and losses so that I can see the outcome of my daily gaming sessions. | CAP-002 | Must | Confirmed | Daily calendar/timeline grid. |
| MVP-US-005 | As a player, I want to see my top champions sorted by win rate so that I can easily identify which champions give me the best results. | CAP-002 | Must | Confirmed | Table view sorted descending. |

## MVP Use Cases

| ID | Use Case | Actor | Goal | Related Capability | Notes |
| --- | --- | --- | --- | --- | --- |
| MVP-UC-001 | Sync Player Profile | Ranked Climber | Search Riot ID and retrieve recent ranked matches from Riot API. | CAP-001 | Triggered on landing page search. |
| MVP-UC-002 | View Dashboard Analytics | Ranked Climber | View daily grid, weekday chart, and champion performance table. | CAP-002 | Displays upon successful sync. |

## MVP Expected Behaviors

| ID | Trigger or Condition | Expected Behavior | Related Capability | Status |
| --- | --- | --- | --- | --- |
| MVP-EB-001 | User enters valid Riot ID and region. | The system queries the Riot Games API, stores matches in cache, and loads the dashboard. | CAP-001 | Confirmed |
| MVP-EB-002 | User switches range filter (e.g. 100 games). | Dashboard components recalculate and refresh matching data elements instantly. | CAP-002 | Confirmed |

## Main MVP Flow

1. User visits the landing page.
2. User inputs their Riot ID (e.g., `SummonerName#BR1`) and selects their region.
3. User clicks the "Analyze" button.
4. The system validates the input format, queries the Riot API, caches the data, and parses the match list.
5. User is redirected to the Dashboard page, which displays:
   - Overall stats (Wins, Losses, Win Rate %, Main Role).
   - Weekday Win Rate Bar Chart.
   - Daily performance calendar grid.
   - Sorted list of Top Champions.

## Alternative Flows

| ID | Scenario | Flow or Behavior | Status |
| --- | --- | --- | --- |
| MVP-AF-001 | No ranked matches are found for the player within the selected scope. | The dashboard displays an empty state: "No ranked matches found in the selected range." | Confirmed |

## Error and Empty States

| ID | Scenario | Expected User-Facing Behavior | Status |
| --- | --- | --- | --- |
| MVP-ES-001 | Riot ID does not exist. | Displays error: "Summoner not found. Please check spelling, tag, and region." | Confirmed |
| MVP-ES-002 | Riot API rate limit or outage. | Displays error: "Riot API is currently unavailable. Please try again in a few minutes." | Confirmed |

## Business Rules

| ID | Rule | Source | Status |
| --- | --- | --- | --- |
| MVP-BR-001 | Cache match data for 15 minutes to stay within Riot API rate limits. | System compliance | Confirmed |
| MVP-BR-002 | Retrieve only Solo/Duo and Flex Ranked match types. | Scope boundaries | Confirmed |

## Validation Rules

| ID | Input or Condition | Rule | Error Behavior | Status |
| --- | --- | --- | --- | --- |
| MVP-VR-001 | Riot ID format | Must contain a name, a `#` separator, and a tag (e.g. `Summoner#TAG`). | Prevent submission, highlight field, and show validation tooltip. | Confirmed |

## Permissions and Access Rules

| ID | Actor or Role | Permission or Restriction | Status |
| --- | --- | --- | --- |
| MVP-AR-001 | Public Guest | Full access to search and view any dashboard. No user authentication required. | Confirmed |

## Acceptance Criteria

- [ ] Riot ID input validates format (`Name#Tagline`) before triggering API call.
- [ ] Match history fetches successfully via Riot API and parses Match-V5 format.
- [ ] Profile search results are cached for 15 minutes.
- [ ] Changing the match filter (20, 50, 100) dynamically updates all stats, grids, and tables on the dashboard.
- [ ] The weekday bar chart accurately calculates win rates per day of the week.
- [ ] The daily summary grid accurately displays wins and losses grouped by date.
- [ ] The champion table displays play count, win rate, KDA, and average CS/min, sorted descending by win rate.

## Assumptions

- Riot API is active and accessibility to Match-V5 and Account-V1 endpoints is maintained.
- Players have not hidden their profiles from public data lookups.

## Open Questions

| Question | Impact | Owner or Next Step |
| --- | --- | --- |
| None | N/A | N/A |

## MVP Completeness Checklist

- [x] MVP goal is defined.
- [x] MVP scope is clear.
- [x] Included capabilities are listed.
- [x] Deferred capabilities are listed.
- [x] MVP user stories are defined.
- [x] MVP expected behaviors are documented.
- [x] MVP acceptance criteria are defined.
- [x] MVP open questions are documented.

## Relationship to Full Product Vision

The MVP provides the bedrock infrastructure (Riot API integration, caching, data model, basic UI architecture). Once this is validated, V2 will layers on the Consistency & Pattern Analyzer (CAP-003) and the Elo Benchmark Engine (CAP-004) to complete the product vision.

## Inputs for Next Harness Steps

- **Project discovery**: This is a new greenfield project. The root directory is `c:\Users\lucas.dourado\IdeaProjects\analysis-gg`. It starts with no existing codebase.
- **Project planning**: Decompose into setup, mock data generation, UI development (homepage, dashboard, charts, tables), Riot API integration, caching, and styling.
- **Technology definition**: React with Vite and TypeScript is highly recommended to build interactive widgets, SVG/Canvas charts, and clean UI components.
- **Technical specification**: Document the match parsing logic, data transformations for weekdays and daily grids, caching mechanism details, and mock API payloads.
