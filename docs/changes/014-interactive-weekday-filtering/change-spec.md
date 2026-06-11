# Change Spec: Interactive Weekday Filtering

## 1. Overview

This change introduces interactive weekday filtering on the player profile dashboard. Clicking a day bar in the **Weekday Performance** chart filters all other analytical components (the Route Performance chart, top champions table, daily performance grid, and recent match history list) to display data representing only matches played on that weekday. Clicking the active day bar a second time toggles and clears the filter, reverting the dashboard.

If both a role filter and a weekday filter are active simultaneously, the data components (Top Champions, Recent Match History, and Daily Performance Grid) are filtered by both. The Route Performance chart is filtered only by the selected weekday (allowing the user to see/change the active role for that day). The Weekday Performance chart is filtered only by the selected role (allowing the user to see/change the active weekday for that role). The active day bar is highlighted using the system's gold theme color (`var(--color-gold-500)`).

## 2. Research Checklist

- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior.
- [x] Analyze directly related code areas.
- [x] Analyze existing tests directly related to the change.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context

- **Dashboard Context:** [DashboardContext.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx)
- **Dashboard Page Component:** [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx)
- **Route Performance Component:** [RouteWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)
- **Weekday Performance Component:** [WeekdayWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- **Top Champions Component:** [TopChampionsTable.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx)
- **Daily Performance Component:** [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx)
- **Recent Match History Component:** [RecentMatchHistory.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx)

## 4. Confirmed Facts

- `DashboardContext.tsx` handles queue filtering, range filtering, and role filtering.
- The standard weekday names computed in `WeekdayWinRateChart` are `'Sunday'`, `'Monday'`, `'Tuesday'`, `'Wednesday'`, `'Thursday'`, `'Friday'`, and `'Saturday'`.
- Matches are currently filtered by role in `roleFilteredMatches` and consumed by downstream components.
- The weekday bar chart uses Recharts `<Bar>` with `fill="var(--color-cyan-500)"`.
- Design tokens file `tokens.css` contains `--color-gold-500` (#cfae63) and `--color-cyan-500` (#16b9dc).

## 5. Inferences and Assumptions

- Clicking a bar in the Recharts `<Bar>` can be handled by rendering individual `<Cell>` components inside `<Bar>` and passing `onClick` handlers to them.
- Highlighting the selected day with `fill="var(--color-gold-500)"` and setting `cursor: pointer` on hover over the cells will make the interactivity intuitive.
- Applying both role and weekday filters to data widgets (Match History, Top Champions, and Daily Grid) provides deep analytical filtering capability.

## 6. Questions and Answers

- **Question:** Como deve se comportar a combinação de filtros por Rota (Role) e Dia da Semana (Weekday) quando ambos estiverem selecionados?
  - **Why it matters:** Establishes the cross-filtering logic between the two interactive selection components and the rest of the dashboard widgets.
  - **User Answer:** Opção 1: Filtros combinados nos componentes de dados (Match History, Top Champions, Daily Grid), mas nos gráficos seletores cada um ignora o próprio filtro (o gráfico de Rotas é filtrado apenas pelo Dia, e o de Dias é filtrado apenas pela Rota).
  - **Effect on the spec:**
    - `RouteWinRateChart` uses `weekdayFilteredMatches` (filtered by activeRange/queues + selectedWeekday).
    - `WeekdayWinRateChart` uses `roleFilteredMatches` (filtered by activeRange/queues + selectedRole).
    - `TopChampionsTable`, `DailyPerformanceGrid`, and `RecentMatchHistory` use `combinedFilteredMatches` (filtered by activeRange/queues + selectedRole + selectedWeekday).
- **Question:** Qual cor devemos usar para destacar a barra do dia selecionado no gráfico de dias da semana?
  - **Why it matters:** Controls the visual indicator for the active weekday filter to align with the design system.
  - **User Answer:** Pode usar a cor dourada (`var(--color-gold-500)`).
  - **Effect on the spec:** Style the active day's `<Cell>` using `var(--color-gold-500)` and other days with the standard `var(--color-cyan-500)`.

## 7. Current Behavior

- Clicking bars in `WeekdayWinRateChart` does nothing.
- The cursor when hovering over bars in the chart is default.
- Downstream widgets are filtered only by active range, queues, and selected role.

## 8. Expected Behavior

- **Weekday Performance Chart:**
  - Hovering over any day's bar in the chart changes the cursor to `pointer`.
  - Clicking a bar selects that day, updating its fill color to `--color-gold-500` (gold) while other bars remain `--color-cyan-500` (cyan).
  - Clicking the selected day's bar again deselects it, reverting the color to cyan and removing the weekday filter.
- **Cross-Filtered Dashboard Widgets:**
  - When a weekday is selected, `RouteWinRateChart` calculates play rates and win rates using only matches played on that specific weekday.
  - `TopChampionsTable`, `DailyPerformanceGrid`, and `RecentMatchHistory` calculate their contents using matches that fit BOTH the selected role AND the selected weekday (if both are active).

## 9. Scope

- **Frontend Context:**
  - Add `selectedWeekday: string | null`, `setSelectedWeekday: (day: string | null) => void`, `weekdayFilteredMatches: MatchSummary[]`, and `combinedFilteredMatches: MatchSummary[]` to `DashboardContextProps` and `DashboardContext` exports in `DashboardContext.tsx`.
  - Compute `weekdayFilteredMatches` by filtering `filteredMatches` using the match's weekday name.
  - Compute `combinedFilteredMatches` by filtering `filteredMatches` by both `selectedRole` and `selectedWeekday` (when active).
- **Frontend Components:**
  - **WeekdayWinRateChart:** Consume `selectedWeekday` and `setSelectedWeekday` from `useDashboard`. Map the `<Bar>` element to render individual `<Cell>` components. Conditionally style the cell's `fill` with `var(--color-gold-500)` if selected, and add `onClick` to trigger selection/toggling. Add `style={{ cursor: 'pointer' }}` to cells.
  - **RouteWinRateChart:** Retrieve and use `weekdayFilteredMatches` instead of `filteredMatches`.
  - **TopChampionsTable:** Retrieve and use `combinedFilteredMatches` instead of `roleFilteredMatches`.
  - **DailyPerformanceGrid:** Retrieve and use `combinedFilteredMatches` instead of `roleFilteredMatches`.
- **Frontend Pages:**
  - **DashboardPage.tsx:** Pass `combinedFilteredMatches` instead of `roleFilteredMatches` to `RecentMatchHistory`.
- **Frontend Tests:**
  - Update `DashboardContext.test.tsx` to assert new filtering logic for `selectedWeekday`, `weekdayFilteredMatches`, and `combinedFilteredMatches`.
  - Update `WeekdayWinRateChart.test.tsx` to assert click interactions on the bar chart and correct styling of active cells.

## 10. Out of Scope

- Creating a separate reset button outside of the toggle click in the chart.
- Filtering backend API calls by weekday. All filtering is done on the client.
- Changing match timezone logic (matches are grouped using browser's local timezone).

## 11. Functional Acceptance Criteria

- **AC 1 (Interactive Bars):** Every bar in `WeekdayWinRateChart` has a `pointer` cursor on hover.
- **AC 2 (Select Weekday):** Clicking a bar (e.g., "Monday") selects it. The bar color turns gold (`var(--color-gold-500)`).
- **AC 3 (Filter Downstream Components):** Selecting a day filters `RouteWinRateChart` (showing only games for that weekday), and filters `TopChampionsTable`, `DailyPerformanceGrid`, and `RecentMatchHistory` (showing only games for that weekday, or combined with role if selected).
- **AC 4 (Deselect Weekday):** Clicking the gold bar again clears the weekday filter. The bar color reverts to cyan (`var(--color-cyan-500)`), and all downstream components show all days again.

## 12. Technical Findings

- We can determine a match's day of the week name via:
  ```typescript
  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const getMatchDayName = (match: MatchSummary) => {
    const date = new Date(match.gameCreation);
    return DAYS_OF_WEEK[date.getDay()];
  };
  ```
- To filter by weekday:
  ```typescript
  const isMatchForWeekday = (match: MatchSummary, dayName: string) => {
    return getMatchDayName(match) === dayName;
  };
  ```

## 13. Development Guidance

- In `DashboardContext.tsx`, implement `selectedWeekday` state:
  ```typescript
  const [localSelectedWeekday, setLocalSelectedWeekday] = useState<string | null>(null);
  const selectedWeekday = propSelectedWeekday !== undefined ? propSelectedWeekday : localSelectedWeekday;
  const setSelectedWeekday = propSetSelectedWeekday !== undefined ? propSetSelectedWeekday : setLocalSelectedWeekday;
  ```
- Calculate the three filtered match sets in `DashboardContext.tsx` via `useMemo`.
- In `WeekdayWinRateChart.tsx`, render `Cell` elements inside `<Bar>`:
  ```typescript
  import { Cell, ... } from 'recharts';
  // ...
  <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
    {weekdayData.map((entry, index) => {
      const isSelected = selectedWeekday === entry.dayName;
      return (
        <Cell
          key={`cell-${index}`}
          fill={isSelected ? 'var(--color-gold-500)' : 'var(--color-cyan-500)'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (selectedWeekday === entry.dayName) {
              setSelectedWeekday(null);
            } else {
              setSelectedWeekday(entry.dayName);
            }
          }}
        />
      );
    })}
  </Bar>
  ```

## 14. Suggested Code Structure and Contracts

The following files will be modified in the frontend presentation layer:
- `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx`

## 15. Validation References

### Manual Validation
- Select a day bar in the Weekday Performance chart. Verify that the bar color changes to gold and other panels filter accordingly.
- Select both a day bar (e.g. Monday) and a role (e.g. Mid). Verify that general data panels display only Mid games played on Mondays, while the Route chart shows all Monday roles and the Weekday chart shows all Mid days.
- Click the selected day bar again. Verify that the weekday filter is cleared and the bar color reverts to cyan.

### Unit/Component Tests
- Add tests in `DashboardContext.test.tsx` to assert new filtering logic for `selectedWeekday`, `weekdayFilteredMatches`, and `combinedFilteredMatches`.
- Add tests in `WeekdayWinRateChart.test.tsx` to assert bar clicking interactions and visual highlight changes.

## 16. Regression Risks

- **Recharts cell mocking:** Ensure the Recharts mocking in `WeekdayWinRateChart.test.tsx` correctly mirrors children cell rendering so that clicks can be simulated correctly in the test environment.
- **Timezone shifts:** Grouping matches by weekday using `new Date().getDay()` runs relative to the browser's local timezone. Ensure testing code matches this behavior.

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
    "index": "014",
    "name": "interactive-weekday-filtering",
    "path": "docs/changes/014-interactive-weekday-filtering/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement interactive weekday filtering in the WeekdayWinRateChart component to cross-filter other dashboard components.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Add state and filter variables for selectedWeekday."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx",
        "purpose": "Make day bars interactive and change active fill color."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx",
        "purpose": "Update to consume weekdayFilteredMatches."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Combine filters in Top Champions, Daily Grid, and Match History",
        "reason": "Crucial requirement for deeper cross-filtering analytical capability."
      },
      {
        "constraint": "Keep selector charts independent of their own filters",
        "reason": "Prevent active filters from hiding other choices in RouteWinRateChart and WeekdayWinRateChart."
      },
      {
        "constraint": "Use gold color (var(--color-gold-500)) for the active day bar",
        "reason": "User confirmed decision."
      }
    ],
    "userConfirmedDecisions": [
      "Option 1: Cross-filtering with independent selector charts",
      "Use var(--color-gold-500) for active day bar"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "DashboardContext.test.tsx for combined filtering logic",
      "WeekdayWinRateChart.test.tsx for clicking day bars and checking fill color"
    ]
  }
}
```
