# Change Spec: Match Type Filtering

## 1. Overview

This specification details the changes required to implement client-side match type filtering on the Analysis.GG dashboard. Clickable text options will allow users to filter matches by queue type (Ranked Solo/Duo, Ranked Flex, Normal, ARAM, and Custom). Selecting these options dynamically updates the entire dashboard—including win rate metrics, day-of-month calendar timeline, weekday performance, and top champion statistics—by recalculating stats using only the filtered subset of matches. Multiple filters can be combined.

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

- [DashboardContext.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx): Handles match range slicing and distributes `filteredMatches` to all dashboard widgets.
- [DashboardPage.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): Main dashboard shell where filters will be integrated.
- [DailyPerformanceGrid.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx): Renders the 30-day performance grid and calendar timeline.
- [TopChampionsTable.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx): Renders champion win rates, CS/min, and KDA.
- [WeekdayWinRateChart.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx): Renders the bar chart for performance by day of the week.
- [RiotApiClientAdapter.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java): Calls the Riot API to resolve PUUIDs and match lists.

## 4. Confirmed Facts

- The default state of the dashboard when no filters are selected is to show all matches (no filtering).
- The filters must be combinable, allowing users to toggle multiple queue options simultaneously.
- When filters change, all widgets on the dashboard must recalculate and update in real-time.
- The queue IDs to map from the Riot API match data are:
  - **Ranked Solo/Duo**: `queueId` = `420`
  - **Ranked Flex**: `queueId` = `440`
  - **Normal**: `queueId` = `400`, `430`, `490` (includes Normal Draft, Normal Blind, Normal Quickplay)
  - **ARAM**: `queueId` = `450`
  - **Custom**: `queueId` = `0`
- The backend `RiotApiClientAdapter.java` currently hardcodes the `queue=420` and `queue=440` parameters when calling `fetchMatchIds`, which blocks other game types from being fetched.

## 5. Inferences and Assumptions

- It is assumed that Custom games in League of Legends are mapped to `queueId` of `0` in matches retrieved via Riot API.
- The UI filters will be placed in the dashboard header, next to the "Games to Analyze" range filter, to maintain clean layout coherence.
- Clicking an active filter text toggles it off. If all filters are toggled off, it returns to showing all matches.

## 6. Questions and Answers

- **Question**: When no filters are selected, should the page show all matches (default) or no matches?
  - **Why it matters**: Determines the initial dashboard state and the logic for the empty filter array.
  - **User Answer**: "Deve exibir todas as partidas, comportamento padrão de 'Sem filtro'".
  - **Effect**: If the selected queues list is empty, no filter is applied to the sliced matches list.
- **Question**: Which match types/queues should be supported?
  - **Why it matters**: We need a mapping between Riot queue IDs and UI filter text categories.
  - **User Answer**: Solo/Duo, Flex, Normal, ARAM, Custom.
  - **Effect**: Added mapping of these categories to `420`, `440`, `[400, 430, 490]`, `450`, and `0` respectively.

## 7. Current Behavior

- Matches are loaded via `usePlayerAnalytics` hook in `DashboardPage.tsx`.
- They are passed to `DashboardProvider` in `DashboardContext.tsx`.
- The provider slices `rawData` by `activeRange` (20, 50, 100) to create `filteredMatches`.
- There is no filtering based on match type or queue type.
- The backend only queries Solo/Duo and Flex match lists.

## 8. Expected Behavior

- Clickable text elements for "Solo/Duo", "Flex", "Normal", "ARAM", and "Custom" are displayed in the header.
- Clicking a text element toggles its active state. Active text filters are highlighted.
- Matches are filtered to only show those matching the active filter categories. If no filters are active, all matches are shown.
- All dashboard widgets (`DailyPerformanceGrid`, `WeekdayWinRateChart`, `TopChampionsTable`) automatically recalculate win rates, CS, KDA, calendar ranges, and weekday performance based on the filtered subset of matches.
- The backend queries all match IDs by omitting the `queue` query parameter from the Riot API endpoint.

## 9. Scope

- Modify `RiotApiClientAdapter.java` to fetch match IDs without filter restrictions, reducing fetch API calls.
- Update `RiotApiIntegrationTest.java` WireMock stubs to match the updated API query format.
- Modify `DashboardContext.tsx` and `DashboardContextProps` to store active filters and export filter helper functions.
- Create `MatchQueueFilter.tsx` and `MatchQueueFilter.module.css` to render clickable text filters.
- Integrate `MatchQueueFilter` in `DashboardPage.tsx`.
- Write unit, integration, and E2E tests to verify context state modifications and component rendering.

## 10. Out of Scope

- Backend-side match filtering (the API query fetches recent matches of all modes; filtering remains 100% client-side).
- Persisting selected filters in local storage or URL query parameters.

## 11. Functional Acceptance Criteria

- **AC1: Filter Render**: Clickable text filters for Solo/Duo, Flex, Normal, ARAM, and Custom are rendered.
- **AC2: Filter Highlight**: Active filters show a visual cue (e.g. cyan text with neon underline or neon glow) and inactive filters are dimmed.
- **AC3: Combination**: Users can activate multiple filters at once (e.g., Solo/Duo and Flex active at the same time).
- **AC4: Default State**: When no filters are selected, all matches are displayed.
- **AC5: Page Recalculation**: Selecting a filter updates the daily performance grid, calendar timeline, weekday win rate chart, and top champions table immediately.
- **AC6: Empty State**: If no matches in the analyzed range fit the selected filter combinations, all widgets show their respective empty states (e.g., "No match records to display.").

## 12. Technical Findings

- All components are already structured around `filteredMatches` from `useDashboard()`.
- Updating the calculation of `filteredMatches` in `DashboardProvider` directly updates all child widgets.
- The date range timeline in `DailyPerformanceGrid` uses:
  ```typescript
  const timestamps = filteredMatches.map(m => m.gameCreation);
  const latestTimestamp = Math.max(...timestamps);
  ```
  If `filteredMatches` is updated, the timeline window recalculates based on the latest match in the *filtered* list, which matches the user's request.

## 13. Development Guidance

- Extend the context state:
  ```typescript
  const [selectedQueues, setSelectedQueues] = useState<string[]>([]);
  ```
  where categories are `['SOLO_DUO', 'FLEX', 'NORMAL', 'ARAM', 'CUSTOM']`.
- Define queue ID mappings:
  ```typescript
  const QUEUE_MAP: Record<string, number[]> = {
    SOLO_DUO: [420],
    FLEX: [440],
    NORMAL: [400, 430, 490],
    ARAM: [450],
    CUSTOM: [0]
  };
  ```
- Calculate `filteredMatches` by filtering:
  ```typescript
  const filteredMatches = useMemo(() => {
    const sliced = rawData.slice(0, Math.min(rawData.length, activeRange));
    if (selectedQueues.length === 0) return sliced;
    
    const targetQueueIds = selectedQueues.flatMap(q => QUEUE_MAP[q]);
    return sliced.filter(match => targetQueueIds.includes(match.queueId));
  }, [rawData, activeRange, selectedQueues]);
  ```

## 14. Suggested Code Structure and Contracts

### `DashboardContextProps` updates:
```typescript
export interface DashboardContextProps {
  rawData: MatchSummary[];
  activeRange: number;
  setActiveRange: (range: number) => void;
  filteredMatches: MatchSummary[];
  selectedQueues: string[];
  toggleQueueFilter: (queueKey: string) => void;
}
```

### `MatchQueueFilter` Component:
- Location: `src/main/frontend/src/features/dashboard/presentation/components/MatchQueueFilter.tsx`
- Renders 5 text links with hover styling and dynamic active classes.

## 15. Validation References

- **Unit Tests**:
  - `DashboardContext.test.tsx`: Add cases verifying `filteredMatches` updates when `selectedQueues` is modified.
- **Component Tests**:
  - `MatchQueueFilter.test.tsx`: Verify toggling buttons updates the active filters list and triggers context updates.
- **Playwright E2E/Manual Validation**:
  - Launch application dev server on `http://localhost:5173` and backend on `8080`.
  - Use Playwright MCP to search for a player with diverse matches (e.g. `Hide on bush#KR1`).
  - Perform click actions on the clickable text filters ("Solo/Duo", "Flex", etc.).
  - Take snapshots and screenshots using Playwright MCP to verify that the widgets (Charts, Grid, Table) correctly show filtered data and that active filters are visually highlighted.

## 16. Regression Risks

- Empty states layout styling: ensure widgets handle empty `filteredMatches` arrays gracefully without breaking or throwing errors.
- Visual alignment of filters in header across different screen sizes.

## 17. Open Blockers and Pending Decisions

- None.

## 18. Readiness Checklist

- [x] The requested change is clear.
- [x] The expected behavior is documented.
- [x] The current behavior is documented or explicitly marked as unknown.
- [x] Relevant sources were reviewed.
- [x] Relevant code areas were reviewed.
- [x] Relevant tests were reviewed or absence was documented.
- [x] Relevant UI behavior was observed with Playwright MCP.
- [x] Relevant questions were asked one at a time.
- [x] User answers were documented.
- [x] Open blockers are documented.
- [x] Pending decisions are documented.
- [x] Development guidance is documented.
- [x] Expected code structure or contracts are documented.
- [x] Suggested validation scenarios are documented.

## 19. Structured Agent Reference

```json
{
  "spec": {
    "index": "001",
    "name": "match-type-filtering",
    "path": "docs/changes/001-match-type-filtering/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement client-side match type filtering (Solo/Duo, Flex, Normal, ARAM, Custom) on the dashboard.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up answers",
        "purpose": "Define filtering rules and queue mapping requirements"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Understand state management and filteredMatches distribution"
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java",
        "purpose": "Identify backend queue fetch constraints"
      },
      {
        "type": "tool",
        "reference": "Playwright MCP browser navigation to localhost:5173",
        "purpose": "Examine dashboard UI visual state and layout"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "playwright",
        "requiredWhen": "Verification phase",
        "purpose": "Run browser flows to verify click actions and correct UI rendering of filtered widgets"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Purely client-side filtering on sliced data",
        "reason": "Vite React dashboard pulls raw matches list from API based on count first"
      },
      {
        "constraint": "Backend must remove query parameters for queues 420 and 440 to retrieve other modes",
        "reason": "Riot API won't return Normal, ARAM or Custom games otherwise"
      }
    ],
    "userConfirmedDecisions": [
      "Default state displays all matches (no filters active)",
      "Supported categories are Solo/Duo, Flex, Normal, ARAM, and Custom",
      "Placed in the header, immediately next to range select"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Dynamic recalculation of wins/losses/rates",
      "Dynamic timeline/calendar recalculation in DailyPerformanceGrid",
      "Playwright MCP E2E verification of clicks and screenshot validations"
    ]
  }
}
```
