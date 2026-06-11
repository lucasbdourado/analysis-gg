# Change Spec: Match Detail Overview Layout Fixes

## 1. Overview

The match detail page shows the match overview for a specific game, including team panels, player identity, KDA, CS, and item slots. The current layout is visually compressed on desktop and does not switch to a column layout early enough for medium screens. Empty item slots also contribute to a flattened and hard-to-scan row presentation.

This change documents the UI adjustments needed to make the overview readable on desktop, tablet-width screens, and mobile, while keeping the participant data mapped correctly on each row.

## 2. Research Checklist

- Understand the requested change.
- Identify available source documents.
- Identify the current expected behavior.
- Identify the current actual behavior, if applicable.
- Analyze directly related code areas.
- Analyze existing tests directly related to the change.
- Identify affected modules, components, APIs or integrations.
- Identify risks, unknowns and assumptions.
- Identify what needs to be created, changed or removed.
- Identify validation and test scenarios.
- Use Playwright MCP to observe or reproduce UI behavior.

## 3. Source Context

- User request: the overview text and information are overlapping, flattened, and visually broken, with empty item slots; the screen should also be validated on mobile and on a width that collapses into a column.
- User decision: the column layout breakpoint should change at `1024px`.
- Playwright observation on local dev server at `http://localhost:5173/match/BR1_3250888251?region=br1&name=Joeyzenhu&tag=br1`.
- Frontend page component: `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.tsx`.
- Frontend page styles: `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.module.css`.
- Frontend page tests: `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.test.tsx`.
- Data contracts: `src/main/frontend/src/features/match-detail/domain/MatchDetail.ts` and `src/main/frontend/src/features/match-detail/domain/ParticipantSummary.ts`.
- API integration point: `src/main/frontend/src/features/match-detail/infrastructure/api/matchDetailApi.ts`.

## 4. Confirmed Facts

- `MatchDetailPage` renders two team panels, each containing a header row and multiple participant rows.
- Each participant row currently maps `ParticipantSummary` into player identity, KDA, CS, and 7 item slots (`item0` through `item6`).
- Empty item slots are rendered as placeholder elements when an item id is `0`.
- The participant row uses a 4-column grid on desktop widths.
- The current CSS collapses the participant row into a single column only below `768px`.
- The user explicitly wants the column layout behavior to start at `1024px`.
- Playwright inspection showed the item cell is narrow on desktop widths and the 7 item slots wrap into two lines, which makes the row feel compressed.
- Playwright inspection showed the row remains horizontal at `1024px` even though the wider page layout already becomes narrower.

## 5. Inferences and Assumptions

- The reported overlap and flattening are primarily caused by the current row grid sizing and by item-slot wrapping, not by missing data from the API.
- The desired fix is a presentation-only change in the frontend match detail page, with no backend contract change.
- The row should continue to display all currently available participant fields, but with a more readable layout and spacing model.
- The `1024px` breakpoint should be treated as the point where the participant row and its children switch to the stacked layout.

## 6. Questions and Answers

| Question | Why it matters | User answer | Effect on spec |
|---|---|---|---|
| Should the single-column layout start at `1024px` or only at smaller mobile widths? | This determines the responsive breakpoint for the row layout and avoids ambiguity during implementation. | Change it at `1024px`. | The responsive breakpoint requirement is now fixed at `1024px`, not `768px`. |

## 7. Current Behavior

- On desktop widths, each participant row uses a tight grid that can cause the items section to wrap into a second line.
- Empty item slots are rendered as visual placeholders, but they still consume space and contribute to the row becoming denser.
- The participant row only switches to a one-column layout below `768px`.
- At `1024px`, the page becomes narrower, but the participant rows still use the desktop row structure.
- The current row data is correct in content, but the visual hierarchy makes it hard to scan.

## 8. Expected Behavior

- The match overview should remain readable on wide desktop screens, medium screens, and mobile.
- The participant row should preserve the correct data order: player identity, KDA, CS, and item slots.
- Empty item slots should still be represented, but they must not distort the row into an awkward wrapped shape.
- The layout should switch to the stacked/column presentation at `1024px`.
- The mobile view should remain a clean single-column layout with readable spacing and no visual overlap.
- Each participant row should continue to render the correct data for that participant, including the searched player highlight when applicable.

## 9. Scope

- Frontend presentation changes for the match detail overview page.
- Responsive layout adjustments for team panels and participant rows.
- Row spacing, item-slot layout, and text hierarchy adjustments.
- Verification of data-to-row mapping for each participant line.
- Frontend tests and UI validation that cover desktop, `1024px`, tablet, and mobile widths.

## 10. Out of Scope

- Backend API changes.
- Match data shape changes.
- New match statistics or additional participant fields.
- Search or routing changes outside the match detail page.
- Visual redesigns unrelated to the match detail overview layout.

## 11. Functional Acceptance Criteria

| # | Criterion |
|---|---|
| 1 | The match overview is readable on desktop without participant text appearing flattened or visually cramped. |
| 2 | Participant rows preserve the correct data mapping for each line: player identity, KDA, CS, and all item slots. |
| 3 | Empty item slots remain visible as placeholders without causing the row to look broken or misaligned. |
| 4 | The participant row switches to the stacked/column presentation at `1024px` and below. |
| 5 | The mobile layout remains a single-column presentation with no overlap between row elements. |
| 6 | The searched player remains visually highlighted and still readable after the layout change. |
| 7 | The page continues to render successfully for both teams and all participants returned by the match detail payload. |

## 12. Technical Findings

| Area | Finding | Why it matters |
|---|---|---|
| Participant row grid | The row currently uses fixed-width grid columns for KDA, CS, and items. | This makes the item area too narrow on wide screens and leads to wrapping. |
| Item slots | Seven item slots are rendered for each participant, including the trinket slot. | The current width must accommodate all item elements without breaking the row rhythm. |
| Responsive breakpoint | The stack layout is currently applied only below `768px`. | The user wants the stacked presentation to start at `1024px`. |
| Empty item placeholders | `itemId === 0` renders a placeholder element. | Placeholder rendering is correct in principle, but the layout around it needs to stay stable. |
| Data mapping | `ParticipantSummary` already contains the fields needed for every row. | The fix should preserve the current mapping instead of introducing new data logic. |

## 13. Development Guidance

- Keep the change localized to the match detail presentation layer unless a test reveals a data-mapping bug.
- Treat the desktop row as a readable summary card, not as a rigid table that must fit into fixed pixel widths.
- Use the `1024px` breakpoint as the point where the row should collapse into the stacked layout.
- Preserve the participant data ordering already established in `MatchDetailPage.tsx`.
- Keep the empty item-slot placeholders visible, but prevent them from forcing the row into a visually broken wrap pattern.
- Update or add tests that verify the row remains readable and that item slots still render for participants with zero-value items.

## 14. Suggested Code Structure and Contracts

| File | Suggested responsibility |
|---|---|
| `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.tsx` | Keep the participant row composition and adjust any markup needed to support the responsive layout. |
| `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.module.css` | Update the row/grid spacing and responsive rules for `1024px` and below. |
| `src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.test.tsx` | Extend coverage for readable row spacing, item-slot rendering, and responsive behavior. |
| `src/main/frontend/src/features/match-detail/domain/ParticipantSummary.ts` | Reference contract for row data fields; no schema change expected. |

## 15. Validation References

- Unit tests.
- UI/E2E tests with Playwright MCP.
- Manual validation on the match detail page at desktop width, `1024px`, tablet width, and mobile width.
- Regression checks for player highlight behavior, row spacing, and item-slot rendering.

## 16. Regression Risks

- Changing the row grid may affect the visibility of long player names or the searched-player highlight.
- Increasing spacing or switching to a stacked layout could make the row taller and change the density of the page.
- Adjusting item-slot sizing or wrapping may affect the visual consistency of participants with many zero-value items.
- Responsive changes around `1024px` may alter how the team panels stack relative to the overall page width.

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
    "index": "018",
    "name": "match-detail-overview-layout-fixes",
    "path": "docs/changes/018-match-detail-overview-layout-fixes/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Fix the match detail overview layout so the participant rows remain readable, the item slots render cleanly, and the responsive layout switches to a column at 1024px.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up breakpoint confirmation",
        "purpose": "Define the visual problem and the required responsive breakpoint"
      },
      {
        "type": "tool",
        "reference": "Playwright MCP observation of http://localhost:5173/match/BR1_3250888251?region=br1&name=Joeyzenhu&tag=br1",
        "purpose": "Inspect the rendered match detail page at desktop and responsive widths"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.tsx",
        "purpose": "Review row composition and data mapping"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.module.css",
        "purpose": "Review layout and breakpoint rules"
      },
      {
        "type": "test",
        "reference": "src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.test.tsx",
        "purpose": "Review existing coverage for the overview page"
      },
      {
        "type": "documentation",
        "reference": "src/main/frontend/src/features/match-detail/domain/ParticipantSummary.ts and MatchDetail.ts",
        "purpose": "Confirm the participant row data contract"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "playwright",
        "requiredWhen": "UI, form, flow, or visual behavior needs to be observed",
        "purpose": "Reproduce and inspect the broken overview layout"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Keep the change frontend-only unless a data-mapping issue is proven",
        "reason": "The reported problem is visual and the backend contract already provides the required fields"
      },
      {
        "constraint": "Use 1024px as the responsive collapse breakpoint",
        "reason": "The user explicitly confirmed the breakpoint change"
      }
    ],
    "userConfirmedDecisions": [
      "The stacked/column layout should begin at 1024px."
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "desktop readability",
      "1024px stacked layout",
      "mobile single-column layout",
      "item-slot rendering",
      "participant row data mapping"
    ]
  }
}
```
