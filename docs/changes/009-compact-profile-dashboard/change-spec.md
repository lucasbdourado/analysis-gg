# Change Spec: Compact Profile Dashboard

## 1. Overview

Refine the dashboard presentation so it feels more like OP.GG, U.GG, and Blitz.gg profile pages: the player profile should be compact, prominent, and information-dense, while the analytics sections should become smaller and less vertically dominant. The change is presentation-focused and should reuse the existing player analytics data already returned to the frontend.

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
- [x] Compare against external profile-page references.
- [ ] Use browser automation to observe local UI behavior. Not completed because the in-app browser profile was unavailable and the local Playwright runtime was not available in this session.

## 3. Source Context

- User request: reduce the amount of information displayed, create a user profile similar to OP.GG, U.GG, and Blitz.gg, and make the dashboard more compact with smaller analytics sections.
- User decision: the dashboard should use a compact profile summary.
- User decision: the profile summary should show identity, current tier, and 2 or 3 primary metrics.
- [DashboardPage.tsx](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): current page composes filters, profile summary, charts, champion table, and recent match history in a vertical stack.
- [DashboardPage.module.css](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css): current page layout uses a vertical page flow and does not constrain the dashboard into a compact profile-first composition.
- [AccountRankedSummary.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx): existing summary component already renders player identity, region, and queue ranks.
- [AccountRankedSummary.module.css](../../../src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.module.css): current styles already present a ranked summary card but with a relatively large footprint.
- [TopChampionsTable.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx): current champion analytics section is a full-width table and contributes to the vertical density of the dashboard.
- [RecentMatchHistory.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx): current recent history section is another large vertical analytics block.
- OP.GG profile page example: shows a strong identity header, compact ranked summary, and a limited set of immediately visible stats before deeper sections.
- U.GG profile page example: shows the profile identity, current ranked queues, and compact champion stats rather than a tall, information-heavy layout.
- Blitz.gg profile page example: emphasizes profile identity and compact performance summaries, with data revealed progressively across sections.

## 4. Confirmed Facts

- The dashboard currently stacks filters, profile summary, analytics charts, champion table, and match history vertically.
- The frontend already receives `rankedQueues` and `matches` in the analytics response.
- The profile summary component already exists and can be reused.
- The dashboard analytics sections already have data, but their current presentation is visually heavy.
- The user wants the dashboard to look more like a compact gaming profile page than a long analytics report.
- The user wants the profile summary to stay compact and expose only identity, current tier, and a small number of core metrics.

## 5. Inferences and Assumptions

- A profile-first layout likely means the player identity and rank summary should become the most visually prominent area, with analytics sections subordinated below it.
- The 2 or 3 metrics should be selected from data already available in the current ranked summary, so the change can remain frontend-only.
- Smaller analytics sections likely means reducing vertical padding, section height, and visual dominance rather than removing analytics content.
- The dashboard should remain responsive and should not require a new backend contract.

## 6. Questions and Answers

| Question | Why it matters | Answer | Effect on spec |
| --- | --- | --- | --- |
| Should the dashboard feel more like a profile page or should it only reduce density while preserving the current hierarchy? | This defines whether the layout is re-centered around the profile or only compressed. | Profile first, with a compact summary and smaller analytics sections. | The spec prioritizes the profile area and treats analytics as secondary content. |
| What should the compact profile summary include? | This defines the content footprint of the top section and how much information can fit. | Identity + current tier + 2 or 3 primary metrics. | The spec limits the profile to a compact, high-signal summary instead of a full detailed card. |

## 7. Current Behavior

- The dashboard starts with filters, then a fairly large profile summary, then a tall analytics stack.
- The profile summary already contains identity and ranked queue information, but it occupies more space than a compact profile card should.
- The analytics area includes multiple large sections that are visually dominant on the page.
- The overall page reads more like a vertically stacked report than a compact profile dashboard.

## 8. Expected Behavior

- The dashboard should present a compact player profile as the primary top-of-page element.
- The compact profile should show the player identity, current tier, and a small set of key metrics drawn from existing data.
- The analytics widgets should render in smaller, denser sections so they support the profile instead of dominating the page.
- The overall page should feel closer to OP.GG, U.GG, and Blitz.gg profile layouts than to a generic analytics report.
- Existing filters and data calculations should continue to work with the same underlying match data.

## 9. Scope

- Rework the dashboard presentation to a more profile-first layout.
- Reduce the visual footprint of the player profile summary.
- Keep only the identity, current tier, and 2 or 3 key metrics in the compact profile view.
- Reduce the visual dominance of the analytics sections.
- Update tests for the new compact profile presentation and layout behavior.

## 10. Out of Scope

- New backend endpoints or new analytics data sources.
- Changing how ranked queues, match history, or champion statistics are computed.
- Adding new analytics widgets unrelated to the compact profile experience.
- Creating a separate social/profile system beyond the existing dashboard profile summary.
- Reworking the search flow or account synchronization logic.

## 11. Functional Acceptance Criteria

- The dashboard opens with a compact profile-focused top section rather than a large, report-like summary.
- The profile section shows the player identity, current tier, and a small number of key metrics sourced from existing data.
- The profile section uses less vertical space than the current profile summary presentation.
- The analytics sections are visually smaller and less dominant than before.
- The page still exposes the same analytics content and continues to use the same match data.
- The layout remains readable on desktop and smaller screens without overlap or clipping.

## 12. Technical Findings

- `DashboardPage.tsx` is the top-level composition point for the dashboard and is the right place to change the overall hierarchy.
- `AccountRankedSummary.tsx` already provides the player identity and ranked queue information needed for a compact profile surface.
- `TopChampionsTable.tsx` and `RecentMatchHistory.tsx` are the biggest contributors to vertical density and likely need tighter presentation styles.
- `DashboardContext.tsx` already provides the filtered match set, so the change should not require new state management.
- The current codebase already uses local CSS modules, which makes it feasible to tighten section spacing without changing the data flow.

## 13. Development Guidance

- Preserve the current data flow and change only presentation unless a component needs a narrow prop or style adjustment.
- Treat the player profile as the primary visual anchor and compress the rest of the dashboard around it.
- Keep the metrics limited and high-signal; avoid reintroducing a large, verbose summary.
- Use compact spacing, shorter sections, and denser cards rather than simply shrinking typography.
- Preserve accessibility by keeping visible labels for rank and metrics instead of relying on icons or color alone.

## 14. Suggested Code Structure and Contracts

- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx`
- `src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.module.css`
- `src/main/frontend/src/features/dashboard/presentation/components/DashboardProfileSummary.tsx` or a similar compact wrapper if the existing summary component needs to remain intact

Suggested contract:

```ts
type CompactProfileMetric = {
  label: string;
  value: string | number;
};
```

The compact profile surface should derive its metrics from already available ranked queue and analytics data and should not require a new API response shape unless a very narrow prop wrapper becomes necessary.

## 15. Validation References

### Unit tests

- Verify the compact profile renders the player identity and current tier.
- Verify the compact profile renders only the selected 2 or 3 key metrics.
- Verify analytics sections still render with the same data flow.

### Integration tests

- Verify the dashboard still receives and passes through the same analytics payload.
- Verify no new backend request is introduced by the presentation change.

### UI/E2E tests

- Open a populated profile and confirm the page reads as a compact profile-first dashboard.
- Confirm the analytics sections appear smaller and less dominant than the profile area.
- Confirm the layout remains usable at common desktop widths and does not overflow unexpectedly.

### Manual validation

- Compare the dashboard against OP.GG, U.GG, and Blitz.gg profile pages for overall density and hierarchy.
- Open a profile with ranked data and verify the top section feels compact rather than tall.
- Resize the viewport and confirm the layout remains readable.

### Regression checks

- Confirm filters still affect the same dataset.
- Confirm charts, champion statistics, and match history still use the same underlying matches.
- Confirm no data field is removed from the existing analytics payload.

## 16. Regression Risks

- Compressing the dashboard too aggressively could reduce readability or make the rank and metric text feel crowded.
- Reusing the existing summary component without resizing it could preserve the current vertical bloat.
- Reducing analytics section size too much could make charts and tables harder to scan on smaller screens.
- A profile-first hierarchy could unintentionally hide useful analytics if spacing and responsive behavior are not balanced carefully.

## 17. Open Blockers and Pending Decisions

- Open blockers:
  - Browser-based local UI observation could not be completed in this session because the in-app browser profile was unavailable and the local Playwright runtime was not available.
- Pending decisions:
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
    "index": "009",
    "name": "compact-profile-dashboard",
    "path": "docs/changes/009-compact-profile-dashboard/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Make the dashboard feel more like OP.GG, U.GG, and Blitz.gg by emphasizing a compact profile summary and shrinking the visual weight of analytics sections.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up decisions about compact profile density and smaller analytics sections.",
        "purpose": "Defines the requested hierarchy and the limited profile content."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Shows the current dashboard composition and primary layout entry point."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx",
        "purpose": "Shows the current summary component that already provides profile and rank data."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx",
        "purpose": "Shows one of the large analytics sections that contributes to vertical density."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx",
        "purpose": "Shows the other large analytics section that affects dashboard density."
      },
      {
        "type": "documentation",
        "reference": "docs/changes/006-player-profile-section/change-spec.md and docs/changes/007-recent-match-history-section/change-spec.md",
        "purpose": "Provides related dashboard presentation context already documented in previous change specs."
      },
      {
        "type": "web",
        "reference": "OP.GG, U.GG, and Blitz.gg profile pages",
        "purpose": "Provides layout references for compact profile-first presentation."
      },
      {
        "type": "tool",
        "reference": "Attempted local browser automation and Playwright runtime check",
        "purpose": "Local visual verification could not be completed in-session."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "web",
        "requiredWhen": "When comparing external profile-page references.",
        "purpose": "Capture layout patterns from OP.GG, U.GG, and Blitz.gg."
      },
      {
        "tool": "browser automation",
        "requiredWhen": "When validating the local dashboard layout after implementation.",
        "purpose": "Confirm compact profile hierarchy and reduced analytics density."
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Keep the profile section compact.",
        "reason": "The user explicitly asked to reduce information density."
      },
      {
        "constraint": "Show identity, current tier, and only 2 or 3 key metrics in the top profile area.",
        "reason": "The user explicitly defined the profile contents."
      },
      {
        "constraint": "Reduce the visual weight of analytics sections without removing them.",
        "reason": "The request is about presentation hierarchy, not deleting analytics."
      },
      {
        "constraint": "Do not introduce new backend data fetching.",
        "reason": "The current frontend already has the required analytics payload."
      }
    ],
    "userConfirmedDecisions": [
      "Use a compact profile summary.",
      "Keep the profile summary to identity, current tier, and 2 or 3 primary metrics.",
      "Make the analytics sections smaller and less dominant."
    ],
    "openBlockers": [
      "Browser-based local UI observation could not be completed in this session."
    ],
    "pendingDecisions": [],
    "validationFocus": [
      "Compact profile-first hierarchy",
      "Reduced analytics density",
      "Responsive readability",
      "No new backend requests"
    ]
  }
}
```
