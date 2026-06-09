# Change Spec: Player Profile Section

## 1. Overview

This change restructures the dashboard so the player profile information appears as its own section below the filters and above the charts. The section must include the player's name, tagline, region, and current ranked queues, and it must display official Riot emblem images for the ranks.

The current dashboard already has a ranked summary component, but it is rendered inside the header before the filters. The requested change is primarily a layout and presentation update for that profile information.

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
- [x] Analyze backward compatibility.
- [x] Use browser automation to observe UI behavior when available.

## 3. Source Context

- User request: Move the rank information above the charts and below the filters, and create a player profile section.
- User follow-up decision: The profile section should include region and rankings.
- User follow-up decision: Official Riot emblem images should be used for the ranks.
- [DashboardPage.tsx](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): Currently renders `AccountRankedSummary` inside the header above the filters.
- [DashboardPage.module.css](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css): Contains the current header and content layout styles.
- [AccountRankedSummary.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx): Existing summary component that already renders player identity, region, and ranked queue data.
- [AccountRankedSummary.module.css](../../../src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.module.css): Current styling for the summary block.
- [PlayerAnalyticsResponse.ts](../../../src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts): Frontend data contract already includes `rankedQueues`.
- [usePlayerAnalytics.ts](../../../src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts): Preserves `rankedQueues` while merging filtered match responses.
- [TopChampionsTable.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx): Example of the existing frontend using external Riot image assets for champion portraits.
- Browser observation was attempted through the in-app browser, but the browser profile was unavailable in this session.

## 4. Confirmed Facts

- The dashboard currently renders the profile/rank block before the filters.
- The dashboard already has a reusable `AccountRankedSummary` component.
- The profile section must be shown below the filters and above the charts.
- The profile section must include player's name, tagline, region, and current ranked queues.
- Official Riot emblem images are the desired visual treatment for the rank tiers.
- The change should preserve the existing match-based charts and tables.
- The frontend already receives ranked queue data from the analytics response.

## 5. Inferences and Assumptions

- The new profile section can reuse the existing summary component rather than inventing a separate data source.
- Rank emblems should likely be loaded from a Riot-controlled CDN or Riot asset source rather than hand-drawn local icons, because the user explicitly asked for official emblems.
- The layout change should remain responsive and not break the current filter and chart stacking on smaller screens.
- The rank emblem should be associated with each ranked queue card, not only with the global player profile header.

## 6. Questions and Answers

- Question: Should the profile section also include the player's name and tag, or only region and rankings?
- Answer: Yes. The profile section should include the player's name and tag, plus region and rankings.
- Effect on spec: The section is defined as a player profile block, so identity information stays visible in the same area.

- Question: Which rank images should be used?
- Answer: Official Riot emblem images.
- Effect on spec: Implementation must use Riot-official assets or an equivalent official image source.

## 7. Current Behavior

- `DashboardPage` renders `AccountRankedSummary` in the header before the filters.
- `MatchQueueFilter` and `MatchRangeFilter` are placed in the same header area.
- The charts begin immediately after the header, with no dedicated profile section between filters and analytics widgets.
- The ranked summary currently shows text-only rank values and a region icon placeholder.

## 8. Expected Behavior

- The dashboard shows a distinct player profile section below the filters and above the charts.
- The profile section contains the player's name, tagline, region, and current ranked queues.
- Each ranked queue card shows the official Riot emblem for the displayed rank.
- Solo/Duo and Flex remain represented as separate queue summaries.
- Unranked queues continue to render as unranked without implying a tier emblem that does not exist.
- The new section remains visually compact enough to fit on desktop and mobile without overlapping the chart area.

## 9. Scope

- Move the player profile/rank summary out of the header and into a dedicated section below the filters.
- Present the player profile as a discrete block between filters and analytics widgets.
- Add official Riot rank emblem images to the ranked queue presentation.
- Adjust page and component styling to support the new section placement.
- Update frontend tests to cover the new placement and rank emblem rendering.

## 10. Out of Scope

- Changing how ranked queue data is fetched or computed.
- Changing the charts, tables, or match filtering logic.
- Adding new ranked queues beyond Solo/Duo and Flex.
- Adding historical rank progression or previous-season ranks.
- Reworking backend analytics contracts.

## 11. Functional Acceptance Criteria

- The dashboard renders a player profile section below the filters and above the analytics charts.
- The profile section includes the player's identity, region, and ranked queue information.
- Solo/Duo and Flex each display a rank emblem sourced from an official Riot asset.
- The section continues to show unranked queues clearly when no rank data exists.
- The existing charts and tables remain below the profile section and keep their current behavior.
- The layout remains readable on desktop and mobile screen sizes.

## 12. Technical Findings

- `DashboardPage.tsx` currently controls the top-level arrangement of filters and analytics widgets, so it is the primary placement point for the profile section.
- `AccountRankedSummary.tsx` already contains the data needed for the profile block and is the natural component to extend or reposition.
- The frontend already uses external Riot imagery for champion portraits, so a CDN-based rank asset approach is consistent with the existing application pattern.
- The current rank summary is text-heavy, so image assets will need corresponding layout adjustments to avoid crowding.

## 13. Development Guidance

- Keep the change additive and localized to the dashboard presentation layer.
- Reuse the current `AccountRankedSummary` data flow if possible, instead of duplicating analytics state.
- Treat the new profile section as a structural move first, then layer the emblem visuals into the queue cards.
- Keep accessibility intact by preserving meaningful text labels alongside the emblem images.
- If official Riot assets require a specific versioned CDN path, keep that path centralized rather than inlined across multiple components.

## 14. Suggested Code Structure and Contracts

### Frontend placement

- `DashboardPage.tsx`: move the profile section so it renders after `MatchQueueFilter` and `MatchRangeFilter`.
- `DashboardPage.module.css`: update page spacing and responsive layout for the new section order.
- `AccountRankedSummary.tsx`: extend the queue display to include rank emblems and preserve identity/region text.
- `AccountRankedSummary.module.css`: add styles for emblem layout, spacing, and responsive wrapping.

### Suggested data expectations

```typescript
interface RankedQueueSummary {
  queueType: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winRate: number | null;
}
```

The component should continue to receive `rankedQueues` from the analytics response and derive the visible emblem from the queue tier.

## 15. Validation References

### Unit tests

- Update `AccountRankedSummary.test.tsx` to verify the profile section renders the expected identity, region, and ranked queue content.
- Add coverage for rank emblem rendering for ranked queues.
- Add coverage for unranked queues to ensure no misleading emblem is shown.

### UI/E2E tests

- Verify the profile section appears below the filters and above the charts.
- Verify the section does not overlap the charts on desktop or mobile widths.

### Manual validation

- Open the dashboard with a ranked player and inspect the profile section placement.
- Confirm the rank emblems are visible and correspond to the displayed rank.
- Confirm the layout remains readable at smaller widths.

### Regression checks

- Run frontend unit tests.
- Run the frontend build or typecheck to catch layout and type regressions.

## 16. Regression Risks

- Moving the summary out of the header can disrupt the visual hierarchy if spacing is not adjusted carefully.
- Adding emblem images can cause layout shifts if image sizing is not controlled.
- A network or asset failure for Riot images could leave the profile section visually degraded unless a fallback is provided.
- The profile section could become too tall on small screens if queue cards are not allowed to wrap or stack cleanly.

## 17. Open Blockers and Pending Decisions

- Open blockers:
  - None.
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
    "index": "006",
    "name": "player-profile-section",
    "path": "docs/changes/006-player-profile-section/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Create a dedicated player profile section below the dashboard filters and above the charts, showing identity, region, ranked queues, and official Riot rank emblems.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up decisions",
        "purpose": "Defines placement, section contents, and official Riot emblem requirement"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Shows current placement of the summary above the filters"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx",
        "purpose": "Shows the current summary component that will be repositioned or extended"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts",
        "purpose": "Confirms the ranked queue data is already available on the frontend"
      },
      {
        "type": "tool",
        "reference": "In-app browser attempt",
        "purpose": "UI observation was attempted but the browser profile was unavailable"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "Browser automation",
        "requiredWhen": "Verifying the dashboard layout and responsive behavior",
        "purpose": "Confirm the profile section placement and visual integrity"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Keep the profile section below filters and above the charts",
        "reason": "This is the requested dashboard structure"
      },
      {
        "constraint": "Use official Riot emblem images for ranks",
        "reason": "The user explicitly requested official Riot assets"
      },
      {
        "constraint": "Preserve existing match-based charts and filters",
        "reason": "The request is about presentation, not analytics logic"
      }
    ],
    "userConfirmedDecisions": [
      "The profile section should include region and rankings",
      "Official Riot emblem images should be used"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Dashboard section placement",
      "Official Riot rank emblem rendering",
      "Responsive layout",
      "No regression in charts or filters"
    ]
  }
}
```
