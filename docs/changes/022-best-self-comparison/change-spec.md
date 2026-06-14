# Change Spec: Best Self Comparison

## 1. Overview
Create an isolated dashboard component called `BestSelfComparison` that analyzes the already filtered match list passed into the dashboard flow, recalculates automatically when dashboard filters change, and only renders insights when there are enough matches to support a useful comparison. The component shall compare wins versus losses and highlight one or two simple differences using metrics already available in the match summary data, such as KDA, deaths, CS/min, champion, and win rate.

## 2. Research Checklist
- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior.
- [x] Analyze directly related code areas.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context
- User request: Add `Best Self Comparison` as an isolated dashboard component that consumes already filtered matches and shows only simple win-versus-loss differences.
- `docs/new-features/features.md`: Describes the product direction for "Compare Against Your Best Self" and explicitly recommends wins vs losses as the MVP comparison.
- `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`: Exposes `combinedFilteredMatches`, the already cross-filtered dashboard match list.
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`: Dashboard layout currently places comparison widgets inside the analytics flow.
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`: Existing example of using only match summary data to aggregate win rate, KDA, and CS/min.
- `src/main/frontend/src/features/dashboard/domain/MatchSummary.ts`: Current match summary contract and available metrics.
- `src/main/frontend/src/features/dashboard/presentation/components/SessionReview.tsx`: Existing isolated dashboard analysis widget and styling pattern reference.

## 4. Confirmed Facts
- The dashboard context already computes `combinedFilteredMatches` from the active filter state.
- The requested component must not fetch matches or call APIs directly.
- The component must recalculate whenever the filtered match list changes.
- The component must hide its analysis until a minimum sample size is reached.
- The available match summary data includes match outcome, champion, KDA inputs, CS totals, and match duration.
- The user requested that this task not include additional features beyond the comparison widget itself.

## 5. Inferences and Assumptions
- The component should live inside the dashboard analytics area as a self-contained widget rather than being embedded into a chart or table.
- A minimum threshold of 5 matches is a reasonable default for the empty/informative state, since the user asked for "for example 5" and the existing dashboard analysis widgets already use that threshold.
- "One or two differences" should be interpreted as a short, human-readable summary of the strongest contrasts between wins and losses, not a long list of metrics.
- Because the request mentions metrics already available, the component should use only derived calculations from `MatchSummary` and should not introduce new backend fields.

## 6. Questions and Answers
- **Question**: What threshold should gate the analysis?
  - **Answer**: Use a minimum of 5 matches.
- **Question**: Should the component fetch or compute its own match list?
  - **Answer**: No. It must receive already filtered matches from the dashboard state.
- **Question**: Should the scope include other coach features?
  - **Answer**: No. Only the isolated Best Self Comparison widget.

## 7. Current Behavior
- No dedicated `BestSelfComparison` component exists.
- The dashboard already passes filtered match data through context for other widgets, but there is no isolated component that compares wins versus losses for self-analysis.
- Existing dashboard widgets can compute aggregate metrics, but their output is not focused on comparing a user's best performance against their worse performance.

## 8. Expected Behavior
- A new `BestSelfComparison` widget renders inside the dashboard using the already filtered match list supplied by the parent dashboard flow.
- When the filtered list changes, the widget recomputes automatically.
- If the number of matches is below the minimum threshold, the widget shows an informative state explaining that more matches are needed before comparison results are reliable.
- If there are enough matches, the widget compares wins versus losses and presents one or two concise differences based on the strongest metric gaps.
- The widget should prefer simple, readable statements such as better KDA in wins, fewer deaths in wins, higher CS/min in wins, stronger performance on a champion, or higher win rate for a champion subset when that comparison is supported by the available sample.

## 9. Scope
- Create an isolated `BestSelfComparison` dashboard component.
- Accept the already filtered match list as input from the dashboard data flow.
- Recompute analysis whenever the filtered match list changes.
- Show a minimum-sample informative state when there are too few matches.
- Compare wins versus losses using existing metrics only.
- Surface 1 or 2 simple differences with clear prose.
- Add or update unit tests for the new comparison behavior.

## 10. Out of Scope
- Fetching matches inside the component.
- Adding new backend endpoints or new match summary fields.
- Building broader coach features such as session review, training plans, phase maps, or champion pool recommendations.
- Persisting comparison results.
- Showing long diagnostic reports or multiple charts inside the component.

## 11. Functional Acceptance Criteria

### AC-001 - Minimum Sample Gate

**Related requirements:** FR-001

**Given**
- the dashboard provides fewer than 5 filtered matches

**When**
- the `BestSelfComparison` component renders

**Then**
- it shows an informative state instead of comparison insights
- it does not present win-versus-loss differences

### AC-002 - Reactive Recalculation

**Related requirements:** FR-002

**Given**
- the dashboard filter state changes and the filtered match list changes with it

**When**
- the `BestSelfComparison` component rerenders

**Then**
- it recalculates its comparison output from the new filtered list

### AC-003 - Win Versus Loss Comparison

**Related requirements:** FR-003

**Given**
- the dashboard provides at least 5 filtered matches

**When**
- the component computes the comparison

**Then**
- it compares wins versus losses using only existing match metrics
- it highlights one or two differences that are simple and readable

### AC-004 - No Direct Match Fetching

**Related requirements:** FR-004

**Given**
- the component is mounted in the dashboard

**When**
- it needs data for analysis

**Then**
- it uses the already filtered match list passed from the dashboard state
- it does not trigger network requests or query matches directly

### NR-001

The system shall only use metrics already available in `MatchSummary` and derived calculations from those values.

### NR-002

The system shall not broaden the scope into other dashboard coach features during this change.

## 12. Technical Findings
- `DashboardContext` already exposes `combinedFilteredMatches`, which is the correct input for any isolated comparison widget that needs to react to active filters.
- `MatchSummary` already provides the core fields needed for this feature: `win`, `championName`, `kills`, `deaths`, `assists`, `totalMinionsKilled`, `neutralMinionsKilled`, and `gameDuration`.
- Existing dashboard components show the preferred pattern for derived statistics: compute in `useMemo`, keep the component state-local, and render an informative empty state when sample size is insufficient.
- A short metric comparison can be derived entirely in the frontend by splitting the list into wins and losses and comparing averages across the available fields.

## 13. Development Guidance
- Keep the component isolated and pure with respect to data source: it should receive filtered matches from the dashboard flow and should not know how those matches were fetched.
- Use a small set of derived metrics only. Prefer the clearest difference over trying to describe every available metric.
- Keep the message concrete and readable. If multiple metrics point to the same conclusion, choose the strongest one or two rather than duplicating meaning.
- Gate the analysis aggressively enough to avoid misleading conclusions on tiny samples.
- Keep the informative state explicit so users understand why the analysis is not shown yet.

## 14. Suggested Code Structure and Contracts

### Component Contract
```typescript
interface BestSelfComparisonProps {
  matches: MatchSummary[];
  minMatches?: number;
}
```

### Suggested Derived Model
```typescript
interface ComparisonMetric {
  label: string;
  winsAverage: number;
  lossesAverage: number;
  delta: number;
}

interface BestSelfComparisonState {
  totalMatches: number;
  wins: number;
  losses: number;
  hasEnoughMatches: boolean;
  highlights: ComparisonMetric[];
}
```

### Suggested Behavior
- Split the received matches into wins and losses.
- Compute averages for candidate metrics such as KDA, deaths, CS/min, and win rate by champion if that yields a meaningful contrast.
- Rank candidate differences by magnitude and keep only the top 1 or 2.
- Render a minimal informative state when `totalMatches < minMatches`.

### Suggested Integration Point
- Mount the widget in the dashboard analytics flow as a dedicated component, adjacent to the other summary widgets, without changing the data-fetching layer.

## 15. Validation References
- Unit test the empty/informative state when the filtered list has fewer than 5 matches.
- Unit test recalculation by changing the input match list and asserting the output updates.
- Unit test wins-versus-losses comparison with controlled datasets that produce clear differences in deaths, KDA, and CS/min.
- Unit test that the component does not fetch or depend on any network call.
- Manual verification on the dashboard by changing filters and confirming the widget updates automatically.

## 16. Regression Risks
- Small-sample conclusions may be misleading if the threshold is set too low or if the highlights are too aggressive.
- The widget may duplicate messaging already present in other dashboard analysis cards if the phrasing is too broad.
- If the component accidentally depends on fetch logic instead of the supplied list, it would violate the requested isolation and make filter updates less predictable.
- Comparing averages across wins and losses can produce noisy results if the list is only slightly above the minimum threshold.

## 17. Open Blockers and Pending Decisions
- None identified.

## 18. Readiness Checklist
- [x] The requested change is clear.
- [x] The current behavior is documented.
- [x] The expected behavior is documented.
- [x] Relevant source context was reviewed.
- [x] Relevant code areas were reviewed.
- [x] The scope boundary is explicit.
- [x] The out-of-scope boundary is explicit.
- [x] Functional acceptance criteria are defined.
- [x] Technical findings are grounded in current code.
- [x] Validation references are defined.
- [x] Open blockers are identified.
- [x] Pending decisions are identified.

## 19. Structured Agent Reference
```json
{
  "spec": {
    "index": "022",
    "name": "best-self-comparison",
    "path": "docs/changes/022-best-self-comparison/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement an isolated Best Self Comparison dashboard widget that consumes already filtered matches, recalculates with dashboard filters, and shows only simple wins-versus-losses insights when enough matches exist.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request for Best Self Comparison",
        "purpose": "Defines the widget as isolated, reactive, threshold-gated, and limited to existing metrics."
      },
      {
        "type": "documentation",
        "reference": "docs/new-features/features.md",
        "purpose": "Provides the product direction and MVP framing for Best Self Comparison."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Supplies the already filtered match list used by dashboard widgets."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/domain/MatchSummary.ts",
        "purpose": "Defines the available metrics for comparison."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "frontend unit tests",
        "requiredWhen": "Before merging the widget implementation",
        "purpose": "Verify threshold gating, reactive recomputation, and metric comparison output."
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Do not fetch matches inside the component.",
        "reason": "The widget must consume the dashboard's already filtered match list."
      },
      {
        "constraint": "Use only metrics already available in MatchSummary and derived calculations.",
        "reason": "The task is limited to the current data contract and should not expand backend scope."
      },
      {
        "constraint": "Show no analysis below the minimum match threshold.",
        "reason": "Avoid misleading conclusions on small samples."
      }
    ],
    "userConfirmedDecisions": [
      "Minimum sample size: 5 matches",
      "Component receives already filtered matches from the dashboard",
      "Only 1 or 2 simple differences should be highlighted",
      "Do not implement other features in this task"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Minimum sample empty state",
      "Reactive recalculation on filter changes",
      "Wins-versus-losses metric comparison using existing fields only",
      "No direct data fetching inside the component"
    ]
  }
}
```
