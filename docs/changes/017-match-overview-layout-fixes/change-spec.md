# Change Spec: Match Overview Layout Fixes

## 1. Overview
The match‑overview page (`/match/:id/overview`) shows the game summary, player list, item slots, and various statistics. In the current UI:

* Text and information (e.g., team scores, player K/D/A) are overlapping and flattened.
* Item slots appear empty or invisible.
* Overall layout feels “squashed” on both desktop and mobile widths.

These problems reduce readability and make the page look broken.

## 2. Research Checklist
- Understand the requested change – Resolve overlapping text, restore proper spacing, and ensure item slots render correctly.
- Identify available source documents – UI components are built with React + Tailwind (observed from `src/components/MatchOverview/*.tsx`).
- Current expected behavior – Clean, spaced layout; item icons displayed in their slots.
- Current actual behavior – Over‑lapping text, missing items, compressed layout.
- Analyze related code – `MatchOverview.tsx`, `PlayerCard.tsx`, styles in `match-overview.module.css`.
- Analyze existing tests – No UI tests for this component currently.
- Identify affected modules – `MatchOverview`, `PlayerCard`, CSS module, image assets.
- Identify risks – Changing flex/grid rules may affect other pages that reuse the same component library.

## 3. Source Context
- Page URL used for Playwright observation: `http://localhost:5173/match/BR1_3250888251?region=br1&name=Joeyzenhu&tag=br1` (full‑page screenshot attached).
- Console shows two errors: missing `itemIcon` assets and a CSS variable `--spacing` undefined.

## 4. Confirmed Facts
| Fact | Source |
|------|--------|
| Overlapping text on player rows | Screenshot `match_overview.png` |
| Empty item slots (no icons) | Screenshot `match_overview.png` |
| Layout compressed (no vertical spacing) | Screenshot `match_overview.png` |
| CSS module defines `.playerRow { display: flex; }` without gap | `src/components/MatchOverview/match-overview.module.css` |
| Item icon component expects `src/assets/items/{id}.png` | `src/components/ItemIcon.tsx` |

## 5. Inferences & Assumptions
- The missing CSS variable likely comes from a global theme that isn’t loaded on this page.
- Item icons are not rendered because the asset path is incorrect for the production build.

## 6. Questions & Answers
| Question | Why it matters | User answer | Effect |
|----------|----------------|------------|--------|
| Is the page supposed to use a dark theme? | Determines which CSS variables are required. | Yes – dark theme is intended. | We must ensure the dark‑theme CSS file is imported. |
| Are the item IDs available in the API response? | Needed to map IDs to icon files. | Yes, they are present. | Icon component logic can stay unchanged; only asset path needs fixing. |

## 7. Current Behavior
- Text overlaps because flex containers lack `gap`/`margin`.
- Item slots show empty `<img>` tags due to wrong asset path (`/static/items/...`).

## 8. Expected Behavior
- Each player row displays spaced columns: champion icon, summoner name, K/D/A, CS, and item slots.
- Item slots show the correct icon image sized to 24 px, with a subtle background.
- Overall page respects a vertical rhythm (≈12 px between rows) and adapts to mobile breakpoints.

## 9. Scope
- UI‑only changes (CSS, component markup).
- No backend changes required.

## 10. Out of Scope
- Adding new statistics or re‑architecting the match‑overview data flow.
- Internationalization or theme switching beyond dark mode.

## 11. Functional Acceptance Criteria
| # | Criterion |
|---|-----------|
| 1 | Player rows no longer overlap; text is fully visible on desktop (≥ 1280 px) and mobile (≤ 768 px). |
| 2 | Item slots display the correct champion‑specific icons, sized 24 px, with a visible border. |
| 3 | Vertical spacing between rows is at least 12 px. |
| 4 | No console errors related to missing CSS variables or image assets after changes. |
| 5 | The page passes a visual regression test against a saved baseline screenshot. |

## 12. Technical Findings
| Area | Issue | Suggested Fix |
|------|-------|---------------|
| CSS Flex layout | No `gap` between columns causing overlap. | Add `gap: var(--spacing, 8px);` to `.playerRow` and define `--spacing`. |
| CSS variable | `--spacing` undefined. | Import `src/styles/theme-dark.css` in `MatchOverview.tsx`. |
| Image path | `ItemIcon` builds URL `\`/static/items/${id}.png\`` but assets are under `public/assets/items/`. | Update `ItemIcon` to use `/assets/items/${id}.png` or adjust webpack public path. |
| Responsive design | No media query for mobile breakpoints. | Add `@media (max-width: 768px) { flex-direction: column; }` to `.playerRow`. |
| Accessibility | Missing `alt` text on item images. | Add `alt={\`Item ${id}\`}` prop. |

## 13. Development Guidance
1. **CSS Updates** – Edit `match-overview.module.css`:
   - Add `gap` and define `--spacing`.
   - Add a media query for mobile layout.
2. **Theme Import** – In `MatchOverview.tsx`, import the dark‑theme stylesheet:
   ```tsx
   import '../../styles/theme-dark.css';
   ```
3. **ItemIcon Fix** – Adjust the asset URL construction in `ItemIcon.tsx`:
   ```tsx
   const src = `/assets/items/${itemId}.png`;
   ```
4. **Add Alt Text** – Modify `<img>` element:
   ```tsx
   <img src={src} alt={`Item ${itemId}`} className={styles.itemImg} />
   ```
5. **Run Playwright Visual Test** – Capture a new baseline screenshot after changes and compare with the previous one.

## 14. Suggested Code Structure & Contracts
| File | Change |
|------|--------|
| `src/components/MatchOverview/match-overview.module.css` | Add CSS custom property & gaps. |
| `src/components/MatchOverview/MatchOverview.tsx` | Import theme, adjust layout classes. |
| `src/components/ItemIcon.tsx` | Fix asset path, add alt attribute. |
| `tests/e2e/match-overview.spec.ts` | New Playwright test: open page, take screenshot, compare. |

## 15. Validation References
- **UI/E2E test** – Playwright script that navigates to the match URL, takes a full‑page screenshot, and asserts no visual differences.
- **Unit test** – Simple Jest test verifying `ItemIcon` returns the correct `src`.

## 16. Regression Risks
- Changing global CSS variables may affect other dark‑theme components if they rely on the same variable name.
- Updating image paths could break other components that use the old path; review other icon imports.

## 17. Open Blockers & Pending Decisions
| Blocker | Needed Decision |
|---------|-----------------|
| None – all required information has been gathered. | – |

## 18. Readiness Checklist
- [x] Change request is clear.
- [x] Expected behavior documented.
- [x] Current behavior documented (screenshot).
- [x] Relevant source code reviewed.
- [x] Relevant UI behavior observed with Playwright.
- [x] Questions asked and answered.
- [x] Open blockers documented (none).
- [x] Pending decisions documented (none).
- [x] Development guidance provided.
- [x] Suggested code structure documented.
- [x] Validation scenarios outlined.

## 19. Structured Agent Reference
```json
{
  "spec": {
    "index": "017",
    "name": "match-overview-layout-fixes",
    "path": "docs/changes/017-match-overview-layout-fixes/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Fix overlapping text and empty item slots on match overview page",
    "sourceSummary": [
      {
        "type": "ui | tool",
        "reference": "Playwright screenshot (match_overview.png)",
        "purpose": "Observe current broken layout"
      },
      {
        "type": "code",
        "reference": "src/components/MatchOverview/*.tsx, src/components/ItemIcon.tsx",
        "purpose": "Identify markup and style issues"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "playwright",
        "requiredWhen": "UI analysis needed",
        "purpose": "Capture screenshot and console logs"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Only UI changes; no backend modifications",
        "reason": "Requested change is visual only"
      }
    ],
    "userConfirmedDecisions": [],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": ["visual regression", "console errors"]
  }
}
```
