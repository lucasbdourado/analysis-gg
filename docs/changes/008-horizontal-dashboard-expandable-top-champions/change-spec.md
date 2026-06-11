# Change Spec: Horizontal Dashboard and Expandable Top Champions

## 1. Overview

Rework the dashboard presentation so the main dashboard feels horizontal instead of vertically stacked, fits within a `100vh` viewport target, and exposes any overflow through internal scrolling or compact "view more" affordances instead of expanding the page indefinitely. In the champion section, show the most played champions as an expandable list that initially renders 5 champions and reveals additional items in batches when the user clicks a "view more" button.

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
- [x] Use Playwright MCP or browser automation when applicable to observe the UI path. Not completed because the change is being speced before implementation and the live dashboard requires real analytics data.

## 3. Source Context

- User request: make "most played champions" an expandable list, make the dashboard horizontal, keep the whole dashboard within `100vh`, and add a button to view more when content overflows.
- User decision: start with 5 champions and load more in blocks.
- User decision: prefer a horizontal dashboard layout that prioritizes avoiding vertical overflow.
- [DashboardPage.tsx](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): current page composes filters, profile summary, charts, champion table, and recent match history in a vertical stack.
- [DashboardPage.module.css](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css): current page layout uses vertical flex/grid sections and does not enforce a `100vh` dashboard composition.
- [TopChampionsTable.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx): current champion aggregation renders all champions at once in a sortable table.
- [TopChampionsTable.module.css](../../../src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css): current table styling supports a full-width table but not a collapsed/expandable presentation.
- [DashboardContext.tsx](../../../src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx): current filtered match list already exists and can be reused by the champion list.
- MVP and planning documents in `docs/product/analysis-gg/` and `docs/planning/analysis-gg/` confirm the dashboard and top champions are core analytics areas.

## 4. Confirmed Facts

- The dashboard currently renders as a vertically stacked page.
- The champion section currently renders all aggregated champions at once.
- The dashboard already has filtered match data available through `DashboardContext`.
- No new backend fetch is required to derive champion statistics.
- The user wants the champion list to start with 5 items and reveal more in blocks.
- The user wants the dashboard composition to be horizontal rather than purely vertical.
- The user wants the dashboard to fit within `100vh` as the target layout constraint.

## 5. Inferences and Assumptions

- A horizontal dashboard likely means the main analytics area should be reorganized into side-by-side regions, not simply reflowed into a single long column.
- The `100vh` target likely requires internal overflow management, tighter section sizing, or both, because the existing widgets are too tall to fit all content at once.
- The "view more" control for champions likely needs to append another batch rather than expand one giant table all at once, because the user explicitly asked for block-based loading.
- The requested overflow behavior probably applies to the dashboard content area, not to the browser window itself.

## 6. Questions and Answers

| Question | Why it matters | Answer | Effect on spec |
| --- | --- | --- | --- |
| How many champions should appear before expansion? | This defines the collapsed state and the loading batch size. | 5 champions. | The spec requires an initial cap of 5 visible champions. |
| Should "view more" expand all remaining champions at once or load in blocks? | This determines the interaction model and how much content is revealed per click. | Load in blocks. | The spec requires incremental loading instead of a one-step full expansion. |
| What does "dashboard horizontal" mean in practice? | This determines the layout strategy and how to handle limited vertical space. | Prefer option 2: a horizontal layout that prioritizes avoiding vertical overflow. | The spec treats the dashboard as a horizontally organized surface with overflow management. |

## 7. Current Behavior

- The dashboard stacks filters, profile summary, charts, the top champions table, and recent history vertically.
- The champion section shows every champion returned by the aggregation, subject only to the current sorting order.
- Content can grow vertically as more widgets and more champion rows are rendered.
- There is no explicit viewport-height constraint for the dashboard composition.

## 8. Expected Behavior

- The dashboard should be reorganized into a horizontal presentation with primary content arranged side by side instead of as a long vertical stack.
- The dashboard should be designed to fit within a `100vh` viewport target.
- Content that does not fit should be handled through internal overflow patterns or compact "view more" affordances rather than extending the page height indefinitely.
- The most played champions section should render only 5 champions initially.
- Clicking "view more" should load the next block of champions.
- The user should be able to continue loading blocks until all champions are visible.
- Existing analytics calculations should still use the same match data.

## 9. Scope

- Reorganize the dashboard layout into a horizontal presentation.
- Constrain the dashboard experience to a `100vh` target.
- Add overflow handling for content that does not fit in the initial viewport.
- Convert the champion list into an expandable list with an initial size of 5 items.
- Add a "view more" control that loads additional champions in blocks.
- Update tests for the new collapsed and expanded champion states and the revised dashboard layout behavior.

## 10. Out of Scope

- New backend endpoints or new analytics data sources.
- Changing how champion statistics are calculated.
- Changing the underlying match filtering rules.
- Adding unrelated dashboard features or new analytics widgets.
- Full redesign of the search flow or non-dashboard pages.

## 11. Functional Acceptance Criteria

- The dashboard presents its primary sections in a horizontal layout rather than a long vertical stack.
- The dashboard is structured to remain within a `100vh` viewport target.
- Content that exceeds the available viewport is handled through internal overflow or explicit "view more" behavior instead of pushing the page far below the fold.
- The most played champions section initially shows exactly 5 champions when 5 or more are available.
- The champions section includes a visible "view more" button when additional champions remain hidden.
- Each click on "view more" reveals the next block of champions.
- The button disappears or becomes disabled when no more hidden champions remain.
- Existing dashboard filters and statistics continue to work with the same match set.

## 12. Technical Findings

- `DashboardPage.tsx` already acts as the layout shell for the dashboard and is the right place to restructure the overall composition.
- `TopChampionsTable.tsx` already owns champion aggregation, sorting, and rendering, so the expandable behavior likely belongs there or in a small wrapper around it.
- `DashboardContext.tsx` already exposes `filteredMatches`, so no extra data source is needed to support pagination-style display of champion rows.
- The current CSS modules are organized per component, so viewport and overflow constraints should likely be handled by dashboard-level CSS plus a localized champion-list style change.

## 13. Development Guidance

- Keep the viewport target practical: use fixed or bounded regions where necessary so the dashboard does not grow freely downward.
- Preserve existing champion sorting behavior while introducing the initial 5-item cap and incremental reveal.
- Make the "view more" control deterministic and obvious, with a predictable batch size and a clear disabled or hidden state at the end.
- Prefer layout changes that preserve the current dashboard data flow, because the requested change is visual and interaction-focused.

## 14. Suggested Code Structure and Contracts

- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.test.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.test.tsx`

Suggested contract:

```ts
type TopChampionsDisplayState = {
  visibleCount: number;
  batchSize: number;
  hasMore: boolean;
};
```

The champion list should derive the visible slice from the sorted champion data and advance the visible count in fixed blocks when the user clicks "view more".

## 15. Validation References

### Unit tests

- Verify the champion section renders only 5 items initially.
- Verify each "view more" action reveals the next batch.
- Verify the button disappears or disables when no more champions remain.

### Integration tests

- Verify the dashboard still receives the same filtered match data and that the champion section uses it without changing the analytics calculations.

### UI/E2E tests

- Open a populated dashboard and confirm the main content is arranged horizontally.
- Confirm the page stays within the intended viewport height target and overflow is handled within the dashboard surface.

### Manual validation

- Search a profile with more than 5 champion entries and click "view more" until the full list is visible.
- Resize the viewport to confirm the dashboard remains usable without extending the full page vertically.

### Regression checks

- Confirm filters, charts, and history still update from the same dashboard state.
- Confirm champion sorting still behaves correctly after expansion and when the visible slice changes.

## 16. Regression Risks

- A stricter `100vh` layout can hide content that used to be visible by default if overflow is not handled carefully.
- The new champion slicing can accidentally break existing sort order or tie-break behavior.
- Loading blocks in the champion list can confuse users if the button label or count change is not explicit.
- Horizontal restructuring can compress charts or tables enough to reduce readability on smaller screens.
- Internal scroll regions can conflict with the existing dashboard panel styles if their heights are not coordinated.

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
    "index": "008",
    "name": "horizontal-dashboard-expandable-top-champions",
    "path": "docs/changes/008-horizontal-dashboard-expandable-top-champions/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Reorganize the dashboard into a horizontal layout that fits within 100vh and make the most played champions list expandable in blocks of 5.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up decisions about the horizontal dashboard layout and expandable champion list.",
        "purpose": "Defines the requested behavior and batch loading rule."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Shows the dashboard shell that currently stacks the sections vertically."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx",
        "purpose": "Shows the champion aggregation and full-list rendering that needs an expandable presentation."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx",
        "purpose": "Confirms the filtered match list already exists for reuse."
      },
      {
        "type": "documentation",
        "reference": "docs/product/analysis-gg and docs/planning/analysis-gg documents",
        "purpose": "Confirm that the dashboard and champion analytics are core product areas."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "browser automation",
        "requiredWhen": "When validating the final dashboard layout in the UI.",
        "purpose": "Observe viewport fit, horizontal arrangement, and overflow behavior."
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Keep the dashboard within a 100vh target.",
        "reason": "The user explicitly asked to reorganize the dashboard so it fits the viewport."
      },
      {
        "constraint": "Start the champion list with 5 items and load more in blocks.",
        "reason": "The user explicitly chose this behavior."
      },
      {
        "constraint": "Do not introduce new backend data fetching.",
        "reason": "The needed match data already exists in the current dashboard flow."
      }
    ],
    "userConfirmedDecisions": [
      "Show 5 champions initially.",
      "Load additional champions in blocks.",
      "Use a horizontal dashboard layout that prioritizes avoiding vertical overflow."
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Viewport fit at 100vh target.",
      "Horizontal arrangement of dashboard sections.",
      "Expandable champion list behavior in blocks."
    ]
  }
}
```
