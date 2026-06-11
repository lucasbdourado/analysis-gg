# Change Spec: Back to Account Selection

## 1. Overview

The dashboard page currently displays the summoner's statistics and match history, but lacks a clean way to navigate back to the account selection page (search landing page) when the data has loaded successfully. Currently, a back button is only available in the error/refused state.

This change documents the addition of a sticky Top Bar at the very top of the dashboard page containing a "Back to Account Selection" button, identical in design and responsive behavior to the Top Bar found on the match detail page.

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
- [x] Use Playwright MCP to observe or reproduce UI behavior.

## 3. Source Context

- User request: "quero adicionar um botão de voltar da dashboard para a seleção de conta" (I want to add a back button from the dashboard to the account selection page).
- User choice: Selected Option A (sticky Top Bar at the very top of the Dashboard, identical to the Match Detail Page layout).
- Playwright observation on local dev server at `http://localhost:5173/dashboard?name=Joeyzenhu&tag=br1&region=br1`.
- Frontend dashboard page: [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx).
- Frontend dashboard styles: [DashboardPage.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css).
- Frontend dashboard tests: [DashboardPage.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.test.tsx).
- Visual design reference: [MatchDetailPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/match-detail/presentation/pages/MatchDetailPage.tsx) and its CSS companion.

## 4. Confirmed Facts

- The search landing page (account selection) is hosted at the root route `/`.
- The dashboard page is loaded under `/dashboard` with search query parameters.
- [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx) currently defines `handleBackToSearch` which executes `navigate('/')` but only renders it in the error view card.
- The successful dashboard view (`DashboardContent`) does not render any back button.
- The Match Detail Page uses a sticky `.topBar` class with a `.backButton` inside a `.pageWrapper` container to go back to the dashboard.
- The design system tokens (`--z-sticky`, `--space-4`, etc.) are imported globally and are available on the dashboard.

## 5. Inferences and Assumptions

- A back button is expected only in the successful dashboard layout since the error state already contains one.
- Navigating back to the account selection page is as simple as routing to `/`.
- Visual consistency across dashboard and match detail pages requires identical styles for the sticky top bar and back button.

## 6. Questions and Answers

| Question | Why it matters | User answer | Effect on spec |
|---|---|---|---|
| Where would you prefer the back button to be placed on the Dashboard Page? | Determines whether we add a page-level top bar or embed it inside the filters section. | Option A: A sticky Top Bar at the very top of the Dashboard, identical to the Match Detail Page layout. | We will create a page-level sticky Top Bar wrapper for the successful dashboard view. |

## 7. Current Behavior

- The dashboard loads summoner data and directly shows filters and statistics with no page-level back navigation available.
- Users must use the browser's back button or reload the root page manually to select a different account once data successfully loads.

## 8. Expected Behavior

- A sticky Top Bar will sit at the very top of the dashboard page when in the success state.
- It will contain a button labeled "← Account Selection".
- Clicking the button will trigger navigation back to `/` (Search Landing Page).
- The button and bar styling will remain identical to the Match Detail Page, adapting appropriately to mobile screens.

## 9. Scope

- Adding `pageWrapper`, `topBar`, and `backButton` DOM structure to the successful dashboard layout.
- Adding stylesheet declarations for the page layout, sticky top bar, and hover states.
- Extending frontend unit tests to verify button existence and navigation behavior.

## 10. Out of Scope

- Modifying the landing page search form behavior.
- Modifying backend endpoints or data contracts.
- Adjusting other navigation headers in the application.

## 11. Functional Acceptance Criteria

| # | Criterion |
|---|---|
| 1 | The dashboard displays a sticky top bar at the very top of the page when data is loaded successfully. |
| 2 | The top bar contains a button with the text "← Account Selection". |
| 3 | Clicking the "← Account Selection" button redirects the user to the root path (`/`). |
| 4 | The top bar and button match the font, color, border, and hover animations of the Match Detail Page. |
| 5 | The top bar correctly adjusts its padding on screen widths below `768px`. |
| 6 | Existing dashboard elements (filters, profile card, analytics) remain in their correct order and fully functional. |

## 12. Technical Findings

| Area | Finding | Why it matters |
|---|---|---|
| Navigation hook | `useNavigate` is already imported and used in the main page component. | We can invoke it directly inside `DashboardContent` or pass the handler down as a prop. |
| CSS layout | The dashboard currently has no `pageWrapper` style, using `ds-container` immediately. | We need to introduce a flex column wrapper to host the full-width top bar and the container below. |
| Breakpoints | The top bar padding should decrease at mobile widths to fit smaller viewports. | Media query rules matching MatchDetailPage must be copied into the dashboard module styles. |

## 13. Development Guidance

- Keep changes strictly focused on the presentation layer of the dashboard feature.
- Use the class name `pageWrapper` as the root element of `DashboardContent`.
- Copy or reference design tokens (`--color-border`, `--color-gold-300`) to guarantee adherence to the design system.

## 14. Suggested Code Structure and Contracts

### [DashboardPage.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx)
Adjust the JSX returned by `DashboardContent` to incorporate the wrapper and the top bar:
```tsx
const DashboardContent: React.FC<DashboardContentProps> = ({ data }) => {
  const { combinedFilteredMatches } = useDashboard();
  const navigate = useNavigate();

  const handleBackToSearch = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button 
          className={styles.backButton} 
          onClick={handleBackToSearch} 
          type="button" 
          id="back-to-search"
        >
          <span className={styles.backArrow}>←</span> Account Selection
        </button>
      </div>

      <div className={`ds-container ds-section ds-stack-lg ${styles.dashboardContainer}`} data-testid="dashboard-success">
        {/* Existing header and dashboardLayout content */}
      </div>
    </div>
  );
};
```

### [DashboardPage.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css)
Append layout and style definitions:
```css
.pageWrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.topBar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-8);
  background: rgba(7, 9, 13, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.backButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-strong);
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: var(--font-size-xs);
  font-weight: 800;
  padding: var(--space-2) var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition:
    background-color var(--duration-base) var(--ease-standard),
    color var(--duration-base) var(--ease-standard),
    border-color var(--duration-base) var(--ease-standard);
}

.backButton:hover {
  background: rgba(234, 210, 149, 0.08);
  color: var(--color-gold-300);
  border-color: var(--color-border-strong);
}

.backArrow {
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .topBar {
    padding: var(--space-3) var(--space-4);
  }
}
```

## 15. Validation References

- **Unit tests:** Assert the existence of the button with role `button` and name "Account Selection" within [DashboardPage.test.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.test.tsx).
- **E2E/Playwright:** Validate visually on simulated tablet and mobile viewports.
- **Manual validation:** Run the dashboard, verify the sticky behavior while scrolling, click the button, and ensure navigation back to `/` functions cleanly.

## 16. Regression Risks

- Adding a wrapper element may affect grid calculations if not configured properly, though the flex-direction column preserves block alignment.
- The `z-index` of the sticky top bar must not hide or conflict with other tooltips or dropdowns on the page.

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
    "index": "019",
    "name": "back-to-account-selection",
    "path": "docs/changes/019-back-to-account-selection/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Add a back button from the dashboard page to the account selection page (search landing page).",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User request and follow-up button placement preference confirmation",
        "purpose": "Define the request to navigate back to account selection and the placement option choice"
      },
      {
        "type": "tool",
        "reference": "Playwright MCP observation of http://localhost:5173/dashboard?name=Joeyzenhu&tag=br1&region=br1",
        "purpose": "Inspect the dashboard layout and check consistency with Match Detail page"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Review dashboard page component and layout"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css",
        "purpose": "Review dashboard page CSS styling"
      },
      {
        "type": "test",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.test.tsx",
        "purpose": "Review existing tests for the dashboard page"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "playwright",
        "requiredWhen": "UI, form, flow, or visual behavior needs to be observed",
        "purpose": "Inspect the dashboard layout and confirm consistency"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "The back button should be in a sticky top bar matching the style of the Match Detail page.",
        "reason": "The user explicitly chose this design option for visual consistency."
      }
    ],
    "userConfirmedDecisions": [
      "The back button will be placed in a sticky Top Bar at the very top of the dashboard page, showing '← Account Selection'."
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "sticky top bar visibility",
      "back button styling and text",
      "navigation behavior on click",
      "no regression in existing dashboard elements order"
    ]
  }
}
```
