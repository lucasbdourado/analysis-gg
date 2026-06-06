# Task Implementation Plan: Integrate Filter into Dashboard

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/match-range-filter/task-plans/004-integrate-filter-into-dashboard-plan.md`

## Task Reference

Task ID: `004`

Task file: `docs/features/match-range-filter/tasks/004-integrate-filter-into-dashboard.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `match-range-filter`

Feature file: `docs/features/match-range-filter/feature.md`

Feature Tech Spec: `docs/features/match-range-filter/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/match-range-filter/tasks/004-integrate-filter-into-dashboard.md` | Scope, Acceptance Criteria | Confirmed by source document | Defines the goal of page integration and provider wrapping |
| Feature file | `docs/features/match-range-filter/feature.md` | Expected Outcome, Scope | Confirmed by source document | Specifies selector element placement and re-rendering scope |
| Feature Tech Spec | `docs/features/match-range-filter/tech-spec.md` | Proposed Technical Approach, Folder Layout, Slicing Logic | Confirmed by source document | Guides page integration coordinate details and response parsing |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Standardizes React, Context API, and Vanilla CSS |
| Project Structure | `.agents/docs/architecture/react-coding-guidelines/project-structure.md` | Layer organization | Confirmed by source document | Guides separating domain, infrastructure, and presentation |
| Services and API Guidelines | `.agents/docs/architecture/react-coding-guidelines/services-and-api.md` | HTTP calling conventions | Confirmed by source document | Mandates separating fetch/HTTP calls from UI components |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS modules & variables | Confirmed by source document | Recommends HSL design tokens and CSS modules |

## Planning Scope

This plan is strictly scoped to integrating the `MatchRangeFilter` component into `DashboardPage.tsx` and wrapping the layout with `DashboardProvider`. It covers creating the API client helper (`dashboardApi.ts`), the custom state fetch hook (`usePlayerAnalytics.ts`), modifying `DashboardPage.tsx` to handle loading/error/success states, and creating the companion stylesheet `DashboardPage.module.css`.

## Task Summary

Connect the frontend to the backend REST API by wrapping `DashboardPage` inside `DashboardProvider` populated with fetched match history, and mounting `MatchRangeFilter` in the header layout.

## Execution Eligibility

Status: Eligible

Reason:
- Task 003 is fully implemented: the `MatchRangeFilter` component and its styles are created and build successfully.
- The backend RestController (`RiotApiController.java`) is fully implemented, exposing the proxy endpoint `/api/summoner/{gameName}/{tagLine}`.

## Feature Context

To scope all dashboard analytics to the active filter count, the dashboard page must fetch the full 100 recent games, supply them to the `DashboardProvider`, and display the `MatchRangeFilter` dropdown so users can adjust the active count range.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach - Folder Layout | Full | Modifies page entry, adds api and hook folders | Places `dashboardApi.ts` in infrastructure/api and `usePlayerAnalytics.ts` in presentation/hooks |
| Proposed Technical Approach - Data Flow | Full | Connects Rest API proxy payload to the DashboardPage and Provider | Populates provider rawData with `matches` from `/api/summoner/...` |
| Modules and Responsibilities | Full | Implements DashboardPage responsibilities | Renders layout inside provider with dropdown mounted |

Coverage assessment:
- Justifying Tech Spec section: Folder Layout, Data Flow, Modules and Responsibilities.
- Tech Spec sections implemented by this task: DashboardPage coordinate integration.
- Gaps between task and Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Code must compile cleanly with TypeScript under Vite |
| React Context API | `technology-definition.md` | Wrap the dashboard layout with `DashboardProvider` |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Style the dashboard page using a local `.module.css` stylesheet |
| REST proxy API | `technology-definition.md` | Call the backend API proxy for fetching match history |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Coding Guidelines | `.agents/docs/architecture/react-coding-guidelines/` | Whole task | Standard React conventions |
| Project Structure | `.agents/docs/architecture/react-coding-guidelines/project-structure.md` | Feature folders layout | Separates files into infrastructure/api, presentation/hooks, presentation/pages |
| Services and API | `.agents/docs/architecture/react-coding-guidelines/services-and-api.md` | API calls | Mandates calling fetch inside `dashboardApi.ts` and not directly inside the React components |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Presentational/Container separation | Component page manages state via hook and renders view components |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS styling | Use local CSS Modules |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Match Summary Location | `docs/features/match-range-filter/decisions/001-match-summary-location.md` | Mapped match responses to `MatchSummary` interface |

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` | File contents | Needs to be modified | Currently contains a placeholder |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` | Interface types | Context instantiation | Verify `DashboardProvider` accepts `rawData?: MatchSummary[]` |
| `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.tsx` | Export and Props | Dropdown mount | Verify component name and export format |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java` | Endpoints signatures | REST client queries | Endpoint is `/api/summoner/{gameName}/{tagLine}` |
| `src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/PlayerAnalyticsResponse.java` | Response DTO record | TypeScript DTO schema | Returns puuid, gameName, tagLine, region, matches |

## Confirmed Scope

List the work confirmed to be part of this task.

- Create DTO TypeScript type `PlayerAnalyticsResponse.ts`.
- Create API service helper `dashboardApi.ts` encapsulating the REST client call.
- Create custom presentation hook `usePlayerAnalytics.ts` to coordinate fetching and state lifecycle (loading, error, success).
- Create stylesheet `DashboardPage.module.css` with premium Obsidian styling, including responsive grid styles, glassmorphic cards, custom loading spinners, and error alerts.
- Update `DashboardPage.tsx` to read search parameters, call the custom hook, handle loading and error views, wrap the successful layout inside `<DashboardProvider>`, and mount `<MatchRangeFilter />` in the page header.

## Out of Scope

List related work that must not be done in this task.

- Implementing actual dashboard widgets (e.g. daily grid, champion table) - this is reserved for Task 005.
- Adding Vitest unit tests - this is reserved for Task 006.

## Proposed Implementation Approach

1. Declare the DTO type `PlayerAnalyticsResponse` in `src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts`.
2. Implement `fetchPlayerAnalytics` in `src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts`.
3. Implement `usePlayerAnalytics` hook in `src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts`.
4. Style `DashboardPage.module.css` using local CSS Modules and CSS variables from `:root`.
5. Rewrite `DashboardPage.tsx` to integrate the hook, provider, and range filter.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts` | Create | Confirmed | Tech Spec Data Contract | DTO type matching Java response |
| `src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts` | Create | Confirmed | Services and API Guideline | REST call to Spring Boot backend proxy |
| `src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts` | Create | Confirmed | Project Structure Guideline | Presentation fetch state orchestrator |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css` | Create | Confirmed | Styling Guideline | Premium dark theme layout styles |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` | Modify | Confirmed | Task File Scope | Main page file wrapping provider and filter |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. **Scaffold API DTO type**:
   Create `src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts`:
   ```typescript
   import { MatchSummary } from '../../domain/MatchSummary';

   export interface PlayerAnalyticsResponse {
     puuid: string;
     gameName: string;
     tagLine: string;
     region: string;
     matches: MatchSummary[];
   }
   ```

2. **Create REST API helper**:
   Create `src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts`:
   ```typescript
   import { PlayerAnalyticsResponse } from './PlayerAnalyticsResponse';

   export async function fetchPlayerAnalytics(
     gameName: string,
     tagLine: string,
     region: string
   ): Promise<PlayerAnalyticsResponse> {
     const name = encodeURIComponent(gameName.trim());
     const tag = encodeURIComponent(tagLine.trim());
     const lowerRegion = encodeURIComponent(region.toLowerCase().trim());
     
     // Fetch maximum matches (100) to support client-side range filtering
     const response = await fetch(`/api/summoner/${name}/${tag}?region=${lowerRegion}&count=100`);
     
     if (!response.ok) {
       let errorMessage = 'Failed to fetch player data';
       try {
         const errorData = await response.json();
         if (errorData && errorData.message) {
           errorMessage = errorData.message;
         }
       } catch (_) {}
       throw new Error(errorMessage);
     }
     
     return response.json();
   }
   ```

3. **Create Custom Orchestration Hook**:
   Create `src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts`:
   ```typescript
   import { useState, useEffect } from 'react';
   import { fetchPlayerAnalytics } from '../../infrastructure/api/dashboardApi';
   import { PlayerAnalyticsResponse } from '../../infrastructure/api/PlayerAnalyticsResponse';

   export function usePlayerAnalytics(gameName: string, tagLine: string, region: string) {
     const [data, setData] = useState<PlayerAnalyticsResponse | null>(null);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       if (!gameName || !tagLine || !region) {
         setError('Riot ID and region are required');
         setLoading(false);
         return;
       }

       setLoading(true);
       setError(null);

       let isMounted = true;

       fetchPlayerAnalytics(gameName, tagLine, region)
         .then((res) => {
           if (isMounted) {
             setData(res);
             setLoading(false);
           }
         })
         .catch((err) => {
           if (isMounted) {
             setError(err.message || 'Failed to fetch player data');
             setLoading(false);
           }
         });

       return () => {
         isMounted = false;
       };
     }, [gameName, tagLine, region]);

     return { data, loading, error };
   }
   ```

4. **Define CSS Module Layout Styles**:
   Create `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css` with premium HSL design variables and modern layout styling (flex columns, header row, card styling, gradients, back button):
   ```css
   .dashboardContainer {
     display: flex;
     flex-direction: column;
     min-height: 100vh;
     background: linear-gradient(180deg, var(--bg-obsidian-start) 0%, var(--bg-obsidian-end) 100%);
     padding: 2rem;
     box-sizing: border-box;
     color: var(--text-h);
   }

   .header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     border-bottom: 1px solid var(--card-border);
     padding-bottom: 1.5rem;
     margin-bottom: 2rem;
     flex-wrap: wrap;
     gap: 1rem;
   }

   .playerTitleSection {
     display: flex;
     align-items: center;
     gap: 0.75rem;
   }

   .playerName {
     font-size: 2rem;
     font-weight: 800;
     margin: 0;
     background: var(--accent-gradient);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
   }

   .playerTag {
     font-size: 1.25rem;
     font-weight: 500;
     color: var(--text);
     margin: 0;
   }

   .regionBadge {
     background: var(--card-bg);
     border: 1px solid var(--accent-cyan);
     color: var(--accent-cyan);
     padding: 0.25rem 0.75rem;
     border-radius: 9999px;
     font-size: 0.85rem;
     font-weight: 700;
     text-transform: uppercase;
     letter-spacing: 0.05em;
     box-shadow: var(--focus-glow);
   }

   .mainContent {
     display: flex;
     flex-direction: column;
     gap: 2rem;
     text-align: left;
   }

   .placeholderWidget {
     background: var(--card-bg);
     border: 1px solid var(--card-border);
     padding: 2.5rem;
     border-radius: 8px;
     backdrop-filter: blur(10px);
   }

   /* Loading & Error Styles */
   .centeredContainer {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     min-height: 100vh;
     background: linear-gradient(180deg, var(--bg-obsidian-start) 0%, var(--bg-obsidian-end) 100%);
     padding: 2rem;
     box-sizing: border-box;
   }

   .spinner {
     width: 50px;
     height: 50px;
     border: 5px solid var(--border);
     border-top-color: var(--accent-cyan);
     border-radius: 50%;
     animation: spin 1s linear infinite;
     margin-bottom: 1.5rem;
     box-shadow: var(--focus-glow);
   }

   @keyframes spin {
     to { transform: rotate(360deg); }
   }

   .loadingText {
     color: var(--text);
     font-size: 1.2rem;
     font-weight: 500;
   }

   .errorCard {
     background: var(--card-bg);
     border: 1px solid var(--error-red);
     box-shadow: var(--error-glow);
     padding: 3rem;
     border-radius: 12px;
     max-width: 450px;
     width: 100%;
     text-align: center;
     backdrop-filter: blur(10px);
   }

   .errorTitle {
     color: var(--error-red);
     margin-top: 0;
     font-weight: 700;
     font-size: 1.5rem;
   }

   .errorMessage {
     color: var(--text-h);
     margin-bottom: 2rem;
     line-height: 1.6;
   }

   .backButton {
     background: var(--accent-gradient);
     color: #000;
     font-weight: 700;
     border: none;
     padding: 0.75rem 1.5rem;
     border-radius: 6px;
     cursor: pointer;
     transition: transform 0.2s, opacity 0.2s;
   }

   .backButton:hover {
     transform: translateY(-2px);
     opacity: 0.9;
   }
   ```

5. **Modify Dashboard Page coordinate file**:
   Replace `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` with:
   ```typescript
   import React from 'react';
   import { useSearchParams, useNavigate } from 'react-router-dom';
   import { DashboardProvider } from '../context/DashboardContext';
   import { MatchRangeFilter } from '../components/MatchRangeFilter';
   import { usePlayerAnalytics } from '../hooks/usePlayerAnalytics';
   import styles from './DashboardPage.module.css';

   export const DashboardPage: React.FC = () => {
     const [searchParams] = useSearchParams();
     const navigate = useNavigate();

     const gameName = searchParams.get('name') || '';
     const tagLine = searchParams.get('tag') || '';
     const region = searchParams.get('region') || '';

     const { data, loading, error } = usePlayerAnalytics(gameName, tagLine, region);

     const handleBackToSearch = () => {
       navigate('/');
     };

     if (loading) {
       return (
         <div className={styles.centeredContainer} data-testid="dashboard-loading">
           <div className={styles.spinner} />
           <p className={styles.loadingText}>Synchronizing Riot API match history...</p>
         </div>
       );
     }

     if (error || !data) {
       return (
         <div className={styles.centeredContainer} data-testid="dashboard-error">
           <div className={styles.errorCard}>
             <h2 className={styles.errorTitle}>Analysis Refused</h2>
             <p className={styles.errorMessage}>{error || 'Failed to retrieve profile analytics.'}</p>
             <button className={styles.backButton} onClick={handleBackToSearch}>
               Back to Search
             </button>
           </div>
         </div>
       );
     }

     return (
       <DashboardProvider rawData={data.matches}>
         <div className={styles.dashboardContainer} data-testid="dashboard-success">
           <header className={styles.header}>
             <div className={styles.playerTitleSection}>
               <h1 className={styles.playerName}>{data.gameName}</h1>
               <span className={styles.playerTag}>#{data.tagLine}</span>
               <span className={styles.regionBadge}>{data.region}</span>
             </div>
             <MatchRangeFilter />
           </header>
           
           <main className={styles.mainContent}>
             <section className={styles.placeholderWidget}>
               <h2>Profile Analysis Loaded</h2>
               <p>
                 Ingested {data.matches.length} ranked matches from Riot Games API. Range filter is fully integrated.
               </p>
             </section>
           </main>
         </div>
       </DashboardProvider>
     );
   };
   ```

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `DashboardPage` successfully mounts and compiles with `DashboardProvider` | Imports provider and wraps the JSX layout output within `<DashboardProvider>` | Run compilation check (`npm run build` or similar) |
| Dropdown selector is visible in the page header | `<MatchRangeFilter />` is mounted inside the dashboard page header element | Visual verification on page render, test-id existence check |
| Changing dropdown selection updates the context provider state without errors | Connects `MatchRangeFilter` options mapping to the provider's `setActiveRange` handler | Verification on local development server; selecting options updates filteredMatches without crashes |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| TypeScript check | Technical check | Ensure types compile cleanly | Run `npm run build` or `npx tsc --noEmit` |
| Manual verification | Local Server | Run the dev server, search for a profile (e.g. Hide on bush#KR1 or mock data) and test dropdown selections | Run `npm run dev` to launch the client |

## Dependencies

- Previous task `003-create-range-filter-component` must be complete (verified: done, component exists).
- Backend Rest API proxy `/api/summoner/{gameName}/{tagLine}` must be active and fully functioning (verified: done, Java controller is in place).

## Risks and Edge Cases

- **Missing URL Query parameters**: If the user visits `/dashboard` directly without name, tag, or region parameters, the hook handles it by setting an error state, prompting them to go back to search.
- **Riot API Rate Limits / Outages**: If the backend returns a 429 or 504 error, the JSON message is extracted and displayed in a themed error card with a back-to-search button.

## Rollback or Recovery Notes

- Delete:
  - `src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts`
  - `src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts`
  - `src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts`
  - `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css`
- Revert changes to `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` using git checkout.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

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

- The widgets (weekday win rate chart, daily performance grid, top champions stats table) will be integrated and optimized in Task 005. For this task, do not try to build them; instead, use a neat Obsidian-themed layout card to act as a placeholder.
- Ensure that you run a compilation check at the end of execution.
