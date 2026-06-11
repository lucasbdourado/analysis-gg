# Change Spec: Interactive Daily Performance Filtering and Multi-Select

## 1. Overview

This change introduces interactive daily performance filtering on the player profile dashboard and refactors the active filtering mechanics to support multi-select. Clicking on an activity cell inside the [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx) component filters the dashboard by that specific calendar date. 

Furthermore, all three interactive filter components—Route Performance Chart (roles), Weekday Performance Chart (weekdays), and Daily Performance Grid (calendar dates)—are upgraded from single-selection filters to multi-select filters. Users can toggle multiple roles, multiple weekdays, and multiple calendar dates concurrently. Clicking any active filter item deselects it. Selected calendar cells are highlighted using a gold outline (`var(--color-gold-500)`) and glow effect to preserve their original win/loss/tie background colors.

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
- **Daily Performance Component:** [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx)
- **Daily Performance CSS:** [DailyPerformanceGrid.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.module.css)
- **Route Performance Component:** [RouteWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)
- **Weekday Performance Component:** [WeekdayWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- **Top Champions Component:** [TopChampionsTable.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx)
- **Recent Match History Component:** [RecentMatchHistory.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx)

## 4. Confirmed Facts

- [DashboardContext.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx) currently exposes single-select values `selectedRole` and `selectedWeekday` as `string | null`.
- [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx) currently maps matches using local date strings formatted as `YYYY-MM-DD`.
- Standard weekdays are modeled as `['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']`.
- Standard role options map standard keys (`Top`, `Jungle`, `Mid`, `Bot`, `Support`) to Riot API's `teamPosition` field values (`TOP`, `JUNGLE`, `MIDDLE`, `BOTTOM`, `UTILITY`).

## 5. Inferences and Assumptions

- Upgrading filters to multi-select changes their types from `string | null` to `string[]`.
- Multi-select is cumulative: clicking an item toggles its inclusion in the active array. If the array becomes empty, it implies no filter of that category is active (i.e. all match entries are allowed for that category).
- An outline/box-shadow based gold highlight on active calendar cells ensures readability of victory/loss color coatings (green, red, cyan) underneath.

## 6. Questions and Answers

- **Question:** Para destacar a célula do dia selecionado, você concorda em aplicarmos uma borda dourada (`var(--color-gold-500)`) com um leve efeito de brilho/sombra dourada (mantendo a cor de fundo original do status), ou prefere outra abordagem visual?
  - **Why it matters:** Establishes UI style rules for active date grid cells.
  - **User Answer:** concordo, além de poder selecionar mais de um dia e mais de uma role, tanto para os ultimos 30 dias, selecionar mais de um dia quanto para os dias da semana, já que o filtro será cruzado.
  - **Effect on the spec:** Use a gold border and box-shadow outline on active cells. Redesign all filters to support array-based multi-select (multiple roles, weekdays, and dates).
- **Question:** A interação de seleção múltipla deve ocorrer através de cliques simples diretos (onde cada clique ativa/desativa o item individualmente e acumula a seleção), sem a necessidade de segurar teclas adicionais como `Ctrl` ou `Shift`?
  - **Why it matters:** Establishes the click/gesture interaction pattern.
  - **User Answer:** sim.
  - **Effect on the spec:** Standard single clicks will toggle membership in the filter lists without modifier keys.

## 7. Current Behavior

- Route Performance, Weekday Performance, and Daily Performance components are single-select or static.
- Click events on cells in [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx) do not perform any action.
- Only one role and one weekday can be selected at a time.
- Selected states are tracked as single `string | null` values in context.

## 8. Expected Behavior

- **Daily Performance Grid:**
  - Cells are interactive. Clicking a cell adds/removes its local date string (`YYYY-MM-DD`) to `selectedDates`.
  - Selected cells are styled with a gold outline (`var(--color-gold-500)`) and a subtle gold shadow/glow.
- **Route & Weekday Selection Charts:**
  - Route chart allows multiple roles to be selected. Active roles show the `roleItemActive` style.
  - Weekday chart allows multiple weekdays to be selected. Active weekday bars are filled with `var(--color-gold-500)` instead of cyan.
- **Cross-Filtering Matrix:**
  - If a filter list is empty, it does not filter the matches (it allows all).
  - Selector components ignore their own category filters to allow selecting other items, but they apply the other filters:
    - Route Chart ignores `selectedRoles` but filters by `selectedWeekdays` and `selectedDates`.
    - Weekday Chart ignores `selectedWeekdays` but filters by `selectedRoles` and `selectedDates`.
    - Daily Grid ignores `selectedDates` but filters by `selectedRoles` and `selectedWeekdays`.
  - Data displays (Top Champions, Recent Match History) combine all active filters (Roles AND Weekdays AND Dates).

## 9. Scope

- **Frontend Context:**
  - Refactor [DashboardContext.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx):
    - Replace `selectedRole`, `setSelectedRole`, `selectedWeekday`, `setSelectedWeekday` with `selectedRoles`, `setSelectedRoles`, `selectedWeekdays`, `setSelectedWeekdays`, `selectedDates`, `setSelectedDates`.
    - Implement cross-filtered match selectors: `roleSelectorMatches`, `weekdaySelectorMatches`, `dateSelectorMatches`, and `combinedFilteredMatches`.
- **Frontend Components:**
  - **DailyPerformanceGrid:** Consume `selectedDates` and `setSelectedDates` from context. Toggle dates on click. Apply the `selected` class conditionally to selected cells. Use `dateSelectorMatches` instead of `combinedFilteredMatches` to build the grid timeline.
  - **DailyPerformanceGrid CSS:** Implement the `.selected` class with gold outline and box-shadow.
  - **RouteWinRateChart:** Consume `selectedRoles` and `setSelectedRoles` from context. Check inclusion for active classes. Toggle roles on click. Consume `roleSelectorMatches` instead of `weekdayFilteredMatches`.
  - **WeekdayWinRateChart:** Consume `selectedWeekdays` and `setSelectedWeekdays` from context. Toggle weekdays on cell clicks. Highlight active cells in gold. Consume `weekdaySelectorMatches` instead of `roleFilteredMatches`.
- **Frontend Pages:**
  - **DashboardPage:** Continue passing `combinedFilteredMatches` (which now correctly integrates the date filter) to `RecentMatchHistory`.
- **Frontend Tests:**
  - Update context tests in [DashboardContext.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx).
  - Update component tests in [DailyPerformanceGrid.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.test.tsx), [RouteWinRateChart.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.test.tsx), and [WeekdayWinRateChart.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx) to align with array properties.

## 10. Out of Scope

- Modifying the backend Riot APIs. All filtering remains client-side.
- Multi-select filters outside of Route, Weekday, and Daily Performance cards (e.g. queue filters and match count range filter remain separate).

## 11. Functional Acceptance Criteria

- **AC 1 (Multi-select Toggle):** Clicking any inactive item (role, weekday, or date cell) selects it (highlighting it). Clicking an active item deselects it.
- **AC 2 (Combined Cross-Filtering):** Data views (Recent Match History, Top Champions) filter matches dynamically: they only show games matching ALL active criteria. If no filters are active, they show all games.
- **AC 3 (Independent Selectors):** Selecting a role does not filter out other roles in the Route Performance Chart. Selecting a weekday does not hide other weekdays in the Weekday Chart. Selecting a date does not hide other dates in the Daily Grid.
- **AC 4 (Daily Cell Highlight):** Selected date cells in the Daily Grid display a gold border outline (`2px solid var(--color-gold-500)`) and gold shadow glow, preserving their underlying status-dependent colors (win/loss/tie).

## 12. Technical Findings

- Matches are parsed into YYYY-MM-DD local strings via:
  ```typescript
  const getLocalDateString = (timestamp: number) => {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  ```
- Filtering logic for multiple selections:
  ```typescript
  const isMatchForRoles = (match: MatchSummary, roles: string[]) => {
    if (roles.length === 0) return true;
    return roles.some(role => isMatchForRole(match, role));
  };

  const isMatchForWeekdays = (match: MatchSummary, weekdays: string[]) => {
    if (weekdays.length === 0) return true;
    return weekdays.includes(getMatchDayName(match));
  };

  const isMatchForDates = (match: MatchSummary, dates: string[]) => {
    if (dates.length === 0) return true;
    return dates.includes(getLocalDateString(match.gameCreation));
  };
  ```

## 13. Development Guidance

- **Refactoring DashboardContext Props & Values:**
  In [DashboardContext.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx):
  ```typescript
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // 1. Filtered by range/queues + selectedWeekdays + selectedDates (for Route Chart)
  const roleSelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForWeekdays(m, selectedWeekdays))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedWeekdays, selectedDates]);

  // 2. Filtered by range/queues + selectedRoles + selectedDates (for Weekday Chart)
  const weekdaySelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedRoles, selectedDates]);

  // 3. Filtered by range/queues + selectedRoles + selectedWeekdays (for Daily Grid)
  const dateSelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForWeekdays(m, selectedWeekdays));
  }, [filteredMatches, selectedRoles, selectedWeekdays]);

  // 4. Combined Filtered Matches (for Top Champions & Match History)
  const combinedFilteredMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForWeekdays(m, selectedWeekdays))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedRoles, selectedWeekdays, selectedDates]);
  ```

- **Daily Grid Click Handler:**
  In [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx):
  ```typescript
  const { dateSelectorMatches, selectedDates, setSelectedDates } = useDashboard();
  // ...
  const handleDateClick = (dateStr: string) => {
    setSelectedDates(
      selectedDates.includes(dateStr)
        ? selectedDates.filter(d => d !== dateStr)
        : [...selectedDates, dateStr]
    );
  };
  ```

## 14. Suggested Code Structure and Contracts

The following files in the presentation layer will be changed:
- `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`

## 15. Validation References

### Manual Validation
1. Hover and click multiple cells in the Daily Performance Grid. Validate that they display a gold outline border and gold glow.
2. Select multiple roles in the Route Performance Chart (e.g. Top and Mid). Verify that the match history and Top Champions show only Top or Mid matches.
3. Select multiple weekdays in the Weekday chart. Verify correct filtering updates.
4. De-select items by clicking them again. Verify that the filters are cleared when selection arrays become empty.

### Unit/Component Tests
- Update `DashboardContext.test.tsx` to verify combined multi-select filtering logic.
- Update `DailyPerformanceGrid.test.tsx` to verify date cell toggle actions and CSS selection class bindings.
- Update `RouteWinRateChart.test.tsx` and `WeekdayWinRateChart.test.tsx` to mock array-based selection context and verify multi-select.

## 16. Regression Risks

- **Mocking Context in Legacy Test Files:** Any component tests wrapping items with `<DashboardProvider>` or mocking `useDashboard` must be updated to pass mock lists `selectedRoles`, `selectedWeekdays`, `selectedDates` instead of singular `selectedRole`/`selectedWeekday`.
- **Empty State Behavior:** When filters eliminate all matches, verify that components display their clean "No matches available" empty states instead of throwing errors.

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
    "index": "015",
    "name": "interactive-daily-performance-filtering-and-multi-select",
    "path": "docs/changes/015-interactive-daily-performance-filtering-and-multi-select/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement interactive calendar date filtering in DailyPerformanceGrid and upgrade all selectors to support simple-click multi-selection with cross-filtering.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Context file to maintain multi-select filter arrays and expose cross-filtered match categories."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx",
        "purpose": "Apply date toggling on cell click, style selected cells with active borders."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx",
        "purpose": "Update to support multi-selection array toggling and highlighting active roles."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx",
        "purpose": "Update cell clicks to support multi-selection array toggling and highlighting active weekdays in gold."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Simple clicks directly toggle selection without keyboard modifiers",
        "reason": "Explicit user request."
      },
      {
        "constraint": "Selected calendar cells display gold outline border and glow to preserve win/loss background coloring",
        "reason": "User confirmed decision."
      },
      {
        "constraint": "Independent selector charts ignore their own filters",
        "reason": "Enables selection of alternative choices within the same category."
      }
    ],
    "userConfirmedDecisions": [
      "Use simple clicks to toggle multiple filters",
      "Highlight selected date cells with outline + glow to preserve win/loss background status colors"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "DashboardContext.test.tsx for multi-select combined filtering logic",
      "DailyPerformanceGrid.test.tsx for clicking date cells and toggling selection style",
      "RouteWinRateChart.test.tsx and WeekdayWinRateChart.test.tsx for multi-select integration"
    ]
  }
}
```
