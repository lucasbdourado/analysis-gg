# Change Spec: Recent Match History Section

## 1. Overview

Add a compact recent match history section to the dashboard so users can inspect their latest individual games in one place, similar in purpose to the "Recent Games" area shown on OP.GG profile pages. The section must reuse the `matches` array already returned by the backend API and must not introduce a new data fetch.

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
- [x] Use web research for the OP.GG reference page.

## 3. Source Context

- User request: add the match history for the account, using OP.GG as an example and reusing the API-returned history.
- User decision: the section should be compact.
- [MVP PRD](../../product/analysis-gg/mvp-prd.md): confirms the product already centers on recent ranked match history, analytics widgets, and dashboard presentation.
- [DashboardPage.tsx](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): current dashboard layout renders filters, player profile, charts, and champion table, but no individual match list.
- [PlayerAnalyticsResponse.ts](../../../src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts): the frontend already receives `matches: MatchSummary[]` from the backend.
- [SyncPlayerProfileUseCase.java](../../../src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java): backend already fetches match detail records and returns them in `PlayerAnalytics`.
- OP.GG summoner pages for BR examples, including a profile page with a "Recent Games" area, used only as a formatting reference.

## 4. Confirmed Facts

- The backend response already includes a `matches` array with per-match summary data.
- The dashboard already consumes `matches` to feed existing analytics widgets.
- There is no current dashboard component that renders a compact recent match history list.
- The current frontend data model already includes all fields needed for a compact history card, including match ID, timestamp, queue, win/loss, champion, KDA, and CS.
- The requested change is presentation-focused, not a new Riot API integration.

## 5. Inferences and Assumptions

- The compact history section should likely sit below the existing analytics widgets, where users naturally expect a raw match list after aggregate charts.
- The section should likely preserve the current dashboard filters and range selection, using the same filtered match set as the charts and table.
- Because the user asked for "compact," each match item should minimize vertical space and show only the most useful identifiers and outcome details.
- OP.GG is a layout reference, not a strict design contract.

## 6. Questions and Answers

| Question | Why it matters | Answer | Effect on spec |
| --- | --- | --- | --- |
| Should the change add a list of individual match entries, or another aggregated view? | This determines whether the dashboard exposes raw history or only more summary metrics. | A list of individual match entries. | The spec defines a recent match history section, not a new chart or summary widget. |
| Should the implementation use the history already returned by the API, or add a new fetch? | This changes API scope and backend impact. | Use the historical data already returned by the API. | The spec excludes new API work and focuses on rendering `matches`. |
| Should the section be compact or detailed? | This affects layout density, data density, and UX expectations. | Compact. | The section is specified as a condensed recent-match list with limited per-item fields. |

## 7. Current Behavior

- The dashboard shows filters, a player profile summary, a weekday win-rate chart, a daily performance grid, and a top champions table.
- The raw match history is already available in the page data, but it is only consumed by analytical widgets.
- Users cannot currently scan the latest individual matches from the dashboard.

## 8. Expected Behavior

- The dashboard displays a compact recent match history section using the already-loaded `matches` data.
- The section shows individual matches in newest-first order.
- Each item surfaces only the key compact fields needed for fast scanning, such as outcome, queue, champion, date/time, and core performance stats.
- The section respects the same filtered match set already driving the dashboard widgets.
- Empty-state behavior is shown when no matches are available after filtering.

## 9. Scope

- Add a new dashboard section for recent match history.
- Reuse the existing `matches` data already returned by the backend.
- Render a compact per-match presentation.
- Keep the section aligned with the active dashboard filters and range state.
- Add or update tests for rendering, ordering, and empty state behavior.

## 10. Out of Scope

- New Riot API endpoints or new backend data fetching.
- Full match-detail drilldown pages.
- Pagination or infinite scrolling.
- A redesigned analytics dashboard.
- External profile linking or account synchronization changes.
- Changing how charts, tables, or filters calculate from the match list.

## 11. Functional Acceptance Criteria

- The dashboard shows a recent match history section when match data is available.
- The section uses the existing API response data without introducing another fetch.
- The list is ordered from newest match to oldest match.
- Each item is compact and readable at a glance.
- The section reflects the current filtered dashboard dataset.
- When there are no matches to show, the section displays a clear empty state.
- Existing analytics widgets continue to render from the same match data.

## 12. Technical Findings

- `PlayerAnalyticsResponse.matches` already provides a `MatchSummary[]` payload to the frontend.
- `SyncPlayerProfileUseCase` already fetches match summaries and packages them into the response object.
- `DashboardContext` already centralizes the filtered match list and can supply the history section with the same data source as the charts.
- The existing frontend codebase uses React, TypeScript, and local CSS modules, so the new section should follow the same patterns.

## 13. Development Guidance

- Reuse the current dashboard state flow instead of adding a second source of truth for match history.
- Keep the UI compact and avoid duplicating large analytics fields already shown elsewhere.
- Prefer a simple presentation that reuses the existing `MatchSummary` shape and the active filtered match list.
- Keep the change isolated to the dashboard presentation layer unless a test or state contract needs a small supporting adjustment.

## 14. Suggested Code Structure and Contracts

- `src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.test.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`

Suggested contract:

```ts
type RecentMatchHistoryProps = {
  matches: MatchSummary[];
};
```

The component should render a compact list or card stack from newest to oldest using the already filtered match array.

## 15. Validation References

### Unit tests

- Verify the recent-history component renders items in newest-first order.
- Verify the empty state renders when the match list is empty.
- Verify only the compact fields appear in each item.

### Integration tests

- Verify the dashboard still passes the same filtered match set to all widgets.

### UI/E2E tests

- Open a player dashboard with a populated match history and confirm the new section appears below the analytics widgets.

### Manual validation

- Search a known account such as `Joeyzenhu#BR1` and confirm the dashboard shows recent match entries using the already loaded data.

### Regression checks

- Confirm the weekday chart, daily grid, and champion table still update from the same filtered dataset.

## 16. Regression Risks

- The new section could duplicate data already summarized by existing widgets if the layout is too dense or repeats too many fields.
- Ordering mistakes could cause the list to disagree with the charts if it does not reuse the same filtered data.
- Overly detailed rows could make the dashboard taller and reduce the visibility of the analytics widgets.
- Empty-state handling could conflict with existing widget behavior if the section assumes matches are always present.

## 17. Open Blockers and Pending Decisions

- None.

## 18. Readiness Checklist

- [x] The requested change is clear.
- [x] The expected behavior is documented.
- [x] The current behavior is documented or explicitly marked as unknown.
- [x] Relevant sources were reviewed.
- [x] Relevant code areas were reviewed.
- [x] Relevant tests were reviewed or absence was documented.
- [ ] Relevant UI behavior was observed with Playwright MCP when applicable.
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
    "index": "007",
    "name": "recent-match-history-section",
    "path": "docs/changes/007-recent-match-history-section/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Add a compact recent match history section to the dashboard using the match list already returned by the API.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User requested a compact account match-history section and confirmed the existing API history should be reused.",
        "purpose": "Defines the requested scope and the no-new-fetch constraint."
      },
      {
        "type": "documentation",
        "reference": "docs/product/analysis-gg/mvp-prd.md",
        "purpose": "Confirms the dashboard is centered on recent ranked match history and analytics widgets."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Shows the current dashboard layout and where the new section can be placed."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts",
        "purpose": "Confirms the frontend already receives a match list."
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java",
        "purpose": "Confirms the backend already returns match summaries in the analytics payload."
      },
      {
        "type": "tool",
        "reference": "op.gg summoner profile pages for BR examples, including recent-game sections.",
        "purpose": "Provides a visual reference for compact match-history presentation."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "web",
        "requiredWhen": "When verifying external profile examples or other web references.",
        "purpose": "Capture direct source context for the OP.GG comparison."
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Do not add a new Riot API fetch.",
        "reason": "The backend already returns the needed match history, and the user explicitly asked to reuse it."
      },
      {
        "constraint": "Keep the history section compact.",
        "reason": "The user chose a condensed display rather than a detailed per-match layout."
      },
      {
        "constraint": "Do not alter unrelated dashboard analytics behavior.",
        "reason": "The change is presentation-focused and should not destabilize existing widgets."
      }
    ],
    "userConfirmedDecisions": [
      "Use the match history already returned by the API.",
      "Render the history in a compact format."
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Render compact match items in newest-first order.",
      "Show an empty state when no matches are available.",
      "Keep existing analytics widgets stable."
    ]
  }
}
```
