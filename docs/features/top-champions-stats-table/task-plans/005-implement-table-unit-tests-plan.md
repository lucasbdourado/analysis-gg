# Task Implementation Plan: Write Vitest unit and component tests for TopChampionsTable

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/top-champions-stats-table/task-plans/005-implement-table-unit-tests-plan.md`

## Task Reference

Task ID: `005-implement-table-unit-tests`

Task file: `docs/features/top-champions-stats-table/tasks/005-implement-table-unit-tests.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `top-champions-stats-table`

Feature file: `docs/features/top-champions-stats-table/feature.md`

Feature Tech Spec: `docs/features/top-champions-stats-table/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/top-champions-stats-table/tasks/005-implement-table-unit-tests.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Scope definition |
| Feature file | `docs/features/top-champions-stats-table/feature.md` | Expected Outcome, Scope, Completion Criteria | Confirmed by source document | Functional requirements context |
| Feature Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | Proposed Technical Approach, Testing Strategy | Confirmed by source document | Technical approach details |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions, Guidelines | Confirmed by source document | Confirmed stack (Vitest + JSDOM) |

## Planning Scope

This planning session covers only Task 005: writing Vitest unit and component tests for the `TopChampionsTable` component. It does not authorize modifications to any application source code.

## Task Summary

Create a comprehensive test suite `TopChampionsTable.test.tsx` using Vitest and React Testing Library to verify that the `TopChampionsTable` component aggregates data, sorts dynamically, renders fallback portrait placeholders, displays correct styling, and handles empty states safely.

## Execution Eligibility

Status: Eligible

Reason:
- The dependency task `004-update-table-styling.md` is completed and implemented as verified by the presence of `docs/features/top-champions-stats-table/executions/004-update-table-styling-execution.md` on the filesystem.

## Feature Context

The `TopChampionsTable` aggregates user match summaries per champion. The component requires thorough testing of its UI rendering, interactive column header clicks, Data Dragon image error handling, and visual formatting rules (perfect KDA, high win rates) to ensure reliable analytics presentation.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes | Defines metrics calculations (Win Rate, KDA, CS/min, Perfect KDA, sorting helpers, CDN URLs, image fallbacks, default sorting priority). |
| Testing Strategy | Full | Yes | Mentions testing data aggregation, default sorting, perfect KDA rendering, header interaction, fallback images, and aesthetics. |
| State and Error Handling | Full | Yes | Defines empty state ("No champion statistics to display.") and asset load error fallback behaviors. |

Coverage assessment:
- Justifying Tech Spec section: `## Proposed Technical Approach` and `## Testing Strategy`.
- Tech Spec sections implemented by this task: All sections relating to sorting, aggregation math, asset fallback rendering, and testing.
- Gaps between task and Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Frontend Language: React (Vite + TS) | `technology-definition.md` | Test file must be written in TypeScript (`.test.tsx`). |
| UI Styling: Vanilla CSS | `technology-definition.md` | Verify application of CSS module classes (e.g. `highWinRate` for win rate >= 60%). |
| State Management: Context API & useState | `technology-definition.md` | Mock the `useDashboard` hook to return custom matches lists. |
| Testing Framework: Vitest + React Testing Library | `technology-definition.md` | Write test cases using Vitest (`describe`, `it`, `vi`, `expect`) and render with `@testing-library/react`. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React clean coding guidelines - Testing | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Component tests | Guides component testing rules: test observable behavior, mock context hooks near the tests, avoid fragile snapshots, use accessibility-friendly selectors. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Top Champions Stats Table Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | Details default sorting priorities, Perfect KDA formatting, CS/min calculations, and circular fallback logic. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Aggregation logic, CSS module imports, fallback element classes | Confirms how columns sort, state definitions, classes like `highWinRate`, fallback test-id, and Data Dragon URLs. | Target component for the test suite. |
| `src/main/frontend/src/features/dashboard/presentation/components/DailyPerformanceGrid.test.tsx` | `vi.mock` structure for `useDashboard` and context | Serves as reference code for implementing dashboard context mocks. | Working example test file. |
| `src/main/frontend/src/features/dashboard/domain/MatchSummary.ts` | MatchSummary data structure | Guides the creation of typed mock data objects inside the tests. | Contract file. |

## Confirmed Scope

- Mock the `useDashboard` hook.
- Implement tests verifying:
  - **Data Aggregation**: wins, losses, win rates, KDA, and CS/min are aggregated correctly.
  - **Default Sorting**: initial rendering defaults to sorting by winRate descending, then gamesPlayed descending, then championName ascending.
  - **Perfect KDA**: if a champion has 0 deaths, KDA is formatted as "Perfect (K/0.0/A)", and they sort correctly descending.
  - **Interactive Sorting**: clicking column headers ("Champion", "Played", "Win Rate", "KDA", "CS/min") updates sorting direction and changes rows ordering.
  - **Image Fallback**: triggering `onError` on the champion portrait img loads the circular fallback container.
  - **Empty State**: rendering when `filteredMatches` is empty displays "No champion statistics to display." instead of the table.
  - **Aesthetics**: checking that a champion with win rate >= 60% receives the high win-rate accent styling.

## Out of Scope

- Modifying `TopChampionsTable.tsx` or its CSS file.
- Writing Java backend tests or Cypress end-to-end browser tests.

## Proposed Implementation Approach

1. Use `vi.mock` to mock `../context/DashboardContext` and control the return value of `useDashboard`.
2. Construct a helper `createMockMatch` that accepts variables like `championName`, `win`, `kills`, `deaths`, `assists`, `gameDuration` and returns a typed `MatchSummary`.
3. Use `@testing-library/react`'s `render` to mount the component, and check elements using `screen`.
4. Trigger header clicks using `fireEvent.click`.
5. Trigger image load errors using `fireEvent.error` on the image elements.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.test.tsx` | Create | Confirmed | Task document | Main output of this task |

## Implementation Steps

1. Create the new file `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.test.tsx`.
2. Write import statements: `render`, `screen`, `fireEvent` from `@testing-library/react`; `describe`, `it`, `expect`, `vi` from `vitest`; `TopChampionsTable` component; `useDashboard` hook.
3. Call `vi.mock('../context/DashboardContext', ...)` to mock the context hook.
4. Add the `createMockMatch` helper.
5. Write the following test cases in a `describe` block:
   - "should render empty state when no matches are provided"
   - "should aggregate stats correctly (win rate, KDA, CS/min)"
   - "should format perfect KDA correctly when deaths are 0"
   - "should sort by winRate desc, then gamesPlayed desc, then championName asc by default"
   - "should sort interactively when clicking column headers"
   - "should render fallback circular placeholder on image error"
   - "should apply high win rate style if win rate is >= 60%"
6. Execute Vitest tests using `npx vitest run` or `npm run test` (via the terminal when executing) to verify correctness.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| All tests pass when running the Vitest runner | Setup test runner execution | Console outputs showing all test cases passed. |
| Mock matches cover varied cases (0 deaths, 0 duration, tie-breakers, empty list) | Written mock data inputs in respective test suites | Verified calculations for Perfect KDA, 0-duration CS/min, winRate tie-breaking, and empty states. |
| Interactive header clicks are correctly simulated, asserting the change in row order | `fireEvent.click` on headers, mapping row text values | Assertions verifying updated order of rows in the table. |
| Portrait `onError` handler is triggered in a test, confirming the render of the fallback letter | Trigger `fireEvent.error(img)` | Asserts presence of fallback circular element displaying the first letter. |
| Test coverage covers all branches of the aggregation and sorting logic | Write robust assertions covering asc/desc toggles, secondary sorting priority, and edge cases | High test coverage reported by test outcomes. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Vitest component test execution | Unit / Component | Run and verify the new `TopChampionsTable.test.tsx` suite. | Confirms correctness of all test definitions. |

## Dependencies

- Task `004-update-table-styling.md` (Already completed).

## Risks and Edge Cases

- **Ties in sorting**: Sorting logic in `TopChampionsTable.tsx` handles ties by using secondary sorting (played desc) and tertiary sorting (champion name asc). The tests must explicitly include data sets with equal win rates or equal KDA scores to verify this behavior.
- **Perfect KDA value math**: If deaths is 0, the numeric sorting helper value `kdaValue` equals `kills + assists`. The test suite must mock multiple perfect KDA champions to assert they sort correctly against each other (e.g. 5/0/5 with value 10 vs 2/0/2 with value 4).

## Rollback or Recovery Notes

- Deleting `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.test.tsx` completely restores the codebase to its original state.

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

- Ensure `vi.mocked(useDashboard).mockReturnValue` is properly configured inside each test case to avoid state leakage or pollution.
- To simulate clicks on table headers, fetch the `th` tags or their text wrappers and use `fireEvent.click`.
- Remember to run `npm run test` or `npx vitest run` in the terminal to verify the tests execute successfully.
