# Change Spec: Interactive Role Filtering and Ranks Relayout

## 1. Overview

This change enhances the player profile page by repositioning past season ranks and introducing interactive filtering by role. The past season ranks (currently placed at the top of the profile panel) will be moved below the current Solo/Duo and Flex ranked queue displays. In addition, the **Route Performance** list will become interactive: clicking on any role (e.g., Top, Jungle, Mid, Bot, Support) will filter all other analytical dashboard components (the weekly performance chart, the top champions table, the daily performance grid, and the recent match history list) to display data exclusively for matches where the player played in that role. Clicking the active role a second time will toggle and clear the filter, reverting the dashboard to showing all roles.

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
- **Account Summary Component:** [AccountRankedSummary.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx)
- **Account Summary Styles:** [AccountRankedSummary.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.module.css)
- **Route Performance Component:** [RouteWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)
- **Route Performance Styles:** [RouteWinRateChart.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.module.css)
- **Weekday Performance Component:** [WeekdayWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- **Top Champions Component:** [TopChampionsTable.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx)
- **Daily Performance Component:** [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx)
- **Recent Match History Component:** [RecentMatchHistory.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx)

## 4. Confirmed Facts

- The past season ranks pills are currently rendered above the summoner icon/nickname in `AccountRankedSummary.tsx`.
- The current ranks (Solo/Duo and Flex) are rendered inside the `.queues` container in `AccountRankedSummary.tsx`.
- `DashboardContext.tsx` manages the list of filtered matches (filtered by queue type and active range limit) as `filteredMatches`.
- The dashboard components (`RouteWinRateChart`, `WeekdayWinRateChart`, `TopChampionsTable`, `DailyPerformanceGrid`, and the `RecentMatchHistory` via `DashboardPage.tsx`) currently read `filteredMatches` directly.
- The standard roles are Top, Jungle, Mid, Bot, and Support, which map to match positions `TOP`, `JUNGLE`, `MIDDLE`, `BOTTOM`, and `UTILITY`.

## 5. Inferences and Assumptions

- Moving `pastSeasonRanks` below the `queues` section in `AccountRankedSummary` aligns with standard profile pages (e.g. OP.GG/U.GG) and fulfills the request.
- Adding a `selectedRole` state to `DashboardContext` and computing `roleFilteredMatches` allows us to selectively filter downstream components while keeping `RouteWinRateChart` aware of all played roles to allow toggle actions.
- Highlighting the active role in `RouteWinRateChart` visually with a border and/or slight background color change makes the filter state clear to the user.

## 6. Questions and Answers

- **Question:** Para a exibição dos ranks das últimas temporadas abaixo do rank atual: no componente `AccountRankedSummary`, o rank atual é mostrado em blocos separados para Solo/Duo e Flex. Você gostaria que os ranks das temporadas anteriores fossem exibidos no rodapé do card, logo abaixo das filas atuais, mantendo o formato atual de pílulas horizontais, ou prefere outro formato visual?
  - **Why it matters:** Determines the styling and positioning of the historical ranks.
  - **User Answer:** Mantenha o formato atual.
  - **Effect on the spec:** Move the existing `pastRanks` block to the bottom of the component structure, below the `queues` div, without altering the styling of the pills.
- **Question:** Como você deseja desativar/limpar a filtragem por role? A nossa recomendação é que, ao clicar novamente na role que já está selecionada, a filtragem seja limpa e a tela volte a exibir os dados de todas as roles combinadas (como um comportamento de toggle). Esta abordagem atende às suas expectativas ou você prefere uma forma diferente?
  - **Why it matters:** Establishes the interaction flow for resetting the role filter.
  - **User Answer:** Siga a recomendação.
  - **Effect on the spec:** Clicking a role item in `RouteWinRateChart` will set `selectedRole` to that role. If the clicked role is already the `selectedRole`, it sets `selectedRole` to `null` (resetting the filter).
- **Question:** Você gostaria que o calendário de atividades diárias (*DailyPerformanceGrid*) também fosse filtrado pela role selecionada, ou ele deve continuar exibindo todas as partidas independentemente da role?
  - **Why it matters:** Aligns the daily grid data visualization with the selected role.
  - **User Answer:** Sim gostaria.
  - **Effect on the spec:** `DailyPerformanceGrid` will consume `roleFilteredMatches` from `DashboardContext` to render only the player's activity for the selected role.

## 7. Current Behavior

- Past season ranks are displayed at the very top of `AccountRankedSummary.tsx`.
- The `RouteWinRateChart` rows are static, non-clickable elements.
- The charts (weekly performance, daily performance), top champions, and match history list are not filtered by role.

## 8. Expected Behavior

- **Account Profile Card:**
  - The past season ranks pills section is displayed at the bottom of the card, directly below the `queues` container (which contains the current Solo/Duo and Flex boxes).
- **Route Performance Card:**
  - The role rows in `RouteWinRateChart` are interactive. Hovering over a row changes the cursor to `pointer` and increases the background opacity slightly.
  - Clicking an inactive role row selects it, updating the visual state to show it as active (e.g., applying a distinct border/background highlight) and filtering the dashboard.
  - Clicking the active role row again deselects it, removing the active visual styling and clearing the filter.
- **Filtered Dashboard Widgets:**
  - `WeekdayWinRateChart`, `TopChampionsTable`, `DailyPerformanceGrid`, and `RecentMatchHistory` display data representing ONLY matches played in the selected role.
  - If no role is selected, these widgets display all matches as they currently do.

## 9. Scope

- **Frontend Context:**
  - Update `DashboardContext.tsx` to add `selectedRole` (string | null), `setSelectedRole`, and `roleFilteredMatches` (MatchSummary[]) to the context.
- **Frontend Pages:**
  - Update `DashboardPage.tsx` to pass `roleFilteredMatches` instead of `filteredMatches` to `RecentMatchHistory`.
- **Frontend Components:**
  - **AccountRankedSummary:** Reposition the `pastSeasonRanks` rendering block to the bottom of the main layout, below the `.queues` section.
  - **RouteWinRateChart:** Make the role list items clickable, trigger `setSelectedRole` when clicked (handling toggling if the role is clicked again), and add conditional styling classes for the selected state.
  - **RouteWinRateChart CSS:** Add `.roleItemActive` and `cursor: pointer` properties.
  - **WeekdayWinRateChart:** Retrieve and use `roleFilteredMatches` instead of `filteredMatches`.
  - **TopChampionsTable:** Retrieve and use `roleFilteredMatches` instead of `filteredMatches`.
  - **DailyPerformanceGrid:** Retrieve and use `roleFilteredMatches` instead of `filteredMatches`.
- **Frontend Tests:**
  - Update `DashboardContext.test.tsx` and `RouteWinRateChart.test.tsx` to align with the new interactivity and context structure.

## 10. Out of Scope

- Adding custom role filters outside of the `RouteWinRateChart` component (e.g. in the header filters).
- Changing backend Riot API endpoints or data structures.
- Displaying other match types (e.g. ARAM roles) if they don't have standard positions.

## 11. Functional Acceptance Criteria

- **AC 1 (Past Ranks Placement):** In `AccountRankedSummary`, the past season rank pills display at the bottom of the panel, below the current queue items.
- **AC 2 (Hover & Cursor):** Each role row in `RouteWinRateChart` displays a `pointer` cursor on hover.
- **AC 3 (Select Role Filter):** Clicking a role row (e.g. "Top") updates the selected role. The other dashboard panels (Weekday Chart, Top Champions Table, Daily Grid, and Recent Match History) immediately update to show only games where `teamPosition` is `'TOP'`.
- **AC 4 (Deselect Role Filter):** Clicking the selected role row again clears the filter, returning the dashboard panels to their full data set.
- **AC 5 (Selected Role Styling):** The selected role row has a distinct active style (e.g., border color set to gold/cyan or increased background opacity).

## 12. Technical Findings

- LoL role positions are stored in `teamPosition` in lowercase or uppercase. We map standard display roles to `teamPosition` as follows:
  - `"Top"` -> `"TOP"`
  - `"Jungle"` -> `"JUNGLE"`
  - `"Mid"` -> `"MIDDLE"`
  - `"Bot"` -> `"BOTTOM"`
  - `"Support"` -> `"UTILITY"`
- To filter matches safely:
  ```typescript
  const isMatchForRole = (match: MatchSummary, role: string) => {
    const pos = match.teamPosition;
    if (!pos) return false;
    const normalizedPos = pos.toUpperCase();
    if (role === 'Top') return normalizedPos === 'TOP';
    if (role === 'Jungle') return normalizedPos === 'JUNGLE';
    if (role === 'Mid') return normalizedPos === 'MIDDLE';
    if (role === 'Bot') return normalizedPos === 'BOTTOM';
    if (role === 'Support') return normalizedPos === 'UTILITY';
    return false;
  };
  ```

## 13. Development Guidance

- **State and Context Integration:**
  In `DashboardContext.tsx`, define:
  ```typescript
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roleFilteredMatches = useMemo(() => {
    if (!selectedRole) return filteredMatches;
    return filteredMatches.filter(match => isMatchForRole(match, selectedRole));
  }, [filteredMatches, selectedRole]);
  ```
- **Interactive Component Handler:**
  In `RouteWinRateChart.tsx`:
  ```typescript
  const { filteredMatches, selectedRole, setSelectedRole } = useDashboard();
  
  const handleRoleClick = (roleName: string) => {
    if (selectedRole === roleName) {
      setSelectedRole(null); // Clear filter
    } else {
      setSelectedRole(roleName); // Apply filter
    }
  };
  ```

## 14. Suggested Code Structure and Contracts

All modifications are confined to the frontend presentation layer:
- [DashboardContext.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx)
- [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx)
- [AccountRankedSummary.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx)
- [RouteWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)
- [RouteWinRateChart.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.module.css)
- [WeekdayWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- [TopChampionsTable.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx)
- [DailyPerformanceGrid.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx)

## 15. Validation References

### Manual Validation
- Select a profile with games on multiple roles.
- Hover over the role list in Route Performance. Verify pointer cursor.
- Click a role row (e.g. Jungle). Verify other charts, tables, and lists reload to reflect only Jungle games.
- Click the same row again. Verify that the dashboard reverts to all games.
- Verify that the past season ranks are correctly displayed at the bottom of the profile summary card.

### Unit/Component Tests
- Run `npm run test` or `vitest` to verify tests pass.
- Update `RouteWinRateChart.test.tsx` to assert that clicking a role row triggers the filter.

## 16. Regression Risks

- **No matches in role:** Since a user can only click roles that are displayed in `RouteWinRateChart` (which filters out 0-game roles), there will always be at least one game in the selected role. However, if the data updates dynamically, handling empty states in the downstream components is required.
- **Testing environment context:** Ensure `DashboardProvider` in test files provides mock context defaults for `selectedRole`, `setSelectedRole`, and `roleFilteredMatches` to avoid crashing existing test suites.

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
    "index": "013",
    "name": "interactive-role-filtering-and-ranks-relayout",
    "path": "docs/changes/013-interactive-role-filtering-and-ranks-relayout/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Move past season ranks to the bottom of the profile summary card and implement click-to-filter role interactions for the Route Performance widget.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx",
        "purpose": "Component where the past season ranks position will be modified."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx",
        "purpose": "Component to make role rows clickable."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Context to hold selectedRole state and provide roleFilteredMatches."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Keep the existing horizontal pills format for past ranks",
        "reason": "Explicit user request."
      },
      {
        "constraint": "Support toggle deselection by clicking the active role again",
        "reason": "Explicit user approval of the recommended interaction pattern."
      }
    ],
    "userConfirmedDecisions": [
      "Keep current visual format for past ranks",
      "Use click-toggle deselection behavior",
      "Filter the Daily Performance Grid by role as well"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "DashboardContext.test.tsx for state validation",
      "RouteWinRateChart.test.tsx for clicking interaction"
    ]
  }
}
```
