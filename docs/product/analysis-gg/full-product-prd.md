# Full Product PRD - Analysis.GG

## Status

Status: In Review

Last updated: 2026-06-04

Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Summary

Analysis.GG is a web-based League of Legends analysis tool designed to help individual players improve their ranked performance. Instead of just listing raw, post-match statistics, it aggregates played matches to identify recurring performance patterns, highlight consistency issues, and provide actionable insights. The platform features an interactive dashboard that details daily and weekly performance trends (e.g., identifying best/worst days of the week to play), champion-specific win rates, and a comparison engine that benchmarks the player's core metrics against higher tier (e.g., Diamond, Challenger) players.

## Source Context

List the source materials used to create this PRD. User conversation is a valid source.

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| User Request | Chat Conversation | User Input | Confirmed | Initial request for a match-based LoL analysis tool |
| Goal clarification | Chat Conversation | User Input | Confirmed | Confirmed focus on self-improvement & ranked climbing |
| Feature details | Chat Conversation | User Input | Confirmed | Requested weekday win rates, daily summaries, champion win rates, consistency tracking, and high elo benchmarking |
| Format confirmation | Chat Conversation | User Input | Confirmed | Selected Web Application as the format |

## Problem Statement

Many League of Legends players want to climb the ranked ladder but find it difficult to identify their own structural weaknesses and bad habits. Existing platforms (such as OP.GG or U.GG) focus heavily on displaying raw statistics from individual games or server-wide meta trends. They do not help players identify repeating negative patterns across multiple matches, nor do they provide a simple, localized comparison between the player's performance metrics and the metrics required to reach higher tiers.

## Goals

- Help players identify negative, repeating patterns in their ranked matches (e.g., dying too much after 20 minutes, drop in CS/min during mid-game, etc.).
- Provide an intuitive, time-based performance dashboard showing daily summaries and weekday/weekend win-rate analyses.
- Enable automatic syncing of match history using only the player's Riot ID (Name#Tagline).
- Offer side-by-side comparisons of the player's key champion and role metrics against averages from higher tiers (Master, Challenger).

## Non-Goals

- Real-time in-game overlays or desktop client integrations (kept out of scope for simplicity and web compliance).
- Pre-game teammate scouting or lobby dodging recommendation engines.
- AI-driven match video/replay analysis (which requires large scale video parsing and storage).

## Target Users

Describe primary and secondary users, personas, actors, or affected stakeholders.

| User or Actor | Need | Current Pain Point | Priority | Notes |
| --- | --- | --- | --- | --- |
| Ranked Climber | Wants to find specific weaknesses and patterns to improve rank. | Too much raw data without actionable insights; lacks comparison to higher elo targets. | Primary | Focuses on ranked Solo/Duo and Flex queues. |

## Product Format

Record the selected or explicitly pending product format.

| Format | Decision Status | Confirmed By | Notes |
| --- | --- | --- | --- |
| Web Application | Selected | User | Ideal for responsive layouts, rich data tables, charts, and ease of access. |

## Product Format Recommendation

Compare relevant format options and explain the recommendation. The user makes the final decision.

| Option | Fit | Advantages | Disadvantages | MVP Viability | Decision |
| --- | --- | --- | --- | --- | --- |
| Web Application | High | Highly interactive charts, responsive tables, simple updates, no installation. | Cannot access local game files directly without manual action or client API. | High | Selected |
| Desktop App | Medium | Direct integration with local client API and log files. | High development overhead, complex distribution, OS dependencies. | Low | Rejected |
| Mobile App | Medium | Great for quick post-game checking. | Harder to display complex side-by-side comparison tables and multiple detailed charts. | Medium | Rejected |

Recommendation rationale:
- A responsive Web Application provides the perfect balance between development speed, rich visualizations (charts, side-by-side tables), and frictionless access for the player.

## Proposed Solution

A web application where the user inputs their Riot ID (Name#Tagline) and region to view a personalized performance analytics dashboard.
- **Match Syncing**: The backend uses the Riot Games API to sync the player's ranked match history.
- **Performance Overview**: The home dashboard presents daily match summaries and weekday-specific win rates (e.g., showing if the user wins more on Wednesdays vs. Saturdays).
- **Consistency Analyzer**: The system evaluates matches over a selectable range and highlights negative trends (e.g., "In 65% of your losses, your warding rate drops by half after the 15-minute mark").
- **Benchmark Panel**: Interactive tables showing player metrics (CS/min, vision score, damage share, gold share) side-by-side with target elo averages.

## Full Product Vision

In the future, the product could include:
- Multi-summoner comparison (compare stats against team members or specific rivals).
- Automated weekly performance emails with customized training plans.
- Deep historical tracking across multiple seasons to view long-term improvement curves.

## Main Capabilities

List the product's main capabilities, modules, or responsibility areas.

| ID | Capability | Purpose | Priority | Status |
| --- | --- | --- | --- | --- |
| CAP-001 | Player Profile & Riot API Sync | Input Riot ID, validate, and retrieve ranked match history via Riot API. | Core | Confirmed |
| CAP-002 | Performance Dashboard | Display win rates, daily performance charts, top champions, and weekday analyses. | Core | Confirmed |
| CAP-003 | Consistency & Pattern Analyzer | Parse match logs to detect repetitive negative habits and issue actionable tips. | Core | Confirmed |
| CAP-004 | Elo Benchmark Engine | Compare player metrics per champion and role vs. high elo stats (Diamond+). | Core | Confirmed |

## Features by Capability

Use stable feature IDs so future planning, specs, and implementation work can reference them.

| ID | Capability ID | Feature | Priority | Status |
| --- | --- | --- | --- | --- |
| F-001 | CAP-001 | Riot ID Search (Name#Tagline + Region Selection) | Must | Confirmed |
| F-002 | CAP-001 | Automatic Match History Ingestion (Ranked Queues) | Must | Confirmed |
| F-003 | CAP-002 | Selectable Range Filter (Last 20/50/100 games or Season/Patch/Date) | Must | Confirmed |
| F-004 | CAP-002 | Daily Match Summary (Win/Loss grid and daily status cards) | Must | Confirmed |
| F-005 | CAP-002 | Weekday Performance Chart (Win rate grouped by day of the week) | Must | Confirmed |
| F-006 | CAP-002 | Top Champions Win Rate & Stats Table | Must | Confirmed |
| F-007 | CAP-003 | Negative Padrões/Patterns Detection (e.g., vision, CS drop-offs, death sprees) | Must | Confirmed |
| F-008 | CAP-003 | Actionable Improvement Insights Panel | Must | Confirmed |
| F-009 | CAP-004 | Champion-Specific Benchmarking vs. Higher Elos | Must | Confirmed |
| F-010 | CAP-004 | Role-Specific Benchmarking vs. Higher Elos | Must | Confirmed |

## User Stories

Use concise product-facing stories.

| ID | User Story | Capability ID | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| US-001 | As a player, I want to search using my Riot ID so that my ranked matches load automatically. | CAP-001 | Must | Confirmed | Needs simple, clean onboarding. |
| US-002 | As a player, I want to see my daily performance summary so that I can evaluate how my gaming sessions went day by day. | CAP-002 | Must | Confirmed | Win/loss grid or timeline. |
| US-003 | As a player, I want to check my win rate by weekday so that I can spot if I underperform on specific days (e.g., tired after work). | CAP-002 | Must | Confirmed | Simple bar chart representation. |
| US-004 | As a player, I want to see my top champions' win rates so that I know which ones are most effective for climbing. | CAP-002 | Must | Confirmed | Sortable table. |
| US-005 | As a player, I want to see actionable insights about my mistakes so that I know what to focus on in my next game. | CAP-003 | Must | Confirmed | Text-based tips triggered by data patterns. |
| US-006 | As a player, I want to compare my champion's CS/min and vision score with Challenger tier stats so that I can see the exact gap. | CAP-004 | Must | Confirmed | Side-by-side dashboard or radar chart. |

## Use Cases

Describe the main product use cases.

| ID | Use Case | Actor | Goal | Related Capability | Notes |
| --- | --- | --- | --- | --- | --- |
| UC-001 | Sync Player Profile | Ranked Climber | Fetch matches from Riot API and store them for analysis. | CAP-001 | Triggered on profile search/refresh. |
| UC-002 | View Weekly Win Rates | Ranked Climber | Identify days of the week with the highest/lowest win rates. | CAP-002 | Uses the weekday chart. |
| UC-003 | Check Consistency Weaknesses | Ranked Climber | Read automatically generated warnings about repeating errors. | CAP-003 | Summarizes pattern analysis. |
| UC-004 | Benchmark Against High Elo | Ranked Climber | Compare stats of a specific champion/role vs. Challenger averages. | CAP-004 | Displays comparative metrics. |

## Expected Behaviors

Describe what the product should do in response to user actions, system states, and relevant conditions.

| ID | Trigger or Condition | Expected Behavior | Related Capability | Status |
| --- | --- | --- | --- | --- |
| EB-001 | User searches a valid Riot ID. | System fetches matches, caches them, updates the database, and redirects the user to their dashboard. | CAP-001 | Confirmed |
| EB-002 | User selects a match range filter (e.g., "Last 50 games"). | The dashboard immediately updates all charts, summaries, benchmarks, and patterns based on those specific 50 games. | CAP-002 | Confirmed |
| EB-003 | The system identifies that a user dies frequently near objective spawns. | A warning pattern is triggered on the dashboard: "High risk of dying right before Dragon/Baron spawns." | CAP-003 | Confirmed |
| EB-004 | High elo data is unavailable for a rare champion. | The benchmark engine displays a friendly fallback notice and shows general role stats instead. | CAP-004 | Confirmed |

## Main Flows

### Flow 1: Onboarding and Dashboard View

1. The user navigates to the homepage.
2. The user enters their Riot ID (e.g., `Summoner#BR1`) and selects their region.
3. The user clicks "Analyze".
4. The system validates the Riot ID format, checks if the player exists, and fetches match history via the Riot Games API.
5. Once matches are synced, the user is redirected to their Dashboard.
6. The dashboard displays:
   - Summary statistics (Win Rate, KDA, Most Played Champions).
   - Weekday Win Rate Chart.
   - Consistency warnings and actionable insights.
   - Benchmark tables comparing the user to Diamond/Challenger tiers.

## Alternative Flows

| ID | Scenario | Flow or Behavior | Status |
| --- | --- | --- | --- |
| AF-001 | Summoner has no ranked matches in the filtered range. | The system shows an empty state dashboard stating: "No ranked matches found in the selected range. Try changing the filter or playing more games." | Confirmed |

## Error and Empty States

| ID | Scenario | Expected User-Facing Behavior | Status |
| --- | --- | --- | --- |
| ES-001 | Invalid Riot ID or Summoner not found. | Displays error: "Summoner not found. Make sure you entered the Riot ID (Name#Tagline) correctly and selected the right region." | Confirmed |
| ES-002 | Riot API rate limits reached or offline. | Displays error: "We are currently experiencing high traffic or Riot API is offline. Please try again in a few minutes." | Confirmed |
| ES-003 | No match data available at all. | Displays empty dashboard with instructions on how to start playing ranked games to populate data. | Confirmed |

## Business Rules

| ID | Rule | Source | Status |
| --- | --- | --- | --- |
| BR-001 | Cache match data for a minimum of 15 minutes per summoner to prevent exceeding Riot API rate limits. | System performance and API compliance | Confirmed |
| BR-002 | Analyze only ranked queues (Solo/Duo and Flex) for improvement metrics. Normal games and ARAMs are excluded from the main dashboard unless explicitly selected. | Product Scope | Confirmed |

## Validation Rules

| ID | Input or Condition | Rule | Error Behavior | Status |
| --- | --- | --- | --- | --- |
| VR-001 | Riot ID Input | Must contain alphanumeric characters followed by `#` and a tag (e.g., `Name#TAG`). Max length 16 + 5. | Display visual validation warning: "Please enter a valid Riot ID (e.g., PlayerName#1234)". | Confirmed |
| VR-002 | Region Selection | Must be a valid Riot Game server region (BR1, NA1, EUW1, etc.). | Prevent form submission until a region is selected. | Confirmed |

## Permissions and Access Rules

| ID | Actor or Role | Permission or Restriction | Status |
| --- | --- | --- | --- |
| AR-001 | Guest/Public User | Can look up any Riot ID and view their performance dashboard. No registration or login required. | Confirmed |

## Constraints

- **Riot Games API Access**: Accessing match history requires a valid Riot API key. Developer keys expire every 24 hours. A production or personal key is needed for continuous uptime.
- **Riot API Rate Limits**: A standard developer key is limited to 20 requests per 1 second and 100 requests per 2 minutes. The product must implement caching and request queueing/throttling to handle this constraint.

## Out of Scope

- Real-time in-game overlays or companion app features.
- Analysis of draft lobbies (champion select).
- Analysis of game modes other than ranked queues (like ARAM, Arena, or rotating modes).

## Assumptions

- Players have public profiles in League of Legends (third-party data sharing is not disabled in client settings).
- Riot Games API maintains the current Match-V5 and Summoner-V4 endpoints.

## Open Questions

| Question | Critical Before MVP? | Impact | Owner or Next Step |
| --- | --- | --- | --- |
| Which server regions should the MVP support initially? (e.g., only BR1, or all major regions?) | No | Affects API routing configurations. Default to BR1 and expand. | Stakeholder feedback |
| Where will high elo benchmark statistics be sourced? (Riot API high-tier match pulls or pre-loaded static datasets?) | No | Affects data pipeline design. Can use pre-loaded average stats for the MVP. | Tech Spec |

## Full Product Completeness Checklist

- [x] Main problem is clearly defined.
- [x] Product goal is clearly defined.
- [x] Target users are identified.
- [x] Product format is selected or explicitly pending.
- [x] Product format recommendation was reviewed by the user.
- [x] Main capabilities are mapped.
- [x] Core behavior is documented.
- [x] Essential business rules are documented.
- [x] Important constraints are documented.
- [x] Critical open questions are resolved before MVP delimitation.

## Next Step: MVP Delimitation

- Readiness: Ready
- Blocking reason, if any: None
- Suggested MVP priority questions:
  - What are the priority goals for our MVP? (e.g., deliver quickly, validate core pattern analysis, or focus on beautiful stats dashboards?)
  - Which options among the capabilities should we include in the MVP vs. defer to future releases?
