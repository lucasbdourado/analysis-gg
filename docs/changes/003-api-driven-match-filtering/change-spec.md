# Change Spec: API-Driven Match Filtering

## 1. Overview

This specification details the changes required to transition match history filtering from client-side only to API-driven. When filters like Ranked Solo/Duo, Ranked Flex, ARAM, or Custom are selected, the frontend will trigger a new backend request passing the corresponding `queue` parameter to the Riot API. For combined filters, parallel API calls will be executed. The "Normal" games filter will continue to use the default (unfiltered) endpoint and apply client-side filtering. The final matches list will be merged, deduplicated by `matchId`, sorted chronologically (newest first), and sliced to the selected count. All dashboard statistics and charts will automatically recalculate from this final list. A "Reset Filters" button will also be added.

## 2. Research Checklist

- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior, if applicable.
- [x] Analyze directly related code areas.
- [x] Analyze existing tests directly related to the change.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context

- [RiotApiController.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java): Main backend controller for fetching player profile analytics.
- [SyncPlayerProfileUseCase.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java): Usecase orchestration for fetching account details and match summaries.
- [RiotApiClientPort.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/port/RiotApiClientPort.java): Client port interface for interacting with Riot API.
- [RiotApiClientAdapter.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java): Riot API HTTP client adapter.
- [dashboardApi.ts](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts): Frontend API client for fetching profile analytics.
- [usePlayerAnalytics.ts](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts): Custom React hook that fetches matches.
- [DashboardContext.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx): React context provider distributing matches and active filters.
- [DashboardPage.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): Main dashboard layout shell.
- [MatchQueueFilter.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/MatchQueueFilter.tsx): Component rendering queue type filter buttons.

## 4. Confirmed Facts

- The backend currently fetches a default list of match IDs without any queue filters.
- The Riot Match-V5 endpoint (`/lol/match/v5/matches/by-puuid/{puuid}/ids`) allows filtering by a single `queue` query parameter (integer).
- Normal queue IDs are `400`, `430`, and `490`.
- The user decided that the "Normal" filter will NOT pass a `queue` query parameter to the backend API; it will use the default endpoint (same as today) and filter client-side.
- Combining filters requires making a separate API request for each active filter key and merging their results in the frontend.

## 5. Inferences and Assumptions

- Parallel requests in the frontend (using `Promise.all`) will fetch multiple filter results concurrently, minimizing latency.
- Matches returned from separate API requests might overlap or be out of chronological order. Merging must deduplicate them by `matchId` and sort them by `gameCreation` descending before slicing to `activeRange`.

## 6. Questions and Answers

- **Question**: Ao combinar/ativar filtros, como buscar dados para filas com múltiplos IDs (como Normal)?
  - **Why it matters**: Determines whether the backend API must support multiple parameters or if the frontend must fetch/combine.
  - **User Answer**: Option 2, but for "Normal" filter, no queue filter is sent to the API; it remains client-side filtered as it is today.
  - **Effect**: If the `NORMAL` filter is active, the frontend fetches without the `queue` parameter and filters client-side for Normal queues `[400, 430, 490]`.

## 7. Current Behavior

- Match history is fetched once from the backend.
- Changing queue filters does not trigger new API calls; filtering is performed entirely on the client side from the loaded list.

## 8. Expected Behavior

- Sem filtros ativos:
  - Fetches matches using the default endpoint (no `queue` parameter).
  - Recalculates all page metrics using this list.
- Ao ativar um filtro (Solo/Duo, Flex, ARAM, Custom):
  - Clears/discards the current matches list.
  - Fetches match IDs and details from backend passing the respective `queue` query parameter.
  - Recalculates all statistics with this list.
- Ao combinar filtros:
  - Performs a separate API search for each active filter.
  - Merges the responses, deduplicating by `matchId` (keeping the existing one if duplicates are found).
  - Sorts them chronologically (newest first).
  - Slices to the chosen count (`activeRange`).
- Ao remover um filtro:
  - Triggers a new fetch for the remaining active filters and recalculates.
- Ao clicar em redefinir/limpar filtros:
  - Removes all active filters, discards the filtered list, and fetches the default unfiltered list.

## 9. Scope

- **Backend**:
  - Add optional `Integer queue` parameter to `/api/summoner/{gameName}/{tagLine}` controller endpoint.
  - Overload `execute` in `SyncPlayerProfileUseCase` to support an optional `queue` parameter.
  - Update `RiotApiClientPort` and `RiotApiClientAdapter` to append `&queue={queue}` if present.
- **Frontend**:
  - Update `dashboardApi.ts` to support optional `queue` query parameter.
  - Update `usePlayerAnalytics.ts` to manage fetching state, parallel requests, deduplication, sorting, and slicing based on active filters.
  - Lift filter state (`selectedQueues`, `toggleQueueFilter`, `clearQueueFilters`) up to `DashboardPage.tsx` and pass them down to `DashboardProvider`.
  - Add a "Reset Filters" button to `MatchQueueFilter.tsx`.

## 10. Out of Scope

- Storing active filters in URL query parameters or localStorage.
- Caching multi-queue combined lists on the backend.

## 11. Functional Acceptance Criteria

- **AC1: API Query on Toggle**: Activating "Solo/Duo" triggers a request to `/api/summoner/...&queue=420`.
- **AC2: Normal Game Handling**: Activating "Normal" triggers a request to `/api/summoner/...` (no queue parameter) and filters for `[400, 430, 490]` on the client.
- **AC3: Filter Merging**: Activating "Solo/Duo" and "Flex" triggers two parallel requests. Matches are combined, deduplicated by `matchId`, and sorted newest first.
- **AC4: Reset Button**: A "Reset Filters" button is rendered when filters are active, and clicking it clears all filters and fetches the default unfiltered list.
- **AC5: Slicing Integrity**: The final list is always sliced to the selected count (`activeRange`).
- **AC6: Page Recalculation**: All widgets (win rates, charts, grids, tables) recalculate accurately from the final list.

## 12. Technical Findings

- Overloading `SyncPlayerProfileUseCase.execute(...)` with a 3-argument version calling the 4-argument version preserves backward compatibility with existing unit tests in `RiotApiControllerTest.java`.
- Frontend `DashboardProvider` can support both external and local state fallbacks to keep its existing unit tests passing without modifications.

## 13. Development Guidance

- Map frontend filter keys to queue parameters:
  - `SOLO_DUO`: `queue=420`
  - `FLEX`: `queue=440`
  - `ARAM`: `queue=450`
  - `CUSTOM`: `queue=0`
  - `NORMAL`: (unfiltered API query + client-side filter for `[400, 430, 490]`)
- Sort merged matches: `mergedMatches.sort((a, b) => b.gameCreation - a.gameCreation)`.

## 14. Suggested Code Structure and Contracts

### Backend Controller Update (`RiotApiController.java`):
```java
    @GetMapping("/{gameName}/{tagLine}")
    public ResponseEntity<PlayerAnalyticsResponse> getPlayerAnalytics(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @RequestParam String region,
            @RequestParam(required = false, defaultValue = "20") Integer count,
            @RequestParam(required = false) Integer queue
    )
```

### Frontend Hook Update (`usePlayerAnalytics.ts`):
```typescript
export function usePlayerAnalytics(
  gameName: string,
  tagLine: string,
  region: string,
  count: number = 20,
  selectedQueues: string[] = []
)
```

## 15. Validation References

- **Backend Unit Tests**:
  - `SyncPlayerProfileUseCaseTest.java`: Add tests for `execute` with the `queue` parameter.
- **Frontend Unit Tests**:
  - `DashboardContext.test.tsx`: Verify the external filter props and reset callbacks.
- **Manual Verification**:
  - Toggle filters and verify corresponding API requests in browser network tab.
  - Verify "Reset Filters" resets the state and fetches default matches.

## 16. Regression Risks

- Multiple quick clicks could trigger overlapping fetches. Use cleanup in `useEffect` (e.g. `isMounted` flag) to prevent state updates from race conditions.
- Empty states in widgets when no matches are returned by the selected filters.

## 17. Open Blockers and Pending Decisions

- None.

## 18. Readiness Checklist

- [ ] The requested change is clear.
- [ ] The expected behavior is documented.
- [ ] The current behavior is documented or explicitly marked as unknown.
- [ ] Relevant sources were reviewed.
- [ ] Relevant code areas were reviewed.
- [ ] Relevant tests were reviewed or absence was documented.
- [ ] Relevant UI behavior was observed with Playwright MCP when applicable.
- [ ] Relevant questions were asked one at a time.
- [ ] User answers were documented.
- [ ] Open blockers are documented.
- [ ] Pending decisions are documented.
- [ ] Development guidance is documented.
- [ ] Expected code structure or contracts are documented.
- [ ] Suggested validation scenarios are documented.

## 19. Structured Agent Reference

```json
{
  "spec": {
    "index": "003",
    "name": "api-driven-match-filtering",
    "path": "docs/changes/003-api-driven-match-filtering/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement API-driven match filtering with parallel requests for combined filters and client-side fallback for Normal games.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java",
        "purpose": "Verify request parameters and usecase delegation"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts",
        "purpose": "Define search orchestration, merging, sorting, and slicing logic"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Normal queue filter must not be sent to backend",
        "reason": "NORMAL filter uses default endpoint without queue parameter and filters client-side"
      }
    ],
    "userConfirmedDecisions": [
      "Option 2 (single queue parameter backend API)",
      "Normal matches use unfiltered endpoint + client-side filtering"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Parallel fetching on multiple active filters",
      "Correct sorting by gameCreation descending and slicing to activeRange",
      "Reset filters functionality"
    ]
  }
}
```
