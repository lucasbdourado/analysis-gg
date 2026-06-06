# Task Implementation Plan: Verify Feature Completion - Weekday Win Rate Bar Chart

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/weekday-win-rate-bar-chart/task-plans/999-verify-feature-completion-plan.md`

## Task Reference

Task ID: `999-verify-feature-completion`

Task file: `docs/features/weekday-win-rate-bar-chart/tasks/999-verify-feature-completion.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `weekday-win-rate-bar-chart`

Feature file: `docs/features/weekday-win-rate-bar-chart/feature.md`

Feature Tech Spec: `docs/features/weekday-win-rate-bar-chart/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/weekday-win-rate-bar-chart/tasks/999-verify-feature-completion.md` | Entire document | Confirmed by source document | Defines objectives and acceptance criteria |
| Feature file | `docs/features/weekday-win-rate-bar-chart/feature.md` | Feature Completion Criteria | Confirmed by source document | Main goals for Weekday Win Rate Chart |
| Feature Tech Spec | `docs/features/weekday-win-rate-bar-chart/tech-spec.md` | Proposed Technical Approach, State and Error Handling, Validation Rules, Testing Strategy | Confirmed by source document | Specifications on client-side Date methods, sorting, tooltips, and mocks |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Defines frontend stack, styling guidelines, and dev server configurations |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Entire document | Confirmed by source document | Standard React testing directives |

## Planning Scope

This planning session covers task `999-verify-feature-completion`. It establishes the end-to-end verification strategy of the Weekday Win Rate Bar Chart using Vitest unit/component tests, production build compilation validation, and automated browser-level E2E checks with Playwright (via the Playwright MCP server tools) to generate visual evidence.

## Task Summary

Validate the complete feature behavior of the Weekday Win Rate Bar Chart from both a product and user perspective, ensuring all acceptance criteria are met, testing suites pass, production build compiles successfully, and UI renders correctly starting on Monday and ending on Sunday (Monday to Sunday) sequentially.

## Execution Eligibility

Status: Eligible

Reason:
- The task's dependencies `001-align-sequential-day-ordering.md` and `002-add-weekday-win-rate-chart-tests.md` are both completed and marked as `Implemented` in `docs/STATE.md` (and verified in their task files). Therefore, the feature implementation and tests are complete, making this final verification task eligible for execution.

## Feature Context

The Weekday Win Rate Bar Chart aggregates and visualizes a player's win rate percentage grouped by day of the week. Calculations are performed client-side within `DashboardContext` and are passed to the chart component. Task 999 validates that the chart renders sequentially starting on Monday and ending on Sunday, correctly calculates win rates using the rounding formula, displays accurate hover tooltips, and displays a graceful empty state when there is no match data.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Product Completion Criteria | Full | Yes | Validates day extraction, rounding formula, Mon-Sun ordering, hover tooltip formatting, and empty state rendering. |
| Technical Goals | Full | Yes | Assures calculations occur in `useMemo` block using `filteredMatches` and standard Date methods. |
| State & Error Handling | Full | Yes | Verifies empty state when match list is empty and "No games played" tooltip state when no matches occurred on a specific day. |
| Testing Strategy | Full | Yes | Validates that unit tests cover calculations, sorting, and custom tooltips using mocked Recharts components. |

Coverage assessment:
- Justifying Tech Spec section: `Product Completion Criteria`, `Technical Goals`, `Testing Strategy`
- Tech Spec sections implemented by this task: Verification of all target specifications.
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Frontend app runs locally using `npm run dev` and builds using `npm run build` |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Chart styles obey Obsidian dark theme tokens |
| Recharts | `technology-definition.md` | ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis, CartesianGrid elements |
| Vitest | `technology-definition.md` | Verification of the existing unit and component tests |
| Playwright | User constraint / Playwright MCP | E2E browser verification and screenshot generation |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Automated testing validations | Instructs how tests check component rendering and state updates |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | Visual alignment | Verifies CSS layout, responsive rules, and theme adherence |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Mon-Sun Sequential Ordering | `docs/features/weekday-win-rate-bar-chart/tech-spec.md` | Slicing and shifting Sunday (0) to the end of the array to output Mon-Sun |
| Rounding Formula | `docs/features/weekday-win-rate-bar-chart/tech-spec.md` | Formula `Math.round((wins / total) * 100)` or default to 0 if total is 0 |

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx` | Target chart component structure and `weekdayData` memoization | Target component | Renders the bar chart and groups matches client-side |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx` | Test suite file | Verification tests | Verifies weekday grouping, sorting, rounding, and tooltips |
| `src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx` | Page composition | Dashboard page | Feeds match array to provider |

## Confirmed Scope

- Execute Vitest unit and component test suites to verify 100% pass rate for the entire project (including `WeekdayWinRateChart.test.tsx`).
- Compile Vite production build bundle (`npm run build`) to ensure TypeScript compilation and bundler assets build cleanly.
- Set up an automated/assisted E2E check using Playwright MCP tools:
  - Mock backend `/api/summoner/*` responses to inject controlled game lists.
  - Search for a player profile with matches.
  - Verify that the Weekday Win Rate Bar Chart renders a bar chart beginning with Monday and ending with Sunday sequentially.
  - Hover over a bar and verify that the custom tooltip shows the correct win rate percentage and wins/losses format (e.g. `Win Rate: 60% (3W - 2L)`).
  - Test hover on a day with 0 games and verify it shows `No games played`.
  - Search for a player with zero matches or apply a range filter yielding zero matches, and verify it displays "No match records to display." inside a dashed card.
  - Capture viewport screenshots for documentation.
- Compile and write the final walkthrough report (`walkthrough.md`) under `docs/features/weekday-win-rate-bar-chart/` containing evidence screenshots and validation notes.
- Update task statuses: transition tasks `001` and `002` to `Done` in their task files, and `999` to `Implemented`.
- Update `docs/features/weekday-win-rate-bar-chart/tasks/README.md` and `docs/STATE.md` with the feature completion status.

## Out of Scope

- Implementing any new features, styling overrides, or modifications to the production source files.
- Setting up permanent E2E test files inside the repository (we use Playwright MCP server to verify the UI).

## Proposed Implementation Approach

The verification process will run in three main phases:
1. **Unit Tests Check**: Run the Vitest suite to ensure that all 20 tests (including `WeekdayWinRateChart.test.tsx`) pass.
2. **Build Verification**: Execute `npm run build` in the frontend directory to ensure the build bundle compiles without any TypeScript or bundler issues.
3. **Playwright E2E verification**:
   - Run the frontend dev server (`npm run dev`).
   - Open a browser page using Playwright MCP.
   - Use mock API endpoints (e.g. returning a predefined list of matches mapped to specific days) using script injection.
   - Navigate to the page, perform a search, and verify the rendered weekday sequence (Monday-Sunday).
   - Use Playwright to hover over a bar (e.g., Monday or Wednesday) to trigger and verify the tooltip content.
   - Verify empty state displays when there is no match data.
   - Capture a high-quality screenshot of the dashboard showing the chart and tooltips.
   - Document the results and embed the screenshots in a new `walkthrough.md` file.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `docs/features/weekday-win-rate-bar-chart/walkthrough.md` | Create | Confirmed | Task spec | Walkthrough report including screenshot evidence |
| `docs/features/weekday-win-rate-bar-chart/walkthrough-weekday-win-rate.png` | Create / Overwrite | Confirmed | Task spec | Screenshot of the weekday win rate bar chart with custom tooltip |
| `docs/features/weekday-win-rate-bar-chart/walkthrough-weekday-empty.png` | Create | Confirmed | Task spec | Screenshot of empty state on the weekday win rate bar chart |
| `docs/features/weekday-win-rate-bar-chart/tasks/` | Modify | Confirmed | Task spec | Mark tasks 001-002 as Done, and 999 as Implemented |
| `docs/STATE.md` | Modify | Confirmed | Harness guidelines | Mark current task status as complete |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. **Verify Unit Tests**:
   - Navigate to the frontend directory: `src/main/frontend/`
   - Run the Vitest test runner: `npm run test -- --run`
   - Confirm all 20 tests (including `WeekdayWinRateChart.test.tsx` and `DashboardContext.test.tsx`) pass successfully.

2. **Verify Production Build**:
   - Build the production bundle: `npm run build`
   - Verify that Vite and the TypeScript compiler build successfully without errors or warnings.

3. **Start Frontend Dev Server**:
   - Launch the frontend application server: `npm run dev` (run in background, noting the port, e.g. `http://localhost:5173`).

4. **Execute Playwright E2E Verification**:
   - Use the Playwright MCP server tools to initiate E2E verification:
     - **Mock Setup**: Call `browser_run_code_unsafe` to register network routing. Intercept GET requests matching `**/api/summoner/**` to return:
       - Scenario 1 (Full list): A mock profile `PlayerFull#NA1` with matches distributed over days (e.g. 3 wins, 2 losses on Monday; 0 games on Thursday; some games on other days).
       - Scenario 2 (Empty list): A mock profile `PlayerEmpty#BR1` with 0 matches.
     - **E2E Scenario 1: Weekday Chart with matches**:
       - Navigate to the landing page `http://localhost:5173/` (using `browser_navigate`).
       - Fill the search form with name `PlayerFull`, tag `NA1`, and select NA region.
       - Click the "Analyze" button.
       - Wait for the dashboard to render successfully (`data-testid="dashboard-success"`).
       - Verify that the Weekday Performance Bar Chart is visible and displays Monday through Sunday sequentially (Mon-Sun).
       - Locate the bar element for a day (e.g., Monday or Wednesday) using selectors like `.recharts-bar-rectangle` or svg shapes and hover over it (`browser_hover`).
       - Verify that the custom tooltip is displayed showing correct win rate percentage and win/loss count (`Win Rate: X% (YW - ZL)`).
       - Hover over Thursday (or a day with 0 games) and verify the tooltip displays `No games played`.
       - Take a screenshot showing the active tooltip on one of the bars and save it under `docs/features/weekday-win-rate-bar-chart/walkthrough-weekday-win-rate.png`.
     - **E2E Scenario 2: Empty state**:
       - Navigate back to the landing page `http://localhost:5173/`.
       - Search for `PlayerEmpty#BR1` with Brazil region.
       - Wait for the dashboard to load.
       - Verify that the Weekday Performance card displays the empty state message: `"No match records to display."` inside a dashed card.
       - Capture a screenshot showing the empty state card and save it under `docs/features/weekday-win-rate-bar-chart/walkthrough-weekday-empty.png`.
     - **Close Session**: Close the browser session (`browser_close`).
   - Stop the frontend dev server.

5. **Generate Walkthrough**:
   - Create `docs/features/weekday-win-rate-bar-chart/walkthrough.md`.
   - Write a summary of the verification results.
   - Embed the captured screenshots.
   - Include test run outputs and build results.

6. **Update Task States**:
   - Update statuses in `001` and `002` tasks to `Done`.
   - Update status in `999` task to `Implemented`.
   - Update `docs/features/weekday-win-rate-bar-chart/tasks/README.md` to reflect the updated statuses.
   - Update `docs/STATE.md` to indicate the feature has been successfully verified.

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| All unit and component tests run and pass. | Full | Executed Vitest test suite (`npm run test`) verifying 20/20 pass rate. |
| Application compiles and runs with no errors. | Full | Executed production build compiler (`npm run build`) with zero compiler errors. |
| Visual inspection of the dashboard shows the Weekday Win Rate Chart renders a bar chart beginning with Monday and ending with Sunday sequentially. | Full | Verified sequence layout (Monday-Sunday) in E2E browser and captured screenshot `walkthrough-weekday-win-rate.png`. |
| Hovering over a bar displays a tooltip with `Win Rate: X% (YW - ZL)` or `No games played` when there are 0 games on that day. | Full | Hovered over active/inactive bars in browser E2E session and verified tooltip text formatting; captured screenshot. |
| Searching for a player with zero matches or applying a range filter yielding zero matches displays "No match records to display." inside a dashed card. | Full | Verified dashed empty state layout and string message in E2E session; captured screenshot `walkthrough-weekday-empty.png`. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Vitest unit & component tests | Unit | Ensures component context grouping, sorting, and rounding logic is regression-free. | Executed via CLI `npm run test` |
| Vite bundle compiler | Build | Verifies TypeScript and build bundle compile cleanly. | Executed via CLI `npm run build` |
| Playwright E2E session | E2E / Manual | Validates chart rendering sequence, custom tooltips, empty states, and layout responsiveness. | Executed via Playwright MCP tools |

## Dependencies

- Previous task `001-align-sequential-day-ordering.md` must be completed and marked Implemented (Satisfied).
- Previous task `002-add-weekday-win-rate-chart-tests.md` must be completed and marked Implemented (Satisfied).

## Risks and Edge Cases

- **Vite Port Collision**: If port `5173` is busy, Vite might fall back to `5174`. *Mitigation*: Dynamically check the server console output to capture the exact URL.
- **Hover Selector Coordinates**: Recharts tooltips can sometimes be tricky to trigger in headless browsers if elements are small. *Mitigation*: Use specific class selectors (`.recharts-bar-rectangle` or `.recharts-rectangle`) or hover near the center of the bar coordinates.
- **Async API Interception**: Interception code might fail if the script is not registered before navigation. *Mitigation*: Register the routing handler using `browser_run_code_unsafe` BEFORE triggering `browser_navigate`.

## Rollback or Recovery Notes

- Since this task only validates functionality and creates documentation without modifying application source code, there is no risk of codebase regression.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

## Task Planning Readiness Checklist

- [x] Task file reviewed.
- [x] Feature context reviewed.
- [x] Feature Tech Spec coverage verified.
- [x] Technology decisions reviewed.
- [x] Applicable guidelines reviewed.
- [x] Existing decisions reviewed.
- [x] Local codebase references checked when applicable.
- [x] Task dependencies checked.
- [x] Execution eligibility documented.
- [x] Blocking decisions resolved.
- [x] Local feature/task decisions documented when needed.
- [x] Architecture/global decisions routed to ADR or `resolve-architecture-blocker` when needed.
- [x] Implementation approach defined.
- [x] Acceptance criteria mapped.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

- Run Vitest using `npm run test -- --run` to execute in single-run mode.
- Use `browser_run_code_unsafe` to mock the API endpoint route `/api/summoner/*` prior to navigating, to ensure local network requests are correctly intercepted.
- Ensure screenshots are placed under `docs/features/weekday-win-rate-bar-chart/` and referenced correctly in the walkthrough.
