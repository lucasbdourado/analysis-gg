# Change Spec: Weekday Chart and Filter Fixes

## 1. Overview

This specification details the changes required to fix the client-side queue filtering behavior and Wednesday tick label clipping on the Analysis.GG dashboard. Specifically, the match list should be filtered by queue type *before* applying the match count slice (e.g., Last 20, Last 50), and the Weekday Performance chart should always display Wednesday's label.

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

- [DashboardContext.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx): Manages the construction of `filteredMatches`.
- [WeekdayWinRateChart.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx): Renders the weekday win rate chart.

## 4. Confirmed Facts

- In the current implementation of `DashboardContext.tsx`, `rawData` is sliced first by `activeRange` and then filtered by `selectedQueues`. For player `Joeyzenhu#br1` with 100 matches, choosing "Last 20" and filtering by Solo/Duo + Flex results in only 14 matches being analyzed (6 non-ranked matches are discarded).
- In `WeekdayWinRateChart.tsx`, Recharts hides the "Wednesday" X-axis tick because it is the longest day name (9 characters) and no `interval={0}` is configured on `<XAxis />`.
- Audited calculations for Joeyzenhu#br1 in the client's local timezone (`America/Sao_Paulo`) are mathematically correct in the chart (e.g., Friday: 39% [7W-11L], Saturday: 58% [15W-11L], Sunday: 57% [8W-6L]). They differ from UTC calculations due to a timezone shift.

## 5. Inferences and Assumptions

- Filtering matches by queue *first* and then slicing by `activeRange` matches the user's intention of analyzing the last N matches *of the selected queue types*.

## 6. Questions and Answers

- **Question**: Ao filtrar por filas (ex: Solo/Duo + Flex) e escolher um número de partidas no seletor (ex: 'Last 20' ou 'Last 100'), qual comportamento é o esperado para o cálculo?
  - **Why it matters**: Determines the ordering of filters (slice-then-filter vs. filter-then-slice) which impacts how many games are analyzed and how the win rates are calculated when filters are active.
  - **User Answer**: 1 (Filtrar primeiro pelas filas e depois limitar)
  - **Effect**: We will change `filteredMatches` in `DashboardContext.tsx` to filter first, then slice.

## 7. Current Behavior

- `filteredMatches` slices first, then filters, reducing the analyzed game count if there are non-matching games in the slice.
- "Wednesday" label is hidden by Recharts due to automatic collision detection.

## 8. Expected Behavior

- Selecting "Last N" games and filtering by queue types shows the last N games of *those queue types* (or fewer if total matches matching those queues is less than N).
- Wednesday tick label is visible on the Weekday Performance chart.

## 9. Scope

- Modify `filteredMatches` in `DashboardContext.tsx`.
- Add `interval={0}` to `<XAxis>` in `WeekdayWinRateChart.tsx`.
- Update unit tests in `DashboardContext.test.tsx` and `WeekdayWinRateChart.test.tsx`.

## 10. Out of Scope

- Backend changes or altering how `rawData` is fetched.
- Timezone conversion settings in the dashboard (keeping local timezone interpretation).

## 11. Functional Acceptance Criteria

- **AC1: Filter first, then slice**: When queue filters are active, selecting "Last 20" displays 20 games of those selected queues if available.
- **AC2: Wednesday label visible**: The label "Wednesday" is always rendered on the X-axis of the Weekday Performance chart.

## 12. Technical Findings

- Changing the ordering of filter/slice in `DashboardContext.tsx` is straightforward and updates all downstream widgets seamlessly.

## 13. Development Guidance

- Modify `filteredMatches` in `DashboardContext.tsx` to:
  ```typescript
  const filteredMatches = useMemo(() => {
    const data = rawData || [];
    if (selectedQueues.length === 0) {
      return data.slice(0, Math.min(data.length, activeRange));
    }
    const targetQueueIds = selectedQueues.flatMap(q => QUEUE_MAP[q] || []);
    const filtered = data.filter(match => targetQueueIds.includes(match.queueId));
    return filtered.slice(0, Math.min(filtered.length, activeRange));
  }, [rawData, activeRange, selectedQueues]);
  ```

## 14. Suggested Code Structure and Contracts

- No changes to interfaces or contracts.

## 15. Validation References

- **Unit Tests**:
  - `DashboardContext.test.tsx`: Update to verify that filter-first-then-slice is used.
- **Manual Validation**:
  - Verify `Joeyzenhu#br1` shows exactly 20 matches when "Last 20" is selected with Solo/Duo + Flex active.

## 16. Regression Risks

- Test suite assertions that assume slice-then-filter behavior will need to be updated.

## 17. Open Blockers and Pending Decisions

- None.

## 18. Readiness Checklist

- [x] The requested change is clear.
- [x] The expected behavior is documented.
- [x] The current behavior is documented or explicitly marked as unknown.
- [x] Relevant sources were reviewed.
- [x] Relevant code areas were reviewed.
- [x] Relevant tests were reviewed or absence was documented.
- [x] Relevant UI behavior was observed with Playwright MCP when applicable.
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
    "index": "002",
    "name": "weekday-chart-and-filter-fixes",
    "path": "docs/changes/002-weekday-chart-and-filter-fixes/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Fix match range slicing order with queue filters active, and show Wednesday label on the XAxis.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Define filteredMatches calculation logic"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx",
        "purpose": "Define weekday win rate chart rendering"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Purely client-side filtering on sliced data",
        "reason": "Vite React dashboard pulls raw matches list from API based on count first"
      }
    ],
    "userConfirmedDecisions": [
      "Filter matches first by selected queues, then slice by activeRange"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Dynamic recalculation of wins/losses/rates",
      "X-axis label rendering for Wednesday"
    ]
  }
}
```
