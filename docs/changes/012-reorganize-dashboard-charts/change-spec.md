# Change Spec: Reorganize Dashboard Charts

## 1. Overview

This change reorganizes the dashboard layout and visual components to solve the horizontal chart compression (squished charts) issue on high-resolution displays. Following OP.GG and U.GG design guidelines, the **Route Performance** component will be transformed from a Recharts bar chart into a compact, vertical list of roles sorted by play count. The remaining analytics panels (**Weekday Performance** and **Recent Daily Performance**) will be rearranged into a balanced 2-column grid layout, giving the bar chart and daily calendar timeline more horizontal space.

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

- **Dashboard Page Component:** [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx)
- **Dashboard Layout Styles:** [DashboardPage.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css)
- **Route Performance Component:** [RouteWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)
- **Route Performance Styles:** [RouteWinRateChart.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.module.css)
- **Route Performance Tests:** [RouteWinRateChart.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.test.tsx)

## 4. Confirmed Facts

- The `topWidgetsGrid` in `DashboardPage.module.css` currently forces a 3-column layout on screens wider than 1440px (`grid-template-columns: repeat(3, 1fr)`).
- With a sidebar of 320px, the 3-column grid restricts each chart widget to approximately 280px-330px in width.
- A Recharts bar chart with 5 roles or 7 weekdays looks compressed (columns are too narrow, and labels overlap) at these dimensions.
- LoL analytics platforms like OP.GG, U.GG, and Blitz.gg display lane/position performance using vertical lists with progress bars instead of full vertical charts.
- The project design tokens (`tokens.css`) include `--color-cyan-500` (wins) and `--color-crimson-600` (losses) which fit League of Legends styling.

## 5. Inferences and Assumptions

- By converting the Route Performance widget to a vertical list, it can no longer rely on Recharts. This eliminates the charting overhead and rendering clipping issues for this card.
- Sorting the role list by game count (descending) and hiding roles with 0 games played will provide a much cleaner, profile-focused visual.
- Changing the grid columns from `repeat(3, 1fr)` to `repeat(2, 1fr)` and allowing the `DailyPerformanceGrid` to span 2 columns will double the available horizontal space for the remaining charts.

## 6. Questions and Answers

- **Question:** How should the new Route Performance list handle roles with 0 games played?
  - **Why it matters:** Hiding empty roles simplifies the view, whereas showing them all keeps a uniform height.
  - **User Answer:** Selected Option 1, which transforms Route Performance into a sleek compact list. In OP.GG/U.GG style, roles with 0 games are filtered out and remaining ones are sorted descending by play count.
  - **Effect on the spec:** Roles with 0 games will be filtered out. The component will sort the active roles by play count descending. If no roles have matches, it will display the empty state.
- **Question:** Should we calculate and display a Play Rate percentage for each role?
  - **Why it matters:** Play rate helps players understand their role distribution.
  - **User Answer:** Yes, show the play rate percentage (e.g. "Top - 12 Games (60%)").
  - **Effect on the spec:** The play rate percentage is calculated as `Math.round((roleGames / totalStandardGames) * 100)` and displayed next to the game count.

## 7. Current Behavior

- The `topWidgetsGrid` renders a 3-column layout at >1440px width.
- The `RouteWinRateChart` renders a Recharts `<BarChart>` containing 5 standard roles, which becomes very compressed.
- The `DailyPerformanceGrid` is squished alongside the two bar charts.

## 8. Expected Behavior

- **Layout Grid:** The dashboard layout grid will use a 2-column layout. The `RouteWinRateChart` and `WeekdayWinRateChart` cards will be placed side-by-side. The `DailyPerformanceGrid` card will span across both columns, stretching to fill the width.
- **Route Performance Card:**
  - Displays as a clean vertical list of played roles, sorted by games count (descending).
  - Displays the CommunityDragon position icon, the role name, and the count with play rate percentage: e.g. "12 Games (60%)".
  - Shows the win rate percentage (e.g., "67%") styled in cyan/gold depending on win rate value.
  - Shows a mini horizontal progress bar representing the wins vs losses ratio (e.g. blue/cyan segment for wins, red/crimson segment for losses).
  - Displays the exact win/loss record below/next to the progress bar (e.g. "8W - 4L").
  - If there are no games with standard roles, it renders the standard empty state.

## 9. Scope

- **Frontend Pages:**
  - Update `DashboardPage.tsx` to wrap `DailyPerformanceGrid` in a grid wrapper class.
  - Update `DashboardPage.module.css` to redefine `topWidgetsGrid` as a 2-column layout and add `dailyPerformanceWrapper` spanning 2 columns.
- **Frontend Components:**
  - Rewrite `RouteWinRateChart.tsx` to remove Recharts and render the custom vertical role list.
  - Update `RouteWinRateChart.module.css` to include styling for the list items, custom info columns, and the dual win/loss progress bar.
- **Frontend Tests:**
  - Refactor `RouteWinRateChart.test.tsx` to match the new DOM elements, verifying grouping, filtering, play rate calculations, sorting order, and empty state rendering without mocking Recharts.

## 10. Out of Scope

- Adding filters specifically for roles.
- Changing the backend data structures or endpoints (no API changes needed).
- Changing the `WeekdayWinRateChart` visualization style (it will remain a Recharts bar chart, but with double the horizontal space).

## 11. Functional Acceptance Criteria

- **AC 1 (Layout):** On viewports >1024px, the Route and Weekday cards are placed side-by-side (approx 50% width each), and the Daily Grid card stretches fully below them.
- **AC 2 (List Layout):** Route Performance displays as a vertical list rather than a bar chart. Each role item has a position icon, name, games count, play rate, win rate, and a horizontal win/loss progress bar.
- **AC 3 (Sorting & Filtering):** Only roles with at least 1 match are displayed. They are sorted in descending order of played games.
- **AC 4 (Empty State):** If there are no standard Summoner's Rift matches, the empty state "No match records to display." is rendered.

## 12. Technical Findings

- Standard Summoner's Rift position roles are: `Top`, `Jungle`, `Mid`, `Bot`, `Support`.
- The total games count for play rate calculation must only include matches that have a standard position mapping (i.e. matches that aren't excluded as NONE/null/undefined).
- Color styling uses:
  - Win bar: `var(--color-cyan-500)`
  - Loss bar: `var(--color-crimson-600)`
  - Play Rate / count: `var(--color-text-subtle)`

## 13. Development Guidance

- **Play Rate Calculation:**
  ```typescript
  const totalStandardGames = routeData.reduce((sum, d) => sum + d.wins + d.losses, 0);
  const playRate = totalStandardGames > 0 ? Math.round((gamesPlayed / totalStandardGames) * 100) : 0;
  ```
- **Horizontal Progress Bar:**
  ```tsx
  <div className={styles.barContainer}>
    <div className={styles.winBar} style={{ width: `${winRate}%` }} />
    <div className={styles.lossBar} style={{ width: `${100 - winRate}%` }} />
  </div>
  ```

## 14. Suggested Code Structure and Contracts

No contract changes or new DTOs. The frontend changes are contained entirely within:
- `DashboardPage.tsx`
- `DashboardPage.module.css`
- `RouteWinRateChart.tsx`
- `RouteWinRateChart.module.css`

## 15. Validation References

### Manual Validation
- Inspect the dashboard page on screen widths of 1920px, 1440px, 1280px, and 768px to verify responsive layout shifts.
- Assert that Route Performance renders the vertical list correctly with icons.

### Unit / Component Tests
- Update and run `RouteWinRateChart.test.tsx` via `npm run test` or `vitest`. Ensure:
  - Empty state checks still work.
  - Sorting and filtering out of 0-game roles is correct.
  - Play rate percentages are calculated properly.

## 16. Regression Risks

- **No games played on any role:** If the player has only played ARAM, the Route Performance card should render the empty state gracefully, and the Weekday Performance card should render its own empty state. This must be validated in both mock data and components.
- **Responsive heights:** Weekday Performance has a hardcoded ResponsiveContainer height of 300px. Route Performance height should match this to maintain grid alignment. Using a flexible layout with minimum heights will prevent vertical misalignment.

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
    "index": "012",
    "name": "reorganize-dashboard-charts",
    "path": "docs/changes/012-reorganize-dashboard-charts/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Reorganize dashboard widgets grid to 2 columns and convert Route Performance chart into a compact list sorted by play count.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx",
        "purpose": "Component to be converted from Recharts to custom vertical list."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Layout structure hosting the widgets."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Do not use Recharts inside RouteWinRateChart",
        "reason": "Avoids rendering issues when displaying the list of routes."
      }
    ],
    "userConfirmedDecisions": [
      "Option 1: Sleek compact vertical list of roles sorted descending by play count, and 2-column grid layout reorganization."
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "RouteWinRateChart.test.tsx for proper sorting, filtering, and text rendering",
      "CSS layout verification for topWidgetsGrid"
    ]
  }
}
```
