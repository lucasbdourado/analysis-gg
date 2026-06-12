# Change Spec: Session Review Component

## 1. Overview
The goal is to create a reactive, isolated React component named `SessionReview` to display a summary analysis of the player's active session. This component will consume the fully filtered list of matches (`combinedFilteredMatches` from the dashboard context) and display key metrics (total matches, wins, losses, win rate, best champion, worst match, and a short actionable recommendation) calculated entirely in-memory.

## 2. Research Checklist
- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Analyze directly related code areas.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context
- `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`: Manages and exposes `combinedFilteredMatches`.
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`: Visual and sorting pattern reference.
- `src/main/frontend/src/shared/assets/css/components.css`: Global design system classes (`ds-panel`, `ds-badge`, `ds-table`, etc.).

## 4. Confirmed Facts
- `DashboardContext` exposes `combinedFilteredMatches` which respects all user filters (range, queues, roles, weekdays, calendar dates) in real-time.
- The component must not fetch matches directly; it relies on the dashboard state.
- A minimum of 5 matches is required to generate the review.
- The calculations must be in-memory and not persisted.

## 5. Inferences and Assumptions
- The `SessionReview` widget will be mounted on the `DashboardPage.tsx` layout inside the `mainContent` flow, taking up 100% width (`.bottomWidgetRow`), positioned above the `TopChampionsTable`.
- Tone moderation for small sample sizes is applied for datasets between 5 and 9 matches.

## 6. Questions and Answers
- **Q**: Since the empty directory `020-unified-match-history-fetching` exists in the codebase but `docs/changes/README.md` only indexes up to 019, which index and folder name should we use for the Session Review component?
  - **A**: Use index 020: `docs/changes/020-session-review-component/` (removing the empty placeholder folder `020-unified-match-history-fetching`).
  - **Effect**: Replaces the empty placeholder folder.
- **Q**: Is the proposed logic to find the 'best champion' of the filtered set correct? (Sort champions by Win Rate desc, then total games played desc, then avg KDA desc, then alphabetical name asc)
  - **A**: Yes.
  - **Effect**: Sorts champion stats compiled from the filtered set using this deterministic rule.
- **Q**: How should we define the 'worst single point of the session' (pior ponto simples)?
  - **A**: Identify the individual match with the lowest KDA (with high deaths as tie-breaker) and display its score/champion (e.g., 'Low KDA game: 1/8/3 on Yasuo').
  - **Effect**: Find the worst individual match performance in the active list.
- **Q**: Is the proposed rule-based in-memory recommendation engine (with moderated tone for small sample sizes) acceptable?
  - **A**: Yes, use the rule-based recommendation logic with moderated conclusions if the sample size is small (5 to 9 matches).
  - **Effect**: Applies softer recommendations for small datasets.

## 7. Current Behavior
No summary session review or recommendation component exists on the dashboard.

## 8. Expected Behavior
A new widget, `SessionReview`, is displayed.
- If matches < 5: Renders an informative card stating: `"Not enough matches to generate a session review."`
- If matches >= 5: Renders:
  - Total matches analyzed.
  - Wins, losses, and win rate percentage.
  - Best champion (name + badge/icon).
  - Worst single point of the session (e.g., `"Low KDA game: 1/8/3 on Yasuo"`).
  - A short, actionable recommendation (with moderated tone if matches < 10).

## 9. Scope
- Create `SessionReview.tsx` component.
- Create CSS module `SessionReview.module.css`.
- Create Unit Tests `SessionReview.test.tsx`.
- Mount the component in `DashboardPage.tsx` under the top grid.

## 10. Out of Scope
- Persisting reviews (backend/database).
- Champion Pool Coach.
- Game Phase Map.
- Weekly Training Plan.

## 11. Functional Acceptance Criteria
- **GIVEN** a filtered list with fewer than 5 matches, **THEN** the widget displays the informative message: `"Not enough matches to generate a session review."`
- **GIVEN** at least 5 matches, **THEN** the widget displays correct totals, wins, losses, win rate, best champion, worst match, and an actionable recommendation.
- **GIVEN** a dataset size between 5 and 9 matches, **THEN** the recommendation is phrased with moderated/suggestive tone.

## 12. Technical Findings
- Calculations will be performed within a `useMemo` block depending on `combinedFilteredMatches`.
- Runeterra Arena styles (`ds-panel`, etc.) must be utilized.

## 13. Development Guidance
- Ensure division-by-zero protection (e.g., when deaths are 0 in KDA calculation, treat deaths as 1 or mark KDA as Perfect).
- Keep component stateless.

## 14. Suggested Code Structure and Contracts
```typescript
interface SessionStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  bestChampion: string;
  worstMatch: {
    kills: number;
    deaths: number;
    assists: number;
    championName: string;
  } | null;
  recommendation: string;
}
```

Recommendation rules logic:
- **Win Rate >= 60%**:
  - `totalMatches < 10`: `"Solid start! Keep practicing {bestChampion} to build your confidence and consistency."`
  - `totalMatches >= 10`: `"You're on a roll! Keep playing {bestChampion} and leverage your high win rate to climb."`
- **Win Rate < 45%**:
  - `totalMatches < 10`: `"A few tough games recently. Consider reviewing your positioning and playing more cautiously."`
  - `totalMatches >= 10`: `"Take a break or review your positioning. Focus on reducing deaths, particularly in games like your {worstMatch}."`
- **Average Deaths >= 7**:
  - `totalMatches < 10`: `"Try to prioritize survival in your next games. Focus on safety and warding."`
  - `totalMatches >= 10`: `"Focus on map awareness and survival. High average deaths are holding back your matches."`
- **Default**: `"Analyze your matches to find consistent patterns. Focus on objective control and team positioning."`

## 15. Validation References
- **Unit Tests**: Mock `useDashboard` with datasets < 5, 5-9 (moderated tone), and >= 10 to assert metrics, best champion, worst match, and recommendation matching.
- **Manual Verification**: Test filter clicks on the UI to confirm the widget updates automatically.

## 16. Regression Risks
- UI alignment and responsive styling. Ensure it fits in the column stack.
- In-memory calculation performance. Negligible since `N <= 100`.

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
    "index": "020",
    "name": "session-review-component",
    "path": "docs/changes/020-session-review-component/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement an in-memory, reactive Session Review widget on the dashboard that aggregates matches from the active cross-filtered state.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Source of cross-filtered matches array"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Minimum 5 matches required to display analysis",
        "reason": "Ensure statistical reliability"
      },
      {
        "constraint": "Do not persist results",
        "reason": "Keep component stateless and pure client-side"
      }
    ],
    "userConfirmedDecisions": [
      "Folder index 020 replacing placeholder folder",
      "Deterministic sorting for best champion",
      "KDA-based worst match finding with high deaths tie-breaker",
      "Rule-based recommendation engine with moderated tone for small sample size (5-9)"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "In-memory math correctness",
      "Empty state when matches < 5",
      "Dynamic updates on filter changes"
    ]
  }
}
```
