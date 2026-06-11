# Change Spec: Summoner Splits and Role Win Rates

## 1. Overview

This change enhances the summoner profile by expanding the simulated historical ranks into split-by-split granularity (e.g. `2025 S3`, `2025 S2`, `2025 S1`, etc., including 2025 which was previously missing) and introducing a new **Route Performance** win rate chart. This chart will visualize the player's win rate by role/lane (Top, Jungle, Mid, Bot, Support) using Recharts and the official Clash position icons from CommunityDragon.

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

- **Account Ranked Summary Component:** [AccountRankedSummary.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx)
- **Weekday Performance Chart Component:** [WeekdayWinRateChart.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- **Dashboard Page Layout:** [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx)
- **Backend Use Case:** [SyncPlayerProfileUseCase.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java)
- **Match Mapping Logic:** [RiotMatchMapper.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/mapper/RiotMatchMapper.java)
- **Integration Match DTO:** [RiotMatchDto.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/dto/RiotMatchDto.java)

## 4. Confirmed Facts

- The Riot Games API exposes the player's position in each match using the `teamPosition` field in the participant JSON (values: `TOP`, `JUNGLE`, `MIDDLE`, `BOTTOM`, `UTILITY`).
- CommunityDragon hosts Clash position icons at:
  `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-{role}.png` (where `{role}` is `top`, `jungle`, `middle`, `bottom`, or `utility`).
- The current year is 2026, meaning the previous year is 2025.
- The user confirmed that 2023, 2024, and 2025 had three splits each (S1, S2, S3) and all must be generated and displayed in the past season ranks.
- Matches without a defined role (e.g., ARAM or Arena, where `teamPosition` is empty or `NONE`) must be excluded from the route performance chart.
- The chart should display role names in English (`Top`, `Jungle`, `Mid`, `Bot`, `Support`).

## 5. Inferences and Assumptions

- We will generate 9 past season ranks consistently using the player's PUUID hash as a seed:
  `2025 S3`, `2025 S2`, `2025 S1`, `2024 S3`, `2024 S2`, `2024 S1`, `2023 S3`, `2023 S2`, `2023 S1`.
- Standardizing the `teamPosition` mapping will involve mapping `MIDDLE` -> `Mid`, `BOTTOM` -> `Bot`, and `UTILITY` -> `Support`.

## 6. Questions and Answers

- **Question:** How should the past season ranks split-level naming be formatted?
  - **Why it matters:** Standardizes UI display and consistency with player expectations.
  - **User Answer:** Use the format `YYYY Sx` (e.g. `2023 S1`, `2023 S2`, `2023 S3`).
  - **Effect on the spec:** The backend will generate S1, S2, and S3 splits for years 2025, 2024, and 2023 in that exact format.
- **Question:** Should we translate the route names to Portuguese or keep them in English? Also, how should we handle ARAM/Arena matches in the route chart?
  - **Why it matters:** Establishes UI and filtering rules for the route performance chart.
  - **User Answer:** Keep terms in English and do not consider/include matches without a defined role (e.g. ARAM, Arena).
  - **Effect on the spec:** The chart will display Top, Jungle, Mid, Bot, Support. Matches with empty or `NONE` positions will be excluded from the chart calculations.

## 7. Current Behavior

- The past season ranks simulation shows only yearly ranks (`S2024`, `S2023`, `S2022`) and is missing the previous year (2025).
- No route/lane performance chart exists on the dashboard.
- The `MatchSummary` domain model does not store the player's role/lane.

## 8. Expected Behavior

- **Historical Ranks:** The profile card header displays simulated ranks for `2025 S3`, `2025 S2`, `2025 S1`, `2024 S3`, `2024 S2`, `2024 S1`, `2023 S3`, `2023 S2`, `2023 S1`.
- **Route Performance Chart:** A new chart card titled "Route Performance" is added next to the "Weekday Performance" chart.
  - It renders a Recharts bar chart displaying the win rate (0-100%) for the five standard roles: Top, Jungle, Mid, Bot, Support.
  - The XAxis displays the official Clash position icon above or instead of the text label.
  - A custom tooltip displays the win rate alongside the exact win and loss counts (e.g. "Win Rate: 60% (3W - 2L)").
  - If there are no standard Summoner's Rift matches, it shows an empty state.

## 9. Scope

- **Backend Integration:**
  - Add `teamPosition` (String) to `RiotMatchDto.ParticipantDto`.
  - Add `teamPosition` (String) to `MatchSummary` (domain model) and `MatchResponse` (API response).
  - Map `teamPosition` in `RiotMatchMapper.java` and `RiotApiWebMapper.java`.
  - Update `generatePastSeasonRanks` in `SyncPlayerProfileUseCase.java` to simulate 9 splits spanning 2025, 2024, and 2023.
- **Frontend Presentation:**
  - Update `MatchSummary` TypeScript interface to include `teamPosition`.
  - Create `RouteWinRateChart.tsx` component matching the layout and behavior of `WeekdayWinRateChart.tsx`.
  - Implement a custom Recharts XAxis tick in `RouteWinRateChart.tsx` that renders the Clash PNG icons from CommunityDragon.
  - Add `RouteWinRateChart` to `DashboardPage.tsx` next to `WeekdayWinRateChart`.
- **Validation:**
  - Update backend tests in `SyncPlayerProfileUseCaseTest.java` and `RiotApiControllerTest.java` to assert new split-based ranks and the presence of `teamPosition`.
  - Create component tests in `RouteWinRateChart.test.tsx` to assert correct win rate calculations and icon rendering.

## 10. Out of Scope

- Real historical rank data (simulated consistently using PUUID hash).
- Showing roles in ARAM, Arena, or custom game modes.

## 11. Functional Acceptance Criteria

- **AC 1 (Past Splits):** The profile header renders elo pills showing `2025 S3`, `2025 S2`, `2025 S1`, `2024 S3`, `2024 S2`, `2024 S1`, `2023 S3`, `2023 S2`, `2023 S1`.
- **AC 2 (Route Performance Chart):** A new panel titled "Route Performance" is visible in the dashboard grid.
- **AC 3 (Route Icons):** The X-axis of the route chart displays the correct icons (Top, Jungle, Mid, Bot, Support) loaded from CommunityDragon.
- **AC 4 (ARAM/Arena Exclusion):** Games where the player position is empty or `NONE` do not affect the win rate of any route.
- **AC 5 (Interactive Tooltips):** Hovering over a route bar displays a custom tooltip with the role name, win rate percentage, and win/loss count.

## 12. Technical Findings

- CommunityDragon Clash position URLs:
  - Top: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png`
  - Jungle: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png`
  - Mid: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png`
  - Bot: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png`
  - Support: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png`

## 13. Development Guidance

- **Split Ranks Simulation:**
  Update `seasons` array in `SyncPlayerProfileUseCase.java`:
  ```java
  String[] seasons = {
      "2025 S3", "2025 S2", "2025 S1",
      "2024 S3", "2024 S2", "2024 S1",
      "2023 S3", "2023 S2", "2023 S1"
  };
  ```
- **Custom XAxis Tick Component:**
  ```tsx
  const RenderRouteTick = (props: any) => {
    const { x, y, payload } = props;
    const iconUrls: Record<string, string> = {
      Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
      Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
      Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
      Bot: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
      Support: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png',
    };
    return (
      <g transform={`translate(${x - 12},${y + 4})`}>
        <image href={iconUrls[payload.value]} height="24" width="24" />
      </g>
    );
  };
  ```

## 14. Suggested Code Structure and Contracts

### Backend DTO and Record additions:
```java
// MatchSummary.java & MatchResponse.java
public record MatchSummary(
    // existing fields...
    String teamPosition
) {}
```

### Frontend Type additions:
```typescript
// MatchSummary.ts
export interface MatchSummary {
  // existing fields...
  teamPosition: string;
}
```

## 15. Validation References

- **Backend tests:** Update `SyncPlayerProfileUseCaseTest.java` to assert list sizes (9 entries) and that the first item matches `2025 S3`.
- **Frontend tests:** Create `RouteWinRateChart.test.tsx` verifying:
  - Correct grouping of win rates.
  - Non-SR (null or `NONE` position) matches are ignored.
  - Proper empty state rendering.

## 16. Regression Risks

- **Null/Empty Position Fields:** Older cached match records may not contain `teamPosition`. A default fallback (empty string or ignoring the match) must be handled gracefully in the frontend parser to prevent runtime exceptions.
- **Visual Grid Overflow:** On medium screen resolutions, adding a third card next to Daily Performance or Weekday Performance may cause wrapping or overlapping. The styling in `DashboardPage.module.css` must adjust `topWidgetsGrid` accordingly.

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
    "index": "011",
    "name": "summoner-splits-and-role-win-rates",
    "path": "docs/changes/011-summoner-splits-and-role-win-rates/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Simulate split-level past season ranks and implement a route/lane win rate chart with position icons.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx",
        "purpose": "Template structure for the new role performance chart."
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java",
        "purpose": "Expand simulated historical ranks with split data."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Exclude ARAM/Arena matches from role calculations",
        "reason": "They lack traditional lanes and will distort lane performance metrics."
      }
    ],
    "userConfirmedDecisions": [
      "Use format YYYY Sx (e.g. 2023 S1, 2023 S2, 2023 S3)",
      "Keep terms in English on the chart (Top, Jungle, Mid, Bot, Support)"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "RouteWinRateChart.test.tsx grouping logic and empty state checks",
      "SyncPlayerProfileUseCaseTest.java for past ranks count and order"
    ]
  }
}
```
