# Change Spec: Runeterra Arena Design System

## 1. Overview

This specification details the changes required to apply the "Runeterra Arena" design system to the `Analysis.GG` project, replacing the current custom Obsidian theme and fixed-width container layout with a premium, responsive fantasy-themed interface inspired by competitive game portals. The transition will include copying the design system's CSS tokens, typography, layouts, and components into the frontend project, importing Google Fonts for enhanced display, and refactoring search and dashboard components to use the new visual styles while preserving existing logic and tests.

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
- [x] Analyze React/component-library integration.
- [x] Use Playwright MCP to observe or reproduce UI behavior.

## 3. Source Context

- [Runeterra Arena Design System Directory](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/design-system/001-runeterra-arena/): Folder containing tokens, typography, layout, components, and examples.
- [index.html](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/index.html): Main HTML root file.
- [index.css](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/index.css): Main frontend global styles.
- [App.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/app/App.tsx): Core React application entry wrapper.
- [SearchLandingPage.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/pages/SearchLandingPage.tsx): Root page for players search.
- [SearchForm.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/components/SearchForm.tsx): The summoner search form.
- [DashboardPage.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): Main analytics dashboard view.
- [Button.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/shared/ui/Button/Button.tsx), [Input.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/shared/ui/Input/Input.tsx), [Select.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/shared/ui/Select/Select.tsx): Shared UI components.
- [WeekdayWinRateChart.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx): Recharts win rate bar chart.
- [DailyPerformanceGrid.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx): Activity calendar grid component.
- [TopChampionsTable.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx): Table representing player champion statistics.

## 4. Confirmed Facts

- The Runeterra Arena design system uses a dark theme with Void base colors, Gold accents for primary actions, and Cyan accents for digital features/secondary links.
- The existing styling uses an Obsidian dark theme with a fixed-width `#root` container (1126px).
- The user decided to remove the fixed-width restrictions of `#root` to follow the design system's fluid/responsive layout recommendations.
- The user requested to place the design system CSS files in `src/main/frontend/src/shared/assets/css/` and import them.
- Google Fonts for "Cinzel", "Inter Tight", and "Inter" will be imported in `index.html` to provide high-quality premium typography.
- The Daily Performance Grid will map Win to Forest green (`--color-forest-400`), Loss to Crimson red (`--color-crimson-400`), Tie to Cyan (`--color-cyan-500`), and empty cells to Void (`--color-void-800`).
- The Weekday Win Rate chart will use Cyan (`--color-cyan-500`) for the bars.

## 5. Inferences and Assumptions

- By importing `components.css` globally, all custom variables (tokens) and utilities will be available project-wide.
- Component structural markup in React will be updated to add `.ds-*` class names where appropriate (e.g., wrapper divs, headers, panels) to achieve the exact aesthetics from the design system preview.
- Local CSS Module styles can be preserved for minor component layouts but will fallback to global tokens (e.g. `var(--color-border)`) instead of hardcoded Obsidian theme colors.
- Existing frontend tests depend on `id` and `data-testid` properties (e.g. `data-testid="match-queue-filter"`, `id="riot-id-input"`, `id="search-submit-button"`). Preserving these ensures zero test breakage.

## 6. Questions and Answers

- **Question**: Layout structure and CSS location - Should we remove the fixed width on `#root` and use fluid/responsive layouts, and where should we copy the CSS files?
  - **User Answer**: Yes, remove the fixed width, and proceed with the recommended path: copy files to `src/main/frontend/src/shared/assets/css/`.
  - **Effect**: Files will be copied to `src/main/frontend/src/shared/assets/css/`. `#root` container width constraints will be removed from `index.css`.
- **Question**: Google Fonts import - Should we import "Cinzel", "Inter Tight", and "Inter" from Google Fonts in `index.html`?
  - **User Answer**: Yes.
  - **Effect**: Google Fonts links will be added to `<head>` of `index.html`.
- **Question**: Daily Performance Grid color mapping - How should the grid states map to design system tokens?
  - **User Answer**: Win -> Forest green, Loss -> Crimson red, Tie -> Cyan, None -> Void-800.
  - **Effect**: `DailyPerformanceGrid` styling will be updated to use these design system token variables.
- **Question**: Weekday Win Rate chart bar color - What color should the bars use?
  - **User Answer**: Cyan (`var(--color-cyan-500)`).
  - **Effect**: `WeekdayWinRateChart` bar fill will be updated to `var(--color-cyan-500)`.

## 7. Current Behavior

- Obsidian-themed dark dashboard with a fixed-width container.
- Uses basic inputs, selects, and buttons styled with custom, non-dynamic gradients (cyan-emerald).
- Standard sans-serif fonts from default system stacks.
- Grid colors are custom green/red/cyan.

## 8. Expected Behavior

- Responsive, fluid, fully cinematic game-portal entrance for `SearchLandingPage` using the `.ds-hero` layout and `.ds-panel`.
- Dashboard elements wrapped in premium panel borders (`.ds-panel` and `.ds-card` styles).
- Font styles utilizing "Cinzel" for displaying League of Legends inspired title styling and "Inter" / "Inter Tight" for clean headings and UI text.
- Text boxes and selects styled exactly like `.ds-input` and `.ds-select` (squared silhouettes, subtle borders, focus outlines).
- Buttons styled as `.ds-button` with correct hover micro-animations and focus highlights.
- Daily performance grid and charts correctly utilizing the Runeterra Arena color tokens (Forest green, Crimson, Cyan, Void-800).

## 9. Scope

- **Copy CSS files**:
  - Copy `tokens.css`, `typography.css`, `layout.css`, and `components.css` from `docs/design-system/001-runeterra-arena/` to `src/main/frontend/src/shared/assets/css/`.
- **Update index.html**:
  - Add Google Fonts link in `<head>`: `https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;800;900&family=Inter+Tight:wght@400;600;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap`.
- **Update index.css**:
  - Import the design system: `@import url('./shared/assets/css/components.css');` at the top.
  - Clean up the `#root` wrapper to remove the `width: 1126px` restriction and border.
- **Refactor Components and Pages**:
  - `App.tsx`: Wrap content inside a `div` with class name `.ds-page`.
  - `SearchLandingPage.tsx` & `SearchLandingPage.module.css`: Use `.ds-hero`, `.ds-hero-content`, and `.ds-kicker` for landing structure.
  - `SearchForm.tsx`: Apply `.ds-panel` for the form layout, `.ds-input` for inputs, `.ds-select` for dropdowns, and `.ds-button ds-button-primary` for the Analyze button.
  - `DashboardPage.tsx` & `DashboardPage.module.css`: Use `.ds-container` and `.ds-stack-lg` for layouts. Style player name, tag, and region badge using `.ds-badge`.
  - `Button.tsx`, `Input.tsx`, `Select.tsx`: Incorporate design system styling or compose classes (`.ds-button`, `.ds-input`, `.ds-select`).
  - `WeekdayWinRateChart.tsx`: Use `var(--color-cyan-500)` for bar fill. Update card wrapper to use `.ds-panel` and section headings to use `h3` with `.ds-heading-md`.
  - `DailyPerformanceGrid.tsx` & `DailyPerformanceGrid.module.css`: Map wins, losses, ties, and none to the correct color tokens: `--color-forest-400`, `--color-crimson-400`, `--color-cyan-500`, `--color-void-800`. Use `.ds-panel` wrapper.
  - `TopChampionsTable.tsx` & `TopChampionsTable.module.css`: Apply `.ds-table` styling and gold text for headers. Wrap in `.ds-panel`.
  - `MatchQueueFilter.tsx`: Apply `.ds-button-ghost` (with an active/selected cian state or gold highlight) or `.ds-tab` elements to render filters.

## 10. Out of Scope

- Modifying backend code or changing REST API endpoints.
- Re-architecting state contexts (`DashboardContext`).
- Rewriting vitest suites (test cases should remain intact).

## 11. Functional Acceptance Criteria

- **AC1: Fluid Layout**: The application layout adapts responsively to varying screen sizes without a fixed 1126px width restriction.
- **AC2: Premium Typography**: Títulos principais usam a fonte "Cinzel" e os textos secundários e de botões usam "Inter" / "Inter Tight".
- **AC3: Form Elements Styling**: Text input has a squared black semi-transparent silhouette, cian focus ring, and is fully readable. Select is styled similarly. Analyze button uses the prestige gold color with hover hover effects and micro-animations.
- **AC4: Panel Card Styling**: Dashboard widgets are framed within the dark raised panel gradient and gold/prestige thin borders (`.ds-panel` styles).
- **AC5: Correct Color Tokens**: Grid cells for Wins are Forest green (`#4ab99d`), Losses are Crimson red (`#e35b61`), Ties are Cyan (`#16b9dc`), and empty cells are Void-800 (`#17212c`).
- **AC6: Chart Colors**: The weekday performance chart bars are filled with Cyan (`#16b9dc`).

## 12. Technical Findings

- Recharts bar charts can dynamically accept CSS variables as fill: `<Bar dataKey="winRate" fill="var(--color-cyan-500)" />`.
- All custom component tests use `id` or `data-testid` selectors, ensuring CSS alterations do not break assertions.

## 13. Development Guidance

- Import design system components CSS in `index.css`: `@import url('./shared/assets/css/components.css');`.
- Ensure buttons have `min-block-size: 48px` and inputs have `min-block-size: 46px` as per design system requirements.
- Use `clamp()` for headings to scale title sizes dynamically on smaller mobile viewports.

## 14. Suggested Code Structure and Contracts

- Style wrappers in React files should utilize the class list combination:
  ```tsx
  <div className={`ds-panel ${styles.customStyles}`}>
  ```

## 15. Validation References

- **Visual Validation**:
  - Run the Vite dev server and check pages on `http://localhost:5173`.
  - Check responsiveness across desktop (1280px+), tablet (760px), and mobile (320px-520px).
- **Automated Tests**:
  - Run `npm test` inside `src/main/frontend` to verify all components pass their functional tests.
  - Run `./mvnw test` to ensure backend integration tests are unaffected.

## 16. Regression Risks

- Focus and active borders on inputs/buttons might collide with default browser outline. Ensure `outline-offset` is styled correctly.
- Recharts tooltip wrapper needs to be customized to avoid using default white/gray styles.

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
    "index": "004",
    "name": "runeterra-arena-design-system",
    "path": "docs/changes/004-runeterra-arena-design-system/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Apply the Runeterra Arena design system to the project, replacing the old fixed-width layout, importing premium typography, and converting forms and dashboard widgets to match the design system tokens and styles.",
    "sourceSummary": [
      {
        "type": "documentation",
        "reference": "docs/design-system/001-runeterra-arena/",
        "purpose": "Source for CSS tokens, typography, layout, and component classes"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/index.css",
        "purpose": "Verify global styles and layout width constraints"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.tsx",
        "purpose": "Verify performance grid states and classes"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx",
        "purpose": "Verify chart bar styles"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Keep existing test IDs and input IDs",
        "reason": "Ensure that existing frontend tests continue to pass without modifications"
      },
      {
        "constraint": "Google Fonts import",
        "reason": "Import Cinzel, Inter Tight, and Inter for premium typography"
      }
    ],
    "userConfirmedDecisions": [
      "Remove fixed width from root and use fluid responsive layout",
      "Store CSS files in src/main/frontend/src/shared/assets/css/",
      "Import Cinzel, Inter Tight, and Inter from Google Fonts",
      "Map Daily Performance Grid to Forest green (win), Crimson (loss), Cyan (tie), and Void-800 (none)",
      "Set Weekday Win Rate chart bar fill to Cyan"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Vite dev server page rendering and visual style",
      "Responsive layout scaling from 320px to 1280px+",
      "Frontend test suite completion"
    ]
  }
}
```
